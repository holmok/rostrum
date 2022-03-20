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

const clients = InitClients('http://localhost:3001', localStorage)
clients.setToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoiY2hyaXN0b3BoZXJAaG9sbW9rLmNvbSIsInVzZXJuYW1lIjoiQ2hyaXN0b3BoZXIgSG9sbW9rIiwidHlwZSI6ImFkbWluIiwic3RhdHVzIjoiYWN0aXZlIiwiaWF0IjoxNjQ3Nzk1MTc2LCJleHAiOjE2NDc4ODE1NzZ9.ATp3bbW9Ji4i5SVrxNd0Yg_GIvRgdgqX2aYwELzykpI')
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
