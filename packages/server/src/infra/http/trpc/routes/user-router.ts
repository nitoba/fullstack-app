import { createTRPCRouter, publicProcedure } from '../trpc'
import { z } from 'zod'

export const userRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ title: z.string() }))
    .query(({ input, ctx }) => {
      return {
        title: input.title,
      }
    }),
})
