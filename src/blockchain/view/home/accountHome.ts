/**
 * account home
 */
import { popNew } from '../../../pi/ui/root';
import { getLang } from '../../../pi/util/lang';
import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { getMnemonic, logoutAccountDel, popNewLoading, popNewMessage, popPswBox, rippleShow } from '../../utils/tools';
import { backupMnemonic, VerifyIdentidy } from '../../utils/walletTools';
// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class AccountHome extends Widget {
    public ok: () => void;
    public language: any;
    public create() {
        super.create();
        this.language = this.config.value[getLang()];
    }

    /**
     * 返回上一页
     */
    public backPrePage() {
        this.ok && this.ok();
    }

    // 动画效果执行
    public onShow(e:any) {
        rippleShow(e);
    }

    // 备份助记词
    public async backupWalletClick() {
        const psw = await popPswBox();
        if (!psw) return;
        const ret = await backupMnemonic(psw);
        if (ret) {
            popNew('blockchain-view-backup-index', ret);
        }

    }

    // 导出私钥
    public async exportPrivateKeyClick() {
        const psw = await popPswBox();
        if (!psw) return;
        const close = popNewLoading(this.language.loading);
        try {
            const mnemonic = await getMnemonic(psw);
            if (mnemonic) {
                popNew('blockchain-view-account-exportPrivateKey', { mnemonic });
            } else {
                popNewMessage(this.language.tips[1]);
            }
        } catch (error) {
            console.log(error);
            popNewMessage(this.language.tips[1]);
        }
        close.callback(close.widget);
    }

    /**
     * 修改密码
     */
    public async changePsw() {
        const psw = await popPswBox();
        if (!psw) return;
        const close = popNewLoading(this.language.verify);
        const secretHash = await VerifyIdentidy(psw);
        close.callback(close.widget);
        if (!secretHash) {
            popNewMessage('密码错误');

            return;
        }
        popNew('blockchain-view-account-changePsw',{ secretHash });
        
    }

    // 退出钱包
    public exitWallet() {
        // TODO
        // tslint:disable-next-line:max-line-length
        popNew('blockchain-components-modalBox-modalBox',{ style:'display:flex;justify-content: center;',content:'退出前请确认您已备份',sureText:'退出',cancelText:'暂不退出' },() => {
            logoutAccountDel();
        });
        
    }
    public itemClick(e:any,i:number) {
        if (i === 0) {
            this.backupWalletClick();
        } else if (i === 1) {
            this.exportPrivateKeyClick();
        } else if (i === 2) {
            this.changePsw();
        } 
    }

}
