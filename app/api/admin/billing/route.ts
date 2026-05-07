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
      where += ` AND b.status = $${paramIdx}`;
      params.push(status);
      paramIdx++;
    }

    const countRes = await query(`SELECT COUNT(*) as total FROM billing b ${where}`, params);
    const total = parseInt(countRes.rows[0].total);

    const billingRes = await query(
      `SELECT b.id, b.plan, b.amount, b.status, b.payment_method, b.transaction_id, b.created_at, b.paid_at,
              u.email as user_email, u.id as user_id
       FROM billing b
       JOIN users u ON b.user_id = u.id
       ${where}
       ORDER BY b.created_at DESC
       LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`,
      [...params, limit, offset]
    );

    const summaryRes = await query(
      `SELECT 
        COALESCE(SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END), 0) as total_paid,
        COALESCE(SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END), 0) as total_pending,
        COUNT(CASE WHEN status = 'paid' THEN 1 END) as paid_count,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count,
        COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_count
       FROM billing`
    );

    return NextResponse.json({
      billing: billingRes.rows,
      summary: {
        totalPaid: parseFloat(summaryRes.rows[0].total_paid),
        totalPending: parseFloat(summaryRes.rows[0].total_pending),
        paidCount: parseInt(summaryRes.rows[0].paid_count),
        pendingCount: parseInt(summaryRes.rows[0].pending_count),
        failedCount: parseInt(summaryRes.rows[0].failed_count),
      },
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Admin billing error:', error);
    return NextResponse.json({ error: 'Failed to fetch billing' }, { status: 500 });
  }
});
