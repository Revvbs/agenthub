import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { withAuth, AuthenticatedRequest } from '@/lib/auth-middleware';

function extractId(req: NextRequest): string | null {
  const parts = req.url.split('/api/agents/');
  return parts[1]?.split('?')[0]?.split('/')[0] || null;
}

// GET /api/agents/[id] - Get single agent
async function getAgent(req: AuthenticatedRequest) {
  try {
    const userId = req.user?.userId;
    const agentId = extractId(req);
    if (!agentId) {
      return NextResponse.json({ error: 'Agent ID required' }, { status: 400 });
    }

    const result = await query(
      `SELECT id, name, type, status, config, whatsapp_number, api_key, created_at, updated_at
       FROM agents
       WHERE id = $1 AND user_id = $2`,
      [agentId, userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    const agent = result.rows[0];

    // Get usage stats
    const statsResult = await query(
      `SELECT 
        COALESCE(SUM(tokens_used), 0) as total_tokens,
        COALESCE(SUM(message_count), 0) as total_messages
       FROM usage_logs
       WHERE agent_id = $1`,
      [agentId]
    );

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
        updatedAt: agent.updated_at,
        totalTokens: parseInt(statsResult.rows[0].total_tokens),
        totalMessages: parseInt(statsResult.rows[0].total_messages),
      },
    });
  } catch (error) {
    console.error('Get agent error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agent' },
      { status: 500 }
    );
  }
}

// PATCH /api/agents/[id] - Update agent
async function updateAgent(req: AuthenticatedRequest) {
  try {
    const userId = req.user?.userId;
    const agentId = extractId(req);
    if (!agentId) {
      return NextResponse.json({ error: 'Agent ID required' }, { status: 400 });
    }

    const body = await req.json();
    const { name, status, config, whatsappNumber } = body;

    // Check ownership
    const checkResult = await query(
      'SELECT id FROM agents WHERE id = $1 AND user_id = $2',
      [agentId, userId]
    );

    if (checkResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    // Build update query dynamically
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      values.push(name);
    }
    if (status !== undefined) {
      updates.push(`status = $${paramCount++}`);
      values.push(status);
    }
    if (config !== undefined) {
      updates.push(`config = $${paramCount++}`);
      values.push(JSON.stringify(config));
    }
    if (whatsappNumber !== undefined) {
      updates.push(`whatsapp_number = $${paramCount++}`);
      values.push(whatsappNumber);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(agentId, userId);

    const result = await query(
      `UPDATE agents 
       SET ${updates.join(', ')}
       WHERE id = $${paramCount++} AND user_id = $${paramCount++}
       RETURNING id, name, type, status, config, whatsapp_number, updated_at`,
      values
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
        updatedAt: agent.updated_at,
      },
    });
  } catch (error) {
    console.error('Update agent error:', error);
    return NextResponse.json(
      { error: 'Failed to update agent' },
      { status: 500 }
    );
  }
}

// DELETE /api/agents/[id] - Delete agent
async function deleteAgent(req: AuthenticatedRequest) {
  try {
    const userId = req.user?.userId;
    const agentId = extractId(req);
    if (!agentId) {
      return NextResponse.json({ error: 'Agent ID required' }, { status: 400 });
    }

    const result = await query(
      'DELETE FROM agents WHERE id = $1 AND user_id = $2 RETURNING id',
      [agentId, userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Agent deleted successfully',
    });
  } catch (error) {
    console.error('Delete agent error:', error);
    return NextResponse.json(
      { error: 'Failed to delete agent' },
      { status: 500 }
    );
  }
}

export const GET = withAuth(getAgent);
export const PATCH = withAuth(updateAgent);
export const DELETE = withAuth(deleteAgent);
