<div style="{{ it.isLogin ? 'height:0px;' : ''}}overflow:hidden;z-index: 1;">
    <div w-class="netClose">
        <img src="../../res/image/question_blue.png" style="width:32px;margin-right: 10px;"/>
        <span style="margin-right:20px;">网络连接不可用&nbsp;<span style="color:#388EFF;" on-tap="reConnect">点击重连</span></span>
        {{if it.reconnecting}}
        <app-publicComponents-loading-loading2>{}</app-publicComponents-loading-loading2>
        {{end}}
    </div>
</div>