# Fiche n°4 : Tests et qualité {#fiche-4-tests-qualite}

## 1. Objectif de la fiche

Définir les standards de tests obligatoires et recommandés pour les modules LexOrbital, avec les outils, patterns et métriques à respecter.

## 2. Tests obligatoires

### 2.1. Test de healthcheck (MANDATORY)

**Objectif** : Valider que le module peut démarrer et répondre.

#### Pour modules backend (HTTP)

```typescript
// tests/healthcheck.test.ts
import { describe, it, expect, beforeAll, afterAll } from "vitest"
import request from "supertest"
import { app } from "../src/app"

describe("Healthcheck", () => {
  let server: any

  beforeAll(async () => {
    server = app.listen(3000)
  })

  afterAll(async () => {
    server.close()
  })

  it("should return 200 OK on /health", async () => {
    const response = await request(app).get("/health")
    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      status: "ok",
      timestamp: expect.any(Number),
    })
  })
})
```

#### Pour modules frontend (Component)

```typescript
// tests/healthcheck.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from '../src/App';

describe('App Component', () => {
  it('should render without crashing', () => {
    render(<App />);
    expect(screen.getByTestId('app-container')).toBeInTheDocument();
  });
});
```

#### Pour modules infrastructure

```typescript
// tests/healthcheck.test.ts
import { describe, it, expect } from "vitest"
import { initModule } from "../src/index"

describe("Module Initialization", () => {
  it("should initialize without errors", async () => {
    await expect(initModule()).resolves.not.toThrow()
  })
})
```

### 2.2. Test fonctionnel (MANDATORY)

**Objectif** : Tester au moins **une fonctionnalité principale** du module.

#### Exemple : Module d'authentification

```typescript
// tests/functional/auth.test.ts
import { describe, it, expect, beforeEach } from "vitest"
import { AuthService } from "../src/services/auth.service"

describe("AuthService", () => {
  let authService: AuthService

  beforeEach(() => {
    authService = new AuthService({
      jwtSecret: "test-secret",
      jwtExpiry: "1h",
    })
  })

  it("should authenticate valid user", async () => {
    const token = await authService.login("user@example.com", "password123")
    expect(token).toBeDefined()
    expect(typeof token).toBe("string")
  })

  it("should reject invalid credentials", async () => {
    await expect(authService.login("user@example.com", "wrong-password")).rejects.toThrow("Invalid credentials")
  })

  it("should verify valid token", async () => {
    const token = await authService.login("user@example.com", "password123")
    const payload = await authService.verifyToken(token)
    expect(payload.email).toBe("user@example.com")
  })
})
```

#### Exemple : Module de gestion de dossiers

```typescript
// tests/functional/dossiers.test.ts
import { describe, it, expect } from "vitest"
import { DossiersService } from "../src/services/dossiers.service"

describe("DossiersService", () => {
  let service: DossiersService

  beforeEach(() => {
    service = new DossiersService()
  })

  it("should create a new dossier", async () => {
    const dossier = await service.create({
      title: "Test Dossier",
      clientId: "123",
    })

    expect(dossier.id).toBeDefined()
    expect(dossier.title).toBe("Test Dossier")
  })

  it("should retrieve dossier by ID", async () => {
    const created = await service.create({ title: "Test", clientId: "123" })
    const retrieved = await service.findById(created.id)
    expect(retrieved).toEqual(created)
  })
})
```

## 3. Types de tests recommandés

### 3.1. Tests unitaires

**Objectif** : Tester des fonctions/classes isolées.

**Outil** : Vitest

**Structure** :

```
tests/
└── unit/
    ├── services/
    │   └── my-service.test.ts
    ├── utils/
    │   └── helpers.test.ts
    └── models/
        └── user.test.ts
```

**Exemple** :

```typescript
// tests/unit/utils/helpers.test.ts
import { describe, it, expect } from "vitest"
import { formatDate, calculateAge } from "../../src/utils/helpers"

describe("Helpers", () => {
  describe("formatDate", () => {
    it("should format date to ISO string", () => {
      const date = new Date("2025-11-22")
      expect(formatDate(date)).toBe("2025-11-22")
    })
  })

  describe("calculateAge", () => {
    it("should calculate age from birthdate", () => {
      const birthdate = new Date("2000-01-01")
      const age = calculateAge(birthdate)
      expect(age).toBeGreaterThanOrEqual(24)
    })
  })
})
```

### 3.2. Tests d'intégration

**Objectif** : Tester l'interaction entre plusieurs composants.

**Structure** :

```
tests/
└── integration/
    ├── api.test.ts
    └── database.test.ts
```

**Exemple** :

```typescript
// tests/integration/api.test.ts
import { describe, it, expect, beforeAll, afterAll } from "vitest"
import request from "supertest"
import { app } from "../../src/app"
import { db } from "../../src/database"

describe("API Integration", () => {
  beforeAll(async () => {
    await db.connect()
  })

  afterAll(async () => {
    await db.disconnect()
  })

  it("should create and retrieve a user", async () => {
    // Create
    const createResponse = await request(app).post("/api/users").send({ name: "John Doe", email: "john@example.com" })
    expect(createResponse.status).toBe(201)

    // Retrieve
    const userId = createResponse.body.id
    const getResponse = await request(app).get(`/api/users/${userId}`)
    expect(getResponse.status).toBe(200)
    expect(getResponse.body.name).toBe("John Doe")
  })
})
```

### 3.3. Tests E2E (End-to-End)

**Objectif** : Tester des workflows complets utilisateur.

**Outil** : Playwright (frontend) ou Supertest + seed data (backend)

**Structure** :

```
tests/
└── e2e/
    ├── auth-flow.test.ts
    └── dossier-workflow.test.ts
```

**Exemple** :

```typescript
// tests/e2e/auth-flow.test.ts
import { describe, it, expect } from "vitest"
import request from "supertest"
import { app } from "../../src/app"

describe("Authentication Flow (E2E)", () => {
  it("should complete full auth flow", async () => {
    // 1. Register
    const registerResponse = await request(app).post("/auth/register").send({ email: "user@example.com", password: "password123" })
    expect(registerResponse.status).toBe(201)

    // 2. Login
    const loginResponse = await request(app).post("/auth/login").send({ email: "user@example.com", password: "password123" })
    expect(loginResponse.status).toBe(200)
    const { token } = loginResponse.body

    // 3. Access protected route
    const protectedResponse = await request(app).get("/api/profile").set("Authorization", `Bearer ${token}`)
    expect(protectedResponse.status).toBe(200)
    expect(protectedResponse.body.email).toBe("user@example.com")

    // 4. Logout
    const logoutResponse = await request(app).post("/auth/logout").set("Authorization", `Bearer ${token}`)
    expect(logoutResponse.status).toBe(200)
  })
})
```

## 4. Outils de test

### 4.1. Vitest (obligatoire)

**Installation** :

```bash
pnpm add -D vitest
```

**Configuration : `vitest.config.ts`**

**Scripts `package.json`** :

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "coverage": "vitest run --coverage"
  }
}
```

### 4.2. Supertest (modules backend HTTP)

**Installation** :

```bash
pnpm add -D supertest @types/supertest
```

**Usage** :

```typescript
import request from "supertest"
import { app } from "../src/app"

await request(app).get("/api/users").expect(200)
```

### 4.3. React Testing Library (modules frontend)

**Installation** :

```bash
pnpm add -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

**Usage** :

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { LoginForm } from '../src/components/LoginForm';

test('should submit form', () => {
  render(<LoginForm />);
  const input = screen.getByLabelText('Email');
  fireEvent.change(input, { target: { value: 'user@example.com' } });
  // ...
});
```

## 5. Couverture de tests

### 5.1. Objectifs de couverture

| Métrique       | Objectif | Minimum acceptable |
| -------------- | -------- | ------------------ |
| **Lines**      | ≥80%     | ≥70%               |
| **Functions**  | ≥80%     | ≥70%               |
| **Branches**   | ≥75%     | ≥65%               |
| **Statements** | ≥80%     | ≥70%               |

### 5.2. Générer le rapport de couverture

```bash
pnpm run coverage
```

**Sortie** :

```
---------------------------|---------|----------|---------|---------|
File                       | % Stmts | % Branch | % Funcs | % Lines |
---------------------------|---------|----------|---------|---------|
All files                  |   85.2  |   78.5   |   82.1  |   85.2  |
 src/services              |   92.3  |   85.7   |   90.0  |   92.3  |
  auth.service.ts          |   95.0  |   88.0   |   92.0  |   95.0  |
 src/utils                 |   78.5  |   70.0   |   75.0  |   78.5  |
  helpers.ts               |   78.5  |   70.0   |   75.0  |   78.5  |
---------------------------|---------|----------|---------|---------|
```

### 5.3. Afficher le rapport HTML

```bash
open coverage/index.html  # macOS
xdg-open coverage/index.html  # Linux
```

## 6. Patterns de test

### 6.1. AAA Pattern (Arrange, Act, Assert)

```typescript
it("should calculate total price", () => {
  // Arrange
  const cart = new ShoppingCart()
  cart.addItem({ name: "Book", price: 10 })
  cart.addItem({ name: "Pen", price: 2 })

  // Act
  const total = cart.getTotal()

  // Assert
  expect(total).toBe(12)
})
```

### 6.2. Mocking avec Vitest

```typescript
import { describe, it, expect, vi } from "vitest"
import { EmailService } from "../src/services/email.service"
import { UserService } from "../src/services/user.service"

describe("UserService", () => {
  it("should send welcome email on user creation", async () => {
    // Mock du service email
    const emailService = {
      send: vi.fn(),
    } as any

    const userService = new UserService(emailService)

    await userService.create({ email: "user@example.com", name: "John" })

    expect(emailService.send).toHaveBeenCalledWith({
      to: "user@example.com",
      subject: "Welcome!",
    })
  })
})
```

### 6.3. Test fixtures

```typescript
// tests/fixtures/users.ts
export const mockUsers = [
  { id: "1", name: "Alice", email: "alice@example.com" },
  { id: "2", name: "Bob", email: "bob@example.com" },
]

// Dans les tests
import { mockUsers } from "../fixtures/users"

it("should list all users", () => {
  const users = service.getAll()
  expect(users).toEqual(mockUsers)
})
```

## 7. Quality gates

### 7.1. Pre-commit

Avant chaque commit, Husky + lint-staged vérifient :

- ✅ Code lint-free (ESLint)
- ✅ Code formaté (Prettier)

### 7.2. Branch protection

GitHub branch protection rules :

- ✅ CI must pass avant merge
- ✅ Au moins 1 review required
- ✅ No force push
- ✅ Linear history

## 8. Checklist de tests

Pour qu'un module soit conforme :

- [ ] Au moins 1 test de healthcheck
- [ ] Au moins 1 test fonctionnel
- [ ] Tests unitaires pour les services principaux
- [ ] Couverture ≥70% (objectif 80%)
- [ ] Tous les tests passent localement (`pnpm test`)
- [ ] Tests passent dans la CI
- [ ] Pas de `it.skip` ou `it.only` en production
- [ ] Fixtures/mocks organisés proprement
