import { Request, Response, NextFunction } from 'express'
import { supabaseAnon, supabaseAdmin } from '../lib/supabase'

export interface AuthRequest extends Request {
  userId?: string
  userEmail?: string
}

/**
 * Verify Supabase JWT from Authorization: Bearer <token>
 * Sets req.userId and req.userEmail on success.
 */
export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: 'Missing or invalid Authorization header' })
    return
  }

  const token = authHeader.slice(7)

  try {
    const { data: { user }, error } = await supabaseAnon.auth.getUser(token)
    if (error || !user) {
      res.status(401).json({ success: false, error: 'Invalid or expired token' })
      return
    }
    req.userId = user.id
    req.userEmail = user.email
    next()
  } catch {
    res.status(401).json({ success: false, error: 'Token verification failed' })
  }
}

/**
 * Must come after requireAuth.
 * Checks admin_roles table for the authenticated user.
 */
export async function requireAdmin(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  if (!req.userId) {
    res.status(401).json({ success: false, error: 'Not authenticated' })
    return
  }

  const { data, error } = await supabaseAdmin
    .from('admin_roles')
    .select('id')
    .eq('user_id', req.userId)
    .single()

  if (error || !data) {
    res.status(403).json({ success: false, error: 'Forbidden: Admin access required' })
    return
  }

  next()
}
