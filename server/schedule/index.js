const schedule = require('node-schedule');
const { spider } = require('./server/services/spider')

let s;

module.exports = {
  start() {
    schedule.scheduleJob('30 * * * *', function(){
      spider();
    });
  },
  stop() {
    s.cancel()
  }
}
