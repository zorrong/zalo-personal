# Zalo Personal Extension - Tổng hợp tài liệu

## 📂 Cấu trúc thư mục

```
zalo-personal/
├── 📜 README.md                    # Quick start (English)
├── 📜 ONBOARDING-GUIDE.md          # Hướng dẫn chi tiết (Vietnamese)
├── 📜 QUICK-REFERENCE.vi.md        # Tra cứu nhanh (Vietnamese)
├── 📜 INDEX.md                     # File này
├── 🔧 zalo-pairing-setup.sh        # Script setup pairing mode
├── 🔧 zalo-open-setup.sh           # Script setup open mode
├── 📁 src/                         # Source code
└── 📁 node_modules/                # Dependencies
```

---

## 🚀 Bắt đầu nhanh

### Cách 1: Dùng Script (Khuyến nghị)

#### Pairing Mode (An toàn)
```bash
bash ~/.openclaw/extensions/zalo-personal/zalo-pairing-setup.sh
```
- ✅ User request pairing → Bạn approve
- ✅ Không cần biết User ID trước
- ✅ Kiểm soát ai được nhắn tin

#### Open Mode (Công khai)
```bash
bash ~/.openclaw/extensions/zalo-personal/zalo-open-setup.sh
```
- ⚠️ Ai cũng nhắn được
- ⚠️ Chỉ dùng cho bot công khai

### Cách 2: Manual
```bash
openclaw channels login --channel zalo-personal
```

---

## 📚 Tài liệu

### 1. README.md
**Mục đích**: Quick start guide (English)
**Nội dung**:
- Features overview
- Quick setup commands
- Configuration examples
- Troubleshooting

**Đọc khi**: Cần hướng dẫn nhanh bằng tiếng Anh

### 2. ONBOARDING-GUIDE.md
**Mục đích**: Hướng dẫn đầy đủ từ A-Z (Vietnamese)
**Nội dung**:
- 9 bước onboarding chi tiết
- Cấu hình DM/Group Policy
- Security checklist
- Troubleshooting chi tiết
- FAQ
- Changelog

**Đọc khi**:
- Lần đầu setup
- Cần hiểu rõ toàn bộ quy trình
- Gặp vấn đề cần debug

### 3. QUICK-REFERENCE.vi.md
**Mục đích**: Tra cứu nhanh (Vietnamese)
**Nội dung**:
- Lệnh cơ bản
- Bảng so sánh modes
- Config mẫu
- Troubleshooting nhanh
- File paths

**Đọc khi**:
- Cần tra cứu lệnh nhanh
- Quên cách config
- Cần xử lý sự cố gấp

---

## 🔧 Scripts

### zalo-pairing-setup.sh
**Chức năng**:
- ✅ Auto config pairing mode
- ✅ Restart gateway
- ✅ Login via QR
- ✅ Không cần nhập User ID

**Chạy**:
```bash
bash ~/.openclaw/extensions/zalo-personal/zalo-pairing-setup.sh
```

### zalo-open-setup.sh
**Chức năng**:
- ✅ Auto config open mode
- ✅ Restart gateway
- ✅ Login via QR
- ⚠️ Ai cũng nhắn được

**Chạy**:
```bash
bash ~/.openclaw/extensions/zalo-personal/zalo-open-setup.sh
```

---

## 🎯 Chọn tài liệu phù hợp

| Tình huống | Đọc tài liệu nào |
|------------|------------------|
| Lần đầu setup | **ONBOARDING-GUIDE.md** |
| Setup nhanh | Chạy **zalo-pairing-setup.sh** |
| Quên lệnh | **QUICK-REFERENCE.vi.md** |
| Bot không hoạt động | **ONBOARDING-GUIDE.md** → Troubleshooting |
| Cần config mẫu | **QUICK-REFERENCE.vi.md** hoặc **README.md** |
| English guide | **README.md** |

---

## 📖 Đọc tài liệu

```bash
# Xem trong terminal
cat ~/.openclaw/extensions/zalo-personal/README.md
cat ~/.openclaw/extensions/zalo-personal/ONBOARDING-GUIDE.md
cat ~/.openclaw/extensions/zalo-personal/QUICK-REFERENCE.vi.md

# Hoặc mở bằng editor
nano ~/.openclaw/extensions/zalo-personal/ONBOARDING-GUIDE.md
```

---

## 🆘 Hỗ trợ

- 📚 [OpenClaw Docs](https://docs.openclaw.ai/)
- 🐛 [GitHub Issues](https://github.com/openclaw/openclaw/issues)
- 💬 [Discord](https://discord.gg/openclaw)

---

**Cập nhật**: 2026-02-12
**Version**: 1.0.0
