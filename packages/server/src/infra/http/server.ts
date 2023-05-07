import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'
import fastify from 'fastify'
import { appRouter } from './trpc/root'
import { createTRPCContext } from './trpc/trpc'
import cors from '@fastify/cors'
import { env } from '@/lib/env'

export interface ServerOptions {
  dev?: boolean
  port?: number
  prefix?: string
}

export function createServer(opts: ServerOptions) {
  const port = opts.port ?? 3333
  const prefix = opts.prefix ?? '/trpc'
  const server = fastify()

  server.register(cors, {
    origin: true,
  })

  server.register(fastifyTRPCPlugin, {
    prefix,
    trpcOptions: {
      router: appRouter,
      createContext: createTRPCContext,
      onError:
        env.NODE_ENV === 'development'
          ? ({ path, error }) => {
              console.error(
                `❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`,
              )
            }
          : undefined,
    },
  })

  server.get('/', async () => {
    return { hello: 'wait-on 💨' }
  })

  const stop = async () => {
    await server.close()
  }
  const start = async () => {
    try {
      await server.listen({ port })
      console.log('listening on port', port)
    } catch (err) {
      server.log.error(err)
      process.exit(1)
    }
  }

  return { server, start, stop }
}
