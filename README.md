# EBYG Automation

AI systems and professional websites built around how your business actually works. A division of EBYG Media LLC.

## Local Development

Open `index.html` directly in a browser, or use a local server:

```bash
# Python
python -m http.server 8080

# Node
npx serve .

# VS Code
# Install "Live Server" extension → right-click index.html → Open with Live Server
```

## Branch Strategy

| Branch | Environment | URL |
|--------|-------------|-----|
| `master` | Production | ebygautomation.com |
| `develop` | Staging | Azure preview URL |
| `feature/*` | Local only | — |

## Deployment

Deployment is automatic via GitHub Actions + Azure Static Web Apps:

- Push to `develop` → deploys to staging environment
- Merge to `master` → deploys to production
- Pull requests → preview environments

## Project Structure

```
ebyg-automation/
├── index.html                  # Main landing page
├── checkout-starter-kit.html   # Level 1 product checkout
├── checkout-blueprint.html     # Level 2 product checkout
├── checkout-toolkit.html       # Level 3 product checkout
├── starter-kit.html            # Starter Kit app (license-gated)
├── automation-blueprint.html   # Blueprint app (license-gated)
├── admin.html                  # Admin dashboard (noindex)
├── privacy.html                # Privacy policy
├── terms.html                  # Terms of service
├── css/
│   ├── styles.css              # Main stylesheet
│   ├── checkout.css            # Checkout page styles
│   ├── kit.css                 # Starter Kit app styles
│   ├── blueprint.css           # Blueprint app styles
│   ├── admin.css               # Admin dashboard styles
│   └── legal.css               # Privacy/terms styles
├── js/
│   └── main.js                 # Site JavaScript
├── api/                        # Future Azure Functions
├── staticwebapp.config.json    # Azure SWA config
├── robots.txt                  # Search engine directives
├── sitemap.xml                 # Sitemap for SEO
├── CLAUDE.md                   # Claude Code instructions
└── CHANGELOG.md                # Change history
```

## Future Backend

The `api/` directory is reserved for Azure Functions:
- `/api/contact` — form submission handler
- `/api/chat` — chatbot proxy
- `/api/upload` — file upload handler

See `api/README.md` for setup instructions.

## Contact

| Field | Value |
|-------|-------|
| Phone | (801) 648-9652 |
| Email | info@ebygautomation.com |
| Domain | ebygautomation.com |
