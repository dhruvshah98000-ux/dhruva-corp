import { z } from 'zod'

export const createOrderSchema = z.object({
  productId: z.string().uuid('Invalid product ID'),
  planId: z.string().uuid('Invalid plan ID'),
})

export const verifyPaymentSchema = z.object({
  orderId: z.string().uuid('Invalid order ID'),
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1),
})

export const customerInfoSchema = z.object({
  orderId: z.string().uuid('Invalid order ID'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  discordUsername: z.string().max(100).optional(),
})

export type CreateOrderInput = z.infer<typeof createOrderSchema>
export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>
export type CustomerInfoInput = z.infer<typeof customerInfoSchema>
