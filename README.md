# Billing Invoice Automation MCP

A CLI utility that creates and configures a Composio MCP server for billing automation. Generate MCP URLs for your IDE (VSCode, Claude Desktop) to automate invoice generation, expense tracking, travel bill organization, and payment via natural language chat.

## Features

- **Email Invoice Ingestion**: Fetch invoices from Gmail and Outlook via natural language
- **Spreadsheet Tracking**: Store and organize invoice data in Google Sheets
- **Travel Bill Organization**: Categorize and track travel expenses
- **Invoice Generation**: Create and send invoices via email
- **Xero Integration**: Sync invoice data with Xero accounting

## Prerequisites

- Node.js 18.0.0 or higher
- A [Composio](https://platform.composio.dev/) account and API key

## Quick Start

### Step 1: Clone and Install

```bash
git clone <repository-url>
cd Billing-Automation
npm install
npm run build
```

### Step 2: Configure Environment

Create a `.env` file in the root directory:

```bash
COMPOSIO_API_KEY=your_api_key_here
```

Get your API key from the [Composio Dashboard](https://platform.composio.dev/).

### Step 3: Create MCP Server

```bash
node dist/cli.js setup
```

Save the **Server ID** from the output (e.g., `d923db26-cabf-480b-9fe2-b3445e4988c1`).

### Step 4: Generate MCP URL

```bash
node dist/cli.js generate your@email.com --server-id your_server_id
```

This outputs your MCP URL and IDE configuration snippets.

### Step 5: Configure Your IDE

Copy the generated configuration to your IDE:

**VSCode** → `.vscode/mcp.json`

```json
{
  "mcpServers": {
    "billing-agent": {
      "type": "http",
      "url": "https://backend.composio.dev/v3/mcp/YOUR_SERVER_ID?user_id=your@email.com",
      "headers": {
        "x-api-key": "YOUR_COMPOSIO_API_KEY"
      }
    }
  }
}
```

**Claude Desktop** → `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS)

```json
{
  "mcpServers": {
    "billing-agent": {
      "type": "http",
      "url": "https://backend.composio.dev/v3/mcp/YOUR_SERVER_ID?user_id=your@email.com",
      "headers": {
        "x-api-key": "YOUR_COMPOSIO_API_KEY"
      }
    }
  }
}
```

### Step 6: Restart Your IDE

Restart VSCode or Claude Desktop to load the new MCP configuration.

## Example Chat Interactions

Once configured, you can interact with the billing agent via natural language:

**Fetch invoices from email:**
> "Fetch all invoices from my Gmail from November 2025"

**Track expenses in a spreadsheet:**
> "Create a Google Sheet to track my invoices and add the ones you just found"

**Organize travel expenses:**
> "Find all my travel receipts from the last month and categorize them by type"

**Generate and send an invoice:**
> "Create an invoice for $500 for consulting services and send it to client@example.com"

**Sync with Xero:**
> "List my recent invoices from Xero and check if any are overdue"

## Authentication

When you first use a tool that requires authentication (e.g., Gmail, Google Sheets), the MCP server will prompt you with an OAuth authorization URL. Click the link to authenticate, and the connection will be saved for future use.

## Configured Tools

| Toolkit | Tools |
|---------|-------|
| Gmail | `GMAIL_FETCH_EMAILS`, `GMAIL_GET_ATTACHMENT`, `GMAIL_SEND_EMAIL` |
| Google Sheets | `GOOGLESHEETS_BATCH_UPDATE`, `GOOGLESHEETS_CREATE_GOOGLE_SHEET1` |
| Google Drive | `GOOGLEDRIVE_DOWNLOAD_FILE`, `GOOGLEDRIVE_UPLOAD_FILE` |
| Outlook | `OUTLOOK_SEARCH_MESSAGES`, `OUTLOOK_GET_ATTACHMENT` |
| Xero | `XERO_LIST_INVOICES`, `XERO_CREATE_INVOICE` |

## Troubleshooting

### "COMPOSIO_API_KEY environment variable is required"

Make sure you've created a `.env` file with your API key.

### "Invalid Composio API key"

Verify your API key is correct in the [Composio Dashboard](https://platform.composio.dev/).

### IDE not connecting to MCP server

1. Verify the URL and API key in your IDE configuration
2. Restart your IDE after updating the configuration
3. Check that your Composio API key has the necessary permissions
   
### License

This project is under MIT license.
