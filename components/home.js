import React, { Component } from 'react'
import { Card, Pagination } from 'antd'
import { inject, observer } from 'mobx-react'
import { getHouseList } from '../store/actions'
import { config } from '../config/common'
const { picUrl } = config;

const getRent = (title) => {
  const reg = /\d{4}/;
  return title.match(reg) || 'X';
}


const CardList = ({houseList}) => {
  const list = houseList || [];
  return list.map((item, index) => {
    const detail_imgs = JSON.parse(item.detail_imgs);
    const cover = detail_imgs[0] ? picUrl.view + detail_imgs[0] : 'http://d.5857.com/glgs_160913/003.jpg';
    return (
      <a href={`/detail?id=${item.id}`} target="_newtab" key={index}>
        <Card
          hoverable
          style={{width: 300}}
          cover={<img className="house_cover" src={cover}/>}
          >
          <div className="house_card_head">
            <img src={picUrl.icon + item.avatar} alt={item.user}/>
            <h4>{item.user}</h4>
            <span className="pull-right">{item.create_time}</span>
            <span className="pull-right">{getRent(item.title)}</span>
          </div>
          <p>{item.title}</p>
        </Card>
      </a> 
    )
  })
}

@inject('store')
@observer
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 1
    }
  }

  componentDidMount = () => {
    getHouseList();
  }

  componentWillUnmount = () => {
    console.log(1);
  }
  
  onPageChange = (page) => {
    this.setState({
      current: page
    })
    getHouseList({page});
  }

  render () {
    const { houseList = [], houseAmount } = this.props.store;
    return (
      <div className="home">
        { houseList.length > 0 ?
        <div className="home-wrapper">
          <div className="card_list">
            <CardList houseList={houseList}/>
          </div>
          <div className="house_card_pagination">
            <Pagination current={this.state.current} onChange={this.onPageChange} total={houseAmount} pageSize={12}/>
          </div>
        </div> :
        <div>
          未查到相关租房信息！
        </div>
        }
      </div>
    )
  }
}

export default Home;