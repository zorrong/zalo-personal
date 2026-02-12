# Zalo Personal Channel Extension

> Connect your personal Zalo account to OpenClaw via QR code login

## Quick Start

### Easy Setup (Recommended)

```bash
# Option 1: Pairing Mode (Secure - requires approval)
bash ~/.openclaw/extensions/zalo-personal/zalo-pairing-setup.sh

# Option 2: Open Mode (Anyone can message)
bash ~/.openclaw/extensions/zalo-personal/zalo-open-setup.sh
```

### Manual Setup

```bash
# Login to Zalo Personal
openclaw channels login --channel zalo-personal

# Or use alias
openclaw channels login --channel zp

# Run onboarding wizard (not recommended - forces User ID input)
openclaw onboard
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

📖 **[Full Onboarding Guide](./ONBOARDING-GUIDE.md)** - Hướng dẫn chi tiết bằng tiếng Việt

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

### v1.0.0 (2026-02-12)
- ✅ Auto-delete QR image after successful login
- ✅ Display QR file path during login
- ✅ Optional gateway restart prompt
- ✅ Cleanup on login failure
- ✅ Support both onboarding wizard and direct login

## License

Part of the OpenClaw project

---

**Version**: 1.0.0
**OpenClaw**: 2026.2.9
**Last Updated**: 2026-02-12
