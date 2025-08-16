# Authentication Setup Guide

## Environment Variables Required

Create a `.env.local` file in your root directory with the following variables:

```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth (set these up in Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Resend Email Service (for magic links)
RESEND_API_KEY=your-resend-api-key
RESEND_FROM=noreply@yourdomain.com

# Database (you already have this)
POSTGRES_URL=your-postgres-connection-string
```

## Setup Steps

### 1. Generate NextAuth Secret

```bash
openssl rand -base64 32
```

### 2. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

### 3. Resend Email Service Setup

1. Sign up at [Resend](https://resend.com/)
2. Get your API key from the dashboard
3. Verify your domain (or use Resend's test domain)
4. Set `RESEND_FROM` to your verified domain

## Resend Configuration Details

### **Simple Setup**

- **API Key**: Just add your Resend API key
- **From Email**: Set to your verified domain
- **No SMTP configuration needed**: Uses Resend's direct API

### **Domain Verification**

- Resend will provide you with a test domain initially
- For production, verify your own domain
- Update `RESEND_FROM` to use your verified domain

### **API Key Security**

- Keep your Resend API key secure
- Never commit it to version control
- Use environment variables for all sensitive data

## Testing

1. Start your development server: `pnpm dev`
2. Visit `/login` to test authentication
3. Test both Google sign-in and magic link flows
4. Check your email for magic link delivery

## Notes

- Magic links will work immediately once Resend is configured
- Google OAuth requires the environment variables to be set
- Users will be redirected to `/essays` after successful authentication
- Resend provides excellent deliverability and analytics
- No nodemailer or SMTP configuration required
