import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { Clients, InitClients } from '@ninebyme/common'

import 'milligram/dist/milligram.min.css'
import '../styles/layout.css'
import '../styles/header.css'
import '../styles/footer.css'

const clients = InitClients('http://localhost:3001')
export function getClients (): Clients {
  return clients
}

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function MyApp ({ Component, pageProps }: AppPropsWithLayout): ReactNode {
  const getLayout = Component.getLayout ?? ((page) => page)
  return getLayout(<Component {...pageProps} />)
}
