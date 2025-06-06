# Module Federation Duplicate React Issue Reproduction

This repository demonstrates a specific issue with Module Federation where React singleton sharing optimization is bypassed when a microfrontend has a `uniqueName` defined in its webpack output configuration, causing the wrong application to fetch the React bundle instead of the host application.

- [Module Federation Duplicate React Issue Reproduction](#module-federation-duplicate-react-issue-reproduction)
  - [Issue Description](#issue-description)
  - [Project Setup](#project-setup)
  - [Reproduction Steps](#reproduction-steps)
  - [Expected vs Actual Behavior](#expected-vs-actual-behavior)
    - [Expected Behavior](#expected-behavior)
    - [Actual Behavior](#actual-behavior)
    - [Key Difference](#key-difference)

## Issue Description

**Problem**: When a Module Federation microfrontend has a `uniqueName` specified in its webpack output configuration and attempts to share React as a singleton, the React bundle is fetched by the wrong application (the microfrontend) instead of being fetched by the host application as intended. While this doesn't cause functional failures, it disrupts the expected singleton sharing behavior and can impact bundle optimization strategies.

**Key Finding**: The issue only occurs when the microfrontend has a `uniqueName` defined. When the `uniqueName` is removed, React singleton sharing works correctly.

**Setup in this reproduction**:

- **Host Application**: Serves as the main container that loads microfrontends
- **App1**: Microfrontend without `uniqueName` - **works correctly**
- **App2**: Microfrontend with `uniqueName: 'app2-unique-unique'` - **exhibits the issue**

Both microfrontends are configured to share React as a singleton, but only App2 successfully uses the shared React instance.

## Project Setup

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
      - Installing Node.js via fnm (Fast Node Manager)
      - Enabling corepack for package manager management
      - Installing dependencies for all applications
      - Bootstrapping all applications

4.  **Running the applications:**
    - To run a specific application in development mode, use the `just dev <app-name>` command from the root directory. For example:
      - `just dev host` (runs on http://localhost:3000)
      - `just dev app1` (runs on http://localhost:3001)
      - `just dev app2` (runs on http://localhost:3002)
    - This command will trigger the `dev` script in the respective application's `justfile`, which in turn runs the command `pnpm run dev`.

## Reproduction Steps

1. **Start all applications in separate terminals:**

   ```bash
   # Terminal 1 - Host application
   just dev host

   # Terminal 2 - App1 (without uniqueName)
   just dev app1

   # Terminal 3 - App2 (with uniqueName)
   just dev app2
   ```

2. **Open the host application:**

   - Navigate to `http://localhost:3000` in your browser
   - The host application loads both App1 and App2 as microfrontends

3. **Inspect React bundle fetching:**

   - Open browser developer tools
   - Monitor network requests to see which application is fetching the React bundle
   - Check bundle sizes in the Network tab to observe the React JavaScript being downloaded
   - Note which port/application the React bundle request originates from
   - Use React Developer Tools extension to inspect React instances (optional)
   - Check the console for any React-related warnings or errors (optional)

4. **Compare webpack configurations:**
   - **App1 webpack config** (`apps/app1/webpack.config.ts`): No `uniqueName` specified
   - Both apps have identical Module Federation shared configuration: `shared: { react: { singleton: true }, 'react-dom': { singleton: true } }`
   - **App2 webpack config** (`apps/app2/webpack.config.ts`): Contains `uniqueName: 'app2-unique-unique'`

## Expected vs Actual Behavior

### Expected Behavior

- Both App1 and App2 should use the shared React instance from the host application
- Only one React bundle should be loaded across all applications
- No React-related warnings or errors in the console
- React Developer Tools should show a single React instance

### Actual Behavior

- **App1 (with uniqueName)**: Fetches the React bundle itself instead of using the React bundle from the host application
- **App2 (without uniqueName)**: Correctly allows the host application to fetch and provide the shared React instance
- The React bundle request comes from the wrong application when App1 is present
- Bundle optimization strategy is disrupted as the intended provider (host) doesn't fetch React
- Network requests show React being fetched by the microfrontend instead of the host application

### Key Difference

The presence of `uniqueName: 'app2-unique-unique'` in App1's webpack output configuration prevents the Module Federation singleton sharing mechanism from working correctly for React, while App2 (without uniqueName) shares React properly.
