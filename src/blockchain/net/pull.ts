/**
 * 主动向后端通讯
 */
import { unicodeArray2Str } from '../../app/utils/pureUtils';
import { MainChainCoin } from '../config';
import { requestAsync } from '../logic/wrap';
import {  CloudCurrencyType , MinerFeeLevel } from '../store/interface';
import { getStore, setStore } from '../store/memstore';
// tslint:disable-next-line:max-line-length
import { parseCloudAccountDetail, parseCloudBalance,parseRechargeWithdrawalLog,splitCloudCurrencyDetail } from '../store/parse';
import { PAGELIMIT } from '../utils/constants';
import { showError } from '../utils/toolMessages';

/**
 * 获取所有的货币余额
 */
export const getServerCloudBalance = () => {
    const list = [];
    list.push(CloudCurrencyType.KT);
    list.push(CloudCurrencyType.SC);
    for (const k in CloudCurrencyType) {
        if (MainChainCoin.hasOwnProperty(k)) {
            list.push(CloudCurrencyType[k]);
        }
    }
    const msg = { type: 'wallet/account@get', param: { list:`[${list}]` } };
    
    return requestAsync(msg).then(balanceInfo => {
        console.log('balanceInfo', balanceInfo);
        const cloudBalances = parseCloudBalance(balanceInfo);
        const cloudWallets = getStore('cloud/cloudWallets');
        for (const [key,value] of cloudBalances) {
            const cloudWallet = cloudWallets.get(key);
            cloudWallet.balance = value;
        }
        setStore('cloud/cloudWallets',cloudWallets);
    }).catch((res) => {
        console.log(res);
    });
};

/**
 * 获取指定类型的货币余额
 */
export const getBalance = async (currencyType: CloudCurrencyType) => {
    const msg = { type: 'wallet/account@get', param: { list: `[${currencyType}]` } };
    requestAsync(msg).then(r => {
        // todo 这里更新余额
    });
};

/**
 * 获取指定货币流水
 * filter（0表示不过滤，1表示过滤）
 */
export const getAccountDetail = async (coin: string,filter:number,start = '') => {
    const param:any = {
        coin:CloudCurrencyType[coin],
        start,
        filter,
        count:PAGELIMIT
    };
    if (start) {
        param.start = start;
    } 
    const msg = {
        type: 'wallet/account@get_detail',
        param
    };
    try {
        const res = await requestAsync(msg);
        const nextStart = res.start;
        const detail = parseCloudAccountDetail(coin,res.value);
        const splitDetail = splitCloudCurrencyDetail(detail); 
        const canLoadMore = detail.length >= PAGELIMIT;
        if (detail.length > 0) {
            const cloudWallets = getStore('cloud/cloudWallets');
            const cloudWallet = cloudWallets.get(CloudCurrencyType[coin]);
            if (start) {
                cloudWallet.otherLogs.list.push(...detail);
                if (coin === CloudCurrencyType[CloudCurrencyType.SC] || coin === CloudCurrencyType[CloudCurrencyType.KT]) {
                    cloudWallet.rechargeLogs.list.push(...splitDetail.rechangeList);
                    cloudWallet.withdrawLogs.list.push(...splitDetail.withdrawList); 
                }
            } else {
                cloudWallet.otherLogs.list = detail;
                if (coin === CloudCurrencyType[CloudCurrencyType.SC] || coin === CloudCurrencyType[CloudCurrencyType.KT]) {
                    cloudWallet.rechargeLogs.list = splitDetail.rechangeList;
                    cloudWallet.withdrawLogs.list = splitDetail.withdrawList;
                }
            }
                
            cloudWallet.otherLogs.start = nextStart;
            cloudWallet.otherLogs.canLoadMore = canLoadMore;
            setStore('cloud/cloudWallets',cloudWallets);
        }
    } catch (err) {
        showError(err && (err.result || err.type));

        return;
    }

};

// ===============================充值提现
/**
 * 获取服务端eth钱包地址
 */
export const getBankAddr = async () => {
    const msg = {
        type: 'wallet/bank@get_bank_addr',
        param: { }
    };

    try {
        const res = await requestAsync(msg);

        return res.value;
    } catch (err) {
        showError(err && (err.result || err.type));

        return;
    }
};
/**
 * 获取服务端btc钱包地址
 */
export const getBtcBankAddr = async () => {
    const msg = {
        type: 'wallet/bank@get_btc_bank_addr',
        param: { }
    };

    try {
        const res = await requestAsync(msg);

        return res.value;
    } catch (err) {
        showError(err && (err.result || err.type));

        return;
    }
};
/**
 * 向服务器发起充值请求
 */
// tslint:disable-next-line:max-line-length
export const rechargeToServer = async (fromAddr:string,toAddr:string,tx:string,nonce:number,gas:number,value:string,coin:number= 101) => {
    const msg = {
        type: 'wallet/bank@pay',
        param: {
            from:fromAddr,
            to:toAddr,
            tx,
            nonce,
            gas,
            value,
            coin
        }
    };
    try {
        const res = await requestAsync(msg);
        console.log('rechargeToServer',res);
        
        return true;
    } catch (err) {
        showError(err && (err.result || err.type));

        return false;
    }

};

/**
 * 向服务器发起充值请求
 */
// tslint:disable-next-line:max-line-length
export const btcRechargeToServer = async (toAddr:string,tx:string,value:string,fees:number,oldHash:string) => {
    // tslint:disable-next-line:variable-name
    const old_tx = oldHash || 'none';
    const msg = {
        type: 'wallet/bank@btc_pay',
        param: {
            to:toAddr,
            tx,
            value,
            fees,
            old_tx
        }
    };
    try {
        const res = await requestAsync(msg);
        console.log('btcRechargeToServer',res);
        
        return true;
    } catch (err) {
        showError(err && (err.result || err.type));

        return false;
    }

};

/**
 * 提现
 */
export const withdrawFromServer = async (toAddr:string,value:string) => {
    const msg = {
        type: 'wallet/bank@to_cash',
        param: {
            to:toAddr,
            value
        }
    };

    try {
        const res = await requestAsync(msg);
        console.log('withdrawFromServer',res);

        return res.txid;
    } catch (err) {
        showError(err && (err.result || err.type));

        return;
    }
};

/**
 * btc提现
 */
export const btcWithdrawFromServer = async (toAddr:string,value:string) => {
    const msg = {
        type: 'wallet/bank@btc_to_cash',
        param: {
            to:toAddr,
            value
        }
    };

    try {
        const res = await requestAsync(msg);

        return res.txid;
    } catch (err) {
        showError(err && (err.result || err.type));

        return ;
    }
};

/**
 * 充值历史记录
 */
export const getRechargeLogs = async (coin: string,start?) => {
    // tslint:disable-next-line:no-reserved-keywords
    let type;
    if (coin === 'BTC') {
        type = 'wallet/bank@btc_pay_log';
    } else if (coin === 'ETH') {
        type = 'wallet/bank@pay_log';
    } else { // KT
        return;
    }
    let msg;
    if (start) {
        msg = {
            type,
            param: {
                start,
                count:PAGELIMIT
            }
        };
    } else {
        msg = {
            type,
            param: {
                count:PAGELIMIT
            }
        };
    }
   
    try {
        const res = await requestAsync(msg);
        const nextStart = res.start.toJSNumber ? res.start.toJSNumber() : res.start;
        const detail = parseRechargeWithdrawalLog(coin,res.value);
        const canLoadMore = detail.length >= PAGELIMIT;
        if (detail.length > 0) {
            const cloudWallets = getStore('cloud/cloudWallets');
            const cloudWallet = cloudWallets.get(CloudCurrencyType[coin]);
            if (start) {
                cloudWallet.rechargeLogs.list.push(...detail);
            } else {
                cloudWallet.rechargeLogs.list = detail;
            }
            cloudWallet.rechargeLogs.start = nextStart;
            cloudWallet.rechargeLogs.canLoadMore = canLoadMore;
            setStore('cloud/cloudWallets',cloudWallets);
        }
        
    } catch (err) {
        showError(err && (err.result || err.type));

        return;
    }
};

/**
 * 提现历史记录
 */
export const getWithdrawLogs = async (coin: string,start?) => {
    // tslint:disable-next-line:no-reserved-keywords
    let type;
    if (coin === 'BTC') {
        type = 'wallet/bank@btc_to_cash_log';
    } else if (coin === 'ETH') {
        type = 'wallet/bank@to_cash_log';
    } else {// KT
        return;
    }
    let msg;
    if (start) {
        msg = {
            type,
            param: {
                start,
                count:PAGELIMIT
            }
        };
    } else {
        msg = {
            type,
            param: {
                count:PAGELIMIT
            }
        };
    }
   
    try {
        const res = await requestAsync(msg);
        const nextStart = res.start.toJSNumber ? res.start.toJSNumber() : res.start;
        const detail = parseRechargeWithdrawalLog(coin,res.value);
        const canLoadMore = detail.length >= PAGELIMIT;
        if (detail.length > 0) {
            const cloudWallets = getStore('cloud/cloudWallets');
            const cloudWallet = cloudWallets.get(CloudCurrencyType[coin]);
            if (start) {
                cloudWallet.withdrawLogs.list.push(...detail);
            } else {
                cloudWallet.withdrawLogs.list = detail;
            }
            cloudWallet.withdrawLogs.start = nextStart;
            cloudWallet.withdrawLogs.canLoadMore = canLoadMore;
            setStore('cloud/cloudWallets',cloudWallets);
        }
        
    } catch (err) {
        showError(err && (err.result || err.type));

        return;
    }

};

/**
 * 获取gasPrice
 */
export const fetchGasPrices = async () => {
    const msg = {
        type: 'wallet/bank@get_gas',
        param: {}
    };
    
    try {
        const res = await requestAsync(msg);
        
        const gasPrice = {
            [MinerFeeLevel.Standard]:Number(res.standard),
            [MinerFeeLevel.Fast]:Number(res.fast),
            [MinerFeeLevel.Fastest]:Number(res.fastest)
        };
        setStore('third/gasPrice',gasPrice);

    } catch (err) {
        showError(err && (err.result || err.type));

    }
};

/**
 * 获取gasPrice
 */
export const fetchBtcFees = async () => {
    const msg = {
        type: 'wallet/bank@get_fees',
        param: {}
    };
    
    try {
        const res = await requestAsync(msg);
        const obj = JSON.parse(res.btc);
        const btcMinerFee = {
            [MinerFeeLevel.Standard]:Number(obj.low_fee_per_kb),
            [MinerFeeLevel.Fast]:Number(obj.medium_fee_per_kb),
            [MinerFeeLevel.Fastest]:Number(obj.high_fee_per_kb)
        };
        setStore('third/btcMinerFee',btcMinerFee);

    } catch (err) {
        showError(err && (err.result || err.type));
    }
};

/**
 * 获取ST价格
 */
export const getSilverPrice = async (ispay:number = 0) => {
    const msg = { type:'get_silverprice',param:{ ispay } };
    try {
        const resData:any = await requestAsync(msg);
        if (resData.result === 1) {
            setStore('third/silver',{ price:resData.price,change:resData.change });
        }
    } catch (err) {
        // showError(err && (err.result || err.type));

    }
};

/**
 * changelly 签名
 */
export const changellySign = (data:any) => {
    const msg = {
        type: 'wallet/proxy@sign',
        param: {
            body:JSON.stringify(data)
        }
    };

    return requestAsync(msg);
};

/**
 * 查询订单详情 
 * @param oid 查询订单号
 * @param okCb 成功回调
 * @param failCb 失败回调
 */
export const getOrderDetail = async (oid: string) => {
    const msg = { type: 'get_order_detail', param: { oid } };
    
    return requestAsync(msg);
};

/**
 * 获取订单详情 通过pay支付收入的订单
 * @param oid 订单号
 */
export const getOrderLocal = (transactionId: string) => {
    const msg = { type: 'wallet/order@order_query_local', param: { transaction_id:transactionId } };
    
    return requestAsync(msg);
     
};

/**
 * 获取单个用户信息
 */
export const getOneUserInfo = async (uids: number[], isOpenid?: number) => {
    let msg = {};
    if (isOpenid) {
        msg = { type: 'wallet/user@get_infos', param: { list: `[${uids.toString()}]`, isOpenid } };
    } else {
        msg = { type: 'wallet/user@get_infos', param: { list: `[${uids.toString()}]` } };
    }

    try {
        const res = await requestAsync(msg);
        if (res.value[0]) {

            return JSON.parse(unicodeArray2Str(res.value[0]));
        }
    } catch (err) {
        showError(err && (err.result || err.type));

        return;
    }
};
