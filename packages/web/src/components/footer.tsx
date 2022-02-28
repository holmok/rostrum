import type { NextComponentType } from 'next'
const PageFooter: NextComponentType = () => {
  return (

    <footer>
      <section className='container' id='footer'>
        <div className='lcr-container'>
          <div>left</div>
          <div>center</div>
          <div>right</div>
        </div>
      </section>
    </footer>

  )
}

export default PageFooter