# Playwright TypeScript Test Project

This project demonstrates automated testing using Playwright with TypeScript.

## Prerequisites

- Node.js (Latest LTS version recommended)
- npm (comes with Node.js)

## Setup

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

## Project Structure

```
playwright-ts-project/
├── tests/              # Test files directory
├── playwright.config.ts # Playwright configuration
└── package.json        # Project dependencies and scripts
```

## Configuration

The project uses:

- TypeScript for writing tests
- Playwright Test for running tests
- Prettier for code formatting
- GitHub Actions Reporter for CI integration

## Running Tests

Run all tests:

```bash
npm test
```

## Development

Format code using Prettier:

```bash
npm run format
```

## Test Configuration

Key features in `playwright.config.ts`:

- Runs tests in Chromium
- Takes screenshots only on failure in CI
- Configures viewport size to 1440x1024
- Sets appropriate timeouts for actions and tests
- Enables parallel test execution with 2 workers

## CI Integration

The project includes GitHub Actions reporter configuration for better test results visualization in CI environment.

## Additional Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
