import { getStore as chatGetStore, register as chatRegister } from '../../../chat/client/app/data/store';
import { chatManualReconnect } from '../../../chat/client/app/net/init';
import { earnManualReconnect } from '../../../earn/client/app/net/init';
import { getStore as earnGetStore, register as earnRegister } from '../../../earn/client/app/store/memstore';
import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { registerStoreData } from '../../postMessage/listenerStore';
// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export enum OfflienType {
    WALLET = 1,  // 钱包
    CHAT = 2,   // 聊天
    EARN = 3  // 活动
}
interface Props {
    offlienType: OfflienType;
    isLogin:boolean;
    reconnecting:boolean;
}

/**
 * 离线提示
 */
export class OfflineTip extends Widget {
    public props:Props;

    public setProps(props:any) {
        super.setProps(props);
        this.props.isLogin = true;
        this.props.reconnecting = false;
    }

    public firstPaint() {
        super.firstPaint();
        if (this.props.offlienType === OfflienType.WALLET) {
            // 钱包login
            registerStoreData('flags/isLogin', (isLogin:boolean) => {
                console.log('wallet isLogin--------',isLogin);
                this.updateDate(OfflienType.WALLET,isLogin);
            });
        }

        if (this.props.offlienType === OfflienType.EARN) {
            // 赚钱login
            earnRegister('userInfo/isLogin', (isLogin:boolean) => {
                console.log('chat isLogin--------',isLogin);
                this.updateDate(OfflienType.EARN,isLogin);
            });
        }

        if (this.props.offlienType === OfflienType.CHAT) {
            // 聊天login
            chatRegister('isLogin', (isLogin:boolean) => {
                console.log('earn isLogin--------',isLogin);
                this.updateDate(OfflienType.CHAT,isLogin);
            });
        }

    }

    /**
     * 断线重连
     */
    public reConnect() {
        if (this.props.reconnecting) return;
        this.props.reconnecting = true;   // 正在连接
        const offlienType = this.props.offlienType;
        if (offlienType === OfflienType.WALLET) {  // 钱包重连

        } else if (offlienType === OfflienType.CHAT) {  // 聊天重连
               
            if (!chatGetStore('isLogin')) {
                chatManualReconnect();
            }
        } else {   // 活动重连
            if (!earnGetStore('userInfo/isLogin')) {
                earnManualReconnect();
            }
        }
        this.paint();
    }

    public updateDate(offlienType:OfflienType,isLogin:boolean) {
        if (offlienType === OfflienType.WALLET || offlienType === this.props.offlienType) {  // 钱包重连
            this.props.isLogin = isLogin;
            this.props.reconnecting = false;
            this.paint();
        }
    }
}

// ===========================================================
