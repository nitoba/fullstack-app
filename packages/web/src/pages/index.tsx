import { trpc } from '@/utils/trpc'

export default function Home() {
  const { data } = trpc.user.get.useQuery({ title: 'From next' })
  return (
    <div>
      <h1>Hello {data?.title}</h1>
    </div>
  )
}
