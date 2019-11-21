/**
 * import enter 
 */
import { popNew } from '../../../pi/ui/root';
import { getLang } from '../../../pi/util/lang';
import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
// ============================导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
export class ImportHome extends Widget {
    public ok: () => void;
    public language:any;
    public create() {
        super.create();
        this.init();
    }
    public init() {
        this.language = this.config.value[getLang()];
        this.props = {
            tabList:[{
                tab:this.language.tabs[0],
                components:'blockchain-view-import-standardImport'
            },{
                tab:this.language.tabs[1],
                components:'blockchain-view-import-imageImport'
            },{
                tab:this.language.tabs[2],
                components:'blockchain-view-import-fragmentImport'
            }]
        };
    }
    public backPrePage() {
        this.ok && this.ok();
    }
    public importSuccess() {
        console.log('-----------success');
        this.ok && this.ok();
        popNew('app-components-modalBox-modalBox',this.language.modalBox,() => {
            // popNew('app-view-wallet-create-createEnter');
        });
    }
}