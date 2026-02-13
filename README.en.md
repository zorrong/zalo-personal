# Zalo Personal Channel Extension

> Connect your personal Zalo account to OpenClaw via QR code login

> **📖 Tài liệu tiếng Việt là tài liệu chính:** [README.md](README.md) (Vietnamese documentation is the primary version)

---

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

Re-run the quick install script to reconfigure, update, or reinstall:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/caochitam/zalo-personal/main/quick-install.sh)
```

It will detect existing installation and ask if you want to:
- **Use existing extension** (just reconfigure)
- **Update to latest version** (safe in-place update)
- **Clean install** (remove and reinstall)

### Manual Login

If already configured, just login:

```bash
# Login to Zalo Personal
openclaw channels login --channel zalo-personal

# Or use alias
openclaw channels login --channel zp
```

### Updating

Update to the latest version with one command:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/caochitam/zalo-personal/main/script/update.sh)
```

The update script will:
- ✅ Check current version vs latest
- ✅ Create automatic backup
- ✅ Download and install latest from npm
- ✅ Preserve your configuration
- ✅ Prompt to restart gateway

**Or** use the quick install script (option 2):

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/caochitam/zalo-personal/main/quick-install.sh)
# Then choose [2] Update to latest version
```

## Features

- ✅ **QR Code Login** - No CLI tools needed, uses `zca-js` library
- ✅ **Auto Cleanup** - QR image automatically deleted after login
- ✅ **Gateway Restart** - Optional restart prompt for certificate recognition
- ✅ **Pairing Mode** - Control who can message your bot
- ✅ **Group Support** - Works with both DMs and group chats
- ✅ **Stable & Reliable** - Built on battle-tested zca-js library

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

## Blocklist (Denylist) Features

### Block Individual Users Globally

Prevent specific users from messaging your bot in any context (DMs and groups):

```yaml
channels:
  zalo-personal:
    dmPolicy: open
    allowFrom: ["*"]
    denyFrom:
      - "Spam User"        # Block by name (auto-resolved to ID)
      - "123456789"        # Block by numeric ID
```

### Block Users in Specific Groups

Allow a group but block specific members within that group:

```yaml
channels:
  zalo-personal:
    groupPolicy: allowlist
    groups:
      "Work Chat":
        allow: true
        denyUsers:
          - "Bob"           # Bob can't trigger bot in this group
          - "987654321"     # Block by ID
      "Friends Group":
        allow: true
        # No denyUsers - everyone can use bot here
```

### Block Entire Groups

Simply don't add the group to your `groups` config, or set `allow: false`:

```yaml
channels:
  zalo-personal:
    groupPolicy: allowlist
    groups:
      "Spam Group":
        allow: false       # Block entire group
```

### Precedence Rules

**Deny ALWAYS wins over allow:**
- User in both `allowFrom` and `denyFrom` → BLOCKED
- User allowed globally but in `denyUsers` for a group → BLOCKED in that group
- Wildcard `*` in `allowFrom` but specific users in `denyFrom` → Those users BLOCKED

### Configuration Example: Mixed Allow/Deny

```yaml
channels:
  zalo-personal:
    dmPolicy: open
    allowFrom: ["*"]       # Allow everyone by default
    denyFrom:
      - "Spammer"          # Except this user
      - "Troll Account"
    groupPolicy: allowlist
    groups:
      "Public Group":
        allow: true
        denyUsers:
          - "BadActor"     # Block specific user in this group
      "Private Group":
        allow: true        # No blocks, everyone in group can use bot
```

### Name Resolution

- Bot automatically resolves names to IDs at startup
- Use friendly names instead of managing numeric IDs
- Unresolved names are logged as warnings (bot continues to work)
- Numeric IDs work directly without resolution

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

## Uninstall

To completely remove the extension:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/caochitam/zalo-personal/main/script/uninstall.sh)
```

This will:
- Logout from channel
- Disable plugin
- Remove all files
- Clean up configuration
- Optionally restart gateway

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

### User still getting through despite denyFrom
1. Check logs: `openclaw logs --follow`
2. Verify name resolution in startup logs
3. Use numeric ID if name doesn't resolve
4. Restart gateway: `openclaw gateway restart`

## Support

- 📚 [OpenClaw Docs](https://docs.openclaw.ai/)
- 🐛 [GitHub Issues](https://github.com/openclaw/openclaw/issues)
- 💬 [Discord Community](https://discord.gg/openclaw)

## 👥 Join Zalo Community

Tham gia nhóm Zalo để:
- 💬 Thảo luận và hỗ trợ lẫn nhau
- 🐛 Báo lỗi và request tính năng mới
- 📣 Cập nhật phiên bản mới nhất
- 🤝 Kết nối với cộng đồng OpenClaw VN

<p align="center">
  <a href="https://zalo.me/g/zgictz077">
    <img src="./zalo-group.jpg" alt="Join Zalo Group" width="300"/>
  </a>
</p>

**Link:** https://zalo.me/g/zgictz077

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

**Version**: 1.0.9
**OpenClaw**: 2026.2.9+
**Last Updated**: 2026-02-13
