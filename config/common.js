import axios from 'axios'
import baseUrl from './base'

const config = {
  picUrl: {
    icon: 'https://img3.doubanio.com/icon/',
    view: 'https://img1.doubanio.com/view/group_topic/large/public/'
  }
}

function fetch(rel_url, opt) {
  const default_opt = {method: 'get'};
  const url = baseUrl + rel_url;
  const options = Object.assign({url}, default_opt, opt);
  return new Promise((resolve, reject) => {
    axios(options)
      .then(res => resolve(res.data))
      .catch(err => {
        reject(err)
        console.error(err)
      })
  })
}

export {
  config,
  fetch
}