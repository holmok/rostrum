import { ReactElement, useState } from 'react'
import Head from 'next/head'
import Layout from '../components/layout'
import { UserRegisterRequest } from '@ninebyme/common'
// @ts-expect-error
import * as IsEmail from 'is-email'

import { getClients } from '../pages/_app'

interface Errors {
  email: boolean
  password: boolean
  username: boolean
  server?: string
}

const defaultUser: UserRegisterRequest = { email: '', password: '', username: '' }

const defaultErrors: Errors = { email: false, password: false, username: false }

export default function Page (): ReactElement {
  const [user, setUser] = useState<UserRegisterRequest>(defaultUser)
  const [errors, setErrors] = useState < Errors >(defaultErrors)
  const [success, setSuccess] = useState< boolean >(false)
  const [submitting, setSubmitting] = useState< boolean >(false)

  const users = getClients().users()

  const isValid = (): boolean => {
    return !errors.email && !errors.password && !errors.username &&
    user.email.length > 0 && user.password.length > 0 && user.username.length > 0
  }

  const onEmailBlur = (e: any): void => {
    setErrors({ ...errors, email: e.target.value.length === 0 || IsEmail(e.target.value) === false })
  }

  const onEmailChange = (e: any): void => {
    setErrors({ ...errors, email: false })
    setUser({ ...user, email: e.target.value })
  }

  const onUsernameBlur = (e: any): void => {
    setErrors({ ...errors, username: e.target.value.length < 3 })
  }

  const onUsernameChange = (e: any): void => {
    setErrors({ ...errors, username: false })
    setUser({ ...user, username: e.target.value })
  }

  const onPasswordBlur = (e: any): void => {
    setErrors({ ...errors, password: e.target.value.length < 8 })
  }

  const onPasswordChange = (e: any): void => {
    setErrors({ ...errors, password: false })
    setUser({ ...user, password: e.target.value })
  }

  const handleSubmit = async (e: any): Promise<void> => {
    e.preventDefault()
    setSubmitting(true)
    if (isValid()) {
      try {
        await users.register(user)
        setSuccess(true)
      } catch (e: any) {
        const { response } = e
        if (response?.data != null) {
          setErrors({ ...errors, server: response.data })
        }
        setSubmitting(false)
      }
    }
  }

  if (success) {
    return (
      <>
        <Head>
          <title>Registration Complete</title>
        </Head>
        <p>User created.</p>
      </>
    )
  } else {
    return (
      <>
        <Head>
          <title>Register</title>
        </Head>
        <div className='row'>
          <div className='column column-50 column-offset-25'>

            <h1>Register</h1>
            <p>Create a free account to get started.</p>
            {errors.server != null && <p className='error-server'>{errors.server}</p>}
            <form onSubmit={handleSubmit}>
              <fieldset>
                <label htmlFor='email'>Email</label>
                <input
                  className={errors.email ? 'error-field' : ''}
                  type='email' placeholder='Your email address...'
                  id='email'
                  value={user.email}
                  onBlur={onEmailBlur}
                  onChange={onEmailChange}
                />
                {errors.email && <div className='error'>Please enter a valid email address.</div>}
                <label htmlFor='username'>User Name</label>
                <input
                  type='text'
                  className={errors.username ? 'error-field' : ''}
                  placeholder='Your public user name...'
                  id='username'
                  value={user.username}
                  onBlur={onUsernameBlur}
                  onChange={onUsernameChange}
                />
                {errors.username && <div className='error'>Please enter a valid user name (at least 3 characters).</div>}
                <label htmlFor='password'>Password</label>
                <input
                  type='password'
                  className={errors.password ? 'error-field' : ''}
                  placeholder='Your password...'
                  id='password'
                  value={user.password}
                  onBlur={onPasswordBlur}
                  onChange={onPasswordChange}
                />
                {errors.password && <div className='error'>Please enter a valid password (at least 8 character).</div>}
                <input disabled={!isValid() && !submitting} type='submit' value='Register' />

              </fieldset>
            </form>
          </div>
        </div>
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
