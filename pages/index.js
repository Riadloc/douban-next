import React, { Component } from 'react'
import { Card, Pagination, Collapse, InputNumber, Button, Radio } from 'antd'
import Layout from '../components/layout'
import { inject, observer } from 'mobx-react'
import { getHouseList } from '../store/actions'
import { config } from '../config/common'
const { picUrl } = config;
const Panel = Collapse.Panel;
const RadioGroup = Radio.Group;
import '../static/stylesheets/index.css'


const getRent = (title) => {
  const reg = /\d{4}/;
  return title.match(reg) || '';
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
          cover={<img className="house_cover" src={cover}/>}
          >
          <div className="house_card_head">
            <img src={picUrl.icon + item.avatar} alt={item.user}/>
            <h4>{item.user}</h4>
            <span className="pull-right">{item.create_time}</span>
            {/* { getRent(item.title) && <span className="house_rent_price">{'￥'+getRent(item.title)}</span> } */}
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
      current: 1,
      rentRange: [1000, 5000],
      unit: ''
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

  onRentRangeChange = (type, value) => {
    const idxMap = { 'from': 0, 'to': 1 };
    const index = idxMap[type];
    this.setState(prevState => {
      const { rentRange } = prevState;
      rentRange[index] = value;
      return ({
        rentRange
      })
    })
  }

  onUnitChange = (e) => {
    const value = e.target.value;
    this.setState({
      unit: value
    })
  }

  filter = () => {
    const { rentRange, unit } = this.state;
    getHouseList({rentRange, unit, page: 1});
  }

  render () {
    const { houseList = [], houseAmount } = this.props.store;
    return (
      <Layout>
        <div className="home">
          <div className="condition-filter">
            <Collapse defaultActiveKey="panel">
              <Panel header="筛选" key="panel">
                <ul>
                  <li>
                    <label>租金：</label>
                    <InputNumber
                      defaultValue={1000}
                      onChange={this.onRentRangeChange.bind(null, 'from')}
                    />
                    <span className="separators">-</span>
                    <InputNumber
                      defaultValue={5000}
                      onChange={this.onRentRangeChange.bind(null, 'to')}
                    />
                  </li>
                  <li>
                    <label>厅室：</label>
                    <RadioGroup onChange={this.onUnitChange}>
                      <Radio value="一室">一室</Radio>
                      <Radio value="二室">二室</Radio>
                      <Radio value="三室">三室</Radio>
                      <Radio value="四室">四室</Radio>
                    </RadioGroup>
                  </li>
                  <li>
                    <label>　　　</label>
                    <Button type="primary" htmlType="button" onClick={this.filter}>筛选</Button>
                    <Button htmlType="button" style={{marginLeft: 6}}>重置</Button>
                  </li>
                </ul>
              </Panel>
            </Collapse>
          </div>
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
      </Layout>
    )
  }
}

export default Home;