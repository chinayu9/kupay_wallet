<div style="width:100%;height:100%;display: flex;">
<div w-class="tabs"  ev-chat-square-change-tab="setActiveTab">
{{if it.types === 0}}
    {{for i, v of it.tabBarList}}
        {{if v.modulName == it.isActive}}
        <widget w-tag={{v.components}} style="visibility:visible;z-index:0;position:absolute;width:100%;height:100%;">{isActive:{{i == it.isActive}},userInfo:{{it.userInfo}} }</widget>
        {{elseif it.old.isActive == v.modulName}}
        <widget w-tag={{v.components}} style="visibility:hidden;z-index:-1;position: absolute;width:100%;height:100%;">{isActive:{{i == it.isActive}},userInfo:{{it.userInfo}} }</widget>
        {{end}}
    {{end}}
{{elseif it.types === 1}}
    {{let index = it.tabBarList.findIndex(function(v){return v.modulName == it.isActive})}}
    <widget w-tag={{it.tabBarList[index].components}} style="position:absolute;width:100%;height:100%;">{isActive:false,userInfo:{{it.userInfo}},gameName:{{it.gameName}}, activeTab:{{it.activeTab}} }</widget>
{{else}}
    {{for i, v of it.tabBarList}}
        <div ev-myHome="myHome" style="visibility: {{v.modulName == it.isActive ? 'visible' : 'hidden'}}; z-index:{{v.modulName == it.isActive ? 0 :-1}}; position:absolute; width:100%;height:100%;">
            <widget w-tag={{v.components}} >{isActive:{{v.modulName == it.isActive}},userInfo:{{it.userInfo}},gameName:{{it.gameName}}, activeTab:{{it.activeTab}} }</widget>
        </div>
    {{end}}
{{end}}
</div>  

<div w-class="ga-bottom-tab-bar-container" class="{{it.tabBarAnimateClasss}}" >
    <div style=" display: flex;height: 110px;width: 100%;">
        {{for index,item of it.tabBarList}}
        <div w-class="ga-tab-bar-item {{it.isActive == item.modulName ? 'ga-tab-bar-item-active' : ''}}" on-down="tabBarChangeListener(e,{{index}})">
            <img src="../../res/image1/{{it.isActive == item.modulName ? item.iconActive : item.icon}}" w-class="ga-tab-bar-icon" />
            <span w-class="ga-tab-bar-text">
                <pi-ui-lang>{{item.text}}</pi-ui-lang>
            </span>
        </div>
        {{end}}
    </div>
</div>

</div>
