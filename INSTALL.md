# 🚀 Quick Install

## One-liner Installation

Copy-paste câu lệnh này vào terminal và nhấn Enter:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/caochitam/zalo-personal/main/quick-install.sh)
```

Hoặc dùng wget:

```bash
bash <(wget -qO- https://raw.githubusercontent.com/caochitam/zalo-personal/main/quick-install.sh)
```

---

## Script sẽ làm gì?

1. ✅ Kiểm tra OpenClaw đã cài chưa
2. 📦 Cài extension `zalo-personal` từ npm
3. 🔧 Hỏi bạn chọn mode: **Open** hoặc **Pairing**
4. ⚙️ Tự động cấu hình channel
5. 📱 Hiển thị QR code để đăng nhập Zalo
6. 🔄 Tự động restart gateway sau khi login thành công

**Tất cả chỉ trong 1 lần chạy!**

---

## Yêu cầu

- [x] OpenClaw đã được cài đặt (`npm install -g openclaw`)
- [x] Node.js version 18+
- [x] Internet connection

---

## Chọn Mode

### 🌐 Open Mode (Khuyến nghị cho test)
- Nhận tin nhắn từ **mọi người**
- Dễ test, không cần pair
- Phù hợp cho bot công khai

### 🔒 Pairing Mode (An toàn hơn)
- Chỉ nhận tin từ **người đã pair**
- User phải reply tin nhắn của bot để pair
- Phù hợp cho bot cá nhân

---

## Sau khi cài đặt

### Kiểm tra status:
```bash
openclaw status
```

### Xem thông tin channel:
```bash
openclaw channel status zalo-personal
```

### Gửi tin nhắn thử:
```bash
openclaw send -c zalo-personal -to USER_ID "Xin chào!"
```

### Nếu dùng Pairing Mode:
1. Gửi tin nhắn cho bot từ Zalo app
2. Bot reply tin nhắn đó
3. Bạn đã được pair! ✅

---

## Manual Installation

Nếu không muốn dùng one-liner:

```bash
# 1. Cài extension
openclaw ext add zalo-personal

# 2. Chạy setup script
cd ~/.openclaw/extensions/zalo-personal

# Open mode
bash zalo-open-setup.sh

# Hoặc Pairing mode
bash zalo-pairing-setup.sh
```

---

## Troubleshooting

### Script báo "OpenClaw chưa được cài đặt"
```bash
npm install -g openclaw
```

### Không thấy QR code
- Kiểm tra terminal có hỗ trợ hiển thị unicode không
- Hoặc mở file: `/tmp/openclaw-zalo-personal-qr.png`

### Login thất bại
- Kiểm tra internet connection
- Thử quét QR nhanh hơn (QR expires sau 60s)

### Gateway không restart
```bash
# Restart thủ công
openclaw gateway restart
```

---

## Uninstall

```bash
# Disable plugin
openclaw plugins disable zalo-personal

# Remove files
rm -rf ~/.openclaw/extensions/zalo-personal
```

---

## 📚 More Info

- GitHub: https://github.com/caochitam/zalo-personal
- npm: https://www.npmjs.com/package/zalo-personal
- Issues: https://github.com/caochitam/zalo-personal/issues

---

**Enjoy! 🎉**
