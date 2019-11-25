/**
 * create wallet
 */
import { popNew } from '../../../pi/ui/root';
import { getLang } from '../../../pi/util/lang';
import { Widget } from '../../../pi/widget/widget';
import { createWallet, CreateWalletType } from '../../logic/localWallet';
import { popNewMessage, pswEqualed } from '../../utils/tools';

interface Props {
    itype: CreateWalletType;
    mnemonic?: string;// 助记词
    fragment1?: string;// 片段1
    fragment2?: string;// 片段2
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
            createWalletType:CreateWalletType,
            itype: this.props.itype,
            walletPsw: '',
            walletPswConfirm: '',
            pswEqualed: false,
            userProtocolReaded: true,
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

    public async createClick() {
        if (!this.props.userProtocolReaded) {
            return;
        }
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
        const option: any = {
            psw: this.props.walletPsw
        };
        if (this.props.itype === CreateWalletType.StrandarImport) {
            option.mnemonic = this.props.mnemonic;
        } else if (this.props.itype === CreateWalletType.FragmentImport) {
            option.fragment1 = this.props.fragment1;
            option.fragment2 = this.props.fragment2;
        }
        console.time('pi_create createWallet all need');
        const secrectHash = await createWallet(this.props.itype, option);
        console.timeEnd('pi_create createWallet all need');
        if (!secrectHash) {
            popNewMessage(this.language.tips[4]);
        }
        popNew('blockchain-view-home-home');
        this.ok && this.ok();
    }

    /**
     * 查看隐私条约
     */
    public agreementClick() {
        popNew('blockchain-view-account-privacypolicy');
    }

    /**
     * 照片创建
     */
    public imageCreateClick() {
        popNew('blockchain-view-create-createWalletByImage',{},() => {
            this.ok && this.ok();
        });
    }

}
