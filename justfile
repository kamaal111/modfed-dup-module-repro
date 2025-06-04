set export

PNR := "pnpm run"

# List available commands
default:
    just --list --unsorted

# Run dev server for app
dev app:
    just apps/{{ app }}/dev

# Build project for app
build-dev app:
    just apps/{{ app }}/build-dev

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
    just apps/host/bootstrap

# Set up dev container. This step runs after building the dev container
[linux]
post-dev-container-create:
    just .devcontainer/post-create
    just bootstrap

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
