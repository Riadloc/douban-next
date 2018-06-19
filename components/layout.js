import { Row, Col, Input, Icon } from 'antd'
import { getHouseList } from '../store/actions'
import Link from 'next/link'
import 'minireset.css'

const search = (evt) => {
  const { value: keyword } = evt.target;
  getHouseList({keyword})
}

const Layout = ({children, pure = false}) => 
  <div>
    {!pure && (<header role="banner" className="sticky app_header">
      <Row type="flex" justify="center">
        <Col xs={24} sm={21} lg={18}>
          <div className="app_header_inner">
            <div className="logo">
              <Link href="/">
                <img src="/static/images/logo.png" alt="FineHome"/>
              </Link>
            </div>
            <nav role="navigation" className="navigation"></nav>
            <div className="search_content">
              <Input
                style={{width: '300px'}}
                placeholder="输入查找条件"
                onPressEnter={search}
                suffix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
              />
            </div>
          </div>
        </Col>
      </Row>
    </header>)}
    <article role="main-content" className="app-content">
      <Row type="flex" justify="center">
        <Col xs={24} sm={21} lg={18}>
          {children}
        </Col>
      </Row>
    </article>
  </div>

export default Layout;