import { observable, action } from 'mobx';

class HouseStore {
  @observable houseList
  @observable houseAmount

  constructor() {
    this.houseList = [];
    this.houseAmount = 0;
  }

  @action
  loadHouseData = (list, reset) => {
    if (reset) {
      this.houseList.clear();
      this.houseAmount = 0;
    }
    const {houseList, amount} = list;
    this.houseList = [...this.houseList, ...houseList];
    this.houseAmount = amount;
  }

  @action
  clearHouseData = () => {
    this.houseList.clear();
    this.houseAmount = 0;
  }
}

export default new HouseStore();