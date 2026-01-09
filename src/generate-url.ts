/**
 * URL Generator Module
 * 
 * Generates user-specific MCP URLs and IDE configuration snippets
 */

import { Composio } from '@composio/core';
import type { 
  GenerateUrlConfig, 
  GeneratedUrl, 
  IDEConfig,
  VSCodeMCPConfig,
  ClaudeDesktopMCPConfig 
} from './types.js';

/**
 * Error thrown when URL generation fails
 */
export class UrlGenerationError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'UrlGenerationError';
  }
}

/**
 * Generate a user-specific MCP URL
 * 
 * This function generates a unique MCP endpoint URL for a specific user.
 * The URL can be used to configure IDE MCP clients.
 * 
 * @param config - Configuration containing API key, server ID, and user ID
 * @returns Generated URL and headers for MCP client configuration
 * @throws {UrlGenerationError} If URL generation fails
 */
export async function generateUserUrl(config: GenerateUrlConfig): Promise<GeneratedUrl> {
  const { composioApiKey, serverId, userId } = config;

  if (!composioApiKey || composioApiKey.trim() === '') {
    throw new UrlGenerationError('Composio API key is required');
  }

  if (!serverId || serverId.trim() === '') {
    throw new UrlGenerationError('Server ID is required');
  }

  if (!userId || userId.trim() === '') {
    throw new UrlGenerationError('User ID is required');
  }

  const composio = new Composio({
    apiKey: composioApiKey,
    disableVersionCheck: true,
  });

  try {
    // Use the experimental MCP generate method to get the URL
    const serverInstance = await composio.mcp.generate(userId, serverId, {
      manuallyManageConnections: false, // Enable chat-based auth
    });

    return {
      url: serverInstance.url,
      headers: {
        'x-api-key': composioApiKey,
      },
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new UrlGenerationError(
      `Failed to generate MCP URL: ${errorMessage}`,
      error
    );
  }
}

/**
 * Generate IDE configuration snippets for the MCP URL
 * 
 * Creates ready-to-use JSON configuration snippets for VSCode, Kiro, and Claude Desktop.
 * 
 * @param generatedUrl - The generated URL and headers from generateUserUrl
 * @param serverLabel - Label to use for the server in IDE configs (default: 'billing-agent')
 * @returns IDE configuration objects for VSCode, Kiro, and Claude Desktop
 */
export function generateIDEConfigs(
  generatedUrl: GeneratedUrl, 
  serverLabel: string = 'billing-agent'
): IDEConfig {
  const { url, headers } = generatedUrl;

  // VSCode MCP configuration
  const vscodeConfig: VSCodeMCPConfig = {
    mcpServers: {
      [serverLabel]: {
        type: 'http',
        url: url,
        headers: {
          ...headers,
          // Add placeholder comment for API key
          'x-api-key': headers['x-api-key'] || 'YOUR_COMPOSIO_API_KEY',
        },
      },
    },
  };

  // Kiro uses the same format as VSCode
  const kiroConfig: VSCodeMCPConfig = {
    mcpServers: {
      [serverLabel]: {
        type: 'http',
        url: url,
        headers: {
          ...headers,
          'x-api-key': headers['x-api-key'] || 'YOUR_COMPOSIO_API_KEY',
        },
      },
    },
  };

  // Claude Desktop configuration
  const claudeDesktopConfig: ClaudeDesktopMCPConfig = {
    mcpServers: {
      [serverLabel]: {
        type: 'http',
        url: url,
        headers: {
          ...headers,
          'x-api-key': headers['x-api-key'] || 'YOUR_COMPOSIO_API_KEY',
        },
      },
    },
  };

  return {
    vscode: vscodeConfig,
    kiro: kiroConfig,
    claudeDesktop: claudeDesktopConfig,
  };
}

/**
 * Format IDE configuration as a pretty-printed JSON string
 * 
 * @param config - IDE configuration object
 * @returns Pretty-printed JSON string
 */
export function formatIDEConfig(config: VSCodeMCPConfig | ClaudeDesktopMCPConfig): string {
  return JSON.stringify(config, null, 2);
}

/**
 * Generate VSCode-specific MCP configuration
 * 
 * @param generatedUrl - The generated URL and headers
 * @param serverLabel - Label for the server (default: 'billing-agent')
 * @returns VSCode MCP configuration object
 */
export function generateVSCodeConfig(
  generatedUrl: GeneratedUrl,
  serverLabel: string = 'billing-agent'
): VSCodeMCPConfig {
  return generateIDEConfigs(generatedUrl, serverLabel).vscode;
}

/**
 * Generate Kiro-specific MCP configuration
 * 
 * @param generatedUrl - The generated URL and headers
 * @param serverLabel - Label for the server (default: 'billing-agent')
 * @returns Kiro MCP configuration object
 */
export function generateKiroConfig(
  generatedUrl: GeneratedUrl,
  serverLabel: string = 'billing-agent'
): VSCodeMCPConfig {
  return generateIDEConfigs(generatedUrl, serverLabel).kiro;
}

/**
 * Generate Claude Desktop-specific MCP configuration
 * 
 * @param generatedUrl - The generated URL and headers
 * @param serverLabel - Label for the server (default: 'billing-agent')
 * @returns Claude Desktop MCP configuration object
 */
export function generateClaudeDesktopConfig(
  generatedUrl: GeneratedUrl,
  serverLabel: string = 'billing-agent'
): ClaudeDesktopMCPConfig {
  return generateIDEConfigs(generatedUrl, serverLabel).claudeDesktop;
}

/**
 * Get the file path where IDE config should be saved
 * 
 * @param ide - The IDE type ('vscode' | 'kiro' | 'claudeDesktop')
 * @returns The recommended file path for the config
 */
export function getIDEConfigPath(ide: 'vscode' | 'kiro' | 'claudeDesktop'): string {
  switch (ide) {
    case 'vscode':
      return '.vscode/mcp.json';
    case 'kiro':
      return '.kiro/settings/mcp.json';
    case 'claudeDesktop':
      return '~/Library/Application Support/Claude/claude_desktop_config.json';
    default:
      return 'mcp.json';
  }
}

/**
 * Generate URL and IDE configs in one call
 * 
 * Convenience function that combines URL generation and IDE config generation.
 * 
 * @param config - Configuration containing API key, server ID, and user ID
 * @param serverLabel - Label to use for the server in IDE configs
 * @returns Object containing the generated URL, headers, and IDE configs
 */
export async function generateUrlWithConfigs(
  config: GenerateUrlConfig,
  serverLabel: string = 'billing-agent'
): Promise<{ url: GeneratedUrl; ideConfigs: IDEConfig }> {
  const url = await generateUserUrl(config);
  const ideConfigs = generateIDEConfigs(url, serverLabel);
  
  return { url, ideConfigs };
}
