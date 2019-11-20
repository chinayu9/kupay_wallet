/**
 * vm 资源加载阶段
 */
import { LoadedStage } from '../public/constant';

const storeLoadedCbs = [];           // store加载完成回调

let vmLoadedStage = LoadedStage.START;   // vm资源准备阶段
const inApp = navigator.userAgent.indexOf('YINENG_ANDROID') >= 0 || navigator.userAgent.indexOf('YINENG_IOS') >= 0;  // 是否app包
/**
 * 监听vm push事件
 * @param cb 回调
 */
export const addStoreLoadedListener = (cb:Function) => {

    // 在Web端,视为立即绑定成功,直接调用并返回
    if (!inApp) {
        cb && cb();
        
        return;
    }

    // 在App端的情况
    if (vmLoadedStage >= LoadedStage.STORELOADED) {
        cb && cb();
    } else {
        storeLoadedCbs.push(cb);
    }
};

/**
 * 绑定完成后, 只触发一次
 * 触发vm push事件
 * 
 * @param args 参数
 */
export const emitVmLoaded = (stage:LoadedStage) => {
    console.log('emitVmLoaded ------------');
    
    // stage === LoadedStage.STORELOADED
    vmLoadedStage = stage;
    
    for (const cb of storeLoadedCbs) {
        cb && cb();
    }
    storeLoadedCbs.length = 0;
};