# GitHub Setup Guide

## 🔧 Bước 1: Config Git Identity

```bash
# Set your name and email
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Fix current commit with new identity
cd ~/.openclaw/extensions/zalo-personal
git commit --amend --reset-author --no-edit
```

---

## 📦 Bước 2: Tạo GitHub Repository

### Option A: Qua GitHub Website (Khuyến nghị)

1. **Vào GitHub**: https://github.com/new

2. **Điền thông tin:**
   - Repository name: `zalo-personal`
   - Description: `OpenClaw extension for Zalo Personal Account via QR login`
   - Visibility: **Public** (để publish npm)
   - ❌ **KHÔNG** tick "Add README" (đã có rồi)
   - ❌ **KHÔNG** tick "Add .gitignore" (đã có rồi)
   - ❌ **KHÔNG** tick "Add license" (đã có rồi)

3. **Click "Create repository"**

### Option B: Qua GitHub CLI (Nếu đã cài `gh`)

```bash
cd ~/.openclaw/extensions/zalo-personal

gh repo create zalo-personal \
  --public \
  --source=. \
  --description="OpenClaw extension for Zalo Personal Account via QR login" \
  --push
```

---

## 🚀 Bước 3: Push lên GitHub

### Nếu dùng Option A (Website):

```bash
cd ~/.openclaw/extensions/zalo-personal

# Add remote
git remote add origin https://github.com/YOUR-USERNAME/zalo-personal.git

# Push
git push -u origin main
```

**Thay `YOUR-USERNAME`** bằng GitHub username của bạn!

### Nếu dùng Option B (gh CLI):

Đã tự động push rồi! ✅

---

## ✅ Verify

```bash
# Check remote
git remote -v

# Check branch
git branch -a

# Open repo in browser
open https://github.com/YOUR-USERNAME/zalo-personal
```

---

## 📝 Sau khi push

### 1. Cập nhật package.json

```bash
cd ~/.openclaw/extensions/zalo-personal
nano package.json
```

Sửa URLs:
```json
{
  "repository": {
    "url": "https://github.com/YOUR-USERNAME/zalo-personal"
  },
  "bugs": {
    "url": "https://github.com/YOUR-USERNAME/zalo-personal/issues"
  },
  "homepage": "https://github.com/YOUR-USERNAME/zalo-personal#readme"
}
```

### 2. Commit & Push changes

```bash
git add package.json
git commit -m "Update repository URLs"
git push
```

### 3. Tag version (Optional nhưng nên làm)

```bash
git tag v1.0.0
git push --tags
```

---

## 🎨 Tùy chỉnh GitHub Repo (Optional)

### About Section

Trên GitHub repo page:
1. Click ⚙️ gear icon bên "About"
2. Điền:
   - Description: `OpenClaw extension for Zalo Personal Account`
   - Website: `https://www.npmjs.com/package/zalo-personal` (sau khi publish npm)
   - Topics: `openclaw`, `zalo`, `vietnam`, `chatbot`, `qr-login`, `messaging`

### README Badges

Thêm vào đầu README.md:

```markdown
# Zalo Personal Extension

[![npm version](https://badge.fury.io/js/zalo-personal.svg)](https://www.npmjs.com/package/zalo-personal)
[![GitHub](https://img.shields.io/github/license/YOUR-USERNAME/zalo-personal)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/YOUR-USERNAME/zalo-personal)](https://github.com/YOUR-USERNAME/zalo-personal/stargazers)

> OpenClaw extension for Zalo Personal Account via QR code login
```

Commit & push:
```bash
git add README.md
git commit -m "Add badges to README"
git push
```

---

## 🔄 Workflow sau này

### Khi có thay đổi code:

```bash
cd ~/.openclaw/extensions/zalo-personal

# Stage changes
git add .

# Commit
git commit -m "Description of changes"

# Push
git push
```

### Khi release version mới:

```bash
# Update version
npm version patch  # 1.0.0 → 1.0.1
# hoặc
npm version minor  # 1.0.0 → 1.1.0
# hoặc
npm version major  # 1.0.0 → 2.0.0

# Tự động tạo git tag & commit

# Push code & tags
git push && git push --tags

# Publish to npm
npm publish
```

---

## ❌ Troubleshooting

### Error: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/YOUR-USERNAME/zalo-personal.git
```

### Error: "Permission denied (publickey)"
→ Cần setup SSH key hoặc dùng HTTPS với personal access token
→ Đọc: https://docs.github.com/en/authentication

### Error: "Updates were rejected"
```bash
# Pull first
git pull origin main --rebase

# Then push
git push
```

---

## 📚 Resources

- [GitHub Docs](https://docs.github.com/)
- [Git Basics](https://git-scm.com/book/en/v2/Getting-Started-Git-Basics)
- [GitHub CLI](https://cli.github.com/)

---

## ✨ Quick Commands

```bash
# Config git
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# Fix commit author
cd ~/.openclaw/extensions/zalo-personal
git commit --amend --reset-author --no-edit

# Push to GitHub (sau khi tạo repo)
git remote add origin https://github.com/YOUR-USERNAME/zalo-personal.git
git push -u origin main

# Tag version
git tag v1.0.0
git push --tags
```

---

**Done!** 🎉
