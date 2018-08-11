/**
 * 挖矿总信息页面  
 * 
 */
// ============================== 导入
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getMineDetail, getMiningHistory, getMiningRank } from '../../../net/pull';
import { find, register } from '../../../store/store';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
export class Dividend extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }

    public create() {
        super.create();
        this.state = {};
        this.initData();
        this.initEvent();
    }

    public backPrePage() {
        this.ok && this.ok();
    }

    /**
     * 查看挖矿记录
     */
    public goHistory() {
        popNew('app-view-mine-dividend-dividendHistory',2);
    }

    /**
     * 查看总排名情况
     */
    public goRank() {
        popNew('app-view-mine-dividend-dividendRank');
    }
  
    /**
     * 获取更新数据
     */
    public initData() {
        const data = find('miningTotal');
        const rank = find('mineRank');
        this.state = {
            totalNum:data.totalNum,
            thisNum:data.thisNum,
            holdNum:data.holdNum,
            mineRank:rank.myRank
        };
        this.paint();
    }

    /**
     * 去增加储备矿
     */
    public goAddMine() {
        popNew('app-view-mine-dividend-addMine');
    }

    /**
     * 初始化事件
     */
    private initEvent() {
        // 这里发起通信
        getMiningHistory();
        getMineDetail();
        getMiningRank(100);
    }
}

register('miningTotal', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.initData();
    }
});
register('mineRank', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.initData();
    }
});