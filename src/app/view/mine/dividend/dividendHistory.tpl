{{: it=it||1}}
{{% 默认显示分红记录，传入数据为1 则是分红记录，2 则是挖矿记录}}
<div class="ga-new-page" ev-back-click="backPrePage" style="background-color: #fff;">
    <app-components-topBar-topBar>{title:{{it==1?"分红记录":"挖矿记录"}} }</app-components-topBar-topBar>
    <div w-class="history" id="historylist" on-scroll="getMoreList">

        {{for ind,val of it1.data}}
        <div w-class="historyitem">
            <div>
                <span w-class="itemName">{{it==1?"分红":"挖矿"}}</span>
                <span w-class="itemNum">{{val.num}} {{it==1?' ETH':' KT'}}</span>
            </div>
            <div>
                <span w-class="itemTime">{{val.time}}</span>
                <span w-class="itemTotal">{{val.total}} {{it==1?' ETH':' KT'}}</span>
            </div>
        </div>
        {{end}}
        
        {{if it1.data.length==0}}
        <div w-class="loadmore">~暂无数据~</div>
        {{end}}
        
        {{% <div w-class="loadmore">加载中，请稍后~~~</div>}}
        <div style="height: 128px;" id="more"></div>
    </div>
</div>