# Deployment Guide

Instructions for deploying MERZY to production environments.

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Frontend Deployment](#frontend-deployment)
3. [Backend Deployment](#backend-deployment)
4. [Database Setup](#database-setup)
5. [Environment Variables](#environment-variables)
6. [SSL/TLS Configuration](#ssltls-configuration)
7. [Monitoring & Logging](#monitoring--logging)
8. [Rollback Procedures](#rollback-procedures)
9. [Post-Deployment](#post-deployment)

## Pre-Deployment Checklist

### Code Quality
- [ ] All tests passing locally
- [ ] No console errors or warnings
- [ ] Code linting passes
- [ ] TypeScript strict mode enabled
- [ ] No hardcoded secrets or credentials

### Performance
- [ ] Frontend bundle < 500KB (gzipped)
- [ ] API response time < 200ms
- [ ] Database queries optimized
- [ ] Images optimized and cached

### Security
- [ ] Secrets removed from repository
- [ ] Environment variables configured
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation implemented
- [ ] SQL injection prevention in place

### Documentation
- [ ] README.md up to date
- [ ] CHANGELOG.md updated
- [ ] Deployment notes documented
- [ ] Troubleshooting guide current

### Infrastructure
- [ ] Hosting account ready
- [ ] Database provisioned
- [ ] Domain registered
- [ ] SSL certificate ready
- [ ] Email service configured

## Frontend Deployment

### Build for Production

```bash
cd frontend/MERZY-Coffe
npm run build
```

This creates optimized build in `dist/merzy/`

### Build Output
```
dist/merzy/
├── index.html
├── styles.css
├── main.js
├── polyfills.js
└── assets/
    ├── images/
    └── fonts/
```

### Deploy to Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize project (if first time)
firebase init hosting

# Deploy
firebase deploy --only hosting
```

### Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist/merzy
```

### Deploy to AWS S3 + CloudFront

```bash
# Build
npm run build

# Sync to S3
aws s3 sync dist/merzy/ s3://your-bucket-name --delete

# Invalidate CloudFront
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

### Deploy to Docker

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist/merzy ./public
EXPOSE 3000
CMD ["serve", "-s", "public", "-l", "3000"]
```

Build and deploy:
```bash
docker build -t merzy-frontend .
docker tag merzy-frontend:latest your-registry/merzy-frontend:1.0.0
docker push your-registry/merzy-frontend:1.0.0
```

## Backend Deployment

### Build for Production

```bash
cd api-server
npm ci
npm run build
```

### Environment Setup

Create `.env.production`:
```env
NODE_ENV=production
PORT=4000
DATABASE_URL=postgresql://user:pass@db-host:5432/merzy
JWT_SECRET=your-secret-key-here
CORS_ORIGIN=https://merzy.coffee
LOG_LEVEL=info
```

### Deploy to Heroku

```bash
# Create Heroku app
heroku create merzy-api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set DATABASE_URL=postgresql://...

# Deploy
git push heroku main
```

### Deploy to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway link
railway up
```

### Deploy to Docker

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 4000
ENV NODE_ENV=production
CMD ["npm", "start"]
```

Build and deploy:
```bash
docker build -t merzy-api .
docker tag merzy-api:latest your-registry/merzy-api:1.0.0
docker push your-registry/merzy-api:1.0.0
```

### Deploy to AWS EC2

```bash
# SSH to instance
ssh -i key.pem ec2-user@your-instance-ip

# Clone repository
git clone https://github.com/food-drink-solution/MERZY-Coffe-F.git
cd MERZY-Coffe-F/api-server

# Install dependencies
npm ci

# Create environment file
nano .env.production

# Install PM2 for process management
npm install -g pm2

# Start application
pm2 start npm --name "merzy-api" -- start

# Save PM2 configuration
pm2 save

# Enable startup
pm2 startup
```

## Database Setup

### PostgreSQL Initialization

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE merzy_production;

# Create user
CREATE USER merzy_user WITH PASSWORD 'strong-password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE merzy_production TO merzy_user;

# Connect to database
\c merzy_production

# Run migrations
psql -U merzy_user -d merzy_production -f migrations.sql
```

### Database Backups

#### Automatic Daily Backups
```bash
# Create backup script
nano backup-db.sh

#!/bin/bash
BACKUP_DIR="/backups/db"
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump merzy_production | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Schedule with cron
0 2 * * * /scripts/backup-db.sh
```

#### Restore from Backup
```bash
# Decompress
gunzip backup_20261031_020000.sql.gz

# Restore
psql merzy_production < backup_20261031_020000.sql
```

## Environment Variables

### Frontend (.env)
```env
ANGULAR_APP_API_URL=https://api.merzy.coffee
ANGULAR_APP_VERSION=1.0.0
```

### Backend (.env.production)
```env
NODE_ENV=production
PORT=4000
DATABASE_URL=postgresql://user:pass@localhost:5432/merzy
JWT_SECRET=your-super-secret-key
JWT_EXPIRY=24h
CORS_ORIGIN=https://merzy.coffee
LOG_LEVEL=info
REDIS_URL=redis://localhost:6379
```

### Never Commit
- Database passwords
- API keys
- JWT secrets
- Third-party credentials

## SSL/TLS Configuration

### Using Let's Encrypt

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --standalone -d merzy.coffee -d api.merzy.coffee

# Auto-renewal (cron)
0 0 1 * * certbot renew --quiet
```

### Nginx Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name merzy.coffee;

    ssl_certificate /etc/letsencrypt/live/merzy.coffee/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/merzy.coffee/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;

    # Frontend
    location / {
        proxy_pass http://frontend:3000;
    }

    # API
    location /api/ {
        proxy_pass http://backend:4000;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name merzy.coffee;
    return 301 https://$server_name$request_uri;
}
```

## Monitoring & Logging

### Application Monitoring

```bash
# PM2 Monitoring
pm2 monit

# View logs
pm2 logs merzy-api

# Save logs
pm2 save
```

### Centralized Logging (ELK Stack)

**Send logs to Elastic:**
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  transports: [
    new winston.transports.Elasticsearch({
      clientOpts: { node: 'https://elasticsearch:9200' },
      index: 'merzy-logs'
    })
  ]
});
```

### Performance Monitoring

```bash
# New Relic
npm install newrelic

# Add to server startup
node -r newrelic api-server/src/index.js
```

### Uptime Monitoring

Use service like:
- Uptime Robot
- Better Stack
- Pingdom
- Datadog

## Rollback Procedures

### Quick Rollback to Previous Version

```bash
# View recent versions
git log --oneline -10

# Rollback to previous commit
git revert <commit-hash>
git push

# Redeploy
npm run deploy
```

### Database Rollback

```bash
# List backups
ls -lh /backups/db/

# Restore from backup
psql merzy_production < backup_20261030_020000.sql

# Verify data
psql -c "SELECT COUNT(*) FROM orders;"
```

### Docker Rollback

```bash
# List available images
docker images merzy-api

# Run previous version
docker run -d merzy-api:1.0.0
```

## Post-Deployment

### Verification

- [ ] Frontend loads without errors
- [ ] API responds to requests
- [ ] Database connections working
- [ ] Images loading correctly
- [ ] Form submissions working
- [ ] Mobile responsive
- [ ] SSL certificate valid
- [ ] Analytics tracking
- [ ] Email notifications working

### Testing

```bash
# Smoke tests
npm run test:e2e:production

# Load testing
npm run test:load

# Security scan
npm run test:security
```

### Announce Deployment

- Update status page
- Notify team members
- Post in relevant channels
- Email users if needed
- Monitor for issues

## Common Issues

### Issue: Frontend shows 404
**Solution**: Check build output, verify deployment path in nginx/server config

### Issue: API timeouts
**Solution**: Check database connection, verify network settings, scale server

### Issue: Images not loading
**Solution**: Check image paths, verify S3 bucket permissions, check CDN config

### Issue: High memory usage
**Solution**: Implement pagination, add caching, optimize queries

### Issue: Slow response times
**Solution**: Add database indexes, implement caching, use CDN

## Support & Documentation

- [README.md](./README.md) - Project overview
- [api-server/README.md](./api-server/README.md) - Backend documentation
- [ROADMAP.md](./ROADMAP.md) - Future plans
- [CHANGELOG.md](./CHANGELOG.md) - Release notes

---

**Last Updated**: October 31, 2026  
**Version**: 1.0.0  
**Maintained by**: MERZY DevOps Team
