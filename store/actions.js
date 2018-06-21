import houseStore from './stores';
import { fetch } from '../config/common'

const getHouseList = (params) => {
  fetch('/api/getHouseList', {method: 'post', data: params})
    .then(res => {
      houseStore.loadHouseData(res);
    })
}

export {
  getHouseList
}
