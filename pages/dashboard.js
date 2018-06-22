import React, { Component } from 'react'
import { Form, Icon, Input, Button, DatePicker, Select, message } from 'antd'
import moment from 'moment'
import Layout from '../components/layout'
import Spin from '../components/spin'
import { fetch } from '../config/common'
import _ from 'lodash/lang'
const FormItem = Form.Item
const Option = Select.Option
const dateFormat = 'YYYY-MM-DD'
import '../assets/stylesheets/dashboard.less'

class Dashboard extends Component {
  constructor(props) {
    const today = moment();
    super(props);
    this.state = {
      createTimeBegin: today,
      createTimeEnd: today,
      updateTimeBegin: today,
      updateTimeEnd: today,
      kwType: 'notin',
      keyword: '',
      frequency: '',
      loading: false
    }
  }

  handleInputChange = (e, type) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    })
  }

  handleSelectChange = (name, value) => {
    this.setState({
      [name]: value
    })
  }

  handleDateChange = (name, value) => {
    this.setState({
      [name]: value
    })
  }

  doSpider = () => {
    const formdata = _.cloneDeep(this.state);
    delete formdata.loading;
    const { createTimeBegin, createTimeEnd, updateTimeBegin, updateTimeEnd } = formdata;
    if (createTimeBegin.isAfter(createTimeEnd)) {
      message.error('创建时间开始时间不能超过结束时间！');
      return false;
    }
    if (updateTimeBegin.isAfter(updateTimeEnd)) {
      message.error('更新时间开始时间不能超过结束时间！');
      return false;
    }
    for (const key of Object.keys(formdata)) {
      const value = formdata[key];
      if (_.isString(value)) {
        if (!value.trim()) {
          delete formdata[key];
        }
      } else if (_.isObject(value)) {
        formdata[key] = value.format(dateFormat);
      }
    }
    if (formdata['frequency']) {
      if (!/^[0-9]+$/.test(formdata['frequency'])) {
        message.error('用户频度须为数字且不为负数！')
        return false;
      }
    }
    this.setState({
      loading: true
    })
    fetch('/api/doSpider', {method: 'post', data: formdata})
      .then(res => {
        console.log(res);
        message.success('抓取成功！');
        this.setState({
          loading: false
        })
      })
      .catch(err => {
        this.setState({
          loading: false
        })
      })
  }

  render() {
    const { createTimeBegin, createTimeEnd, updateTimeBegin, updateTimeEnd, kwType, keyword, frequency, loading } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };
    return (
      <Layout pure={true}>
        <div className="dashboard">
          <Form>
            <FormItem label="创建时间[截至]" {...formItemLayout}>
              <DatePicker
                value={createTimeBegin}
                onChange={(date) => this.handleDateChange('createTimeBegin', date)}
              />
              <span className="m-h-8">至</span>
              <DatePicker
                value={createTimeEnd}
                onChange={(date) => this.handleDateChange('createTimeEnd', date)}
              />
            </FormItem>
            <FormItem label="更新时间[截至]" {...formItemLayout}>
              <DatePicker
                value={updateTimeBegin}
                onChange={(date) => this.handleDateChange('updateTimeBegin', date)}
              />
              <span className="m-h-8">至</span>
              <DatePicker
                value={updateTimeEnd}
                onChange={(date) => this.handleDateChange('updateTimeEnd', date)}
              />
            </FormItem>
            <FormItem label="关键字" {...formItemLayout}>
              <Select
                style={{width: 120}}
                value={kwType}
                onChange={value => this.handleSelectChange('kwType', value)}>
                <Option value="notin">不包含</Option>
                <Option value="in">包含</Option>
              </Select>
              <Input name="keyword" value={keyword} style={{width: 228, marginLeft: 30}} onChange={this.handleInputChange} placeholder="请输入关键词" />
            </FormItem>
            <FormItem label="用户发帖频度" {...formItemLayout}>
              <Input value={frequency} name="frequency" placeholder="用户发帖频度" onChange={this.handleInputChange} style={{width: 378}}/>
            </FormItem>
            <FormItem label="　" {...formItemLayout}　colon={false}>
              <Button type="primary" htmlType="button" onClick={this.doSpider} disabled={loading}>爬取</Button>
            </FormItem>
          </Form>
          <Spin loading={loading}/>
        </div>
      </Layout>
    )
  }
}

export default Dashboard;