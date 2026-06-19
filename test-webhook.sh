#!/bin/bash

# WhatsApp Webhook Testing Script
# Usage: bash test-webhook.sh

echo "🧪 WhatsApp Webhook Test Suite"
echo "==============================\n"

API_URL="http://localhost:3000"
WEBHOOK_URL="${N8N_WEBHOOK:-https://danapani018.app.n8n.cloud/webhook-test/message}"

# Test 1: App Health
echo "📍 Test 1: App Health Check"
echo "GET $API_URL/"
health=$(curl -s "$API_URL/")
echo "Response: $health\n"

# Test 2: Test Webhook Endpoint
echo "📍 Test 2: Test Webhook (via app)"
echo "POST $API_URL/test-webhook"
webhook_response=$(curl -s -X POST "$API_URL/test-webhook" \
  -H "Content-Type: application/json" \
  -d '{}')
echo "Response: $webhook_response\n"

# Test 3: Direct n8n Check (with verbose output)
echo "📍 Test 3: Direct N8N Webhook Check"
echo "POST $WEBHOOK_URL"
echo "Note: This may timeout if n8n webhook is not configured"
n8n_response=$(curl -s -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"type":"test","test":"data"}' \
  --max-time 3)
echo "Response: $n8n_response\n"

# Test 4: Send Test Message via API
echo "📍 Test 4: Send Test Message"
echo "POST $API_URL/send-message"
message_response=$(curl -s -X POST "$API_URL/send-message" \
  -H "Content-Type: application/json" \
  -d '{
    "chatId": "144818311295027@lid",
    "message": "Test message from webhook script"
  }')
echo "Response: $message_response\n"

echo "=============================="
echo "✅ Tests completed. Check responses above."
echo ""
echo "💡 If all tests pass but webhook still times out:"
echo "   1. Check n8n dashboard - is webhook active?"
echo "   2. Verify webhook path: /webhook-test/message"
echo "   3. Add a Response node in n8n workflow"
echo "   4. Check n8n execution logs"
