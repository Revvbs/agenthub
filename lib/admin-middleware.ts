import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractTokenFromHeader, JWTPayload } from './jwt';

export interface AdminRequest extends NextRequest {
  user?: JWTPayload;
}

export function withAdminAuth(
  handler: (req: AdminRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    const authHeader = req.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Check admin role (JWT plan field or email whitelist)
    if (payload.plan !== 'admin' && !isAdminEmail(payload.email)) {
      // Fallback: check role in database
      try {
        const { query } = await import('./db');
        const result = await query('SELECT role FROM users WHERE id = $1', [payload.userId]);
        if (result.rows.length === 0 || result.rows[0].role !== 'admin') {
          return NextResponse.json(
            { error: 'Admin access required' },
            { status: 403 }
          );
        }
      } catch {
        return NextResponse.json(
          { error: 'Admin access required' },
          { status: 403 }
        );
      }
    }

    const adminReq = req as AdminRequest;
    adminReq.user = payload;
    return handler(adminReq);
  };
}

// Fallback: check admin emails from env (comma-separated)
function isAdminEmail(email: string): boolean {
  const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim());
  return adminEmails.includes(email);
}
