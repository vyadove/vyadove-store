# Create Payload App

CLI for easily starting new Payload project

## Usage

```text

  USAGE

      $ npx create-shopnex-app
      $ npx create-shopnex-app my-project
      $ npx create-shopnex-app -n my-project -t simple-shop

  OPTIONS

      -n     my-shopnex-app         Set project name
      -t     template_name          Choose specific template

        Available templates:

        blank                       Blank Template
        website                     Website Template
        ecommerce                   E-commerce Template
        plugin                      Template for creating a Payload plugin
        payload-demo                Payload demo site at https://demo.payloadcms.com
        payload-website             Payload website CMS at https://payloadcms.com

      --use-npm                     Use npm to install dependencies
      --use-yarn                    Use yarn to install dependencies
      --use-pnpm                    Use pnpm to install dependencies
      --no-deps                     Do not install any dependencies
      -h                            Show help
```

## Testing

This package includes several testing scripts to ensure the CLI works correctly:

### Unit Tests

```bash
npm test
```

Runs the Jest test suite for individual functions and modules. This includes:
- Testing project creation with local templates
- Validating package.json updates and dependency management
- Testing database configuration for MongoDB and SQLite
- Verifying payload config modifications
- Testing environment file management

### Simple Functionality Test

```bash
npm run test:simple
```

This test verifies core functionality by:
- Loading and validating templates
- Creating a project with the local template
- Checking that essential files are created (package.json, payload.config.ts, .env)
- Verifying package.json is updated with the correct project name
- Ensuring environment variables are properly set

### E2E Testing

```bash
npm run test:e2e
```

This test runs the full CLI workflow including:
- Building the project
- Testing with local template
- Testing with remote template download (when possible)
- Validating the complete project creation process

## Recent Fixes

### Issue: Path Resolution and Template Download
- **Problem**: The CLI was looking for package.json in the wrong directory and templates weren't being downloaded correctly
- **Solution**: Fixed template name mapping and download URL generation to match the actual repository structure
- **Changes Made**:
  - Updated template name from "Simple Shop" to "simple-shop" to match directory structure
  - Fixed download filter to use correct repository path structure
  - Updated tests to use available templates instead of missing ones
