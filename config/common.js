import fetch from 'isomorphic-unfetch'
import baseUrl from './base'

const config = {
  picUrl: {
    icon: 'https://img3.doubanio.com/icon/',
    view: 'https://img1.doubanio.com/view/group_topic/large/public/'
  }
}

function axios(rel_url, opt) {
  const default_opt = {type: 'get'};
  const url = baseUrl + rel_url;
  const options = Object.assign({}, default_opt, opt);
  return new Promise((resolve, reject) => {
    fetch(url, options)
      .then(res => res.json())
      .then(res => resolve(res))
      .catch(err => {
        console.error(err)
      })
  })
}

export {
  config,
  axios
}