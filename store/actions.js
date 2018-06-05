import houseStore from './stores';
import { fetch } from '../config/common'

const getHouseList = (params) => {
  const { page = 1, keyword = '' } = params || {};
  fetch('/api/getHouseList', {method: 'post', data: {page, keyword}})
    .then(res => {
      houseStore.loadHouseData(res);
    })
}

export {
  getHouseList
}
