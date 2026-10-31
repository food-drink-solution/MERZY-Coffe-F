# Security Policy

Security guidelines, best practices, and procedures for MERZY.

## Table of Contents

1. [Reporting Vulnerabilities](#reporting-vulnerabilities)
2. [Security Best Practices](#security-best-practices)
3. [Data Protection](#data-protection)
4. [Authentication & Authorization](#authentication--authorization)
5. [API Security](#api-security)
6. [Frontend Security](#frontend-security)
7. [Infrastructure Security](#infrastructure-security)
8. [Incident Response](#incident-response)

## Reporting Vulnerabilities

### Responsible Disclosure

If you discover a security vulnerability, please:

1. **DO NOT** open a public issue
2. **DO NOT** share details publicly
3. **Email** security@merzy.coffee with:
   - Vulnerability description
   - Steps to reproduce
   - Potential impact
   - Suggested fix (optional)

### Response Timeline

- **Initial Response**: Within 24 hours
- **Investigation**: Within 5 days
- **Fix/Patch**: Within 30 days
- **Public Disclosure**: After patch is released

### Security Contact

**Email**: security@merzy.coffee  
**GPG Key**: Available upon request  
**Response Language**: English

## Security Best Practices

### Code Security

#### Input Validation
```typescript
// ✅ Good: Validate all inputs
function createOrder(data: any) {
  const schema = {
    items: Joi.array().required(),
    total: Joi.number().positive().required(),
    email: Joi.string().email().required()
  };
  const { error, value } = schema.validate(data);
  if (error) throw new Error('Invalid input');
  return value;
}

// ❌ Bad: No validation
function createOrder(data: any) {
  return db.insert(data);
}
```

#### SQL Injection Prevention
```typescript
// ✅ Good: Parameterized queries
const user = await db.query('SELECT * FROM users WHERE id = ?', [userId]);

// ❌ Bad: String concatenation
const user = await db.query(`SELECT * FROM users WHERE id = ${userId}`);
```

#### XSS Prevention
```typescript
// ✅ Good: Sanitize HTML
import DOMPurify from 'dompurify';
const safe = DOMPurify.sanitize(userContent);

// ❌ Bad: Direct innerHTML
element.innerHTML = userContent;
```

#### CSRF Protection
```typescript
// ✅ Good: Use CSRF tokens
const token = generateCSRFToken();
// Include in form: <input name="_csrf" value={token} />

// ❌ Bad: No CSRF protection
form.submit();
```

### Dependency Security

```bash
# Check for vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Update dependencies
npm update

# Use exact versions (no ^, ~)
npm install --save-exact package@1.2.3
```

### Secrets Management

```bash
# ✅ Good: Use environment variables
const dbPassword = process.env.DB_PASSWORD;

# ❌ Bad: Hardcode secrets
const dbPassword = 'super-secret-123';
```

#### Never Commit
- `.env` files
- API keys or tokens
- Database passwords
- Private encryption keys
- OAuth credentials

#### Safe Alternatives
- Use `.env.example` with placeholder values
- Store secrets in environment variables
- Use secret management services (AWS Secrets Manager, HashiCorp Vault)

## Data Protection

### Encryption at Rest

```typescript
import crypto from 'crypto';

// Encrypt sensitive data before storing
function encryptData(data: string, key: string): string {
  const cipher = crypto.createCipher('aes-256-cbc', key);
  let encrypted = cipher.update(data);
  encrypted += cipher.final('hex');
  return encrypted;
}

// Decrypt when needed
function decryptData(encrypted: string, key: string): string {
  const decipher = crypto.createDecipher('aes-256-cbc', key);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
```

### Encryption in Transit

All data must be encrypted in transit:

```nginx
# ✅ Good: HTTPS required
server {
    listen 443 ssl http2;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
}

# ❌ Bad: HTTP
server {
    listen 80;
}
```

### Data Minimization

Collect only necessary data:
- Name, email, phone
- Delivery address
- Payment method (tokenized)
- Order history

Don't collect:
- Social security numbers
- Passwords (hash instead)
- Payment card numbers (use third-party processor)

### Data Retention

- **Orders**: 7 years (legal requirement)
- **Customer data**: 2 years after last order
- **Logs**: 30 days
- **Backups**: 90 days

Delete expired data automatically:
```sql
DELETE FROM orders WHERE created_at < NOW() - INTERVAL '7 years';
DELETE FROM customers WHERE last_order < NOW() - INTERVAL '2 years';
```

## Authentication & Authorization

### Password Security

```typescript
import bcrypt from 'bcrypt';

// Hash passwords
async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// Verify passwords
async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Requirements
// - Minimum 8 characters
// - Mix of uppercase, lowercase, numbers, special characters
// - No common passwords (validate against list)
// - Rate limit login attempts (5 tries per 15 minutes)
```

### Session Management

```typescript
// ✅ Good: Secure session tokens
const session = {
  id: generateRandomToken(32),
  userId: user.id,
  expiresAt: Date.now() + 3600000, // 1 hour
  httpOnly: true,
  secure: true,
  sameSite: 'Strict'
};

// ❌ Bad: Insecure session
const session = {
  userId: user.id  // Guessable
};
```

### JWT Security

```typescript
import jwt from 'jsonwebtoken';

// Create JWT with short expiry
const token = jwt.sign(
  { userId: user.id },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);

// Verify JWT
jwt.verify(token, process.env.JWT_SECRET);

// Always use HTTPS for transmission
// Store in httpOnly cookie or memory (never localStorage)
```

### Multi-Factor Authentication

```typescript
// Require 2FA for sensitive operations
function requireMFA(req, res, next) {
  if (!req.user.mfaEnabled) {
    return res.status(403).json({ error: 'MFA required' });
  }
  const mfaToken = generateOTP();
  sendOTPvia2FA(req.user, mfaToken);
  next();
}
```

## API Security

### Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later'
});

app.use('/api/', limiter);
```

### CORS Configuration

```typescript
// ✅ Good: Restrict CORS
app.use(cors({
  origin: 'https://merzy.coffee',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ❌ Bad: Allow all origins
app.use(cors());
```

### HTTP Security Headers

```typescript
app.use(helmet());
// Sets:
// - Content-Security-Policy
// - X-Frame-Options
// - X-Content-Type-Options
// - X-XSS-Protection
// - Strict-Transport-Security
```

### API Versioning

```
/api/v1/orders   # Current version
/api/v2/orders   # New version
```

Never break existing API versions. Support multiple versions during transition.

### Request Validation

```typescript
const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  phone: Joi.string().pattern(/^\d{11}$/).required()
});

app.post('/login', (req, res) => {
  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details });
  // Process...
});
```

## Frontend Security

### Content Security Policy

```html
<!-- Prevent inline scripts and unauthorized resources -->
<meta http-equiv="Content-Security-Policy" 
  content="default-src 'self'; 
           script-src 'self' cdn.jsdelivr.net;
           style-src 'self' 'unsafe-inline';
           img-src 'self' data: https:;">
```

### XSS Prevention

```typescript
// Angular auto-escapes by default
<div>{{ userContent }}</div>  // ✅ Safe

// Only use [innerHTML] with sanitized content
<div [innerHTML]="sanitize(userContent)"></div>
```

### Secure Dependencies

Regularly audit dependencies:
```bash
npm audit --audit-level=moderate
npm outdated
```

Remove unused dependencies:
```bash
npm prune
```

## Infrastructure Security

### Environment Variables

Never expose sensitive variables:

```bash
# ✅ Good: Load from environment
DATABASE_URL=${DB_URL}
JWT_SECRET=${JWT_SECRET}

# ❌ Bad: Hardcoded values
DATABASE_URL=postgres://user:pass@localhost/db
JWT_SECRET=mysecret123
```

### Network Security

- Use VPC for database servers
- Whitelist IP addresses
- Use firewall rules
- Implement network segmentation
- Enable DDoS protection

### Server Hardening

```bash
# Update system packages
sudo apt-get update && sudo apt-get upgrade

# Disable unnecessary services
sudo systemctl disable telnet

# Configure firewall
sudo ufw enable
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443

# Secure SSH
sudo sed -i 's/#PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
```

### Database Security

```sql
-- Create minimal privileges user
CREATE USER merzy_app WITH PASSWORD 'strong-random-password';
GRANT SELECT, INSERT, UPDATE ON orders TO merzy_app;
GRANT SELECT ON users TO merzy_app;

-- Revoke unnecessary privileges
REVOKE ALL ON schema public FROM public;

-- Enable audit logging
ALTER SYSTEM SET log_statement = 'all';
```

### Backup Security

- Encrypt backups
- Store off-site
- Test restore procedures
- Limit access to backup storage
- Document recovery procedures

## Incident Response

### Discovery

1. Identify the vulnerability/breach
2. Document evidence
3. Assess scope and severity
4. Determine affected users/data

### Containment

1. Isolate affected systems
2. Stop ongoing attacks
3. Preserve logs for investigation
4. Notify security team immediately

### Investigation

1. Determine root cause
2. Identify extent of exposure
3. Preserve evidence
4. Document timeline

### Remediation

1. Develop fix/patch
2. Test thoroughly
3. Apply to all systems
4. Verify resolution

### Communication

1. Notify affected users (if required)
2. Provide clear, honest information
3. Outline steps taken
4. Offer protection services
5. Update status page

### Post-Incident

1. Conduct post-mortem
2. Document lessons learned
3. Implement preventive measures
4. Update security policies
5. Brief stakeholders

## Compliance

### GDPR

- User right to access data
- Right to be forgotten
- Data portability
- Breach notification (72 hours)
- Privacy policy required

### CCPA

- Consumer right to know
- Right to delete
- Right to opt-out
- Non-discrimination

### PCI DSS (if accepting cards)

- Don't store card numbers
- Use PCI-compliant payment processor
- Encrypt sensitive data
- Regular security testing

## Testing & Audit

### Regular Security Audits

```bash
# Dependency scanning
npm audit
snyk test

# Code scanning
eslint --ext .ts,.tsx src/

# SAST (Static Application Security Testing)
sonarqube

# DAST (Dynamic Application Security Testing)
owasp-zap

# Penetration Testing
# Quarterly with professional security firm
```

### Security Checklist

- [ ] Dependencies updated
- [ ] No hardcoded secrets
- [ ] HTTPS enabled
- [ ] Rate limiting active
- [ ] Input validation working
- [ ] Logs monitored
- [ ] Backups secured
- [ ] Access controls enforced
- [ ] Security headers present
- [ ] Audit trail maintained

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

---

**Last Updated**: October 31, 2026  
**Version**: 1.0.0  
**Reviewed by**: Security Team
