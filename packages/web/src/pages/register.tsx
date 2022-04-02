import { ReactElement, useState } from 'react'
import Head from 'next/head'
import Layout from '../components/layout'
// @ts-expect-error
import * as IsEmail from 'is-email'

import { getClients } from '../pages/_app'

export default function Page (): ReactElement {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [emailValid, setEmailValid] = useState < boolean | undefined >(undefined)
  const [usernameValid, setUsernameValid] = useState< boolean | undefined >(undefined)
  const [passwordValid, setPasswordValid] = useState< boolean | undefined >(undefined)
  const [serverError, setServerError] = useState< string | undefined >(undefined)

  const [success, setSuccess] = useState< boolean >(false)

  const [valid, setValid] = useState(false)

  const users = getClients().users()

  const onEmailBlur = (e: any): void => {
    if (e.target.value.length === 0 || !IsEmail(e.target.value)) {
      setEmailValid(false)
      setValid(false)
    } else {
      setEmailValid(true)
      setValid(passwordValid === true && usernameValid === true)
    }
  }

  const onEmailChange = (e: any): void => {
    if (e.target.value.length > 0 && IsEmail(e.target.value)) {
      setEmailValid(true)
      setValid(passwordValid === true && usernameValid === true)
    }
    setEmail(e.target.value)
  }

  const onUsernameBlur = (e: any): void => {
    if (e.target.value.length < 3) {
      setUsernameValid(false)
      setValid(false)
    } else {
      setUsernameValid(true)
      setValid(passwordValid === true && emailValid === true)
    }
    setUsername(e.target.value)
  }

  const onUsernameChange = (e: any): void => {
    if (e.target.value.length >= 3) {
      setUsernameValid(true)
      setValid(passwordValid === true && emailValid === true)
    }
    setUsername(e.target.value)
  }

  const onPasswordBlur = (e: any): void => {
    if (e.target.value.length < 8) {
      setPasswordValid(false)
      setValid(false)
    } else {
      setPasswordValid(true)
      setValid(emailValid === true && usernameValid === true)
    }
    setPassword(e.target.value)
  }

  const onPasswordChange = (e: any): void => {
    if (e.target.value.length >= 8) {
      setPasswordValid(true)
      setValid(usernameValid === true && emailValid === true)
    }
    setPassword(e.target.value)
  }

  const handleSubmit = async (e: any): Promise<void> => {
    e.preventDefault()
    setValid(false)
    if (emailValid === true && usernameValid === true && passwordValid === true) {
      console.log({ email, username, password })
      try {
        await users.register({ email, username, password })
        setSuccess(true)
      } catch (e: any) {
        const { response } = e
        if (response?.data != null) {
          setServerError(response.data)
        }
        setValid(true)
      }
    }
  }

  if (success) {
    return (
      <>
        <p>User created.</p>
      </>
    )
  } else {
    return (
      <>
        <Head>
          <title>Register</title>
        </Head>
        <h1>Register</h1>
        <p>Create a free account to get started.</p>
        {serverError != null && <p className='error-server'>{serverError}</p>}
        <form onSubmit={handleSubmit}>
          <fieldset>
            <label htmlFor='email'>Email</label>
            <input
              type='email' placeholder='Your email address...'
              id='email'
              value={email}
              onBlur={onEmailBlur}
              onChange={onEmailChange}
            />
            {!(emailValid == null ? true : emailValid) && <p className='error'>Please enter a valid email address.</p>}
            <label htmlFor='username'>User Name</label>
            <input
              type='text'
              placeholder='Your public user name...'
              id='username'
              value={username}
              onBlur={onUsernameBlur}
              onChange={onUsernameChange}
            />
            {!(usernameValid == null ? true : usernameValid) && <p className='error'>Please enter a valid user name (at least 3 characters).</p>}
            <label htmlFor='password'>Password</label>
            <input
              type='password'
              placeholder='Your password...'
              id='password'
              value={password}
              onBlur={onPasswordBlur}
              onChange={onPasswordChange}
            />
            {!(passwordValid == null ? true : passwordValid) && <p className='error'>Please enter a valid password (at least 8 character).</p>}
            <input disabled={!valid} type='submit' value='Register' />

          </fieldset>
        </form>
      </>
    )
  }
}

Page.getLayout = (page: ReactElement) => {
  return (
    <Layout>
      {page}
    </Layout>
  )
}
