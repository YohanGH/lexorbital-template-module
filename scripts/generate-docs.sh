#!/bin/bash

# Script to generate documentation using pandoc
# Usage: ./scripts/generate-docs.sh [format]
# Formats: pdf, html, epub (default: pdf)

set -e

FORMAT="${1:-pdf}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
DOCS_DIR="$PROJECT_ROOT/docs"
OUTPUT_DIR="$DOCS_DIR/generated"

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📚 Generating documentation in ${FORMAT} format...${NC}"

# Function to convert a markdown file
convert_file() {
    local input_file="$1"
    local relative_path="${input_file#$DOCS_DIR/}"
    local base_name="${relative_path%.md}"
    local output_file="$OUTPUT_DIR/${base_name}.${FORMAT}"
    local template_path="docs/templates/custom.html"
    local css_path="docs/templates/pandoc-styles.html"
    
    # Create subdirectories in output if needed
    local output_dir=$(dirname "$output_file")
    mkdir -p "$output_dir"
    
    echo -e "${GREEN}Converting: ${relative_path} → ${base_name}.${FORMAT}${NC}"
    
    # Build docker command with base arguments
    local docker_args=(
        --rm
        --volume "$PROJECT_ROOT:/data"
        --workdir /data
        --user "$(id -u):$(id -g)"
        pandoc/latex
        "docs/${relative_path}"
        -o "docs/generated/${base_name}.${FORMAT}"
        --standalone
        --toc
        --toc-depth=3
        --metadata "title=LexOrbital Documentation - $(basename "$base_name")"
    )
    
    # Add template and CSS for HTML format
    if [ "$FORMAT" = "html" ]; then
        if [ -f "$PROJECT_ROOT/$template_path" ]; then
            docker_args+=(--template="$template_path")
        fi
        if [ -f "$PROJECT_ROOT/$css_path" ]; then
            docker_args+=(-H "$css_path")
        fi
    fi
    
    docker run "${docker_args[@]}"
}

# Find all markdown files in docs directory (excluding generated folder)
find "$DOCS_DIR" -name "*.md" -not -path "$OUTPUT_DIR/*" | while read -r file; do
    convert_file "$file"
done

echo -e "${GREEN}✅ Documentation generated successfully in ${OUTPUT_DIR}${NC}"

