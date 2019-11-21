/**
 * backup index
 */
import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';

interface Props {
    mnemonic: string;
    fragments: any[];
}
// tslint:disable-next-line:completed-docs
export class BackupIndex extends Widget {
    public ok:() => void;
    public backPrePage() {
        this.ok && this.ok();
    }
    
    public standardBackupClick() {
        popNew('blockchain-view-backup-backupMnemonicWordConfirm',{ mnemonic:this.props.mnemonic },() => {
            this.ok && this.ok();
        });
    }
    public fragmentsBackupClick() {
        popNew('blockchain-view-backup-shareMnemonic',{ fragments:this.props.fragments });
    }
}