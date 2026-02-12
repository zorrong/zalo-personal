#!/bin/bash
# Clean config and install zalo-personal extension
# Usage: bash <(curl -fsSL https://raw.githubusercontent.com/caochitam/zalo-personal/main/clean-and-install.sh)

set -e

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║   🧹 Zalo Personal - Clean Config & Fresh Install       ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

CONFIG_FILE="$HOME/.openclaw/openclaw.json"

# Check if OpenClaw is installed
if ! command -v openclaw &> /dev/null; then
    echo "❌ OpenClaw chưa được cài đặt!"
    echo "📥 Cài OpenClaw trước: npm install -g openclaw"
    exit 1
fi

echo "✅ OpenClaw detected"
echo ""

# Step 1: Clean old config references
if [ -f "$CONFIG_FILE" ]; then
    echo "🧹 Đang dọn dẹp config cũ..."

    # Backup config
    cp "$CONFIG_FILE" "$CONFIG_FILE.backup-$(date +%s)"
    echo "   📋 Backup created: $CONFIG_FILE.backup-*"

    # Clean using Node.js
    node -e "
    const fs = require('fs');
    const path = '$CONFIG_FILE';

    try {
      const config = JSON.parse(fs.readFileSync(path, 'utf8'));

      // Remove zalo-personal from channels
      if (config.channels && config.channels['zalo-personal']) {
        delete config.channels['zalo-personal'];
        console.log('   ✓ Removed channels.zalo-personal');
      }

      // Remove zalo-personal from plugins.entries
      if (config.plugins && config.plugins.entries && config.plugins.entries['zalo-personal']) {
        delete config.plugins.entries['zalo-personal'];
        console.log('   ✓ Removed plugins.entries.zalo-personal');
      }

      fs.writeFileSync(path, JSON.stringify(config, null, 2));
      console.log('   ✅ Config cleaned!');
    } catch (error) {
      console.error('   ⚠️  Warning: Could not clean config:', error.message);
    }
    "

    echo ""
else
    echo "⚠️  Config file not found, will be created during setup"
    echo ""
fi

# Step 2: Remove old plugin if exists
if [ -d "$HOME/.openclaw/extensions/zalo-personal" ]; then
    echo "🗑️  Xóa plugin cũ..."
    # Change to safe directory before removing
    cd /tmp
    openclaw plugins disable zalo-personal 2>/dev/null || true
    rm -rf "$HOME/.openclaw/extensions/zalo-personal"
    echo "✅ Đã xóa plugin cũ"
    echo ""

    # Restart gateway to unload plugin
    echo "🔄 Đang restart gateway..."
    openclaw gateway restart
    echo "   ⏳ Đợi gateway khởi động..."
    sleep 5
    echo "✅ Gateway đã restart"
    echo ""
fi

# Step 3: Run installation
echo "📦 Đang cài đặt zalo-personal (latest version)..."
echo "⚠️  Có thể xuất hiện warning về 'dangerous code patterns' - điều này bình thường"
echo "    (Extension cần quyền restart gateway)"
echo ""

openclaw plugins install zalo-personal

if [ $? -ne 0 ]; then
    echo "❌ Cài đặt thất bại!"
    echo ""
    echo "🔍 Có thể thử:"
    echo "  1. Kiểm tra internet connection"
    echo "  2. Xem log: openclaw logs"
    echo "  3. Báo lỗi: https://github.com/caochitam/zalo-personal/issues"
    exit 1
fi

echo ""
echo "✅ Cài đặt extension thành công!"
echo ""

# Step 4: Choose mode
echo "🔧 Chọn chế độ hoạt động:"
echo ""
echo "  [1] Open Mode - Nhận tin nhắn từ mọi người (khuyến nghị cho test)"
echo "  [2] Pairing Mode - Chỉ nhận tin từ người đã pair (an toàn hơn)"
echo ""

while true; do
    read -p "Chọn mode [1/2]: " mode_choice
    case $mode_choice in
        1)
            MODE="open"
            break
            ;;
        2)
            MODE="pairing"
            break
            ;;
        *)
            echo "❌ Chọn 1 hoặc 2!"
            ;;
    esac
done

echo ""
echo "✅ Đã chọn: $MODE mode"
echo ""

# Step 5: Configure channel
echo "🔧 Đang cấu hình channel..."

# Get extension directory
EXT_DIR="$HOME/.openclaw/extensions/zalo-personal"

# Use Node.js helper to update config
node "$EXT_DIR/config-helper.cjs" "$MODE"

if [ $? -ne 0 ]; then
    echo "❌ Cấu hình thất bại!"
    exit 1
fi

echo ""

# Step 6: Login with QR
echo "🔐 Đăng nhập Zalo..."
echo "📱 Mở app Zalo > QR icon > Quét mã QR bên dưới"
echo ""

# Run login command
openclaw channels login --channel zalo-personal

if [ $? -ne 0 ]; then
    echo "❌ Đăng nhập thất bại!"
    exit 1
fi

echo ""
echo "✅ Đăng nhập thành công!"
echo ""

# Step 7: Restart gateway
echo "🔄 Đang khởi động lại gateway để nhận certificate..."
openclaw gateway restart

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║              🎉 CÀI ĐẶT HOÀN TẤT!                        ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""
echo "📋 Thông tin:"
echo "  • Extension: zalo-personal"
echo "  • Mode: $MODE"
echo "  • Status: Đã đăng nhập và khởi động gateway"
echo ""
echo "📖 Kiểm tra status:"
echo "  openclaw status"
echo ""
echo "💬 Gửi tin thử:"
echo "  openclaw message send --channel zalo-personal --target YOUR_USER_ID --message \"Hello!\""
echo ""
echo "🔍 Xem thông tin channel:"
echo "  openclaw channels list"
echo ""

if [ "$MODE" = "pairing" ]; then
    echo "⚠️  PAIRING MODE: Nhớ pair với user trước khi chat!"
    echo "   Chat với bot và reply tin nhắn để pair."
    echo ""
fi

echo "📚 Docs: https://github.com/caochitam/zalo-personal"
echo ""
