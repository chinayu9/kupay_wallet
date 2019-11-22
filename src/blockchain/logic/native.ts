/**
 * 一些底层操作
 */
import { ImagePicker } from '../../pi/browser/imagePicker';
import { piRequire } from '../utils/commonjsTools';
import { popNewLoading } from '../utils/tools';

export const selectImage = (ok?,cancel?) => {
    console.log('选择图片');
    const imagePicker = new ImagePicker();
    imagePicker.init();
    imagePicker.selectFromLocal({
        success: (width, height, url) => {
            ok && ok(width, height, url);
            close && close.callback(close.widget);
        },
        fail: (result) => {
            cancel && cancel(result);
            close && close.callback(close.widget);
        },
        useCamera: 1,
        single: 1,
        max: 1
    });
    let close;
    setTimeout(() => {
        close = popNewLoading({ zh_Hans:'导入中...',zh_Hant:'導入中...',en:'' });
    },100);
    
    return imagePicker;
};

/**
 * 二维码扫描
 */
export const doScanQrCode = (ok?,cancel?) => {
    piRequire(['pi/browser/qrcode']).then(mods => {
        const QRCode = mods[0].QRCode;
        const qrcode = new QRCode();
        qrcode.init();
        qrcode.scan({
            success: (res) => {
                ok && ok(res);
                console.log('scan-------------',res);
                qrcode.close({
                    success: (r) => {
                        console.log(`close result:${r}`);
                    }
                });
            },
            fail: (r) => {
                cancel && cancel();
                console.log(`scan fail:${r}`);
                qrcode.close({
                    success: (r) => {
                        console.log(`close result:${r}`);
                    }
                });
            }
        });
        
    });
};

/**
 * 截屏
 */
export const makeScreenShot = (okCB?,errCB?) => {
    piRequire(['pi/browser/shareToPlatforms']).then(mods => {
        const ShareToPlatforms = mods[0].ShareToPlatforms;
        ShareToPlatforms.makeScreenShot({
            success: (result) => { 
                okCB && okCB(result);
            },
            fail: (result) => { 
                errCB && errCB(result);
            }
        });
    });
    
};
