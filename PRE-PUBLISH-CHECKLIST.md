# Pre-Publish Checklist

Checklist này đảm bảo package sẵn sàng publish lên npm.

## ✅ Bắt buộc phải làm

### 1. Cập nhật thông tin cá nhân trong `package.json`

```bash
nano ~/.openclaw/extensions/zalo-personal/package.json
```

**Thay đổi:**

```json
{
  "author": "Your Name <your.email@example.com>",
  "repository": {
    "url": "https://github.com/your-username/zalo-personal"
  },
  "bugs": {
    "url": "https://github.com/your-username/zalo-personal/issues"
  },
  "homepage": "https://github.com/your-username/zalo-personal#readme"
}
```

- [ ] `author` - Tên và email của bạn
- [ ] `repository.url` - GitHub repo URL
- [ ] `bugs.url` - Issues URL
- [ ] `homepage` - README URL

### 2. Kiểm tra version

```json
{
  "version": "1.0.0"
}
```

- [ ] Version đúng (bắt đầu từ 1.0.0)

### 3. Test package locally

```bash
cd ~/.openclaw/extensions/zalo-personal

# Xem files sẽ được publish
npm pack --dry-run

# Tạo tarball để test
npm pack

# Verify tarball
tar -tzf zalo-personal-1.0.0.tgz | head -20
```

- [ ] Chỉ có files cần thiết
- [ ] Không có credentials/secrets
- [ ] Có đầy đủ src/, docs, scripts

---

## ✅ Khuyến nghị (nên làm)

### 4. Tạo GitHub repository

```bash
cd ~/.openclaw/extensions/zalo-personal

# Init git (nếu chưa có)
git init

# Add files
git add .

# Commit
git commit -m "Initial commit: OpenClaw Zalo Personal extension v1.0.0"

# Add remote
git remote add origin https://github.com/your-username/zalo-personal.git

# Push
git push -u origin main
```

- [ ] GitHub repo đã tạo
- [ ] Code đã push lên GitHub
- [ ] README.md hiển thị đẹp trên GitHub

### 5. Update README badges (optional)

Thêm vào đầu README.md:

```markdown
# Zalo Personal Extension

[![npm version](https://badge.fury.io/js/zalo-personal.svg)](https://www.npmjs.com/package/zalo-personal)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> OpenClaw extension for Zalo Personal Account
```

- [ ] Badges đã thêm (nếu muốn)

---

## ✅ Security Check

### 6. Kiểm tra không có sensitive data

```bash
cd ~/.openclaw/extensions/zalo-personal

# Check for credentials
grep -r "password\|secret\|token\|key" . --exclude-dir=node_modules --exclude="*.md"

# Check .npmignore
cat .npmignore
```

- [ ] Không có credentials trong code
- [ ] `.npmignore` đã config đúng
- [ ] Không publish node_modules/

### 7. Test scripts hoạt động

```bash
# Test pairing setup script
bash ~/.openclaw/extensions/zalo-personal/zalo-pairing-setup.sh --help

# Test open setup script
bash ~/.openclaw/extensions/zalo-personal/zalo-open-setup.sh --help
```

- [ ] Scripts không có lỗi syntax
- [ ] Scripts có thể chạy được

---

## ✅ NPM Account

### 8. Đăng ký/Login NPM

```bash
# Nếu chưa có account
# Vào: https://www.npmjs.com/signup

# Login
npm login

# Verify
npm whoami
```

- [ ] Đã có npm account
- [ ] Đã login thành công
- [ ] `npm whoami` hiển thị username

### 9. Kiểm tra package name available

```bash
npm search zalo-personal
```

- [ ] Package name chưa ai dùng
- [ ] Nếu đã có → đổi tên trong package.json

---

## 🚀 Ready to Publish

### 10. Final check

```bash
cd ~/.openclaw/extensions/zalo-personal

# Verify package.json
cat package.json | jq '{name, version, author, description, keywords}'

# Test pack
npm pack --dry-run

# All good? Publish!
npm publish
```

### Checklist tổng:

- [ ] ✅ Author info updated
- [ ] ✅ Repository URLs updated
- [ ] ✅ Version correct (1.0.0)
- [ ] ✅ No credentials in code
- [ ] ✅ GitHub repo created & pushed
- [ ] ✅ NPM account ready
- [ ] ✅ Package name available
- [ ] ✅ Test pack successful

---

## 📝 Sau khi publish

### 11. Verify publication

```bash
# Kiểm tra trên npm
npm view zalo-personal

# Test install
npm install -g zalo-personal

# Check version
npm list -g zalo-personal
```

- [ ] Package hiển thị trên npmjs.com
- [ ] Install thành công
- [ ] Version đúng

### 12. Update documentation

- [ ] Update README.md với npm install command
- [ ] Tag version trên GitHub: `git tag v1.0.0 && git push --tags`
- [ ] Create GitHub release (optional)

---

## 🎯 Quick Publish Commands

Nếu đã làm xong tất cả checklist:

```bash
cd ~/.openclaw/extensions/zalo-personal

# Update author in package.json first!
nano package.json

# Login
npm login

# Publish
npm publish

# Verify
npm view zalo-personal
```

---

## ❌ Common Issues

### "You do not have permission"
→ Package name đã tồn tại hoặc bạn không có quyền
→ Đổi name trong package.json

### "402 Payment Required"
→ Scoped package (@username/...) mặc định private
→ Không áp dụng cho non-scoped package

### "Package name too similar"
→ NPM blocks typosquatting
→ Chọn tên khác rõ ràng hơn

### "ENEEDAUTH"
→ Chưa login
→ Run `npm login`

---

## 📚 Resources

- [NPM Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Semantic Versioning](https://semver.org/)
- [package.json docs](https://docs.npmjs.com/cli/v10/configuring-npm/package-json)

---

**Good luck!** 🚀

Sau khi publish, người dùng có thể cài:
```bash
npm install -g zalo-personal
```
