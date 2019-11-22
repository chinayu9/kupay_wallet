/**
 * 创建钱包入口
 */
import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { CreateWalletType } from '../../logic/localWallet';

export class CreateHome extends Widget {
    public ok:() => void;
    public createWallet() {
        popNew('blockchain-view-create-createWallet',{ itype:CreateWalletType.Random },() => {
            this.ok && this.ok();
        });
    }

    public importWallet() {
        popNew('blockchain-view-import-home',undefined,() => {
            this.ok && this.ok();
        });
    }
}