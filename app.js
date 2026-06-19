// const { Client, LocalAuth } = require('whatsapp-web.js');
// const qrcode = require('qrcode-terminal');
// const axios = require('axios');
// const express = require('express');

// const app = express();

// app.use(express.json({ limit: '200mb' }));

// /*
// |--------------------------------------------------------------------------
// | CONFIG
// |--------------------------------------------------------------------------
// */

// const N8N_WEBHOOK = process.env.N8N_WEBHOOK || 'https://danapani018.app.n8n.cloud/webhook-test/message';
// const TARGET_CONTACT_ENV = process.env.TARGET_CONTACT || null;

// console.log('\n📋 CONFIG:');
// console.log('N8N_WEBHOOK:', N8N_WEBHOOK);
// console.log('TARGET_CONTACT:', TARGET_CONTACT_ENV || '(all contacts will trigger webhook)');

// /*
// |--------------------------------------------------------------------------
// | GLOBAL ERROR HANDLING
// |--------------------------------------------------------------------------
// */

// process.on('unhandledRejection', (err) => {

//     console.log('\n==============================');
//     console.log('UNHANDLED REJECTION');
//     console.log('==============================');

//     console.log(err);

// });

// process.on('uncaughtException', (err) => {

//     console.log('\n==============================');
//     console.log('UNCAUGHT EXCEPTION');
//     console.log('==============================');

//     console.log(err);

// });

// /*
// |--------------------------------------------------------------------------
// | WHATSAPP CLIENT
// |--------------------------------------------------------------------------
// */

// console.log('\nInitializing WhatsApp Client...\n');

// const client = new Client({

//     authStrategy: new LocalAuth({
//         clientId: 'main'
//     }),

//     puppeteer: {
//         executablePath: '/usr/bin/google-chrome-stable',
//         headless: true,
//         args: ['--no-sandbox', '--disable-setuid-sandbox']
//     },

//     takeoverOnConflict: true,
//     takeoverTimeoutMs: 10000,

//     restartOnAuthFail: true

// });

// /*
// |--------------------------------------------------------------------------
// | DEBUG EVENTS
// |--------------------------------------------------------------------------
// */

// client.on('change_state', (state) => {

//     console.log('\n==============================');
//     console.log('STATE CHANGED');
//     console.log('==============================');

//     console.log(state);

// });

// client.on('loading_screen', (percent, message) => {

//     console.log('\n==============================');
//     console.log('LOADING');
//     console.log('==============================');

//     console.log(percent + '%');
//     console.log(message);

// });

// /*
// |--------------------------------------------------------------------------
// | QR
// |--------------------------------------------------------------------------
// */

// client.on('qr', (qr) => {

//     console.log('\n==============================');
//     console.log('SCAN QR CODE');
//     console.log('==============================\n');

//     qrcode.generate(qr, {
//         small: true
//     });

// });

// /*
// |--------------------------------------------------------------------------
// | AUTH EVENTS
// |--------------------------------------------------------------------------
// */

// client.on('authenticated', () => {

//     console.log('\n==============================');
//     console.log('AUTHENTICATED');
//     console.log('==============================');

// });

// client.on('auth_failure', async (msg) => {

//     console.log('\n==============================');
//     console.log('AUTH FAILURE');
//     console.log('==============================');

//     console.log(msg);

// });

// /*
// |--------------------------------------------------------------------------
// | READY
// |--------------------------------------------------------------------------
// */

// client.on('ready', async () => {

//     console.log('\n==============================');
//     console.log('WHATSAPP READY');
//     console.log('==============================');

//     try {

//         const state = await client.getState();

//         console.log('STATE:', state);

//         console.log('\nCLIENT INFO:\n');

//         console.log(client.info);

//     } catch (err) {

//         console.log(err);

//     }

// });

// /*
// |--------------------------------------------------------------------------
// | DISCONNECTED
// |--------------------------------------------------------------------------
// */

// client.on('disconnected', async (reason) => {

//     console.log('\n==============================');
//     console.log('DISCONNECTED');
//     console.log('==============================');

//     console.log(reason);

//     try {

//         await client.destroy();

//         console.log('\nClient destroyed');

//     } catch (err) {

//         console.log(err);

//     }

//     setTimeout(() => {

//         console.log('\nReinitializing...\n');

//         client.initialize();

//     }, 5000);

// });

// /*
// |--------------------------------------------------------------------------
// | MESSAGE LISTENER
// |--------------------------------------------------------------------------
// |
// | IMPORTANT:
// | ONLY COMMANDS WILL EXECUTE
// |
// | TEXT COMMAND:
// | /naman ko bol sham ko meet hai
// |
// | VOICE COMMAND:
// | send voice note starting with:
// | "command ..."
// |
// */

// client.on('message', async (msg) => {

//     console.log('\n======================');
//     console.log('MESSAGE RECEIVED');
//     console.log('FROM:', msg.from);
//     console.log('BODY:', msg.body);
//     console.log('FROM ME:', msg.fromMe);
//     console.log('======================');

//     try {

//         if (msg.fromMe) {
//             console.log('⏭️  Skipping: message from self');
//             return;
//         }

//         const chat = await msg.getChat();
//         const contact = await chat.getContact();

//         // If TARGET_CONTACT is set, only process that contact
//         if (TARGET_CONTACT_ENV && contact.id?.user !== TARGET_CONTACT_ENV) {
//             console.log(`⏭️  Skipping: contact ${contact.id?.user} does not match TARGET_CONTACT ${TARGET_CONTACT_ENV}`);
//             return;
//         }

//         const messages =
//             await chat.fetchMessages({
//                 limit: 30
//             });

//         const history =
//             messages
//                 .filter(m =>
//                     m.type === 'chat' &&
//                     m.body?.trim()
//                 )
//                 .map(m => ({
//                     fromMe: m.fromMe,
//                     body: m.body
//                 }));

//         if (!history.length) {
//             console.log('⚠️  No valid messages found');
//             return;
//         }

//         const payload = {
//             type: 'auto_reply',
//             chatId: msg.from,
//             name: contact.pushname || contact.name || 'Unknown',
//             history
//         };

//         console.log('\n🔗 Sending to webhook:', N8N_WEBHOOK);
//         console.log('📦 Payload:', JSON.stringify(payload, null, 2));

//         const response = await axios.post(N8N_WEBHOOK, payload, {
//             timeout: 10000,
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         });

//         console.log('✅ Webhook response status:', response.status);
//         console.log('✅ Webhook response data:', response.data);

//     } catch (err) {

//         console.log('\n❌ ERROR in message handler:');
//         console.log('Error message:', err.message);
//         if (err.response) {
//             console.log('Response status:', err.response.status);
//             console.log('Response data:', err.response.data);
//         } else if (err.request) {
//             console.log('No response received - network error or timeout');
//             console.log('Request details:', err.request);
//         }
//         console.log('Full error:', err);

//     }

// });

// /*
// |--------------------------------------------------------------------------
// | SEND MESSAGE API
// |--------------------------------------------------------------------------
// */

// app.post('/send-message', async (req, res) => {

//     try {

//         console.log('\n==============================');
//         console.log('SEND MESSAGE API');
//         console.log('==============================');

//         console.log(req.body);

//         const {
//             chatId,
//             message
//         } = req.body;

//         if (!chatId || !message) {

//             return res.status(400).json({
//                 success: false,
//                 error: 'chatId and message required'
//             });

//         }

//         const state =
//             await client.getState();

//         console.log('\nCURRENT STATE:', state);

//         await client.sendMessage(
//             chatId,
//             message
//         );

//         console.log('\nMESSAGE SENT SUCCESSFULLY');

//         res.json({
//             success: true
//         });

//     } catch (err) {

//         console.log('\n==============================');
//         console.log('SEND MESSAGE ERROR');
//         console.log('==============================');

//         console.log(err);

//         res.status(500).json({
//             success: false,
//             error: err.message
//         });

//     }

// });

// /*
// |--------------------------------------------------------------------------
// | TEST WEBHOOK ENDPOINT
// |--------------------------------------------------------------------------
// */

// app.post('/test-webhook', async (req, res) => {

//     try {

//         console.log('\n==============================');
//         console.log('TEST WEBHOOK API');
//         console.log('==============================');

//         const testPayload = {
//             type: 'auto_reply',
//             chatId: '144818311295027@lid',
//             name: 'Test Contact',
//             history: [
//                 { fromMe: false, body: 'Hello from test' },
//                 { fromMe: true, body: 'Hi there' }
//             ]
//         };

//         console.log('\n🔗 Sending test payload to webhook:', N8N_WEBHOOK);
//         console.log('📦 Payload:', JSON.stringify(testPayload, null, 2));

//         const response = await axios.post(N8N_WEBHOOK, testPayload, {
//             timeout: 10000,
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         });

//         console.log('✅ Webhook response status:', response.status);
//         console.log('✅ Webhook response data:', response.data);

//         res.json({
//             success: true,
//             message: 'Test payload sent to webhook',
//             webhookStatus: response.status,
//             webhookResponse: response.data
//         });

//     } catch (err) {

//         console.log('\n❌ ERROR in test webhook:');
//         console.log('Error message:', err.message);
//         if (err.response) {
//             console.log('Response status:', err.response.status);
//             console.log('Response data:', err.response.data);
//         } else if (err.request) {
//             console.log('No response received - network error or timeout');
//         }
//         console.log('Full error:', err);

//         res.status(500).json({
//             success: false,
//             error: err.message,
//             details: err.response?.data || 'No response from webhook'
//         });

//     }

// });

// /*
// |--------------------------------------------------------------------------
// | HEALTH CHECK
// |--------------------------------------------------------------------------
// */

// app.get('/', async (req, res) => {

//     try {

//         let state = 'UNKNOWN';

//         try {

//             state =
//                 await client.getState();

//         } catch {}

//         res.json({
//             success: true,
//             state
//         });

//     } catch (err) {

//         res.json({
//             success: false,
//             error: err.message
//         });

//     }

// });

// /*
// |--------------------------------------------------------------------------
// | START SERVER
// |--------------------------------------------------------------------------
// */

// app.listen(3000, () => {

//     console.log('\n==============================');
//     console.log('EXPRESS SERVER STARTED');
//     console.log('PORT: 3000');
//     console.log('==============================');

// });

// /*
// |--------------------------------------------------------------------------
// | START CLIENT
// |--------------------------------------------------------------------------
// */

// console.log('\nStarting WhatsApp Client...\n');

// client.initialize();

















const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const axios = require("axios");
const express = require("express");

const app = express();
app.use(express.json({ limit: "50mb" }));

/* ---------------- CONFIG ---------------- */

const N8N_WEBHOOK = "https://danapani018.app.n8n.cloud/webhook-test/message";

/* ---------------- AXIOS ---------------- */

const api = axios.create({
    timeout: 20000,
    headers: {
        "Content-Type": "application/json"
    }
});

/* ---------------- RETRY FUNCTION ---------------- */

async function sendToN8N(payload, retry = 0) {
    try {
        const res = await api.post(N8N_WEBHOOK, payload);
        console.log("✅ n8n response:", res.status);
        return res.data;
    } catch (err) {
        console.log(`❌ n8n failed attempt ${retry + 1}:`, err.message);

        if (retry < 3) {
            await new Promise(r => setTimeout(r, 2000 * (retry + 1)));
            return sendToN8N(payload, retry + 1);
        }

        console.log("🚨 FINAL FAIL (n8n unreachable)");
        return null;
    }
}

/* ---------------- WHATSAPP CLIENT ---------------- */

console.log("Initializing WhatsApp Client...\n");

const client = new Client({
    authStrategy: new LocalAuth({ clientId: "main" }),

    puppeteer: {
    executablePath: "/usr/bin/google-chrome",
    headless: true,
    args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu"
    ]
},

    takeoverOnConflict: true,
    restartOnAuthFail: true,
    qrMaxRetries: 5
});

/* ---------------- EVENTS ---------------- */

client.on("qr", qr => {
    console.log("📌 SCAN QR:");
    qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
    console.log("\n✅ WHATSAPP READY\n");
});

client.on("authenticated", () => {
    console.log("🔐 AUTHENTICATED");
});

client.on("disconnected", (reason) => {
    console.log("❌ DISCONNECTED:", reason);
    setTimeout(() => client.initialize(), 5000);
});

/* ---------------- MESSAGE HANDLER ---------------- */

client.on("message", async (msg) => {
    try {
        if (msg.fromMe) return;

        console.log("\n📩 MESSAGE:", msg.body);

        const chat = await msg.getChat();
        const contact = await chat.getContact();

        const messages = await chat.fetchMessages({ limit: 20 });

        const history = messages
            .filter(m => m.type === "chat" && m.body)
            .map(m => ({
                fromMe: m.fromMe,
                body: m.body
            }));

        if (!history.length) return;

        const payload = {
            type: "auto_reply",
            chatId: msg.from,
            name: contact.pushname || "Unknown",
            history
        };

        // IMPORTANT: non-blocking
        sendToN8N(payload);

        console.log("🚀 Sent to n8n queue");

    } catch (err) {
        console.log("❌ MESSAGE ERROR:", err.message);
    }
});

/* ---------------- API ---------------- */

app.post("/send-message", async (req, res) => {
    try {
        const { chatId, message } = req.body;

        if (!chatId || !message) {
            return res.status(400).json({
                success: false,
                error: "chatId and message required"
            });
        }

        await client.sendMessage(chatId, message);

        res.json({ success: true });

    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

/* ---------------- HEALTH ---------------- */

app.get("/", async (req, res) => {
    let state = "UNKNOWN";
    try {
        state = await client.getState();
    } catch {}

    res.json({ success: true, state });
});

/* ---------------- START ---------------- */

app.listen(3000,  "0.0.0.0",() => {
    console.log("\n🚀 EXPRESS SERVER RUNNING ON 3000\n");
});

console.log("Starting WhatsApp Client...\n");
client.initialize();