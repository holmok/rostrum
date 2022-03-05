import { ReactElement } from 'react'
import Head from 'next/head'
import Layout from '../components/layout'
import Echo from '../components/echo'

export default function Page (): ReactElement {
  return (
    <>
      <Head>
        <title>About Page</title>
      </Head>
      <p>About Page</p>
      <Echo message='Hello' />
    </>
  )
}

Page.getLayout = (page: ReactElement) => {
  return (
    <Layout>
      {page}
    </Layout>
  )
}
