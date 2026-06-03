import 'dotenv/config';
import { google } from 'googleapis';
import { createServer } from 'http';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3000/oauth2callback';

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env first');
  process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const SCOPES = [
  'https://www.googleapis.com/auth/analytics.readonly',
  'https://www.googleapis.com/auth/webmasters.readonly',
];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
  prompt: 'consent',
});

console.log('\n=== VisorUp OAuth Setup ===\n');
console.log('1. Open this URL in your browser:\n');
console.log(authUrl);
console.log('\n2. Sign in with your Google account (the one that has GA4 + Search Console access)');
console.log('3. Click "Allow" on the consent screen');
console.log('4. You\'ll be redirected back here and the refresh token will be printed\n');
console.log('Waiting for callback on http://localhost:3000 ...\n');

const server = createServer(async (req, res) => {
  if (!req.url.startsWith('/oauth2callback')) {
    res.writeHead(404);
    res.end();
    return;
  }

  const url = new URL(req.url, 'http://localhost:3000');
  const code = url.searchParams.get('code');

  if (!code) {
    res.writeHead(400);
    res.end('No auth code received');
    return;
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>Done! Check your terminal for the refresh token.</h1><p>You can close this tab.</p>');

    console.log('\n=== SUCCESS ===\n');
    console.log('Add this to your .env file:\n');
    console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
    console.log('\n===============\n');

    // Also write to file in case terminal truncates
    const fs = await import('fs');
    fs.writeFileSync('oauth-token.txt', `GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}\n`);
    console.log('Token also saved to oauth-token.txt');

    server.close();
    process.exit(0);
  } catch (err) {
    res.writeHead(500);
    res.end('Error exchanging code: ' + err.message);
    console.error('Error:', err.message);
  }
});

server.listen(3000);
