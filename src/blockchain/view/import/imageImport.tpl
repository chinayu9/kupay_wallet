<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    <div w-class="body">
        <div w-class="box-content"><pi-ui-lang>{"zh_Hans":"填入创建时的原图片和图片密码","zh_Hant":"填入創建時的原圖片和圖片密碼","en":""}</pi-ui-lang></div>
        <div w-class="image-psw-container" on-tap="imagePswClick">
            {{: inputPlace = {"zh_Hans":"4个中文字符或者8个英文字符以上","zh_Hant":"4個中文字元或者8個英文字元以上","en":""} }}
            <div w-class="input-father" ev-input-change="imagePswChange">
                <blockchain-components-input-suffixInput>{isCenter:true,itype:"text",placeHolder:{{inputPlace}},clearable:true,available:{{it.imagePswAvailable}},closeEye:false}</blockchain-components-input-suffixInput>
            </div>
        </div>
        <div w-class="bottom-box">
            <div w-class="choose-image-container" on-tap="selectImageClick">
                {{if !it.chooseImage}}
                <div w-class="choose-image-text">+ <pi-ui-lang>{"zh_Hans":"选择照片","zh_Hant":"選擇照片","en":""}</pi-ui-lang>
                </div>
                {{else}}
                <widget w-tag="pi-ui-html" w-class="ui-html">{{it.imageHtml}}</widget>
                {{end}}
            </div>
            <div ev-btn-tap="nextClick" w-class="btn">
                {{: btnName = {"zh_Hans":"下一步","zh_Hant":"下一步","en":""} }}
                <blockchain-components-btn-btn>{"name":{{btnName}},"types":"big","color":"blue"}</blockchain-components-btn-btn>
            </div>
        </div>
    </div>
</div>