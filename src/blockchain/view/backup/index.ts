/**
 * backup index
 */
import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { fetchModulConfig } from '../../logic/wrap';

interface Props {
    mnemonic: string;
    fragments: any[];
}
// tslint:disable-next-line:completed-docs
export class BackupIndex extends Widget {
    public ok:() => void;
    public setProps(props:Props) {
        this.props = {
            ...props,
            walletName:fetchModulConfig('WALLET_NAME')
        };
        super.setProps(this.props);
    }
    public backPrePage() {
        this.ok && this.ok();
    }
    
    public standardBackupClick() {
        popNew('blockchain-view-backup-backupMnemonicWordConfirm',{ mnemonic:this.props.mnemonic },() => {
            this.ok && this.ok();
        });
    }
    public fragmentsBackupClick() {
        popNew('blockchain-view-backup-shareMnemonic',{ fragments:this.props.fragments },() => {
            this.ok && this.ok();
        });
    }
}