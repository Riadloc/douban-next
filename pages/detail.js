import React, { Component } from 'react'
import Layout from '../components/layout'
import { fetch, config } from '../config/common'

const { picUrl } = config;

const ImageList = ({images}) => {
  return images.map((image, index) => 
    <div className="house_desc_pic" key={index}>
      <img src={picUrl.view + image} alt=""/>
    </div>
  )
}

class Detail extends Component {
  constructor(props) {
    super(props);
  }

  static async getInitialProps({query}) {
    const { id } = query;
    console.log(id);
    const house_info = await fetch('/api/getHouseById', {method: 'post', data: {id}})
    return {house_info};
  }

  render() {
    const { houseInfo } = this.props.house_info;
    const detail_imgs = JSON.parse(houseInfo.detail_imgs);
    return (
      <Layout>
        <div className="detail">
          <h1>{houseInfo.title}</h1>
          <div className="user_info">
            <img src={picUrl.icon + houseInfo.avatar} alt={houseInfo.user}/>
            <h4>{houseInfo.user}</h4>
            <span className="pull-right">{houseInfo.create_time}</span>
          </div>
          <div className="house_info_wrapper">
            <div className="house_desc">
              { houseInfo.description }
            </div>
            <ImageList images={detail_imgs}/>
          </div>
        </div>
        <style jsx global>{`
          .detail {
            background-color: #fff;
            padding: 20px;
          }
          .user_info {
            padding: 0 20px;
          }
          .user_info img{
            width: 36px;
            height: 36px;
            border-radius: 2px;
          }
          .user_info h4 {
            display: inline;
            margin-left: 2px;
          }
          .user_info span {
            font-size: 12px;
            color: #999;
            margin-top: 6px;
          }
          .pull-right {
            float: right;
          }
          .house_info_wrapper {
            padding: 20px 0;
          }
          .house_desc_pic {
            padding: 10px 0;
            text-align: center;
          }
        `}</style>
      </Layout>
    )
  }
}

export default Detail;