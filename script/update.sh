#!/bin/bash
# Zalo Personal Extension - Update Script
# Usage: bash <(curl -fsSL https://raw.githubusercontent.com/caochitam/zalo-personal/main/script/update.sh)

set -e

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║     🔄 Zalo Personal Extension - Update                  ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

EXT_DIR="$HOME/.openclaw/extensions/zalo-personal"
PLUGIN_ID="zalo-personal"

# Check if openclaw is installed
if ! command -v openclaw &> /dev/null; then
    echo "❌ OpenClaw chưa được cài đặt!"
    echo "📥 Vui lòng cài đặt OpenClaw trước:"
    echo "   https://openclaw.ai"
    exit 1
fi

echo "✅ OpenClaw detected"
echo ""

# Check if plugin is installed
if [ ! -d "$EXT_DIR" ]; then
    echo "❌ Plugin zalo-personal chưa được cài đặt!"
    echo "📁 Thư mục không tồn tại: $EXT_DIR"
    echo ""
    echo "📥 Vui lòng cài đặt plugin trước:"
    echo "   bash <(curl -fsSL https://raw.githubusercontent.com/caochitam/zalo-personal/main/quick-install.sh)"
    exit 1
fi

echo "📦 Plugin được tìm thấy tại: $EXT_DIR"
echo ""

# Read current version
CURRENT_VERSION="unknown"
if [ -f "$EXT_DIR/package.json" ]; then
    CURRENT_VERSION=$(node -e "
    try {
      const pkg = require('$EXT_DIR/package.json');
      console.log(pkg.version);
    } catch { console.log('unknown'); }
    " 2>/dev/null)
fi

echo "📌 Phiên bản hiện tại: v$CURRENT_VERSION"
echo ""

# Check latest version from npm
echo "🔍 Đang kiểm tra phiên bản mới nhất từ npm..."
LATEST_VERSION=$(npm show "$PLUGIN_ID" version 2>/dev/null || echo "unknown")

if [ "$LATEST_VERSION" = "unknown" ]; then
    echo "❌ Không thể kiểm tra phiên bản mới nhất từ npm"
    echo "ℹ️  Vui lòng kiểm tra kết nối internet"
    exit 1
fi

echo "📦 Phiên bản mới nhất: v$LATEST_VERSION"
echo ""

# Check if already up-to-date
if [ "$CURRENT_VERSION" = "$LATEST_VERSION" ]; then
    echo "✅ Plugin đã ở phiên bản mới nhất (v$LATEST_VERSION)"
    echo ""
    read -p "🔄 Bạn có muốn cài đặt lại phiên bản hiện tại? (y/n): " REINSTALL

    if [[ ! "$REINSTALL" =~ ^[Yy]$ ]]; then
        echo "❌ Đã hủy update"
        exit 0
    fi
    echo ""
fi

# Confirm before update
echo "🔄 Cập nhật sẽ được thực hiện:"
echo "   v$CURRENT_VERSION → v$LATEST_VERSION"
echo ""
read -p "⚠️  Tiếp tục cập nhật? (y/n): " CONFIRM

if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
    echo "❌ Đã hủy update"
    exit 0
fi

echo ""
echo "🚀 Bắt đầu cập nhật..."
echo ""

# Backup current version
BACKUP_DIR="$EXT_DIR.backup-$(date +%Y%m%d-%H%M%S)"
echo "💾 [1/4] Tạo backup..."
cp -r "$EXT_DIR" "$BACKUP_DIR"
echo "   ✅ Backup tại: $BACKUP_DIR"
echo ""

# Download and extract latest version
echo "📥 [2/4] Tải phiên bản mới từ npm..."
cd "$EXT_DIR"

# Remove old tarball if exists
rm -f zalo-personal-*.tgz 2>/dev/null || true

# Download latest
npm pack "$PLUGIN_ID@latest" 2>&1 | grep -v "npm notice"

if [ ! -f zalo-personal-*.tgz ]; then
    echo "❌ Không thể tải package từ npm"
    echo "🔄 Khôi phục backup..."
    rm -rf "$EXT_DIR"
    mv "$BACKUP_DIR" "$EXT_DIR"
    exit 1
fi

echo "   ✅ Đã tải: $(ls zalo-personal-*.tgz)"
echo ""

# Extract
echo "📦 [3/4] Giải nén và cập nhật..."
tar -xzf zalo-personal-*.tgz --strip-components=1
rm -f zalo-personal-*.tgz
echo "   ✅ Đã giải nén thành công"
echo ""

# Read new version
NEW_VERSION="unknown"
if [ -f "$EXT_DIR/package.json" ]; then
    NEW_VERSION=$(node -e "
    try {
      const pkg = require('$EXT_DIR/package.json');
      console.log(pkg.version);
    } catch { console.log('unknown'); }
    " 2>/dev/null)
fi

echo "🎉 [4/4] Hoàn tất cập nhật!"
echo "   v$CURRENT_VERSION → v$NEW_VERSION"
echo ""

# Cleanup backup
read -p "🗑️  Xóa backup (giữ backup nếu có vấn đề)? (y/n): " CLEANUP

if [[ "$CLEANUP" =~ ^[Yy]$ ]]; then
    rm -rf "$BACKUP_DIR"
    echo "   ✅ Đã xóa backup"
else
    echo "   📁 Backup được giữ lại tại: $BACKUP_DIR"
fi

echo ""
echo "─────────────────────────────────────────────────────────────"
echo "✅ Cập nhật thành công!"
echo ""
read -p "🔄 Restart OpenClaw gateway để áp dụng? (y/n): " RESTART

if [[ "$RESTART" =~ ^[Yy]$ ]]; then
    echo ""
    echo "🔄 Đang restart gateway..."
    openclaw gateway restart
    echo ""
    echo "✅ Gateway đã được restart!"
else
    echo ""
    echo "⚠️  QUAN TRỌNG: Restart gateway để áp dụng cập nhật:"
    echo "   openclaw gateway restart"
fi

echo ""
echo "─────────────────────────────────────────────────────────────"
echo "🎉 Hoàn tất! Zalo Personal đã được cập nhật."
echo ""
echo "📚 Xem changelog tại:"
echo "   https://github.com/caochitam/zalo-personal/releases"
echo ""
echo "💬 Góp ý hoặc báo lỗi:"
echo "   https://github.com/caochitam/zalo-personal/issues"
echo ""
