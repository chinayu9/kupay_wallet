<div class="new-page" ev-back-click="backPrePage">
    {{: topBarTitle = {"zh_Hans":"账户","zh_Hant":"賬戶","en":""} }}
    <app-components-topBar-topBar>{title:{{topBarTitle}} }</app-components-topBar-topBar>
    <div w-class="body">
        {{: itemTitle = [
            {"zh_Hans":"备份助记词","zh_Hant":"備份助記詞","en":""},
            {"zh_Hans":"导出私钥","zh_Hant":"導出私鑰","en":""},
            {"zh_Hans":"修改密码","zh_Hant":"修改密碼","en":""},
            {"zh_Hans":"退出钱包","zh_Hant":"退出钱包","en":""}] }}
        <div w-class="other">
            {{for i,v of itemTitle}}
            <div w-class="other-item" on-tap="itemClick(e,{{i}})" on-down="onShow">
                <div w-class="item-title"><pi-ui-lang>{{itemTitle[i]}}</pi-ui-lang></div>
                <img src="app/res/image/right_arrow2_gray.png" height="40px" w-class="rightArrow"/>
            </div>
            {{end}}
        </div>
    </div>
</div>