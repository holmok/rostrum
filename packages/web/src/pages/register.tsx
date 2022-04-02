import { ReactElement, useState } from 'react'
import Head from 'next/head'
import Layout from '../components/layout'

import { getClients } from '../pages/_app'

export default function Page (): ReactElement {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [processing, setProcessing] = useState(false)

  const users = getClients().users()

  const handleSubmit = async (e: any): Promise<void> => {
    e.preventDefault()
    setProcessing(true)
    console.log({ email, username, password })
    const user = await users.register({ email, username, password })
    console.log(user)
    setTimeout(() => {
      setProcessing(false)
    }, 3000)
  }

  return (
    <>
      <Head>
        <title>Register</title>
      </Head>
      <h1>Register</h1>
      <p>Create a free account to get started.</p>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <label htmlFor='email'>Email</label>
          <input type='text' placeholder='Your email address...' id='email' value={email} onChange={(e) => { setEmail(e.target.value) }} />
          <label htmlFor='username'>User Name</label>
          <input type='text' placeholder='Your public user name...' id='username' value={username} onChange={(e) => { setUsername(e.target.value) }} />
          <label htmlFor='password'>Password</label>
          <input type='text' placeholder='Your password...' id='password' value={password} onChange={(e) => { setPassword(e.target.value) }} />
          <input disabled={processing} type='submit' value='Register' />
        </fieldset>
      </form>
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
