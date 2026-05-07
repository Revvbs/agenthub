import { NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/admin-middleware';
import { query } from '@/lib/db';

export const GET = withAdminAuth(async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status') || '';
    const offset = (page - 1) * limit;

    let where = 'WHERE 1=1';
    const params: any[] = [];
    let paramIdx = 1;

    if (status) {
      where += ` AND a.status = $${paramIdx}`;
      params.push(status);
      paramIdx++;
    }

    const countRes = await query(`SELECT COUNT(*) as total FROM agents a ${where}`, params);
    const total = parseInt(countRes.rows[0].total);

    const agentsRes = await query(
      `SELECT a.id, a.name, a.type, a.status, a.created_at, a.updated_at,
              u.email as user_email, u.id as user_id,
              COALESCE(SUM(ul.tokens_used), 0) as total_tokens,
              COUNT(ul.id) as total_messages
       FROM agents a
       JOIN users u ON a.user_id = u.id
       LEFT JOIN usage_logs ul ON ul.agent_id = a.id
       ${where}
       GROUP BY a.id, u.email, u.id
       ORDER BY a.created_at DESC
       LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`,
      [...params, limit, offset]
    );

    return NextResponse.json({
      agents: agentsRes.rows.map(a => ({
        ...a,
        total_tokens: parseInt(a.total_tokens),
        total_messages: parseInt(a.total_messages),
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Admin agents error:', error);
    return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 });
  }
});
