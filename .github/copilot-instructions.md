# Tiger Linear MCP Server - GitHub Copilot Instructions

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the information here.

## Working with Submodule Limitations

### What Works WITHOUT the Submodule

- **Code Editing**: All TypeScript files can be edited and analyzed
- **Prettier Formatting**: `npx prettier --write .` works correctly
- **TypeScript Type Checking**: Individual files can be type-checked with `npx tsc --noEmit --skipLibCheck <file>`
- **Code Navigation**: Understanding project structure and dependencies
- **Documentation**: Reading and understanding the codebase

### What REQUIRES the Submodule

- **Building**: `npm run build` and `npm install` will fail
- **Running**: All `npm start` commands will fail
- **Testing**: MCP Inspector cannot be used without a working build
- **Docker**: Container builds will fail during npm install phase
- **Development**: Watch mode and development servers won't work

### Workaround Development Strategy

If submodule access is not available:

1. Focus on editing core business logic in `src/apis/`, `src/utils/`
2. Review and understand existing code patterns
3. Write new API endpoints following the `getIssue.ts` pattern
4. Use TypeScript language server for type checking individual files
5. Plan and document changes until submodule access is granted

## Working Effectively

### Repository Setup

- **CRITICAL**: Initialize git submodules FIRST before any other operations:

  ```bash
  git submodule update --init --recursive
  ```

  - If submodule clone fails with SSH errors, configure git to use HTTPS:
    ```bash
    git config url."https://github.com/".insteadOf git@github.com:
    git submodule sync
    git submodule update --init --recursive
    ```
  - **KNOWN LIMITATION**: The `src/shared/boilerplate` submodule (`timescale/mcp-boilerplate-node`) may be private/inaccessible.
  - **IF SUBMODULE FAILS**: Build, run, and Docker operations will NOT work without the submodule. Request access to the private repository or wait for it to be made public.
  - **TIMING**: Submodule initialization takes 10-30 seconds when successful. NEVER CANCEL.

### Environment Setup

- Create environment file from sample:
  ```bash
  cp .env.sample .env
  ```
- **REQUIRED**: Set LINEAR_API_KEY in .env file:
  ```
  LINEAR_API_KEY=lin_api_your_actual_token_here
  ```
- Optional telemetry variables (LOGFIRE_TOKEN, OTEL_SERVICE_NAME) can be left as placeholders for local development.

### Build and Development

- Install dependencies and build:

  ```bash
  npm install
  ```

  - **TIMING**: npm install takes 30-60 seconds. NEVER CANCEL.
  - The `prepare` script automatically runs `npm run build` during install.
  - **TIMING**: Build takes 30-60 seconds. NEVER CANCEL.
  - Set timeout to 120+ seconds for npm install to avoid premature cancellation.

- Development with auto-rebuild:

  ```bash
  npm run watch
  ```

  - **TIMING**: Watch mode starts in 5-10 seconds and runs continuously.
  - Rebuilds automatically on file changes in ~2-5 seconds per change.

### Running the Server

- **STDIO Mode** (for MCP clients like Claude Desktop):

  ```bash
  npm run start
  # or
  node dist/index.js stdio
  ```

- **HTTP Mode** (for HTTP API testing):

  ```bash
  npm run start:http
  # or
  node dist/index.js http
  ```

- **Development HTTP Mode** with auto-restart:
  ```bash
  npm run watch:http
  ```

### Testing and Validation

#### MCP Inspector Testing

- **ALWAYS** test MCP functionality using the official inspector:
  ```bash
  npm run inspector
  # or
  npx @modelcontextprotocol/inspector
  ```
- **Inspector Configuration**:
  - Transport Type: `STDIO`
  - Command: `node`
  - Arguments: `dist/index.js`
  - **CRITICAL**: Ensure LINEAR_API_KEY is set in environment before running inspector.

#### Claude Desktop Integration Testing

- Create/edit `~/Library/Application Support/Claude/claude_desktop_config.json`:
  ```json
  {
    "mcpServers": {
      "tiger-linear": {
        "command": "node",
        "args": [
          "/absolute/path/to/tiger-linear-mcp-server/dist/index.js",
          "stdio"
        ],
        "env": {
          "LINEAR_API_KEY": "lin_api_your_actual_token_here"
        }
      }
    }
  }
  ```
- **CRITICAL**: Use absolute paths in the configuration.
- Restart Claude Desktop after configuration changes.

#### Manual Validation Scenarios

- **ALWAYS** perform these validation steps after making changes:
  1. **Build Validation**: Ensure `npm run build` completes without errors.
  2. **Server Start**: Verify server starts with `npm run start` and shows no immediate errors.
  3. **MCP Inspector**: Test tool availability and basic functionality through inspector.
  4. **Linear API Integration**: If you have a valid Linear API token, test the `getIssue` endpoint with a real issue key.

### Code Quality and CI/CD

#### Formatting and Linting

- **ALWAYS** run these before committing changes:
  ```bash
  npx prettier --write .
  ```
- The repository uses Prettier with these settings:
  - Single quotes, 2-space tabs, trailing commas
  - 80 character line width, arrow parentheses always

#### GitHub Actions

- **Build Pipeline**: Automatically triggered on all push events
- **TIMING**: Docker build takes 3-5 minutes. NEVER CANCEL GitHub Actions.
- **Deploy Pipeline**: Automatically deploys to dev environment on main branch merges
- **TIMING**: Full deploy pipeline takes 10-15 minutes including build and Helm deployment.

## Code Structure and Navigation

### Key Directories

- **`src/`**: All TypeScript source code
- **`src/apis/`**: MCP tool implementations (currently `getIssue.ts`)
- **`src/utils/`**: Utility functions for Linear API object manipulation
- **`src/shared/boilerplate/`**: Git submodule with shared MCP server framework
- **`chart/`**: Kubernetes Helm chart for deployment
- **`dist/`**: Compiled JavaScript output (generated by build)

### Important Files

- **`src/index.ts`**: Main entry point and CLI argument handler
- **`src/stdio.ts`**: STDIO transport server implementation
- **`src/httpServer.ts`**: HTTP transport server implementation
- **`src/serverInfo.ts`**: Server configuration and Linear client setup
- **`src/types.ts`**: TypeScript type definitions
- **`package.json`**: Dependencies and npm scripts
- **`.env.sample`**: Environment variable template

### Adding New MCP Tools

1. Create new file in `src/apis/` following the pattern of `getIssue.ts`
2. Import and add to `apiFactories` array in `src/apis/index.ts`
3. Follow zod schema patterns for input validation
4. Use the `ServerContext` type to access the Linear client
5. **ALWAYS** add proper TypeScript types and error handling

### Debugging and Development Tips

- **Environment Variables**: Check `src/serverInfo.ts` for required env vars
- **Linear API**: Uses `@linear/sdk` - reference their documentation for API methods
- **MCP Protocol**: Uses `@modelcontextprotocol/sdk` for server implementation
- **Error Logs**: Check console output when running in stdio mode
- **HTTP Debugging**: Use HTTP mode for easier debugging with curl/Postman

## Common Issues and Solutions

### Build Failures

- **Submodule Missing**: Run `git submodule update --init --recursive`
- **Node Version**: Ensure Node.js 18+ is installed (project uses Node 22 in Docker, tested with Node 20+)
- **TypeScript Errors**: Check that all imports use `.js` extensions as required by ES modules
- **npm install fails**: Likely due to missing submodule - resolve submodule access first

### Runtime Issues

- **LINEAR_API_KEY Missing**: Server will fail to start without valid Linear API token
- **Permission Errors**: Ensure `dist/*.js` files are executable (handled by build script)
- **MCP Connection**: Verify STDIO mode is working with MCP Inspector before testing in Claude

### Development Workflow

- **ALWAYS** use `npm run watch` during development for auto-rebuild
- **ALWAYS** test changes with MCP Inspector before integration testing
- **ALWAYS** validate Linear API integration with real issue keys when possible
- Use HTTP mode (`npm run start:http`) for easier debugging during development

## Deployment and Production

### Docker Build

- Uses Node.js 22 Alpine Linux base image
- Multi-stage build for optimized production image
- Runs in HTTP mode by default in containerized environment
- **TIMING**: Local Docker build takes 3-5 minutes when submodule is available. NEVER CANCEL.
- **CRITICAL**: Docker build will FAIL without the submodule due to npm install failing during build process.

### Kubernetes Deployment

- Managed via Helm charts in `chart/` directory
- Deployed to `savannah-system` namespace
- Requires sealed secrets for Linear API key and logging tokens
- **TIMING**: Helm deployment takes 2-5 minutes. NEVER CANCEL.

## Additional Notes

- This is a TypeScript/Node.js project using ES modules
- Follows strict TypeScript configuration with Node16 module resolution
- Uses OpenTelemetry for observability (optional for local development)
- Integrates with Logfire for logging (optional for local development)
- **CRITICAL**: Always ensure the git submodule is properly initialized before any development work
