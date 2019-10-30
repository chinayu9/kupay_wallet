/**
 * 主动向后端通讯
 */
import { getStoreData, requestAsyncRpc, setStoreData } from '../api/walletApi';
import { getModulConfig, PAGELIMIT, uploadFileUrl } from '../public/config';
import { CloudCurrencyType } from '../public/interface';
import { getStore, setStore } from '../store/memstore';
// tslint:disable-next-line:max-line-length
import { parseCloudAccountDetail, parseCloudBalance, parseConvertLog, parseDividHistory, parseExchangeDetail, parseMiningRank, parseMyInviteRedEnv, parseSendRedEnvLog, splitCloudCurrencyDetail } from '../utils/parse';
import { base64ToFile, getUserInfo, piFetch, popNewMessage, unicodeArray2Str } from '../utils/pureUtils';
import { showError } from '../utils/toolMessages';
import { kpt2kt, largeUnit2SmallUnit } from '../utils/unitTools';

/**
 * 获取指定类型的货币余额
 */
export const getBalance = async (currencyType: CloudCurrencyType) => {
    const msg = { type: 'wallet/account@get', param: { list: `[${currencyType}]` } };
    requestAsyncRpc(msg).then(r => {
        // todo 这里更新余额
    });
};

// ==========================================红包start

/**
 * 兑换邀请码
 */
export const inputInviteCdKey = async (code) => {
    const msg = { type: 'wallet/cloud@input_cd_key', param: { code: code } };
    try {
        const res = await requestAsyncRpc(msg);

        return [res.fuid];
    } catch (err) {
        console.log('input_cd_key--------',err);
        showError(err && (err.result || err.type));

        return;
    }
};

/**
 * 发送红包
 * @param rtype 红包类型
 * @param ctype 货币类型
 * @param totalAmount 总金额
 * @param count 红包数量
 * @param lm 留言
 */
// tslint:disable-next-line:max-line-length
export const  sendRedEnvlope = async (rtype: string, ctype: number, totalAmount: number, redEnvelopeNumber: number, lm: string,secretHash:string) => {
    const msg = {
        type: 'emit_red_bag',
        param: {
            type: Number(rtype),
            priceType: ctype,
            totalPrice: largeUnit2SmallUnit(CloudCurrencyType[ctype], totalAmount),
            count: redEnvelopeNumber,
            desc: lm
        }
    };
    try {
        const res = await requestAsyncRpc(msg);
        return res.value;
    } catch (err) {
        showError(err && (err.result || err.type));

        return;
    }

};
/**
 * 领取红包 获取兑换码
 */
export const takeRedBag = async (rid) => {
    const msg = { type: 'take_red_bag', param: { rid: rid } };
    
    try {
        // tslint:disable-next-line:no-unnecessary-local-variable
        const res = await requestAsyncRpc(msg);

        return res;
    } catch (err) {
        showError(err && (err.result || err.type));
        
        return err;
    }
};

/**
 * 兑换码兑换红包
 */
export const convertRedBag = async (cid) => {
    const msg = { type: 'convert_red_bag', param: { cid: cid } };

    try {
        // tslint:disable-next-line:no-unnecessary-local-variable
        const res = await requestAsyncRpc(msg);

        return res;
    } catch (err) {
        showError(err && (err.result || err.type));

        return;
    }
};

/**
 * 获取红包留言
 * @param cid 兑换码
 */
export const queryRedBagDesc = async (cid: string) => {
    const msg = {
        type: 'query_red_bag_desc',
        param: {
            cid
        }
    };

    return requestAsyncRpc(msg);
};

// ==========================================红包end

/**
 * 挖矿
 */
export const getAward = async () => {
    const msg = { type: 'wallet/cloud@get_award', param: {} };

    try {
        // tslint:disable-next-line:no-unnecessary-local-variable
        const detail = await requestAsyncRpc(msg);
        
        return detail;
        
    } catch (err) {
        showError(err && (err.result || err.type));

        return;
    }
};

/**
 * 设置客户端数据
 */
export const setData = async (param) => {
    const msg = { type: 'wallet/data@set', param: param };

    return requestAsyncRpc(msg);
};

/**
 * 获取客户端数据
 */
export const getData = async (key) => {
    const msg = { type: 'wallet/data@get', param: { key } };

    return requestAsyncRpc(msg);
};

/**
 * 批量获取用户信息
 */
export const getUserList = async (uids: number[], isOpenid?: number) => {
    let msg = {};
    if (isOpenid) {
        msg = { type: 'wallet/user@get_infos', param: { list: `[${uids.toString()}]`, isOpenid } };
    } else {
        msg = { type: 'wallet/user@get_infos', param: { list: `[${uids.toString()}]` } };
    }

    try {
        const res = await requestAsyncRpc(msg);
        if (res.value[0]) {
            const resAry = [];
            for (const element of res.value) {
                resAry.push(JSON.parse(unicodeArray2Str(element)));
            }

            return resAry;
        }
    } catch (err) {
        showError(err && (err.result || err.type));

        return;
    }
};

/**
 * 处理聊天
 */
export const doChat = async () => {
    const msg = { type: 'wallet/cloud@chat', param: {} };

    requestAsyncRpc(msg).then(r => {
        // 通信成功
    });
};

/**
 * 发送验证码
 */
export const sendCode = async (phone: string, num: string,verify:boolean = true) => {
    const msg = { type: 'wallet/sms@send_sms_code', param: { phone, num, name: getModulConfig('WALLET_NAME') } };
    try {
        return await requestAsyncRpc(msg);
    } catch (err) {
        showError(err && (err.result || err.type));

        return;
    }
};

/**
 * 注册手机
 */
export const regPhone = async (phone: string, num:number, code: string) => {
    const msg = { type: 'wallet/user@bind_user', param: { userType:1, user:phone, pwd:code,cmd:num } };
    
    try {
        return await requestAsyncRpc(msg);
    } catch (err) {
        showError(err && (err.result || err.type));

        return;
    }
};

/**
 * 解绑手机
 */
export const unbindPhone = async (code: string) => {
    const param:any = { code };
    const msg = { type: 'wallet/user@unset_phone', param };
    try {
        return await requestAsyncRpc(msg);
    } catch (err) {
        showError(err && (err.result || err.type));

        return;
    }
};

// 更换手机号码
export const changePhone = async (phone:string,code:string) => {
    const param:any = { phone,code };
    const msg = { type:'wallet/user@change_phone',param };
    try {
        return await requestAsyncRpc(msg);
    } catch (err) {
        showError(err && (err.result || err.type));

        return;
    }
};

/**
 * 获取代理
 */
export const getProxy = async () => {
    const msg = { type: 'wallet/proxy@get_proxy', param: {} };

    return requestAsyncRpc(msg);
};

// ===============================充值提现

// 上传文件
export const uploadFile = async (base64) => {
    const file = base64ToFile(base64);
    const formData = new FormData();
    formData.append('upload',file);
    piFetch(`${uploadFileUrl}`, {
        body: formData, // must match 'Content-Type' header
        // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        // credentials: 'include',
        // headers: {
        //     'user-agent': 'Mozilla/4.0 MDN Example'
        // },
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors' // no-cors, cors, *same-origin
        // redirect: 'follow', // manual, *follow, error
        // referrer: 'no-referrer' // *client, no-referrer
    }).then(async res => {
        console.log('uploadFile success ',res);
        popNewMessage('图片上传成功');
        if (res.result === 1) {
            const sid = res.sid;
            const userInfo = await getStoreData('user/info');
            userInfo.avatar = sid;
            setStoreData('user/info',userInfo);
        }
    }).catch(err => {
        console.log('uploadFile fail ',err);
        popNewMessage('图片上传失败');
    });
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

    return requestAsyncRpc(msg);
};

/**
 * 获取邀请好友accId
 */
export const getInviteUserAccIds = () => {
    const msg = {
        type: 'wallet/cloud@get_invites',
        param: {}
    };

    return requestAsyncRpc(msg);
};

/**
 * 获取iOS支付的商品信息
 */
export const getAppleGoods = () => {
    const msg = {
        type: 'get_apple_goods',
        param: {}
    };

    return requestAsyncRpc(msg);
};

/**
 * 获取用户最近玩的游戏
 */
export const getUserRecentGame = (accid:string,count:number) => {
    const msg = {
        type:'wallet/oAuth@get_recent_login',
        param:{
            acc_id:accid,
            count
        }
    };

    return requestAsyncRpc(msg).then(r => {
        const list = [];
        if (r.result === 1 && r.app_login) {
            r.app_login.forEach(v => {
                list.push(v[1]);
            });
        }
        
        return list;
    });
};

/**
 * 查询红包兑换记录
 */
export const queryConvertLog = (start?:string) => {
    let msg;
    if (start) {
        msg = {
            type: 'query_convert_log',
            param: {
                start,
                count: PAGELIMIT
            }
        };
    } else {
        msg = {
            type: 'query_convert_log',
            param: {
                count: PAGELIMIT
            }
        };
    }

    return requestAsyncRpc(msg).then(detail => {
        const data = parseConvertLog(detail,start);
        setStore('activity/luckyMoney/exchange',data);

        return data;
    });
};

/**
 * 获取分红历史记录
 */
export const getDividHistory = (start = '') => {
    const msg = { 
        type: 'wallet/cloud@get_bonus_info', 
        param: {
            start,
            count:PAGELIMIT
        } 
    };
    
    return requestAsyncRpc(msg).then(data => {
        const dividHistory = parseDividHistory(data);
        setStore('activity/dividend/history', dividHistory);

        return dividHistory;
    });
};

/**
 * 查询某个红包兑换详情
 */
export const queryDetailLog = (uid:number,rid: string,accId?:string) => {
    const msg = {
        type: 'query_detail_log',
        param: {}
    };
    if (accId) {  // 与聊天通用的账户id
        msg.param = {
            acc_id: accId,
            rid
        };
    } else {
        msg.param = {
            uid,
            rid
        };
    }
    if (rid === '-1') return;

    return requestAsyncRpc(msg).then(detail => {
        return parseExchangeDetail(detail.value);
    });
        
};

// 获取好友嗨豆排名
export const getFriendsKTTops =  (arr:any) => {
    const msg = { type:'wallet/cloud@finds_high_top',param:{ finds:JSON.stringify(arr) } };

    return  requestAsyncRpc(msg).then(data => {
        console.log('获取好友排名========================',data);

        return parseMiningRank(data);
    });
};

/**
 * 获取邀请码领取明细
 */
export const getInviteCodeDetail = () => {
    const msg = { type: 'wallet/cloud@get_invite_code_detail', param: {} };
    
    return requestAsyncRpc(msg).then(data => {
        return parseMyInviteRedEnv(data.value);
    });
};

/**
 * 查询发送红包记录
 */
export const querySendRedEnvelopeRecord = (start?: string) => {
    let msg;
    if (start) {
        msg = {
            type: 'query_emit_log',
            param: {
                start,
                count: PAGELIMIT
            }
        };
    } else {
        msg = {
            type: 'query_emit_log',
            param: {
                count: PAGELIMIT
            }
        };
    }

    return requestAsyncRpc(msg).then(detail => {
        const data = parseSendRedEnvLog(detail.value,start);
        setStore('activity/luckyMoney/sends',data);

        return data;
    });

};

/**
 * 获取后台发起分红历史记录
 */
export const getBonusHistory = () => {
    const msg = { type:'wallet/cloud@get_bonus_history',param:{} };

    return requestAsyncRpc(msg);
};

/**
 * 获取分红汇总信息
 */
export const getDividend = async () => {
    const msg = { type: 'wallet/cloud@get_bonus_total', param: {} };
    const data = await getBonusHistory();
    // TODO 这里进行单位转换
    const num = (data.value !== '') ? data.value[0][1] : 0;
    const yearIncome = (num * 365 / 7).toFixed(4); 
    
    return requestAsyncRpc(msg).then(data => {
        const dividend: any = {
            totalDivid: data.value[0],
            totalDays: data.value[1],
            thisDivid: data.value[2],
            yearIncome: yearIncome
        };
        setStore('dividTotal', dividend);

        return dividend;
    });
};

/**
 * 获取单个用户信息
 */
export const getOneUserInfo = (uids: number[], isOpenid?: number) => {
    let msg = {};
    if (isOpenid) {
        msg = { type: 'wallet/user@get_infos', param: { list: `[${uids.toString()}]`, isOpenid } };
    } else {
        msg = { type: 'wallet/user@get_infos', param: { list: `[${uids.toString()}]` } };
    }

    return requestAsyncRpc(msg).then(res => {
        if (res.value[0]) {

            return JSON.parse(unicodeArray2Str(res.value[0]));
        }
    });
   
};

/**
 * 获取邀请码
 */
export const getInviteCode = () => {
    const msg = { type: 'wallet/cloud@get_invite_code', param: {} };

    return requestAsyncRpc(msg);
};

/**
 * 获取挖矿汇总信息
 */
export const getMining = () => {
    const msg = { type: 'wallet/cloud@get_mine_total', param: {} };
    
    return requestAsyncRpc(msg).then(data => {
        
        const totalNum = kpt2kt(data.mine_total);
        const holdNum = kpt2kt(data.mines);
        const today = kpt2kt(data.today);
        let nowNum = Math.round((totalNum - holdNum + today) * 0.25) - today;  // 今日可挖数量为矿山剩余量的0.25减去今日已挖 再四舍五入取整
        if (nowNum <= 0) {
            nowNum = 0;  // 如果今日可挖小于等于0，表示现在不能挖
        } else if ((totalNum - holdNum) >= 100) {
            nowNum = (nowNum < 100 && (totalNum - holdNum) >= 100) ? 100 : nowNum;  // 如果今日可挖小于100，且矿山剩余量大于100，则今日可挖100
        } else {
            nowNum = totalNum - holdNum;  // 如果矿山剩余量小于100，则本次挖完所有剩余量
        }
        const mining: any = {
            totalNum: totalNum,
            thisNum: nowNum,
            holdNum: holdNum
        };
        console.log('-------------------',mining);
        setStore('activity/mining/total', mining);

        return mining;
    });
};

/**
 * 获取推荐游戏的APPid
 */
export const getRecommendationsList = () => {
    const msg = {
        type:'wallet/oAuth@get_recommend_app',
        param:{
        }
    };

    return requestAsyncRpc(msg).then(data => {
        if (data.result === 1) {
            return data.app_ids;
        }
    });
};

/**
 * 批量获取游戏信息
 * @param appId 游戏ID
 */
export const getGameInfo = (appId:any) => {
    const msg = {
        type:'wallet/oAuth@get_app_detail',
        param:{
            app_ids:appId
        }
    };

    return requestAsyncRpc(msg).then(data => {
        // debugger;
        // tslint:disable-next-line:no-unnecessary-local-variable
        const gameList = [
            [
                '仙之侠道',
                { icon:'../../../res/image/game/xianzhixiadao.png',bg:'../../../res/image/game/xianzhixiadaoBg.png' },
                {
                    usePi:false,
                    desc:'2019最热唯美奇幻手游',
                    webviewName:'fairyChivalry',
                    buttonMod:3,
                    accId:'268828',
                    groupId:10001,
                    appid:'102',
                    screenMode:'portrait'
                },
                'http://ysxzxd.17youx.cn/dst/boot/yineng/yineng.html'
                // 'http://192.168.31.226/game/app/boot/index.html'
            ],
            [
                '一代掌门',
                { icon:'../../../res/image/game/yidaizhangmen.png',bg:'../../../res/image/game/yidaizhangmen.png' },
                {
                    usePi:true,
                    desc:'2019最热唯美奇幻手游',
                    webviewName:'chairMan',
                    buttonMod:2,
                    accId:'268828',
                    groupId:10001,
                    appid:'103',
                    screenMode:'landscape'
                },
                'http://gcydzm.17youx.cn:8777/client/boot/haohai.html'
            ]
        ];

        return gameList;
    });
};
/**
 * 获取全部游戏
 */
export const getAllGame = () => {
    const msg = {
        type:'wallet/oAuth@get_all_app',
        param:{}
    };
    
    return requestAsyncRpc(msg).then(data => {
        if (data.result === 1) {
            return data.app_ids;
        }
    });
};

// 获取热门游戏
export const getHotGame = () => {
    const msg = {
        type:'wallet/oAuth@get_hot_app',
        param:{}
    };
    
    return requestAsyncRpc(msg).then(data => {
        if (data.result === 1) {
            return data.app_ids;
        }
    });
};

export const getOpenId = (appId:string) => {
    const msg = { type: 'get_openid', param: { appid:appId } };

    return requestAsyncRpc(msg).then(async res => {
        const info = await getStoreData('user/info',{});
        // tslint:disable-next-line:no-unnecessary-local-variable
        const data = {
            openId: res.openid, 
            ...info
        };
        
        return data;
    });
};