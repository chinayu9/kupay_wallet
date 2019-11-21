<div style="width:100%;height:100%;display: flex;" class="new-page1">
    <div w-class="tabs"  ev-chat-square-change-tab="setActiveTab">
        {{for i, v of it.tabBarList}}
            <div style="visibility: {{v.modulName == it.isActive ? 'visible' : 'hidden'}}; z-index:{{v.modulName == it.isActive ? 0 :-1}}; position:absolute; width:100%;height:100%;">
                <widget w-tag={{v.components}} >{ isActive:{{v.modulName == it.isActive}} }</widget>
            </div>
        {{end}}
    </div>  
    
    <div w-class="ga-bottom-tab-bar-container" >
        <div style=" display: flex;height: 110px;width: 100%;">
            {{for index,item of it.tabBarList}}
            <div w-class="ga-tab-bar-item {{it.isActive == item.modulName ? 'ga-tab-bar-item-active' : ''}}" on-down="tabBarChangeListener(e,{{index}})">
                <img src="../../res/images/{{it.isActive == item.modulName ? item.iconActive : item.icon}}" w-class="ga-tab-bar-icon" />
                <span w-class="ga-tab-bar-text">
                    <pi-ui-lang>{{item.text}}</pi-ui-lang>
                </span>
            </div>
            {{end}}
        </div>
    </div>
    
    </div>
    