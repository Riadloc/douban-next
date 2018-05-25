import { axios } from '../../config/common'

const Index = (props) => {
  const list = props.list.map((item, index) => <li key={index}>{item.Title}</li>);
  return (
    <ul>{list}</ul>
  )
};

Index.getInitialProps = async function () {
  const data = await axios('/api/douban', {method: 'post', body: {page : 1}})
  return { list: data.houseList }
}

export default Index;