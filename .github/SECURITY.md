# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in MERZY, please report it privately to the repository maintainers instead of using the issue tracker.

Please include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We will acknowledge your email within 48 hours and provide a more detailed response within 5 business days.

## Security Best Practices

### For Users

1. **Keep dependencies updated**
   ```bash
   npm update
   ```

2. **Use HTTPS**
   - Always use HTTPS in production
   - Enable HSTS headers

3. **Validate input**
   - Never trust user input
   - Sanitize data

4. **Secure secrets**
   - Never commit secrets
   - Use environment variables
   - Use .env files (not in git)

### For Contributors

1. **Code Review**
   - All code must be reviewed
   - Security-focused reviews
   - Automated checks required

2. **Dependencies**
   - Keep dependencies updated
   - Review new dependencies
   - Check for vulnerabilities

3. **Testing**
   - Write security tests
   - Test edge cases
   - Verify error handling

## Vulnerability Disclosure

We follow responsible disclosure practices:

1. **Report privately** - Email security details
2. **Acknowledge** - We'll confirm receipt
3. **Investigate** - We'll assess the issue
4. **Fix** - We'll develop a patch
5. **Release** - We'll publish the fix
6. **Credit** - We'll acknowledge the reporter

## Security Updates

- Critical: Released immediately
- High: Released within 1 week
- Medium: Released within 2 weeks
- Low: Released with next version

## Supported Versions

| Version | Status | Support Until |
|---------|--------|---------------|
| 1.x     | Active | Current       |

## Dependencies

We use:
- Angular 18 (LTS)
- Tailwind CSS 3
- PrimeNG 18
- TypeScript 5

All dependencies are regularly updated and scanned for vulnerabilities.

## Security Headers

Recommended headers for production:

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
```

## Contact

- Security contact: Use the repository's private reporting channel
- Repository: Use the project URL shown in the repository settings

---

Thank you for helping keep MERZY secure.
