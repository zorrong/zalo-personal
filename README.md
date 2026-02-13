# Zalo Personal Channel Extension

> Connect your personal Zalo account to OpenClaw via QR code login

## 🚀 One-Liner Installation

Copy-paste this into your terminal:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/caochitam/zalo-personal/main/quick-install.sh)
```

**That's it!** The script will:
1. Install the extension
2. Let you choose Open or Pairing mode
3. Show QR code for login
4. Auto-restart gateway

---

## Quick Start

### Already Installed?

Re-run the quick install script to reconfigure or reinstall:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/caochitam/zalo-personal/main/quick-install.sh)
```

It will detect existing installation and ask if you want to:
- Use existing extension (just reconfigure)
- Clean install (remove and reinstall)

### Manual Login

If already configured, just login:

```bash
# Login to Zalo Personal
openclaw channels login --channel zalo-personal

# Or use alias
openclaw channels login --channel zp
```

## Features

- ✅ **QR Code Login** - No CLI tools needed, uses `zca-js` library
- ✅ **Auto Cleanup** - QR image automatically deleted after login
- ✅ **Gateway Restart** - Optional restart prompt for certificate recognition
- ✅ **Pairing Mode** - Control who can message your bot
- ✅ **Group Support** - Works with both DMs and group chats
- ✅ **Multi-Account** - Support multiple Zalo accounts

## Login Process

1. Run login command
2. QR code displayed in terminal
3. Scan with Zalo app on phone
4. Confirm on phone
5. ✓ Login successful!
6. QR image auto-deleted
7. Optional: Restart gateway

## Security Modes

### Pairing (Recommended)
Users request pairing → You approve → They can message

```yaml
channels:
  zalo-personal:
    dmPolicy: pairing
```

### Allowlist
Only specific users can message

```yaml
channels:
  zalo-personal:
    dmPolicy: allowlist
    allowFrom:
      - "123456789"
```

### Open
Anyone can message (use with caution!)

```yaml
channels:
  zalo-personal:
    dmPolicy: open
    allowFrom: ["*"]
```

## Quick Commands

```bash
# Login/Logout
openclaw channels login --channel zp
openclaw channels logout --channel zp

# Status
openclaw status

# Pairing management
openclaw pairing list
openclaw pairing approve zalo-personal <code>
openclaw pairing reject zalo-personal <code>

# Gateway
openclaw gateway restart
openclaw logs --follow
```

## Documentation

📖 **[Quick Reference (Vietnamese)](./QUICK-REFERENCE.vi.md)** - Tài liệu tra cứu nhanh
📖 **[Installation Guide (Vietnamese)](./INSTALL.md)** - Hướng dẫn cài đặt chi tiết

## Requirements

- OpenClaw 2026.2.9 or later
- Node.js (bundled with OpenClaw)
- Zalo app on phone

## Configuration Example

```yaml
channels:
  zalo-personal:
    enabled: true
    dmPolicy: pairing
    groupPolicy: open
```

## Troubleshooting

### QR Code not showing
Check: `ls -lh /tmp/openclaw-zalo-personal-qr.png`

### Login failed
```bash
openclaw channels logout --channel zp
openclaw channels login --channel zp
```

### Channel shows "failed"
```bash
openclaw gateway restart
```

### Can't resolve username to User ID
Use **pairing mode** instead of allowlist, or use numeric User IDs directly.

## Support

- 📚 [OpenClaw Docs](https://docs.openclaw.ai/)
- 🐛 [GitHub Issues](https://github.com/openclaw/openclaw/issues)
- 💬 [Discord Community](https://discord.gg/openclaw)

## What's New

### v1.0.7 (2026-02-13)
- ✅ Smart detection and cleanup of failed installations
- ✅ Unified `quick-install.sh` script handles all scenarios
- ✅ Auto-cleanup stale config from previous failed installs
- ✅ Interactive mode selection (Open/Pairing)

### v1.0.0 (2026-02-12)
- ✅ Auto-delete QR image after successful login
- ✅ Display QR file path during login
- ✅ Optional gateway restart prompt
- ✅ Cleanup on login failure

## License

Part of the OpenClaw project

---

**Version**: 1.0.8
**OpenClaw**: 2026.2.9+
**Last Updated**: 2026-02-13
