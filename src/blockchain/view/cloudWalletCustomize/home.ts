/**
 * SC 交易记录主页
 */
import { popNew } from '../../../pi/ui/root';
import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { fetchModulConfig } from '../../logic/wrap';
import { getAccountDetail } from '../../net/pull';
import { CloudCurrencyType } from '../../store/interface';
import { getCloudBalances, getStore, register } from '../../store/memstore';
// tslint:disable-next-line:max-line-length
import { fetchBalanceValueOfCoin, fetchCloudGain, formatBalance, formatBalanceValue, getCurrencyUnitSymbol } from '../../utils/tools';
// ===================================================== 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
interface Props {
    currencyName:string;
}
export class CloudWalletHome extends Widget {
    public props:any;
    public ok:() => void;
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.init();
    }
    public init() {
        const currencyName = this.props.currencyName;
        const balance = formatBalance(getCloudBalances().get(CloudCurrencyType[currencyName]));
        const balanceValue = formatBalanceValue(fetchBalanceValueOfCoin(currencyName,balance));
        const color = getStore('setting/changeColor','redUp');
        // tslint:disable-next-line:max-line-length
        const titleShow = currencyName === CloudCurrencyType[CloudCurrencyType.SC] ? fetchModulConfig('SC_SHOW') : fetchModulConfig('KT_SHOW');
        this.props = {
            ...this.props,
            titleShow,
            tabs:[{
                tab:'入账',
                components:'blockchain-view-cloudWalletCustomize-accountEntry'
            },{
                tab:'出账',
                components:'blockchain-view-cloudWalletCustomize-accountOut'
            }],
            activeNum:0,
            gain:fetchCloudGain(),
            rate:formatBalanceValue(fetchBalanceValueOfCoin(currencyName,1)),
            balance,
            balanceValue,
            currencyUnitSymbol:getCurrencyUnitSymbol(),
            redUp: color === 'redUp'
        };
    }

    public updateBalance() {
        const currencyName = this.props.currencyName;
        this.props.balance = getCloudBalances().get(CloudCurrencyType[currencyName]);
        this.props.balanceValue = formatBalanceValue(fetchBalanceValueOfCoin(currencyName,this.props.balance));
        this.props.gain = fetchCloudGain();
        this.props.rate = formatBalanceValue(fetchBalanceValueOfCoin(currencyName,1));
        this.paint();
    }
    public tabsChangeClick(event: any, value: number) {
        this.props.activeNum = value;
        this.paint();
    }
    public backPrePage() {
        this.ok && this.ok();
    }
    /**
     * 充值
     */
    public rechargeClick() {
        popNew('app-view-wallet-cloudWalletCustomize-rechargeSC');
    }

    /**
     * 更新事件
     */
    public initEvent() {
        getAccountDetail(this.props.currencyName,0);
    }

    public currencyUnitChange() {
        this.props.currencyUnitSymbol = getCurrencyUnitSymbol();
        this.paint();
    }

    /**
     * 刷新页面
     */
    public refreshPage() {
        this.initEvent();
    }
}

// ===========================

// 余额变化
register('cloud/cloudWallets', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateBalance();
    }
});

// 汇率变化
register('third/USD2CNYRate', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateBalance();
    }
});

// 金价变化
register('third/silver', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateBalance();
    }
});

// 货币单位变化
register('setting/currencyUnit',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.currencyUnitChange();
    }
    
});