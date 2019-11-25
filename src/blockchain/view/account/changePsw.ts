/**
 * create wallet
 */
import { popNew } from '../../../pi/ui/root';
import { getLang } from '../../../pi/util/lang';
import { Widget } from '../../../pi/widget/widget';
import { createWallet, CreateWalletType } from '../../logic/localWallet';
import { popNewLoading, popNewMessage, pswEqualed } from '../../utils/tools';
import { passwordChange } from '../../utils/walletTools';

interface Props {
    secretHash:string;
}
export class CreateWallet extends Widget {
    public props: any;
    public ok: () => void;
    public cancel: () => void;
    public language: any;

    public init() {
        this.language = this.config.value[getLang()];
        this.props = {
            ...this.props,
            walletPsw: '',
            walletPswConfirm: '',
            pswEqualed: false,
            walletPswAvailable: false,
            walletPswConfirmAvailable: false
        };
        console.log(this.props);
    }

    public setProps(props: Props, oldProps: Props) {
        super.setProps(props, oldProps);
        this.init();
    }
    public backPrePage() {
        this.cancel && this.cancel();
    }
    public pswConfirmChange(r: any) {
        this.props.walletPswConfirmAvailable = r.success;
        this.props.walletPswConfirm = r.value;
        this.props.pswEqualed = pswEqualed(this.props.walletPsw, this.props.walletPswConfirm);
        this.paint();
    }
    // 密码格式正确通知
    public pswChange(res: any) {
        this.props.walletPswAvailable = res.success;
        this.props.walletPsw = res.password;
        this.props.pswEqualed = pswEqualed(this.props.walletPsw, this.props.walletPswConfirm);
        this.paint();
    }

    // 清除密码
    public pwsClear() {
        this.props.walletPsw = '';
        this.paint();
    }

    public async changePswClick() {
        if (!this.props.walletPsw || !this.props.walletPswConfirm) {
            popNewMessage(this.language.tips[1]);

            return;
        }
        if (!this.props.walletPswAvailable) {
            popNewMessage(this.language.tips[2]);

            return;
        }
        if (!this.props.pswEqualed) {
            popNewMessage(this.language.tips[3]);

            return;
        }
        const loading = popNewLoading('修改中...');
        await passwordChange(this.props.secretHash, this.props.walletPsw);
        loading.callback(loading.widget);
        popNewMessage(this.language.tips[4]);
        this.backPrePage();
    }

}
