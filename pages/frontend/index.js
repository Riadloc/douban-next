import React, { Component } from 'react'
import { Card, Pagination } from 'antd'
import Link from 'next/link'
import Layout from '../../components/layout'
import { fetch, config } from '../../config/common'

const { picUrl } = config;

const CardList = ({houseList}) => {
  return houseList.map((item, index) => {
    const detail_imgs = JSON.parse(item.detail_imgs);
    const cover = detail_imgs[0] ? picUrl.view + detail_imgs[0] : 'http://www.gaoxiaogif.com/d/file/201611/165c0721ea7cff7cae4bac7302172286.jpg';
    return (
      <Link href={{ pathname: '/frontend/detail', query: { id: item.ID } }} key={index}>
        <Card
          hoverable
          style={{width: 300}}
          cover={<img className="house_cover" src={cover}/>}
          >
          <div className="house_card_head">
            <img src={picUrl.icon + item.avatar} alt={item.user}/>
            <h4>{item.user}</h4>
            <span className="pull-right">{item.created_time}</span>
          </div>
          <p>{item.title}</p>
        </Card>
      </Link>
    )
  })
}

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      total: 1,
      list: {
        houseList: [],
        amount: 0
      }
    }
  }

  componentDidMount = () => {
    this.getHouseList()
  }

  render() {
    const { list } = this.state;
    return (
      <Layout>
        <div className="card_list">
          <CardList houseList={list.houseList}/>
        </div>
        <div className="house_card_pagination">
          <Pagination current={this.state.current} onChange={this.onPageChange} total={list.amount} pageSize={12}/>;
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

  onPageChange = (page) => {
    this.setState({
      current: page
    })
    this.getHouseList(page);
  }

  getHouseList(page) {
    const current = page || 1;
    fetch('/api/getHouseList', {method: 'post', data: {page : current}})
      .then(res => {
        this.setState({
          list: res
        })
      })
  }
}

// Index.getInitialProps = async function () {
//   const data = await axios('/api/getHouseList', {method: 'post', body: {page : 1}, env: 'server'})
//   return data; // data: { houseList: Array, amount: Number }
// }

export default Index;