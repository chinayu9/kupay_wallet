
import { isArray } from '../../pi/net/websocket/util';
// tslint:disable-next-line:max-line-length
import { getStaticLanguage, unicodeArray2Str } from '../utils/tools';
import { sat2Btc, smallUnit2LargeUnit, wei2Eth } from '../utils/unitTools';
// tslint:disable-next-line:max-line-length
import { CloudCurrencyType } from './interface';

/**
 * 解析数据
 */
// ===================================================== 导入
// ===================================================== 导出
/**
 * 解析云端账号余额
 */
export const parseCloudBalance = (balanceInfo): Map<CloudCurrencyType, number> => {
    const m = new Map<CloudCurrencyType, number>();
    for (let i = 0; i < balanceInfo.value.length; i++) {
        const each = balanceInfo.value[i];
        m.set(each[0], smallUnit2LargeUnit(CloudCurrencyType[each[0]], each[1]));
    }
    
    return m;
};

/**
 * 后端定义的任务id
 */
export enum TaskSid {
    Mine = '11',                 // 游戏 实际上是appid
    Recharge = 301,            // 充值
    Withdraw = 302,            // 提现
    CreateWallet = 1001,       // 创建钱包
    FirstChargeEth = 1002,     // 以太坊首次转入
    BindPhone = 1003,          // 注册手机
    ChargeEth = 1004,          // 存币
    InviteFriends = 1005,      // 邀请真实好友
    BuyFinancial = 1007,       // 购买理财产品
    Transfer = 1008,           // 交易奖励
    Dividend = 1009,           // 分红
    Mining = 1010,             // 挖矿
    Chat = 1011,               // 聊天
    FinancialManagement = 330, // 理财
    LuckyMoney = 340,           // 红包
    LuckyMoneyRetreat = 341,     // 回退红包
    Wxpay = 370,                // 微信支付
    Alipay = 371,               // 支付宝支付
    Consume = 360,               // 消费
    Receipt = 361               // 收款
}

/**
 * 解析云端账号详情
 */
export const parseCloudAccountDetail = (coinType: string, infos) => {
    if (!infos) return [];
    const list = [];
    infos.forEach(v => {
        const itype = v[0];
        const amount = smallUnit2LargeUnit(coinType, v[1]);
        const detailTypes = getStaticLanguage().cloudAccountDetail.types;
        let behavior = '';
        let behaviorIcon = '';
        switch (itype) {
            case TaskSid.Mine:
                behavior = detailTypes[0];
                behaviorIcon = 'behavior1010.png';
                break;
            case TaskSid.InviteFriends:
                behavior = detailTypes[1];
                behaviorIcon = 'behavior_red_bag.png';
                break;
            case TaskSid.LuckyMoney: 
                behavior = amount > 0 ? detailTypes[2] : detailTypes[3];
                behaviorIcon = 'behavior_red_bag.png';
                break;
            case TaskSid.Recharge:
                behavior = detailTypes[4];
                behaviorIcon = 'cloud_charge_icon.png';
                break;
            case TaskSid.Withdraw:
                behavior = detailTypes[5];
                behaviorIcon = 'cloud_withdraw_icon.png';
                break;
            case TaskSid.FinancialManagement:
                behavior = detailTypes[6];
                behaviorIcon = 'behavior_manage_money_port.png';
                break;
            case TaskSid.LuckyMoneyRetreat:
                behavior = detailTypes[7];
                behaviorIcon = 'behavior_red_bag.png';
                break;
            case TaskSid.Wxpay: 
                behavior = coinType === 'KT' ? detailTypes[12] : detailTypes[8];
                behaviorIcon = 'wxpay_rechange.png';
                break;
            case TaskSid.Alipay:
                behavior = coinType === 'KT' ? detailTypes[12] : detailTypes[9];
                behaviorIcon = 'alipay_rechange.png';
                break;
            case TaskSid.Consume:
                behavior = detailTypes[10];
                behaviorIcon = 'transfer_icon.png';
                break;
            case TaskSid.Receipt:
                behavior = detailTypes[11];
                behaviorIcon = 'transfer_icon.png';
                break;
            default:
                behavior = isArray(v[2]) ? unicodeArray2Str(v[2]) : v[2];
        }
            
        list.push({
            itype,
            amount,
            behavior,
            behaviorIcon,
            oid:v[2],
            time: v[3]
        });
    });

    return list;
};
/**
 * 解析GT流水
 */
export const splitCloudCurrencyDetail = (list:any[]) => {
    const res = {
        rechangeList :[],
        withdrawList :[]
    };
    list.forEach(v => {
        if (v.amount > 0) {
            res.rechangeList.push(v);
        } else {
            res.withdrawList.push(v);
        }
    });

    return res;
};

/**
 * 解析充值提现记录
 */
export const parseRechargeWithdrawalLog = (coin,val) => {
    const infoList = [];
    if (coin === 'BTC') {
        for (let i = 0; i < val.length;i++) {
            const record = {
                time:val[i][3],
                amount:sat2Btc(val[i][1]),
                hash:val[i][2][0]
            };
            infoList.push(record);
        }
    } else {
        for (let i = 0; i < val.length;i++) {
            const record = {
                time:val[i][0],
                amount:wei2Eth(val[i][1]),
                hash:val[i][3]
            };
            infoList.push(record);
        }
    }
    
    return infoList;
};
// ===================================================== 立即执行