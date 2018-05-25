import { Table } from 'antd'
import { axios } from '../../config/common'

const Index = (props) => {
  const list = props.list.map((item, index) => <li key={index}>{item.Title}</li>);
  const dataSource = [{
    key: '1',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号'
  }, {
    key: '2',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号'
  }];
  
  const columns = [{
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  }, {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  }, {
    title: '住址',
    dataIndex: 'address',
    key: 'address',
  }];
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} />
      <ul>{list}</ul>
    </div>
  )
};

Index.getInitialProps = async function () {
  const data = await axios('/api/douban', {method: 'post', body: {page : 1}})
  return { list: data.houseList }
}

export default Index;