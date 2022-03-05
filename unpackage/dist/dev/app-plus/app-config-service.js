
var isReady=false;var onReadyCallbacks=[];
var isServiceReady=false;var onServiceReadyCallbacks=[];
var __uniConfig = {"pages":["pages/index/index","pages/class/class","pages/my/my","pages/cart/cart","pages/search/search","pages/search-list/search-list","pages/detail/detail","pages/more-comment/more-comment","pages/user-set/user-set","pages/user-path-list/user-path-list","pages/user-path-edit/user-path-edit","pages/order/order","pages/order-confirm/order-confirm","pages/order-invoice/order-invoice","pages/login/login","pages/msg-list/msg-list","pages/msg-article/msg-article","pages/pay-method/pay-method","pages/pay-result/pay-result","pages/order-coupon/order-coupon","pages/order-detail/order-detail","pages/logistics/logistics","pages/after-sale/after-sale","pages/about/about","pages/coupon/coupon","pages/order-refound/order-refound"],"window":{"navigationBarTextStyle":"black","navigationBarBackgroundColor":"#FFFFFF","backgroundColor":"#FFFFFF"},"tabBar":{"color":"#B1B1B1","selectedColor":"#FD6801","borderStyle":"black","backgroundColor":"#FFFFFF","list":[{"pagePath":"pages/index/index","text":"首页","iconPath":"static/tabbar/index.png","selectedIconPath":"static/tabbar/indexSelected.png"},{"pagePath":"pages/class/class","text":"分类","iconPath":"static/tabbar/class.png","selectedIconPath":"static/tabbar/classSelected.png"},{"pagePath":"pages/cart/cart","text":"购物车","iconPath":"static/tabbar/cart.png","selectedIconPath":"static/tabbar/cartSelected.png"},{"pagePath":"pages/my/my","text":"我的","iconPath":"static/tabbar/my.png","selectedIconPath":"static/tabbar/mySelected.png"}]},"nvueCompiler":"weex","nvueStyleCompiler":"uni-app","renderer":"auto","splashscreen":{"alwaysShowBeforeRender":true,"autoclose":false},"appname":"小袁商城","compilerVersion":"3.3.11","entryPagePath":"pages/index/index","networkTimeout":{"request":60000,"connectSocket":60000,"uploadFile":60000,"downloadFile":60000}};
var __uniRoutes = [{"path":"/pages/index/index","meta":{"isQuit":true,"isNVue":true,"isTabBar":true},"window":{"scrollIndicator":"none","titleNView":{"searchInput":{"align":"left","disabled":true,"borderRadius":"4rpx","backgroundColor":"#f7f7f7","placeholder":"遥控车","placeholderColor":"#CCCCCC"},"buttons":[{"float":"left","fontSize":"20px","fontSrc":"/static/font/iconfont.ttf","text":"","color":"#8b8b8b","colorPressed":"#BBBBBB"},{"float":"right","fontSrc":"/static/font/iconfont.ttf","fontSize":"20px","text":"","color":"#8b8b8b","colorPressed":"#BBBBBB"}]}}},{"path":"/pages/class/class","meta":{"isQuit":true,"isTabBar":true},"window":{"bounce":"none","scrollIndicator":"none","titleNView":{"searchInput":{"align":"left","disabled":true,"borderRadius":"4rpx","backgroundColor":"#f7f7f7","placeholder":"遥控车","placeholderColor":"#CCCCCC"},"buttons":[{"float":"right","fontSrc":"/static/font/iconfont.ttf","fontSize":"20px","text":"","color":"#8b8b8b","colorPressed":"#BBBBBB"}]}}},{"path":"/pages/my/my","meta":{"isQuit":true,"isTabBar":true},"window":{"titleNView":false,"bounce":"none","scrollIndicator":"none"}},{"path":"/pages/cart/cart","meta":{"isQuit":true,"isTabBar":true},"window":{"enablePullDownRefresh":true,"titleNView":false,"bounce":"none","scrollIndicator":"none"}},{"path":"/pages/search/search","meta":{},"window":{"scrollIndicator":"none","bounce":"none","titleNView":{"searchInput":{"align":"left","borderRadius":"4rpx","backgroundColor":"#f7f7f7","placeholder":"遥控车","placeholderColor":"#CCCCCC"},"buttons":[{"float":"right","fontSrc":"/static/font/iconfont.ttf","fontSize":"16px","text":"搜索","color":"#8b8b8b","colorPressed":"#BBBBBB"}]}}},{"path":"/pages/search-list/search-list","meta":{},"window":{"enablePullDownRefresh":true,"scrollIndicator":"none","bounce":"none","titleNView":{"searchInput":{"align":"left","borderRadius":"4rpx","backgroundColor":"#f7f7f7","placeholder":"遥控车","placeholderColor":"#CCCCCC"},"buttons":[{"float":"right","fontSrc":"/static/font/iconfont.ttf","fontSize":"16px","text":"搜索","color":"#8b8b8b","colorPressed":"#BBBBBB"}]}}},{"path":"/pages/detail/detail","meta":{},"window":{"bounce":"none","scrollIndicator":"none","titleNView":{"buttons":[{"type":"menu"}]}}},{"path":"/pages/more-comment/more-comment","meta":{},"window":{"enablePullDownRefresh":true,"bounce":"none","scrollIndicator":"none","titleNView":{"titleText":"商品评论","titleSize":"38rpx","titleAlign":"left"}}},{"path":"/pages/user-set/user-set","meta":{},"window":{"enablePullDownRefresh":false,"titleNView":{"titleText":"设置","titleSize":"38rpx"}}},{"path":"/pages/user-path-list/user-path-list","meta":{},"window":{"enablePullDownRefresh":true,"scrollIndicator":"none","bounce":"none","titleNView":{"titleText":"地址列表","titleSize":"38rpx","buttons":[{"fontSrc":"/static/font/iconfont.ttf","text":"","fontSize":"40rpx","color":"#929292","colorPressed":"#868686"}]}}},{"path":"/pages/user-path-edit/user-path-edit","meta":{},"window":{"enablePullDownRefresh":false,"scrollIndicator":"none","bounce":"none","titleNView":{"titleText":"添加收货地址","titleSize":"38rpx"}}},{"path":"/pages/order/order","meta":{},"window":{"enablePullDownRefresh":false,"scrollIndicator":"none","bounce":"none","titleNView":{"titleText":"我的订单","titleSize":"38rpx","buttons":[{"fontSrc":"/static/font/iconfont.ttf","text":"","fontSize":"46rpx","color":"#999999"},{"fontSrc":"/static/font/iconfont.ttf","text":"","fontSize":"46rpx","color":"#999999"}]}}},{"path":"/pages/order-confirm/order-confirm","meta":{},"window":{"enablePullDownRefresh":false,"bounce":"none","scrollIndicator":"none","titleNView":{"backgroundColor":"#fd6801","titleText":"订单配送至","titleSize":"38rpx","titleColor":"#FFFFFF"}}},{"path":"/pages/order-invoice/order-invoice","meta":{},"window":{"enablePullDownRefresh":false,"bounce":"none","scrollIndicator":"none","titleNView":{"titleText":"发票","titleSize":"38rpx"}}},{"path":"/pages/login/login","meta":{},"window":{"enablePullDownRefresh":false,"bounce":"none","scrollIndicator":"none","titleNView":false}},{"path":"/pages/msg-list/msg-list","meta":{},"window":{"enablePullDownRefresh":false,"bounce":"none","scrollIndicator":"none","titleNView":{"titleText":"消息列表","titleSize":"38rpx"}}},{"path":"/pages/msg-article/msg-article","meta":{},"window":{"enablePullDownRefresh":false,"bounce":"none","scrollIndicator":"none","titleNView":{"titleText":"文章","titleSize":"38rpx"}}},{"path":"/pages/pay-method/pay-method","meta":{},"window":{"enablePullDownRefresh":false,"bounce":"none","scrollIndicator":"none","titleNView":{"titleText":"选择支付方式","titleSize":"38rpx"}}},{"path":"/pages/pay-result/pay-result","meta":{},"window":{"enablePullDownRefresh":false,"bounce":"none","scrollIndicator":"none","titleNView":{"titleText":"支付成功","titleSize":"38rpx"}}},{"path":"/pages/order-coupon/order-coupon","meta":{},"window":{"enablePullDownRefresh":false,"bounce":"none","scrollIndicator":"none","titleNView":{"titleText":"优惠券","titleSize":"38rpx"}}},{"path":"/pages/order-detail/order-detail","meta":{},"window":{"enablePullDownRefresh":false,"bounce":"none","scrollIndicator":"none","titleNView":{"type":"transparent"}}},{"path":"/pages/logistics/logistics","meta":{},"window":{"enablePullDownRefresh":false,"bounce":"none","scrollIndicator":"none","titleNView":{"titleText":"物流详情","titleSize":"38rpx"}}},{"path":"/pages/after-sale/after-sale","meta":{},"window":{"enablePullDownRefresh":false,"bounce":"none","scrollIndicator":"none","titleNView":{"titleText":"申请售后","titleSize":"38rpx","titleAlign":"left"}}},{"path":"/pages/about/about","meta":{},"window":{"enablePullDownRefresh":false,"bounce":"none","scrollIndicator":"none","titleNView":{"titleText":"关于商城","titleSize":"38rpx","titleAlign":"left"}}},{"path":"/pages/coupon/coupon","meta":{},"window":{"enablePullDownRefresh":true,"bounce":"none","scrollIndicator":"none","titleNView":{"titleText":"领取优惠券","titleSize":"38rpx","titleAlign":"center"}}},{"path":"/pages/order-refound/order-refound","meta":{},"window":{"enablePullDownRefresh":false,"bounce":"none","scrollIndicator":"none","titleNView":{"titleText":"申请退款","titleSize":"38rpx","titleAlign":"center"}}}];
__uniConfig.onReady=function(callback){if(__uniConfig.ready){callback()}else{onReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"ready",{get:function(){return isReady},set:function(val){isReady=val;if(!isReady){return}const callbacks=onReadyCallbacks.slice(0);onReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
__uniConfig.onServiceReady=function(callback){if(__uniConfig.serviceReady){callback()}else{onServiceReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"serviceReady",{get:function(){return isServiceReady},set:function(val){isServiceReady=val;if(!isServiceReady){return}const callbacks=onServiceReadyCallbacks.slice(0);onServiceReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
service.register("uni-app-config",{create(a,b,c){if(!__uniConfig.viewport){var d=b.weex.config.env.scale,e=b.weex.config.env.deviceWidth,f=Math.ceil(e/d);Object.assign(__uniConfig,{viewport:f,defaultFontSize:Math.round(f/20)})}return{instance:{__uniConfig:__uniConfig,__uniRoutes:__uniRoutes,global:void 0,window:void 0,document:void 0,frames:void 0,self:void 0,location:void 0,navigator:void 0,localStorage:void 0,history:void 0,Caches:void 0,screen:void 0,alert:void 0,confirm:void 0,prompt:void 0,fetch:void 0,XMLHttpRequest:void 0,WebSocket:void 0,webkit:void 0,print:void 0}}}});
