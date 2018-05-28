import React, { Component } from 'react'
import { Card, Pagination } from 'antd'
import Layout from '../../components/layout'
import { axios, config } from '../../config/common'

const { picUrl } = config;

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

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      total: 1,
      house_list: []
    }
  }

  onPageChange = (page) => {
    this.setState({
      current: page
    })
  }

  render() {
    const { houseList, amount } = this.props;
    return (
      <Layout>
        <div className="card_list">
          <CardList houseList={houseList}/>
        </div>
        <div className="house_card_pagination">
          <Pagination current={this.state.current} onChange={this.onPageChange} total={amount} />;
        </div>
        <style jsx global>{`
          .card_list {
            display: flex;
            flex-wrap: wrap;
          }
          .card_list .ant-card {
            margin: 0 10px 10px 0;
          }
          .card_list .ant-card-body {
            padding: 12px;
          }
          .card_list .house_cover {
            height: 300px;
            object-fit: cover;
          }
          .house_card_head img{
            width: 36px;
            height: 36px;
            border-radius: 50%;
          }
          .house_card_head h4 {
            display: inline;
            margin-left: 2px;
          }
          .house_card_head span {
            font-size: 12px;
            color: #999;
            margin-top: 6px;
          }
          .pull-right {
            float: right;
          }
        `}</style>
      </Layout>
    )
  }
}

Index.getInitialProps = async function () {
  const data = await axios('/api/getHouseList', {method: 'post', body: {page : 1}})
  return data; // data: { houseList: Array, amount: Number }
}

export default Index;