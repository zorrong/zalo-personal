#!/bin/bash
# Zalo Personal Extension - Uninstall Script
# Usage: bash <(curl -fsSL https://raw.githubusercontent.com/caochitam/zalo-personal/main/script/uninstall.sh)

set -e

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║     🗑️  Zalo Personal Extension - Uninstall              ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

CONFIG_FILE="$HOME/.openclaw/openclaw.json"
EXT_DIR="$HOME/.openclaw/extensions/zalo-personal"
PLUGIN_ID="zalo-personal"

# Check if openclaw is installed
if ! command -v openclaw &> /dev/null; then
    echo "❌ OpenClaw chưa được cài đặt!"
    echo "ℹ️  Không cần uninstall."
    exit 0
fi

echo "✅ OpenClaw detected"
echo ""

# Check if plugin is installed
if [ ! -d "$EXT_DIR" ]; then
    echo "ℹ️  Plugin zalo-personal chưa được cài đặt"
    echo "📁 Thư mục không tồn tại: $EXT_DIR"

    # Check if there's config entry but no files (stale config)
    if [ -f "$CONFIG_FILE" ]; then
        HAS_CONFIG=$(node -e "
        const fs = require('fs');
        try {
          const c = JSON.parse(fs.readFileSync('$CONFIG_FILE', 'utf8'));
          const hasPlugin = c.plugins?.entries?.['$PLUGIN_ID'];
          const hasInstall = c.plugins?.installs?.['$PLUGIN_ID'];
          const hasChannel = c.channels?.['$PLUGIN_ID'];
          console.log((hasPlugin || hasInstall || hasChannel) ? 'yes' : 'no');
        } catch { console.log('no'); }
        " 2>/dev/null)

        if [ "$HAS_CONFIG" = "yes" ]; then
            echo ""
            echo "⚠️  Tuy nhiên phát hiện config còn sót lại trong openclaw.json"
            read -p "🧹 Bạn có muốn dọn dẹp config? (y/n): " CLEANUP

            if [[ "$CLEANUP" =~ ^[Yy]$ ]]; then
                echo "🧹 Đang dọn dẹp config..."
                node -e "
                const fs = require('fs');
                const path = '$CONFIG_FILE';
                try {
                  const config = JSON.parse(fs.readFileSync(path, 'utf8'));

                  // Remove plugin entries
                  if (config.plugins?.entries?.['$PLUGIN_ID']) {
                    delete config.plugins.entries['$PLUGIN_ID'];
                  }
                  if (config.plugins?.installs?.['$PLUGIN_ID']) {
                    delete config.plugins.installs['$PLUGIN_ID'];
                  }

                  // Remove channel config
                  if (config.channels?.['$PLUGIN_ID']) {
                    delete config.channels['$PLUGIN_ID'];
                  }

                  fs.writeFileSync(path, JSON.stringify(config, null, 2));
                  console.log('✅ Config đã được dọn dẹp!');
                } catch (e) {
                  console.error('❌ Lỗi khi dọn dẹp config:', e.message);
                  process.exit(1);
                }
                "
                echo ""
            fi
        fi
    fi

    echo "✅ Hoàn tất!"
    exit 0
fi

echo "📦 Plugin được tìm thấy tại: $EXT_DIR"
echo ""

# Show what will be removed
echo "🗑️  Các thành phần sẽ được gỡ bỏ:"
echo "   ├─ Plugin: zalo-personal"
echo "   ├─ Thư mục: $EXT_DIR"
echo "   ├─ Config trong openclaw.json"
echo "   └─ Channel: zalo-personal"
echo ""

# Confirm before uninstall
read -p "⚠️  Bạn có chắc muốn gỡ cài đặt? (y/n): " CONFIRM

if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
    echo "❌ Đã hủy uninstall"
    exit 0
fi

echo ""
echo "🚀 Bắt đầu gỡ cài đặt..."
echo ""

# Step 1: Logout from channel if logged in
echo "📤 [1/4] Đăng xuất khỏi channel..."
openclaw channels logout --channel "$PLUGIN_ID" 2>/dev/null || echo "   ℹ️  Channel chưa đăng nhập hoặc đã logout"
echo ""

# Step 2: Disable plugin
echo "🔌 [2/4] Tắt plugin..."
openclaw plugins disable "$PLUGIN_ID" 2>/dev/null || echo "   ℹ️  Plugin đã bị tắt hoặc không active"
echo ""

# Step 3: Remove extension directory
echo "🗑️  [3/4] Xóa thư mục extension..."
if [ -d "$EXT_DIR" ]; then
    rm -rf "$EXT_DIR"
    echo "   ✅ Đã xóa: $EXT_DIR"
else
    echo "   ℹ️  Thư mục không tồn tại"
fi
echo ""

# Step 4: Clean up config
echo "🧹 [4/4] Dọn dẹp config..."
if [ -f "$CONFIG_FILE" ]; then
    node -e "
    const fs = require('fs');
    const path = '$CONFIG_FILE';
    try {
      const config = JSON.parse(fs.readFileSync(path, 'utf8'));

      let cleaned = false;

      // Remove from plugins.entries
      if (config.plugins && config.plugins.entries && config.plugins.entries['$PLUGIN_ID']) {
        delete config.plugins.entries['$PLUGIN_ID'];
        cleaned = true;
      }

      // Remove from plugins.installs
      if (config.plugins && config.plugins.installs && config.plugins.installs['$PLUGIN_ID']) {
        delete config.plugins.installs['$PLUGIN_ID'];
        cleaned = true;
      }

      // Remove channel config
      if (config.channels && config.channels['$PLUGIN_ID']) {
        delete config.channels['$PLUGIN_ID'];
        cleaned = true;
      }

      if (cleaned) {
        fs.writeFileSync(path, JSON.stringify(config, null, 2));
        console.log('   ✅ Config đã được dọn dẹp');
      } else {
        console.log('   ℹ️  Không có config cần dọn dẹp');
      }
    } catch (e) {
      console.error('   ⚠️  Lỗi khi dọn dẹp config:', e.message);
    }
    "
else
    echo "   ℹ️  Config file không tồn tại"
fi
echo ""

# Ask to restart gateway
echo "─────────────────────────────────────────────────────────────"
echo "✅ Đã gỡ cài đặt thành công!"
echo ""
read -p "🔄 Restart OpenClaw gateway để áp dụng thay đổi? (y/n): " RESTART

if [[ "$RESTART" =~ ^[Yy]$ ]]; then
    echo ""
    echo "🔄 Đang restart gateway..."
    openclaw gateway restart
    echo ""
    echo "✅ Gateway đã được restart!"
else
    echo ""
    echo "ℹ️  Nhớ restart gateway thủ công sau:"
    echo "   openclaw gateway restart"
fi

echo ""
echo "─────────────────────────────────────────────────────────────"
echo "🎉 Hoàn tất! Zalo Personal đã được gỡ bỏ hoàn toàn."
echo ""
echo "📚 Nếu bạn muốn cài lại sau:"
echo "   bash <(curl -fsSL https://raw.githubusercontent.com/caochitam/zalo-personal/main/quick-install.sh)"
echo ""
echo "💬 Góp ý hoặc báo lỗi:"
echo "   https://github.com/caochitam/zalo-personal/issues"
echo ""
