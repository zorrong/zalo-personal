#!/bin/bash
# Zalo Personal - Open Mode Setup Script
# Ai cũng có thể nhắn tin (không cần approve)

echo "🦞 Zalo Personal - Open Mode Setup"
echo "===================================="
echo ""
echo "⚠️  WARNING: Open mode allows ANYONE to message your bot!"
echo "    Only use this if:"
echo "    - Bot is public"
echo "    - No sensitive data"
echo "    - Tools are sandboxed"
echo ""
read -p "Continue? (yes/no): " confirm
if [ "$confirm" != "yes" ]; then
    echo "Cancelled."
    exit 1
fi
echo ""

# Step 1: Update config to open mode
echo "📝 Step 1: Setting open mode in config..."
cat > /tmp/zalo-config-patch.json << 'EOF'
{
  "channels": {
    "zalo-personal": {
      "enabled": true,
      "dmPolicy": "open",
      "allowFrom": ["*"],
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

echo "✅ Config updated: dmPolicy = open, allowFrom = [*]"
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
    echo "✅ SUCCESS! Zalo Personal is now in OPEN mode"
    echo ""
    echo "⚠️  SECURITY REMINDER:"
    echo "   - Anyone can message your bot"
    echo "   - Review security: openclaw security audit --deep"
    echo "   - Consider using pairing mode instead"
    echo ""
    echo "📋 Useful commands:"
    echo "   openclaw status           - Check channel status"
    echo "   openclaw security audit   - Security check"
else
    echo ""
    echo "❌ Login failed. Try again:"
    echo "   bash /root/zalo-open-setup.sh"
fi
