#!/bin/bash
# =============================================================================
# LexOrbital Module Template Documentation Generation Script
# Automatically generates HTML, PDF, DOCX from Markdown files
# =============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOCS_DIR="docs"
OUTPUT_DIR="docs/generated"
TEMPLATE_DIR="docs/templates"

# Color output functions
print_status() {
  echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
  echo -e "${GREEN}[✓]${NC} $1"
}

print_error() {
  echo -e "${RED}[✗]${NC} $1"
}

print_warning() {
  echo -e "${YELLOW}[!]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
  print_error "Docker is not installed. Installation required:"
  echo "  - macOS: https://www.docker.com/products/docker-desktop"
  echo "  - Ubuntu: sudo apt install docker.io"
  echo "  - Windows: https://www.docker.com/products/docker-desktop"
  exit 1
fi

# Check if Docker image pandoc/latex exists
if ! docker image inspect pandoc/latex &> /dev/null; then
  print_status "Downloading Docker image pandoc/latex..."
  docker pull pandoc/latex
fi

# Get absolute project path
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

print_status "🛰️  Generating LexOrbital Module Template documentation"
echo ""

# Create output directory if it doesn't exist
mkdir -p "$PROJECT_ROOT/$OUTPUT_DIR"

# =============================================================================
# 1. Main HTML generation (index.html)
# =============================================================================
print_status "Generating main HTML file (index.html)..."

# Check if files exist
if [ ! -f "$PROJECT_ROOT/$DOCS_DIR/README.md" ]; then
  print_error "README.md not found in docs/"
  exit 1
fi

# Find all numbered sheets (excluding FR/)
SHEETS=$(find "$PROJECT_ROOT/$DOCS_DIR" -maxdepth 1 -name "[0-9][0-9]_*.md" -type f | sort)

if [ -z "$SHEETS" ]; then
  print_warning "No numbered sheets found (format: NN_*.md)"
fi

# Check if template exists
if [ ! -f "$PROJECT_ROOT/$TEMPLATE_DIR/lexorbital.html" ]; then
  print_error "Template not found: $TEMPLATE_DIR/lexorbital.html"
  exit 1
fi

# Check CSS (pandoc.css or pandoc-styles.html)
CSS_FILE=""
CSS_FLAG=""
if [ -f "$PROJECT_ROOT/$TEMPLATE_DIR/pandoc.css" ]; then
  CSS_FILE="docs/templates/pandoc.css"
  CSS_FLAG="--css"
elif [ -f "$PROJECT_ROOT/$TEMPLATE_DIR/pandoc-styles.html" ]; then
  CSS_FILE="docs/templates/pandoc-styles.html"
  CSS_FLAG="-H"
else
  print_warning "No CSS file found (pandoc.css or pandoc-styles.html)"
fi

# Build Docker + Pandoc command
DOCKER_ARGS=(
  --rm
  --volume "$PROJECT_ROOT:/data"
  --workdir /data
  --user "$(id -u):$(id -g)"
  pandoc/latex
)

# Build Pandoc arguments
PANDOC_ARGS=(
  -s
  --toc
  --toc-depth=2
  --template="docs/templates/lexorbital.html"
)

if [ -n "$CSS_FILE" ]; then
  PANDOC_ARGS+=($CSS_FLAG "$CSS_FILE")
fi

PANDOC_ARGS+=(
  --metadata "title=LexOrbital Module Template Guide"
  --metadata "subtitle=Complete guide for module development"
  --metadata "author=LexOrbital Core Team"
  --metadata "date=$(date '+%d %B %Y')"
  -o "docs/generated/index.html"
  "docs/README.md"
)

# Add numbered sheets (relative paths from /data)
for sheet in $SHEETS; do
  relative_sheet="${sheet#$PROJECT_ROOT/}"
  PANDOC_ARGS+=("$relative_sheet")
done

# Execute Docker command
print_status "Executing Pandoc command via Docker..."
docker run "${DOCKER_ARGS[@]}" "${PANDOC_ARGS[@]}"

if [ $? -eq 0 ]; then
  print_success "HTML generated: docs/generated/index.html"
else
  print_error "HTML generation failed"
  exit 1
fi

# =============================================================================
# 2. DOCX generation (Microsoft Word)
# =============================================================================
print_status "Generating DOCX file..."

DOCX_ARGS=(
  -s
  --toc
  --toc-depth=2
  --metadata "title=LexOrbital Module Template Guide"
  --metadata "subtitle=Complete guide for module development"
  -o "docs/generated/LexOrbital_Module_Guide.docx"
  "docs/README.md"
)

for sheet in $SHEETS; do
  relative_sheet="${sheet#$PROJECT_ROOT/}"
  DOCX_ARGS+=("$relative_sheet")
done

docker run "${DOCKER_ARGS[@]}" "${DOCX_ARGS[@]}"

if [ $? -eq 0 ]; then
  print_success "DOCX generated: docs/generated/LexOrbital_Module_Guide.docx"
else
  print_error "DOCX generation failed"
fi

# =============================================================================
# 3. PDF generation (via LaTeX)
# =============================================================================
print_status "Generating PDF file..."

PDF_ARGS=(
  -s
  --toc
  --toc-depth=2
  --pdf-engine=xelatex
  -V "geometry:margin=1in"
  -V "documentclass=report"
  -V "colorlinks=true"
  -V "linkcolor=blue"
  -V "urlcolor=blue"
  -V "toccolor=blue"
  --metadata "title=LexOrbital Module Template Guide"
  --metadata "subtitle=Complete guide for module development"
  --metadata "author=LexOrbital Core Team"
  --metadata "date=$(date '+%d %B %Y')"
  -o "docs/generated/LexOrbital_Module_Guide.pdf"
  "docs/README.md"
)

for sheet in $SHEETS; do
  relative_sheet="${sheet#$PROJECT_ROOT/}"
  PDF_ARGS+=("$relative_sheet")
done

docker run "${DOCKER_ARGS[@]}" "${PDF_ARGS[@]}"

if [ $? -eq 0 ]; then
  print_success "PDF generated: docs/generated/LexOrbital_Module_Guide.pdf"
else
  print_error "PDF generation failed"
fi

# =============================================================================
# Summary
# =============================================================================
echo ""
print_success "✨ Documentation generated successfully!"
echo ""
echo "Generated files in ${OUTPUT_DIR}/ :"
echo "  - index.html  (Complete HTML guide)"
echo "  - LexOrbital_Module_Guide.docx  (Complete Word guide)"
if [ -f "$PROJECT_ROOT/$OUTPUT_DIR/LexOrbital_Module_Guide.pdf" ]; then
  echo "  - LexOrbital_Module_Guide.pdf   (Complete PDF guide)"
fi
echo ""
print_status "Open documentation:"
echo "  open $PROJECT_ROOT/$OUTPUT_DIR/index.html"
echo ""
