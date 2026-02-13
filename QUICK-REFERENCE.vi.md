# Zalo Personal - Tài liệu tra cứu nhanh

## Setup nhanh (Khuyến nghị)

```bash
# Cài mới hoặc cài lại (tự động detect và hỏi bạn)
bash <(curl -fsSL https://raw.githubusercontent.com/caochitam/zalo-personal/main/quick-install.sh)
```

## Lệnh cơ bản

### Login/Logout
```bash
# Login
openclaw channels login --channel zp

# Logout
openclaw channels logout --channel zp
```

### Kiểm tra trạng thái
```bash
openclaw status
```

### Onboarding
```bash
openclaw onboard
# Chọn "Zalo Personal Account" trong menu
```

## Quy trình Login QR

```
1. Chạy lệnh login
   ↓
2. QR code hiển thị
   ↓
3. Quét bằng Zalo app
   ↓
4. Xác nhận trên điện thoại
   ↓
5. ✓ Login thành công
   ↓
6. QR image tự động xóa
   ↓
7. Hỏi có restart gateway không
```

## Chế độ bảo mật DM

| Chế độ | Mô tả | Cấu hình |
|--------|-------|----------|
| **pairing** | User xin phép → Bạn approve | `dmPolicy: pairing` |
| **allowlist** | Chỉ user trong list | `dmPolicy: allowlist` |
| **open** | Ai cũng nhắn được | `dmPolicy: open` |
| **disabled** | Tắt DM | `dmPolicy: disabled` |

## Pairing Commands

```bash
# Xem danh sách requests
openclaw pairing list

# Chấp nhận
openclaw pairing approve zalo-personal <code>

# Từ chối
openclaw pairing reject zalo-personal <code>
```

## Cấu hình mẫu

### Pairing mode (Khuyến nghị)
```yaml
channels:
  zalo-personal:
    enabled: true
    dmPolicy: pairing
    groupPolicy: open
```

### Allowlist mode
```yaml
channels:
  zalo-personal:
    enabled: true
    dmPolicy: allowlist
    allowFrom:
      - "123456789"
      - "987654321"
    groupPolicy: open
```

### Open mode (Cẩn thận!)
```yaml
channels:
  zalo-personal:
    enabled: true
    dmPolicy: open
    allowFrom: ["*"]
    groupPolicy: open
```

## Xử lý sự cố nhanh

### QR không hiển thị
```bash
ls -lh /tmp/openclaw-zalo-personal-qr.png
```

### Login thất bại
```bash
openclaw channels logout --channel zp
openclaw channels login --channel zp
```

### Channel failed
```bash
openclaw gateway restart
```

### Không tìm được username
→ Dùng **pairing mode** hoặc User ID số

## Gateway Management

```bash
# Restart
openclaw gateway restart

# Stop
openclaw gateway stop

# Start
openclaw gateway start

# Logs
openclaw logs
openclaw logs --follow
```

## Config Management

```bash
# Xem config
openclaw config get

# Xem Zalo config
openclaw config get channels.zalo-personal

# Edit config
openclaw config edit

# Validate
openclaw doctor
```

## Security Audit

```bash
# Kiểm tra bảo mật
openclaw security audit --deep

# Tự động fix
openclaw security audit --fix
```

## File quan trọng

| File | Đường dẫn |
|------|-----------|
| Config | `~/.openclaw/openclaw.json` hoặc `config.yaml` |
| Credentials | `~/.openclaw/credentials/` |
| Sessions | `~/.openclaw/agents/main/sessions/` |
| Workspace | `~/.openclaw/workspace/` |
| Extension | `~/.openclaw/extensions/zalo-personal/` |
| QR temp file | `/tmp/openclaw-zalo-personal-qr.png` |

## Ports mặc định

| Service | Port | URL |
|---------|------|-----|
| Gateway | 18789 | http://127.0.0.1:18789 |
| Control UI | 18789 | http://127.0.0.1:18789/ |

## Checklist bảo mật

- [ ] ✅ Dùng pairing hoặc allowlist
- [ ] ✅ Gateway bind = loopback
- [ ] ✅ Enable mention gating trong group
- [ ] ✅ Không để secrets trong workspace
- [ ] ✅ Chạy `openclaw security audit --deep`
- [ ] ✅ Dùng model mạnh nhất
- [ ] ✅ Sandbox tools nếu enable

## Tài liệu khác

📖 **[README.md](./README.md)** - Quick start (English)

📖 **[INSTALL.md](./INSTALL.md)** - Hướng dẫn cài đặt chi tiết

## Support & Community

👥 **Nhóm Zalo:** https://zalo.me/g/zgictz077
- Hỏi đáp, thảo luận
- Báo lỗi, request tính năng
- Cập nhật phiên bản mới

🐛 **GitHub Issues:** https://github.com/caochitam/zalo-personal/issues

---

**Version**: 1.0.8 | **Updated**: 2026-02-13
