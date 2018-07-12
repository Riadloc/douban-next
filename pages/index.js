import React, { Component } from 'react'
import { Card, BackTop, Collapse, InputNumber, Button, Radio, Switch } from 'antd'
import getRequestAnimationFrame  from 'antd/lib/_util/getRequestAnimationFrame'
import Layout from '../components/layout'
import { inject, observer } from 'mobx-react'
import { getHouseList } from '../store/actions'
import { config } from '../config/common'
import '../assets/stylesheets/index.less'

const { picUrl } = config;
const Panel = Collapse.Panel;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const reqAnimFrame = getRequestAnimationFrame();

const currentScrollTop = () => {
  return window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop;
};

const easeInOutCubic = (t, b, c, d) => {
  const cc = c - b;
  t /= d / 2;
  if (t < 1) {
    return cc / 2 * t * t * t + b;
  } else {
    return cc / 2 * ((t -= 2) * t * t + 2) + b;
  }
};

const CardList = ({houseList}) => {
  const list = houseList || [];
  return list.map((item, index) => {
    const detail_imgs = JSON.parse(item.detail_imgs);
    const cover = detail_imgs[0] ? picUrl.view + detail_imgs[0] : 'https://upfile.asqql.com/2009pasdfasdfic2009s305985-ts/2016-7/20167161815128318.jpg';
    return (
      <a href={`/detail?id=${item.id}`} target="_newtab" key={index}>
        <Card
          hoverable
          cover={<img className="house_cover" src={cover}/>}
          >
          <div className="house_card_head">
            <img src={picUrl.icon + item.avatar} alt={item.user}/>
            <h3>{item.user}</h3>
            {/* { getRent(item.title) && <span className="house_rent_price">{'￥'+getRent(item.title)}</span> } */}
          </div>
          <p>{item.title}</p>
          <span className="card_foot">{item.create_time}</span>
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
      unit: '',
      checked: false
    }
  }

  componentDidMount = () => {
    getHouseList();
  }

  onSwitchChange = (checked) => {
    this.setState({
      checked
    })
  }
  
  onPageChange = (page) => {
    this.scrollToTop();
    this.setState({
      current: page
    })
    getHouseList({page});
  }

  loadMore = () => {
    let { current } = this.state;
    current = current + 1;
    this.setState({
      current: current
    })
    getHouseList({page: current});
  }

  scrollToTop = () => {
    const scrollTop = currentScrollTop();
    const startTime = Date.now();
    const frameFunc = () => {
      const timestamp = Date.now();
      const time = timestamp - startTime;
      this.setScrollTop(easeInOutCubic(time, scrollTop, 0, 450));
      if (time < 450) {
        reqAnimFrame(frameFunc);
      }
    };
    reqAnimFrame(frameFunc);
  }

  setScrollTop(value) {
    document.body.scrollTop = value;
    document.documentElement.scrollTop = value;
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
    const { checked, rentRange, unit } = this.state;
    getHouseList(Object.assign({ unit, page: 1}, checked?{ rentRange }:null));
  }

  reset = () => {
    this.setState({
      unit: '',
      checked: false
    })
    getHouseList();
  }

  render () {
    const { houseList = [], houseAmount } = this.props.store;
    const { checked, unit } = this.state;
    return (
      <Layout>
        <div className="home">
          <div className="condition-filter">
            <Collapse defaultActiveKey="panel">
              <Panel header="筛选" key="panel">
                <ul>
                  <li>
                    <label>租金：</label>
                    <Switch checked={checked} onChange={this.onSwitchChange} style={{marginRight: 5, verticalAlign: 'text-top'}}/>
                    <InputNumber
                      defaultValue={1000}
                      onChange={this.onRentRangeChange.bind(null, 'from')}
                      disabled={!checked}
                    />
                    <span className="separators">-</span>
                    <InputNumber
                      defaultValue={5000}
                      onChange={this.onRentRangeChange.bind(null, 'to')}
                      disabled={!checked}
                    />
                  </li>
                  <li>
                    <label>厅室：</label>
                    <RadioGroup value={unit} onChange={this.onUnitChange}>
                      <RadioButton value="">默认</RadioButton>
                      <RadioButton value="一室">一室</RadioButton>
                      <RadioButton value="二室">二室</RadioButton>
                      <RadioButton value="三室">三室</RadioButton>
                      <RadioButton value="四室">四室</RadioButton>
                    </RadioGroup>
                  </li>
                  <li>
                    <label>　　　</label>
                    <Button type="primary" htmlType="button" onClick={this.filter}>筛选</Button>
                    <Button htmlType="button" style={{marginLeft: 6}} onClick={this.reset}>重置</Button>
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
            {houseList.length<houseAmount && <div className="house_card_pagination">
              <Button type="primary" icon="retweet" onClick={this.loadMore}>加载更多</Button>
              {/* <Pagination current={this.state.current} onChange={this.onPageChange} total={houseAmount} pageSize={12}/> */}
            </div>}
          </div> :
          <div>
            未查到相关租房信息！
          </div>
          }
        </div>
        <BackTop />
      </Layout>
    )
  }
}

export default Home;