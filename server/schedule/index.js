const schedule = require('node-schedule');
const { spider } = require('../services/spider')

let s;

module.exports = {
  start() {
    s = schedule.scheduleJob('30 * * * *', function(){
      spider();
    });
  },
  stop() {
    if (s) {
      s.cancel()
    }
  }
}
