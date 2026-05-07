import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { withAuth, AuthenticatedRequest } from '@/lib/auth-middleware';

// GET /api/usage - Get user's usage stats
async function getUsage(req: AuthenticatedRequest) {
  try {
    const userId = req.user?.userId;

    // Get user's current token usage
    const userResult = await query(
      'SELECT tokens_limit, tokens_used, plan FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const user = userResult.rows[0];

    // Get today's usage
    const todayResult = await query(
      `SELECT 
        COALESCE(SUM(tokens_used), 0) as tokens_today,
        COALESCE(SUM(message_count), 0) as messages_today
       FROM usage_logs
       WHERE user_id = $1 
       AND timestamp >= CURRENT_DATE`,
      [userId]
    );

    // Get this month's usage
    const monthResult = await query(
      `SELECT 
        COALESCE(SUM(tokens_used), 0) as tokens_month,
        COALESCE(SUM(message_count), 0) as messages_month
       FROM usage_logs
       WHERE user_id = $1 
       AND timestamp >= DATE_TRUNC('month', CURRENT_DATE)`,
      [userId]
    );

    // Get usage by agent (top 5)
    const agentUsageResult = await query(
      `SELECT 
        a.id,
        a.name,
        COALESCE(SUM(ul.tokens_used), 0) as tokens_used,
        COALESCE(SUM(ul.message_count), 0) as message_count
       FROM agents a
       LEFT JOIN usage_logs ul ON a.id = ul.agent_id
       WHERE a.user_id = $1
       GROUP BY a.id, a.name
       ORDER BY tokens_used DESC
       LIMIT 5`,
      [userId]
    );

    // Get daily usage for last 7 days
    const dailyUsageResult = await query(
      `SELECT 
        DATE(timestamp) as date,
        COALESCE(SUM(tokens_used), 0) as tokens_used,
        COALESCE(SUM(message_count), 0) as message_count
       FROM usage_logs
       WHERE user_id = $1 
       AND timestamp >= CURRENT_DATE - INTERVAL '7 days'
       GROUP BY DATE(timestamp)
       ORDER BY date DESC`,
      [userId]
    );

    return NextResponse.json({
      success: true,
      usage: {
        plan: user.plan,
        tokensLimit: user.tokens_limit,
        tokensUsed: user.tokens_used,
        tokensRemaining: user.tokens_limit - user.tokens_used,
        today: {
          tokens: parseInt(todayResult.rows[0].tokens_today),
          messages: parseInt(todayResult.rows[0].messages_today),
        },
        thisMonth: {
          tokens: parseInt(monthResult.rows[0].tokens_month),
          messages: parseInt(monthResult.rows[0].messages_month),
        },
        byAgent: agentUsageResult.rows.map(row => ({
          agentId: row.id,
          agentName: row.name,
          tokensUsed: parseInt(row.tokens_used),
          messageCount: parseInt(row.message_count),
        })),
        daily: dailyUsageResult.rows.map(row => ({
          date: row.date,
          tokensUsed: parseInt(row.tokens_used),
          messageCount: parseInt(row.message_count),
        })),
      },
    });
  } catch (error) {
    console.error('Get usage error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch usage data' },
      { status: 500 }
    );
  }
}

// POST /api/usage - Log usage (called by agents)
async function logUsage(req: AuthenticatedRequest) {
  try {
    const body = await req.json();
    const { agentId, tokensUsed, messageCount = 1 } = body;

    if (!agentId || !tokensUsed) {
      return NextResponse.json(
        { error: 'agentId and tokensUsed are required' },
        { status: 400 }
      );
    }

    const userId = req.user?.userId;

    // Verify agent ownership
    const agentResult = await query(
      'SELECT id FROM agents WHERE id = $1 AND user_id = $2',
      [agentId, userId]
    );

    if (agentResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    // Check if user has enough tokens
    const userResult = await query(
      'SELECT tokens_limit, tokens_used FROM users WHERE id = $1',
      [userId]
    );

    const user = userResult.rows[0];
    if (user.tokens_used + tokensUsed > user.tokens_limit) {
      return NextResponse.json(
        { error: 'Token limit exceeded' },
        { status: 403 }
      );
    }

    // Log usage
    await query(
      `INSERT INTO usage_logs (user_id, agent_id, tokens_used, message_count)
       VALUES ($1, $2, $3, $4)`,
      [userId, agentId, tokensUsed, messageCount]
    );

    // Update user's total tokens used
    await query(
      `UPDATE users 
       SET tokens_used = tokens_used + $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2`,
      [tokensUsed, userId]
    );

    return NextResponse.json({
      success: true,
      message: 'Usage logged successfully',
      tokensRemaining: user.tokens_limit - (user.tokens_used + tokensUsed),
    });
  } catch (error) {
    console.error('Log usage error:', error);
    return NextResponse.json(
      { error: 'Failed to log usage' },
      { status: 500 }
    );
  }
}

export const GET = withAuth(getUsage);
export const POST = withAuth(logUsage);
