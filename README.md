
# Kampaign

Kampaign is a local first bulk email automation app built with Next.js. It helps users send personalized emails to many recipients without relying on paid mailing services or hosted platforms. Everything runs locally, and users provide their own SMTP credentials from Gmail or any other email provider. No data or credentials are stored on remote servers.

You can upload CSV or Excel files, create email templates with dynamic placeholders, and even automate per recipient attachments using file naming rules. The app processes emails through a local queue, displays progress, and logs errors in a transparent way.

Kampaign is designed for event organizers, educators, hackathon teams, or anyone who regularly needs to send bulk email campaigns from their own account.

## Features

- Local first – no remote backend or cloud storage
- SMTP credentials provided by the user
- Support for CSV and Excel contact files with arbitrary column names
- Email template editor with placeholders and autocomplete
- Preview mode that renders templates for a selected contact
- Two attachment strategies:
  - Same attachment for every recipient
  - Rule-based attachment mapping where filenames are generated from contact data
- Docker and Node support
- Open source and container friendly

## Requirements

- Node 18 or higher (if running without Docker)
- Docker and Docker Compose (if running with containers)
- SMTP credentials from your email provider (e.g., Gmail app password)
- A `.env` file to store credentials locally
## Configuration

Create a `.env` file in the project root:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email_here
SMTP_APP_PASSWORD=your_app_password_here
APP_PORT=3000
```

**Never commit this file.** Use `.env.example` as a template.
### Running without Docker (Development)

Install dependencies:

```bash
npm install
```

Start the development server with hot reload:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Running without Docker (Production)

Build the final Next.js bundle:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

### Running with Docker (Production - Recommended)

Build the image:

```bash
docker compose -f docker-compose.prod.yml build
```

Run the container:

```bash
docker compose -f docker-compose.prod.yml up
```

Open [http://localhost:3000](http://localhost:3000)

This ensures a clean environment and consistent dependencies across machines.

### Running with Docker (Development - Hot Reload)

This mounts local files into the container and runs `npm run dev`:

```bash
docker compose -f docker-compose.dev.yml up
```

Open [http://localhost:3000](http://localhost:3000)

You get hot reload with a consistent runtime environment.

#### Why Two Docker Compose Files?

- `docker-compose.dev.yml` – Optimized for fast development, hot reload, and active coding
- `docker-compose.prod.yml` – Optimized for production with multi-stage builds

Choose the one that matches your current workflow.

This gives hot reload with consistent runtime.
## Security

- SMTP credentials are stored locally in `.env` or set via the settings page
- No data is transmitted to external servers
- `.env` is excluded via `.dockerignore` and `.gitignore`
- Rotate or revoke app passwords if they're shared or compromised
You switch between them based on what you are doing.

Security notes
	•	SMTP credentials are kept in the local .env file or set through the settings page
## Contributing

Pull requests are welcome. Please feel free to open an issue for bugs or feature requests.sswords if shared or compromised

# Contribution

Pull requests are welcome. 
