import { Row, Col, Input, Icon, LocaleProvider } from 'antd'
import { Provider } from "mobx-react"
import { getHouseList } from '../store/actions'
import store from '../store/stores'
import Head from 'next/head'
import Link from 'next/link'
import zhCN from 'antd/lib/locale-provider/zh_CN';

const search = (evt) => {
  const { value: keyword } = evt.target;
  getHouseList({keyword})
}

const Layout = ({children, pure = false}) => 
  <LocaleProvider locale={zhCN}>
    <Provider store={store}>
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
            padding: 10px 0;
          }
          .logo {
            cursor: pointer;
          }
        `}</style>
        {!pure ? (<header role="banner" className="sticky app_header">
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
        </header>) : null}
        <article role="main-content" className="app-content">
          <Row type="flex" justify="center">
            <Col xs={24} sm={21} lg={18}>
              {children}
            </Col>
          </Row>
        </article>
      </div>
    </Provider>
  </LocaleProvider>

export default Layout;