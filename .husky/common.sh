# .husky/common.sh

command_exists () {
  command -v "$1" >/dev/null 2>&1
}

# Workaround for Windows 10, Git Bash, and Yarn
if command_exists winpty && test -t 1; then
  exec < /dev/tty
fi

# Workaround for some WSL2 environments
if [ -t 1 ]; then
  exec < /dev/tty
fi
