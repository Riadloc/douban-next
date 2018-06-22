import React, { Component } from 'react'
import { Row, Col, Input, Icon } from 'antd'
import { getHouseList } from '../store/actions'
import Link from 'next/link'
const Search = Input.Search;


class Header extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isEnter: false
    }
  }

  search = (value) => {
    getHouseList({keyword: value})
  }

  onKeywordChange = (e) => {
    const { value } = e.target;
    this.setState({
      isEnter: !!value
    })
  }

  render () {
    return (
      <header role="banner" className="sticky app_header">
        <Row type="flex" justify="center">
          <Col xs={24} sm={21} lg={18}>
            <div className="app_header_inner">
              <div className="logo">
                <Link href="/">
                  <img src="/static/images/logo.png" alt="FineHome"/>
                </Link>
              </div>
              <nav role="navigation" className="navigation"></nav>
              <Search
                // className="search_content"
                style={{width: 300}}
                placeholder="输入查找条件"
                onSearch={this.search}
                onChange={this.onKeywordChange}
                enterButton={this.state.isEnter}
              />
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