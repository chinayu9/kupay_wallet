<div w-class="btn {{it.cannotClick?'btn-cannotClick':'' }}" on-tap="doTap" style="{{it.style?it.style:''}} animation:{{it.isAbleBtn?'btnClick 0.2s':''}}">
    {{if it.isString}}
        {{it.name}}
    {{else}}
        <pi-ui-lang>{{it.name}}</pi-ui-lang>
    {{end}}
</div>