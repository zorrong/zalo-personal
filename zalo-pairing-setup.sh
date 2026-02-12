#!/bin/bash
# Zalo Personal - Pairing Mode Setup Script
# Không cần onboarding phức tạp

echo "🦞 Zalo Personal - Pairing Mode Setup"
echo "======================================"
echo ""

# Step 1: Update config to pairing mode
echo "📝 Step 1: Setting pairing mode in config..."
cat > /tmp/zalo-config-patch.json << 'EOF'
{
  "channels": {
    "zalo-personal": {
      "enabled": true,
      "dmPolicy": "pairing",
      "groupPolicy": "open"
    }
  },
  "plugins": {
    "entries": {
      "zalo-personal": {
        "enabled": true
      }
    }
  }
}
EOF

# Merge with existing config
jq -s '.[0] * .[1]' ~/.openclaw/openclaw.json /tmp/zalo-config-patch.json > /tmp/openclaw-merged.json
mv /tmp/openclaw-merged.json ~/.openclaw/openclaw.json
rm /tmp/zalo-config-patch.json

echo "✅ Config updated: dmPolicy = pairing, groupPolicy = open"
echo ""

# Step 2: Restart gateway
echo "🔄 Step 2: Restarting gateway..."
openclaw gateway restart
sleep 3
echo "✅ Gateway restarted"
echo ""

# Step 3: Login
echo "📱 Step 3: Starting Zalo login..."
echo "⚠️  IMPORTANT: Scan the QR code QUICKLY (within 30 seconds)"
echo ""

openclaw channels login --channel zalo-personal

# Check result
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ SUCCESS! Zalo Personal is now configured with pairing mode"
    echo ""
    echo "📚 How to use:"
    echo "   1. When someone messages you first time, they get a pairing code"
    echo "   2. You approve with: openclaw pairing approve zalo-personal <code>"
    echo "   3. After approval, they can chat normally"
    echo ""
    echo "📋 Useful commands:"
    echo "   openclaw pairing list                     - See pending requests"
    echo "   openclaw pairing approve zalo-personal X  - Approve request"
    echo "   openclaw status                           - Check channel status"
else
    echo ""
    echo "❌ Login failed. Try again:"
    echo "   bash /root/zalo-pairing-setup.sh"
fi
