import React from 'react'
import App, { Container } from 'next/app'
import { LocaleProvider, Spin } from 'antd'
import { Provider } from "mobx-react"
import zhCN from 'antd/lib/locale-provider/zh_CN';
import store from '../store/stores'
import Head from 'next/head'
import '../assets/style.less'

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
      </Container>
    )
  }
}