<div class="new-page" w-class="newpage" ev-next-click="toSearch">
    <div w-class="topBack" ev-myHome="myHome">
        <app-components1-topBar-topBar1>{avatar:{{it.userInfo.avatar}},title:"游戏" }</app-components1-topBar-topBar1>
    </div>
    <app-publicComponents-offlineTip-offlineTip>{ offlienType:{{it.offlienType}} }</app-publicComponents-offlineTip-offlineTip>
    <div w-class="body">
        <div w-class="oftenPlay">
            <div w-class="oftenList">
                {{if it.oftenList.length}}
                    {{for i,v of it.oftenList}}
                    <div w-class="listItem" on-tap="oftenGame({{i}})">
                        <div w-class="oftenPlayItem">
                            <img src="{{v.img[0]}}" alt="" w-class="oftenPlayItemImg"/>
                            <div w-class="mark">最近在玩</div>
                        </div>
                        <div w-class="gameName">{{v.title}}</div>
                    </div>
                    {{end}}
                {{end}}


                {{if it.oftenList.length < 4 }}
                    {{for i,v of it.popular}}
                        {{if it.oftenList.findIndex(item=>item.appid===v.appid) ==-1 }}
                        <div w-class="listItem" on-tap="popularOverGame({{i}})">
                            <div w-class="recommend">
                                <img src="{{v.img[0]}}" alt="" w-class="recommendImg"/>
                                <img src="../../../res/image/hot.png" alt="" w-class="markImg"/>
                            </div>
                            <div w-class="gameName">{{v.title}}</div>
                        </div>
                        {{end}}
                    {{end}}
                {{end}}
            </div>
        </div>
        {{if it.recommendedToday.length && it.recommendedToday[0].img}}
            <div w-class="recommendedToday">
                <div w-class="recommendedTodayTitle">今日推荐</div>
                <div w-class="showGame" style="position: relative">
                <div w-class="userHead">
                        <div w-class="gameImg" on-tap="todayGame" style="background-image:url({{it.recommendedToday[0].img[1]}});">
                        </div>
                        <div w-class="gameInfos">
                            <div style="margin:0 15px 20px 15px; display: flex;">
                                <img src="{{it.recommendedToday[0].img[0]}}" loading="lazy" alt="" w-class="gameInfoImg"/>
                                <div w-class="gameInfoName" style="marign-left:20px;">
                                    <div w-class="gameInfosName">{{it.recommendedToday[0].title}}</div>
                                    <div w-class="publishTime">{{it.recommendedToday[0].desc}}</div>
                                </div>
                            </div>
                        </div>
                </div>
                </div>
            </div>
        {{end}}
        {{if it.popular.length}}
            <div w-class="recommendedToday">
                <div w-class="recommendedTodayTitle">热门</div>
                <div w-class="showGame" style="height:430px;">
                        {{for i,v of it.popular.slice(0,2)}}
                        <div w-class="item1" on-tap="popularGame({{i}})">
                            <div w-class="gameImg" style="background-image:url({{v.img[1]}});"></div>
                            <div w-class="gameInfo">
                                <div w-class="gameInfoName" style="height:100%;margin: 0 20px;width: 100%;">
                                    <div w-class="gameInfosName">{{v.title}}</div>
                                    <div w-class="publishTime">{{v.desc}}</div>
                                </div>
                            </div>
                        </div>
                        {{end}}
                </div>
            </div>
        {{end}}

        {{if it.recommend.length}}
        <div w-class="recommendedToday">
            <div w-class="recommendedTodayTitle">编辑推荐</div>
            {{for i,v of it.recommend}}
            <div w-class="showGame" style="position: relative;height:400px;"  on-tap="recommendGame({{i}})">
                <div w-class="gameImg" style="background-image:url({{v.img[1]}});background-position: center 28%;"></div>
            </div>
            <div w-class="editList">
                <img src="{{v.img[0]}}" alt="" w-class="gameInfoImg"/>
                <div w-class="gameInfoName">
                    <div w-class="gameInfosNames">{{v.title}}</div>
                    <div w-class="publishTime">{{v.desc}}</div>
                </div>
            </div>
            {{end}}
        </div>
        {{end}}

        <div w-class="recommendedToday">
            <div w-class="recommendedTodayTitle">全部游戏</div>
            {{if it.allGame.length}}
                {{for i,v of it.allGame}}
                <div w-class="allGameList">
                    <div style="display:flex;">
                        <img src="{{v.img[0]}}" alt="" w-class="allGameImg"/>
                        <div w-class="allGameInfo">
                            <div w-class="allGameName">{{v.title}}</div>
                            <div w-class="allGamePublishTime">{{v.desc}}</div>
                        </div>
                    </div>
                    <div w-class="btn" on-tap="payAllGame({{i}})">马上玩</div>
                </div>
                {{end}}
            {{end}}
        </div>
    </div>
</div>