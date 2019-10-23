/**
 * 钱包提供给第三方的方法
 */
import { GENERATOR_TYPE } from '../../chat/server/data/db/user.s';
import { screenMode, WebViewManager } from '../../pi/browser/webview';
import { popNew } from '../../pi/ui/root';
import { addThirdPushListener } from '../postMessage/thirdPush';
import { ThirdCmd } from '../public/constant';
import { getGameItem } from '../view/play/home/gameConfig';

let curWebviewName = '';
/**
 * 监听第三方发送的请求
 */
addThirdPushListener(ThirdCmd.GAMESERVICE,(webviewName:string) => { gotoGameService(webviewName); });                       // 注册游戏客服事件
addThirdPushListener(ThirdCmd.OFFICIALGROUPCHAT,(webviewName:string) => { gotoOfficialGroupChat(webviewName); });           // 注册官方群聊事件

/**
 * 游戏客服
 */
const gotoGameService = (webviewName: string) => {
    console.log('wallet gotoGameService called');
    curWebviewName = webviewName;
    const item:any = getGameItem(webviewName);
    popNew('chat-client-app-view-chat-chat',{ uid:'10046',chatType: GENERATOR_TYPE.USER,name:`${item.title.zh_Hans}官方客服`,okCB:() => {
        WebViewManager.open(webviewName, `${item.url}?${Math.random()}`, webviewName,'', screenMode.landscape);
    } });
};

/**
 * 官方群聊
 */
const gotoOfficialGroupChat = (webviewName: string) => {
    console.log('wallet gotoOfficialGroupChat called');
    const item:any = getGameItem(webviewName);
    curWebviewName = webviewName;
    popNew('chat-client-app-view-chat-chat',{ gid:item.groupId, chatType: GENERATOR_TYPE.GROUP,name:`${item.title.zh_Hans}官方群`,okCB:() => {
        WebViewManager.open(webviewName, `${item.url}?${Math.random()}`, webviewName,'', screenMode.landscape);
    } }); 
};

export const getWebviewName = () => {
    return curWebviewName;
};