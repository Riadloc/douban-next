const CardList = ({houseList}) => {
  return houseList.map((item, index) => {
    const detail_imgs = JSON.parse(item.detail_imgs);
    return (<Card
      key={index}
      hoverable
      style={{width: 300}}
      cover={<img className="house_cover" src={picUrl.view + detail_imgs[0]}/>}
      >
      <div className="house_card_head">
        <img src={picUrl.icon + item.avatar} alt={item.user}/>
        <h4>{item.user}</h4>
        <span className="pull-right">{item.created_time}</span>
      </div>
      <p>{item.title}</p>
    </Card>)
  })
}



export default CardList;