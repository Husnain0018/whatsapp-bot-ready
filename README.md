# Quick Start Guide

## 🚀 Running the App

```bash
cd /home/husnain/Desktop/whatsapp/whatsapp-ai
node app.js
```

**First run:** Scan the QR code with your WhatsApp phone  
**Next runs:** Should auto-connect

## 🧪 Testing the Webhook

### Quick Test
```bash
curl -X POST http://localhost:3000/test-webhook
```

### Full Test Suite
```bash
bash test-webhook.sh
```

### Send a Test Message
```bash
curl -X POST http://localhost:3000/send-message \
  -H "Content-Type: application/json" \
  -d '{"chatId":"144818311295027@lid","message":"Hello"}'
```

## 📊 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/` | GET | Health check - returns `{"success":true,"state":"CONNECTED"}` |
| `/test-webhook` | POST | Test webhook to n8n |
| `/send-message` | POST | Send WhatsApp message |

## ⚙️ Environment Variables

```bash
# Use custom webhook URL
export N8N_WEBHOOK="https://your-webhook.com/path"

# Only process specific contact
export TARGET_CONTACT="923224627528"

# Then run
node app.js
```

## 🐛 Troubleshooting

### App won't start - "Browser already running"
```bash
pkill -9 chrome node
rm -rf .wwebjs_auth
node app.js
```

### Webhook times out
→ See [WEBHOOK_SETUP.md](WEBHOOK_SETUP.md) - n8n configuration issue

### Messages not being received
→ Check app console for `MESSAGE RECEIVED` log  
→ Verify TARGET_CONTACT env var (if set)

### Express server won't start (port 3000 in use)
```bash
# Kill the process using port 3000
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

## 📝 Logs to Watch

When app is running, look for:
- `WHATSAPP READY` → Connected to WhatsApp
- `MESSAGE RECEIVED` → Incoming message
- `🔗 Sending to webhook` → Webhook POST attempt
- `✅ Webhook response` → Success
- `❌ ERROR in message handler` → Problem with webhook

## 💾 File Structure

```
whatsapp-ai/
├── app.js                 # Main application
├── package.json           # Dependencies
├── WEBHOOK_SETUP.md       # Detailed webhook guide
├── test-webhook.sh        # Testing script
├── README.md              # This file
└── .wwebjs_auth/          # WhatsApp session (auto-created)
```

## 🎯 Next Steps

1. **Fix n8n webhook** - Follow [WEBHOOK_SETUP.md](WEBHOOK_SETUP.md)
2. **Keep app running** - Use `pm2` for persistent execution:
   ```bash
   npm install -g pm2
   pm2 start app.js --name whatsapp-bot
   pm2 logs whatsapp-bot
   ```
3. **Send test messages** to verify webhook fires

---

**Your app is ready!** Just configure n8n webhook to receive the data.
