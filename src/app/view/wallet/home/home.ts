/**
 * wallet home 
 */
// ==============================导入
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { UserInfo } from '../../../store/interface';
import { register } from '../../../store/store';
// ============================导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
export class Home extends Widget {
    public create() {
        super.create();
        this.init();
    }
    public init() {
        this.state = {
            tabs:[{
                tab:'云账户',
                components:'app-view-wallet-home-cloudHome'
            },{
                tab:'本地钱包',
                components:'app-view-wallet-home-walletHome'
            }],
            activeNum:1,
            avatar:''
        };
    }
    public tabsChangeClick(event: any, value: number) {
        this.state.activeNum = value;
        this.paint();
    }

    public userInfoChange(userInfo:UserInfo) {
        this.state.avatar = userInfo.avatar;
        this.paint();
    }
}

// ==========================本地
register('userInfo',(userInfo:UserInfo) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.userInfoChange(userInfo);
    }
});