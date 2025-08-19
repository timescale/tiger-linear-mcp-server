# Tiger Linear MCP Server - Development Guidelines

## Build, Test & Run Commands

- Build: `npm run build` - Compiles TypeScript to JavaScript
- Watch mode: `npm run watch` - Watches for changes and rebuilds automatically
- Run server: `npm run start` - Starts the MCP server using stdio transport
- Prepare release: `npm run prepare` - Builds the project for publishing
- Lint: `npm run lint` - Runs ESLint to check code quality
- Lint Fix: `npm run lint:fix` - Runs ESLint with automatic fixing
- Lint Check: `npm run lint:check` - Runs ESLint with zero warnings allowed

## Code Style Guidelines

- Use ES modules with `.js` extension in import paths
- Strictly type all functions and variables with TypeScript
- Follow zod schema patterns for tool input validation
- Prefer async/await over callbacks and Promise chains
- Place all imports at top of file, grouped by external then internal
- Use descriptive variable names that clearly indicate purpose
- Implement proper cleanup for timers and resources in server shutdown
- Follow camelCase for variables/functions, PascalCase for types/classes, UPPER_CASE for constants
- Handle errors with try/catch blocks and provide clear error messages
- Use consistent indentation (2 spaces) and trailing commas in multi-line objects

## Linting

This project uses ESLint for code linting with TypeScript support. The configuration enforces:

- TypeScript best practices and type safety
- Import/export ordering and module resolution
- Async/await patterns over promises
- Consistent naming conventions
- Integration with Prettier for formatting

ESLint is configured to work with the project's ES module setup and `.js` extension requirements for imports.
