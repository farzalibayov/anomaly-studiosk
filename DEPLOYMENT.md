# Deployment Guide for Anomaly Studios Website

## Cloudflare Pages Deployment

### Prerequisites
- Cloudflare account
- Domain `anomaly.az` configured in Cloudflare
- Git repository

### Quick Deployment Steps

1. **Connect to Cloudflare Pages**
   - Go to [Cloudflare Pages](https://pages.cloudflare.com/)
   - Click "Create a project"
   - Connect your Git repository
   - Select this repository

2. **Build Settings**
   - Framework preset: `None`
   - Build command: (leave empty)
   - Build output directory: `/`
   - Root directory: `/`

3. **Environment Variables** (Optional)
   - No environment variables needed for basic functionality

### Form Submissions Setup

#### Option 1: Basic Logging (Current Setup)
- Forms will be logged to Cloudflare's console
- No additional setup required
- Submissions visible in Cloudflare Pages Functions logs

#### Option 2: KV Storage (Recommended)
1. Create a KV namespace:
   ```bash
   wrangler kv:namespace create "FORM_SUBMISSIONS"
   ```

2. Update `wrangler.toml`:
   ```toml
   [[kv_namespaces]]
   binding = "FORM_SUBMISSIONS"
   id = "your-kv-namespace-id"
   ```

3. In Cloudflare Pages settings, add the KV binding

#### Option 3: Email Notifications
Integrate with email services like:
- SendGrid
- Mailgun  
- Resend
- Cloudflare Email Workers

### Custom Domain Setup

1. **Add Custom Domain**
   - In Cloudflare Pages project settings
   - Go to "Custom domains"
   - Add `anomaly.az`

2. **SSL/TLS**
   - Automatic with Cloudflare
   - Full SSL encryption enabled

### Performance Optimizations

The site includes:
- ✅ Optimized caching headers (`_headers` file)
- ✅ Compressed assets
- ✅ Minified CSS/JS (can be enhanced)
- ✅ Proper image optimization
- ✅ CDN delivery via Cloudflare

### Security Features

- ✅ Security headers configured
- ✅ CORS properly handled
- ✅ XSS protection
- ✅ Content type validation

### Monitoring Form Submissions

#### View Submissions (Admin)
Access: `GET /get-submissions`
Headers: `Authorization: Bearer anomaly-admin-2024`

Example:
```bash
curl -H "Authorization: Bearer anomaly-admin-2024" https://anomaly.az/get-submissions
```

**⚠️ Important: Change the auth token in `functions/get-submissions.js`**

### Development

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Run locally
wrangler pages dev .

# Deploy manually
wrangler pages publish .
```

### File Structure
```
/
├── index.html              # Main page
├── styles.css             # Styles
├── script.js              # JavaScript
├── Logo Full.png          # Logo
├── _headers               # Cloudflare headers
├── wrangler.toml          # Cloudflare config
├── functions/
│   ├── submit-form.js     # Form handler
│   └── get-submissions.js # Admin endpoint
└── README.md              # Project info
```

### Post-Deployment Checklist

- [ ] Custom domain working (`anomaly.az`)
- [ ] SSL certificate active
- [ ] Form submissions working
- [ ] Contact email updated (`info@anomaly.az`)
- [ ] Performance score > 90
- [ ] Mobile responsive
- [ ] Security headers active

### Troubleshooting

**Form not working?**
- Check Cloudflare Pages Functions logs
- Verify `/submit-form` endpoint is accessible
- Check browser console for errors

**Performance issues?**
- Enable Cloudflare's optimization features
- Check caching headers
- Optimize images further

**SSL issues?**
- Verify DNS is pointing to Cloudflare
- Check SSL/TLS settings in Cloudflare dashboard 