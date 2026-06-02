# VisorUp Cloud Migration Plan

## Current State
- Static SPA deployed to Cloudflare Pages
- Route data saved to localStorage (browser-only)
- No user accounts or server-side persistence

## Target Architecture

### Phase 1: GitHub + DigitalOcean Setup
- **Repository**: GitHub (private repo)
- **Hosting**: DigitalOcean App Platform (or Droplet with Nginx)
- **Database**: DigitalOcean Managed PostgreSQL ($15/mo starter)
- **Object Storage**: DigitalOcean Spaces for user uploads (GPX files, photos)
- **CI/CD**: GitHub Actions → auto-deploy on push to `main`

### Phase 2: Backend API (Node.js/Express)
```
/api/auth/register    POST  - Create account (email + password)
/api/auth/login       POST  - Login, return JWT
/api/auth/me          GET   - Get current user profile

/api/routes           GET   - List user's saved routes
/api/routes           POST  - Save a new custom route
/api/routes/:id       GET   - Get route by ID
/api/routes/:id       PUT   - Update route
/api/routes/:id       DELETE - Delete route

/api/routes/public    GET   - Browse community shared routes
/api/routes/:id/share POST  - Toggle route public/private

/api/gpx/:routeId     GET   - Download GPX for route
```

### Phase 3: Database Schema
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  waypoints JSONB NOT NULL,        -- [{lat, lng, name}]
  preferences JSONB,               -- {maxMilesPerDay, maxHoursPerDay}
  days JSONB,                      -- auto-split day data
  total_distance_miles DECIMAL,
  total_duration_hours DECIMAL,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE route_pois (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id UUID REFERENCES routes(id) ON DELETE CASCADE,
  name VARCHAR(255),
  type VARCHAR(50),
  lat DECIMAL NOT NULL,
  lng DECIMAL NOT NULL,
  description TEXT,
  day_number INTEGER
);

CREATE INDEX idx_routes_user ON routes(user_id);
CREATE INDEX idx_routes_public ON routes(is_public) WHERE is_public = true;
```

### Phase 4: Migration from localStorage
1. On login, check for localStorage routes
2. Offer to import them into cloud account
3. Keep localStorage as offline fallback
4. Sync status indicator in UI

### Phase 5: DigitalOcean Deployment
```yaml
# .do/app.yaml
name: visorup
services:
  - name: api
    github:
      repo: your-username/visorup
      branch: main
      deploy_on_push: true
    source_dir: /server
    environment_slug: node-js
    instance_count: 1
    instance_size_slug: basic-xxs
    envs:
      - key: DATABASE_URL
        scope: RUN_TIME
        value: ${db.DATABASE_URL}
      - key: JWT_SECRET
        scope: RUN_TIME
        type: SECRET
  - name: web
    github:
      repo: your-username/visorup
      branch: main
    source_dir: /
    environment_slug: html
    routes:
      - path: /

databases:
  - engine: PG
    name: db
    size: db-s-dev-database
    version: "16"
```

### Estimated Monthly Cost (DigitalOcean)
- App Platform (Basic): $5/mo
- Managed PostgreSQL (Dev): $15/mo
- Spaces (1GB): $5/mo
- **Total: ~$25/mo** to start

### Tech Stack
- **Frontend**: Current vanilla JS SPA (no changes needed initially)
- **Backend**: Node.js + Express + Passport.js (JWT auth)
- **Database**: PostgreSQL with JSONB for flexible route data
- **ORM**: Knex.js (lightweight query builder)
- **Storage**: DigitalOcean Spaces (S3-compatible) for GPX exports
- **Auth**: JWT tokens, bcrypt password hashing
- **Deploy**: GitHub Actions → DigitalOcean App Platform
