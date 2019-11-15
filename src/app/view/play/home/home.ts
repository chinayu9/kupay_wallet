/**
 * play home 
 */
 // ================================ 导入
import { WebViewProvider } from '../../../../pi/browser/webViewProvider';
import { Json } from '../../../../pi/lang/type';
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getStoreData } from '../../../api/walletApi';
import { checkAuthorize } from '../../../net/login';
import { getAllGame, getGameInfo, getHotGame, getRecommendationsList, getUserRecentGame } from '../../../net/pull';
import { OfflienType } from '../../../publicComponents/offlineTip/offlineTip';
import { deepCopy, getStore, setStore } from '../../../store/memstore';
import { popNewMessage } from '../../../utils/pureUtils';
import { openGame } from './gameConfig';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

/**
 * 玩游戏
 */
export class PlayHome extends Widget {
    public ok: () => void;

    public setProps(props:Json) {
        this.props = {
            ...props,
            offlienType:OfflienType.WALLET
        };
        super.setProps(this.props);
        console.log(props);
        this.props.refresh = false;
        this.props.loaded = false;
        const list = getStore('game');
        this.props.allGame = [];
        this.props.popular = [];
        this.props.recommend = [];
        this.props.oftenList = [];
        // 全部游戏
        if (list.allGame.length) {
            this.props.allGame = list.allGame;
            this.props.recommendedToday =  list.recommendedToday;
        } else {
            this.allGame();
        }

        // 热门
        if (list.hotGame.length) {
            this.props.popular = list.hotGame;
            this.props.popularOver = deepCopy(list.hotGame);

        } else {
            this.hotGame();
        }

        // 推荐
        if (list.recommendGame.length) {
            this.props.recommend = list.recommendGame;
        } else {
            this.getRecommendations();
        }

        // 最近在玩
        if (list.oftenGame.length) {
            this.props.oftenList = list.oftenGame;
        } else {
            this.getRecentGame();
        }
    }

    /**
     * 获取推荐应用
     */
    public getRecommendations() {
        getRecommendationsList().then(r => {
            if (JSON.parse(r).length) {
                getGameInfo(r).then(r => {
                    this.props.recommend = r;
                    setStore('game/recommendGame',r);
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
                const appId = JSON.stringify(r);
                getGameInfo(appId).then(r => {
                    setStore('game/allGame',r);
                    this.props.allGame = r;
                    // 获取今日推荐游戏
                    WebViewProvider.getWebViewName((name:string) => {
                        console.log(`获取包名 = ${name}`);
                        const recommendedToday = [r.find(item => item.webviewName === name)];
                        this.props.recommendedToday = recommendedToday;
                        setStore('game/recommendedToday',recommendedToday);
                    });
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
            if (r) {
                getGameInfo(r).then(r => {
                    this.props.popular = r;
                    setStore('game/hotGame',r);
                    this.paint();
                });
            }
        });
    }

    /**
     * 获取最近在玩
     */
    public async getRecentGame() {
        const accId = await getStoreData('user');
        if (accId.acc_id) {
            getUserRecentGame(accId.acc_id,10).then(r => {
                if (r.length) {
                    const appId = JSON.stringify(r);
                    getGameInfo(appId).then(r => {
                        this.props.oftenList = r;
                        setStore('game/oftenGame',r);
                        this.paint();
                    });
                }
            });
        }
    }

    public getRecommendedToday() {
        WebViewProvider.getWebViewName((name:string) => {
            console.log(`获取包名 = ${name}`);

        });
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
   
    /**
     * 活动点击
     * @param index 序号
     */
    public activityClick(index:number) {
        popNew(this.props.activityList[index].url);
    }

    public async goGame(num:number,gameList:any) {
        if (!checkAuthorize()) {

            return;
        }

        const gameUrl = gameList[num].url;
        if (!gameUrl) {
            const tips = { zh_Hans:'敬请期待',zh_Hant:'敬請期待',en:'' };
            popNewMessage(tips[getLang()]);
        } else {
            // TODO URL是http的才可以先用ajax请求，游戏本地包需额外处理
            openGame(gameUrl,gameList[num].title,gameList[num].webviewName,gameList[num].screenMode,() => {
                const game = getStore('game');
                if (game.oftenGame.findIndex(item => item.appid === gameList[num].appid) === -1) {
                    game.oftenGame.push(gameList[num]);
                    this.props.oftenList.push(gameList[num]);
                }
                setStore('game',game);
                this.paint();
            });
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
        this.goGame(0,this.props.recommendedToday);
    }

    // 进入全部游戏
    public payAllGame(index:number) {
        this.goGame(index,this.props.allGame);
    }

    // 进入热门游戏
    public popularGame(index:number) {
        this.goGame(index,this.props.popular);
    }

    // 进入剩余的热门游戏
    public popularOverGame(index:number) {
        this.goGame(index,this.props.popular);
    }

}

// ========================================
