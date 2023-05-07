import 'dotenv/config'
import { ZodError, z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  PORT: z.coerce.number().default(3333),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  const error = (_env as any).error as ZodError
  console.error('Invalid environment variable!', {
    error: error.formErrors.fieldErrors,
  })
  throw new Error('Invalid environment variables!')
}

export const env = _env.data
