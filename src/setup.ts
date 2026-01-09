/**
 * MCP Server Setup Module
 * 
 * Handles Composio client initialization and MCP server creation
 */

import { Composio } from '@composio/core';
import type { SetupConfig, SetupResult } from './types.js';
import { BILLING_MCP_CONFIG, BILLING_ALLOWED_TOOLS, BILLING_TOOLKITS } from './config.js';

/**
 * Error thrown when API key is missing or invalid
 */
export class ComposioApiKeyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ComposioApiKeyError';
  }
}

/**
 * Error thrown when MCP server creation fails
 */
export class MCPServerError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'MCPServerError';
  }
}

/**
 * Initialize Composio client with API key from environment
 * 
 * @returns Initialized Composio client
 * @throws {ComposioApiKeyError} If COMPOSIO_API_KEY is not set
 */
export function initializeComposioClient(): Composio {
  const apiKey = process.env.COMPOSIO_API_KEY;
  
  if (!apiKey) {
    throw new ComposioApiKeyError(
      'COMPOSIO_API_KEY environment variable is required. ' +
      'Please set it before running the setup command.'
    );
  }
  
  if (apiKey.trim() === '') {
    throw new ComposioApiKeyError(
      'COMPOSIO_API_KEY environment variable cannot be empty.'
    );
  }
  
  try {
    return new Composio({
      apiKey,
      disableVersionCheck: true,
    });
  } catch (error) {
    throw new ComposioApiKeyError(
      `Failed to initialize Composio client: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Get API key from environment
 * 
 * @returns The API key if set
 * @throws {ComposioApiKeyError} If API key is not set or empty
 */
export function getApiKey(): string {
  const apiKey = process.env.COMPOSIO_API_KEY;
  
  if (!apiKey || apiKey.trim() === '') {
    throw new ComposioApiKeyError(
      'COMPOSIO_API_KEY environment variable is required.'
    );
  }
  
  return apiKey;
}

/**
 * Create or retrieve an MCP server with billing-specific configuration
 * 
 * This function creates a new MCP server configured with billing toolkits
 * (Gmail, Google Sheets, Google Drive, Outlook, Xero) and restricted to
 * billing-relevant tools only.
 * 
 * If a server with the same name already exists with matching configuration,
 * it returns the existing server's details.
 * 
 * @param config - Setup configuration containing API key and server name
 * @returns Setup result with server ID, name, toolkits, and allowed tools
 * @throws {ComposioApiKeyError} If API key is missing or invalid
 * @throws {MCPServerError} If server creation fails or name conflict with different config
 */
export async function setup(config: SetupConfig): Promise<SetupResult> {
  // Initialize the Composio client
  const composio = new Composio({
    apiKey: config.composioApiKey,
    disableVersionCheck: true,
  });

  const serverName = config.serverName || BILLING_MCP_CONFIG.name;
  const toolkits = BILLING_TOOLKITS.map(t => t.toolkit);
  const allowedTools = BILLING_ALLOWED_TOOLS;

  try {
    // Try to create the MCP server using the experimental API
    const mcpConfig = await composio.mcp.create(serverName, {
      toolkits: toolkits,
      allowedTools: allowedTools,
      manuallyManageConnections: false, // Enable chat-based auth
    });

    return {
      serverId: mcpConfig.id,
      serverName: mcpConfig.name,
      toolkits: toolkits,
      allowedTools: allowedTools,
    };
  } catch (error) {
    // Handle specific error cases
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Check if it's a name conflict with different configuration
    if (errorMessage.includes('already exists')) {
      throw new MCPServerError(
        `MCP server with name '${serverName}' already exists with different configuration. ` +
        'Please use a different server name or delete the existing server.',
        error
      );
    }
    
    // Check for API key issues
    if (errorMessage.includes('Invalid') || errorMessage.includes('unauthorized') || errorMessage.includes('401')) {
      throw new ComposioApiKeyError('Invalid Composio API key');
    }
    
    throw new MCPServerError(
      `Failed to create MCP server: ${errorMessage}`,
      error
    );
  }
}

/**
 * Setup MCP server using environment variables
 * 
 * Convenience function that reads COMPOSIO_API_KEY from environment
 * and creates the billing MCP server with default configuration.
 * 
 * @param serverName - Optional custom server name (defaults to 'billing-invoice-automation')
 * @returns Setup result with server ID, name, toolkits, and allowed tools
 * @throws {ComposioApiKeyError} If COMPOSIO_API_KEY is not set
 * @throws {MCPServerError} If server creation fails
 */
export async function setupFromEnv(serverName?: string): Promise<SetupResult> {
  const apiKey = getApiKey();
  
  return setup({
    composioApiKey: apiKey,
    serverName: serverName || BILLING_MCP_CONFIG.name,
  });
}
