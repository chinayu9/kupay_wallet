<div class="new-page" ev-back-click="backPrePage" w-class="newPage">
    {{: topBarTitle = {"zh_Hans":"账户","zh_Hant":"賬戶","en":""} }}
    <app-components-topBar-topBar>{title:{{topBarTitle}} }</app-components-topBar-topBar>
    <div w-class="body">
        <div w-class="other">
            <div on-tap="uploadAvatar" on-down="onShow" ev-uploadAvatar="uploadAvatar">
                {{: itemTitle = [
                {"zh_Hans":"头像","zh_Hant":"頭像","en":""},
                {"zh_Hans":"昵称","zh_Hant":"暱稱","en":""}, 
                {"zh_Hans":"性别","zh_Hant":"性別","en":""},  
                {"zh_Hans":"个性签名","zh_Hant":"個性簽名","en":""}, 
                {"zh_Hans":"手机号","zh_Hant":"手機號","en":""}        
                ] }}
                
                {{: phone = {"zh_Hans":it1.phone,"zh_Hant":it1.phone,"en":""} }}
                {{: bindPhone = {"zh_Hans":"未设置","zh_Hant":"未設置","en":""} }}
                <app-components-basicItem-basicItem>{name:{{itemTitle[0]}},img:true,chooseImage:{{it.chooseImage}},avatarHtml:{{it.avatarHtml}},avatar:{{it1.avatar}} }</app-components-basicItem-basicItem>
            </div>
            <div on-tap="changeName" on-down="onShow">
                <app-components-basicItem-basicItem>{name:{{itemTitle[1]}},describe:{{it1.nickName}} }</app-components-basicItem-basicItem>
            </div>
            <div on-tap="changeSex" on-down="onShow">
                {{: activeSex = (it1.sex!=2?(it1.sex==0?'男':'女'):bindPhone)}}
                <app-components-basicItem-basicItem>{name:{{itemTitle[2]}},describe:{{activeSex}} }</app-components-basicItem-basicItem>
            </div>
           
        </div>
        <div w-class="other">
            <div on-tap="changeSignature" on-down="onShow">
                <app-components-basicItem-basicItem>{name:{{itemTitle[3]}},describe:{{it1.note!=''?it1.note:bindPhone}} }</app-components-basicItem-basicItem>
            </div>
            <div on-tap="changePhone" on-down="onShow">
                {{if it1.phone.indexOf('*') > 0}}
                <div w-class="other-item" ev-switch-click="onSwitchChange">
                    <span w-class="item-title"><pi-ui-lang>{{itemTitle[4]}}</pi-ui-lang></span>
                    <span w-class="tag">
                        <pi-ui-lang>{{phone}}</pi-ui-lang>
                    </span>
                </div>
                {{else}}
                <app-components-basicItem-basicItem>{name:{{itemTitle[4]}},describe:{{bindPhone}} }</app-components-basicItem-basicItem>
                {{end}}
            </div>
        </div>
        <div w-class="btn" on-tap="logOutDel" on-down="onShow">退出登录</div>
        
    </div>
</div>