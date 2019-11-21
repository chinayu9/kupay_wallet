/**
 * 创建钱包入口
 */
import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { CreateWalletType } from '../../logic/localWallet';

export class CreateHome extends Widget {
    public createWallet() {
        popNew('blockchain-view-create-createWallet',{ itype:CreateWalletType.Random });
    }

    public importWallet() {
        popNew('blockchain-view-import-home');
    }
}