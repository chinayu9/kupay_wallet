<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    <div w-class="body">
        {{: createTips = {"zh_Hans":"按序输入助记词","zh_Hant":"按序輸入助記詞","en":""} }}
        <div w-class="create-tips"><div w-class="tip-divid"></div><pi-ui-lang>{{createTips}}</pi-ui-lang><img src="../../res/images/41_blue.png" w-class="what-is" on-tap="whatIsMnemonicClick"/></div>
        {{: desc = {"zh_Hans":"请输入您创建账号时备份的12个英文单词，助记词登录能导入云端和本地所有资产","zh_Hant":"請輸入您創建賬號時備份的12個英文單詞，助記詞登錄能導入雲端和本地所有資產","en":""} }}
        <div w-class="desc"><pi-ui-lang>{{desc}}</pi-ui-lang></div>
        <div w-class="bottom-box">
            <div w-class="textarea-father" ev-input-change="inputChange">
                {{:let inputPlace = {"zh_Hans":"输入助记词，空格键分隔","zh_Hant":"輸入助記詞，空格鍵分隔","en":""} }}
                <app-components-textarea-textarea>{placeHolder:{{inputPlace}} }</app-components-textarea-textarea>
            </div>
            <div ev-btn-tap="nextClick" w-class="btn">
                {{: btnName = {"zh_Hans":"下一步","zh_Hant":"下一步","en":""} }}
                <blockchain-components-btn-btn>{"name":{{btnName}},"types":"big","color":"blue"}</blockchain-components-btn-btn>
            </div>
        </div>
    </div>
</div>