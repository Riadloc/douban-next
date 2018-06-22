import '../assets/stylesheets/loading.less'

const Spin = (props) => {
  const { loading } = props;
  return (
    <div className='loader' style={{display: loading?'block':'none'}}>
      <div className='loader_overlay'></div>
      <div className='loader_cogs'>
        <div className='loader_cogs__top'>
          <div className='top_part'></div>
          <div className='top_part'></div>
          <div className='top_part'></div>
          <div className='top_hole'></div>
        </div>
        <div className='loader_cogs__left'>
          <div className='left_part'></div>
          <div className='left_part'></div>
          <div className='left_part'></div>
          <div className='left_hole'></div>
        </div>
        <div className='loader_cogs__bottom'>
          <div className='bottom_part'></div>
          <div className='bottom_part'></div>
          <div className='bottom_part'></div>
          <div className='bottom_hole'></div>
        </div>
      </div>
    </div>
  )
}

export default Spin;