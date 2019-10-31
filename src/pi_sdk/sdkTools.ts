/**
 * 悬浮框按钮样式
 */
// tslint:disable-next-line:max-func-body-length
export const createThirdBaseStyle = () => {
    const cssText = `
    .pi-message{
      position: fixed;
      left: 50%;
      bottom: 150px;
      border-radius: 6px;
      background-color: rgba(0, 0, 0, 0.9);
      line-height: 22.5px;
      color: rgba(255, 255, 255, 0.87);
      font-size: 16px;
      text-align: center;
      padding: 9px 12.5px;
      transform: translateX(-50%);
      transition: opacity .3s, transform .4s;
      opacity: 0;
      z-index:99999;
    }
    .message-fade-enter {
      opacity: 1;
      transform: translate(-50%,-100%);
    }
    .pi-float-button{
      display: flex;
      align-items: center;
      justify-content: center;
      width:40px;
      height:40px;
      background:rgba(0,0,0,0.2);
      border-radius:50%;
      border:1px solid rgba(255,255,255,0.2);
      position: fixed;
      top: 100px;
      right:10px;
      z-index:99999;
    }
    .pi-dot1{
    width: 3.5px;
    height: 3.5px;
    background-color: #fff;
    border-radius: 50%;
    }
    .pi-dot2{
    width: 7.5px;
    height: 7.5px;
    background-color: #fff;
    border-radius: 50%;
    margin: 0 5px;
    }
  
    .pi-wx-btns{
      position:absolute;
      top:20px;
      right:10px;
      background-color:rgba(0,0,0,0.2);
      border-radius:16px;
      border:1px solid rgba(255,255,255,0.2);
      padding: 3.5px 10px;
      display: inline-flex;
      align-items: center;
      z-index:99999;
    }
    .pi-wx-dots{
        display: flex;
        align-items: center;
        width: 25px;
        height: 25px;
        justify-content: center;
    }
    .pi-wx-dot1{
        width:3.5px;
        height:3.5px;
        background-color: #fff;
        border-radius: 50%;
    }
    .pi-wx-dot2{
        width:6.5px;
        height:6.5px;
        background-color: #fff;
        border-radius: 50%;
        margin: 0 2.5px;
    }
    .pi-wx-circle{
        width:25px;
        height:25px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: 17px;
    }
    .pi-wx-circle1{
        background-color:rgba(0,0,0,0);
        width:17px;
        height:17px;
        border: 2px solid #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        box-sizing: border-box;
    }
    .pi-wx-circle2{
        width:5px;
        height:5px;
        background-color: #fff;
        border-radius: 50%;
    }
    .pi-bottom-box{
        background:rgba(0,0,0,0.5);
        border-radius:48px;
        position: fixed;
        display: flex;
        flex-wrap: wrap;
        transition: all .3s ease-in-out;
        padding-left:15px;
    }
    .pi-bottom-item{
        display: flex;
        width:25px;
        flex-direction: column;
        align-items: center;
        margin: 5px 15px 5px 0;
    }
    .pi-img-box{
        width: 25px;
        height: 25px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
    }
    .pi-item-img{
        width: 25px;
        height: 25px;
    }
    .pi-item-redSpot{
        position: absolute;
        top:0;
        right:0;
        width:8px;
        height:8px;
    }
    .pi-float-redSpot{
        position: absolute;
        top:0;
        left:0;
        width:8px;
        height:8px;
    }
    .pi-text{
        font-size:12px;
        font-family:"PingFangSC-Regular";
        font-weight:400;
        color:rgba(255,255,255,1);
    }
    .bulletin{
        width:300px;
        height:225px;
        background:rgba(0,0,0,0.6);
        border-radius:6px;
        position: fixed;
        top:50%;
        left:50%;
        z-index:999999;
        transform: translate(-50%, -50%);
    }
    .bulletinTitle{
        width:148px;
        heigth:50px;
        line-height:50px;
        font-size:18px;
        font-family:SourceHanSansCN-Medium,SourceHanSansCN;
        font-weight:500;
        color:rgba(255,255,255,1);
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        margin: 0 auto;
    }
    .closeButton{
        width:25px;
        height:25px;
        position:absolute;
        top:10px;
        right:12px;
    }
    .bulletinContentBox{
        width:250px;
        height:164px;
        font-size:14px;
        font-family:SourceHanSansCN-Normal,SourceHanSansCN;
        font-weight:400;
        color:rgba(255,255,255,1);
        overflow-x:hidden;
        overflow-y:auto;
        line-height:20px;
        margin: 0 auto;
    }
    .publisher{
        margin-top: 26px;
    }
    `;
    // tslint:disable-next-line:variable-name
    const pi_root_css = `#pi-root{${browserAdaptive()}}.pi-root{${browserAdaptive()}}`;
    const style = document.createElement('style');
    style.type = 'text/css';
    // tslint:disable-next-line:no-inner-html
    style.innerHTML = pi_root_css + cssText;
    document.getElementsByTagName('head')[0].appendChild(style);
};
  
/**
 * 选择按钮
 */
export const buttonModInit = () => {
    return () => {
        if (window.pi_sdk.config.buttonMod === window.pi_sdk.config.buttonMods.SPOTBUTTON) {  // 可拖动悬浮框 三个点
            floatButtonInit();
        } else if (window.pi_sdk.config.buttonMod === window.pi_sdk.config.buttonMods.WXBUTTON) {   // 微信小程序悬浮框
            WxButtionInit();
        } else if (window.pi_sdk.config.buttonMod === window.pi_sdk.config.buttonMods.ICONBUTTON) { // 可拖动悬浮框 图标
            floatButtonInit2();
        } else {                    // 默认
            floatButtonInit2();
        }
        
    };
};

/**
 * 关闭弹框
 */
export const closePopBox = () => {
    const $root = document.querySelector('#pi-root');
    if ($root) {
        document.querySelector('body').removeChild($root);
    }
};

/**
 * 提示框
 */
export const popNewMessage = (msg) => {
    const $message = document.createElement('div');
    $message.setAttribute('class','pi-message');
    $message.textContent = msg;

    const $body = document.querySelector('body');
    $body.appendChild($message);
    setTimeout(() => {
        $message.setAttribute('class','pi-message message-fade-enter');
    },17);
    setTimeout(() => {
        $message.setAttribute('class','pi-message');
        setTimeout(() => {
            $body.removeChild($message);
        },300);
    },2000);
};

/**
 * 第三方api样式
 */
// tslint:disable-next-line:max-func-body-length
export const createThirdApiStyleTag = () => {
    const cssText = `
    .pi-mask {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background-color: rgba(50, 50, 50, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    }
    .pi-btns {
    margin: 30px 40px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    }
    .pi-cancel-btn {
    width: 220px;
    height: 80px;
    border-radius: 50px;
    border: 1px dashed rgba(136, 136, 136, 1);
    font-size: 32px;
    color: #888;
    display: flex;
    justify-content: center;
    align-items: center;
    }
    .pi-ok-btn {
    width: 220px;
    height: 80px;
    background: linear-gradient(
        270deg,
        rgba(68, 206, 237, 1) 0%,
        rgba(62, 179, 241, 1) 100%
    );
    box-shadow: 0px 5px 10px 0px rgba(13, 131, 246, 0.1);
    border-radius: 50px;
    font-size: 32px;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    }
    .pi-sure-btn{
        border-top: 1px solid #CCCCCC;
        padding: 30px;
        text-align: center;
        color: #3294E6;
        font-size: 28px;
        font-weight: 600;
    }


    /* 获取openid */

    .pi-update-box {
    background-color: #fff;
    background-image: url(${window.pi_sdk.config.imgUrlPre}update_bg.png);
    background-repeat: no-repeat;
    background-size: 100% 235px;
    width: 630px;
    border-radius: 12px;
    padding-bottom: 30px;
    position: relative;
    }
    .pi-update-rocket {
    position: absolute;
    left: 50%;
    top: 0;
    transform: translate3d(-50%, -30%, 0);
    }
    .pi-update-content {
    padding: 20px 30px;
    }
    .pi-update-title {
    margin-top: 250px;
    font-size: 32px;
    color: #111;
    line-height: 45px;
    }
    .pi-update-items {
    margin-top: 20px;
    }
    .pi-update-item {
    font-size: 28px;
    line-height: 40px;
    color: #8e96ab;
    }

    /* 支付 */
    .pi-pay-title {
        font-size:38px;
        height: 90px;
        text-align: center;
        line-height: 90px;
        border-bottom: 1px solid #CCCCCC;
    }

    .pi-pay-content {
        padding-top: 20px;
        font-size: 28px;
    }

    .pi-pay-item {
        line-height: 40px;
        height: 40px;
        margin-bottom: 10px;
    }
    .pi-pay-text{
        font-weight:500;
    }
    .pi-pay-num{
        color: #318DE6;
    }
    .pi-pay-input{
        height: 80px;
        width: 100%;
        border: 1px solid #1E6DEF;
        background:rgba(249,249,249,1);
        border-radius: 6px;
        font-size: 32px;
        padding: 0px 15px;
        box-sizing: border-box;
        letter-spacing: 2px;
        margin-top: 15px;
        outline:none;
    }

    /* 加载 */
    .pi-loading-mask{
        position: absolute;
        margin: 0;
        top: 0;
        right: 0;   
        bottom: 0;
        left: 0;
        -webkit-transition: opacity .3s;
        transition: opacity .3s;
        color: #fff;
        font-size: 24px;
    }
    .pi-loading-spinner{
        width: 180px;
        height: 180px;
        background-color: rgba(0,0,0,.6);
        top: 50%;
        left: 50%;
        text-align: center;
        position: absolute;
        transform: translate(-50%,-50%);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-radius: 12px;
        padding-top: 10px;
    }
    .loading-img{
        width: 50px;
        height: 50px;
        border: 4px solid white;
        border-bottom-color:transparent;
        -webkit-animation: loading 1s 0s linear infinite;
        animation: loading 1s 0s linear infinite;
        opacity:1;
        border-radius:50%;
    }
    .pi-loading-text{
        color: #fff;
        margin: 10px 0 20px;
    }
    .modalBox-body{
        background-color: #fff;
        padding: 30px;
        padding-bottom: 0;
        width: 570px;
        border-radius: 12px;
        box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.2);
    }

    /* 动画 */
    @-webkit-keyframes bounceInUp {
    from,
    60%,
    75%,
    90%,
    to {
        -webkit-animation-timing-function: cubic-bezier(
        0.215,
        0.61,
        0.355,
        1
        );
        animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    }

    from {
        opacity: 0;
        -webkit-transform: translate3d(0, 3000px, 0);
        transform: translate3d(0, 3000px, 0);
    }

    60% {
        opacity: 1;
        -webkit-transform: translate3d(0, -20px, 0);
        transform: translate3d(0, -20px, 0);
    }

    75% {
        -webkit-transform: translate3d(0, 10px, 0);
        transform: translate3d(0, 10px, 0);
    }

    90% {
        -webkit-transform: translate3d(0, -5px, 0);
        transform: translate3d(0, -5px, 0);
    }

    to {
        -webkit-transform: translate3d(0, 0, 0);
        transform: translate3d(0, 0, 0);
    }
    }

    @keyframes bounceInUp {
    from,
    60%,
    75%,
    90%,
    to {
        -webkit-animation-timing-function: cubic-bezier(
        0.215,
        0.61,
        0.355,
        1
        );
        animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    }

    from {
        opacity: 0;
        -webkit-transform: translate3d(0, 3000px, 0);
        transform: translate3d(0, 3000px, 0);
    }

    60% {
        opacity: 1;
        -webkit-transform: translate3d(0, -20px, 0);
        transform: translate3d(0, -20px, 0);
    }

    75% {
        -webkit-transform: translate3d(0, 10px, 0);
        transform: translate3d(0, 10px, 0);
    }

    90% {
        -webkit-transform: translate3d(0, -5px, 0);
        transform: translate3d(0, -5px, 0);
    }

    to {
        -webkit-transform: translate3d(0, 0, 0);
        transform: translate3d(0, 0, 0);
    }
    }

    @keyframes loading {
    0% {
        -webkit-transform: rotate(0deg);
            transform: rotate(0deg); 
    }
    100%{
        -webkit-transform: rotate(360deg);
                transform: rotate(360deg); 
    } 
    }

    .bounceInUp {
    -webkit-animation-name: bounceInUp;
    animation-name: bounceInUp;
    }
    .animated {
    -webkit-animation-duration: 1s;
    animation-duration: 1s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    }`;

    const style = document.createElement('style');
    style.type = 'text/css';
    // tslint:disable-next-line:no-inner-html
    style.innerHTML = cssText;
    document.getElementsByTagName('head')[0].appendChild(style);
};

// 创建授权弹窗标签
export const createAuthorizeElementTag = () => {
    const htmlText = `
        <div class="pi-update-box animated bounceInUp">
            <img src="${window.pi_sdk.config.imgUrlPre}rocket.png" class="pi-update-rocket" />
            <div class="pi-update-content">
                <div class="pi-update-title">您将获取以下授权</span></div>
                <div class="pi-update-items">
                </div>
            </div>
            <div class="pi-btns">
                <div class="pi-cancel-btn">取消</div>
                <div class="pi-ok-btn">确定</div>
            </div>
        </div>`;
    const $mask = document.createElement('div');
    $mask.setAttribute('class', 'pi-mask');
    // tslint:disable-next-line:no-inner-html
    $mask.innerHTML = htmlText;

    const $root = document.createElement('div');
    $root.setAttribute('id', 'pi-root');
    $root.appendChild($mask);

    const $body = document.querySelector('body');
    $body.appendChild($root);
};

// 创建支付弹窗标签
export const createPayElementTag = () => {
    const htmlText = `
        <div class="pi-update-box animated bounceInUp">
            <div class="pi-update-content">
                <div class="pi-pay-title">确认支付</div>
                <div class="pi-pay-content">
                    <div class="pi-pay-item">
                        <span>金额：</span><span id="pi_payCount" class="pi-pay-num">0.02ST</span>
                    </div>
                    <div class="pi-pay-item">
                        <span>发给：</span><span id="pi_payObject" class="pi-pay-text">LOL赛事竞猜</span>
                    </div>
                    <div class="pi-pay-item">
                        <span>余额：</span><span id="pi_payBalance" class="pi-pay-text">12ST</span>
                    </div>
                    <div>
                        <input class="pi-pay-input" type="password" placeholder="输入密码" name="" id="pi_password">
                    </div>
                </div>
            </div>
            <div class="pi-btns">
                <div class="pi-cancel-btn">取消</div>
                <div class="pi-ok-btn">确定</div>
            </div>
        </div>`;
    const $root = document.createElement('div');
    $root.setAttribute('class', 'pi-mask');
    // tslint:disable-next-line:no-inner-html
    $root.innerHTML = htmlText;

    const $body:any = document.querySelector('.pi-root');
    $body.appendChild($root);
    $body.style.display = 'flex';
};

// 创建加载弹窗标签
export const popNewLoading = (loadingStr) => {
    const htmlText = `
        <div class="pi-loading-mask">
            <div class="pi-loading-spinner">
                <div class="loading-img"></div>
                <p class="pi-loading-text">
                    ${loadingStr}
                </p>
            </div>
        </div>`;
    const $mask = document.createElement('div');
    $mask.setAttribute('class', 'pi-loading-mask');
    // tslint:disable-next-line:no-inner-html
    $mask.innerHTML = htmlText;

    const $root = document.createElement('div');
    $root.setAttribute('id', 'pi-root');
    $root.appendChild($mask);

    document.querySelector('body').appendChild($root);
};

/**
 * 密码弹框
 */
export const popInputBox =  (title,okCB,cancelCB?) => {
    createInputBoxElementTag(title);
    const $ok = document.querySelector('.pi-ok-btn');
    const $cancel = document.querySelector('.pi-cancel-btn');
    const $input = document.getElementById('pi_password');

    $ok.addEventListener('click',  () => {
        closePopBox();
        okCB && okCB((<any>$input).value);
    });

    $cancel.addEventListener('click',  () => {
        cancelCB && cancelCB();
        closePopBox();
    });
};

/**
 * 根据id获取buttonItem
 */
const getButtonItemById = (id) => {
    const index = window.pi_sdk.config.showButtons.findIndex((item) => {
        return item.id === id;
    });

    return window.pi_sdk.config.showButtons[index];
};

// 创建设置免密弹窗标签
const createInputBoxElementTag =  (title) => {
    const htmlText = `
        <div class="pi-update-box animated bounceInUp">
            <div class="pi-update-content">
                <div class="pi-pay-title">${title}</div>
                <div class="pi-pay-content">
                    <div>
                        <input class="pi-pay-input" type="password" placeholder="输入密码" name="" id="pi_password">
                    </div>
                </div>
            </div>
            <div class="pi-btns">
                <div class="pi-cancel-btn">取消</div>
                <div class="pi-ok-btn">确定</div>
            </div>
        </div>`;
    const $mask = document.createElement('div');
    $mask.setAttribute('class', 'pi-mask');
    // tslint:disable-next-line:no-inner-html
    $mask.innerHTML = htmlText;

    const $root = document.createElement('div');
    $root.setAttribute('id', 'pi-root');
    $root.appendChild($mask);

    document.querySelector('body').appendChild($root);
};

/**
 * 设置悬浮框按钮模式
 */
const setButtonMod = (buttonMod) => {
    console.log('setButtonMod',buttonMod);
    window.pi_sdk.config.buttonMod = buttonMod;
};

/**
 * 悬浮框按钮样式1初始化
 */
const floatButtonInit = () => {
    console.log('floatButtonInit ---------floatButtonInit');
    const $floatButton = document.createElement('div');
    $floatButton.setAttribute('class','pi-float-button button-mod');
    // tslint:disable-next-line:no-inner-html
    $floatButton.innerHTML = `
    <span class="pi-dot1"></span>
    <span class="pi-dot2"></span>
    <span class="pi-dot1"></span>
    <img src="${window.pi_sdk.config.imgUrlPre}/redSpot.png" class="pi-float-redSpot"/>
    `;
    $floatButton.addEventListener('click',popNewPanel());
    document.querySelector('body').appendChild($floatButton);
  
    dragDom($floatButton);
};
  
  /**
   * 微信小程序按钮样式初始化
   */
const WxButtionInit = () => {
    console.log('~!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!WxButtionInit');
    const $wxBtns = document.createElement('div');
    $wxBtns.setAttribute('class','pi-wx-btns button-mod');
      
    const $wxDots = document.createElement('div');
    $wxDots.setAttribute('class','pi-wx-dots');
    // tslint:disable-next-line:no-inner-html
    $wxDots.innerHTML = `<span class="pi-wx-dot1"></span>
      <span class="pi-wx-dot2"></span>
      <span class="pi-wx-dot1"></span>`;
  
    const $wxCircle = document.createElement('div');
    $wxCircle.setAttribute('class','pi-wx-circle');
    // tslint:disable-next-line:no-inner-html
    $wxCircle.innerHTML = `<div class="pi-wx-circle1">
          <div class="pi-wx-circle2">
          </div>
      </div>`;
  
      // 弹出底部框
    $wxDots.addEventListener('click',popNewPanel());
  
      // 关闭游戏
    const closeItem = getButtonItemById(window.pi_sdk.config.ButtonId.EXITGAME);
    $wxCircle.addEventListener('click',closeItem.clickCb);
  
    $wxBtns.appendChild($wxDots);
    $wxBtns.appendChild($wxCircle);
    document.querySelector('body').appendChild($wxBtns);
  
};
  
  /**
   * 悬浮框按钮样式2初始化
   */
const floatButtonInit2 =  () => {
    console.log('floatButtonInit2 ---------floatButtonInit2');
    const $floatButton = document.createElement('div');
    $floatButton.setAttribute('class','pi-float-button2 button-mod');
    // tslint:disable-next-line:max-line-length
    $floatButton.setAttribute('style','position: absolute;top:133px;right: 0px; width:50px;height:50px;border-radius:50%;border:1px solid rgba(255,255,255,0.2);z-index: 99999;');
    // tslint:disable-next-line:no-inner-html
    $floatButton.innerHTML = `
          <img src="${window.pi_sdk.config.imgUrlPre}wallet_logo.png" style="width:100%;height:100%;border-radius:50%;"/>
          <img src="${window.pi_sdk.config.imgUrlPre}bubble.png" style="border-radius:50%;position: absolute;width:100%;height:100%;top:0;left:0;"/>
      `;
    $floatButton.addEventListener('click',popNewPanel());
    document.querySelector('body').appendChild($floatButton);
    
    dragDom($floatButton);
};

/**
 * 弹出底部面板框
 */
const popNewPanel = () => {
    return throttle(() => {
        const $bottomBox = document.createElement('div');
        $bottomBox.setAttribute('class','pi-bottom-box');
        $bottomBox.addEventListener('click',(e) => {
            e.stopPropagation();
            e.preventDefault();
        });

        window.pi_sdk.config.showButtons.forEach((item,index) => {
            if (!item.show) return;
            const $bottomItem = document.createElement('div');
            $bottomItem.setAttribute('class','pi-bottom-item');
            if (window.pi_sdk.config.isHorizontal) {  // 横屏游戏
                $bottomItem.style.flex = '1 0 0';
                $bottomItem.style.width = '160px';
            }
            $bottomItem.setAttribute('id',item.id);
            let imgUrl = item.img;
            let text = item.text;
            if (item.id === window.pi_sdk.config.ButtonId.FREESECRET) {
                imgUrl = window.pi_sdk.store.freeSecret ? item.startImg : item.closeImg;
                text = window.pi_sdk.store.freeSecret ? item.startText : item.closeText;
            }
          
            // tslint:disable-next-line:no-inner-html
            
            if (item.redSpot) {
                // tslint:disable-next-line:no-inner-html
                $bottomItem.innerHTML = `<div class="pi-img-box">
                <img src="${window.pi_sdk.config.imgUrlPre}${imgUrl}" class="pi-item-img"/>
                <img src="${window.pi_sdk.config.imgUrlPre}/redSpot.png" class="pi-item-redSpot"/>
                </div>
                  <div class="pi-text">${text}</div>`;
            } else {
                // tslint:disable-next-line:no-inner-html
                $bottomItem.innerHTML = `<div class="pi-img-box">
                <img src="${window.pi_sdk.config.imgUrlPre}${imgUrl}" class="pi-item-img"/>
                </div>
                  <div class="pi-text">${text}</div>`;
            }
            $bottomItem.addEventListener('click',() => {
                (throttle(item.clickCb))();
                if (item.clickedClose) {
                    closePopBox();
                }
            });
  
            $bottomBox.appendChild($bottomItem);
        });
        // 获取相关CSS属性
        const getCss = (o,key) => {
            return o.currentStyle ? o.currentStyle[key] : document.defaultView.getComputedStyle(o,<any>false)[key];     
        };
        const bottomBox = document.querySelector('.pi-bottom-box');
        const floatBall = document.querySelector('.pi-float-button');
        const screenWidth = document.documentElement.clientWidth;    // 屏幕宽度
        const floatBallLeft = parseFloat(getCss(floatBall,'left'));
        if (bottomBox) {
            document.querySelector('body').removeChild(bottomBox); 
        } else {
            document.querySelector('body').appendChild($bottomBox);
            $bottomBox.style.top = `${parseFloat(floatBall.style.top ? floatBall.style.top :100) - 5}px`;
        }
        $bottomBox.addEventListener('click',() => {
            // 获取相关CSS属性
            if (floatBallLeft >= screenWidth / 2) {
                // 左侧展开  右侧收回
                $bottomBox.style.left = `${(floatBallLeft - $bottomBox.clientWidth)}px`;
            } else {
                // 右侧展开  左侧收回
                $bottomBox.style.left = `${-floatBallLeft * 2}px`;
            }
            setTimeout(() => {
                document.querySelector('body').removeChild(document.querySelector('.pi-bottom-box'));
            },300);
        });
        requestAnimationFrame(() => {
            $bottomBox.style.top = `${parseFloat(floatBall.style.top) - 5}px`;
            if (floatBallLeft >= screenWidth / 2) {
                // 左侧展开
                $bottomBox.style.left = `${(floatBallLeft - $bottomBox.clientWidth - 18)}px`;
            } else {
                // 右侧展开
                $bottomBox.style.left = `${-floatBallLeft * 2 + 18}px`;
            }
            
        });
  
    });
};

/**
 * 自适应
 */
const browserAdaptive =  () => {
    let cfg = {
        width: 750, height: 1334, wscale: 0, hscale: 0.25, full: false
    };
    if (window.pi_sdk.config.isHorizontal) {  // 横屏游戏
        cfg = {
            width: 1334, height: 750, wscale: 0.25, hscale: 0, full: false
        };
    }
    const clientWidth = document.documentElement.clientWidth;
    const clientHeight = document.documentElement.clientHeight;
    let rootWidth = cfg.width;
    let rootHeight = cfg.height;
    let scaleW = clientWidth / rootWidth;
    let scaleH = clientHeight / rootHeight;
    if (cfg.wscale >= cfg.hscale) {
        // 宽度比例变动
        if (scaleW > scaleH * (cfg.wscale + 1)) {
            // 大于规定的比例
            rootWidth = rootWidth * (cfg.wscale + 1) | 0;
        } else {
            rootWidth = (clientWidth / scaleH) | 0;
        }
        scaleW = scaleH;
    } else {
        // 高度比例变动
        if (scaleH > scaleW * (cfg.hscale + 1)) {
            rootHeight = rootHeight * (cfg.hscale + 1) | 0;
        } else {
            rootHeight = (clientHeight / scaleW) | 0;
        }
        scaleH = scaleW;
    }
    const rootX = (clientWidth - rootWidth) / 2;
    const rootY = (clientHeight - rootHeight) / 2;

    // tslint:disable-next-line:max-line-length
    return `z-index:99999;user-select:none;position: fixed;overflow: hidden;left:${rootX}px;top: ${rootY}px;width:${rootWidth}px;height:${rootHeight}px;-webkit-transform:scale(${scaleW},${scaleH});-moz-transform:scale(${scaleW},${scaleH});-ms-transform:scale(${scaleW},${scaleH});transform:scale(${scaleW},${scaleH});`;
    
};

/**
 * 函数防抖
 */
const throttle = (func) => {
    const intervel = 300;
    let lastTime = 0;

    return  () => {
        const nowTime = + new Date();
        if (nowTime - lastTime > intervel) {
            func && func();
            lastTime = nowTime;
        }
    };
};

/**
 * 拖动悬浮框
 */
const dragDom = (element, callback?) => {
    let nowLeft = -1;
    let disX = 0;
    const screenWidth = document.documentElement.clientWidth;    // 屏幕宽度
    const screenHeigth = document.documentElement.clientHeight;  // 屏幕高度
    const elementWidth = element.clientWidth;
    const elementHeight = element.clientHeight;    
    const params = {
        left: 0,
        top: 0,
        currentX: 0,
        currentY: 0,
        leftLimit: screenWidth - elementWidth,  // 不超出右边界
        topLimit: screenHeigth - elementHeight, // 不超出下边界
        flag: false
    };
    // 获取相关CSS属性
    const getCss = (o,key) => {
        return o.currentStyle ? o.currentStyle[key] : document.defaultView.getComputedStyle(o,<any>false)[key];     
    };
    
    // 拖拽的实现
    if (getCss(element, 'left') !== 'auto') {
        params.left = getCss(element, 'left');
    }
    if (getCss(element, 'top') !== 'auto') {
        params.top = getCss(element, 'top');
    }
    // o是移动对象
    element.ontouchstart = (event) => {
        if (document.querySelector('.pi-bottom-box')) return;
        console.log('onmousedown');
        params.flag = true;
        event = event || window.event;
        params.currentX = event.changedTouches[0].clientX;
        params.currentY = event.changedTouches[0].clientY;
        console.log(`nowleft:${nowLeft}`);
    };
    element.ontouchend = () => {
        console.log('onmouseup');
        if (nowLeft !== -1) {
            nowLeft = nowLeft < screenWidth / 2 ? -elementWidth / 3 :params.leftLimit + (elementWidth / 3);
            element.style.left =  `${nowLeft}px`;
            nowLeft = -1;
        }
        params.flag = false;    
        if (getCss(element, 'left') !== 'auto') {
            params.left = getCss(element, 'left');
        }
        if (getCss(element, 'top') !== 'auto') {
            params.top = getCss(element, 'top');
        }
        callback && callback();
    };
    document.ontouchmove = (event:any) => {
        console.log('onmousemove');
        event = event || window.event;
        // tslint:disable-next-line:one-variable-per-declaration
        const nowX = event.changedTouches[0].clientX, nowY = event.changedTouches[0].clientY;
        // tslint:disable-next-line:one-variable-per-declaration
        disX = nowX - params.currentX;
        const disY = nowY - params.currentY;
        // tslint:disable-next-line:one-variable-per-declaration
        // nowLeft = parseInt(<any>params.left,10) + disX;
        // let nowTop = parseInt(<any>params.top,10) + disY;
        if (params.flag) {
            nowLeft = parseInt(<any>params.left,10) + disX;
            let nowTop = parseInt(<any>params.top,10) + disY;
            nowLeft = nowLeft < 0 ? 0 : (nowLeft > params.leftLimit ? params.leftLimit : nowLeft);
            nowTop = nowTop < 0 ? 0 : (nowTop > params.topLimit ? params.topLimit : nowTop);
            element.style.left =  `${nowLeft}px`;
            element.style.top =   `${nowTop}px`;
        }
        console.log(`nowX : ${nowX},currentX:${ params.currentX},disX:${disX},
        paramleft: ${params.left},nowLeft:${nowLeft}, style.left:${element.style.left}`);
        // setTimeout(() => {
        //     nowLeft = nowLeft < screenWidth / 2 ? 0 :params.leftLimit;
        //     element.style.left =  `${nowLeft}px`;
        // },200);

    };    
};

// =====================================注册登陆==========================
/**
 * 登录
 */
// tslint:disable-next-line:max-func-body-length
export const createSignInStyle = () => {
    const cssText = `
    .signIn_page{
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,0.5);
    }
    .title{
        display: flex;
        align-items: center;
        font-size: 48px;
        color: #fff;
        margin: 100px 70px 0;
    }
    .phoneInput{
        width:500px;
        height:80px;
        position: relative;
    }
    .pi_input_inner{
        appearance:none;
        -moz-appearance:none; /* Firefox */
        -webkit-appearance:none; /* Safari 和 Chrome */
        background-color: #fff;
        background-image: none;
        border-radius: 4px;
        border: none;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        display: inline-block;
        font-size: inherit;
        height: 100%;
        line-height: 40px;
        outline: 0;
        -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
        transition: border-color .2s cubic-bezier(.645,.045,.355,1);
        width: 100%;
        padding: 10px;
        padding-left: 70px;
        color: #222;
        font-size: 32px;
    }
    .pi_input_inner:focus{
        border:3px solid rgba(66,133,244,1);
    }
    .codeBox{
        display: flex;
        margin-top: 20px;
    }
    .codeInput{
        width:300px;
        height:80px;
        position: relative;
    }
    .codeBtn{
        width:190px;
        height:80px;
        background:rgba(48,129,237,1);
        border-radius:4px;
        margin-left: 10px;
        font-size:28px;
        color:rgba(255,255,255,1);
        line-height:80px;
        text-align: center;
    }
    .loginBtn{
        width:500px;
        height:80px;
        margin-top: 20px;
        background:linear-gradient(90deg,rgba(86,204,242,1) 0%,rgba(47,128,237,1) 100%);
        font-size: 32px;
        text-align: center;
        line-height: 80px;
        color: #fff;
    }
    .noticeLog{
        text-align: center;
        height:33px;
        font-size:24px;
        color:rgba(136,136,136,1);
        line-height:33px;
        margin-top: 20px;
        margin-bottom: 80px;
    }
    .row{
        display: flex;
        align-items:center;
        color: #CCCCCC;
        font-size: 24px;
    }
    .divideLine{
        width:200px;
        height:1px;
        background:rgba(136,136,136,1);
        margin: 30px;
    }
    .column{
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .signInImg{
        width: 100px;
        height: 100px;
        margin-bottom: 5px;
    }
    .inputIcon{
        position: absolute;
        top: 25px;
        left: 20px;
        width: 30px;
        height: 30px;
    },
    .tabBar{
        height: 88px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        color: #222;
        box-sizing: border-box;
        }
    .blackImg{
        width: 48px;
        height: 48px;
        margin: 0 15px;
        border: 15px solid transparent;
        line-height: 88px;
    }
    .left-container{
        display: flex;
        font-size: 28px;
        align-items: center;
    }
    `;
    const style = document.createElement('style');
    style.type = 'text/css';
    // tslint:disable-next-line:no-inner-html
    style.innerHTML = cssText;
    document.getElementsByTagName('head')[0].appendChild(style);
};

// 创建注册界面
// tslint:disable-next-line:max-func-body-length
export const createSignInPage = () => {
    const div = document.createElement('div');
    div.setAttribute('style','background-position: center;background-repeat: no-repeat;background-size: cover;background-image: url(http://39.98.200.23/wallet/app/res/image1/haohaiLogin.jpg);width:100%;height:100%;');
    const elem = document.createElement('div');
    elem.classList.add('signIn_page');
    const title = `
    <div class="title">
        <img src="${window.pi_sdk.config.imgUrlPre}/signIn_user.png" style="width: 50px;height:50px;margin-right:5px;"/>
        <span>登录好嗨</span>
    </div>`;
    const content = `
    <div style="display:flex;align-items:center;flex-direction: column;margin-top:80px;">
        <div class="phoneInput">
            <img src="${window.pi_sdk.config.imgUrlPre}/signIn_tel.png" class="inputIcon"/>
            <input type="number" class="pi_input_inner" id="phoneInput" autofocus="autofocus"/>
        </div>
        <div class="codeBox">
            <div class="codeInput">
                <img src="${window.pi_sdk.config.imgUrlPre}/signIn_pwd.png" class="inputIcon"/>
                <input type="number" class="pi_input_inner" id="codeInput"/>
            </div>
            <div class="codeBtn" id="countdown">获取验证码</div>
        </div>
        <div class="loginBtn" id="phoneLogin">登录</div>
        <div class="noticeLog">
            <span>登录即代表您同意</span>
            <span style="color:#4C90F5;" id="userProtocol">《用户协议及隐私服务》</span>
        </div>

        <div class="row">
            <span class="divideLine"></span>
            <span>其它登录</span>
            <span class="divideLine"></span>
        </div>

        <div class="row" style="justify-content: space-around;width: 610px;">
            <div class="column" id="qqLogin">
                <img src="${window.pi_sdk.config.imgUrlPre}/signIn_qq.png" class="signInImg"/>
                <span>QQ登录</span>
            </div>
            <div class="column" id="wxLogin">
                <img src="${window.pi_sdk.config.imgUrlPre}/signIn_wx.png" class="signInImg"/>
                <span>微信登录</span>
            </div>
            <div class="column" id="wbLogin">
                <img src="${window.pi_sdk.config.imgUrlPre}/signIn_wb.png" class="signInImg"/>
                <span>微博登录</span>
            </div>
            <div class="column" id="touristLogin">
                <img src="${window.pi_sdk.config.imgUrlPre}/signIn_tourist.png" class="signInImg"/>
                <span>游客登录</span>
            </div>
        </div>
    </div>
    `;
    const inAndroid = `一.总则
    1.1 本《隐私政策及用户协议》为您（即用户）与仙之侠道游戏（以下简称仙之侠道）就仙之侠道所提供的服务达成的协议。仙之侠道在此特别提醒您认真阅读、充分理解本《协议》:用户应认真阅读、充分理解本《协议》中各条款，特别涉及免除或者限制仙之侠道责任的免责条款，对用户的权利限制的条款，法律适用、争议解决方式的条款。如果您未满18周岁，请在法定监护人的陪同下阅读本《协议》。
    1.2 请您审慎阅读并选择同意或不同意本《协议》，除非您接受本《协议》所有条款，否则您无权以下载、安装、升级、登录、显示、运行、截屏等方式使用本软件及其相关服务。您的下载、安装、显示、账号获取和登录、截屏等行为表明您自愿接受本协议的全部内容并受其约束，不得以任何理由包括但不限于以未能认真阅读本协议等作为纠纷抗辩理由。
    1.3 仙之侠道有权不定期对本《协议》进行必要的更新，更新后的协议条款一旦公布即代替原来的协议条款，您可在应用内相关页面查看最新版协议条款。在仙之侠道修改《协议》条款后，如果您不接受更新后的条款，请立即停止使用仙之侠道提供的软件和服务，您继续使用仙之侠道提供的软件和服务将被视为已接受了更新后的协议。
    1.4 本《协议》内容包括但不限于本协议以下内容，针对某些具体服务所约定的管理办法、公告、重要提示、指引、说明等均为本协议的补充内容，为本协议不可分割之组成部分，具有与本协议同等的法律效力，接受本协议即视为您同时接受以上管理办法、公告、重要提示、指引、说明等并受其约束；否则请您立即停止使用仙之侠道提供的软件和服务。
    
    
    
    二、定义 
    2. 1仙之侠道：本协议下文中，“仙之侠道”即指仙之侠道应用软件。
    2. 2用户：
    （1）用户必须是具备完全民事行为能力的自然人；
    （2）若您为18周岁以下的未成年人使用仙之侠道服务，需要在您父母或监护人的指导下使用仙之侠道。无民事行为能力人使用仙之侠道或限制民事行为能力人超过其民事权利或行为能力范围从事交易的，造成的一切后果，仙之侠道有权要求您及您的父母或监护人负责。
    2.3游戏规则：指仙之侠道游戏服务提供方不时发布并修订的关于仙之侠道游戏的用户守则、玩家条例、游戏公告、提示及通知等内容。
    2.4 仙之侠道游戏服务：指仙之侠道向您提供的与游戏相关的各项在线运营服务。
    2.5 您：又称“玩家”或“用户”，指被授权使用仙之侠道应用及其服务的自然人。
    2.6 创建或导入钱包：指您使用仙之侠道，确认履行本协议并创建或导入钱包的过程。在您的这台移动设备或仙之侠道的服务器，一旦丢失你需要借助明文私钥或助记词重置新密码。
    2.8信息提示：仙之侠道软件操作界面涉及的信息提示内容，建议用户按照相关步骤进行操作。
    2.9私钥：由256位随机字符构成，是用户拥有并使用数字代币的核心。
    2.10公钥：由私钥借助密码学原理单向推导生成，并用以生成数字货币地址，数字货币地址即为公开收款地址。
    2.11助记词：符合区块链BIP39 行业标准，由随机算法生成的12（或15/18/21/24）个有序单词组成。是私钥的易记录表现形式，方便用户备份保管。
    2.12个人信息：指以电子或者其他方式记录的能够单独或者与其他信息结合识别用户个人身份的各种信息，包括但不限于自然人的姓名、出生日期、身份证件号码、个人生物识别信息、住址、电话号码、银行卡号、邮件地址、钱包地址、移动设备信息、操作记录、交易记录等，但不包括用户的钱包密码、私钥、助记词、Keystore。
    2.13服务数据：指您在使用仙之侠道软件过程中产生的被服务器记录的各种数据，包括但不限于角色数据、虚拟物品数据、行为日志、购买日志等等数据。
    
    三、账号
    3.1您如果需要使用并享受仙之侠道应用中的游戏及其他服务，则您需要注册仙之侠道账号作为游戏及其他服务使用账号。如个人资料有任何变动，必须及时更新。因用户提供个人资料不准确、不真实而引发的一切后果由用户承担。
    3.2 仙之侠道账号的所有权归仙之侠道，用户完成注册申请手续后，获得仙之侠道账号的使用权。
    3.3您进一步知悉并同意，用户应当为自身注册帐户下的一切行为负责，因用户行为而导致的用户自身或其他任何第三方的任何损失或损害，仙之侠道不承担责任。
    3.4您进一步知悉并同意，您在游客模式下可能无法进行游戏充值或消费。且一旦您卸载或重装仙之侠道，或您更换手机、电脑等终端设备或该等终端设备损坏的，您在该游客模式下所有游戏相关数据可能都将会被清空，且无法查询和恢复。如因此造成您任何损失的，均由您自行承担。
    3.5您充分理解并同意，仙之侠道有权审查用户注册所提供的信息是否真实、有效，并应积极地采取技术与管理等合理措施保障用户账号的安全、有效；用户有义务妥善保管其账号及密码，并正确、安全地使用其账号及密码，若您丢失账号及密码，仙之侠道不提供账号和密码找回服务。
    3.6您理解并同意，您不得将游戏账号以任何方式提供给他人使用，包括但不限于不得以转让、出租、借用等方式提供给他人作包括但不限于代打代练等商业性使用。否则，因此产生任何法律后果及责任均由您自行承担，且仙之侠道有权对您的游戏账号采取包括但不限于警告、限制或禁止使用游戏帐号全部或部分功能、删除游戏账号及游戏数据及其他相关信息、封号直至注销的处理措施，因此造成的一切后果由您自行承担。
    
    
    四、用户信息收集、使用及保护
    4.1您同意并授权仙之侠道为履行本协议之目的收集您的用户信息，这些信息包括您系统中注册的信息、您游戏账号下的游戏数据以及其他您在使用软件服务的过程中向仙之侠道基于安全、用户体验优化等考虑而需收集的信息，仙之侠道对您的用户信息的收集将遵循本协议及相关法律的规定。
    4.2您充分理解并同意：仙之侠道可以根据您的用户信息，通过短信、电话、邮件等各种方式向您提供关于仙之侠道游戏的活动信息、推广信息等各类信息。
    4.3您理解并同意：为了更好地向您提供游戏服务，改善游戏体验，仙之侠道可对您游戏帐号中的昵称、头像以及在仙之侠道中的相关操作信息、游戏信息等信息（以下称“该等信息”。该等信息具体包括但不限于您的登录状态、对战信息/状态、成就信息等）进行使用，并可向您本人或其他用户或好友展示该等信息。
    4.4您应对通过仙之侠道游戏及相关服务了解、接收或可接触到的包括但不限于其他用户在内的任何人的个人信息予以充分尊重，您不应以搜集、复制、存储、传播或以其他任何方式使用其他用户的个人信息，否则，由此产生的后果由您自行承担。
    
    
    五.仙之侠道服务说明
    5.1仙之侠道对用户提供服务包括但不限于授权用户通过其账号进行在线游戏、即时通讯、添加好友、加入小组、发布评论、登录及使用充值服务。仙之侠道可以对其提供的所有服务予以变更、增加或强化，包括所推出的新功能，均受到本协议之规范。
    5.2仙之侠道所有产品和服务上可能包含了指向第三方网站的链接（以下简称“第三方网站”）。“第三方网站”非由仙之侠道控制，对于任何“第三方网站”的内容，包含但不限于“第三方网站”内含的任何链接，或“第三方网站”的任何改变或更新，仙之侠道均不予负责。“第三方网站”接收的网络传播或其它形式之传送，仙之侠道不予负责。
    5.3仙之侠道所有产品和服务上可能包含了指向第三方API服务。第三方API服务非由仙之侠道控制。对于任何通过第三方API进行的服务，在您使用仙之侠道集成的第三方API服务时，请您仔细阅读本协议及APP提示，了解交易或服务对象及产品信息，谨慎评估风险后再采取行动。所有您在第三方API进行的操作行为系您的个人行为，有约束力的合同关系在您和您的相对方之间建立，与仙之侠道无关。仙之侠道对因您的交易行为所引起的一切风险、责任、损失、费用不承担任何责任。
    5.4在任何情况下，仙之侠道不对因不可抗力导致的您在使用仙之侠道服务过程中遭受的损失承担责任。该等不可抗力事件包括但不限于国家法律、法规、政策及国家机关的命令及其他政府行为或者其它的诸如地震、水灾、雪灾、火灾、海啸、台风、罢工、战争等不可预测、不可避免且不可克服的事件。
    5.5仙之侠道可能因游戏软件BUG、版本更新缺陷、第三方病毒攻击或其他任何因素导致您的游戏角色、游戏道具、游戏装备及游戏币等账号数据发生异常。在数据异常的原因未得到查明前，仙之侠道有权暂时冻结该游戏账号；若查明数据异常为非正常游戏行为所致，仙之侠道有权恢复游戏账号数据至异常发生前的原始状态（包括向第三方追回被转移数据），且仙之侠道无须向您承担任何责任。
    5.6针对仙之侠道钱包服务，仙之侠道对以下情形不承担责任：
    （1）因用户遗失移动设备、删除且未备份仙之侠道、删除且未备份钱包、钱包被盗或遗忘钱包密码、私钥、助记词、Keystore而导致的数字代币丢失；
    （2）因用户自行泄露钱包密码、私钥、助记词、Keystore，或借用、转让或授权他人使用自己的移动设备或仙之侠道钱包，或未通过仙之侠道官方渠道下载仙之侠道应用程序或其他不安全的方式使用仙之侠道应用程序导致的数字代币丢失；
    5.7您充分理解并同意，为高效利用服务器资源，如果您长期未使用游戏账号登录仙之侠道，仙之侠道有权视需要，在提前通知的情况下，对该账号及其账号下的游戏数据及相关信息采取删除等处置措施，上述处置可能导致您对该游戏账号下相关权益的丧失，对此仙之侠道不承担任何责任。
    5.8仙之侠道自行决定终止运营仙之侠道游戏及其他服务时，仙之侠道会按照文化部有关网络游戏终止运营的相关规定处理游戏及其他服务终止运营相关事宜，以保障用户合法权益。
    5.9您理解并接受仙之侠道提供的服务中可能包括广告，同意在使用服务的过程中显示仙之侠道和第三方供应商、合作伙伴提供的广告。
    
    六、用户行为规范
     用户在使用仙之侠道服务过程中，必须遵循以下原则：
    6.1 遵守中国有关的法律和法规；
    6.2 遵守所有与网络服务有关的网络协议、规定和程序；
    6.3 不得为任何非法目的而使用网络服务系统；
    6.4 不得利用仙之侠道服务系统进行任何可能对互联网或移动网正常运转造成不利影响的行为；
    6.5 不得利用仙之侠道提供的服务上传、展示或传播任何虚假的、骚扰性的、中伤他人的、辱骂性的、恐吓性的、庸俗淫秽的或其他任何非法的信息资料；
    6.6 不得侵犯仙之侠道和其他任何第三方的专利权、著作权、商标权、名誉权或其他任何合法权益；
    6.7 不得利用仙之侠道服务系统进行任何不利于仙之侠道的行为；
    6.8不得利用任何相关系统漏洞或服务漏洞，包括但不限于仙之侠道的系统或服务漏洞、仙之侠道相关合作方的系统或服务漏洞，作出损害仙之侠道合法权益的行为；
    6.9对游戏软件进行反向工程、反向汇编、反向编译或者以其他方式尝试发现软件的源代码；
    6.10对游戏软件或者软件运行过程中释放到任何终端内存中的数据、软件运行过程中客户端与服务器端的交互数据，以及软件运行所必需的系统数据，进行复制、修改、增加、删除、挂接运行或创作任何衍生作品，形式包括但不限于使用插件、外挂或非经合法授权的第三方工具/服务接入软件和相关系统；
    6.11 如发现任何非法使用用户账号或账号出现安全漏洞的情况，应立即通告仙之侠道。
    6.12 如用户在使用仙之侠道服务时违反相关法律规定或者本协议的任何约定，仙之侠道或其授权人有权采取包括但不限于下列措施：
    1.要求用户改正相关行为；
    2.变更、中断、终止用户使用仙之侠道的服务；
    3.对用户的账号采取临时性或永久性的禁止登录（即封号）措施等。
    
    七、知识产权 
    7.1 仙之侠道提供的服务中包含的任何文本、图片、图形、音频和/或视频资料均受版权、商标和/或其它财产所有权法律的保护，未经相关权利人同意，上述资料均不得用于任何商业目的。
    7.2 仙之侠道为提供服务而使用的任何软件（包括但不限于软件中所含的任何图像、照片、动画、录像、录音、音乐、文字等）的一切权利均属于该软件的著作权人，未经该软件的著作权人许可，用户不得对该软件进行反向工程（reverse engineer）、反向编译（decompile）或反汇编（disassemble），不得进行任何有可能损害著作权人合法权益的行为。
    
    八、隐私声明
    8.1 保护用户隐私是仙之侠道的一项基本政策，仙之侠道保证不对外公开或向第三方提供单个用户的注册资料及用户在使用本服务时存储在仙之侠道的非公开内容，但下列情况除外：
    （1） 事先获得用户的明确授权；
    （2） 根据有关的法律法规要求；
    （3） 按照相关政府主管部门的要求；
    （4） 为维护社会公众的利益；
    （5）为维护仙之侠道的合法权益。
    8.2仙之侠道制定了以下三项隐私权保护原则，指导我们如何来处理产品中涉及到用户隐私权和用户信息等方面的问题：
    （1） 利用我们收集的信息为用户提供有价值的产品和服务。
    （2） 开发符合隐私权标准和隐私权惯例的产品。
    （3） 尽最大的努力保护我们掌握的信息。
    8.3仙之侠道非常重视对未成年人个人信息的保护。若您是18周岁以下的未成年人，在使用仙之侠道服务前，应事先取得您家长或法定监护人的同意。
    
    九、资费说明
    9.1 仙之侠道在提供产品和服务时，可能会对部分产品和服务向用户收取一定的费用。在此情况下，仙之侠道会在相关页面上做明确的提示。
    9.2仙之侠道有权决定所提供的产品和服务的资费标准和收费方式，仙之侠道可能会就不同的产品和服务制定不同的资费标准和收费方式，也可能按照仙之侠道所提供的产品和服务的不同阶段确定不同的资费标准和收费方式。另外，仙之侠道有权利根据市场实际情况修改资费政策。仙之侠道会将有关产品和服务的收费信息以及与该产品和服务有关的资费标准、收费方式、购买方式或其他有关资费政策的信息放置在该产品和服务相关网页的显著位置。
    9.3对于仙之侠道的收费产品和服务，用户可自主选择接受或拒绝该收费产品或服务，并保证在使用收费产品或服务时，将按照仙之侠道的相关收费规定支付费用。
    9.4除非法律另有明文规定，否则用户不得要求仙之侠道返还用户已经支付予仙之侠道游戏的任何资费（以下简称“退款”），无论该等资费是否已被消费。仙之侠道有权决定是否、何时、以何种方式向用户退款。仙之侠道同意退款的，用户应补偿支付时使用信用卡、手机等支付渠道产生的费用，仙之侠道有权在返还用户的资费中直接扣收。存在下列情况之一的，仙之侠道有权不予退款：
    1.用户已经消费的资费部分，不予退款；
    2.用户存在违反本协议约定的行为的，仙之侠道有权不予退款；
    （3）仙之侠道在产品和服务提供过程中赠送的充值金额、虚拟货币、虚拟道具等，不予退款或变现。
    
    十、免责条款
    10.1 用户之间因线上游戏行为所发生或可能发生的任何心理、生理上的伤害和经济上的损失，仙之侠道不承担任何责任。
    10.2 用户因其个人原因造成账号资料保管不妥而导致个人信息数据被他人泄露或账号中虚拟财产、游戏道具被盗或损失的，仙之侠道不承担任何责任。
    10.3 用户因除了按游戏规则进行游戏的行为外的其他行为触犯了中华人民共和国法律法规的，责任自负，仙之侠道不承担任何责任。
    10.4 用户账号长期不使用的，仙之侠道有权进行回收，因此带来的用户个人信息数据丢失、账户内虚拟财产和游戏道具清零等一切损失由用户个人承担，仙之侠道不承担任何责任。
    10.5基于网络环境的复杂性，仙之侠道不担保服务一定能满足用户的要求，不保证各项服务完全无错误、无缺陷、不会中断、或不会受到任何来自他方因素的干扰及损害等，对服务的及时性、安全性也不作担保。因网络安全、网络故障问题和其他用户的非法行为给用户造成的损失，仙之侠道不承担任何责任。
    10.6 基于网络环境的特殊性，仙之侠道不担保对用户限制性行为和禁止性行为的判断的准确性，用户因此产生的任何损失仙之侠道不承担任何责任，用户可按仙之侠道相关规定进行申诉解决。
    10.7 仙之侠道不保证您从第三方获得的仙之侠道虚拟货币、游戏道具等游戏物品能正常使用，也不保证该等物品不被索回，因私下购买虚拟货币、游戏道具等游戏物品所产生的一切损失均由用户自行承担，仙之侠道不承担任何责任。
    10.8用户在使用仙之侠道服务时，必须遵守中华人民共和国相关法律法规的规定，用户同意将不会利用本服务进行任何违法或不正当的活动，包括但不限于下列行为∶
    上传、展示、张贴、传播或以其它方式传送含有下列内容之一的信息：
       （1）反对宪法所确定的基本原则的；
       （2）危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；
       （3）损害国家荣誉和利益的；
       （4）煽动民族仇恨、民族歧视、破坏民族团结的；
       （5）破坏国家宗教政策，宣扬邪教和封建迷信的；
       （6）散布谣言，扰乱社会秩序，破坏社会稳定的；
       （7）散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；
       （8）侮辱或者诽谤他人，侵害他人合法权利的；
       （9）含有虚假、有害、胁迫、侵害他人隐私、骚扰、侵害、中伤、粗俗、猥亵、或其它道德上令人反感的内容；
       （10）含有中国法律、法规、规章、条例以及任何具有法律效力之规范所限制或禁止的其它内容的或以任何方式危害他人的合法权益。
    10.9用户违反本协议的约定或相关的服务条款的规定，导致或产生的任何第三方主张的任何索赔、要求或损失，包括合理的律师费，您同意赔偿仙之侠道与合作公司、关联公司，并使之免受损害。对此，仙之侠道有权视用户的行为性质，采取包括但不限于下列一项或多项措施：（1）删除用户发布信息内容；（2）暂停或终止使用许可；（3）暂停或终止服务；（4）限制或禁止使用账号（封号）；（5）回收账号；（6）追究法律责任等。因上述措施所导致的用户帐号内相关游戏道具（包括但不限于游戏虚拟货币、游戏装备等）、信息数据等过期或者失效等后果，由用户自行承担。同时，仙之侠道会按照司法部门的要求，协助司法调查。
    
    
    十一、未成年人使用条款及健康游戏忠告
    11.1 未成年人用户必须遵守全国青少年网络文明公约：
    要善于网上学习，不浏览不良信息；要诚实友好交流，不侮辱欺诈他人；要增强自护意识，不随意约会网友；要维护网络安全，不破坏网络秩序；要有益身心健康，不沉溺虚拟时空。
    11.2根据国家新闻出版总署关于健康游戏的忠告，仙之侠道提醒您：抵制不良游戏，拒绝盗版游戏；注意自我保护，谨防受骗上当；适度游戏益脑，沉迷游戏伤身。
    
    十二、法律适用及争议解决 
    12.1 本协议适用中华人民共和国大陆地区法律。
    12.2 因本协议引起的或与本协议有关的任何争议，各方应友好协商解决；协商不成的，任何一方均可将有关争议向仙之侠道公司所在地人民法院提起诉讼。
    
    十三、其他条款 
    13.1 如果本协议中的任何条款无论因何种原因完全或部分无效或不具有执行力，或违反任何适用的法律，则该条款被视为删除，但本协议的其余条款仍继续有效并且有约束力。
    13.2 仙之侠道在法律允许范围内对本协议拥有解释权与修改权。
    仙之侠道团队
    2019年4月`;

    const inIOS = `尊敬的用户：
    好嗨非常重视对用户的个人隐私保护，尊重并保护用户（以下简称“您”或“用户”）的隐私，我们将按照本隐私政策(以下称“本政策”)收集、使用、共享和保护用户的个人信息。在用户使用好嗨产品及服务前，请用户仔细阅读并全面了解本政策。如果用户是未成年人，用户的监护人需要仔细阅读本政策并同意用户依照本政策使用我们的产品及服务。当用户浏览、访问好嗨及使用好嗨产品或服务时，即表示用户已经同意我们按照本政策来收集、使用、共享和保护用户的个人信息。我们收集、使用、共享和保护用户的个人信息，是在遵守国家法律法规规定的前提下，出于向用户提供好嗨产品及服务并不断提升产品及服务质量的目的，包括但不限于支持我们开展好嗨产品及服务相关的市场活动、完善现有产品及服务功能、开发新产品或新服务。请注意我们不时地会检查我们的政策，因此有关的措施会随之变化。请用户定期查看本页面，以确保对我们《隐私政策》最新版本始终保持了解。如果您不接受修改后的条款，请立即停止使用好嗨，您继续使用好嗨将被视为接受修改后的政策。经修改的政策一经在好嗨上公布，立即自动生效。
    
    好嗨建议您在使用本产品之前仔细阅读并理解本政策全部内容。
    
    一、 我们收集您的哪些信息
    请您知悉，我们收集您的以下信息是出于满足您在好嗨服务需要的目的，且我们十分重视对您隐私的保护。在我们收集您的信息时，将严格遵守“合法、正当、必要”的原则。且您知悉，若您不提供我们服务所需的相关信息，您在好嗨的服务体验可能因此而受到影响。
    1.我们将收集您的移动设备信息、操作记录、账号地址等个人信息。
    2. 为满足您的特定服务需求，我们将收集您的姓名、手机号码、邮件地址等信息。
    3.请您知悉：您在好嗨上的密码并不存储或同步至好嗨服务器。好嗨不提供找回您密码的服务。
    4. 除上述内容之外，您知悉在您使用好嗨特定功能时，我们将在收集您的个人信息前向您作出特别提示，要求向您收集更多的个人信息。如您选择不同意，则视为您放弃使用好嗨该特定功能。
    5. 在法律法规允许的范围内，好嗨可能会在以下情形中收集并使用您的个人信息无需征得您的授权同意：
    （1） 与国家安全、国防安全有关的；
    （2） 与公共安全、公共卫生、重大公共利益有关的；
    （3） 与犯罪侦查、起诉、审判和判决执行等有关的；
    （4） 所收集的个人信息是您自行向社会公众公开的；
    （5）从合法公开披露的信息中收集您的个人信息，如合法的新闻报道，政府信息公开等渠道；
    （6）用于维护服务的安全和合规所必需的，例如发现、处理产品和服务的故障；
    （7） 法律法规规定的其他情形。
    6. 我们收集信息的方式如下：
    （1） 您向我们提供信息。例如，您在“个人中心”页面中填写姓名、手机号码，或在反馈问题时提供邮件地址，或在使用我们的特定服务时，您额外向我们提供。
    （2）我们在您使用好嗨的过程中获取信息，包括您移动设备信息以及您对好嗨的操作记录等信息；
    
    二、 我们如何使用您的信息
    1. 我们将向您及时发送重要通知，如软件更新、用户协议及本政策条款的变更。
    2. 我们通过收集您公开的钱包地址和提供的移动设备信息来处理您向我们提交的反馈。
    3. 我们收集您的个人信息进行好嗨内部审计、数据分析和研究等，以期不断提升我们的服务水平。
    4. 依照《好嗨用户协议》及好嗨其他有关规定，好嗨将利用用户信息对用户的使用行为进行管理及处理。
    5. 法律法规规定及与监管机构配合的要求。
    
    三、 您如何控制自己的信息
    您在好嗨中拥有以下对您个人信息自主控制权：
    1. 您可以通过同步账号的方式，将您的其他账号导入好嗨中，或者将您在好嗨的账号导入到其他数字代币管理钱包中。好嗨将向您显示导入账号的信息。
    3. 您知悉在好嗨“我”的版块您可以自由选择进行如下操作：
    （1） 在“通讯录”中，您可以随时查看并修改您的“联系人”；
    （3） 在“我的信息”中，您并不需要提供自己的手机号码等信息，但当您使用特定服务时，您需要提供以上信息；
    4. 请您知悉当我们出于特定目的向您收集信息时，我们会提前给予您通知，您有权选择拒绝。但同时您知悉，当您选择拒绝提供有关信息时，即表示您放弃使用好嗨的有关服务。
    5. 请您知悉，您及我们对于您交易记录是否公开并没有控制权，因为基于区块链交易系统的开源属性，您的交易记录在整个区块链系统中公开透明。
    6.  您有权要求我们更新、更改、删除您的有关信息。
    7. 您知悉我们可以根据本政策第一条第6款的要求收集您的信息而无需获得您的授权同意。
    
    
    四、 信息的安全及保护
    好嗨将采用严格的安全制度以及行业通行的安全技术和程序来确保用户的个人信息不丢失、泄露、毁损或被滥用和变造;我们将使用安全技术和程序，来保护用户的个人信息不被未经授权的访问、使用;我们的员工及服务外包人员将受到保密协议的约束，同时还将受到数据信息的权限控制和操作监控。
    
    请用户注意，任何安全系统都存在可能的及未知的风险。请用户理解，由于技术的限制以及风险防范的局限，即便我们已经尽量加强安全措施，也无法始终保证信息百分之百的安全。用户需要了解，用户接入产品服务所用的系统和通讯网络，有可能因我们可控范围外的情况而发生问题。
    
    
    1. 如好嗨停止运营，好嗨将及时停止继续收集您个人信息的活动，将停止运营的通知公告在好嗨上，并对所持有的您的个人信息在合理期限内进行删除或匿名化处理。
    2. 为了保护您的个人信息，好嗨将采取数据安全技术措施，提升内部合规水平，增加内部员工信息安全培训，并对相关数据设置安全访问权限等方式安全保护您的隐私信息。
    
    
    五、 内容规范
    1. 用户在使用好嗨服务中发布的任何内容、信息等并不反映或代表好嗨的观点、立场或政策，好嗨对此不承担任何责任。
    2.用户不得利用好嗨帐号或本服务制作、上载、复制、发布、传播如下法律、法规和政策禁止的内容：
    （1）反对宪法所确定的基本原则的；
    （2）危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；
    （3）损害国家荣誉和利益的；
    （4）煽动民族仇恨、民族歧视，破坏民族团结的；
    （5）破坏国家宗教政策，宣扬邪教和封建迷信的；
    （6）散布谣言，扰乱社会秩序，破坏社会稳定的；
    （7）散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；
    （8）侮辱或者诽谤他人，侵害他人合法权益的；
    （9）不遵守法律法规底线、社会主义制度底线、国家利益底线、公民合法权益底线、社会公共秩序底线、道德风尚底线和信息真实性底线的“七条底线”要求的；
    （10）含有法律、行政法规禁止的其他内容的信息。
    3. 用户不得利用好嗨帐号或服务制作、上载、复制、发布、传播如下干扰好嗨正常运营，以及侵犯其他用户或第三方合法权益的内容：
    （1）含有任何性或性暗示的；
    （2）含有辱骂、恐吓、威胁内容的；
    （3）含有骚扰、垃圾广告、恶意信息、诱骗信息的；
    （4）涉及他人隐私、个人信息或资料的；
    （5）侵害他人名誉权、肖像权、知识产权、商业秘密等合法权利的；
    （6）含有其他干扰本服务正常运营和侵犯其他用户或第三方合法权益内容的信息；
    4. 好嗨仅为用户提供服务，用户必须为自己注册帐号下发生一切行为负责，包括因您所传送至好嗨的任何内容、信息等所导致的不利后果，该等不利后果包括但不限于赔偿、罚款、司法/仲裁程序费用、律师费、合理支出、给好嗨造成的损害等。用户应对好嗨上其他注册用户发布的内容自行加以判断，并承担因使用该内容而给自己、他人及社会造成的法律责任，包括但不限于因对内容的准确性、真实性、完整性或实用性等的依赖而产生的风险。 
    5. 好嗨对用户上传的所有信息的真实性、合法性、无害性、有效性等不负任何单独或连带之保证责任，用户因其所传播的信息而引发的相关法律责任由用户自行承担。 
    6. 好嗨是一个基于用户关系网的点对点信息服务平台，用户不得冒充他人或利用他人的名义传播任何信息，不得恶意使用注册帐号导致其他用户误认。否则，好嗨有权立即停止提供服务，注销用户的好嗨帐号，用户应自行承担由此而产生的一切法律责任。 
    7. 根据合理判断，好嗨可以对违反法律法规、本《协议》约定，侵犯、妨害、威胁他人权利的内容，或者假冒他人名义发布的内容，依法采取停止传输、下线等措施，并有权依合理判断对违反本条款的用户采取适当的法律行动，包括但不限于：从好嗨服务中保全具有违法性、侵权性、不当性等内容、限制或禁止用户使用好嗨全部或部分服务、注销用户帐户以及依据法律法规保存有关信息并向有关部门报告等.
    
    
    
    六、 其他
    1. 如您是中华人民共和国以外的用户，您需全面了解并遵守您所在司法辖区与使用好嗨服务所有相关法律、法规及规则。
    2. 您在使用好嗨服务过程中，如遇到任何有关个人信息使用的问题，您可以通过在好嗨提交反馈等方式联系我们。
    3. 我们会适时修改本《隐私政策》的条款，该等修改构成本《隐私政策》的一部分。在该种情况下，如用户仍然继续使用产品服务的，即表示同意受经修订的本《隐私政策》的约束。我们鼓励用户在每次使用产品服务时都查阅我们的隐私政策。
    最后，用户必须对用户的账号和密码信息负有保密义务。任何情况下，请小心妥善保管。
    
    好嗨团队 
    2018年8月20日`;
    const userDiv = `
    <div style="position: absolute;left: 0;top: 0;bottom: 0;right: 0;background-color: #f9f9f9;display:none" id="usersProtocol">
    <div class="title"></div>
        <div class="tabBar">
            
            <div class="left-container" on-down="onShow">
                <img class="blackImg" id="backLogin" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAB4UlEQVRoQ+3Xv0vDQBQH8Pdad8Glpup/4NCWouAgToLo5j/gqpNNO7RTq4NOqf4N/gFuKqirk9pEXB0EoamDkyAoNk8iVIo1TS6/+k7SNce77+derpdDkPyHkueHBDDqDiYd+HcdyGvmJiBVgeAJsbvRUmceokSG+grltHYNAfZ+AiMc62p2XQrAQHgAQMSTlqqssQf8FZ4AXtMpWLotZVusAU7hx1LplZtS5irK8HbtQHtg1OEDATiE9w3gEt4XgFN4YQC38EIAjuE9A7iG9wTgHN4VkG92qkDWfv9hZJ+wcR1SXg5Bx4NMhvCOHchpZh2BGpxXvpdtoAMFrbNNYB14aV9sYxDeAPBIVye3AJD65x0A5LT2CwJMxBZOYCKi9LJRyVwMBRQ0856AZgXqxjbUEyDfbBfBgktAGI8tmdtEIq+QXavYNOe6Fp3/RhBgwygrO27zxfnc8W9UFsTQC40MCNcbGXeEK4D7nvAE4IzwDOCKEAJwRAgDuCF8ATghfAO4IAIBOCACA1wQq0ZZOY3y2ygUgCOCaFevTNWlAPQQn0Rn3xci+xOYrAW9PH0nDcAOOn/4nHnvWovwAddGTXmMMrzjpT7qScOsH9oeCDOUSK0EILJaUYxNOhDFqorU/AIpGydApy3+CAAAAABJRU5ErkJggg==" w-class="ga-back" />
                <span on-tap="backPrePage"  style="color: fff">用户协议及隐私服务</span>
            </div>
        </div>
        <div style="height: 100%;overflow-x: hidden;overflow-y: auto;-webkit-overflow-scrolling: touch;scroll-behavior: smooth;">
            <div style="font-size: 28px;margin: 30px 20px;white-space: pre-wrap;background: #ffffff;border-radius: 12px;padding: 60px 30px;">${navigator.userAgent.indexOf('YINENG_ANDROID') >= 0 ? inAndroid :inIOS}</div>
            <div style="height: 128px;"></div>
        </div>   
    </div>`;
    
    // tslint:disable-next-line:no-inner-html
    elem.innerHTML = window.pi_sdk.config.isHorizontal ? content :(title + content + userDiv);
    const piRoot = document.createElement('div');
    piRoot.classList.add('pi-root');
    piRoot.appendChild(div);
    piRoot.appendChild(elem);
    document.body.appendChild(piRoot);

    document.querySelector('#phoneInput').addEventListener('input',phoneChange);
    document.querySelector('#phoneInput').addEventListener('keyup',phoneKeyup);
    document.querySelector('#countdown').addEventListener('click',getCode);
    document.querySelector('#phoneLogin').addEventListener('click',phoneLogin);
    document.querySelector('#wxLogin').addEventListener('click',wxLogin);
    document.querySelector('#qqLogin').addEventListener('click',qqLogin);
    document.querySelector('#wbLogin').addEventListener('click',wbLogin);
    document.querySelector('#touristLogin').addEventListener('click',touristLogin);
    document.querySelector('#userProtocol').addEventListener('click',userProtocol);
    document.querySelector('#backLogin').addEventListener('click',backPrePage);
};

// 手机号输入
const phoneChange = (e) => {
    const phone = e.target.value;
    if (phone.length > 11) {
        document.querySelector('#phoneInput').value = phone.substr(0, 11);
    }
};
const phoneKeyup = (e) => {
    const phone =  e.target.value;
    console.log(phone);
    document.querySelector('#phoneInput').value = phone.replace(/\D/g,'');
};

// 获取验证码倒计时
let codeTimer = null;
// 获取验证码
const getCode = () => {
    if (codeTimer) {
        return;
    }
    const phone = document.querySelector('#phoneInput').value;
    const reg = /^[1][3-8]\d{9}$|^([6|9])\d{7}$|^[0][9]\d{8}$|^[6]([8|6])\d{5}$/;
    if (!phone || !reg.test(phone)) {
        popNewMessage('无效的手机号');
        
        return; 
    }
    let countdown = 60;
    document.querySelector('#countdown').innerHTML = `${countdown}s 重新获取`;

    codeTimer = setInterval(() => {
        countdown--;
        document.querySelector('#countdown').innerHTML = `${countdown}s 重新获取`;
        if (countdown <= 0) {
            document.querySelector('#countdown').innerHTML = `获取验证码`;
            codeTimer && clearInterval(codeTimer);
        }
    },1000);
    console.log('sendCode start');
    window.pi_sdk.pi_RPC_Method(window.pi_sdk.config.jsApi, 'sendCode', phone, (error, res) => {
        console.log(`获取验证码 ${error} ${res}`);
    });
    
};

export enum UserType {
    wallet= 0,  // 钱包
    tel= 1,     // 手机号
    wx= 2,      // 微信
    tourist= 3  // 游客
}

// 手机号登录
const phoneLogin = () => {
    const phone = document.querySelector('#phoneInput').value;
    const code = document.querySelector('#codeInput').value;
    if (!phone) {
        popNewMessage('请输入手机号');

        return;
    }
    if (!code) {
        popNewMessage('请输入验证码');

        return;
    }
    popNewLoading('登录中');
    window.pi_sdk.pi_RPC_Method(window.pi_sdk.config.jsApi, 'thirdManualLogin', {
        userType:UserType.tel,
        user:phone,
        pwd:code
    }, (error, res) => {
        closePopBox();
        if (error) {
            popNewMessage('登录失败');
        } else {
            popNewMessage('登录成功');
            closeSigninPage();
        }
    });
};

// 微信登录
const wxLogin = () => {
    popNewLoading('登录中');
    window.pi_sdk.pi_RPC_Method(window.pi_sdk.config.jsApi, 'wechatLogin', undefined,(error, res) => {
        closePopBox();
        if (error) {
            popNewMessage('登录失败');
        } else {
            popNewMessage('登录成功');
            closeSigninPage();
        }
    });
};

// 游客登录
const touristLogin = () => {
    popNewLoading('登录中');
    window.pi_sdk.pi_RPC_Method(window.pi_sdk.config.jsApi, 'thirdManualLogin', {
        userType: UserType.tourist,
        user:'',
        pwd:''
    }, (error, res) => {
        closePopBox();
        
        if (error) {
            popNewMessage('登录失败');
        } else {
            popNewMessage('登录成功');
            closeSigninPage();
        }
    });
};

// qq登录
const qqLogin = () => {
    // 敬请期待
};

// 微博登录
const wbLogin = () => {
    // 敬请期待
};

// 注册或登录成功后关掉注册页面
const closeSigninPage = () => {
    codeTimer && clearInterval(codeTimer);
    const piRoot = document.querySelector('.pi-root');
    if (piRoot) {
        document.querySelector('body').removeChild(piRoot);
    }
};

/**
 * 弹出框
 */
export const createModalBox = (title:string,msg:string,btnName:string,okCB?:any) => {
    closeSigninPage();
    const htmlText = `
        <div class="pi-mask">
            <div class="modalBox-body animated bounceInUp">
                <div style="font-size: 40px;line-height: 56px;text-align: center;">
                    ${title}
                </div>
                <div style="color: #888888;margin-bottom: 50px;font-size: 32px;padding-top: 40px;">
                    ${msg}
                </div>
                <div class="pi-sure-btn">
                    ${btnName}
                </div>
            </div>
        </div>`;
    const piRoot = document.createElement('div');
    piRoot.setAttribute('id', 'pi-root');
    // tslint:disable-next-line:no-inner-html
    piRoot.innerHTML = htmlText;
    document.body.appendChild(piRoot);

    document.querySelector('.pi-sure-btn').addEventListener('click',() => {
        closePopBox();
        okCB && okCB();
    });
};

const userProtocol = () => {
    document.querySelector('#usersProtocol').style.display = 'block';
};

const backPrePage = () => {
    document.querySelector('#usersProtocol').style.display = 'none';
};

export const openBulletin = () => {
    const bulletin = document.createElement('div');
    const html = `
        <div class="bulletin">
            <div class="bulletinTitle">仙之侠道全平台公测正</div>
            <img src="${window.pi_sdk.config.imgUrlPre}/close.png" class="closeButton"/>
            <div class="bulletinContentBox">
                <div class="bulletinContent">感谢您对仙之侠道的关注与支持，仙之侠道与10月1日上午10:00正式开启全平台公测。感谢您对仙之侠道的关注与支持，仙之侠道与10月1日上午10:00正式开启全平台公测。</div>
                <div class="publisher">仙之侠道 运营组</div>
                <div>2019-年9月30日</div>
            </div>
        </>
    `;
    // tslint:disable-next-line:no-inner-html
    bulletin.innerHTML = html;
    document.querySelector('body').appendChild(bulletin);
    const close = document.querySelector('.closeButton');
    close.addEventListener('click',() => {
        document.querySelector('body').removeChild(bulletin);
    });
};