# ShipApe OnRamp Webhook Handler

This Next.js application handles webhook submissions from Elfsight forms and forwards them to the OnRamp API.

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory with your OnRamp API credentials:

```env
ONRAMP_API_BASE_URL=https://api.onrampfunds.com
ONRAMP_CLIENT_ID=your_client_id_here
ONRAMP_CLIENT_SECRET=your_client_secret_here
```

### 3. Configure Elfsight Webhook

1. Go to your [Elfsight Dashboard](https://dash.elfsight.com/)
2. Select your form widget
3. Navigate to **Integrations** → **Webhooks**
4. Add your webhook URL: `https://your-vercel-domain.vercel.app/api/webhook`
5. Save and publish your widget

## Development

Run the development server:

```bash
npm run dev
```

The webhook endpoint will be available at: `http://localhost:3000/api/webhook`

### Receiving Elfsight Submissions Locally

Since Elfsight needs to send webhooks to a publicly accessible URL, you'll need to use a tunneling service to expose your local server. Here are two options:

#### Option 1: Using ngrok (Recommended)

1. **Install ngrok** (choose one method):
   ```bash
   # Method 1: Install via npm (works on all platforms)
   npm install -g ngrok
   
   # Method 2: Download from https://ngrok.com/download
   # Method 3: Windows (using Chocolatey)
   # choco install ngrok
   ```

2. **Set up ngrok authentication** (required for ngrok 3.x):
   - Sign up for a free account at [ngrok.com](https://dashboard.ngrok.com/signup)
   - After signing up, go to [Your Authtoken](https://dashboard.ngrok.com/get-started/your-authtoken)
   - Copy your authtoken
   - Run this command to configure ngrok:
     ```bash
     npx ngrok config add-authtoken YOUR_AUTHTOKEN_HERE
     ```
     Or if ngrok is in your PATH:
     ```bash
     ngrok config add-authtoken YOUR_AUTHTOKEN_HERE
     ```

3. **Start your Next.js dev server**:
   ```bash
   npm run dev
   ```

4. **In a new terminal, start ngrok**:
   ```bash
   # If ngrok is in your PATH:
   ngrok http 3000
   
   # Or use npx (works if ngrok was installed via npm):
   npx ngrok http 3000
   ```

4. **Copy the HTTPS URL** from ngrok (e.g., `https://abc123.ngrok.io`)

5. **Configure Elfsight**:
   - Go to your [Elfsight Dashboard](https://dash.elfsight.com/)
   - Select your form widget
   - Navigate to **Integrations** → **Webhooks**
   - Add your webhook URL: `https://abc123.ngrok.io/api/webhook`
   - Save and publish your widget

6. **Test**: Submit a form through Elfsight and check your terminal/console for the webhook data

**Note**: The ngrok URL changes each time you restart ngrok (unless you have a paid plan with a static domain). You'll need to update the Elfsight webhook URL if you restart ngrok.

#### Option 2: Using localtunnel (Free Alternative)

1. **Install localtunnel globally**:
   ```bash
   npm install -g localtunnel
   ```

2. **Start your Next.js dev server**:
   ```bash
   npm run dev
   ```

3. **In a new terminal, start localtunnel**:
   ```bash
   lt --port 3000
   ```

4. **Copy the HTTPS URL** from localtunnel (e.g., `https://random-name.loca.lt`)

5. **Configure Elfsight** with the URL: `https://random-name.loca.lt/api/webhook`

**Note**: localtunnel may show a browser warning page on first access - you'll need to click through it.

## Deployment to Vercel

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Import your project in [Vercel](https://vercel.com):
   - Click "New Project"
   - Import your Git repository
   - Vercel will auto-detect Next.js

3. Add Environment Variables in Vercel:
   - Go to Project Settings → Environment Variables
   - Add the following:
     - `ONRAMP_API_BASE_URL`
     - `ONRAMP_CLIENT_ID`
     - `ONRAMP_CLIENT_SECRET`

4. Deploy! Vercel will automatically deploy your application.

## Customization

### Mapping Form Fields

Edit `app/api/webhook/route.ts` and update the `transformToOnRampFormat` function to map your Elfsight form fields to OnRamp API requirements.

### OnRamp API Endpoint

Update the `endpoint` variable in the `submitToOnRamp` function based on the OnRamp API documentation.

## Testing

You can test the webhook locally using:

```bash
curl -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -d '{"field1": "value1", "field2": "value2"}'
```

## Notes

- Make sure to review the [OnRamp API documentation](https://onrampfunds.github.io/onramp-partner-api/) for the correct endpoint structure and field requirements
- Adjust the data transformation logic based on your specific form fields
- Consider adding webhook signature verification if Elfsight provides it

