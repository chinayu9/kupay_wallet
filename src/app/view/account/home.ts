
import { popNew } from '../../../pi/ui/root';
import { getLang } from '../../../pi/util/lang';
import { Forelet } from '../../../pi/widget/forelet';
import { Widget } from '../../../pi/widget/widget';
import { clearUser } from '../../api/walletApi';
import { uploadFile } from '../../net/pull';
import { registerStoreData } from '../../postMessage/listenerStore';
import { register, setStore } from '../../store/memstore';
import { piRequire } from '../../utils/commonjsTools';
import { getUserInfo, popNewMessage, rippleShow } from '../../utils/pureUtils';
// tslint:disable-next-line:max-line-length
import { changeWalletName, changeWalletNote, changeWalletSex, getUserAvatar, imgResize, logoutAccount, walletNameAvailable } from '../../utils/tools';
import { gotoPlay } from '../base/app';
import { loadSettingSource } from '../base/sourceLoaded';
// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords 
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
interface Props {
    isTourist:boolean;
    backup:boolean;
    canEditName: boolean;
    editName:string;
    chooseImage:boolean;
    avatarHtml:string;
    avatar:string;
}
/**
 * account home
 */
export class AccountHome extends Widget {
    public ok: () => void;
    public language: any;
    public props:Props = {
        isTourist:false,
        backup:false,
        canEditName: false,
        chooseImage: false,
        avatarHtml: '',
        editName:'',
        avatar: ''

    };
    public create() {
        super.create();
        this.language = this.config.value[getLang()];
        this.state = STATE;
        this.init();
    }

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
    }
    public init() {
        Promise.all([getUserInfo()]).then(([userInfo]) => {
            if (userInfo.phoneNumber) {
                const str = String(userInfo.phoneNumber).substr(3, 6);
                this.state.phone = userInfo.phoneNumber.replace(str, '******');
            }
            this.state.nickName = userInfo.nickName ? userInfo.nickName : this.language.defaultName;
            this.props.editName = this.state.nickName;
            this.props.avatar = userInfo.avatar;
            this.state.sex = userInfo.sex;
            this.state.note = userInfo.note ? userInfo.note :'';
            this.paint();
        });
    }

    /**
     * 返回上一页
     */
    public backPrePage() {
        this.ok && this.ok();
    }

    // 动画效果执行
    public onShow(e:any) {
        rippleShow(e);
    }

    /**
     * 修改名字输入框取消聚焦
     */
    public walletNameInputBlur(e: any) {
        const v = e.value;
        this.props.canEditName = false;
        if (!walletNameAvailable(v)) {
            popNewMessage(this.language.tips[0]);

            return;
        }
        if (v !== this.state.nickName) {
            this.state.nickName = v;
            changeWalletName(v);
        }
        this.paint();
    }
    /**
     * 修改名字输入框值变化
     */
    public userNameChange(e:any) {
        this.props.editName = e.value;
    }

    public uploadAvatar() {
        piRequire(['app/utils/native']).then((r) => {
            const imagePicker = r[0].selectImage((width, height, url) => {
                console.log('selectImage url = ',url);
                if (!url) {
                    return;
                }
                // tslint:disable-next-line:max-line-length
                this.props.avatarHtml = `<div style="background-image: url(${url});width: 80px;height: 80px;background-size: cover;background-position: center;background-repeat: no-repeat;border-radius:50%"></div>`;
                this.props.chooseImage = true;
                this.props.avatar = url;
                this.paint();
                imagePicker.getContent({
                    quality:70,
                    success(buffer:ArrayBuffer) {
                        imgResize(buffer,(res) => {
                            uploadFile(res.base64);
                        });
                    }
                });
            });
        });
        
    }

    /**
     * 绑定手机号
     */
    public changePhone() {
        if (!this.state.phone) {  // 绑定
            const loading = popNew('app-publicComponents-loading-loading1');
            loadSettingSource().then(() => {
                popNew('app-view-setting-phone');
                loading.callback(loading.widget);
            });
        } else { // 重新绑定
            const loading = popNew('app-publicComponents-loading-loading1');
            loadSettingSource().then(() => {
                popNew('app-view-setting-unbindPhone');
                loading.callback(loading.widget);
            });
        }
    }

    /**
     * 点击可输入用户名
     */
    public changeInput() {
        if (this.props.canEditName) {
            const v = this.props.editName;
            if (!walletNameAvailable(v)) {
                popNewMessage(this.language.tips[0]);
    
                return;
            } else {
                if (v !== this.state.nickName) {
                    this.state.nickName = v;
                    changeWalletName(v);
                    popNewMessage(this.language.tips[2]);
                    this.props.canEditName = false;
                } else {
                    this.props.canEditName = false;
                }
            }
            
        } else {
            this.props.canEditName = true;
            
            setTimeout(() => {
                const input =  document.getElementById('nameInput').getElementsByTagName('input')[0];
                input.setSelectionRange(-1, -1);
                input.focus();
            }, 0);
            
        }
        this.paint(true);
    }

    /**
     * 修改名称
     */
    public changeName() {
        const loading = popNew('app-publicComponents-loading-loading1');
        loadSettingSource().then(() => {
            // tslint:disable-next-line:max-line-length
            popNew('chat-client-app-widget-pageEdit-pageEdit',{ title:'修改昵称', contentInput:this.state.nickName,maxLength:10 },async (res:any) => {
                await changeWalletName(res.content);
                this.state.nickName = res.content;
                popNewMessage('修改昵称成功');
                this.paint();
            });
            loading.callback(loading.widget);
        });
    }

    /**
     * 修改个性签名
     */
    public changeSignature() {
        const loading = popNew('app-publicComponents-loading-loading1');
        loadSettingSource().then(() => {
            popNew('chat-client-app-widget-pageEdit-pageEdit',{ title:'修改个性签名', contentInput:this.state.note,maxLength:140 },(res:any) => {
                changeWalletNote(res.content);
                this.state.note = res.content;
                popNewMessage('修改个性签名成功');
                this.paint();
            });
            loading.callback(loading.widget);
        });
       
    }

    /**
     * 注销账户
     */
    public logOutDel() {
        const loading = popNew('app-publicComponents-loading-loading1');
        loadSettingSource().then(() => {
            popNew('app-components-modalBox-modalBox', { title: '确认退出', content:'' }, () => {
                
                // 清除账号数据
                clearUser().then(() => {
                    // 初始化数据
                    logoutAccount();
                    setStore('flags/authorized',false);
                    setTimeout(() => {
                        this.backPrePage();
                        gotoPlay();
                    }, 300);

                }).catch(err => {
                    // TODO
                });
                
            });
            loading.callback(loading.widget);
        }).catch(err => {
            // TODO
        });
        
    }

    /** 
     * 选择性别
     */
    public changeSex() {
        popNew('app-components1-checkSex-checkSex', { title:'选择性别',active:this.state.sex }, async (r: any) => {
            await changeWalletSex(r);
            popNewMessage('修改性别成功');
            this.paint();
        });
    }
}

let STATE = {
    nickName: '',
    phone: '',
    sex:2,
    note:''
};
registerStoreData('user', (r) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    let phone = '';
    if (r.info.phoneNumber) {
        const str = String(r.info.phoneNumber).substr(3, 6);
        phone = r.info.phoneNumber.replace(str, '******');
    }
    STATE = {
        nickName: r.info.nickName,
        phone,
        sex:r.info.sex,
        note:r.info.note ? r.info.note :''
    };
    if (w) {
        w.props.avatar = getUserAvatar(r.info.avatar);
        w.paint();
    }
    forelet.paint(STATE);    
});

register('setting/language', (r) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.language = w.config.value[r];
        w.paint();
    }
});
