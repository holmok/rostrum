import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { Clients, InitClients, Storage } from '@ninebyme/common'
import storage from 'local-storage-fallback'

import 'milligram/dist/milligram.min.css'
import '../styles/layout.css'
import '../styles/header.css'
import '../styles/footer.css'

class LocalStorage implements Storage {
  get (key: string): string | null {
    return storage.getItem(key) ?? null
  }

  set (key: string, value: string | null): void {
    if (value === null) {
      storage.removeItem(key)
    } else {
      storage.setItem(key, value)
    }
  }
}

export const localStorage = new LocalStorage()

const clients = InitClients('/api', localStorage)

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
