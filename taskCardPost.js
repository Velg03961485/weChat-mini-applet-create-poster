// pages/prize/prize.js
const app = getApp()
import API from '../../utils/api.js' 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img: "http://goldsys.oss-cn-hangzhou.aliyuncs.com/1553045175167.jpg",   //背景图
    inputValue: "",
    maskHidden: false,
    employeeName: "",
    cardCode: "http://goldsys.oss-cn-hangzhou.aliyuncs.com/1553047102000.jpg",   //二维码
    taskCouponId:'',
    employeeId:'',
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.taskCouponId);
    this.data.employeeId = wx.getStorageSync('employeeId');
    this.data.taskCouponId = options.taskCouponId;
    this.getTaskInfo();
   

  },
 

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  // 这里将写入实时监听动作，进行摇一摇截屏
  // 使用了wx.onAccelerometerChange 方式实现
      // 方法一
      // let _this = this;
    // wx.onAccelerometerChange(function(res){
    //   console.log(res);
    //   if (_this.data.test === true){
    //     if (res.x > 0.55 && res.y > 0.55) {
    //       _this.setData({
    //         test:false,
    //       })
    //       wx.showToast({
    //         title: '摇一摇成功',
    //         icon: 'success',
    //         duration: 2000
    //       })
    //       _this.formSubmit();
    //       setTimeout(function(){
    //         _this.setData({
    //           test: true,
    //         })
    //       },5000)
    //     }
    //   }
      
    // })
    // 经过测试，发现大于0.55的区间 摇的速度和左右的幅度最佳
    // 缺点可能多次触发，建议采用 布尔值进行控制

    // 方法二.  封装了一个摇一摇函数，经过两次计算来触发，相对稳定一下
      // this.shakeFun()
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
  onShareAppMessage: function (res) {
    return {
      title: "这个是我分享出来的东西",
      success: function (res) {
        console.log(res, "转发成功")
      },
      fail: function (res) {
        console.log(res, "转发失败")
      }
    }
  },
  // 得到信息
  getTaskInfo(){
    let _this = this;
    let postData = {
      taskCouponId: _this.data.taskCouponId,
      employeeId: _this.data.employeeId
    }
    getApp().netRequest({
      url: API.getOneTaskCardInfo,
      data: postData,
      success: function (res) {
        console.log(res)
        if (res.data.end === 'success'){
          var datas = res.data.data;
          _this.setData({
            employeeName: datas.employeeName
          })
          // 在没生成海报的时候，就先把要用的的图片下载下来，防止加载速度过慢
          wx.downloadFile({
            url: datas.url, //仅为示例，并非真实的资源
            success: function (res) {
              if (res.statusCode === 200) {
                // console.log(res, "reererererer")
                _this.setData({
                  cardCode: res.tempFilePath
                })
              }
            }
          })

          wx.downloadFile({
            url: datas.activityUrl,
            success: function (res) {
              if (res.statusCode === 200) {
                _this.setData({
                  img: res.tempFilePath
                })
              }
            }
          })




        } else if (res.data.end === 'error') {

        }

      }
    })
  },

 //将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
 createNewImg: function () {
  var that = this;
  var context = wx.createCanvasContext('mycanvas');
  context.setFillStyle("#ffffff")   //填充整体的色调#697fde  ffe200
  // 设置上部的图片 /images/gobg.png
  context.fillRect(0, 0, 375, 667)
  var path = that.data.img;
  var path1 = that.data.cardCode;
  //将模板图片绘制到canvas,在开发工具中drawImage()函数有问题，不显示图片
  //不知道是什么原因，手机环境能正常显示   //绘制二维码touxiang
  context.drawImage(path, 48, 20, 280, 460);
  
  context.drawImage(path1, 136, 520, 100, 100);
  

  
  //绘制领券标语
  context.setFontSize(17);
  context.setFillStyle('#333333');
  context.setTextAlign('center');
  context.fillText(that.data.employeeName + "邀请您领券，一起选珠宝", 185, 510);
  context.stroke();


  //绘制领码提醒
  context.setFontSize(14);
  context.setFillStyle('#333333');
  context.setTextAlign('center');
  context.fillText('长按识别二维码', 185, 650);
  context.stroke();


  context.draw();
  //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
  setTimeout(function () {
    wx.canvasToTempFilePath({
      canvasId: 'mycanvas',
      success: function (res) {
        var tempFilePath = res.tempFilePath;
        that.setData({
          imagePath: tempFilePath,
          canvasHidden: true
        });
      },
      fail: function (res) {
        console.log(res);
      }
    });
  }, 200);
},
//点击保存到相册
baocun: function () {
  var that = this
  wx.saveImageToPhotosAlbum({
    filePath: that.data.imagePath,
    success(res) {
      wx.showModal({
        content: '图片已保存到相册，赶紧晒一下吧~',
        showCancel: false,
        confirmText: '好的',
        confirmColor: '#333',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定');
            /* 该隐藏的隐藏 */
            that.setData({
              maskHidden: false
            })
          }
        }, fail: function (res) {
          console.log(11111)
        }
      })
    }
  })
},
//点击生成
formSubmit: function (e) {
  var that = this;
  this.setData({
    maskHidden: false
  });
  wx.showToast({
    title: '生成中...',
    icon: 'loading',
    duration: 1000
  });
  setTimeout(function () {
    wx.hideToast()
    that.createNewImg();
    wx.vibrateLong();
    that.setData({
      maskHidden: true
    });
  }, 1000)
},

// 点击关闭生成的海报
closeThisPostBtn(){
  console.log('关闭海报');
  this.setData({
    maskHidden: false
  });
},

  
  shakeFun() { // 摇一摇方法封装
    let _this = this;
    var numX = 1 //x轴
    var numY = 1 // y轴
    var numZ = 0 // z轴
    var stsw = true // 开关，保证在一定的时间内只能是一次，摇成功
    var positivenum = 0 //正数 摇一摇总数
    var audioCtx = wx.createAudioContext('myAudio') //音频，用于摇成功提示
    wx.onAccelerometerChange(function (res) {
      console.log(res)  //小程序api 加速度计
      if (numX < res.x && numY < res.y) {  //个人看法，一次正数算摇一次，还有更复杂的
        positivenum++
        setTimeout(() => { positivenum = 0 }, 2000) //计时两秒内没有摇到指定次数，重新计算
      }
      if (numZ < res.z || numY < res.y) { //可以上下摇，上面的是左右摇
        positivenum++
        setTimeout(() => { positivenum = 0 }, 2000) //计时两秒内没有摇到指定次数，重新计算
      }
      if (positivenum == 2 && stsw) { //是否摇了指定的次数，执行成功后的操作
        stsw = false
        _this.formSubmit();
        console.log('摇一摇成功')
        setTimeout(() => {
          positivenum = 0 // 摇一摇总数，重新0开始，计算
          stsw = true
        }, 2000)
      } else {
        console.log('没触发')
      }
    })
  },
})