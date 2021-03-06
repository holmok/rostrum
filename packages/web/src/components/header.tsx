import type { NextComponentType } from 'next'
import Link from 'next/link'
import { useState } from 'react'

const PageHeader: NextComponentType = () => {
  const [menuVisible, setMenuVisible] = useState(false)
  const toggle = (): void => {
    setMenuVisible(!menuVisible)
  }
  const hide = (): void => setMenuVisible(false)
  return (
    <header>
      <section className='container' id='header'>
        <div className='lcr-container'>
          <div><Link href='/'><a><span className='logo'>Nine by Me</span></a></Link></div>
          <div><Link href='#'><a onClick={toggle} id='menu'><span className='hamburger'>☰</span></a></Link></div>
        </div>
      </section>
      <section className='container' id='menu-container' style={menuVisible ? { display: 'block' } : { display: 'none' }}>
        <div id='navigation'>
          <ul>
            <li><Link href='/'><a onClick={hide}>Home</a></Link></li>
            <li><Link href='/about'><a onClick={hide}>About</a></Link></li>
            <li><Link href='/register'><a onClick={hide}>Register</a></Link></li>
            <li><Link href='/login'><a onClick={hide}>Login</a></Link></li>
          </ul>
        </div>
      </section>
    </header>
  )
}

export default PageHeader
