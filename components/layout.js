import React, { Component } from 'react'
import { Row, Col, Input, Button, Icon } from 'antd'
import { getHouseList } from '../store/actions'
import Link from 'next/link'
const Search = Input.Search;


class Header extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isEnter: false,
      offsetY: 0
    }
  }

  search = (value) => {
    getHouseList({keyword: value})
  }

  updateOffset = (type) => {
    const offsets = { reset: 0, scroll: -52 };
    if (type === 'reset' && this.state.isEnter) {
      return;
    }
    this.setState({
      offsetY: offsets[type]
    })
  }

  onKeywordChange = (e) => {
    const { value } = e.target;
    this.setState({
      isEnter: !!value
    })
  }

  render () {
    const { offsetY, isEnter } = this.state;
    return (
      <header role="banner" className="sticky app_header">
        <Row type="flex" justify="center">
          <Col xs={24} sm={21} lg={18}>
            <div className="app_header_inner" style={{transform: `translate(0, ${offsetY}px)`}}>
              <div>
                <div className="logo">
                  <Link href="/">
                    <img src="/static/images/logo.png" alt="FineHome"/>
                  </Link>
                </div>
                <nav role="navigation" className="navigation"></nav>
                <Search
                  className="search_input"
                  style={{width: 300}}
                  placeholder="输入查找条件"
                  onSearch={this.search}
                  onChange={this.onKeywordChange}
                  enterButton={isEnter}
                />
                <Button shape="circle" icon="search" className="search_icon" onClick={()=>this.updateOffset('scroll')}/>
              </div>
              <div>
                <Search
                  className="search_input_long"
                  placeholder="输入查找条件"
                  onSearch={this.search}
                  onChange={this.onKeywordChange}
                  onBlur={()=>this.updateOffset('reset')}
                  enterButton={isEnter}
                />
              </div>
            </div>
          </Col>
        </Row>
      </header>
    )
  }
}

const Layout = ({children, pure = false}) => 
  <div>
    {!pure && <Header />}
    <article role="main-content" className="app-content">
      <Row type="flex" justify="center">
        <Col xs={24} sm={21} lg={18}>
          {children}
        </Col>
      </Row>
    </article>
  </div>

export default Layout;