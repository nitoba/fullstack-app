import { initTRPC } from '@trpc/server'
import superjson from 'superjson'
import { ZodError } from 'zod'

import { type CreateFastifyContextOptions } from '@trpc/server/adapters/fastify'
type CreateContextOptions = Record<string, never>

const createInnerTRPCContext = (_opts: CreateContextOptions) => {
  return {}
}

export const createTRPCContext = (_opts: CreateFastifyContextOptions) => {
  return createInnerTRPCContext({})
}

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})

export const createTRPCRouter = t.router
export const publicProcedure = t.procedure
