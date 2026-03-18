# Changelog

## 2026-03-18 — Production Readiness & Azure SWA Setup

### Standardization
- Added phone number (801) 648-9652 to all page footers
- Removed placeholder social links (LinkedIn, TikTok, YouTube) across all pages
- Added Open Graph meta tags to all pages (index, checkout, privacy, terms)
- Added favicon link to all pages
- Standardized footer Connect section across index and checkout pages

### Deployment Config
- Created `staticwebapp.config.json` for Azure Static Web Apps
- Created `robots.txt` with sitemap reference
- Created `sitemap.xml` with all public pages
- Updated `.gitignore` for Azure, secrets, and build artifacts
- Created `api/README.md` for future Azure Functions
- Created `CLAUDE.md` with project conventions and canonical contact info

### Previous Changes
- Added professional web services section (design, management, hosting)
- Improved mobile responsiveness across all breakpoints
- Fixed hero viewport height on Android using dvh unit
