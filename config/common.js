import fetch from 'isomorphic-unfetch'
import baseUrl from './base'

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
  axios
}