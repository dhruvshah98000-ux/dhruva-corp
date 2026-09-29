import { Response } from 'express'
import { AuthRequest } from '../middleware/auth'
import { supabaseAdmin } from '../lib/supabase'
import { z } from 'zod'

const updateProfileSchema = z.object({
  full_name: z.string().min(2).max(100).optional(),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid phone').optional().nullable(),
  discord_username: z.string().max(100).optional().nullable(),
})

// GET /api/profile
export async function getProfile(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.userId!

  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('auth_user_id', userId)
      .single()

    if (error || !data) {
      res.status(404).json({ success: false, error: 'Profile not found' })
      return
    }

    res.json({ success: true, data })
  } catch (err) {
    console.error('[getProfile]', err)
    res.status(500).json({ success: false, error: 'Failed to fetch profile' })
  }
}

// PATCH /api/profile
export async function updateProfile(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.userId!

  try {
    const parsed = updateProfileSchema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json({ success: false, error: 'Validation failed', details: parsed.error.errors })
      return
    }

    const { full_name, phone, discord_username } = parsed.data

    const updateData: Record<string, unknown> = {}
    if (full_name !== undefined) updateData.full_name = full_name
    if (phone !== undefined) updateData.phone = phone
    if (discord_username !== undefined) updateData.discord_username = discord_username

    if (Object.keys(updateData).length === 0) {
      res.status(400).json({ success: false, error: 'No fields to update' })
      return
    }

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update(updateData)
      .eq('auth_user_id', userId)
      .select()
      .single()

    if (error) throw error

    res.json({ success: true, data })
  } catch (err) {
    console.error('[updateProfile]', err)
    res.status(500).json({ success: false, error: 'Failed to update profile' })
  }
}
