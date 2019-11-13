/**
 * 钱包提供给第三方的方法
 */
import { GENERATOR_TYPE } from '../../chat/server/data/db/user.s';
import { WebViewManager } from '../../pi/browser/webview';
import { popNew } from '../../pi/ui/root';
import { addThirdPushListener } from '../postMessage/thirdPush';
import { ThirdCmd } from '../public/constant';
import { gotoChat } from '../view/base/app';
import { getGameItem } from '../view/play/home/gameConfig';

/**
 * 监听第三方发送的请求
 */
addThirdPushListener(ThirdCmd.GAMESERVICE,(webviewName:string) => { gotoGameService(webviewName); });                       // 注册游戏客服事件
addThirdPushListener(ThirdCmd.OFFICIALGROUPCHAT,(webviewName:string) => { gotoOfficialGroupChat(webviewName); });           // 注册官方群聊事件
addThirdPushListener(ThirdCmd.SQUARE,(webviewName:string) => { gotoSquare(webviewName); });           // 注册广场事件

/**
 * 游戏客服
 */
const gotoGameService = (webviewName: string) => {
    console.log('wallet gotoGameService called');
    const item:any = getGameItem(webviewName);
    popNew('chat-client-app-view-chat-chat',{ accId:item.accId,chatType: GENERATOR_TYPE.USER,name:`${item.title}官方客服`,okCB:() => {
        WebViewManager.open(webviewName, `${item.url}?${Math.random()}`, webviewName,'', item.screenMode);
    } });
};

/**
 * 官方群聊
 */
const gotoOfficialGroupChat = (webviewName: string) => {
    console.log('wallet gotoOfficialGroupChat called');
    const item:any = getGameItem(webviewName);
    popNew('chat-client-app-view-chat-chat',{ gid:item.groupId, chatType: GENERATOR_TYPE.GROUP,name:`${item.title}官方群`,okCB:() => {
        WebViewManager.open(webviewName, `${item.url}?${Math.random()}`, webviewName,'', item.screenMode);
    } }); 
};

/**
 *  广场
 */
const gotoSquare = (webviewName: string) => {
    console.log('wallet gotoSquare called');
    const item:any = getGameItem(webviewName);
    popNew('app-components-floatBox-floatBox',{ webviewName, imgUrl:item.img[0] });
    gotoChat(item.title);
};
