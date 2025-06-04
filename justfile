set export

PNR := "pnpm run"
PNX := "pnpm exec"

# List available commands
default:
    just --list --unsorted

# Run dev server
dev:
    {{ PNR }} dev

# Build project
build-dev:
    {{ PNR }} build:dev

# Lint project
lint:
    {{ PNR }} lint

# Format code
format:
    {{ PNR }} format

# Check code formatting
format-check:
    {{ PNR }} format:check

# Run quality checks
quality: lint format-check

# Install dependencies
install-modules:
    #!/bin/zsh

    . ~/.zshrc || true

    echo "Y" | pnpm i

# Bootstrap project
bootstrap: install-node enable-corepack install-modules

# Set up dev container. This step runs after building the dev container
[linux]
post-dev-container-create:
    just .devcontainer/post-create
    just bootstrap

# Bootstrap for CI
[linux]
bootstrap-ci: install-zsh enable-corepack install-modules

[private]
[linux]
install-zsh:
    sudo apt-get update
    sudo apt-get install -y zsh

[private]
install-node:
    #!/bin/zsh

    curl -fsSL https://fnm.vercel.app/install | bash

    # fnm
    FNM_PATH="/root/.local/share/fnm"
    if [ -d "$FNM_PATH" ]
    then
        export PATH="$FNM_PATH:$PATH"
        eval "`fnm env`"
    fi

    . ~/.zshrc

    fnm completions --shell zsh
    fnm install

[private]
enable-corepack:
    #!/bin/zsh

    . ~/.zshrc

    corepack enable
