// ================================ 导入
import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

interface TabBar {
    modulName:string;
    text:object;
    icon:string;
    iconActive:string;
    components:string;
}

interface Props {
    isActive:string; // 当前活跃的页面
    tabBarList:TabBar[];
}
const TabBarList = [
    {
        modulName: 'BLOCKCHAIN_CLOUD',
        text: { zh_Hans:'云资产',zh_Hant:'云资产',en:'' },
        icon: 'cloud_icon.png',
        iconActive: 'cloud_icon.png',
        components: 'blockchain-view-home-cloudHome'
    },{
        modulName: 'BLOCKCHAIN_LOCAL',
        text: { zh_Hans:'本地资产',zh_Hant:'本地资产',en:'' },
        icon: 'local_icon.png',
        iconActive: 'local_icon.png',
        components: 'blockchain-view-home-walletHome'
    },{
        modulName: 'BLOCKCHAIN_GAME',
        text: { zh_Hans:'游戏',zh_Hant:'游戏',en:'' },
        icon: 'game_icon.png',
        iconActive: 'game_icon.png',
        components: 'blockchain-view-home-gameHome'
    },{
        modulName: 'BLOCKCHAIN_ACCOUNT',
        text: { zh_Hans:'账户',zh_Hant:'账户',en:'' },
        icon: 'account_icon.png',
        iconActive: 'account_icon.png',
        components: 'blockchain-view-home-accountHome'
    }
];

/**
 * 首页
 */
export class App extends Widget {
    public props:Props;
    public create() {
        super.create();
        this.init();
    }

    public init(): void {
        this.props = {
            isActive:'BLOCKCHAIN_CLOUD',
            tabBarList: TabBarList
        };
    }

    public findPage(isActive:string) {
        return this.props.tabBarList.filter(item => {
            return item.modulName === isActive;
        })[0].components;
    }

    public tabBarChangeListener(event: any, index: number) {
        const identfy = this.props.tabBarList[index].modulName;
        if (this.props.isActive === identfy) return;
        this.props.isActive = identfy;
        this.paint();
        
    }

}

// ===================================================== 本地

// ===================================================== 立即执行
