# Example IDE Configurations

This directory contains example MCP configuration files for different IDEs.

## Setup Instructions

1. Run `billing-mcp setup` to create your MCP server and get a Server ID
2. Run `billing-mcp generate <userId> --server-id <serverId>` to get your personalized configuration
3. Copy the generated configuration to the appropriate location for your IDE

## Configuration Locations

### VSCode

Copy `vscode/mcp.json` to `.vscode/mcp.json` in your workspace.

```bash
mkdir -p .vscode
cp examples/vscode/mcp.json .vscode/mcp.json
```

Then update the placeholders:
- `YOUR_SERVER_ID` → Your MCP server ID from the setup command
- `YOUR_USER_ID` → Your user identifier (e.g., email)
- `YOUR_COMPOSIO_API_KEY` → Your Composio API key

### Kiro

Copy `kiro/mcp.json` to `.kiro/settings/mcp.json` in your workspace.

```bash
mkdir -p .kiro/settings
cp examples/kiro/mcp.json .kiro/settings/mcp.json
```

Then update the placeholders as described above.

### Claude Desktop

Copy `claude-desktop/claude_desktop_config.json` to your Claude Desktop configuration directory:

**macOS:**
```bash
cp examples/claude-desktop/claude_desktop_config.json ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

**Windows:**
```bash
copy examples\claude-desktop\claude_desktop_config.json %APPDATA%\Claude\claude_desktop_config.json
```

**Linux:**
```bash
cp examples/claude-desktop/claude_desktop_config.json ~/.config/Claude/claude_desktop_config.json
```

Then update the placeholders as described above.

## Placeholder Values

| Placeholder | Description | How to Get |
|-------------|-------------|------------|
| `YOUR_SERVER_ID` | MCP server identifier | Run `billing-mcp setup` |
| `YOUR_USER_ID` | User identifier for session isolation | Your email or unique ID |
| `YOUR_COMPOSIO_API_KEY` | Composio API key for authentication | [Composio Dashboard](https://app.composio.dev/settings) |

## Notes

- The `generate` command outputs ready-to-use configurations with your actual values filled in
- Restart your IDE after updating the configuration
- Each user should have their own unique `user_id` for session isolation
