# Testing Guidelines

Every LexOrbital module must include comprehensive tests to ensure reliability and maintainability.

## Required Tests

Each module should test:

1. **Healthcheck** — Validates the module can start and respond
   - For backend modules: HTTP health endpoint
   - For frontend modules: Component rendering
   - For infrastructure modules: Service availability

2. **Functional Behavior** — Tests at least one core feature
   - Main functionality works as expected
   - Edge cases are handled
   - Error conditions are managed

## Recommended Tools

### Unit Testing

- **Vitest** — Fast unit testing (included in template)
- **Jest** — Alternative unit testing framework

### Backend HTTP Modules

- **Supertest** — HTTP assertion library for API testing

### Frontend UI Modules

- **React Testing Library** — Component testing for React
- **Vitest** — Component unit tests

## Commands

```bash
# Run tests
pnpm test

# Watch mode
pnpm run test:ui

# Coverage report
pnpm run coverage
```

## Test Structure

Organize tests in the `tests/` directory:

```
tests/
  ├── healthcheck.test.ts
  ├── functional.test.ts
  └── unit/
      └── ...
```

## Best Practices

- Write tests before or alongside code (TDD)
- Keep tests isolated and independent
- Use descriptive test names
- Mock external dependencies
- Test both success and failure paths
- Aim for high code coverage (>80%)

## CI Integration

Tests run automatically in CI. The build will fail if:

- Tests don't pass
- Coverage drops below threshold (if configured)
- Type errors are present
