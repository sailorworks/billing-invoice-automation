/**
 * Billing MCP Server Configuration
 * 
 * Defines the toolkits and allowed tools for billing automation
 */

import type { MCPServerConfig, ToolkitConfig } from './types.js';

/**
 * Billing-specific toolkits
 */
export const BILLING_TOOLKITS: ToolkitConfig[] = [
  { toolkit: 'gmail' },
  { toolkit: 'googlesheets' },
  { toolkit: 'googledrive' },
  { toolkit: 'outlook' },
  { toolkit: 'xero' }
];

/**
 * Allowed tools for billing operations
 */
export const BILLING_ALLOWED_TOOLS: string[] = [
  // Gmail tools
  'GMAIL_FETCH_EMAILS',
  'GMAIL_GET_ATTACHMENT',
  'GMAIL_SEND_EMAIL',
  // Google Sheets tools
  'GOOGLESHEETS_BATCH_UPDATE',
  'GOOGLESHEETS_CREATE_GOOGLE_SHEET1',
  // Google Drive tools
  'GOOGLEDRIVE_DOWNLOAD_FILE',
  'GOOGLEDRIVE_UPLOAD_FILE',
  // Outlook tools
  'OUTLOOK_SEARCH_MESSAGES',
  'OUTLOOK_GET_ATTACHMENT',
  // Xero tools
  'XERO_LIST_INVOICES',
  'XERO_CREATE_INVOICE'
];

/**
 * Complete MCP server configuration for billing automation
 */
export const BILLING_MCP_CONFIG: MCPServerConfig = {
  name: 'billing-invoice-automation',
  toolkits: BILLING_TOOLKITS,
  allowedTools: BILLING_ALLOWED_TOOLS
};
