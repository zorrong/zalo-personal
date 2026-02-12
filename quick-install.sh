#!/bin/bash
# Zalo Personal Extension - Quick Install Script
# Usage: curl -fsSL https://raw.githubusercontent.com/caochitam/zalo-personal/main/quick-install.sh | bash

set -e

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║     🚀 Zalo Personal Extension - Quick Install           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Check if openclaw is installed
if ! command -v openclaw &> /dev/null; then
    echo "❌ OpenClaw chưa được cài đặt!"
    echo "📥 Cài OpenClaw trước: npm install -g openclaw"
    exit 1
fi

echo "✅ OpenClaw detected"
echo ""

# Step 1: Install extension
echo "📦 Đang cài đặt extension zalo-personal..."
openclaw ext add zalo-personal

if [ $? -ne 0 ]; then
    echo "❌ Cài đặt thất bại!"
    exit 1
fi

echo "✅ Cài đặt extension thành công!"
echo ""

# Step 2: Choose mode
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

# Step 3: Configure channel
CONFIG_FILE="$HOME/.openclaw/openclaw.json"

if [ ! -f "$CONFIG_FILE" ]; then
    echo "❌ Không tìm thấy file config: $CONFIG_FILE"
    exit 1
fi

echo "🔧 Đang cấu hình channel..."

# Backup config
cp "$CONFIG_FILE" "$CONFIG_FILE.backup"

# Get extension directory
EXT_DIR="$HOME/.openclaw/extensions/zalo-personal"

# Use Node.js helper to update config
node "$EXT_DIR/config-helper.js" "$MODE"

if [ $? -ne 0 ]; then
    echo "❌ Cấu hình thất bại!"
    exit 1
fi
echo ""

# Step 4: Login with QR
echo "🔐 Đăng nhập Zalo..."
echo "📱 Mở app Zalo > QR icon > Quét mã QR bên dưới"
echo ""

# Run login command
openclaw channel login zalo-personal

if [ $? -ne 0 ]; then
    echo "❌ Đăng nhập thất bại!"
    exit 1
fi

echo ""
echo "✅ Đăng nhập thành công!"
echo ""

# Step 5: Restart gateway
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
echo "  openclaw send -c zalo-personal -to YOUR_USER_ID \"Hello!\""
echo ""
echo "🔍 Xem User ID của bạn:"
echo "  openclaw channel status zalo-personal"
echo ""

if [ "$MODE" = "pairing" ]; then
    echo "⚠️  PAIRING MODE: Nhớ pair với user trước khi chat!"
    echo "   Chat với bot và reply tin nhắn để pair."
    echo ""
fi

echo "📚 Docs: https://github.com/caochitam/zalo-personal"
echo ""
