/**
 * Type definitions for Billing Invoice Automation MCP
 */

export interface SetupConfig {
  composioApiKey: string;
  serverName: string;
}

export interface SetupResult {
  serverId: string;
  serverName: string;
  toolkits: string[];
  allowedTools: string[];
}

export interface MCPServerConfig {
  name: string;
  toolkits: ToolkitConfig[];
  allowedTools: string[];
}

export interface ToolkitConfig {
  toolkit: string;
  authConfigId?: string;
}

export interface GenerateUrlConfig {
  composioApiKey: string;
  serverId: string;
  userId: string;
}

export interface GeneratedUrl {
  url: string;
  headers: Record<string, string>;
}

export interface IDEConfig {
  vscode: VSCodeMCPConfig;
  kiro: VSCodeMCPConfig;
  claudeDesktop: ClaudeDesktopMCPConfig;
}

export interface VSCodeMCPConfig {
  mcpServers: {
    [serverLabel: string]: {
      type: "http";
      url: string;
      headers: Record<string, string>;
    };
  };
}

export interface ClaudeDesktopMCPConfig {
  mcpServers: {
    [serverLabel: string]: {
      command?: string;
      args?: string[];
      url?: string;
      type?: string;
      headers?: Record<string, string>;
    };
  };
}

export interface ComposioMCPServer {
  id: string;
  name: string;
  toolkits: Array<{
    toolkit: string;
    authConfigId?: string;
  }>;
  allowedTools: string[];
  createdAt: string;
}

export interface ComposioMCPInstance {
  url: string;
  allowedTools: string[];
}
