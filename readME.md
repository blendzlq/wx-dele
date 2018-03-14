在小程序中wx:for循环渲染的组件如何动态加入动画/并且优雅的实现右滑删除
<!-- more -->
## for循环加入动画
### 需求
在开发的小程序中，有个需求是在名片列表里点中某一个，那个名片就会有个移动的动画，而这些名片是通过wx:for循环渲染的view组件，如果直接在view组件上加上动画属性的绑定，然后使用setData来更新的话，则会造成所有名片的view都同时执行这个动画。小程序里对ui和js逻辑的隔离非常彻底，都是机遇数据驱动ui，发现无从下手
### 思路
在请求到数据的同时。动态创建一个animationList的数据
在wx:for 渲染中  动态的加入到每一个元素
在这里我写的是一个右滑删除的效果
### wxml
``` bash
<view class="list" wx:for="{{lists}}" wx:for-index="i" wx:key="*this">
  	<view class='content-inner' animation="{{animationList[i]}}">
  		...code...
	</view>
	<view class='delete' data-pid="{{item.pid}}" catchtap='dele'  id='{{i==0?"delete":""}}'>
		<image src='/image/user/dele.png'></image>
	</view>
  </view>
</view>
```
这样子的话  我们在for循环中加入animation的效果已经实现了

## 右滑删除
 ### 准备
 在动手写之前，查阅了好多文档。得到的结论是。小程序官方并没有给出右滑删除的接口，而网上别的大佬提供的一些方法也不得我意。有些僵硬。 于是自己动手写
 ### 思路
 #### js
	 刚刚for循环中加动画已经解决了。那么我们接下来就是写一个右滑删除  。然后让view快速动画到移动的距离就好
	1. 首先 我们记录手指初次触摸的坐标
	2. 在移动过程中，我们先判断X的距离大于Y的距离，才是用户右滑的目的。不然就return
	3. 当前滑动的X 减去第一个记录的X得到的结果就是我们应该滑动的距离
	4. 然后我们用动画的方式让view去动画到该去的位置
	5. 在手机抬起的时候，我们需要判断。如果当前移动的位置>删除的宽度/2,那么我们就让view动画出来，让删除按钮显示出来，反之就动画回去
#### wxss
	布局的话 。就采用相对定位来布局 ，把删除藏在view下面
 ###  代码
 ``` bash
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
  donghua(num, attr) {
    let animationList = this.data.animationList.slice()
    let MOU = this.createAni()
    MOU.translate(attr, 0, 0).step()
    animationList[num] = MOU.export()
    this.setData({
      animationList: animationList
    })
  }
 ```
 ## 如果对你有帮助的话，请点个star吧
