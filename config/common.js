import axios from 'axios'
import baseUrl from './base'

const config = {
  picUrl: {
    icon: 'https://img3.doubanio.com/icon/',
    view: 'https://img1.doubanio.com/view/group_topic/large/public/'
  }
}

function toggleSpin(flag) {
  try {
    const spin = document.querySelector('.fine-home-spin');
    const display = spin.style.display;
    const newStatus = flag ? 'inline-block' : 'none';
    if (display === newStatus) return;
    spin.style.display = newStatus;
  } catch (error) {
    return false;
  }
}

function fetch(rel_url, opt) {
  const default_opt = {method: 'get'};
  const url = baseUrl + rel_url;
  const options = Object.assign({url}, default_opt, opt);
  toggleSpin(true);
  return new Promise((resolve, reject) => {
    axios(options)
      .then(res => {
        toggleSpin(false)
        resolve(res.data)
      })
      .catch(err => {
        toggleSpin(false)
        console.error(err)
        reject(err)
      })
  })
}

export {
  config,
  fetch
}