import { ReactElement } from 'react'
import Layout from '../components/layout'
import Head from 'next/head'

export default function Page (): ReactElement {
  return (
    <>
      <Head>
        <title>Register</title>
      </Head>
      <div className='row'>
        <div className='column column-50 column-offset-25'>
          <h1>Log in</h1>
          <form>
            <fieldset>
              <label htmlFor='email'>Email</label>
              <input
                type='email' placeholder='Your email address...'
                id='email'
              />
              <label htmlFor='password'>Password</label>
              <input
                type='password'
                placeholder='Your password...'
                id='password'
              />
              <input type='submit' value='Log In' />
            </fieldset>
          </form>
        </div>
      </div>
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
