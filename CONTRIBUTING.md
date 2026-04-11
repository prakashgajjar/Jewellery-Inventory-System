# Contributing Guide

## Getting Started

1. Clone the repository
2. Follow the [Local Development Setup](./DEPLOYMENT.md#local-development-setup) guide
3. Create a new branch for your feature: `git checkout -b feature/your-feature`
4. Make your changes
5. Commit with clear messages: `git commit -m "Add your message"`
6. Push to branch: `git push origin feature/your-feature`
7. Create a Pull Request

## Code Style

### Backend (Java)

- Use meaningful variable names
- Follow Google Java Style Guide
- Add comments for complex logic
- Write unit tests for new features
- Maximum line length: 100 characters

### Frontend (React/JavaScript)

- Use ES6+ features
- Follow Airbnb JavaScript Style Guide
- Use meaningful component names
- Add PropTypes for components
- Write JSDoc comments for functions
- Maximum line length: 100 characters

## Commit Messages

Format: `[TYPE] Brief description`

Types:
- `[FEAT]` - New feature
- `[BUG]` - Bug fix
- `[CHORE]` - Maintenance
- `[DOCS]` - Documentation
- `[STYLE]` - Code style
- `[TEST]` - Tests

Example:
```
[FEAT] Add low stock alert notifications
[BUG] Fix JWT token expiration issue
[DOCS] Update database schema documentation
```

## Testing

### Backend

```bash
cd backend
mvn test
```

### Frontend

```bash
cd frontend
npm test
```

## Pull Request Process

1. Update documentation if needed
2. Add tests for new features
3. Ensure all tests pass
4. Update CHANGELOG.md
5. Request review from maintainers
6. Address feedback
7. Merge after approval

## Reporting Issues

Include:
- Clear title
- Detailed description
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Screenshots if applicable
- Environment info

## Feature Requests

- Provide clear use case
- Explain why it's useful
- Suggest implementation if possible
- Link related issues

## Code Review Guidelines

- Check for code quality
- Verify tests are adequate
- Ensure documentation is complete
- Look for security issues
- Suggest improvements

## Performance Considerations

- Minimize database queries
- Avoid unnecessary re-renders
- Use pagination for large datasets
- Cache frequently accessed data
- Profile before optimizing

## Security

- Never commit secrets/credentials
- Use parameterized queries
- Validate user input
- Sanitize output
- Keep dependencies updated
- Report security issues privately

## Documentation

Update docs when:
- Adding new features
- Changing APIs
- Fixing bugs that weren't obvious
- Improving existing documentation

## Development Setup Tips

- Use IDE with Prettier/Formatter
- Enable ESLint for JavaScript
- Use debugger for troubleshooting
- Keep local DB fresh with latest schema
- Clear browser cache during testing

## Common Issues

### Backend won't start
- Check MySQL is running
- Verify database exists
- Check port 8080 is available

### Frontend build fails
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear npm cache: `npm cache clean --force`
- Check Node version: `node --version`

### API requests failing
- Check CORS settings
- Verify backend is running
- Check network tab in DevTools
- Verify JWT token is valid

## Questions?

- Open an issue for bugs
- Open a discussion for questions
- Check existing issues first
- Read documentation before asking

Thank you for contributing! 🎉
