# Security Policy - E-Storefront Mobile

## Reporting Vulnerabilities

If you discover a security vulnerability, please email **security@3asoftwares.com**.

**DO NOT** create a public GitHub issue for security vulnerabilities.

### Response Timeline

| Phase              | Timeline |
| ------------------ | -------- |
| Acknowledgment     | 24 hours |
| Initial Assessment | 48 hours |
| Fix Release        | 30 days  |

## Security Measures

See [docs/SECURITY.md](./docs/SECURITY.md) for detailed security practices.

### Key Security Features

- **Secure Storage**: Expo SecureStore for tokens
- **HTTPS Only**: All API communication encrypted
- **Input Validation**: Client and server-side validation
- **Token Management**: JWT with refresh token rotation

## Supported Versions

| Version | Supported |
| ------- | --------- |
| 1.x.x   | ✅ Yes    |
| < 1.0.0 | ❌ No     |
