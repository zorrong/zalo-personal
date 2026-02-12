# Publishing to NPM - Hướng dẫn

## 📋 Checklist trước khi publish

### 1. Cập nhật thông tin cá nhân

Mở `package.json` và thay đổi:

```json
{
  "name": "zalo-personal",
  "author": "Your Name <your.email@example.com>",
  "repository": {
    "url": "https://github.com/your-username/zalo-personal"
  }
}
```

**Thay thế:**
- `@your-username` → npm username của bạn (ví dụ: `@john`)
- `Your Name` → tên thật của bạn
- `your.email@example.com` → email của bạn
- `your-username` trong GitHub URL → GitHub username

### 2. Kiểm tra files sẽ được publish

```bash
cd ~/.openclaw/extensions/zalo-personal
npm pack --dry-run
```

Xem danh sách files sẽ được đưa vào package.

### 3. Test local

```bash
# Build (nếu cần)
npm run build  # hoặc bỏ qua nếu không có build step

# Test install local
npm pack
npm install -g ./zalo-personal-1.0.0.tgz
```

---

## 🚀 Publish lên NPM

### Bước 1: Tạo tài khoản NPM

Nếu chưa có tài khoản:
1. Vào https://www.npmjs.com/signup
2. Tạo tài khoản mới
3. Verify email

### Bước 2: Login NPM CLI

```bash
npm login
```

Nhập:
- Username
- Password
- Email
- OTP (nếu enable 2FA)

### Bước 3: Kiểm tra package name

```bash
npm search zalo-personal
```

Nếu chưa có package nào → OK!
Nếu đã có → Đổi tên trong package.json

### Bước 4: Publish!

```bash
cd ~/.openclaw/extensions/zalo-personal

# Lần đầu publish
npm publish --access public

# Hoặc nếu là scoped private package
npm publish --access restricted
```

**Lưu ý**: Scoped package (`@username/...`) mặc định là private trên npm free tier. Dùng `--access public` để publish public.

### Bước 5: Verify

```bash
# Kiểm tra trên npm
npm view zalo-personal

# Hoặc mở browser
open https://www.npmjs.com/package/zalo-personal
```

---

## 📦 Cài đặt từ NPM

Sau khi publish, người khác có thể cài đặt bằng:

```bash
# Cài đặt extension
npm install -g zalo-personal

# Hoặc với OpenClaw CLI
openclaw extensions install zalo-personal
```

---

## 🔄 Update version

Khi có thay đổi:

```bash
# Bump version
npm version patch   # 1.0.0 → 1.0.1
npm version minor   # 1.0.0 → 1.1.0
npm version major   # 1.0.0 → 2.0.0

# Hoặc manual
# Sửa version trong package.json

# Publish version mới
npm publish --access public
```

---

## 📝 Semantic Versioning

Theo chuẩn [semver](https://semver.org/):

- **MAJOR** (1.0.0 → 2.0.0): Breaking changes
- **MINOR** (1.0.0 → 1.1.0): New features, backward compatible
- **PATCH** (1.0.0 → 1.0.1): Bug fixes

Ví dụ:
```bash
# Bug fix
npm version patch
# 1.0.0 → 1.0.1

# New feature
npm version minor
# 1.0.1 → 1.1.0

# Breaking change
npm version major
# 1.1.0 → 2.0.0
```

---

## 🏷️ Tags

Publish với tag cụ thể:

```bash
# Latest (default)
npm publish --access public

# Beta version
npm publish --access public --tag beta

# Next version
npm publish --access public --tag next
```

Người dùng cài đặt:
```bash
npm install zalo-personal        # latest
npm install zalo-personal@beta   # beta
npm install zalo-personal@1.0.0  # specific version
```

---

## ❌ Unpublish (Gỡ bỏ)

**Cảnh báo**: Chỉ nên unpublish trong 72h đầu!

```bash
# Unpublish specific version
npm unpublish zalo-personal@1.0.0

# Unpublish toàn bộ package (NGUY HIỂM!)
npm unpublish zalo-personal --force
```

---

## 🔒 Security

### .npmignore
Đảm bảo không publish:
- ✅ Credentials files
- ✅ Environment variables (.env)
- ✅ Private keys
- ✅ Test files
- ✅ Development configs

### Review trước khi publish
```bash
# Xem files sẽ được publish
npm pack --dry-run

# Hoặc tạo tarball để kiểm tra
npm pack
tar -tzf zalo-personal-1.0.0.tgz
```

---

## 📊 NPM Scripts hữu ích

Thêm vào `package.json`:

```json
{
  "scripts": {
    "prepublishOnly": "npm run test && npm run lint",
    "preversion": "npm test",
    "version": "git add -A",
    "postversion": "git push && git push --tags",
    "check-publish": "npm pack --dry-run"
  }
}
```

---

## 🎯 Best Practices

### 1. README.md
- ✅ Clear description
- ✅ Installation instructions
- ✅ Usage examples
- ✅ Configuration guide
- ✅ Screenshots/GIFs nếu có

### 2. Version control
- ✅ Git tag mỗi version
- ✅ CHANGELOG.md
- ✅ Semantic versioning

### 3. Documentation
- ✅ API documentation
- ✅ Examples
- ✅ Troubleshooting guide

### 4. Testing
- ✅ Unit tests
- ✅ Integration tests
- ✅ CI/CD (GitHub Actions)

---

## 🐛 Troubleshooting

### Lỗi: "You do not have permission to publish"
→ Package name đã tồn tại hoặc bạn không có quyền
→ Đổi tên package hoặc xin quyền từ owner

### Lỗi: "Package name too similar"
→ NPM block tên giống nhau để tránh typosquatting
→ Chọn tên khác

### Lỗi: "402 Payment Required"
→ Scoped package mặc định là private
→ Dùng `--access public` hoặc upgrade npm plan

### Lỗi: "ENEEDAUTH"
→ Chưa login
→ Chạy `npm login`

---

## 📚 Resources

- [NPM Docs](https://docs.npmjs.com/)
- [Publishing Packages](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Semantic Versioning](https://semver.org/)
- [npm-publish GitHub Action](https://github.com/marketplace/actions/npm-publish)

---

**Good luck!** 🚀
