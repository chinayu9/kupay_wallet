/**
 * topbar头部标题栏
 * {"title":"领红包","background":"orange","centerTitle":true,nextImg:""}
 * title: 标题
 * centerTitle：标题是否居中，默认否
 * background：背景色，传递色值，或者渐变色，默认白色
 * nextImg:右侧图标路径
 */
// ================================ 导入
import { Json } from '../../../pi/lang/type';
import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { fetchUserInfo } from '../../logic/wrap';
import { Wallet } from '../../store/interface';
import { getStore, register } from '../../store/memstore';

interface Props {
    avatar:string;
    title:string;
    isBackup:boolean;
}

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

let isInit = false;
export class TopBar extends Widget {
    public props:Props;
    public create() {
        super.create();
        if (!isInit) {
            fetchUserInfo().then(res => {
                const isBackup = getStore('wallet/isBackup');
                STATE.isBackup = isBackup;
                STATE.avatar = res.avatar;
                console.log(res);
                forelet.paint(STATE);
            });
            isInit = true;
        }
        
    }
}
const STATE = {
    isBackup:false,
    avatar:''
};

register('wallet',(wallet:Wallet) => {
    STATE.isBackup = wallet.isBackup;
    forelet.paint(STATE);
});