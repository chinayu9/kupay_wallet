/**
 * cloud home
 */
import { popNew } from '../../../pi/ui/root';
import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { getProductList, getServerCloudBalance } from '../../net/pull';
import { CloudCurrencyType, Product } from '../../store/interface';
import { getStore, register } from '../../store/memstore';
// tslint:disable-next-line:max-line-length
import { fetchCloudTotalAssets, fetchCloudWalletAssetList, formatBalanceValue, getCurrencyUnitSymbol } from '../../utils/tools';
// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
interface Props {
    isActive:boolean;
}
export class CloudHome extends Widget {
    public setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.init();
        if (props.isActive) {
            getServerCloudBalance();
        }
    }
    public init() {
        const color = getStore('setting/changeColor','redUp');
        this.props = {
            ...this.props,
            totalAsset:formatBalanceValue(fetchCloudTotalAssets()),
            assetList:fetchCloudWalletAssetList(),
            redUp:color === 'redUp',
            currencyUnitSymbol:getCurrencyUnitSymbol()
        };
    }

    // 条目点击
    public itemClick(e:any) {
        const index = e.index;
        const v = this.props.assetList[index];
        if (v.currencyName === CloudCurrencyType[CloudCurrencyType.SC] || v.currencyName === CloudCurrencyType[CloudCurrencyType.KT]) {
            popNew('blockchain-view-cloudWalletCustomize-home',{ currencyName:v.currencyName,gain:v.gain });
        } else {
            popNew('blockchain-view-cloudWallet-home',{ currencyName:v.currencyName,gain:v.gain });
        }
    }
    
    public updateProductList(productList:Product[]) {
        this.props.productList = productList;
        this.paint();
    }
    
    public updateBalance() {
        this.props.totalAsset = formatBalanceValue(fetchCloudTotalAssets());
        this.props.assetList = fetchCloudWalletAssetList();
        this.paint();
    }

    public currencyUnitChange() {
        this.props.totalAsset = formatBalanceValue(fetchCloudTotalAssets());
        this.props.assetList = fetchCloudWalletAssetList();
        this.props.currencyUnitSymbol = getCurrencyUnitSymbol();
        this.paint();
    }
}
