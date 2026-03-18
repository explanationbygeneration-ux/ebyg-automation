# API Directory — Azure Functions

Reserved for future Azure Functions backend. Not yet implemented.

## Planned Functions
- Contact form handler (`/api/contact`)
- Chatbot proxy (`/api/chat`)
- File upload handler (`/api/upload`)

## Setup (when ready)
1. `npm i -g azure-functions-core-tools@4`
2. `func init --worker-runtime node --language javascript`
3. `func new --name contact --template "HTTP trigger"`
4. Local settings in `local.settings.json` (gitignored)
5. Uncomment `api_location` in the GitHub Actions workflow
