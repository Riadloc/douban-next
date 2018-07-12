import houseStore from './stores';
import { fetch } from '../config/common'

const getHouseList = (params = {}) => {
  const reset = Boolean(!params.page || params.page === 1);
  fetch('/api/getHouseList', {method: 'post', data: params})
    .then(res => {
      houseStore.loadHouseData(res, reset);
    })
}

const clearHouseList = () => {
  houseStore.clearHouseData();
}

export {
  getHouseList,
  clearHouseList
}
