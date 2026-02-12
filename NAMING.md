# Naming Convention - Quy ước đặt tên

## 🎯 Quyết định cuối cùng

```
NPM Package:    openclaw-zalo-personal
GitHub Repo:    openclaw-zalo-personal
Extension ID:   zalo-personal
Channel ID:     zalo-personal
Alias:          zp
```

---

## ❓ Tại sao không nhất quán?

### Package Name ≠ Extension ID

Đây là **standard practice** trong ecosystem JavaScript:

| Project | Package Name | Internal ID |
|---------|--------------|-------------|
| ESLint React | `eslint-plugin-react` | `react` |
| Babel Transform | `babel-plugin-transform-runtime` | `transform-runtime` |
| Webpack Sass | `sass-loader` | `sass` |
| **OpenClaw Zalo** | `openclaw-zalo-personal` | `zalo-personal` |

### Lý do:

#### 1. **Discoverability** (Khả năng tìm kiếm)
```bash
# Người dùng search:
npm search openclaw        # ✅ Tìm thấy openclaw-zalo-personal
npm search zalo            # ✅ Tìm thấy openclaw-zalo-personal
npm search "openclaw zalo" # ✅ Tìm thấy

# Nếu chỉ dùng "zalo-personal":
npm search openclaw        # ❌ KHÔNG tìm thấy
```

#### 2. **Namespace Collision** (Tránh trùng tên)
```
zalo-personal           # ← Generic, có thể ai đó đã dùng
openclaw-zalo-personal  # ← Rõ ràng, ít conflict
```

#### 3. **Context Clarity** (Rõ ràng ngữ cảnh)
```
npm install zalo-personal           # ← Cái gì? Zalo client? SDK?
npm install openclaw-zalo-personal  # ← Ah! OpenClaw extension!
```

#### 4. **Convention** (Quy ước chung)
- `eslint-plugin-*` - ESLint plugins
- `babel-plugin-*` - Babel plugins
- `rollup-plugin-*` - Rollup plugins
- `openclaw-*` - OpenClaw extensions ← Standard pattern

---

## 📦 Các tên trong hệ thống

### 1. NPM Package Name
```json
{
  "name": "openclaw-zalo-personal"
}
```
**Mục đích**: Publish trên npmjs.com
**Ai dùng**: `npm install openclaw-zalo-personal`

### 2. GitHub Repository
```
https://github.com/your-username/openclaw-zalo-personal
```
**Mục đích**: Host source code
**Ai dùng**: Developers, contributors

### 3. Extension ID (Internal)
```json
{
  "openclaw": {
    "channel": {
      "id": "zalo-personal"
    }
  }
}
```
**Mục đích**: Identifier trong OpenClaw
**Ai dùng**: OpenClaw internal routing

### 4. Channel Label (Display)
```json
{
  "openclaw": {
    "channel": {
      "label": "Zalo Personal",
      "selectionLabel": "Zalo Personal Account"
    }
  }
}
```
**Mục đích**: Hiển thị cho user
**Ai dùng**: UI, menus, prompts

### 5. Alias (Shortcut)
```json
{
  "openclaw": {
    "channel": {
      "aliases": ["zp"]
    }
  }
}
```
**Mục đích**: Shortcut commands
**Ai dùng**: CLI commands như `openclaw channels login --channel zp`

---

## 🔄 Mapping giữa các tên

```
User muốn cài đặt:
  npm install openclaw-zalo-personal

  ↓

OpenClaw load extension:
  id: "zalo-personal"

  ↓

User dùng CLI:
  openclaw channels login --channel zp

  ↓

Hiển thị trong UI:
  "Zalo Personal Account"
```

---

## ✅ Ví dụ thực tế

### User workflow:

```bash
# 1. Tìm kiếm
npm search openclaw
# → Thấy: openclaw-zalo-personal

# 2. Cài đặt
npm install -g openclaw-zalo-personal
# → Package được cài

# 3. Xem available channels
openclaw channels list
# → Hiển thị: "Zalo Personal Account (zalo-personal)"

# 4. Login
openclaw channels login --channel zp
# → Sử dụng alias "zp"

# 5. Config
# openclaw.json:
{
  "channels": {
    "zalo-personal": {      # ← Internal ID
      "enabled": true
    }
  }
}
```

---

## 🎨 Alternative Options (Không chọn)

### Option A: Nhất quán hoàn toàn
```
NPM:       zalo-personal
GitHub:    zalo-personal
Extension: zalo-personal
```
❌ Khó tìm kiếm
❌ Không rõ là OpenClaw extension

### Option B: Scoped package
```
NPM:       @your-username/openclaw-zalo-personal
GitHub:    your-username/openclaw-zalo-personal
Extension: zalo-personal
```
⚠️ Cần có npm account
⚠️ Namespace pollution trong personal scope

### Option C: Official org (Lý tưởng nhất nếu được accept)
```
NPM:       @openclaw/zalo-personal
GitHub:    openclaw/zalo-personal
Extension: zalo-personal
```
✅ Professional
✅ Nhất quán
❌ Cần quyền truy cập @openclaw org

---

## 📋 Checklist khi đặt tên

Khi tạo OpenClaw extension mới:

- [ ] **Package name**: `openclaw-<feature>`
- [ ] **Extension ID**: `<feature>` (ngắn gọn)
- [ ] **Label**: `<Feature Name>` (user-friendly)
- [ ] **Aliases**: `<short>` (1-2 ký tự)
- [ ] **GitHub repo**: `openclaw-<feature>`
- [ ] **Description**: Mention "OpenClaw" để SEO

### Ví dụ:
```json
{
  "name": "openclaw-telegram",
  "description": "OpenClaw extension for Telegram",
  "openclaw": {
    "channel": {
      "id": "telegram",
      "label": "Telegram",
      "aliases": ["tg"]
    }
  }
}
```

---

## 🎓 Tham khảo

### ESLint Convention:
- Package: `eslint-plugin-react`, `eslint-plugin-vue`
- Config: `plugins: ['react', 'vue']`

### Babel Convention:
- Package: `@babel/plugin-transform-runtime`
- Config: `plugins: ['transform-runtime']`

### Vite Convention:
- Package: `vite-plugin-vue`, `@vitejs/plugin-react`
- Config: `plugins: [vue(), react()]`

### OpenClaw Convention:
- Package: `openclaw-zalo-personal`, `openclaw-telegram`
- Config: `channels: { 'zalo-personal': {}, 'telegram': {} }`

---

## 💡 Kết luận

**Package name với prefix/scope** + **Internal ID ngắn gọn** = Best practice ✅

Không cần lo lắng về sự "không nhất quán" - đây là pattern được sử dụng rộng rãi và có lý do chính đáng!

---

**Cập nhật**: 2026-02-12
