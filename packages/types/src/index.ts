import { z } from 'zod';

// Agent Configuration Schema
export const AgentConfigSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  soul: z.string(), // SOUL.md content
  tools: z.array(z.string()).default([]),
  channels: z.array(z.string()).default([]),
  memory: z.record(z.any()).optional(),
  status: z.enum(['active', 'inactive', 'error']).default('inactive'),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type AgentConfig = z.infer<typeof AgentConfigSchema>;

// Workspace File Schema
export const WorkspaceFileSchema = z.object({
  filename: z.string(),
  content: z.string(),
  lastModified: z.date(),
  size: z.number(),
});

export type WorkspaceFile = z.infer<typeof WorkspaceFileSchema>;

// OpenClaw Gateway Status Schema
export const GatewayStatusSchema = z.object({
  status: z.enum(['online', 'offline', 'error']),
  version: z.string().optional(),
  uptime: z.number().optional(),
  endpoints: z.array(z.string()).default([]),
  lastCheck: z.date(),
});

export type GatewayStatus = z.infer<typeof GatewayStatusSchema>;

// WebSocket Message Types
export const WSMessageSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('agent_updated'),
    data: AgentConfigSchema,
  }),
  z.object({
    type: z.literal('config_updated'),
    data: z.object({
      filename: z.string(),
      content: z.string(),
    }),
  }),
  z.object({
    type: z.literal('gateway_status'),
    data: GatewayStatusSchema,
  }),
  z.object({
    type: z.literal('error'),
    data: z.object({
      message: z.string(),
      code: z.string().optional(),
    }),
  }),
]);

export type WSMessage = z.infer<typeof WSMessageSchema>;

// API Request/Response Types
export const ListAgentsResponseSchema = z.object({
  agents: z.array(AgentConfigSchema),
  total: z.number(),
});

export type ListAgentsResponse = z.infer<typeof ListAgentsResponseSchema>;

export const UpdateAgentRequestSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  soul: z.string().optional(),
  tools: z.array(z.string()).optional(),
  channels: z.array(z.string()).optional(),
  status: z.enum(['active', 'inactive', 'error']).optional(),
});

export type UpdateAgentRequest = z.infer<typeof UpdateAgentRequestSchema>;

// Error Response Schema
export const ErrorResponseSchema = z.object({
  error: z.string(),
  code: z.string().optional(),
  details: z.any().optional(),
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

// OpenClaw Gateway Integration Types
export const OpenClawCommandSchema = z.object({
  command: z.string(),
  args: z.array(z.string()).optional(),
  timeout: z.number().optional(),
});

export type OpenClawCommand = z.infer<typeof OpenClawCommandSchema>;

export const OpenClawResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
});

export type OpenClawResponse = z.infer<typeof OpenClawResponseSchema>;