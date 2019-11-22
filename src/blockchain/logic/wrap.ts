import { getModulConfig } from '../../app/public/config';

/**
 * 和钱包通信
 */

export const fetchModulConfig = (modulName: string) => {
    return getModulConfig(modulName);
};