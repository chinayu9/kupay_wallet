/**
 * play home 
 */
 // ================================ 导入
import { WebViewManager } from '../../../../pi/browser/webview';
import { Json } from '../../../../pi/lang/type';
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { notify } from '../../../../pi/widget/event';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getStoreData } from '../../../api/walletApi';
import { getAllGame, getGameInfo, getHotGame, getRecommendationsList, getUserRecentGame } from '../../../net/pull';
import { OfflienType } from '../../../publicComponents/offlineTip/offlineTip';
import { getStore, register } from '../../../store/memstore';
import { popNewMessage } from '../../../utils/pureUtils';
import { activityList } from './gameConfig';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

const gameList = [
    [
        '仙之侠道',
        { icon:'../../../res/image/game/xianzhixiadao.png',bg:'../../../res/image/game/xianzhixiadaoBg.png' },
        {
            usePi:false,
            desc:'2019最热唯美奇幻手游',
            webviewName:'fairyChivalry',
            buttonMod:3,
            accId:'268828',
            groupId:10001,
            appid:'102',
            screenMode:'portrait'
        },
        // 'http://ysxzxd.17youx.cn/dst/boot/yineng/yineng.html'
        'http://192.168.31.226/game/app/boot/index.html'
    ],
    [
        '一代掌门',
        { icon:'../../../res/image/game/yidaizhangmen.png',bg:'../../../res/image/game/xianzhixiadaoBg.png' },
        {
            usePi:true,
            desc:'2019最热唯美奇幻手游',
            webviewName:'chairMan',
            buttonMod:2,
            accId:'268828',
            groupId:10001,
            appid:'103',
            screenMode:'landscape'
        },
        'http://gcydzm.17youx.cn:8777/client/boot/haohai.html'
    ]
];

/**
 * 玩游戏
 */
export class PlayHome extends Widget {
    public ok: () => void;
    public configPromise:Promise<string>;
    public thirdApiDependPromise:Promise<string>;
    public thirdApiPromise:Promise<string>;
    constructor() {
        super();
        // setTimeout(() => {
        //     this.thirdApiPromise = new Promise((resolve) => {
        //         const path = 'app/api/thirdApi.js.txt';
        //         loadDir([path,'app/api/JSAPI.js'], undefined, undefined, undefined, fileMap => {
        //             const arr = new Uint8Array(fileMap[path]);
        //             const content = new TextDecoder().decode(arr);
        //             resolve(content);
        //         }, () => {
        //             //
        //         }, () => {
        //             //
        //         });
        //     });
        // },0);

        // setTimeout(() => {
        //     this.thirdApiDependPromise = new Promise((resolve) => {
        //         const path = 'app/api/thirdApiDepend.js.txt';
        //         loadDir([path,'app/api/thirdBase.js'], undefined, undefined, undefined, fileMap => {
        //             const arr = new Uint8Array(fileMap[path]);
        //             const content = new TextDecoder().decode(arr);
        //             resolve(content);
        //         }, () => {
        //             //
        //         }, () => {
        //             //
        //         });
        //     });
        // },0);
       
    }
    
    public setProps(props:Json) {
        this.props = {
            ...props,
            offlienType:OfflienType.WALLET
        };
        super.setProps(this.props);
        console.log(props);
        this.props.refresh = false;
        this.props.activityList = activityList;
        this.props.loaded = false;
        // 最近在玩
        this.props.oftenList = gameList;
        // 推荐
        this.props.recommend = gameList;
        // 今日推荐
        // tslint:disable-next-line:max-line-length
        this.props.recommendedToday =  { name:'仙之侠道',icon:'../../../res/image/game/xianzhixiadao.png',bg:'../../../res/image/game/xianzhixiadaoBg.png',desc:'2019最热唯美奇幻手游' };
        // 热门
        this.props.popular = gameList;
        // 编辑推荐
        // tslint:disable-next-line:max-line-length
        this.props.editRecommend = { name:'一起吃鸡',icon:'../../../res/image/game/bullfighting.png',bg:'../../../res/image/game/eatingChicken.png',desc:'2019LPL春季赛常规赛' };
        // 全部游戏
        this.props.allGame = gameList;
        this.getRecommendations();
        this.allGame();
        this.hotGame();
        this.getRecentGame();
    }

    /**
     * 获取推荐应用
     */
    public getRecommendations() {
        getRecommendationsList().then(r => {
            r = ['102'];
            if (r.length) {
                const appId = r;
                getGameInfo(appId).then(r => {
                    this.props.recommend = r;
                    this.paint();
                });
            }
        });
    }

    /**
     * 获取全部游戏
     */
    public allGame() {
        getAllGame().then(r => {
            if (r.length) {
                const appId = r;
                getGameInfo(appId).then(r => {
                    this.props.allGame = r;
                    this.paint();
                });
            }
        });
    }

    /**
     * 获取热门游戏
     */
    public hotGame() {
        getHotGame().then(r => {
            if (r.length) {
                const appId = r;
                getGameInfo(appId).then(r => {
                    this.props.popular = r;
                    this.paint();
                });
            }
        });
    }

    /**
     * 获取最近在玩
     */
    public getRecentGame() {
        const acc_id = this.props.userInfo.acc_id;
        if (acc_id) {
            getUserRecentGame(acc_id,10).then(r => {
                r = ['101'];
                if (r.length) {
                    const appId = r;
                    getGameInfo(appId).then(r => {
                        this.props.oftenList = r;
                        this.paint();
                    });
                }
            });
        }
    }
    public attach() {
        super.attach();
        this.defaultEnterGame();
    }
    /**
     * 刷新页面
     */
    public loaded() {
        // toDo 更新数据 完成之后将loaded变成true 刷新页面
        setTimeout(() => {
            console.log('加载数据完成');
            this.props.loaded = true;
            this.paint();

        },2000);

    }

    /**
     * 刷新页面前的准备
     */
    public beforeLoad() {
        console.log('通知刷新状态---');
        this.props.loaded = false;
        this.paint();
    }

    public backPrePage() {
        this.ok && this.ok();
    }

    public getCode(event:any) {
        console.log(event.phone);
    }

    public modalBoxSure(e:any) {
        console.log(e.value);
    }

    public showMine() {
        popNew('app-view-mine-home-home');
    }

    /**
     * 刷新页面
     */
    public refreshPage() {
        this.props.refresh = true;
        this.paint();
        setTimeout(() => {
            this.props.refresh = false;
            this.paint();
        }, 1000);
    }

    /**
     * 搜索
     */
    public toSearch() {
        popNew('app-view-play-searchGame');
    }
    // public gameClick1() {
    //     this.gameClick(0);
    // }
    /**
     * 点击游戏
     */
    // public async gameClick(num:number) {
    //     const isLogin = await getStoreData('flags/isLogin');
    //     if (!isLogin) {
    //         popNewMessage('登录中,请稍后再试');

    //         return;
    //     }
    //     if (!gameList[num].url) {
    //         const tips = { zh_Hans:'敬请期待',zh_Hant:'敬請期待',en:'' };
    //         popNewMessage(tips[getLang()]);
    //     } else {
    //         setPopPhoneTips();
    //         hasEnterGame = true;
    //         const gameTitle = gameList[num].title.zh_Hans;
    //         const gameUrl =   gameList[num].url;
    //         const webviewName = gameList[num].webviewName;
    //         const screenMode = gameList[num].screenMode;
    //         WebViewManager.open(webviewName, `${gameUrl}?${Math.random()}`, gameTitle, '',screenMode);
    //         tslint:disable-next-line:max-line-length
    //         const [addrInfo,baseUrl,inviteCodeInfo] = await Promise.all([callGetCurrentAddrInfo('ETH'),callGetEthApiBaseUrl(),callGetInviteCode()]);
    //         const inviteCode = `${LuckyMoneyType.Invite}${inviteCodeInfo.cid}`; 
    //         const pi3Config:any = getPi3Config();
    //         pi3Config.web3EthDefaultAccount = addrInfo.addr;
    //         pi3Config.web3ProviderNetWork = baseUrl;
    //         pi3Config.appid = gameList[num].appid;
    //         pi3Config.gameName = gameTitle;
    //         pi3Config.webviewName = webviewName;
    //         pi3Config.apkDownloadUrl = gameList[num].apkDownloadUrl;
    //         pi3Config.userInfo = {
    //             nickName:this.props.userInfo.nickName,
    //             inviteCode
    //         };

    //         const pi3ConfigStr = `
    //             window.pi_config = ${JSON.stringify(pi3Config)};
    //         `;
    //         this.configPromise = Promise.resolve(pi3ConfigStr);

    //         const allPromise = Promise.all([this.configPromise,this.thirdApiDependPromise,this.thirdApiPromise]);
    //         allPromise.then(([configContent,thirdApiDependContent,thirdApiContent]) => {
    //             setHasEnterGame(true);
    //             const content =  configContent + thirdApiDependContent + thirdApiContent;
    //             WebViewManager.open(webviewName, `${gameUrl}?${Math.random()}`, gameTitle, content);
    //         });
    //     }
    // }

    /**
     * 活动点击
     * @param index 序号
     */
    public activityClick(index:number) {
        popNew(this.props.activityList[index].url);
    }

    /**
     * 默认进入游戏
     */
    public defaultEnterGame() {
        return;
        const firstEnterGame = localStorage.getItem('firstEnterGame');   // 第一次直接进入游戏，以后如果绑定了手机则进入
        getStore('user/isLogin').then(isLogin => {
            const phoneNumber = this.props.userInfo.phoneNumber;    
            console.log(`firstEnterGame = ${firstEnterGame},phoneNumber = ${phoneNumber}`);
            if (!firstEnterGame || phoneNumber) {
                if (!isLogin  || !this.props.isActive || hasEnterGame) {
                    console.log('defaultEnterGame failed');
        
                    return;
                } else {
                    console.log('defaultEnterGame success');
                    localStorage.setItem('firstEnterGame','true');
                    this.gameClick(0);
                }
            }
        });
    }
    
    public async goGame(num:number,gameList:any) {
        const isLogin = await getStoreData('flags/isLogin');
        if (!isLogin) {
            popNewMessage('登录中,请稍后再试');

            return;
        }
        if (!gameList[num][3]) {
            const tips = { zh_Hans:'敬请期待',zh_Hant:'敬請期待',en:'' };
            popNewMessage(tips[getLang()]);
        } else {
            hasEnterGame = true;
            const gameTitle = gameList[num][0];
            const gameUrl =   gameList[num][3];
            const webviewName = gameList[num][2].webviewName;
            const screenMode = gameList[num][2].screenMode;
            WebViewManager.open(webviewName, `${gameUrl}?${Math.random()}`, gameTitle, '',screenMode);
        }
    }

    // 进入最近在玩的游戏
    public oftenGame(index:number) {
        this.goGame(index,this.props.oftenList);
    }

    // 进入推荐游戏
    public recommendGame(index:number) {
        this.goGame(index,this.props.recommend);
    }

    // 进入今日推荐游戏
    public todayGame() {
        this.goGame(0,this.props.recommend);
    }

    // 进入全部游戏
    public payAllGame(index:number) {
        this.goGame(index,this.props.allGame);
    }

    // 进入热门游戏
    public popularGame(index:number) {
        this.goGame(index,this.props.popular);
    }

}
let hasEnterGame = false;
// ========================================

register('user/isLogin', (isLogin:boolean) => {
    setTimeout(() => {
        const w:any = forelet.getWidget(WIDGET_NAME);
        w && w.defaultEnterGame();   
    },400);
});
