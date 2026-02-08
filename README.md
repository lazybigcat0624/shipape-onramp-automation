# 🧭 ShipApe OnRamp Webhook Handler [P-750]

A Next.js webhook handler that seamlessly receives form submissions from the Elfsight loan submission form component embedded on [ShipApe.com](https://shipape.com) and automatically forwards them to the OnRamp API for loan application processing.

## 📚 Table of Contents
- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Usage](#-usage)
- [Configuration](#-configuration)
- [Screenshots](#-screenshots)
- [API Documentation](#-api-documentation)
- [Contact](#-contact)

## 🧩 About

This project was created to bridge the gap between Elfsight form submissions and the OnRamp API, automating the loan application process for ShipApe. The loan submission form component on [ShipApe.com](https://shipape.com) is built using Elfsight, and when users submit loan applications through this embedded form widget, this webhook handler receives the data, transforms it into the required OnRamp API format, and automatically submits it for processing. The key goal is to eliminate manual data entry and ensure seamless integration between the frontend form on ShipApe.com and the backend loan processing system.

## ✨ Features

- **Automatic webhook processing** : Receives and processes Elfsight form submissions in real-time
- **Data transformation** : Intelligently maps form fields to OnRamp API requirements with type conversion
- **State code mapping** : Automatically converts US state names to 2-character codes
- **Phone number extraction** : Parses and normalizes phone numbers to 10-digit format
- **Currency parsing** : Extracts numeric values from currency-formatted strings
- **Boolean conversion** : Transforms Yes/No responses to boolean values
- **Error handling** : Comprehensive error handling with detailed logging
- **CORS support** : Configured for cross-origin requests from Elfsight

## 🧠 Tech Stack

- **Languages:** TypeScript, JavaScript
- **Frameworks:** Next.js 16.0.7, React 19
- **Runtime:** Node.js
- **Tools:** TypeScript, Vercel (deployment)

## ⚙️ Installation

```bash
# Clone the repository
https://github.com/lazybigcat0624/shipape-onramp-automation.git

# Navigate to the project directory
cd shipape-onramp-automation

# Install dependencies
npm install
```

## 🚀 Usage

```bash
# Start the development server
npm run dev
```

Then open your browser and go to:
👉 [http://localhost:3000](http://localhost:3000)

The webhook endpoint will be available at: `http://localhost:3000/api/webhook`

### Testing Locally with Elfsight

Since Elfsight requires a publicly accessible URL, use a tunneling service for local development:

**Option 1: Using ngrok (Recommended)**
```bash
# Install ngrok globally
npm install -g ngrok

# Configure authtoken (get from https://dashboard.ngrok.com)
npx ngrok config add-authtoken YOUR_AUTHTOKEN_HERE

# Start Next.js dev server
npm run dev

# In a new terminal, start ngrok
npx ngrok http 3000
```

Copy the ngrok HTTPS URL (e.g., `https://abc123.ngrok.io`) and configure it in your Elfsight dashboard.

**Option 2: Using localtunnel**
```bash
# Install localtunnel globally
npm install -g localtunnel

# Start Next.js dev server
npm run dev

# In a new terminal, start localtunnel
lt --port 3000
```

## 🧾 Configuration

Create a `.env.local` file in the root directory with the following environment variables:

```env
ONRAMP_API_BASE_URL=https://api.onrampfunds.com
ONRAMP_CLIENT_ID=your_client_id_here
ONRAMP_CLIENT_SECRET=your_client_secret_here
```

### Elfsight Webhook Configuration

The loan submission form component on [ShipApe.com](https://shipape.com) is powered by Elfsight. To configure the webhook:

1. Go to your [Elfsight Dashboard](https://dash.elfsight.com/)
2. Select your loan submission form widget (used on ShipApe.com)
3. Navigate to **Integrations** → **Webhooks**
4. Add your webhook URL: `https://your-vercel-domain.vercel.app/api/webhook`
5. Save and publish your widget

### Vercel Deployment

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import your project in [Vercel](https://vercel.com)
3. Add Environment Variables in Vercel Project Settings:
   - `ONRAMP_API_BASE_URL`
   - `ONRAMP_CLIENT_ID`
   - `ONRAMP_CLIENT_SECRET`
4. Deploy! Vercel will automatically deploy your application.

## 📜 API Documentation

### Webhook Endpoint

**POST** `/api/webhook`

Receives Elfsight form submission data and forwards it to the OnRamp API.

**Request Body:**
```json
[
  {
    "id": "field_1",
    "name": "Email *",
    "value": "user@example.com",
    "type": "email"
  },
  {
    "id": "field_2",
    "name": "Company Name",
    "value": "Acme Corp",
    "type": "text"
  }
  // ... more fields
]
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "data": {
    // OnRamp API response data
  }
}
```

**Error Response (500):**
```json
{
  "success": false,
  "error": "Error message description"
}
```

**GET** `/api/webhook`

Health check endpoint to verify the webhook is accessible.

**Response (200):**
```json
{
  "status": "ok",
  "message": "Webhook endpoint is accessible",
  "endpoint": "/api/webhook",
  "method": "POST"
}
```

**OPTIONS** `/api/webhook`

CORS preflight endpoint.

**Response (200):**
Headers include CORS configuration for cross-origin requests.

## 📬 Contact

- **Author:** ShipApe Development Team
- **Email:** harukimizuno0222@gmail.com
- **GitHub:** @lazybigcat0624
- **Website/Portfolio:** https://harukimizuno.vercel.app

## 🌟 Acknowledgements

- [ShipApe.com](https://shipape.com) – Main website hosting the loan submission form
- [Next.js](https://nextjs.org/) – React framework for production
- [OnRamp API](https://onrampfunds.github.io/onramp-partner-api/) – Loan application processing API
- [Elfsight](https://elfsight.com/) – Form widget platform powering the loan submission form component
- [Vercel](https://vercel.com/) – Deployment platform
