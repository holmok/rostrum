import type { NextComponentType } from 'next'
import Link from 'next/link'
import { useState } from 'react'
import SWR from 'swr'

import { getClients } from 'src/pages/_app'

const PageHeader: NextComponentType = () => {
  const users = getClients().users()

  const user = SWR('users.getMe', async () => users.getMe())

  const [menuVisible, setMenuVisible] = useState(false)
  const toggle = (): void => {
    console.log('TOGGLE!!')
    setMenuVisible(!menuVisible)
  }
  const hide = (): void => setMenuVisible(false)
  return (
    <header>
      <section className='container' id='header'>
        <div className='lcr-container'>
          <div><Link href='/'><a><span className='logo'>Nine by Me</span></a></Link></div>
          {user.data != null ? (<>{user.data.id != null ? (<div>Hello, {user.data.username}</div>) : undefined}</>) : undefined}
          <div><Link href='#'><a onClick={toggle} id='menu'><span className='hamburger'>☰</span></a></Link></div>
        </div>
      </section>
      <section className='container' id='menu-container' style={menuVisible ? { display: 'block' } : { display: 'none' }}>
        <div id='navigation'>
          <ul>
            <li><Link href='/'><a onClick={hide}>Home</a></Link></li>
            <li><Link href='/about'><a onClick={hide}>About</a></Link></li>
          </ul>
        </div>
      </section>
    </header>
  )
}

export default PageHeader
