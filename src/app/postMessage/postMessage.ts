/**
 * 接收 其他webview 或 VM 推送的消息
 */
import { WebViewManager } from '../../pi/browser/webview';
import { LoadedStage, PostMessage, PostModule, ThirdPushArgs } from '../public/constant';
import { emitThirdPush } from './thirdPush';
import { emitVmLoaded } from './vmPush';

/**
 * 监听postMessage
 */
WebViewManager.addPostMessageListener((fromWebView:string, message:string) => {
    const msg:PostMessage = JSON.parse(message);
    console.log(`postMessage === fromWebView ${fromWebView} message ${message}`);
    if (msg.moduleName === PostModule.LOADED) {
        emitVmLoaded(<LoadedStage>msg.args);
    } else if (msg.moduleName === PostModule.THIRD) {
        emitThirdPush(<ThirdPushArgs>msg.args);
    }
});