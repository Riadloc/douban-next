import React from 'react'
import App, { Container } from 'next/app'
import { LocaleProvider, Spin } from 'antd'
import { Provider } from "mobx-react"
import zhCN from 'antd/lib/locale-provider/zh_CN';
import store from '../store/stores'
import Head from 'next/head'
import 'minireset.css'

export default class MyApp extends App {
  static async getInitialProps ({ Component, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  render () {
    const { Component, pageProps } = this.props
    return (
      <Container>
        <Head>
          <title>douban-next</title>
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          <meta charSet='utf-8' />
          <meta name="referrer" content="never" />
          <link rel='stylesheet' href='/_next/static/style.css' />
        </Head>
        <LocaleProvider locale={zhCN}>
          <div>
            <Provider store={store}>
              <Component {...pageProps} />
            </Provider>
            <Spin size="large" className="fine-home-spin"/>
          </div>
        </LocaleProvider>
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
          .fine-home-spin {
            position: fixed!important;
            top: 40%;
            left: 50%;
          }
          .logo {
            cursor: pointer;
          }
        `}</style>
      </Container>
    )
  }
}