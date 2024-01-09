import {Inter} from 'next/font/google'
import {authStytchRequest} from '@/lib/stytch'

const inter = Inter({subsets: ['latin']})

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
    </div>
  )
}

export const getServerSideProps = async ({req}) => {
  const session = await authStytchRequest(req)
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }
  return {
    redirect: {
      destination: '/collections',
    },
  }
}
