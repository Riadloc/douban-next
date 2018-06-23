const Segment  = require('segment');
const segment = new Segment()
segment.use({
  type: 'optimizer',
  init: function (segment) {
    // segment 为当前的Segment实例
  },
  doOptimize: function (words) {
    return words.filter(item => !/的|得|地/.test(item.w));
  }
})
segment.useDefault()

console.log(segment.doSegment('这是一个基于Node.js的中文分词模块。', {
  stripPunctuation: true,
  stripStopword: true,
  simple: true
}));