<div class="new-page1" w-class="new-page" ev-back-click="backPrePage">
        {{: topBarTitle = {"zh_Hans":"备份助记词","zh_Hant":"備份助記詞","en":""} }}
    <app-components-topBar-topBar>{"title":{{topBarTitle}} }</app-components-topBar-topBar>
    <div w-class="body">
            {{: title = {"zh_Hans":"分享片段给好友","zh_Hant":"分享片段給好友","en":""} }}
            {{: content = {"zh_Hans":"好嗨已将您的助记词分割成三份，任意两份即可恢复您的助记词，请发送给三个不同好友保存，助记词是您找回账号的唯一凭证，请务必妥善保管。","zh_Hant":"好嗨已將您的助記詞分割成三份，任意兩份即可恢復您的助記詞，請發送給三個不同好友保存，助記詞是您找回賬號的唯一憑證，請務必妥善保管。","en":""} }}
        <blockchain-view-components-tipsCard>{contentStyle:"color:#ef3838;",title:{{title}} ,content:{{content}} }</blockchain-view-components-tipsCard>
        <div w-class="bottom-box">
            {{for i,v of it.successList}}
            <div w-class="item {{v?'item-active' :''}}" on-tap="shareItemClick(e,{{i}})">
                <div w-class="share-box">
                    <div w-class="share-title">
                        <pi-ui-lang>{"zh_Hans":"分享给好友","zh_Hant":"分享給好友","en":""}</pi-ui-lang>
                    </div>
                    <div w-class="share-fragment">{{it.encryptFragments[i]}}</div>
                </div>
                <div w-class="choose-box">
                    {{if v}}
                    <img src="../../res/images/icon_right2.png" w-class="choosed"/>
                    {{else}}
                    <img src="../../res/images/icon_right3.png" w-class="choosed"/>
                    {{end}}
                </div>
            </div>
            {{end}}
        </div>
        {{: sure = {"zh_Hans":"备份完成","zh_Hant":"備份完成","en":""} }}
        <div ev-btn-tap="allShared" w-class="btn"><blockchain-components-btn-btn>{"name":{{sure}},"types":"big","color":"blue"}</blockchain-components-btn-btn></div>
    </div>
</div>