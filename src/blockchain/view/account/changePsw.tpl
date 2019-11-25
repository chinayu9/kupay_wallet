<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
        {{: title = {"zh_Hans":"设置新密码","zh_Hant":"設置新密碼","en":""} }}
        <app-components-topBar-topBar>{"title":{{ title }} }</app-components-topBar-topBar>
        <div w-class="body">
            {{: createTips = {"zh_Hans":"设置支付密码","zh_Hant":"設置支付密碼","en":""} }}
            <div w-class="create-tips"><pi-ui-lang>{{createTips}}</pi-ui-lang></div>
            {{: createTips2 = {"zh_Hans":"该密码用于保护钱包，好嗨不储存用户密码，如果您忘了密码，好嗨将无法帮助你重置。请不要丢失或忘记。","zh_Hant":"該密碼用於保護錢包，好嗨不儲存用戶密碼，如果您忘了密碼，好嗨將無法幫助你重置。請不要丟失或忘記。","en":""} }}
            <div w-class="create-tips2"><pi-ui-lang>{{createTips2}}</pi-ui-lang></div>
            <div w-class="bottom-box">
                <div ev-psw-change="pswChange" ev-psw-clear="pwsClear"><blockchain-components-password-password>{hideTips:true}</blockchain-components-password-password></div>
                <div w-class="input-father" ev-input-change="pswConfirmChange">
                    {{: inputPlace = {"zh_Hans":"重复密码","zh_Hant":"重複密碼","en":""} }}
                    <blockchain-components-input-suffixInput>{isShow:true,itype:"password",placeHolder:{{inputPlace}},clearable:true,available:{{it.pswEqualed}}}</blockchain-components-input-suffixInput>
                </div>
                <div ev-btn-tap="changePswClick" w-class="btn">
                    {{: btnName = {"zh_Hans":"确认修改","zh_Hant":"確認修改","en":""} }}
                    <blockchain-components-btn-btn>{"name":{{btnName}},"types":"big","color":"blue","cannotClick":{{!it.pswEqualed}} }</blockchain-components-btn-btn>
                </div>
            </div>
        </div>
    </div>