/**
 * play home 
 */
// ================================ 导入
import { Json } from '../../../../pi/lang/type';
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { register } from '../../../store/memstore';
import { getUserInfo } from '../../../utils/tools';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
export class PlayHome extends Widget {
    public ok: () => void;
    public props:Json = {
        refresh:false,
        avatar:''
    };

    public setProps(props:Json) {
        super.setProps(props);
        const userInfo = getUserInfo();
        if (userInfo) {
            this.props.avatar = userInfo.avatar ? userInfo.avatar : '../../res/image1/default_avatar.png';
            this.props.refresh = false;
        }
    }
    
    public showMine() {
        popNew('app-view-mine-home-home');
    }

    /**
     * 刷新页面
     */
    public refreshPage() {
        this.props.refresh = true;
        this.paint();
        setTimeout(() => {
            this.props.refresh = false;
            this.paint();
        }, 1000);
    }

    public login() {
        const content = { zh_Hans:'敬请期待',zh_Hant:'敬請期待',en:'' };
        popNew('app-components-message-message',{ content:content[getLang()] });
    }
}
register('user/info',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        const userInfo = getUserInfo();
        if (userInfo) {
            w.props.avatar = userInfo.avatar ? userInfo.avatar : '../../res/image1/default_avatar.png';
        }
        w.paint();
    }
});