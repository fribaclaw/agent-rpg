import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';
import { 
  AgentConfigSchema, 
  UpdateAgentRequestSchema, 
  WorkspaceFileSchema,
  GatewayStatusSchema,
  ErrorResponseSchema
} from '@agent-rpg/types';
import { getDatabase } from '../lib/database.js';
import { OpenClawClient } from '../lib/openclaw-client.js';

// Initialize tRPC
const t = initTRPC.create();

// Create router instance
export const router = t.router;
export const publicProcedure = t.procedure;

// Initialize OpenClaw client
const openclawClient = new OpenClawClient();

// Main API router
export const appRouter = router({
  // Agent management endpoints
  agents: router({
    // GET /api/agents - List all agents
    list: publicProcedure
      .query(async () => {
        try {
          const db = getDatabase();
          const agents = await db.agent.findMany({
            orderBy: { updatedAt: 'desc' },
          });

          // Transform database records to match schema
          const transformedAgents = agents.map(agent => ({
            id: agent.id,
            name: agent.name,
            description: agent.description,
            soul: agent.soul,
            tools: JSON.parse(agent.tools),
            channels: JSON.parse(agent.channels),
            memory: JSON.parse(agent.memory),
            status: agent.status as 'active' | 'inactive' | 'error',
            createdAt: agent.createdAt,
            updatedAt: agent.updatedAt,
          }));

          return {
            agents: transformedAgents,
            total: agents.length,
          };
        } catch (error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to fetch agents',
            cause: error,
          });
        }
      }),

    // GET /api/agents/:id - Get agent details
    get: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        try {
          const db = getDatabase();
          const agent = await db.agent.findUnique({
            where: { id: input.id },
          });

          if (!agent) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: `Agent with ID ${input.id} not found`,
            });
          }

          return {
            id: agent.id,
            name: agent.name,
            description: agent.description,
            soul: agent.soul,
            tools: JSON.parse(agent.tools),
            channels: JSON.parse(agent.channels),
            memory: JSON.parse(agent.memory),
            status: agent.status as 'active' | 'inactive' | 'error',
            createdAt: agent.createdAt,
            updatedAt: agent.updatedAt,
          };
        } catch (error) {
          if (error instanceof TRPCError) {
            throw error;
          }
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to fetch agent',
            cause: error,
          });
        }
      }),

    // PUT /api/agents/:id - Update agent config
    update: publicProcedure
      .input(z.object({
        id: z.string(),
        data: UpdateAgentRequestSchema,
      }))
      .mutation(async ({ input }) => {
        try {
          const db = getDatabase();
          
          // Check if agent exists
          const existingAgent = await db.agent.findUnique({
            where: { id: input.id },
          });

          if (!existingAgent) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: `Agent with ID ${input.id} not found`,
            });
          }

          // Update agent in database
          const updateData: any = { updatedAt: new Date() };
          
          if (input.data.name) updateData.name = input.data.name;
          if (input.data.description !== undefined) updateData.description = input.data.description;
          if (input.data.soul) updateData.soul = input.data.soul;
          if (input.data.tools) updateData.tools = JSON.stringify(input.data.tools);
          if (input.data.channels) updateData.channels = JSON.stringify(input.data.channels);
          if (input.data.status) updateData.status = input.data.status;

          const updatedAgent = await db.agent.update({
            where: { id: input.id },
            data: updateData,
          });

          // Sync with OpenClaw gateway
          try {
            await openclawClient.updateAgent(input.id, input.data);
          } catch (gatewayError) {
            // Log gateway error but don't fail the update
            console.warn('Failed to sync with OpenClaw gateway:', gatewayError);
          }

          return {
            id: updatedAgent.id,
            name: updatedAgent.name,
            description: updatedAgent.description,
            soul: updatedAgent.soul,
            tools: JSON.parse(updatedAgent.tools),
            channels: JSON.parse(updatedAgent.channels),
            memory: JSON.parse(updatedAgent.memory),
            status: updatedAgent.status as 'active' | 'inactive' | 'error',
            createdAt: updatedAgent.createdAt,
            updatedAt: updatedAgent.updatedAt,
          };
        } catch (error) {
          if (error instanceof TRPCError) {
            throw error;
          }
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to update agent',
            cause: error,
          });
        }
      }),
  }),

  // Workspace file management
  config: router({
    // GET /api/config/:file - Get workspace file
    get: publicProcedure
      .input(z.object({ filename: z.string() }))
      .query(async ({ input }) => {
        try {
          const db = getDatabase();
          
          // Try to get from database cache first
          let file = await db.workspaceFile.findUnique({
            where: { filename: input.filename },
          });

          // If not in cache or older than 5 minutes, fetch from OpenClaw
          const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
          if (!file || file.lastModified < fiveMinutesAgo) {
            const response = await openclawClient.getWorkspaceFile(input.filename);
            
            if (response.success && response.data) {
              const content = response.data.content || '';
              const size = content.length;
              
              // Upsert in database
              file = await db.workspaceFile.upsert({
                where: { filename: input.filename },
                create: {
                  filename: input.filename,
                  content,
                  size,
                  lastModified: new Date(),
                },
                update: {
                  content,
                  size,
                  lastModified: new Date(),
                },
              });
            } else {
              throw new TRPCError({
                code: 'NOT_FOUND',
                message: `File ${input.filename} not found in workspace`,
              });
            }
          }

          return {
            filename: file.filename,
            content: file.content,
            lastModified: file.lastModified,
            size: file.size,
          };
        } catch (error) {
          if (error instanceof TRPCError) {
            throw error;
          }
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to fetch workspace file',
            cause: error,
          });
        }
      }),

    // PUT /api/config/:file - Update workspace file
    update: publicProcedure
      .input(z.object({
        filename: z.string(),
        content: z.string(),
      }))
      .mutation(async ({ input }) => {
        try {
          const db = getDatabase();
          
          // Update file in OpenClaw
          const response = await openclawClient.updateWorkspaceFile(
            input.filename,
            input.content
          );

          if (!response.success) {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: `Failed to update file in OpenClaw: ${response.error}`,
            });
          }

          // Update in database cache
          const size = input.content.length;
          const file = await db.workspaceFile.upsert({
            where: { filename: input.filename },
            create: {
              filename: input.filename,
              content: input.content,
              size,
              lastModified: new Date(),
            },
            update: {
              content: input.content,
              size,
              lastModified: new Date(),
            },
          });

          return {
            filename: file.filename,
            content: file.content,
            lastModified: file.lastModified,
            size: file.size,
          };
        } catch (error) {
          if (error instanceof TRPCError) {
            throw error;
          }
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to update workspace file',
            cause: error,
          });
        }
      }),
  }),

  // Gateway status endpoint
  status: publicProcedure
    .query(async () => {
      try {
        const response = await openclawClient.getStatus();
        
        if (response.success) {
          return {
            status: 'online' as const,
            version: response.data?.version,
            uptime: response.data?.uptime,
            endpoints: response.data?.endpoints || [],
            lastCheck: new Date(),
          };
        } else {
          return {
            status: 'offline' as const,
            endpoints: [],
            lastCheck: new Date(),
          };
        }
      } catch (error) {
        return {
          status: 'error' as const,
          endpoints: [],
          lastCheck: new Date(),
        };
      }
    }),
});

// Export type definition
export type AppRouter = typeof appRouter;