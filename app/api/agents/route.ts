import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { withAuth, AuthenticatedRequest } from '@/lib/auth-middleware';
import { v4 as uuidv4 } from 'uuid';

// GET /api/agents - List user's agents
async function getAgents(req: AuthenticatedRequest) {
  try {
    const userId = req.user?.userId;

    const result = await query(
      `SELECT id, name, type, status, config, whatsapp_number, created_at, updated_at
       FROM agents
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    // Get today's usage stats for each agent
    const agentsWithStats = await Promise.all(
      result.rows.map(async (agent) => {
        const statsResult = await query(
          `SELECT 
            COALESCE(SUM(tokens_used), 0) as tokens_used,
            COALESCE(SUM(message_count), 0) as messages_today
           FROM usage_logs
           WHERE agent_id = $1 
           AND timestamp >= CURRENT_DATE`,
          [agent.id]
        );

        return {
          id: agent.id,
          name: agent.name,
          type: agent.type,
          status: agent.status,
          config: agent.config,
          whatsappNumber: agent.whatsapp_number,
          createdAt: agent.created_at,
          updatedAt: agent.updated_at,
          tokensUsed: parseInt(statsResult.rows[0].tokens_used),
          messagesToday: parseInt(statsResult.rows[0].messages_today),
        };
      })
    );

    return NextResponse.json({
      success: true,
      agents: agentsWithStats,
    });
  } catch (error) {
    console.error('Get agents error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agents' },
      { status: 500 }
    );
  }
}

// POST /api/agents - Create new agent
async function createAgent(req: AuthenticatedRequest) {
  try {
    const userId = req.user?.userId;
    const body = await req.json();
    const { name, type, config, whatsappNumber } = body;

    // Validation
    if (!name || !type) {
      return NextResponse.json(
        { error: 'Name and type are required' },
        { status: 400 }
      );
    }

    // Check agent limit based on plan
    const userPlan = req.user?.plan;
    const agentLimit = userPlan === 'pro' ? 10 : 1;

    const countResult = await query(
      'SELECT COUNT(*) as count FROM agents WHERE user_id = $1',
      [userId]
    );

    if (parseInt(countResult.rows[0].count) >= agentLimit) {
      return NextResponse.json(
        { error: `Agent limit reached. ${userPlan === 'starter' ? 'Upgrade to Pro for more agents.' : ''}` },
        { status: 403 }
      );
    }

    // Generate API key for agent
    const apiKey = `ak_${uuidv4().replace(/-/g, '')}`;

    // Create agent
    const result = await query(
      `INSERT INTO agents (user_id, name, type, status, config, whatsapp_number, api_key)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, name, type, status, config, whatsapp_number, api_key, created_at`,
      [userId, name, type, 'pending', JSON.stringify(config || {}), whatsappNumber, apiKey]
    );

    const agent = result.rows[0];

    return NextResponse.json({
      success: true,
      agent: {
        id: agent.id,
        name: agent.name,
        type: agent.type,
        status: agent.status,
        config: agent.config,
        whatsappNumber: agent.whatsapp_number,
        apiKey: agent.api_key,
        createdAt: agent.created_at,
      },
    });
  } catch (error) {
    console.error('Create agent error:', error);
    return NextResponse.json(
      { error: 'Failed to create agent' },
      { status: 500 }
    );
  }
}

export const GET = withAuth(getAgents);
export const POST = withAuth(createAgent);
