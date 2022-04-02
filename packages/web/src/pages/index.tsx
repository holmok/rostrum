import { ReactElement } from 'react'
import Head from 'next/head'
import Layout from '../components/layout'

export default function Page (): ReactElement {
  return (
    <>
      <Head>
        <title>Home Page</title>
      </Head>
      <p>Home Page</p>
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
