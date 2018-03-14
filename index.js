// pages/history/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists: null,
    delBtnWidth: null,
    p: null,
    animationList: [],
    firstClient: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getData()
  },
  makeObj(i) {
    this.pid = i
    this.picpath = 'uploadfile/6351e80bcefb67b608786efb845eefa3aa.jpg'
    this.product_title = 'XXXXXXXXXXXXXXX'
    this.price = '123'
    this.buys = 1
  },
  getData() {
    var lists = []
    var animationList = []
    for (var i = 0; i < 10; i++) {
      animationList.push(this.createAni())
      lists.push(new this.makeObj(i))
    }
    this.setData({
      animationList: animationList,
      lists: lists
    }, () => {
      this.getWidth()
    })
  },
  dele(e) {
    console.log(`删除id为${e.currentTarget.dataset.pid}的数据`)
  },
  getWidth: function () {  //获取  删除的宽度
    var that = this;
    wx.createSelectorQuery().select('#delete').boundingClientRect(function (rect) {
      that.setData({
        delBtnWidth: rect.width
      })
    }).exec()
  },
  catchStart(e) {
    if (this.data.p || this.data.p == 0) {
      this.donghua(this.data.p, '0px')
    }
    this.setData({
      leftWidth: 0,
      firstClient: { X: e.touches[0].clientX, Y: e.touches[0].clientY }
    })
  },
  catchMove(e) {
    let that = this
    if (e.touches.length == 1) {
      let moveX = e.touches[0].clientX;
      let moveY = e.touches[0].clientY;
      let disX = that.data.firstClient.X - moveX;
      let disY = that.data.firstClient.Y - moveY;
      if (disY > disX) {
        return false
      }
      let txtStyle = "";
      if (disX == 0 || disX < 0) {
        txtStyle = "0px";
      } else if (disX > 0) {
        txtStyle = "-" + disX + "px";
        if (disX >= that.data.delBtnWidth) {
          txtStyle = "-" + that.data.delBtnWidth + "px";
        }
      }
      this.donghua(e.currentTarget.dataset.id, txtStyle)
    }
  },
  catchEnd(e) {
    const that = this
    if (e.changedTouches.length == 1) {
      let endX = e.changedTouches[0].clientX;
      let disX = that.data.firstClient.X - endX;
      let delBtnWidth = that.data.delBtnWidth;
      let txtStyle = disX > delBtnWidth / 2 ? "-" + delBtnWidth + "px" : "0px";
      if (txtStyle != "0px") {
        this.setData({
          p: e.currentTarget.dataset.id
        })
      }
      this.donghua(e.currentTarget.dataset.id, txtStyle)
    }
  },
  createAni() {
    return wx.createAnimation({
      duration: 400,
      timingFunction: '"linear"',
      delay: 0,
      transformOrigin: '"50% 50% 0"',
    })
  },
  donghua(num, attr) {
    let animationList = this.data.animationList.slice()
    let MOU = this.createAni()
    MOU.translate(attr, 0, 0).step()
    animationList[num] = MOU.export()
    this.setData({
      animationList: animationList
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})