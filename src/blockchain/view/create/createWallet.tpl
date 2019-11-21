<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    {{: randomTitle = {"zh_Hans":"新区块链账号","zh_Hant":"新區塊鏈賬號","en":""} }}
    {{: imageTitle = {"zh_Hans":"设置密码","zh_Hant":"設置密碼","en":""} }}
    {{: topBarTitle = it.itype === it.createWalletType.Random ? randomTitle : imageTitle}}
    <app-components-topBar-topBar>{"title":{{ topBarTitle }} }</app-components-topBar-topBar>
    <div w-class="body">
        {{: createTips = {"zh_Hans":"设置支付密码","zh_Hant":"設置支付密碼","en":""} }}
        <div w-class="create-tips"><pi-ui-lang>{{createTips}}</pi-ui-lang></div>
        {{: createTips2 = {"zh_Hans":"该密码用于保护钱包，好嗨不储存用户密码，如果您忘了密码，好嗨将无法帮助你重置。请不要丢失或忘记。","zh_Hant":"該密碼用於保護錢包，好嗨不儲存用戶密碼，如果您忘了密碼，好嗨將無法幫助你重置。請不要丟失或忘記。","en":""} }}
        <div w-class="create-tips2"><pi-ui-lang>{{createTips2}}</pi-ui-lang></div>
        <div w-class="bottom-box">
            <div ev-psw-change="pswChange" ev-psw-clear="pwsClear"><app-components-password-password>{hideTips:true}</app-components-password-password></div>
            <div w-class="input-father" ev-input-change="pswConfirmChange">
                {{: inputPlace = {"zh_Hans":"重复密码","zh_Hant":"重複密碼","en":""} }}
                <app-components-input-suffixInput>{isShow:true,itype:"password",placeHolder:{{inputPlace}},clearable:true,available:{{it.pswEqualed}}}</app-components-input-suffixInput>
            </div>
            <div w-class="registered-protocol" ev-checkbox-click="checkBoxClick">
                <span w-class="user-agree"><pi-ui-lang>{"zh_Hans":"确认即代表您同意","zh_Hant":"確認即代表您同意","en":""}</pi-ui-lang></span>
                <span w-class="user-protocol" on-tap="agreementClick"><pi-ui-lang>{"zh_Hans":"用户协议及隐私服务","zh_Hant":"用戶協議及隱私服務","en":""}</pi-ui-lang></span>
            </div>
            <div ev-btn-tap="createClick" w-class="btn">
                {{: btnName = {"zh_Hans":"继续","zh_Hant":"繼續","en":""} }}
                <app-components1-btn-btn>{"name":{{btnName}},"types":"big","color":"blue","cannotClick":{{!it.userProtocolReaded}} }</app-components1-btn-btn>
            </div>
            {{: imageCreate = {"zh_Hans":"用图片创建钱包","zh_Hant":"用圖片創建錢包","en":""} }}
            {{if it.itype === it.createWalletType.Random}}
            <div w-class="login-btns">
                <div w-class="login-btnBox1" on-tap="haveAccountClick">
                    <pi-ui-lang w-class="login-btn" >{{imageCreate}}</pi-ui-lang>
                </div>
            </div>
            {{end}}
        </div>
    </div>
</div>