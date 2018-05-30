import { Row, Col, Input, Icon } from 'antd'
import Head from 'next/head'
import Link from 'next/link'

const Layout = ({children}) => 
  <div>
    <Head>
      <title>douban-next</title>
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <meta charSet='utf-8' />
      <meta name="referrer" content="never" />
      <link rel='stylesheet' href='/_next/static/style.css' />
    </Head>
    <style jsx global>{`
      body {
        background-color: #f6f6f6;
      }
      .app_header {
        position: relative;
        z-index: 100;
        overflow: hidden;
        background: #fff;
        box-shadow: 0 1px 3px rgba(26,26,26,.1);
        background-clip: content-box;
      }
      .app_header .logo img {
        height: 90px;
      }
      .app_header .app_header_inner {
        display: flex;
        align-items: center;
        height: 52px;
      }
      .navigation {
        width: 160px;
      }
      .app-content {
        margin: 10px 0;
      }
      .logo {
        cursor: pointer;
      }
    `}</style>
    <header role="banner" className="sticky app_header">
      <Row type="flex" justify="center">
        <Col xs={24} sm={21} lg={18}>
          <div className="app_header_inner">
            <div className="logo">
              <Link href="/frontend">
                <img src="/static/images/logo.png" alt="FineHome"/>
              </Link>
            </div>
            <nav role="navigation" className="navigation"></nav>
            <div className="search_content">
              <Input
                style={{width: '300px'}}
                placeholder="输入查找条件"
                suffix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
              />
            </div>
          </div>
        </Col>
      </Row>
    </header>
    <article role="main-content" className="app-content">
      <Row type="flex" justify="center">
        <Col xs={24} sm={21} lg={18}>
          {children}
        </Col>
      </Row>
    </article>
    
  </div>


export default Layout;