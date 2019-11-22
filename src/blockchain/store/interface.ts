import { TaskSid } from './parse';

/**
 * 内存中的数据结构
 */

/**
 * 全局store数据
 */
export interface Store {
    user: User;          // 账号
    wallet: Wallet;      // 钱包
    cloud: Cloud;        // 云端
    setting: Setting;     // 设置
    third: Third;        // 第三方通信数据，如：changelly...
    flags: object;       // 全局的标识
}

/**
 * 云端账户的货币类型
 */
export enum CloudCurrencyType {
    KT = 100,  // KT
    ETH,       // ETH 
    BTC,       // BTC
    ST,         // ST
    SC         // SC 银两
}

/**
 * 交易状态
 */
export enum TxStatus {
    Pending,     // 打包中
    Confirmed,   // 确认 >= 1个区块确认
    Failed,      // 失败
    Success      // 成功  一定的区块确认后认为succss
}

/**
 * 交易类型
 */
export enum TxType {
    Transfer = 1,    // 普通转账
    Receipt,         // 收款
    Recharge,        // 充值
    Exchange         // 币币兑换
}

/**
 * 当前用户数据
 */
export interface User {
    id: string;            // 该账号的id,实际上是第一个以太坊地址
    publicKey: string;     // 用户公钥, 第一个以太坊地址的公钥
    salt: string;          // 加密 盐值
}

/**
 * 当前用户前端数据
 */
export interface Cloud {
    cloudWallets: Map<CloudCurrencyType, CloudWallet>;     // 云端钱包相关数据, 余额  充值提现记录...
}

/**
 * 第三方通信数据，如：shapeshift...
 */
export interface Third {
    gasPrice: GasPrice;                // gasPrice分档次
    btcMinerFee: BtcMinerFee;          // btc minerfee 分档次
    gasLimitMap: Map<string, number>;  // 各种货币转账需要的gasLimit

    // changelly
    changellyCurrencies: string[];            // changelly 支持的币种

    rate: number;                                 // 货币的美元汇率
    silver:Silver;                                // 白银价格
    currency2USDTMap: Map<string, Currency2USDT>;  // k线  --> 计算涨跌幅
}

/**
 * 用户设置
 */
export interface Setting {
    language: string;             // 语言
    changeColor: string;          // 涨跌颜色设置，默认：红跌绿张
    currencyUnit: string;         // 显示哪个国家的货币
}

/**
 *  changelly 交易记录的changelly方收币地址
 */
export interface ChangellyPayinAddr {
    currencyName:string;   // 出币
    payinAddress:string;   // changelly收币地址
}

/**
 * changelly 临时交易记录
 */
export interface ChangellyTempTxs {
    hash:string;   // 交易hash
    id:string;    // 交易id
}

/**
 * 云端钱包
 */
export interface CloudWallet {
    balance: number;   // 余额
    rechargeLogs: {    // 充值记录
        list: RechargeWithdrawalLog[];
        start: number;
        canLoadMore: boolean;
    };
    withdrawLogs: {    // 提现记录
        list: RechargeWithdrawalLog[];
        start: number;
        canLoadMore: boolean;
    };
    otherLogs: {       // 云端流水详情
        list: OtherLogs[];
        start: number;
        canLoadMore: boolean;
    };
}

/**
 * 货币对标USDT k线
 */
export interface Currency2USDT {
    open: number;  // 开盘价
    close: number; // 收盘价
}

/**
 * 钱包对象
 */
export interface Wallet {
    vault: string;                      // 钱包核心
    isBackup: boolean;                  // 备份助记词与否
    showCurrencys: string[];            // 显示的货币列表
    currencyRecords: CurrencyRecord[];  // 支持的所有货币记录
    changellyPayinAddress:ChangellyPayinAddr[];           // changelly 交易记录的changelly方收币地址
    changellyTempTxs:ChangellyTempTxs[];   // changelly 临时交易记录
    logoutTimestamp?:number;             // 登出时间戳
}

/**
 * 货币记录
 */
export interface CurrencyRecord {
    currencyName: string;            // 货币名称
    currentAddr: string;             // 当前正在使用的地址
    addrs: AddrInfo[];               // 所有的地址
    updateAddr: boolean;             // 地址是否已经更新
}

/**
 * 地址对象
 */
export interface AddrInfo {
    addr: string;                    // 地址
    balance: number;                 // 余额
    txHistory: TxHistory[];          // 交易记录
    nonce?: number;                  // 本地维护的nonce(对BTC无效)
}

/**
 * 本地缓存交易记录
 */
export interface TxHistory {
    hash: string;                       // 交易hash
    addr: string;                       // 哪个地址的交易
    txType: TxType;                     // 交易类型 1 转账 2 收款 3 充值 4 币币兑换转账
    fromAddr: string;                   // 转账地址
    toAddr: string;                     // 收币地址
    pay: number;                        // 转账金额
    time: number;                       // 时间戳
    status: TxStatus;                   // 交易状态
    confirmedBlockNumber: number;       // 已确认区块数
    needConfirmedBlockNumber: number;   // 需要确认得区块数
    info: string;                       // 交易额外信息
    currencyName: string;               // 货币名称
    fee: number;                        // 矿工费
    nonce: number;                      // nonce
    minerFeeLevel?: MinerFeeLevel;      // 矿工费档次
}

/**
 * 矿工费3档次
 */
export enum MinerFeeLevel {
    Standard,         // 标准
    Fast,             // 快
    Fastest           // 最快
}
/**
 * 每个档次的gas价格
 */
export interface GasPrice {
    [MinerFeeLevel.Standard]: number;  // 标准
    [MinerFeeLevel.Fast]: number;      // 快
    [MinerFeeLevel.Fastest]: number;    // 最快
}

/**
 * 每个档次的btc矿工费
 */
export interface BtcMinerFee {
    [MinerFeeLevel.Standard]: number;       // 标准
    [MinerFeeLevel.Fast]: number;           // 快
    [MinerFeeLevel.Fastest]: number;         // 最快
}

/**
 * 充值提现记录
 */
export interface RechargeWithdrawalLog {
    time: number;        // timestamp
    timeShow: string;
    amount: number;      // 金额
    status: number;      // 状态码
    statusShow: string;
    hash: string;        // 交易hash
}

/**
 * 其他流水记录
 */
export interface OtherLogs {
    iType: TaskSid;    // 类型
    amount: number;    // 数据
    behavior: string;  // 标签
    time: number;      // 时间
}

/**
 * ST价格、涨跌
 */
export interface Silver {
    price:number;          // 价格
    change:number;         // 涨跌
}
