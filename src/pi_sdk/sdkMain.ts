/**
 * pi sdk 入口文件
 */
// tslint:disable-next-line:max-line-length
import { buttonModInit, closePopBox, createThirdApiStyleTag, createThirdBaseStyle, openBulletin, popInputBox, popNewLoading, popNewMessage } from './sdkTools';

declare var pi_modules;

let webviewManagerPath;   // pi库webview文件路径
// tslint:disable-next-line:variable-name
let pi_RPC_Method:Function;     // rpc调用

// tslint:disable-next-line:variable-name
const pi_sdk:any = window.pi_sdk || {};         // pi sdk

// tslint:disable-next-line:variable-name
const piStore:any = pi_sdk.store || {       // store
    freeSecret:false                         // 是否开启免密支付
};   

// tslint:disable-next-line:variable-name
const piConfig:any = pi_sdk.config || {};  // 配置信息

const inApp = navigator.userAgent.indexOf('YINENG_ANDROID') >= 0 || navigator.userAgent.indexOf('YINENG_IOS') >= 0;  // 是否app包

/**
 * button id定义
 */
enum ButtonId {
    INVITEFRIENDS = 'pi-invite',                 // 邀请好友
    BULLETIN= 'PI-bulletin',                     // 公告
    GAMESSERVICE = 'pi-service',                 // 游戏客服
    OFFICIALGROUPCHAT = 'pi-official-chat',      // 官方群聊
    DIVIDEND= 'pi-dividend',                     // 分红
    RECHARGE = 'pi-recharg',                     // 充值
    FREESECRET = 'pi-free-secret',               // 免密支付
    MINWINDOW = 'pi-min-window',                 // 最小化
    EXITGAME = 'pi-exit-game'                    // 退出游戏
}

/**
 * 提供的button
 */
const showButtons = [{
    id:ButtonId.GAMESSERVICE,
    img:'square.png',
    text:'广场',
    show:true,
    clickedClose:true,
    redSpot:false,
    clickCb:() => {
        console.log('click 广场');
        pi_RPC_Method(piConfig.jsApi, 'gotoSquare', piConfig.webviewName,  (error, result) => {
            console.log('gotoSquare call success');
        });
        miniWebview('');
    }
},{
    id:ButtonId.GAMESSERVICE,
    img:'gameService.png',
    text:'客服',
    show:true,
    clickedClose:true,
    redSpot:false,
    clickCb:() => {
        console.log('click 游戏客服');
        pi_RPC_Method(piConfig.jsApi, 'gotoGameService', piConfig.webviewName,  (error, result) => {
            console.log('gotoGameService call success');
        });
        miniWebview('/wallet/chat/client/boot/index.html');
    }
},{
    id:ButtonId.MINWINDOW,
    img:'mainPage.png',
    text:'主页',
    show:true,
    clickedClose:true,
    redSpot:false,
    clickCb:() => {
        console.log('click 最小化');
        miniWebview('');
    }
},{
    id:ButtonId.EXITGAME,
    img:'exitApp.png',
    text:'退出',
    show:true,
    clickedClose:true,
    redSpot:false,
    clickCb:() => {
        console.log('click 退出游戏');
        pi_RPC_Method(piConfig.jsApi, 'closeWebview', piConfig.webviewName, (error, result) => {
            console.log('closeWebview call success');
        });
    }
}
// ,{
//     id:ButtonId.BULLETIN,
//     img:'gameNotice.png',
//     text:'公告',
//     show:true,
//     clickedClose:true,
//     redSpot:true,
//     clickCb:() => {
//         console.log('click 游戏公告');
//         openBulletin();
//     }
// },{
//     id:ButtonId.DIVIDEND,
//     img:'shareMoney.png',
//     text:'分红',
//     show:true,
//     clickedClose:true,
//     redSpot:false,
//     clickCb:() => {
//         console.log('click 分红');
//         miniWebview('/wallet/chat/client/boot/index.html');
//         pi_RPC_Method(piConfig.jsApi, 'gotoOfficialGroupChat', piConfig.webviewName,  (error, result) => {
//             console.log('gotoOfficialGroupChat call success');
//         });
//     }
// },{
//     id:ButtonId.INVITEFRIENDS,
//     img:'wx.png',
//     text:'邀请好友',
//     show:false,
//     clickedClose:true,
//     redSpot:false,
//     clickCb:() => {
//         console.log('click 邀请好友');
//         pi_RPC_Method(piConfig.jsApi, 'inviteFriends', {
//             nickName:'测试',
//             inviteCode:'123456',
//             apkDownloadUrl:'http://xxxxx',
//             webviewName:piConfig.webviewName
//         }, (error, result) => {
//             console.log('inviteFriends call success');
//         });
//     }
// },{
//     id:ButtonId.RECHARGE,
//     img:'recharg.png',
//     text:'去充值',
//     show:false,
//     clickedClose:true,
//     redSpot:false,
//     clickCb:() => {
//         console.log('click 去充值');
//         pi_RPC_Method(piConfig.jsApi, 'gotoRecharge', piConfig.webviewName,  (error, result) => {
//             console.log('inviteFriends call success');
//         });
//     }
// },{
//     id:ButtonId.FREESECRET,
//     startImg:'free_secret_close.png',
//     closeImg:'free_secret_start.png',
//     text:'打开免密',
//     startText:'关闭免密',
//     closeText:'打开免密支付',
//     show:false,
//     clickedClose:false,
//     redSpot:false,
//     clickCb:() => {
//         console.log('click 免密支付');
//         setFreeSecrectPay(!piStore.freeSecret);
//     }
// },{
//     id:ButtonId.OFFICIALGROUPCHAT,
//     img:'official_group_chat.png',
//     text:'官方群聊',
//     show:false,
//     clickedClose:true,
//     redSpot:false,
//     clickCb:() => {
//         console.log('click 官方群聊');
//         miniWebview('/wallet/chat/client/boot/index.html');
//         pi_RPC_Method(piConfig.jsApi, 'gotoOfficialGroupChat', piConfig.webviewName,  (error, result) => {
//             console.log('gotoOfficialGroupChat call success');
//         });
//     }
// }
];

// 最小化webview
const miniWebview = (webUrl:string) => {
    const exs = pi_modules[webviewManagerPath].exports;
    exs.WebViewManager.minWebView(piConfig.webviewName,webUrl);
};

/**
 * @param timeMS: 超时时间
 * @param autoInfo：JSON对象
 * @param callback(err, initData) 接口回调
 * @description autoInfo 结构{"webViewName" = "testWebView"}
 * @description initData 结构{"code" = 0,"autoToken" = "HA1284HWADry98"}
 */
const piService = {
    hasCallBind: false,
    callBackListen: undefined,

    bind: function(timeMS, autoInfo, callback) {
        let start = 0;
        const step = 100;
        
        if (this.hasCallBind) {
            callback({
                code: -1,
                reason: 'this webview has already bind'
            });
            return;
        }

        this.hasCallBind = true;
        this.callBackListen = callback;
        const that = this;
        const handler = function () {
            if (!that.hasCallBind) {
                return;
            }

            start += step;
            if (start > timeMS) {
                callback({
                    code: -3,
                    reason: 'timeout'
                });
                return;
            }
            if (that.callBackListen) {
                window.JSBridge.webViewBindService(JSON.stringify(autoInfo));
                setTimeout(handler, step);
            }
        };

        setTimeout(handler, step);
    },
    unbind: function(webViewName) {
        if (!this.hasCallBind) return;
        this.hasCallBind = false;
        window.JSBridge.unWebViewBindService(webViewName);
    },
    onBindService: function(err, initData) {
        this.callBackListen && this.callBackListen(err, JSON.parse(initData));
        this.callBackListen = undefined;
    }
};

/**
 * 获取是否开启免密支付
 */
const getFreeSecret = () => {
    console.log('getFreeSecret called');
    pi_RPC_Method(piConfig.jsApi, 'querySetNoPassword', piConfig.appid,  (error, startFreeSecret) => {
        console.log('getFreeSecret called callback',startFreeSecret);
        piStore.freeSecret = startFreeSecret;
    });
};

// 第三方设置免密支付
// openFreeSecret:设置免密支付状态  
// 0:关闭，1:开启
const setFreeSecrectPay =  (openFreeSecret) => {
    closePopBox();
    const title = openFreeSecret ? '设置免密支付' : '关闭免密支付'; 
    popInputBox(title,(value) => {
        const sendData = {
            appid: piConfig.appid,
            noPSW: openFreeSecret ? 1 : 0,
            password:value
        };
        popNewLoading('设置中...');
        pi_RPC_Method(piConfig.jsApi, 'setFreeSecrectPay', sendData, (resCode1, msg1) => {
            if (msg1) {
                piStore.freeSecret = !piStore.freeSecret;
                popNewMessage('设置成功');
            } else {
                popNewMessage('设置失败');
            }
            closePopBox();
        });
    });
};

/**
 * 设置webviewManager路径
 */
const setWebviewManager = (path:string) => {
    webviewManagerPath = path;
    console.log('setWebviewManager path = ',path);
    pi_sdk.pi_RPC_Method = pi_RPC_Method = (moduleName:string, methodName:string, param:any, callback:Function) => {
        const exs = pi_modules[webviewManagerPath].exports;
        if (!exs || !exs.WebViewManager || !exs.WebViewManager.rpc) throw new Error('can\'t find WebViewManager');
        const rpcData = {
            moduleName,  // 模块名
            methodName,  // 方法名
            params:[param,callback]        // 参数组成的数组，参数可以有回调函数
        };
        exs.WebViewManager.rpc('JSVM',rpcData);
    };
};

/**
 * 初始化
 */
const piSdkInit = (param:{webviewName:string;appid:string;isHorizontal:boolean;buttonMod:number}, cb:any, isPC?:boolean) => {
    if (!isPC) {
        piService.bind(6 * 1000, { webviewName: param.webviewName, appid: param.appid }, cb);
    }
    
    piConfig.webviewName = param.webviewName;
    piConfig.appid = param.appid;
    piConfig.isHorizontal = param.isHorizontal;
    piConfig.buttonMod = param.buttonMod || 1; // 默认使用三个点的样式
    window.pi_sdk.config = piConfig;
    
    createThirdBaseStyle();
    createThirdApiStyleTag();
    // buttonModInit()();
    // getFreeSecret();
};

// 按钮模式
enum ButtonMods { 
    SPOTBUTTON = 1,   // 三个点 可拖动
    WXBUTTON = 2,     // 微信小程序样式
    ICONBUTTON = 3    // 图标 可拖动
}

piConfig.ButtonId = ButtonId;
piConfig.showButtons = showButtons;
piConfig.jsApi = 'app/remote/JSAPI';
piConfig.imgUrlPre = 'http://192.168.31.226/wallet/app/res/image/third/';
piConfig.buttonMods = ButtonMods;

if (inApp) {
    pi_sdk.setWebviewManager = setWebviewManager;
    pi_sdk.piSdkInit = piSdkInit;
    pi_sdk.config = piConfig;
    pi_sdk.store = piStore;
    pi_sdk.piService = piService;
    
    window.pi_sdk = pi_sdk; 
}