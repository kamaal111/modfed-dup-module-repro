# Modfed Dup Module Repro

## Project Setup

This project is designed to be run within a development container. The dev container environment includes all necessary dependencies and configurations, ensuring a consistent and reproducible setup.

**Prerequisites:**

- Docker Desktop: Ensure Docker Desktop is installed and running on your host machine.
- VS Code Dev Containers extension: Install the "Dev Containers" extension in VS Code (ID: `ms-vscode-remote.remote-containers`).

**Steps:**

1.  **Clone the repository:**
    ```bash
    git clone git@github.com:kamaal111/modfed-dup-module-repro.git
    cd modfed-dup-module-repro
    ```
2.  **Open in Dev Container:**
    - Open the cloned repository folder in VS Code.
    - VS Code should automatically detect the `.devcontainer` configuration and prompt you to "Reopen in Container". Click this button.
    - If you don't see the prompt, open the command palette (Ctrl+Shift+P or Cmd+Shift+P) and run the "Dev Containers: Reopen in Container" command.
3.  **Post-Container Creation Setup:**

    - Once the dev container is built and started, the `post-dev-container-create` script defined in the root `justfile` will automatically run. This script handles:
      - Running `.devcontainer/post-create` (if it exists).
      - Bootstrapping the project by running `just bootstrap`.
    - The `just bootstrap` command performs the following:
      - `install-node`: Installs Node.js using `fnm` (Fast Node Manager).
      - `enable-corepack`: Enables Corepack for managing package managers like pnpm.
      - `install-modules`: Installs project dependencies using `pnpm i`.
      - It then recursively runs the `bootstrap` command for the `host`, `app1`, and `app2` applications. The specific bootstrap steps for these sub-projects are defined in their respective `justfile`s (e.g., `apps/host/justfile`).

4.  **Running the applications:**
    - To run a specific application in development mode, use the `just dev <app-name>` command from the root directory. For example:
      - `just dev host`
      - `just dev app1`
      - `just dev app2`
    - This command will trigger the `dev` script in the respective application\'s `justfile`, which in turn runs the command `pnpm run dev`.
    - After running an application, you can access it in your web browser at `http://localhost:3000`.

## Development Workflow

- **Linting:** Run `just lint` from the root directory.
- **Formatting:** Run `just format` to format the code or `just format:check` to check formatting.
- **Quality Checks:** Run `just quality` to perform both linting and format checking.
