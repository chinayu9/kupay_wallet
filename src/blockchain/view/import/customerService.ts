import { Widget } from '../../../pi/widget/widget';
import { fetchModulConfig } from '../../logic/wrap';

/**
 * 找客服
 */

export class CustomerService extends Widget {
    public ok:() => void;
    public create() {
        super.create();
        this.props = {
            wachatQrcode:fetchModulConfig('WECHAT_ACCOUNT'),
            qq:fetchModulConfig('QQ_CODE')
        };
    }
    public backPrePage() {
        this.ok && this.ok();
    }
}