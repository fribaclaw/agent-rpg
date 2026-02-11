import { OpenClawCommand, OpenClawResponse } from '@agent-rpg/types';
import { z } from 'zod';

export class OpenClawClient {
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl = 'http://localhost:18789', timeout = 10000) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  /**
   * Execute a command on the OpenClaw gateway
   */
  async executeCommand(command: OpenClawCommand): Promise<OpenClawResponse> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseUrl}/api/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(command),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return {
          success: false,
          error: `Request timeout after ${this.timeout}ms`,
        };
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Check gateway status
   */
  async getStatus(): Promise<OpenClawResponse> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // Shorter timeout for status check

      const response = await fetch(`${this.baseUrl}/api/status`, {
        method: 'GET',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Gateway unreachable',
      };
    }
  }

  /**
   * Get workspace file content from OpenClaw
   */
  async getWorkspaceFile(filename: string): Promise<OpenClawResponse> {
    return this.executeCommand({
      command: 'read',
      args: [filename],
    });
  }

  /**
   * Update workspace file content in OpenClaw
   */
  async updateWorkspaceFile(filename: string, content: string): Promise<OpenClawResponse> {
    return this.executeCommand({
      command: 'write',
      args: [filename, content],
    });
  }

  /**
   * List all agents from OpenClaw
   */
  async listAgents(): Promise<OpenClawResponse> {
    return this.executeCommand({
      command: 'agents',
      args: ['list'],
    });
  }

  /**
   * Get specific agent details from OpenClaw
   */
  async getAgent(id: string): Promise<OpenClawResponse> {
    return this.executeCommand({
      command: 'agents',
      args: ['get', id],
    });
  }

  /**
   * Update agent configuration in OpenClaw
   */
  async updateAgent(id: string, config: Record<string, any>): Promise<OpenClawResponse> {
    return this.executeCommand({
      command: 'agents',
      args: ['update', id, JSON.stringify(config)],
    });
  }

  /**
   * Test connection to gateway
   */
  async ping(): Promise<boolean> {
    const result = await this.getStatus();
    return result.success;
  }
}