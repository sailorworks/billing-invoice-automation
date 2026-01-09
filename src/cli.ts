#!/usr/bin/env node
/**
 * CLI entry point for Billing Invoice Automation MCP
 * 
 * Commands:
 * - setup: Create and configure the MCP server with billing toolkits
 * - generate <userId>: Generate MCP URL and IDE configuration for a user
 */

import { Command } from 'commander';
import dotenv from 'dotenv';
import { setupFromEnv, getApiKey, ComposioApiKeyError, MCPServerError } from './setup.js';
import { 
  generateUserUrl, 
  generateIDEConfigs, 
  formatIDEConfig,
  getIDEConfigPath,
  UrlGenerationError 
} from './generate-url.js';

// Load environment variables
dotenv.config();

const program = new Command();

program
  .name('billing-mcp')
  .description('CLI utility for creating and configuring a Composio MCP server for billing automation')
  .version('1.0.0');

/**
 * Setup command - Creates the MCP server with billing toolkits
 * Requirements: 1.4
 */
program
  .command('setup')
  .description('Create and configure the MCP server with billing toolkits')
  .option('-n, --name <name>', 'Custom server name', 'billing-invoice-automation')
  .action(async (options) => {
    try {
      console.log('Setting up billing MCP server...\n');
      
      const result = await setupFromEnv(options.name);
      
      console.log('✅ MCP server created successfully!\n');
      console.log(`Server ID: ${result.serverId}`);
      console.log(`Server Name: ${result.serverName}`);
      console.log(`\nConfigured Toolkits: ${result.toolkits.join(', ')}`);
      console.log(`\nAllowed Tools (${result.allowedTools.length}):`);
      result.allowedTools.forEach(tool => console.log(`  - ${tool}`));
      console.log('\nNext step: Run "billing-mcp generate <userId>" to generate a URL for a user.');
    } catch (error) {
      if (error instanceof ComposioApiKeyError) {
        console.error(`\n❌ API Key Error: ${error.message}`);
        process.exit(1);
      }
      if (error instanceof MCPServerError) {
        console.error(`\n❌ Server Error: ${error.message}`);
        process.exit(1);
      }
      console.error(`\n❌ Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      process.exit(1);
    }
  });

/**
 * Generate command - Generates MCP URL and IDE configuration for a user
 * Requirements: 3.3, 4.1, 4.2, 4.3
 */
program
  .command('generate <userId>')
  .description('Generate MCP URL and IDE configuration for a user')
  .requiredOption('-s, --server-id <serverId>', 'MCP server ID (from setup command)')
  .option('-l, --label <label>', 'Server label for IDE configs', 'billing-agent')
  .action(async (userId: string, options) => {
    try {
      console.log(`Generating MCP URL for user: ${userId}\n`);
      
      // Get API key from environment
      const apiKey = getApiKey();
      
      // Generate the user-specific URL
      const generatedUrl = await generateUserUrl({
        composioApiKey: apiKey,
        serverId: options.serverId,
        userId: userId,
      });
      
      // Generate IDE configurations
      const ideConfigs = generateIDEConfigs(generatedUrl, options.label);
      
      // Output the URL
      console.log('✅ MCP URL generated successfully!\n');
      console.log('═══════════════════════════════════════════════════════════════');
      console.log('MCP URL:');
      console.log('═══════════════════════════════════════════════════════════════');
      console.log(generatedUrl.url);
      console.log('');
      
      // Output VSCode configuration
      console.log('═══════════════════════════════════════════════════════════════');
      console.log(`VSCode Configuration (${getIDEConfigPath('vscode')}):`);
      console.log('═══════════════════════════════════════════════════════════════');
      console.log(formatIDEConfig(ideConfigs.vscode));
      console.log('');
      
      // Output Kiro configuration
      console.log('═══════════════════════════════════════════════════════════════');
      console.log(`Kiro Configuration (${getIDEConfigPath('kiro')}):`);
      console.log('═══════════════════════════════════════════════════════════════');
      console.log(formatIDEConfig(ideConfigs.kiro));
      console.log('');
      
      // Output Claude Desktop configuration
      console.log('═══════════════════════════════════════════════════════════════');
      console.log(`Claude Desktop Configuration (${getIDEConfigPath('claudeDesktop')}):`);
      console.log('═══════════════════════════════════════════════════════════════');
      console.log(formatIDEConfig(ideConfigs.claudeDesktop));
      console.log('');
      
      console.log('═══════════════════════════════════════════════════════════════');
      console.log('Note: Replace YOUR_COMPOSIO_API_KEY with your actual API key');
      console.log('if the placeholder is shown in the configuration above.');
      console.log('═══════════════════════════════════════════════════════════════');
      
    } catch (error) {
      if (error instanceof ComposioApiKeyError) {
        console.error(`\n❌ API Key Error: ${error.message}`);
        process.exit(1);
      }
      if (error instanceof UrlGenerationError) {
        console.error(`\n❌ URL Generation Error: ${error.message}`);
        process.exit(1);
      }
      console.error(`\n❌ Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      process.exit(1);
    }
  });

program.parse();
