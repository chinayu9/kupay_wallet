import { getModulConfig } from '../../app/public/config';
import { getUserInfo } from '../../app/utils/pureUtils';

/**
 * 和钱包通信
 */

export const fetchModulConfig = (modulName: string) => {
    return getModulConfig(modulName);
};

// 获取用户信息
export const fetchUserInfo = () => {
    return getUserInfo();
};