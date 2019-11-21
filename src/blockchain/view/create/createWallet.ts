/**
 * create wallet
 */
import { getLang } from '../../../pi/util/lang';
import { Widget } from '../../../pi/widget/widget';
import { createWallet, CreateWalletType } from '../../logic/localWallet';
import { selectImage } from '../../logic/native';
import { openConnect } from '../../net/login';
import { uploadFile } from '../../net/pull';
import { setStore } from '../../store/memstore';
import { pswEqualed } from '../../utils/account';
import { imgResize, popNew3, popNewMessage } from '../../utils/tools';
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
            chooseImage: false,
            avatarHtml: '',
            imagePicker:null
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
    public selectImageClick() {
        this.props.imagePicker = selectImage((width, height, url) => {
            console.log('selectImage url = ',url);
            // tslint:disable-next-line:max-line-length
            this.props.avatarHtml = `<div style="background-image: url(${url});width: 160px;height: 160px;background-size: cover;background-position: center;background-repeat: no-repeat;border-radius:50%"></div>`;
            this.props.chooseImage = true;
            this.paint();
        });
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
        if (this.props.chooseImage) {
            this.props.imagePicker.getContent({
                quality:70,
                success(buffer:ArrayBuffer) {
                    imgResize(buffer,(res) => {
                        uploadFile(res.base64);
                    });
                }
            });
            
        }
        this.ok && this.ok();
    }

    /**
     * 查看隐私条约
     */
    public agreementClick() {
        popNew3('app-view-mine-other-privacypolicy');
    }

    /**
     * 照片注册
     */
    public imgLoginClick() {
        popNew3('app-view-wallet-create-createWalletByImage',{},() => {
            this.ok && this.ok();
        });
    }

    public haveAccountClick() {
        popNew3('app-view-wallet-import-standardImport',{},() => {
            this.ok && this.ok();
        });
    }
}
