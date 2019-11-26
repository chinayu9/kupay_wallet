/**
 * 主动向钱包通讯
 */
// ===================================================== 导入
import { popNew } from '../../pi/ui/root';
import { isNumber } from '../../pi/util/util';
import { ERC20Tokens } from '../config';
import { BtcApi } from '../core/btc/api';
import { BTCWallet } from '../core/btc/wallet';
import { Api as EthApi } from '../core/eth/api';
import { EthWallet, initWeb3, web3 } from '../core/eth/wallet';
import { GlobalWallet } from '../core/globalWallet';
import { dataCenter } from '../logic/dataCenter';
import { MinerFeeLevel, TxHistory, TxStatus, TxType } from '../store/interface';
import { erc20GasLimitRate } from '../utils/constants';
import { doErrorShow } from '../utils/toolMessages';
// tslint:disable-next-line:max-line-length
import { deletLocalTx, fetchBtcMinerFee, fetchGasPrice, getConfirmBlockNumber, getCurrentEthAddr, getEthNonce, getStaticLanguage, popNewLoading, popNewMessage, setEthNonce, updateLocalTx } from '../utils/tools';
import { btc2Sat, eth2Wei, ethTokenMultiplyDecimals, wei2Eth } from '../utils/unitTools';
import { fetchMinerFeeList, getWltAddrIndex, VerifyIdentidy } from '../utils/walletTools';
// tslint:disable-next-line:max-line-length
import { btcRechargeToServer, btcWithdrawFromServer, getBankAddr, getBtcBankAddr, getRechargeLogs, getWithdrawLogs, rechargeToServer, withdrawFromServer } from './pull';
// ===================================================== 导出
export interface TxPayload {
    fromAddr:string;        // 转出地址
    toAddr:string;          // 转入地址
    pay:number;             // 转账金额
    currencyName:string;    // 转账货币
    fee:number;             // 矿工费
    minerFeeLevel:MinerFeeLevel;   // 矿工费等级
}

export interface TxPayload3 {
    fromAddr:string;        // 转出地址
    toAddr:string;          // 转入地址
    pay:string | number;             // 转账金额
    currencyName:string;    // 转账货币
    data:string;
}

/**
 * 供其他的webview调用
 */
export const rpcProviderSendAsync = (payload, callback) => {
    initWeb3();    
    if (payload.method === 'eth_accounts') {
        let addr = getCurrentEthAddr();
        addr = addr ? [addr] : [];
        callback(null,{ jsonrpc: '2.0', result: addr, id: payload.id });
    } else if (payload.method === 'eth_sendTransaction') {
        // alert(`payload is ${JSON.stringify(payload)}`);
        const ethPayload = {
            fromAddr:payload.params[0].from,
            toAddr:payload.params[0].to,
            pay:payload.params[0].value,
            currencyName:'ETH',
            data:payload.params[0].data
        };    
        try {

            const promise = transfer3(payload.passwd,ethPayload);

            promise.then(([err, hash]) => {
                console.log(`wallet rpcProviderSendAsync err is ${err}, hash is ${hash}`);
                if (err) {
                    callback(err);
                } else {
                    callback(null, { jsonrpc: '2.0', result: hash, id: payload.id });
                }
            }).catch((err) => {
                console.log(`wallet rpcProviderSendAsync err is catch`);
                callback(err);
            });
        } catch (e) {
            console.log(`transfer3 catch throw`);
            callback(e);
        }
        
    } else {
        if (web3 && web3.currentProvider && web3.currentProvider.sendAsync) {
            web3.currentProvider.sendAsync(payload, callback);
        }
    }

};

/**
 * 普通转账
 */
const transfer3 = async (psw:string,txPayload:TxPayload3) => {
    try {  
        if (psw.length <= 0) return ['have no password'];
        const minerFeeList = fetchMinerFeeList(txPayload.currencyName);
        const txRecord:TxHistory = {
            hash:'',
            addr:txPayload.fromAddr,
            txType:TxType.Transfer,
            fromAddr:txPayload.fromAddr,
            toAddr:txPayload.toAddr,
            pay: wei2Eth(txPayload.pay),
            time: 0,
            status:TxStatus.Pending,
            confirmedBlockNumber: 0,
            needConfirmedBlockNumber:0,
            info: '',
            currencyName:txPayload.currencyName,
            fee:minerFeeList[MinerFeeLevel.Standard].minerFee,
            nonce:undefined,
            minerFeeLevel:MinerFeeLevel.Standard
        };
        const tx = await transferCore(psw,txRecord);
        
        return [undefined,tx.hash];
    } catch (error) {
        return [error,undefined];
    }
};

/**
 * 转账核心模块
 * @param psw 密码
 * @param txRecord 交易记录
 */
const transferCore = async (psw:string,txRecord:TxHistory) => {
    const fromAddr = txRecord.fromAddr;
    const currencyName = txRecord.currencyName;
    let ret: any;
    const addrIndex = getWltAddrIndex(fromAddr, currencyName);
    if (addrIndex < 0) throw new Error('Invalid address');
    const wlt = await GlobalWallet.createWlt(currencyName, psw, addrIndex);
    if (currencyName === 'ETH') {
        ret = await doEthTransfer(<EthWallet>wlt,txRecord);
    } else if (currencyName === 'BTC') {
        const res = await doBtcTransfer(<BTCWallet>wlt, txRecord);
        if (!res) throw new Error('btc send failed');
        ret = { hash:res.txid,nonce:-1 };
    } else if (ERC20Tokens[currencyName]) {
            // tslint:disable-next-line:max-line-length
        const transferCode = EthWallet.tokenOperations('transfer', currencyName, txRecord.toAddr, ethTokenMultiplyDecimals(txRecord.pay, currencyName));
        ret = await doEthTransfer(<EthWallet>wlt,txRecord,transferCode);
    }
    const tx = {
        ...txRecord,
        hash:ret.hash,
        nonce:ret.nonce,
        time:new Date().getTime()
    };
    updateLocalTx(tx);
    dataCenter.updateAddrInfo(tx.addr,tx.currencyName);
            
    return tx;
};

/**
 * 处理ETH转账
 */
const doEthTransfer = async (wlt:EthWallet,txRecord:TxHistory,transferCode?:string) => {
    const oldNonce = txRecord.nonce;
    const api = new EthApi();
    let newNonce;
    let gasLimit;
    let chainNonce;
    // tslint:disable-next-line:max-line-length
    const gasLimitPromise = transferCode ? estimateGasERC20(txRecord.currencyName,txRecord.toAddr,txRecord.fromAddr,'0x0') : estimateGasETH(txRecord.toAddr,txRecord.info);
    if (!isNumber(oldNonce)) {
        const localNonce = getEthNonce(txRecord.fromAddr);
        [chainNonce,gasLimit] = await Promise.all([api.getTransactionCount(txRecord.fromAddr),gasLimitPromise]);
        newNonce = localNonce >= chainNonce ? localNonce : chainNonce;
    } else {  // 重发
        newNonce = oldNonce;
        gasLimit = await gasLimitPromise;
    }
    if (transferCode) gasLimit = Math.floor(gasLimit * erc20GasLimitRate);    // 代币交易gasLimit估值不准 暂时方案
    
    const hash = await api.sendRawTransaction(wlt.signRawTransaction({
        to: txRecord.toAddr,
        nonce: newNonce,
        gasPrice: fetchGasPrice(txRecord.minerFeeLevel || MinerFeeLevel.Standard),
        gasLimit,
        value: eth2Wei(txRecord.pay),
        data: transferCode || txRecord.info
    }));
    if (!isNumber(oldNonce) && hash) {
        setEthNonce(newNonce + 1,txRecord.fromAddr);
    }
        
    return {
        hash,
        nonce:newNonce
    };

};

/**
 * 处理BTC转账
 */
const doBtcTransfer = async (wlt:BTCWallet,txRecord:TxHistory) => {
    const hash = txRecord.hash;
    const minerFee = fetchBtcMinerFee(txRecord.minerFeeLevel);
    wlt.unlock();
    await wlt.init();
    let retArr;
    if (!hash) {
        // tslint:disable-next-line:max-line-length
        retArr = await wlt.buildRawTransactionFromSingleAddress(txRecord.fromAddr,{ toAddr:txRecord.toAddr,amount: txRecord.pay,chgAddr: txRecord.fromAddr },minerFee);
    } else {
        retArr = await wlt.resendTx(hash,minerFee);
    }
    wlt.lock();

    return BtcApi.sendRawTransaction(retArr.rawTx);
};

/**
 * 普通转账
 */
export const transfer = async (psw:string,txPayload:TxPayload) => {
    const fromAddr = txPayload.fromAddr;
    const currencyName = txPayload.currencyName;
    const needConfirmedBlockNumber = getConfirmBlockNumber(currencyName, txPayload.pay);
    const txRecord:TxHistory = {
        hash:'',
        addr:fromAddr,
        txType:TxType.Transfer,
        fromAddr,
        toAddr:txPayload.toAddr,
        pay: txPayload.pay,
        time: 0,
        status:TxStatus.Pending,
        confirmedBlockNumber: 0,
        needConfirmedBlockNumber,
        info: '',
        currencyName,
        fee: txPayload.fee,
        nonce:undefined,
        minerFeeLevel:txPayload.minerFeeLevel
    };
    const tx = await transferCore(psw,txRecord);
    updateLocalTx(tx);
    dataCenter.updateAddrInfo(tx.addr,tx.currencyName);

    return tx;
};

/**
 * 普通转账重发
 */
export const resendNormalTransfer = async (psw:string,txRecord:TxHistory) => {
    const oldHash = txRecord.hash;
    const tx = await transferCore(psw,txRecord);
    deletLocalTx(txRecord.currencyName,oldHash,txRecord.addr);
    updateLocalTx(tx);
    dataCenter.clearTxTimer(oldHash);// 删除定时器
    dataCenter.updateAddrInfo(tx.addr,tx.currencyName);

    return tx;
};

// =====================================================ETH
/**
 * 预估ETH的gas limit
 */
export const estimateGasETH = async (toAddr:string,data?:any) => {
    const api = new EthApi();

    return api.estimateGas({ to: toAddr,data });
};

/**
 * ETH交易签名
 */
const signRawTransactionETH = async (psw:string,fromAddr:string,toAddr:string,
    pay:number,minerFeeLevel:MinerFeeLevel,info?:string,nonce?:number) => {
    try {
        const addrIndex = getWltAddrIndex(fromAddr, 'ETH');
        if (addrIndex >= 0) {
            const wlt = await GlobalWallet.createWlt('ETH', psw, addrIndex);
            const api = new EthApi();
            if (!nonce) {
                const localNonce = getEthNonce(fromAddr);
                const chainNonce = await api.getTransactionCount(fromAddr);
                nonce = localNonce && localNonce >= chainNonce ? localNonce : chainNonce;
            }
            const gasLimit = await estimateGasETH(toAddr,info);
            const txObj = {
                to: toAddr,
                nonce: nonce,
                gasPrice: fetchGasPrice(minerFeeLevel),
                gasLimit: gasLimit,
                value: eth2Wei(pay),
                data: info
            };
            console.log('txObj--------------',txObj);

            return (<EthWallet>wlt).signRawTransactionHash(txObj);
        }
    } catch (error) {
        doErrorShow(error);
    }
};

/**
 * 发送ETH交易
 * @param signedTx 签名交易
 */
const sendRawTransactionETH = async (signedTx) => {
    const api = new EthApi();
    let hash = '';
    try {
        hash = await api.sendRawTransaction(signedTx);
    } catch (err) {
        doErrorShow(err);
    }

    return hash;
};

// ==============================================ERC20
// 预估ETH ERC20Token的gas limit
export const estimateGasERC20 = (currencyName:string,toAddr:string,fromAddr:string,amount:number | string) => {
    const api = new EthApi();

    const transferCode = EthWallet.tokenOperations('transfer', currencyName, toAddr, ethTokenMultiplyDecimals(amount, currencyName));

    return api.estimateGas({ to: ERC20Tokens[currencyName].contractAddr,from:fromAddr, value:'0x0', data: transferCode });
};

// ==================================================BTC
// 预估BTC矿工费
export const estimateMinerFeeBTC = async (nbBlocks: number = 12) => {
    return BtcApi.estimateFee(nbBlocks);
};

/**
 * BTC交易签名
 */
export const signRawTransactionBTC = async (psw:string,fromAddr:string,toAddr:string,
    pay:number,minerFeeLevel:MinerFeeLevel) => {
    try {
        const addrIndex = getWltAddrIndex(fromAddr, 'BTC');
        if (addrIndex >= 0) {
            const wlt = await GlobalWallet.createWlt('BTC', psw, addrIndex);
            const output = {
                toAddr,
                amount: pay,
                chgAddr: fromAddr
            };
            console.log('output----------------',output);
            (<BTCWallet>wlt).unlock();
            await (<BTCWallet>wlt).init();

            const retArr = await (<BTCWallet>wlt).buildRawTransactionFromSingleAddress(fromAddr,output, fetchBtcMinerFee(minerFeeLevel));
            (<BTCWallet>wlt).lock();

            return retArr;
        }
    } catch (error) {
        doErrorShow(error);
    }
};

/**
 * BTC重发交易签名
 */
export const resendSignRawTransactionBTC = async (hash:string,psw:string,fromAddr:string,minerFeeLevel:MinerFeeLevel) => {
    try {
        const addrIndex = getWltAddrIndex(fromAddr, 'BTC');
        if (addrIndex >= 0) {
            const wlt = await GlobalWallet.createWlt('BTC', psw, addrIndex);
            (<BTCWallet>wlt).unlock();
            await (<BTCWallet>wlt).init();
            const retArr = await (<BTCWallet>wlt).resendTx(hash, fetchBtcMinerFee(minerFeeLevel));
            (<BTCWallet>wlt).lock();

            return retArr;
        }
    } catch (error) {
        doErrorShow(error);
    }
};

/**
 * 发送BTC交易
 * @param signedTx 签名交易
 */
export const sendRawTransactionBTC = async (rawHexString) => {
    let hash = '';
    try {
        const ret = await BtcApi.sendRawTransaction(rawHexString);
        hash = ret.txid;
    } catch (err) {
        doErrorShow(err);
    }

    return hash;
};

// ===================================================== 本地

// ================================重发

/**
 * 充值重发
 */
export const resendRecharge = async (psw:string,txRecord:TxHistory) => {
    const oldHash = txRecord.hash;
    console.log('----------resendRecharge--------------');
    const loading = popNewLoading(getStaticLanguage().transfer.againSend);
    let tx;
    try {
        
        if (txRecord.currencyName === 'BTC') {
            tx = await resendBtcRecharge(psw,txRecord);
        } else {
            tx = await ethRecharge(psw,txRecord);
        }
    } catch (error) {
        console.log(error.message);
        doErrorShow(error);
    } finally {
        loading.callback(loading.widget);
    }
    if (tx) {
        deletLocalTx(txRecord.currencyName,oldHash,txRecord.addr);
        updateLocalTx(tx);
        dataCenter.clearTxTimer(oldHash);// 删除定时器
        dataCenter.updateAddrInfo(tx.addr,tx.currencyName);
        getRechargeLogs(tx.currencyName);
        popNewMessage(getStaticLanguage().transfer.againSuccess);
        popNew('app-view-wallet-transaction-transactionDetails', { hash:tx.hash });
    }

    return tx.hash;
};

// ================================重发

export const recharge = async (psw:string,txRecord:TxHistory) => {
    let tx;
    const close = popNewLoading(getStaticLanguage().transfer.recharge);
    if (txRecord.currencyName === 'BTC') {
        tx = await btcRecharge(psw,txRecord);
    } else {
        tx = await ethRecharge(psw,txRecord);
    }
    close.callback(close.widget);
    if (tx) {
        popNewMessage(getStaticLanguage().transfer.rechargeSuccess);
        updateLocalTx(tx);
        console.log(`recharge tx is `,tx);
        dataCenter.updateAddrInfo(tx.addr,tx.currencyName);
        getRechargeLogs(tx.currencyName);
        popNew('app-view-wallet-transaction-transactionDetails', { hash:tx.hash });
        
        return tx.hash;
    }

};
/**
 * eth充值
 */
export const ethRecharge = async (psw:string,txRecord:TxHistory) => {
    const toAddr = await getBankAddr();
    if (!toAddr) return;
    const fromAddr = txRecord.fromAddr;
    const minerFeeLevel = txRecord.minerFeeLevel;
    const gasPrice = fetchGasPrice(minerFeeLevel);
    const pay = txRecord.pay;
    const info = txRecord.info;
    const gasLimit = await estimateGasETH(toAddr,info);
    const minerFee = wei2Eth(gasLimit * fetchGasPrice(minerFeeLevel));
    let nonce = txRecord.nonce;
    const obj = await signRawTransactionETH(psw,fromAddr,toAddr,pay,minerFeeLevel,info,nonce);
    if (!obj) return;
    const signedTX = obj.signedTx;
    const hash = `0x${obj.hash}`;
    nonce = Number(obj.nonce);
    const canTransfer = await rechargeToServer(fromAddr,toAddr,hash,nonce,gasPrice,eth2Wei(pay));
    if (!canTransfer) return;
    const h = await sendRawTransactionETH(signedTX);
    if (!h) return;
    if (!txRecord.nonce) {
        setEthNonce(nonce + 1,fromAddr);
    }
    
    // 维护本地交易记录
    const t = new Date();
    // tslint:disable-next-line:no-unnecessary-local-variable
    const record:TxHistory = {
        ...txRecord,
        nonce,
        hash,
        toAddr,
        time: t.getTime(),
        fee: minerFee,
        minerFeeLevel:minerFeeLevel
    };

    return record;
};

/**
 * btc充值
 */
export const btcRecharge = async (psw:string,txRecord:TxHistory) => {
    const toAddr = await getBtcBankAddr();
    
    if (!toAddr) return;
    const fromAddr = txRecord.fromAddr;
    const minerFeeLevel = txRecord.minerFeeLevel;
    const pay = txRecord.pay;
    const minerFee = fetchBtcMinerFee(minerFeeLevel);
    const obj =  await signRawTransactionBTC(psw,fromAddr,toAddr,pay,minerFeeLevel);
    if (!obj) return;
    const oldHash = txRecord.hash;
    const signedTX = obj.rawTx;
    const hash = obj.hash;
    const canTransfer = await btcRechargeToServer(toAddr,hash,btc2Sat(pay).toString(),minerFee,oldHash);
    if (!canTransfer) return;
    const h = await sendRawTransactionBTC(signedTX);
    if (!h) return;
    // 维护本地交易记录
    const t = new Date();
    // tslint:disable-next-line:no-unnecessary-local-variable
    const record:TxHistory = {
        ...txRecord,
        hash,
        toAddr,
        time: t.getTime(),
        fee: minerFee,
        minerFeeLevel:minerFeeLevel
    };

    return record;
};

/**
 * btc重发充值
 */
export const resendBtcRecharge = async (psw:string,txRecord:TxHistory) => {
    const toAddr = await getBtcBankAddr();
    
    if (!toAddr) return;
    const fromAddr = txRecord.fromAddr;
    const minerFeeLevel = txRecord.minerFeeLevel;
    const pay = txRecord.pay;
    const minerFee = fetchBtcMinerFee(minerFeeLevel);
    const ret =  await resendSignRawTransactionBTC(txRecord.hash,psw,fromAddr,minerFeeLevel);
    if (!ret) return;
    const oldHash = txRecord.hash;
    const hash = ret.newTxid;
    const signedTx = ret.rawTx;
    const canTransfer = await btcRechargeToServer(toAddr,hash,btc2Sat(pay).toString(),minerFee,oldHash);
    if (!canTransfer) return;
    const h = await sendRawTransactionBTC(signedTx);
    if (!h) return;
    // 维护本地交易记录
    const t = new Date();
    // tslint:disable-next-line:no-unnecessary-local-variable
    const record:TxHistory = {
        ...txRecord,
        hash,
        time: t.getTime(),
        fee: minerFee,
        minerFeeLevel:minerFeeLevel
    };

    return record;
};

/**
 * 
 * 提现
 */
export const withdraw = async (passwd:string,toAddr:string,currencyName:string,amount:number | string) => {
    if (currencyName === 'BTC') {
        return btcWithdraw(passwd,toAddr,amount);
    } else {
        return ethWithdraw(passwd,toAddr,amount);
    }
};
// eth提现
export const ethWithdraw = async (passwd:string,toAddr:string,amount:number | string) => {
    const close = popNewLoading(getStaticLanguage().transfer.withdraw);
    const secretHash = await VerifyIdentidy(passwd);
    if (!secretHash) {
        close.callback(close.widget);
        popNewMessage(getStaticLanguage().transfer.wrongPsw);

        return;
    }
    const hash = await withdrawFromServer(toAddr,eth2Wei(amount));
    close.callback(close.widget);
    if (hash) {
        popNewMessage(getStaticLanguage().transfer.withdrawSuccess);
        const tx:TxHistory = {
            hash,
            addr:toAddr,
            txType:TxType.Receipt,
            fromAddr:'',
            toAddr,
            pay: Number(amount),
            time: new Date().getTime(),
            status:TxStatus.Pending,
            confirmedBlockNumber: 0,
            needConfirmedBlockNumber:0,
            info: '',
            currencyName:'ETH',
            fee: 0,
            nonce:undefined
        };
        dataCenter.timerUpdateTxWithdraw(tx);
        getWithdrawLogs('ETH');
        updateLocalTx(tx);
    }
   
    return hash;
};

// btc提现
export const btcWithdraw = async (passwd:string,toAddr:string,amount:number | string) => {
    const close = popNewLoading(getStaticLanguage().transfer.withdraw);
    const secretHash = await VerifyIdentidy(passwd);
    if (!secretHash) {
        close.callback(close.widget);
        popNewMessage(getStaticLanguage().transfer.wrongPsw);

        return;
    }
    const hash = await btcWithdrawFromServer(toAddr,btc2Sat(amount).toString());
    close.callback(close.widget);
    if (hash) {
        popNewMessage(getStaticLanguage().transfer.withdrawSuccess);
        const tx:TxHistory = {
            hash,
            addr:toAddr,
            txType:TxType.Receipt,
            fromAddr:'',
            toAddr,
            pay: Number(amount),
            time: new Date().getTime(),
            status:TxStatus.Pending,
            confirmedBlockNumber: 0,
            needConfirmedBlockNumber:0,
            info: '',
            currencyName:'BTC',
            fee: 0,
            nonce:undefined
        };
        dataCenter.timerUpdateTxWithdraw(tx);
        getWithdrawLogs('BTC');
        updateLocalTx(tx);
    }
   
    return hash;
};