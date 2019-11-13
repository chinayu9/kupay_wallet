import { chatLogin } from '../../chat/client/app/net/login';
import { earnLogin } from '../../earn/client/app/net/login';
import { request } from '../../pi/net/ui/con_mgr';
import { getStoreData } from '../api/walletApi';
import { getStore,setStore } from '../store/memstore';
import { popNewMessage } from '../utils/pureUtils';
import { getAllGame, getGameInfo, getHotGame, getRecommendationsList, getUserRecentGame } from './pull';

/**
 * 登录
 */

// 1111
/**
 * 通用的异步通信
 */
export const requestAsync = (msg: any):Promise<any> => {
    return new Promise((resolve, reject) => {
        request(msg, (resp: any) => {
            if (resp.type) {
                console.log(`错误信息为${resp.type}`);
                reject(resp);
            } else if (resp.result !== 1) {
                reject(resp);
            } else {
                resolve(resp);
            }
        });
    });
};

// 钱包登录
export const walletLogin = (cb?:Function) => {
    (<any>window).pi_sdk.api.authorize({ appId:'101' },async (err, result) => {
        console.log('authorize',err,JSON.stringify(result));
        cb && cb();

        if (!err) {
            setStore('flags/authorized',true);
            console.log('钱包注册成功',result);
            // 获取全部游戏
            getAllGames();
        } else {
            setStore('flags/authorized',false);
        }
    });
};

/**
 * 判断VM中是否已经有账号
 * 有账号则执行授权，无账号则等到触发事件时执行
 */
export const checkAccount = async (cb:Function) => {    
    const conUid = await getStoreData('user/token','');
    if (conUid) {  // 已有账号执行授权
        walletLogin(cb);
    }
};

/**
 * 判断是否已经授权成功
 */
export const checkAuthorize = () => {
    const flags = getStore('flags',{});
    if (!flags.authorized) {  // 未授权则执行授权
        walletLogin();
        chatLogin();
        earnLogin();

        return false;
    }
    
    return true;
};

// 获取全部游戏
export const getAllGames = async () => {
    const accId = await getStoreData('user');
    getAllGame().then(r => {
        if (r) {
            const appId = JSON.stringify(r);
            getGameInfo(appId).then(r => {
                setStore('game/allGame',r);
                console.log('全部游戏',r);
            });
        }
    }).catch(() => {
        popNewMessage('获取全部游戏失败');
    });

    // 获取热门游戏
    getHotGame().then(r1 => {
        if (r1) {
            getGameInfo(r1).then(res => {
                setStore('game/hotGame',res);
                console.log('获取热门游戏',res);
            });
           
        }
    }).catch(() => {
        popNewMessage('获取热门游戏失败');
    });

    // 获取推荐游戏
    getRecommendationsList().then(r2 => {
        if (r2) {
            getGameInfo(r2).then(res => {
                setStore('game/recommendGame',res);
                console.log('获取推荐游戏',res);
            });
        }
    }).catch(() => {
        popNewMessage('获取推荐游戏失败');
    });

    // 获取最近在玩
    if (accId.acc_id) {
        getUserRecentGame(accId.acc_id,10).then(r => {
            if (r) {
                const appId = JSON.stringify(r);
                getGameInfo(appId).then(res => {
                    setStore('game/oftenGame',res);
                    console.log('获取最近在玩',res);
                });
            }
        }).catch(() => {
            popNewMessage('获取最近在玩游戏失败');
        });
    }
};