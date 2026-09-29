import { Request, Response, NextFunction } from 'express'

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Never expose internal stack traces to the client
  console.error('[ERROR]', err.message)

  if (res.headersSent) return

  res.status(500).json({
    success: false,
    error: 'Something went wrong. Please try again later.',
  })
}

export function notFound(_req: Request, res: Response): void {
  res.status(404).json({ success: false, error: 'Route not found' })
}
