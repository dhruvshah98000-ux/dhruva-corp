import { z } from 'zod'

export const createProductSchema = z.object({
  name: z.string().min(2).max(200),
  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers and hyphens only'),
  description: z.string().min(10).max(2000),
  features: z.array(z.string().min(1).max(200)).min(1).max(20),
  category: z.string().min(1).max(100),
  image_url: z.string().url().optional().nullable(),
  active: z.boolean().default(true),
})

export const updateProductSchema = createProductSchema.partial()

export const createPlanSchema = z.object({
  name: z.string().min(1).max(100),
  duration_days: z.number().int().positive().nullable(), // null = permanent
  price_inr: z.number().positive().max(999999),
  active: z.boolean().default(true),
})

export const updatePlanSchema = createPlanSchema.partial()

export const updateSettingsSchema = z.object({
  company_name: z.string().min(1).max(200).optional(),
  logo_url: z.string().url().optional().nullable(),
  support_phone: z.string().max(20).optional().nullable(),
  support_email: z.string().email().optional().nullable(),
  discord_support_link: z.string().url().optional().nullable(),
  currency: z.string().length(3).optional(),
  footer_text: z.string().max(500).optional().nullable(),
  terms_url: z.string().url().optional().nullable(),
  privacy_url: z.string().url().optional().nullable(),
})

export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
export type CreatePlanInput = z.infer<typeof createPlanSchema>
export type UpdatePlanInput = z.infer<typeof updatePlanSchema>
export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>
