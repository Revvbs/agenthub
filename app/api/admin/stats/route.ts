import { NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/admin-middleware';
import { query } from '@/lib/db';

export const GET = withAdminAuth(async (req) => {
  try {
    const [usersRes, agentsRes, usageRes, billingRes] = await Promise.all([
      query('SELECT COUNT(*) as total, COUNT(CASE WHEN created_at > NOW() - INTERVAL \'7 days\' THEN 1 END) as new_week FROM users'),
      query('SELECT COUNT(*) as total, COUNT(CASE WHEN status = \'active\' THEN 1 END) as active FROM agents'),
      query('SELECT COALESCE(SUM(tokens_used), 0) as total_tokens, COALESCE(SUM(message_count), 0) as total_messages FROM usage_logs'),
      query("SELECT COALESCE(SUM(amount), 0) as total_revenue, COUNT(CASE WHEN status = 'paid' THEN 1 END) as paid_count FROM billing"),
    ]);

    const usersByPlan = await query(
      "SELECT plan, COUNT(*) as count FROM users GROUP BY plan"
    );

    const recentUsers = await query(
      "SELECT id, email, plan, tokens_used, tokens_limit, created_at FROM users ORDER BY created_at DESC LIMIT 5"
    );

    const recentAgents = await query(
      `SELECT a.id, a.name, a.type, a.status, a.created_at, u.email as user_email 
       FROM agents a JOIN users u ON a.user_id = u.id 
       ORDER BY a.created_at DESC LIMIT 5`
    );

    return NextResponse.json({
      stats: {
        users: {
          total: parseInt(usersRes.rows[0].total),
          newThisWeek: parseInt(usersRes.rows[0].new_week),
        },
        agents: {
          total: parseInt(agentsRes.rows[0].total),
          active: parseInt(agentsRes.rows[0].active),
        },
        usage: {
          totalTokens: parseInt(usageRes.rows[0].total_tokens),
          totalMessages: parseInt(usageRes.rows[0].total_messages),
        },
        billing: {
          totalRevenue: parseFloat(billingRes.rows[0].total_revenue),
          paidCount: parseInt(billingRes.rows[0].paid_count),
        },
        usersByPlan: usersByPlan.rows.map(r => ({ plan: r.plan, count: parseInt(r.count) })),
      },
      recentUsers: recentUsers.rows,
      recentAgents: recentAgents.rows,
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
});
