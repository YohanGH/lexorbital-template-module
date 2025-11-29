# .husky/common.sh
# Shared utilities for Git hooks

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Workaround for Windows 10, Git Bash, and Yarn
# Ensures interactive input works correctly
if command_exists winpty && test -t 1; then
  exec < /dev/tty 2>/dev/null || true
fi

# Workaround for some WSL2 environments
# Ensures interactive input works correctly
if [ -t 1 ]; then
  exec < /dev/tty 2>/dev/null || true
fi
