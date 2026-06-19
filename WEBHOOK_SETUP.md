# WhatsApp Webhook Integration - Setup & Troubleshooting

## ✅ Current Status
Your WhatsApp bot is **working correctly** and sending data to n8n:
- ✅ App runs without errors
- ✅ WhatsApp messages are received
- ✅ Webhook POST requests are being sent to n8n
- ❌ n8n is not responding (timeout after 5 seconds)

## 🔧 How to Test

### Test 1: Local App Status
```bash
curl http://localhost:3000/
```
Should return: `{"success":true,"state":"CONNECTED"}`

### Test 2: Send Test Webhook
```bash
curl -X POST http://localhost:3000/test-webhook
```
Should show the exact error (helps diagnose n8n issues)

### Test 3: Direct n8n Check
```bash
curl -v https://danapani018.app.n8n.cloud/webhook-test/message \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"test":"data"}'
```
If timeout → n8n webhook not responding

## 🛠️ N8N Configuration Checklist

Follow these steps **in your n8n dashboard**:

### 1. **Webhook Node Setup**
- [ ] Create/open your workflow
- [ ] Add a **Webhook** trigger node
- [ ] Set **HTTP Method** to `POST`
- [ ] Set **Path** to exactly: `/webhook-test/message`
- [ ] Authentication: `None` (or configure as needed)

### 2. **Webhook Activation**
- [ ] Check that the webhook node is **enabled** (not disabled/muted)
- [ ] The node should show a green checkmark when active
- [ ] Copy the full webhook URL and verify it matches: `https://danapani018.app.n8n.cloud/webhook-test/message`

### 3. **Workflow Status**
- [ ] Save the workflow (`Ctrl+S`)
- [ ] Check workflow status - should be **Active** (green indicator)
- [ ] Some n8n instances require "Execute" or "Deploy" button
- [ ] Verify no paused/inactive nodes

### 4. **Response Configuration** (Optional)
- [ ] Add a **Response** node after the webhook trigger to send acknowledgment
- [ ] Connect it so n8n sends `{"received":true}` back (prevents timeout)

### 5. **Testing in n8n**
- [ ] Use n8n's **Test Webhook** feature
- [ ] Send a test request from the UI
- [ ] Check execution logs for any errors

## 📨 Sending WhatsApp Messages to Trigger Webhook

### Option A: Manual Test
```bash
curl -X POST http://localhost:3000/send-message \
  -H "Content-Type: application/json" \
  -d '{
    "chatId": "YOUR_CONTACT@c.us",
    "message": "Hello test"
  }'
```

### Option B: Receive Real Messages
- Send a WhatsApp message to your bot
- Should automatically trigger webhook POST to n8n
- Check app console for success/error details

## 🔍 Debug Logs

Watch app logs in real-time:
```bash
cd /home/husnain/Desktop/whatsapp/whatsapp-ai
node app.js
```

Look for:
- `🔗 Sending to webhook:` → Shows URL being called
- `✅ Webhook response` → Success
- `❌ ERROR in message handler` → Network/timeout error

## 🌍 Environment Variables (Optional)

Override webhook URL or target contact:

```bash
# Use a different webhook
export N8N_WEBHOOK="https://your-other-webhook.com/path"

# Only process messages from specific contact (WhatsApp number)
export TARGET_CONTACT="923224627528"

# Then start app
node app.js
```

## 💡 Common N8N Issues & Fixes

| Issue | Solution |
|-------|----------|
| **Webhook not responding** | Check if workflow is Active in n8n; add Response node |
| **"Path not found"** | Verify webhook path matches exactly in n8n trigger |
| **No data received** | Check n8n execution logs; add console.log node after webhook |
| **Authentication fails** | Verify auth method in webhook node matches your setup |
| **CORS errors** | n8n typically handles this; check network tab in browser |

## 📞 Still Not Working?

1. **Verify n8n webhook path** exactly matches: `/webhook-test/message`
2. **Check n8n is running** - visit dashboard
3. **Look for n8n error logs** - webhook section
4. **Test webhook directly** using the curl command above
5. **Add logging node** in n8n workflow before processing data

---

**All app code is working correctly.** The issue is in n8n webhook configuration.
