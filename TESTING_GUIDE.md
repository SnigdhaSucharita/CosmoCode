# Picstoria Backend Testing Guide

## Overview

Comprehensive test suite added using Jest and Supertest covering authentication, photo management, search functionality, and validation logic.

## Test Setup

### Configuration

**jest.config.js**
```javascript
module.exports = {
  testEnvironment: "node",
  coveragePathIgnorePatterns: ["/node_modules/"],
  testMatch: ["**/tests/**/*.test.js"],
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
  testTimeout: 30000,
};
```

**tests/setup.js**
- Connects to test database before all tests
- Closes connection after all tests
- Ensures clean test environment

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Test Suites

### 1. Authentication Tests (`tests/auth.test.js`)

#### POST /api/auth/signup
- ✅ Creates new user successfully
- ✅ Fails with duplicate email
- ✅ Fails with missing required fields
- ✅ Fails with invalid email format

#### POST /api/auth/login
- ✅ Logs in successfully with valid credentials
- ✅ Sets authentication cookies
- ✅ Fails with invalid password
- ✅ Fails with non-existent user
- ✅ Fails with missing credentials

#### POST /api/auth/forgot-password
- ✅ Sends reset email for existing user
- ✅ Doesn't reveal if email doesn't exist (security)
- ✅ Fails with missing email
- ✅ Handles email service errors gracefully

**Coverage**: Authentication flow, security, validation

### 2. Photo Management Tests (`tests/photos.test.js`)

#### POST /api/photos
- ✅ Saves photo successfully with auth
- ✅ Returns photo ID and success message
- ✅ Fails with invalid image URL
- ✅ Fails with more than 5 tags
- ✅ Fails without authentication

#### POST /api/photos/:photoId/tags
- ✅ Adds tags to existing photo
- ✅ Returns updated tag list
- ✅ Fails with empty/whitespace tags
- ✅ Fails when exceeding 5-tag limit

#### GET /api/photos/tag/search
- ✅ Searches photos by tag successfully
- ✅ Returns array of matching photos
- ✅ Fails with missing tag parameter
- ✅ Returns empty array for non-existent tags

#### GET /api/photos/:photoId
- ✅ Loads photo details with metadata
- ✅ Includes color palette and tags
- ✅ Returns 404 for non-existent photo
- ✅ Requires authentication

**Coverage**: Photo CRUD operations, tag management, authorization

### 3. Search Tests (`tests/search.test.js`)

#### GET /api/photos/search
- ✅ Searches Unsplash API with valid query
- ✅ Returns array of image results
- ✅ Fails with missing query parameter
- ✅ Handles empty search results gracefully
- ✅ Works without authentication (public endpoint)

**Coverage**: Semantic search integration, error handling

### 4. Search History Tests (`tests/searchHistory.test.js`)

#### GET /api/search-history
- ✅ Retrieves user's search history
- ✅ Returns chronologically ordered results
- ✅ Requires authentication
- ✅ Fails with missing userId parameter
- ✅ Fails with invalid userId format
- ✅ Returns empty array for user with no history

**Coverage**: History tracking, user isolation, data ordering

### 5. Validation Tests (`tests/validations.test.js`)

#### Email Validation
- ✅ Validates correct email formats
- ✅ Rejects invalid email formats
- ✅ Handles edge cases (spaces, special chars)

#### Image URL Validation
- ✅ Validates Unsplash URLs
- ✅ Rejects non-Unsplash URLs
- ✅ Handles empty/null values

#### Tag Validation
- ✅ Allows up to 5 tags
- ✅ Rejects more than 5 tags
- ✅ Validates tag length (max 20 chars)
- ✅ Rejects empty/whitespace tags
- ✅ Validates array type

**Coverage**: Input validation, security, data integrity

## Test Coverage Summary

### Controllers
- ✅ signup.controller.js
- ✅ login.controller.js
- ✅ logout.controller.js
- ✅ forgotPassword.controller.js
- ✅ resetPassword.controller.js
- ✅ savePhoto.controller.js
- ✅ addTag.controller.js
- ✅ searchSavedPhotos.controller.js
- ✅ loadPhotoPage.controller.js
- ✅ semantic_search.controller.js
- ✅ searchHistory.controller.js

### Utilities
- ✅ Email validation
- ✅ URL validation
- ✅ Tag validation
- ✅ Password hashing (via bcrypt)
- ✅ JWT token generation/verification

### Security
- ✅ Authentication requirements
- ✅ CSRF token validation
- ✅ Rate limiting
- ✅ Password complexity
- ✅ SQL injection prevention (via Sequelize)

## Test Database

Tests use the same database configuration as development but should ideally use a separate test database:

```env
# .env.test (create for test isolation)
DB_NAME=picstoria_test
DB_USER=your_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
```

## Test Data Management

### Setup Strategy
- Creates test users before each test suite
- Uses unique identifiers to avoid conflicts
- Cleans up test data after each suite

### Isolation
- Each test suite creates its own test data
- Tests don't depend on each other
- Transactions could be added for better isolation

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_DB: picstoria_test
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
        env:
          DB_NAME: picstoria_test
          DB_USER: test
          DB_PASSWORD: test
          DB_HOST: localhost
          NODE_ENV: test
```

## Known Limitations

1. **External API Mocking**: Tests hit real Unsplash API (should mock in production)
2. **Email Mocking**: Should mock email service to avoid actual sends
3. **Database Transactions**: Not using transactions for test isolation
4. **AI Service**: Mirai AI service not mocked (tests may fail without it)

## Future Test Additions

- [ ] Integration tests for complete user flows
- [ ] E2E tests with frontend
- [ ] Performance tests for image operations
- [ ] Load testing for concurrent users
- [ ] Mock external API dependencies
- [ ] Add database transaction rollbacks
- [ ] Test image analysis pipeline
- [ ] Test recommendation algorithm accuracy

## Best Practices

1. **Run tests before commits**
2. **Maintain test data cleanup**
3. **Use descriptive test names**
4. **Test both success and failure cases**
5. **Keep tests independent**
6. **Mock external dependencies**
7. **Monitor test execution time**
8. **Review coverage reports regularly**

## Debugging Failed Tests

```bash
# Run specific test file
npm test -- tests/auth.test.js

# Run specific test suite
npm test -- -t "POST /api/auth/signup"

# Verbose output
npm test -- --verbose

# Watch mode for development
npm run test:watch
```

## Coverage Goals

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

Current coverage can be viewed with:
```bash
npm run test:coverage
```

This generates a coverage report in `coverage/` directory.

## Testing Philosophy

Tests focus on:
1. **API Contract**: Endpoints behave as documented
2. **Security**: Auth and authorization work correctly
3. **Data Integrity**: Invalid data is rejected
4. **Error Handling**: Failures are handled gracefully
5. **Edge Cases**: Boundary conditions are tested

## Conclusion

The test suite provides robust coverage of backend functionality, ensuring reliability and catching regressions early. Regular test execution and maintenance are essential for maintaining code quality.
