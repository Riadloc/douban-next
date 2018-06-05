import { observable, action } from 'mobx';

class HouseStore {
  @observable houseList
  @observable houseAmount

  constructor() {
    this.houseList = [];
    this.houseAmount = 0;
  }

  @action
  loadHouseData = list => {
    this.houseList.clear();
    const {houseList, amount} = list;
    this.houseList = houseList;
    this.houseAmount = amount;
  }
}

export default new HouseStore();