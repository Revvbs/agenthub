import { NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/admin-middleware';
import { query } from '@/lib/db';

export const GET = withAdminAuth(async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const plan = searchParams.get('plan') || '';
    const offset = (page - 1) * limit;

    let where = 'WHERE 1=1';
    const params: any[] = [];
    let paramIdx = 1;

    if (search) {
      where += ` AND email ILIKE $${paramIdx}`;
      params.push(`%${search}%`);
      paramIdx++;
    }
    if (plan) {
      where += ` AND plan = $${paramIdx}`;
      params.push(plan);
      paramIdx++;
    }

    const countRes = await query(`SELECT COUNT(*) as total FROM users ${where}`, params);
    const total = parseInt(countRes.rows[0].total);

    const usersRes = await query(
      `SELECT u.id, u.email, u.role, u.plan, u.tokens_limit, u.tokens_used, u.status, u.created_at,
              COUNT(a.id) as agent_count
       FROM users u
       LEFT JOIN agents a ON a.user_id = u.id
       ${where}
       GROUP BY u.id
       ORDER BY u.created_at DESC
       LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`,
      [...params, limit, offset]
    );

    return NextResponse.json({
      users: usersRes.rows,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Admin users error:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
});
