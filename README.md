# Zalo Personal Channel Extension

> Kết nối tài khoản Zalo cá nhân với OpenClaw qua đăng nhập QR code

## 🚀 Cài Đặt Nhanh (One-Liner)

Copy-paste lệnh này vào terminal:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/caochitam/zalo-personal/main/quick-install.sh)
```

**Xong!** Script sẽ tự động:
1. Cài đặt extension
2. Cho bạn chọn chế độ Open hoặc Pairing
3. Hiển thị QR code để đăng nhập
4. Tự động restart gateway

---

## Bắt Đầu Nhanh

### Đã Cài Rồi?

Chạy lại script để cấu hình lại, cập nhật, hoặc cài lại:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/caochitam/zalo-personal/main/quick-install.sh)
```

Script sẽ phát hiện cài đặt hiện tại và hỏi bạn muốn:
- **Dùng extension hiện có** (chỉ cấu hình lại)
- **Cập nhật lên phiên bản mới nhất** (update an toàn)
- **Cài lại từ đầu** (xóa và cài mới)

### Đăng Nhập Thủ Công

Nếu đã cấu hình xong, chỉ cần đăng nhập:

```bash
# Đăng nhập Zalo Personal
openclaw channels login --channel zalo-personal

# Hoặc dùng alias ngắn
openclaw channels login --channel zp
```

### Cập Nhật

Cập nhật lên phiên bản mới nhất bằng một lệnh:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/caochitam/zalo-personal/main/script/update.sh)
```

Script cập nhật sẽ:
- ✅ Kiểm tra phiên bản hiện tại vs mới nhất
- ✅ Tạo backup tự động trong `/tmp`
- ✅ Tải và cài đặt phiên bản mới từ npm
- ✅ Giữ nguyên cấu hình của bạn
- ✅ Hỏi restart gateway

**Hoặc** dùng script cài đặt nhanh (chọn option 2):

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/caochitam/zalo-personal/main/quick-install.sh)
# Sau đó chọn [2] Update to latest version
```

---

## Tính Năng

- ✅ **Đăng nhập QR Code** - Không cần CLI tools, dùng thư viện `zca-js`
- ✅ **Hỗ trợ Hình ảnh 2 Chiều** - Upload ảnh AI-generated và download ảnh từ Zalo
  - Upload ảnh local (từ nano-banana, DALL-E, v.v.)
  - Download ảnh từ tin nhắn Zalo để dùng làm input cho AI skills
  - Tích hợp hoàn toàn với hệ thống native image của OpenClaw
- ✅ **Tự động dọn dẹp** - QR image tự động xóa sau khi đăng nhập
- ✅ **Restart Gateway** - Hỏi restart để nhận diện certificate
- ✅ **Chế độ Pairing** - Kiểm soát ai được nhắn tin với bot
- ✅ **Hỗ trợ Nhóm** - Hoạt động với cả tin nhắn riêng và nhóm
- ✅ **Blocklist/Denylist** - Chặn người dùng không mong muốn
- ✅ **Ổn định & Tin cậy** - Xây dựng trên thư viện zca-js đã kiểm nghiệm

---

## Quy Trình Đăng Nhập

1. Chạy lệnh đăng nhập
2. QR code hiển thị trong terminal
3. Quét bằng app Zalo trên điện thoại
4. Xác nhận trên điện thoại
5. ✓ Đăng nhập thành công!
6. QR image tự động xóa
7. Tùy chọn: Restart gateway

---

## Chế Độ Bảo Mật

### Pairing (Khuyến nghị)

User yêu cầu pairing → Bạn chấp nhận → Họ có thể nhắn tin

```yaml
channels:
  zalo-personal:
    dmPolicy: pairing
```

**Cách sử dụng:**
1. User gửi tin nhắn lần đầu → Bot yêu cầu pair
2. Bạn reply tin nhắn của bot để approve
3. ✓ User có thể nhắn tin với bot

### Allowlist (Danh sách cho phép)

Chỉ những người cụ thể mới được nhắn tin

```yaml
channels:
  zalo-personal:
    dmPolicy: allowlist
    allowFrom:
      - "Alice"           # Tên hiển thị
      - "0987654321"      # Số điện thoại
      - "Bob Nguyễn"
```

**Lưu ý:** Tên phải khớp chính xác với tên hiển thị trong Zalo

### Open (Mở cửa)

Nhận tin nhắn từ mọi người

```yaml
channels:
  zalo-personal:
    dmPolicy: open
```

**Cảnh báo:** Chế độ này cho phép bất kỳ ai nhắn tin với bot. Chỉ dùng để test hoặc bot công khai.

---

## Blocklist (Chặn Người Dùng)

### Chặn User Toàn Cục

Chặn người dùng trong mọi ngữ cảnh (DM và nhóm):

```yaml
channels:
  zalo-personal:
    dmPolicy: open
    allowFrom: ["*"]
    denyFrom:
      - "Tên Spam User"    # Tự động resolve sang ID
      - "123456789"        # Hoặc dùng ID trực tiếp
      - "Troll Account"
```

### Chặn User Trong Nhóm Cụ Thể

Chặn người dùng chỉ trong một nhóm nhất định:

```yaml
channels:
  zalo-personal:
    groupPolicy: allowlist
    groups:
      "Nhóm Công Việc":
        allow: true
        denyUsers:
          - "Bob"           # Bob bị chặn chỉ trong nhóm này
          - "987654321"
```

### Quy Tắc Ưu Tiên

- **Deny LUÔN thắng Allow** - Security-first
- User trong cả `allowFrom` và `denyFrom` → **BỊ CHẶN**
- Wildcard `"*"` trong allowFrom + cụ thể trong denyFrom → Những user đó BỊ CHẶN

### Ví Dụ: Kết Hợp Allow/Deny

```yaml
channels:
  zalo-personal:
    dmPolicy: open
    allowFrom: ["*"]       # Cho phép tất cả
    denyFrom:
      - "Spammer"          # Trừ những người này
      - "BadActor"
    groupPolicy: allowlist
    groups:
      "Nhóm Công Khai":
        allow: true
        denyUsers:
          - "Charlie"      # Charlie bị chặn trong nhóm này
```

### Resolve Tên Tự Động

Extension tự động resolve tên thân thiện sang ID:
- Tìm trong danh sách bạn bè khi khởi động
- Hiển thị log: `Name→ID` khi resolve thành công
- Cảnh báo nếu không tìm thấy tên

**Lưu ý:** Restart gateway sau khi thay đổi blocklist để áp dụng:
```bash
openclaw gateway restart
```

---

## Quản Lý Blocklist Qua AI Tool

Bot có thể tự quản lý blocklist thông qua AI tool:

```
User: "Chặn user Bob đi"
AI: *calls tool* { action: "block-user", userId: "Bob" }
Bot: ✅ User Bob (ID: 123456) đã bị chặn toàn cục
     ⚠️ Restart gateway để áp dụng: openclaw gateway restart
```

### Tool Actions Có Sẵn

- `block-user` - Chặn user toàn cục
- `unblock-user` - Bỏ chặn user toàn cục
- `block-user-in-group` - Chặn user trong nhóm cụ thể
- `unblock-user-in-group` - Bỏ chặn user trong nhóm
- `list-blocked` - Xem danh sách user bị chặn
- `list-allowed` - Xem danh sách user được phép

Tất cả actions đều hỗ trợ resolve tên tự động.

---

## Cấu Hình Nâng Cao

### Cho Phép Nhóm Cụ Thể

```yaml
channels:
  zalo-personal:
    groupPolicy: allowlist
    groups:
      "Nhóm Team":
        allow: true
        enabled: true
      "Nhóm Gia Đình":
        allow: true
```

### Chặn Cả Nhóm

```yaml
channels:
  zalo-personal:
    groups:
      "Nhóm Spam":
        allow: false      # Chặn toàn bộ nhóm này
```

### Tool Policy Theo Người Gửi

```yaml
channels:
  zalo-personal:
    groups:
      "Nhóm Admin":
        allow: true
        tools:
          bySender:
            "Admin User":
              allow: ["*"]  # Admin được dùng tất cả tools
            "Regular User":
              deny: ["bash", "write"]  # User thường bị giới hạn
```

---

## Gỡ Cài Đặt

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/caochitam/zalo-personal/main/script/uninstall.sh)
```

Script sẽ:
- Logout khỏi channel
- Disable plugin
- Xóa extension directory
- Dọn dẹp config
- Hỏi restart gateway

---

## Troubleshooting

### QR Code Không Hiển Thị

```bash
# Kiểm tra package đã cài chưa
npm list -g qrcode-terminal

# Cài lại nếu thiếu
npm install -g qrcode-terminal
```

### Đăng Nhập Thất Bại

```bash
# Xóa credentials cũ
rm -rf ~/.openclaw/extensions/zalo-personal/credentials

# Thử đăng nhập lại
openclaw channels login --channel zp
```

### Tin Nhắn Không Được Xử Lý

1. Kiểm tra logs: `openclaw logs --follow`
2. Verify dmPolicy/groupPolicy settings
3. Kiểm tra allowFrom/denyFrom lists
4. Restart gateway: `openclaw gateway restart`

### User Vẫn Nhắn Tin Được Dù Đã Chặn

1. Kiểm tra logs khi khởi động để xem name resolution
2. Verify tên khớp chính xác với tên hiển thị
3. Dùng ID số nếu tên không resolve được
4. Restart gateway sau khi sửa config

### Cập Nhật Thất Bại

Nếu script update fail:

```bash
# Kiểm tra backups trong /tmp
ls -lah /tmp/zalo-personal-backup-*

# Khôi phục từ backup mới nhất
cd ~/.openclaw/extensions/
rm -rf zalo-personal
mv /tmp/zalo-personal-backup-YYYYMMDD-HHMMSS zalo-personal
openclaw gateway restart
```

**Lưu ý:** Backup trong `/tmp` tự động xóa sau reboot

---

## Phát Triển

### Cài Đặt Local

```bash
git clone https://github.com/caochitam/zalo-personal.git
cd zalo-personal
npm install
openclaw plugins install .
```

### Testing

```bash
# Test login
openclaw channels login --channel zp

# Test messaging
openclaw channels send --channel zp --to "USER_ID" --message "Test"

# Monitor logs
openclaw logs --follow
```

---

## Tech Stack

- **zca-js** - Unofficial Zalo API library
- **OpenClaw** - AI messaging gateway platform
- **TypeScript** - Type-safe development
- **Node.js** - Runtime environment

---

## Đóng Góp

Contributions are welcome!

1. Fork repo
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

---

## License

MIT License - xem [LICENSE](LICENSE) để biết chi tiết

---

## Liên Hệ

- **Issues:** https://github.com/caochitam/zalo-personal/issues
- **Discussions:** https://github.com/caochitam/zalo-personal/discussions
- **Email:** caochitam@gmail.com

---

## Changelog

### v1.3.1 (Latest) - 2026-02-14
- 🐛 **Fixed**: Image detection in current prompt vs history
  - Images now properly recognized as "in prompt" instead of "in history"
  - LLM vision/analysis now uses correct uploaded image

### v1.3.0 - 2026-02-14
- ✨ **Native Image Input**: Download images from Zalo messages for AI skills
  - Images saved to `~/.openclaw/workspace/media/` with timestamped filenames
  - Full integration with nano-banana and other image-processing skills
  - Support for multiple images (up to 14 images)

### v1.2.4 - 2026-02-14
- 🐛 **Fixed**: Race condition - auto-cleanup deleting files before OpenClaw processing
  - Changed `cleanupAfterUpload` default from `true` to `false`

### v1.2.3 - 2026-02-14
- ✨ **Image Metadata Support**: Added `imageMetadataGetter` for zca-js v2.0+
  - Uses `sharp` library to read image dimensions

### v1.2.2 - 2026-02-14
- 🐛 **Fixed**: DM messages incorrectly routed to per-channel sessions
  - DM messages now correctly use `kind: "direct"`
  - Messages now visible in OpenClaw webui

### v1.2.1 - 2026-02-14
- ✨ **Local File Upload**: Upload local images generated by AI skills to Zalo
  - Integration with zca-js `sendMessage` attachments parameter
  - Support for AI-generated images from skills like nano-banana

### v1.1.2
- 🔧 Move backup to `/tmp` for auto cleanup after reboot
- 🔧 Better UX for update script

### v1.1.1
- ✨ Add safe shell-based update mechanism
- ✨ Update option in quick-install script

### v1.1.0
- ✨ Blocklist/denylist features (global + group-specific)
- ✨ AI tool for blocklist management
- ✨ Automatic name→ID resolution

See [CHANGELOG.md](CHANGELOG.md) for detailed change history.

---

## Tài Liệu Khác

- 🇬🇧 [README.en.md](README.en.md) - English documentation
- 📖 [INSTALL.md](INSTALL.md) - Hướng dẫn cài đặt nhanh
- ⚡ [QUICK-REFERENCE.vi.md](QUICK-REFERENCE.vi.md) - Tham khảo lệnh nhanh
- 🚀 [DEPLOY.md](DEPLOY.md) - Hướng dẫn deploy (cho developers)

---

**Made with ❤️ by caochitam**

*Powered by OpenClaw + zca-js*
