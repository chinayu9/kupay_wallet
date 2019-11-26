/**
 * 本地钱包相关操作
 */
import { base64ToArrayBuffer } from '../../pi/util/base64';
import { ERC20Tokens } from '../config';
import { generateByHash, sha3 } from '../core/genmnemonic';
import { GlobalWallet } from '../core/globalWallet';
import { AddrInfo, Wallet } from '../store/interface';
import { getStore, setStore } from '../store/memstore';
import { defalutShowCurrencys } from '../utils/constants';
import { restoreSecret } from '../utils/secretsBase';
import { calcHashValuePromise,getMnemonic,getXOR,hexstrToU8Array,popNewLoading, popNewMessage, u8ArrayToHexstr } from '../utils/tools';
import { dataCenter } from './dataCenter';

export interface Option {
    psw: string; // 密码
    imageBase64?: string; // 图片base64
    imagePsw?: string; // 图片密码
    mnemonic?: string; // 助记词
    fragment1?: string; // 片段1
    fragment2?: string; // 片段2
}

/**
 * 创建钱包的方式
 */
export enum CreateWalletType {
  Random = 1, // 普通随机创建
  Image, // 通过图片创建
  StrandarImport, // 普通导入
  ImageImport, // 图片导入
  FragmentImport // 片段导入
}

/**
 * 创建钱包
 * @param itype 创建钱包方式 1 随机 2 图片 3 标准导入 4 照片导入 5 片段导入
 * @param option 相关参数
 */
export const createWallet = async (itype: CreateWalletType, option: Option) => {
    try {
        const close = popNewLoading(getLoadingText(itype));
        const secrectHash = await calcHashValuePromise(option.psw,getStore('user/salt'));
        if (itype === CreateWalletType.Random) {
            createWalletRandom(secrectHash);
        } else if (itype === CreateWalletType.Image) {
            await createWalletByImage(secrectHash);
        } else if (itype === CreateWalletType.StrandarImport) {
            importWalletByMnemonic(secrectHash,option.mnemonic);
        } else if (itype === CreateWalletType.ImageImport) {
            await createWalletByImage(secrectHash);
        } else if (itype === CreateWalletType.FragmentImport) {
            importWalletByFragment(secrectHash,option.fragment1,option.fragment2);
        }
        close.callback(close.widget);
        // 刷新本地钱包
        dataCenter.refreshAllTx();
        dataCenter.initErc20GasLimit();
    
        return secrectHash;
    } catch (err) {
        return '';
    }
};

const getLoadingText = (itype: CreateWalletType) => {
    if (itype === CreateWalletType.Random) {
        return { zh_Hans:'创建中...',zh_Hant:'創建中...',en:'' };
    } else if (itype === CreateWalletType.Image) {
        return { zh_Hans:'创建中...',zh_Hant:'創建中...',en:'' };
    } else if (itype === CreateWalletType.StrandarImport) {
        return { zh_Hans:'导入中...',zh_Hant:'導入中...',en:'' };
    } else if (itype === CreateWalletType.ImageImport) {
        return { zh_Hans:'导入中...',zh_Hant:'導入中...',en:'' };
    } else if (itype === CreateWalletType.FragmentImport) {
        return { zh_Hans:'导入中...',zh_Hant:'導入中...',en:'' };
    } else {
        return { zh_Hans:'创建中...',zh_Hant:'創建中...',en:'' };
    }
};
/**
 * 钱包创建成功操作
 * @param gwlt GlobalWallet
 */
const walletCreated = (gwlt:GlobalWallet) => {
    // 创建钱包基础数据
    const wallet: Wallet = {
        vault: gwlt.vault,
        isBackup: gwlt.isBackup,
        showCurrencys: defalutShowCurrencys,
        currencyRecords: gwlt.currencyRecords,
        changellyPayinAddress:[],
        changellyTempTxs:[]
    };
    const user = getStore('user');
    user.id = gwlt.glwtId;
    user.publicKey = gwlt.publicKey;
    setStore('wallet', wallet);
    setStore('user', user);
};

/**
 * 随机创建钱包
 */
const createWalletRandom = (secrectHash:string) => {
    walletCreated(GlobalWallet.generate(secrectHash));
};

/**
 * 图片创建钱包
 * @param option 参数
 */
const createWalletByImage = async (secrectHash:string) => {
    const vault = await getStore('flags').imgArgon2HashPromise;
    walletCreated(GlobalWallet.generate(secrectHash,vault));
};

/**
 * 通过助记词导入钱包
 */
const importWalletByMnemonic = (secrectHash:string,mnemonic:string) => {
    walletCreated(GlobalWallet.fromMnemonic(secrectHash, mnemonic));
};

/**
 * 冗余助记词导入
 */
const importWalletByFragment = (secrectHash:string,fragment1:string,fragment2:string) => {
    const shares = [fragment1, fragment2].map(v =>
    u8ArrayToHexstr(new Uint8Array(base64ToArrayBuffer(v)))
  );
    const comb = restoreSecret(shares);
    
    walletCreated(GlobalWallet.generate(secrectHash,hexstrToU8Array(comb)));
};

/**
 *
 * @param imagePsw 图片密码
 * @param ahash ahash
 */
export const ahashToArgon2Hash = async (ahash: string, imagePsw: string) => {
    const sha3Hash = await sha3(ahash + imagePsw, false);
    const hash = await calcHashValuePromise(sha3Hash);
    const sha3Hash1 = await sha3(hash, true);
    
    const len = sha3Hash1.length;
    // 生成助记词的随机数仅需要128位即可，这里对256位随机数进行折半取异或的处理
    const sha3Hash2 = getXOR(sha3Hash1.slice(0, len / 2),sha3Hash1.slice(len / 2));

    return generateByHash(sha3Hash2);
};

/**
 * 创建新地址
 */
export const createNewAddr = async (passwd: string, currencyName: string) => {
    const close = popNewLoading({ zh_Hans:'添加中...',zh_Hant:'添加中...',en:'' });
    const wallet = getStore('wallet');
    const mnemonic = await getMnemonic(passwd);
    close.callback(close.widget);
    if (mnemonic) {
        const record = wallet.currencyRecords.filter(v => v.currencyName === currencyName)[0];
        const address = GlobalWallet.getWltAddrByMnemonic(mnemonic,currencyName,record.addrs.length);
        const addrInfo:AddrInfo = {
            addr:address,
            balance: 0,             
            txHistory: [],         
            nonce: 0
        };
        record.addrs.push(addrInfo);
        record.currentAddr = address;
        dataCenter.updateAddrInfo(address, currencyName);
        if (ERC20Tokens[currencyName]) {
            dataCenter.fetchErc20GasLimit(currencyName);
        }
        setStore('wallet/currencyRecords',wallet.currencyRecords);
        popNewMessage({ zh_Hans:'添加成功',zh_Hant:'添加成功',en:'' });
    } else {
        popNewMessage({ zh_Hans:'密码错误',zh_Hant:'密碼錯誤',en:'' });
    }
};

// 删除助记词
export const deleteMnemonic = () => {
    setStore('wallet/isBackup',true);
};

// 记录通过分享片段备份
export const sharePart = () => {
    setStore('wallet/sharePart',true);
};

// 记录通过助计词备份
export const helpWord = () => {
    setStore('wallet/helpWord',true);
};