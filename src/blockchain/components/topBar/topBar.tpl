{{let flag=it.background && it.background!='' && it.background!='#fff'}}
{{let flag1=it.background && it.background!=''}}
<div w-class="outer {{flag1?'':'outer-bottom'}}" style="background: {{it.background}}">
    <app-publicComponents-blankDiv-topDiv></app-publicComponents-blankDiv-topDiv>
    <div w-class="ga-top-banner" >
        <img src="{{it.avatar}}" w-class="avatar" />
        <div w-class="container">
            {{if typeof(it.title) == "string"}}
            <span>{{it.title}}</span>
            {{else}}
            <pi-ui-lang>{{it.title}}</pi-ui-lang>
            {{end}}
        </div>
        {{if !it.isBackup}}
        <div w-class="box"><span w-class="dot"></span>备份</div>
        {{end}}
    </div>
</div>