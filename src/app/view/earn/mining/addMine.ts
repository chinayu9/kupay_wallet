/**
 * 做任务
 */
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getInviteCode, getMineDetail, getMineItemJump } from '../../../net/pull';
import { getStore, register } from '../../../store/memstore';
import { getLanguage } from '../../../utils/tools';
import { getLang } from '../../../../pi/util/lang';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
export class Dividend extends Widget {
    public ok: () => void;
    public language:any;
    constructor() {
        super();
    }

    public create() {
        super.create();
        this.language = this.config.value[getLang()];
        this.state = {
            data:[
                {
                    isComplete: false,
                    itemImg: '../../res/image/addMine_create.png',
                    itemName: this.language.data[0][0],
                    itemShort:this.language.data[0][1],
                    itemDetail: this.language.data[0][2],
                    itemJump: 'walletCreate',
                    show:false
                }, {
                    isComplete: false,
                    itemImg: '../../res/image/addMine_verify.png',
                    itemName: this.language.data[1][0],
                    itemShort: this.language.data[1][1],
                    itemDetail: this.language.data[1][2],
                    itemJump: 'bindPhone',
                    show:false                
                }, {
                    isComplete: false,
                    itemImg: '../../res/image/addMine_store.png',
                    itemName: this.language.data[2][0],
                    itemShort: this.language.data[2][1],                
                    itemDetail: this.language.data[2][2],
                    itemJump: 'storeCoin',
                    show:false
                }, {
                    isComplete: false,
                    itemImg: '../../res/image/addMine_share.png',
                    itemName: this.language.data[3][0],
                    itemShort: this.language.data[3][1],  
                    itemDetail: this.language.data[3][2],
                    itemJump: 'shareFriend',
                    show:false
                }, {
                    isComplete: false,
                    itemImg: '../../res/image/addMine_buy.png',
                    itemName: this.language.data[4][0],
                    itemShort: this.language.data[4][1],
                    itemDetail: this.language.data[4][2],
                    itemJump: 'buyFinancial',
                    show:false
                }, {
                    isComplete: false,
                    itemImg: '../../res/image/addMine_chat.png',
                    itemName: this.language.data[5][0],
                    itemShort: this.language.data[5][1],
                    itemDetail: this.language.data[5][2],
                    itemJump: 'toChat',
                    show:false
                }
            ],
            cfgData:this.language
        };
        this.initData();
        getMineDetail();
    }

    public backPrePage() {
        this.ok && this.ok();
    }

    /**
     * 挖矿项目跳转
     * @param ind 挖矿项目参数
     */
    public async goDetail(ind:number) {
        if (!this.state.data[ind].isComplete) {
            const itemJump = this.state.data[ind].itemJump;
            getMineItemJump(itemJump);

            if (itemJump === 'shareFriend') {  // 邀请红包
                const inviteCodeInfo = await getInviteCode();
                if (inviteCodeInfo.result !== 1) return;
                
                popNew('app-view-earn-redEnvelope-sendRedEnv',{
                    rid:inviteCodeInfo.cid,
                    rtype:'99',
                    message:this.state.cfgData.defaultMess
                });
            }
            if (itemJump === 'bindPhone') {  // 绑定手机
                popNew('app-view-mine-setting-phone');
            }

            if (itemJump === 'buyFinancial') {  // 购买理财 
                popNew('app-view-wallet-financialManagement-home');
            }
        }
    }

    /**
     * 展示或隐藏详细描述
     */
    public show(ind:number) {
        this.state.data[ind].show = !this.state.data[ind].show;
        this.paint();
    }

    /**
     * 获取更新数据
     */
    public async initData() {  
        const detail = getStore('activity/mining/addMine');        
        // tslint:disable-next-line:max-line-length
        // const detail = [{isComplete:true},{isComplete:false},{isComplete:false},{isComplete:false},{isComplete:false},{isComplete:false}];
        if (detail) {
            for (const i in detail) {
                this.state.data[i].isComplete = detail[i].isComplete;
            }
        }

        this.paint();
        
    }
}

register('activity/mining/addMine', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.initData();
    }
});

register('setting/language', (r) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.language = w.config.value[r];
        w.paint();
    }
});