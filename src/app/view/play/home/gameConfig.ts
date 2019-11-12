import { screenMode, WebViewManager } from '../../../../pi/browser/webview';
import { ajax } from '../../../../pi/lang/mod';
import { getStore } from '../../../store/memstore';
import { popNewMessage } from '../../../utils/pureUtils';

/**
 * 获取指定webviewName的所有值
 */
export const getGameItem = (webviewName:string) => {
    const gameList = getStore('game').allGame;
    const index = gameList.findIndex((item) => {
        return item.webviewName === webviewName;
    });
    
    const gameItem = localStorage.getItem('officialService') ? JSON.parse(localStorage.getItem('officialService')).gameList[index] :{}; 
    console.log('获取游戏配置信息', gameList[index], gameItem);

    return {
        ...gameList[index],
        ...gameItem
    };
};

/**
 * 
 * @param gameUrl 游戏路径
 * @param title 游戏名
 * @param webviewName webviewName
 * @param screenMode 横竖屏幕
 * @param cb 回调函数
 */
export const openGame = (gameUrl:string,title:string,webviewName:string,screenMode:screenMode,cb?:Function) => {
    ajax.get(`${gameUrl}?${Math.random()}`, {}, undefined, undefined, 1000,(res:string) => {
        WebViewManager.open(webviewName, `${gameUrl}?${Math.random()}`, title, '',screenMode);
        cb && cb();
    },(err:any) => {
        console.log('下载游戏首页错误',err);
        popNewMessage('网络错误，无法进入游戏，请稍后再试');
    });
};
