# Zalo Personal Channel - Hướng dẫn Onboarding

> Tài liệu này được tạo từ quá trình onboarding thực tế với OpenClaw 2026.2.9

## Mục lục
- [Giới thiệu](#giới-thiệu)
- [Yêu cầu](#yêu-cầu)
- [Quy trình Onboarding](#quy-trình-onboarding)
- [Cấu hình](#cấu-hình)
- [Bảo mật](#bảo-mật)
- [Xử lý sự cố](#xử-lý-sự-cố)

---

## Giới thiệu

Zalo Personal Channel cho phép bạn kết nối tài khoản Zalo cá nhân với OpenClaw thông qua thư viện `zca-js`. Không cần CLI tool bên ngoài.

### Tính năng chính
- ✅ Login qua QR code
- ✅ Tự động xóa QR image sau khi login thành công
- ✅ Tùy chọn restart gateway ngay sau login
- ✅ Hỗ trợ DM (Direct Message) và Group chat
- ✅ Pairing mode để kiểm soát ai được nhắn tin

---

## Yêu cầu

### Phần mềm
- OpenClaw 2026.2.9 hoặc mới hơn
- Node.js (đi kèm với OpenClaw)
- Ứng dụng Zalo trên điện thoại

### Kiến thức
- Hiểu biết cơ bản về bảo mật và access control
- Biết cách chạy lệnh terminal
- Hiểu về config file (YAML/JSON)

---

## Quy trình Onboarding

### Bước 1: Khởi động Onboarding

```bash
openclaw onboard
```

**Hoặc** nếu muốn login trực tiếp:
```bash
openclaw channels login --channel zalo-personal
# Hoặc dùng alias
openclaw channels login --channel zp
```

### Bước 2: Chọn chế độ Onboarding

Khi được hỏi "Onboarding mode":
- **QuickStart** (Khuyến nghị): Cấu hình nhanh với các giá trị mặc định
- **Manual/Advanced**: Cấu hình chi tiết từng bước

### Bước 3: Đọc và chấp nhận cảnh báo bảo mật

```
Security warning — please read.

OpenClaw is a hobby project and still in beta. Expect sharp edges.
This bot can read files and run actions if tools are enabled.
A bad prompt can trick it into doing unsafe things.

Recommended baseline:
- Pairing/allowlists + mention gating.
- Sandbox + least-privilege tools.
- Keep secrets out of the agent's reachable filesystem.
```

Chọn **Yes** để tiếp tục.

### Bước 4: Chọn Channel

Trong menu channels, tìm và chọn:
```
Zalo Personal Account
```

### Bước 5: Login với QR Code

#### 5.1. QR Code được hiển thị
```
▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
█ ▄▄▄▄▄ ██▄▄▄ ▀▀██▀▄█▀▄██ ▀▄██▄▄█ █ ▄▄▄▄▄ █
█ █   █ █▀██▀▀▄█▄▄▄▄█▄ ▀▀█▀▄▀▀██▀ █ █   █ █
[QR CODE]
```

**Thông tin quan trọng:**
```
QR image saved at: /tmp/openclaw-zalo-personal-qr.png
```

#### 5.2. Quét QR code
1. Mở app Zalo trên điện thoại
2. Vào Menu → Quét mã QR
3. Quét mã QR hiển thị trên terminal
4. Xác nhận trên điện thoại

#### 5.3. Sau khi login thành công
```
✓ Login successful!
✓ QR image deleted: /tmp/openclaw-zalo-personal-qr.png
```

QR image được **tự động xóa** để đảm bảo bảo mật.

### Bước 6: Restart Gateway

Sau khi login, bạn sẽ được hỏi:
```
◇ Restart gateway now? (Required for certificate to be recognized)
```

**Khuyến nghị**: Chọn **Yes**

Lý do: Gateway cần restart để nhận certificate từ Zalo và kết nối ổn định.

```
◇ Gateway
│ Restarting gateway...
```

### Bước 7: Cấu hình DM Policy

#### 7.1. Chọn người được phép nhắn tin

```
▲ ZaloPersonal allowFrom (username or user id)
│ Alice, 123456789
```

**Các tùy chọn:**

##### Option 1: Nhập Display Name
```
Alice, Bob, Charlie
```
- Hệ thống tự động resolve thành User ID
- Chỉ hoạt động nếu đã login và có trong danh bạ

##### Option 2: Nhập User ID
```
123456789, 987654321, 111222333
```
- Chính xác nhất
- Không cần resolve

##### Option 3: Mix cả hai
```
Alice, 123456789, Bob
```

**Lưu ý**:
- User ID của Zalo rất khó nhớ và phân biệt
- **Khuyến nghị**: Dùng chế độ **pairing** thay vì allowlist (xem phần [Cấu hình nâng cao](#cấu-hình-nâng-cao))

### Bước 8: Cấu hình Group Access

```
◇ Configure Zalo groups access?
│ Yes
```

Chọn chế độ:
- **Open**: Cho phép tất cả các group
- **Allowlist**: Chỉ cho phép các group cụ thể
- **Disabled**: Tắt group chat

**Khuyến nghị**: Chọn **Open** nếu bạn quản lý các group của mình.

### Bước 9: Hoàn tất

```
✓ Updated ~/.openclaw/openclaw.json
✓ Workspace OK: ~/.openclaw/workspace
✓ Sessions OK: ~/.openclaw/agents/main/sessions
```

Channel đã sẵn sàng sử dụng!

---

## Cấu hình

### File cấu hình

Config được lưu tại: `~/.openclaw/openclaw.json` hoặc `~/.openclaw/config.yaml`

### Cấu hình cơ bản

```yaml
channels:
  zalo-personal:
    enabled: true
    dmPolicy: pairing
    groupPolicy: open
```

### Cấu hình nâng cao

#### Chế độ DM Policy

##### 1. Pairing (Khuyến nghị)
```yaml
channels:
  zalo-personal:
    enabled: true
    dmPolicy: pairing
```

**Cách hoạt động:**
- User gửi tin nhắn lần đầu → Nhận pairing code
- Admin approve: `openclaw pairing approve zalo-personal <code>`
- Sau khi approve, user có thể nhắn tin bình thường

**Ưu điểm:**
- ✅ Kiểm soát tốt ai được nhắn tin
- ✅ Không cần biết User ID trước
- ✅ Linh hoạt, dễ quản lý

##### 2. Allowlist
```yaml
channels:
  zalo-personal:
    enabled: true
    dmPolicy: allowlist
    allowFrom:
      - "123456789"
      - "987654321"
```

**Ưu điểm:**
- ✅ Chính xác, cố định
- ✅ Không cần approve

**Nhược điểm:**
- ❌ Phải biết User ID trước
- ❌ Zalo User ID rất khó nhớ

##### 3. Open
```yaml
channels:
  zalo-personal:
    enabled: true
    dmPolicy: open
    allowFrom: ["*"]
```

**Cảnh báo**: Ai cũng có thể nhắn tin với bot!

**Chỉ dùng khi:**
- Bot công khai
- Không có thông tin nhạy cảm
- Đã enable sandbox và giới hạn tools

##### 4. Disabled
```yaml
channels:
  zalo-personal:
    enabled: true
    dmPolicy: disabled
```

Bot chỉ hoạt động trong group, không nhận DM.

#### Chế độ Group Policy

##### Open (Mặc định)
```yaml
channels:
  zalo-personal:
    enabled: true
    groupPolicy: open
```

##### Allowlist
```yaml
channels:
  zalo-personal:
    enabled: true
    groupPolicy: allowlist
    groups:
      "2859906902186902610":
        allow: true
      "1234567890123456789":
        allow: true
```

##### Disabled
```yaml
channels:
  zalo-personal:
    enabled: true
    groupPolicy: disabled
```

### Multi-user DM Sessions

Nếu nhiều người dùng cùng nhắn DM, mỗi người nên có session riêng:

```yaml
session:
  dmScope: per-channel-peer
```

Hoặc với multi-account:
```yaml
session:
  dmScope: per-account-channel-peer
```

---

## Bảo mật

### Checklist bảo mật cơ bản

#### ✅ Bắt buộc
- [ ] Dùng pairing hoặc allowlist cho DM
- [ ] Enable mention gating trong group
- [ ] Sandbox tools (nếu enable tools)
- [ ] Gateway bind = loopback (127.0.0.1)
- [ ] Không để secrets trong workspace
- [ ] Dùng model mạnh nhất có thể

#### ✅ Khuyến nghị
- [ ] Chạy định kỳ: `openclaw security audit --deep`
- [ ] Tự động fix: `openclaw security audit --fix`
- [ ] Đọc docs: https://docs.openclaw.ai/gateway/security
- [ ] Review logs thường xuyên
- [ ] Giới hạn tools theo nguyên tắc least-privilege

### Gateway Security

#### Bind address
```yaml
gateway:
  bind: loopback  # Chỉ localhost access
  # KHÔNG dùng: bind: 0.0.0.0 (cho phép từ mọi IP)
```

#### Gateway Token
```bash
# Xem token hiện tại
openclaw config get gateway.auth.token

# Tạo token mới
openclaw doctor --generate-gateway-token
```

#### Pairing Commands

```bash
# Liệt kê pairing requests
openclaw pairing list

# Approve pairing
openclaw pairing approve zalo-personal <code>

# Reject pairing
openclaw pairing reject zalo-personal <code>
```

---

## Xử lý sự cố

### QR Code không hiển thị

**Triệu chứng**: Không thấy QR code trong terminal

**Giải pháp**:
1. Kiểm tra terminal hỗ trợ Unicode/ASCII art
2. Kiểm tra file: `ls -lh /tmp/openclaw-zalo-personal-qr.png`
3. Mở file PNG bằng image viewer

### Login thất bại

**Triệu chứng**: "Login failed" sau khi quét QR

**Giải pháp**:
1. Đảm bảo internet ổn định
2. Thử logout và login lại:
   ```bash
   openclaw channels logout --channel zp
   openclaw channels login --channel zp
   ```
3. Kiểm tra app Zalo đã cập nhật mới nhất

### Gateway không restart

**Triệu chứng**: Chọn "Yes" restart nhưng không thấy gateway restart

**Giải pháp**:
```bash
# Restart thủ công
openclaw gateway restart

# Hoặc restart service
sudo systemctl restart openclaw-gateway.service

# Kiểm tra status
openclaw status
```

### Channel status "failed"

**Triệu chứng**:
```
Zalo Personal: failed (unknown) - Failed to parse user info
```

**Giải pháp**:
1. Restart gateway:
   ```bash
   openclaw gateway restart
   ```
2. Kiểm tra credentials:
   ```bash
   ls -la ~/.openclaw/credentials/
   ```
3. Re-login nếu cần:
   ```bash
   openclaw channels login --channel zp
   ```

### Không tìm thấy User ID

**Triệu chứng**: "Could not resolve: Alice"

**Giải pháp**:
1. Đảm bảo đã login thành công
2. Kiểm tra tên chính xác (case-sensitive)
3. Dùng User ID số thay vì tên:
   - Mở chat với người đó trên Zalo
   - Xem profile → Copy User ID
4. Hoặc dùng chế độ **pairing** thay vì allowlist

### QR image không bị xóa

**Triệu chứng**: File `/tmp/openclaw-zalo-personal-qr.png` vẫn tồn tại sau login

**Giải pháp**:
```bash
# Xóa thủ công
rm /tmp/openclaw-zalo-personal-qr.png

# Kiểm tra extension code đã update chưa
cd ~/.openclaw/extensions/zalo-personal
git pull
```

---

## Lệnh hữu ích

### Channel Management

```bash
# Login
openclaw channels login --channel zalo-personal

# Logout
openclaw channels logout --channel zalo-personal

# Status
openclaw status

# Kiểm tra chi tiết
openclaw channels list
```

### Gateway Management

```bash
# Restart gateway
openclaw gateway restart

# Stop gateway
openclaw gateway stop

# Start gateway
openclaw gateway start

# Xem logs
openclaw logs
openclaw logs --follow
```

### Pairing Management

```bash
# List pairing requests
openclaw pairing list

# Approve
openclaw pairing approve zalo-personal <code>

# Reject
openclaw pairing reject zalo-personal <code>
```

### Configuration

```bash
# Xem config
openclaw config get

# Xem config cụ thể
openclaw config get channels.zalo-personal

# Edit config
openclaw config edit

# Validate config
openclaw doctor
```

### Security

```bash
# Security audit
openclaw security audit --deep

# Auto-fix issues
openclaw security audit --fix

# Check permissions
openclaw security check
```

---

## Tài liệu tham khảo

### Official Docs
- [OpenClaw Documentation](https://docs.openclaw.ai/)
- [Onboard Command](https://docs.openclaw.ai/cli/onboard)
- [Security Guide](https://docs.openclaw.ai/gateway/security)
- [Pairing Guide](https://docs.openclaw.ai/start/pairing)
- [Control UI](https://docs.openclaw.ai/web/control-ui)

### Community Resources
- [GitHub Repository](https://github.com/openclaw/openclaw)
- [Discord Community](https://discord.gg/openclaw)
- [Getting Started Tutorial](https://www.codecademy.com/article/open-claw-tutorial-installation-to-first-chat-setup)

### Extension-specific
- Extension location: `~/.openclaw/extensions/zalo-personal/`
- Source code: `~/.openclaw/extensions/zalo-personal/src/`
- Package info: `~/.openclaw/extensions/zalo-personal/package.json`

---

## Changelog

### Version 2026.2.9
- ✅ Tự động xóa QR image sau login thành công
- ✅ Hỏi user có muốn restart gateway không
- ✅ Hiển thị đường dẫn file QR PNG
- ✅ Cleanup QR file ngay cả khi login thất bại
- ✅ Support cả onboarding wizard và direct login command

---

## FAQ

### Q: Tôi có cần số điện thoại riêng cho bot không?
**A**: Không. Bạn dùng chính tài khoản Zalo cá nhân của mình. Tuy nhiên, nếu dùng cho production, nên tạo tài khoản Zalo riêng.

### Q: Pairing mode có an toàn không?
**A**: Có. Pairing mode yêu cầu admin approve mỗi user mới, giúp kiểm soát access tốt hơn.

### Q: Tôi có thể dùng nhiều tài khoản Zalo không?
**A**: Có. OpenClaw hỗ trợ multi-account. Xem docs về multi-account setup.

### Q: QR code có hết hạn không?
**A**: Có. QR code thường hết hạn sau vài phút. Nếu hết hạn, chạy login lại để có QR mới.

### Q: Gateway restart có ảnh hưởng đến sessions không?
**A**: Không. Sessions được lưu vào disk và tự động restore sau restart.

### Q: Tôi quên User ID của người dùng, làm sao lấy?
**A**: Dùng chế độ **pairing** thay vì allowlist. Khi user nhắn tin, bạn sẽ nhận được pairing request kèm User ID.

---

## Liên hệ & Hỗ trợ

- **GitHub Issues**: https://github.com/openclaw/openclaw/issues
- **Discord**: https://discord.gg/openclaw
- **Docs**: https://docs.openclaw.ai/

---

**Cập nhật lần cuối**: 2026-02-12
**OpenClaw Version**: 2026.2.9
**Extension Version**: zalo-personal v1.0.0
