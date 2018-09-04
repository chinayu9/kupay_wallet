/**
 * earn home 
 */
// ================================ 导入
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { popNew } from '../../../../pi/ui/root';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
export class PlayHome extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }

    public create(){
        super.create();
    }

    public backPrePage() {
        this.ok && this.ok();
    }

    public dowork(){
        popNew('app-view-earn-mining-addMine',{});
    }

}
