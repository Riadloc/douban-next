import React, { Component } from 'react'
import Layout from '../components/layout'
import { Form, Icon, Input, Button, DatePicker, Select  } from 'antd'
import dayjs from 'dayjs'
import '../static/stylesheets/dashboard.css'
const FormItem = Form.Item
const Option = Select.Option
const dateFormat = 'YYYY/MM/DD'

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createTimeBegin: '',
      createTimeEnd: '',
      updateTimeBegin: '',
      updateTimeEnd: '',
      kwType: 'notin',
      keyword: '',
      frequency: ''
    }
  }

  handleDateChange = (e, type) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    })
  }

  render() {
    const { createTimeBegin, createTimeEnd, updateTimeBegin, updateTimeEnd, kwType, keyword, frequency } = this.state;
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
              <DatePicker name="createTimeBegin" value={createTimeBegin} onChange={this.handleDateChange}/>
              <span className="m-h-8">至</span>
              <DatePicker name="createTimeEnd" value={createTimeEnd} onChange={this.handleDateChange}/>
            </FormItem>
            <FormItem label="更新时间[截至]" {...formItemLayout}>
              <DatePicker name="updateTimeBegin" value={updateTimeBegin} onChange={this.handleDateChange}/>
              <span className="m-h-8">至</span>
              <DatePicker name="updateTimeEnd" value={updateTimeEnd} onChange={his.handleDateChange}/>
            </FormItem>
            <FormItem label="关键字" {...formItemLayout}>
              <Select name="kwType"
                defaultValue="notin"
                style={{width: 120}}
                value={kwType}
                onChange={his.handleDateChange}>
                <Option value="notin">不包含</Option>
                <Option value="in">包含</Option>
              </Select>
              <Input name="keyword" value={keyword} style={{width: 228, marginLeft: 30}} placeholder="请输入关键词" />
            </FormItem>
            <FormItem name="frequency" value={frequency} label="用户发帖频度" {...formItemLayout}>
              <Input placeholder="用户发帖频度" style={{width: 378}}/>
            </FormItem>
            <FormItem label="　" {...formItemLayout}　colon={false}>
              <Button type="primary" htmlType="submit">爬取</Button>
            </FormItem>
          </Form>
        </div>
      </Layout>
    )
  }
}

export default Dashboard;