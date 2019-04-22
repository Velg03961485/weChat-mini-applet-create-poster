# weChat-mini-applet-create-poster
如何使用微信小程序canvas创建一张自定义海报，并生成图片保存到本地（小程序）

新加入模块 ，摇一摇自动生成canvas

截屏成功，震动提示

数据返回线上图片都采用了 wx.downloadFile  进行下载操作，进行缓加载

绘制canvas的时候，保证获取图片的地址在 drawImage之前，并进行缓加载操作

文字和图片尽量分开绘制
