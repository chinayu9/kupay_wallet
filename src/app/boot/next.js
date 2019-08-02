'use strict';
/** 
 * 依赖表加载成功后的回调函数
 * 每个项目需要在这里做3件事
 *    1. 更新：App，H5，更新界面写到这里来。
 *    2. 分批加载目录
 *    3. 调用项目的入口函数/组件
 */
winit.initNext = function () {
	getUpdateContent();
	var win = winit.win;
	win._babelPolyfill = 1;
	win.pi_modules = 1;


	win.Map = 1;
	var flags = winit.flags;

	// console.log("init time:", Date.now() - startTime);
	// 清除运营商注入的代码
	var clear = function () {
		//清除window上新增的对象
		var k;
		for (k in window) {
			if (window.hasOwnProperty(k) && !win[k]) window[k] = null;
		}
		//清除body里面的非pi元素（自己添加的元素都有pi属性）
		var i,
			arr = document.body.children;
		for (i = arr.length - 1; i >= 0; i--) {
			k = arr[i];
			if (!k.getAttribute("pi")) document.body.removeChild(k);
		}
	};
	//clear();

	pi_modules.depend.exports.init(winit.deps, winit.path);
	pi_update.severIp = winit.severIp;
	pi_update.severPort = winit.severPort;
	pi_update.inAndroidApp = winit.inAndroidApp;
	pi_update.inIOSApp = winit.inIOSApp;
	pi_update.inApp = winit.inApp;
	winit = undefined; //一定要立即释放，保证不会重复执行
	//先登录

	var modProcess = pi_modules.commonjs.exports.getProcess();
	var dirProcess = pi_modules.commonjs.exports.getProcess();
	modProcess.show(function (r) {
		// modProcess.value = r * 0.2;
		// divProcess.style.width = (modProcess.value + dirProcess.value) * 100 + "%";
	});
	dirProcess.show(function (r) {
		// dirProcess.value = r * 0.8;
		// divProcess.style.width = (modProcess.value + dirProcess.value) * 100 + "%";
	});

// ====================================更新开始=============================================================
	/**
	 * 更新App和H5,策略如下:
	 *     1. 同时检查是否需要更新，超时1秒钟即可
	 *     2. 如果App需要更新，更新App，并重启（Android/iOS底层自动）
	 *     3. 否则，如果H5需要更新，更新H5并重新reload
	 *     4. 否则调用加载函数load加载项目资源；
	 */
	var isAppNeedUpdate = undefined;
	var isH5NeedUpdate = undefined;
	console.time("update check");
	var h5UpdateMod = pi_modules.update.exports;
	var appUpdateMod = pi_modules.appUpdate.exports;
	appUpdateMod.init(function () {
		appUpdateMod.needUpdate(function (isNeedUpdate) {
			if (isNeedUpdate > 0) {
				var updateContent = [];
				if (navigator.userAgent.indexOf('YINENG_ANDROID') >= 0) { // android
					updateContent = pi_update.updateJson.androidUpdateContent || [];
				}else if(navigator.userAgent.indexOf('YINENG_IOS') >= 0) { // ios
					updateContent = pi_update.updateJson.iosUpdateContent || [];
				}else{  // 浏览器
					updateContent = pi_update.updateJson.androidUpdateContent || [];
				}
				var option = {
					updated:updateContent,
					version:"",//appUpdateMod.getAppRemoteVersion() app更新不显示版本号
					alertBtnText:"App 需要更新"
				};
				pi_update.modifyContent(option);
				appUpdateMod.update(function (isSuccess) {
					pi_update.closePop();
					// alert("更新失败");
					console.log("appUpdate " + isSuccess);
				},function(total,process){
					console.log("total = " + total + " process = " + process);
					var e = { type: "saveFile", total: total, count: process};
					pi_update.updateProgress(e);
				});
			} else {
				// 只有在这种情况下才有可能更新H5
				isAppNeedUpdate = isNeedUpdate;
				if (isH5NeedUpdate !== undefined) {
					updateH5();
				}
			}
		});

		h5UpdateMod.setServerInfo("app/boot/");
		h5UpdateMod.checkUpdate(function (updateFlag) {

			isH5NeedUpdate = updateFlag;
			if (isAppNeedUpdate !== undefined) {
				updateH5();
			}
		});
	});

	function updateH5() {
		var needUpdate = false;
		function updateError(){  // 更新出错界面
			var updateContent = pi_update.updateJson.h5UpdateContent || [];
			var updateVersion =  pi_update.updateJson.version || "";
			var option = {
				updated:updateContent,
				version:updateVersion,
				updateError:true
			};
			pi_update.modifyContent(option);
		}
		if (isH5NeedUpdate === h5UpdateMod.UPDATE_FLAG_NO_UPDATE) {
			// 不需要更新
			needUpdate = false;
		} else if (isH5NeedUpdate === h5UpdateMod.UPDATE_FLAG_LAST) {
			// alert("上次没有更新完成, 强制更新");
			needUpdate = true;
		} else if (isH5NeedUpdate === h5UpdateMod.UPDATE_FLAG_FORCE) {
			// alert("大版本变动, 强制更新");
			needUpdate = true;
		} else if (isH5NeedUpdate === h5UpdateMod.UPDATE_FLAG_OPTIONAL) {
			// needUpdate = confirm("小版本变动，需要更新吗？");
			needUpdate = true;
		} else if (isH5NeedUpdate === h5UpdateMod.UPDATE_FLAG_LAST_ERROR) {
			// alert("服务器连不上，同时上次更新到一半，错误");
			updateError();
			return;
		} else if (isH5NeedUpdate === h5UpdateMod.UPDATE_FLAG_APP_ERROR) {
			// alert("服务器连不上，同时app版本太低，错误");
			updateError();
			pi_update.modifyContent(option);
			return;
		} else {
			// alert("H5 更新，其他未处理错误");
			updateError();
			pi_update.modifyContent(option);
			throw new Error("H5 update error!");
		}

		if (needUpdate) { 
			var updateContent = pi_update.updateJson.h5UpdateContent || [];
			var updateVersion =  pi_update.updateJson.version || "";
			var option = {
				updated:updateContent,
				version:updateVersion
			};
			pi_update.modifyContent(option);
			var start = new Date().getTime();
			var total;
			h5UpdateMod.update(function (e) {
				//{type: "saveFile", total: 4, count: 1}
				console.log("update progress: ", e);
				pi_update.updateProgress(e);
				total = e.total;
			}, function () {
				setTimeout(()=>{
					pi_update.closePop();
					// 重启
					h5UpdateMod.reload();
				},200);
				var updateTime = new Date().getTime() - start;
				self.updateMsg = { total,updateTime };
				var timeArrStr = localStorage.getItem('timeArr');
				let timeArr;
				if (timeArrStr) {
					timeArr = JSON.parse(timeArrStr);
				} else {
					timeArr = [];
				}
				timeArr.push({ updateMsg });
				localStorage.setItem('timeArr',JSON.stringify(timeArr));
			});
		} else {
			// 这里是项目加载的开始
			console.timeEnd("update check");
			appLoadEntrance();
		}
	}

// ====================================更新结束=============================================================
	
	var html,util,lang; // pi/util/html,pi/widget/util,pi/util/lang
	var fm;  // fileMap
	var fpFlags = {};  // 进入首页面的资源加载标识位
	var suffixCfg = {
		png: 'down', jpg: 'down', jpeg: 'down', webp: 'down', gif: 'down', xlsx:'none',rs:'none'
	};

	// app下载入口函数
	var appLoadEntrance = function(){
		pi_modules.commonjs.exports.require(["pi/util/html", "pi/widget/util","pi/util/lang","pi/browser/webview"], {}, function (mods, tmpfm) {
			html = mods[0],
			util = mods[1],
			lang = mods[2];
			fm = tmpfm;
			const setting = JSON.parse(localStorage.getItem('setting'));
			lang.setLang(setting && setting.language || 'zh_Hans');  // 初始化语言为简体中文
	
			// 判断是否第一次进入,决定是显示片头界面还是开始界面
			var userinfo = html.getCookie("userinfo");
			pi_modules.commonjs.exports.flags = html.userAgent(flags);
			flags.userinfo = userinfo;
	
			/**
			 * 先判断浏览器对webp的支持；
			 * 加载所有的预处理图片
			 * 第一级目录：首页需要的资源；
			 * 第二级目录：其他；
			 * 
			 */
			html.checkWebpFeature(function (r) {
				flags.webp = flags.webp || r;
				firstStageLoaded();
			});
		}, function (result) {
			alert("加载基础模块失败, " + result.error + ":" + result.reason);
		}, modProcess.handler);
	}
	
	// 加载第一阶段必须文件 加载完成后即可获取数据
	var firstStageLoaded = function(){
		var sourceList = [
			"app/postMessage/",
			"earn/client/app/net/login.js",
			"chat/client/app/net/login.js",
			"app/viewLogic/login.js"
		];
		util.loadDir(sourceList, flags, fm, suffixCfg, function (fileMap) {
			console.log("firstStageLoaded success-----------------");
			// 聊天登录
			pi_modules.commonjs.exports.relativeGet("chat/client/app/net/init").exports.registerRpcStruct(fm);
			// 活动注册
			pi_modules.commonjs.exports.relativeGet("earn/client/app/net/init").exports.registerRpcStruct(fm);

			var WebViewManager = pi_modules.commonjs.exports.relativeGet("pi/browser/webview").exports.WebViewManager;
			WebViewManager.addListenStage(function(stage){
				if(stage === "firstStage"){    // 第一阶段完成  可以注册监听
					// TODO 在回调中加载剩余代码 并且注册监听已经完成
					var callGetHomePageEnterData = pi_modules.commonjs.exports.relativeGet("app/middleLayer/wrap").exports.callGetHomePageEnterData;
					var getDataStart = Date.now();
					callGetHomePageEnterData().then(function(res){
						self.getData = Date.now() - getDataStart;
						fpFlags.homePageReady = true;
						fpFlags.homePageData = res;
						enterApp();
					});
				}
			});
			console.log("stage webview goReady");
			WebViewManager.getReady("firstStage");   // 通知一阶段准备完毕
			// 继续加载首页所需
			loadChatSource();  // 聊天
			loadEarnSource();  // 活动
			loadWalletFirstPageSource();  //钱包
			loadImages(); // 预加载图片
			if(!pi_update.inApp){
				vmLoaded();
			}
		}, function (r) {
			alert("加载目录失败, " + r.error + ":" + r.reason);
		}, dirProcess.handler);
	}

	// vm代码加载
	var vmLoaded = ()=>{
		util.loadDir([ "app/store/","app/remote/postWalletMessage.js"], flags, fm, undefined, function (fileMap) {
			// store 数据初始化完成后才通知 如果数据初始化没完成就通知  有可能数据还没读出来钱包就已经取了数据  导致数据不一致
			var initStore = pi_modules.commonjs.exports.relativeGet("app/store/memstore").exports.initStore;
			initStore().then(() => {
				var WebViewManager = pi_modules.commonjs.exports.relativeGet("pi/browser/webview").exports.WebViewManager;
				WebViewManager.addListenStage(function(stage){
					if(stage === "firstStage"){    // 第一阶段完成  
						// TODO 在回调中加载剩余代码 并且注册监听已经完成
						var postStoreLoadedMessage = pi_modules.commonjs.exports.relativeGet("app/remote/postWalletMessage").exports.postStoreLoadedMessage;
						console.log("postStoreLoadedMessage start-----------------------");
						postStoreLoadedMessage();
						// 加载剩下资源
						util.loadDir([ "app/remote/","app/core_common/","app/core_pc/","app/publicLib/"], flags, fm, undefined, function (fileMap) {
							var postAllLoadedMessage = pi_modules.commonjs.exports.relativeGet("app/remote/postWalletMessage").exports.postAllLoadedMessage;
							console.log("postAllLoadedMessage start-----------------------");
							postAllLoadedMessage();
						}, function (r) {
							console.log("加载目录失败, " + r.url + ", " + r.error + ":" + r.reason);
						}, function(){});
					}
				});
				console.log("stage vm goReady");
				WebViewManager.getReady("firstStage"); // 通知一阶段准备完毕
			});
			
		}, function (r) {
			console.log("加载目录失败, " + r.url + ", " + r.error + ":" + r.reason);
		}, function(){});
	}


	
	
	
	// 加载钱包首页所需资源
	var loadWalletFirstPageSource = function () {
		console.time("fp loadWalletFirstPageSource");
		var sourceList = [
			"app/viewLogic/",
			"app/view/base/",
			"app/components1/",
			"app/res/css/",
			"app/res/js/",
			"app/view/play/home/",
			"app/view/wallet/home/",
			"earn/client/app/res/css/",
			"pi/ui/root.js",
			"pi/ui/root.tpl",
			"pi/ui/html.js",
			"pi/ui/html.tpl",
			"pi/ui/lang.js",
			"pi/ui/lang.tpl"
		];
		util.loadDir(sourceList, flags, fm, suffixCfg, function (fileMap) {
			var tab = util.loadCssRes(fileMap);
			tab.timeout = 90000;
			tab.release();
			fpFlags.walletReady = true;
			

			enterApp();
			
		}, function (r) {
			alert("加载目录失败, " + r.error + ":" + r.reason);
		}, dirProcess.handler);
	}

	// 加载聊天代码
	var loadChatSource = function () {
		console.time("fp loadChatSource");
		var sourceList = [
			"chat/client/app/view/home/",
			"chat/client/app/view/contactList/contactList.tpl",
			"chat/client/app/view/contactList/contactList.js",
			"chat/client/app/view/contactList/contactList.wcss",
			"chat/client/app/view/contactList/contactItem.tpl",
			"chat/client/app/view/contactList/contactItem.js",
			"chat/client/app/view/contactList/contactItem.wcss",
			"chat/client/app/widget/imgShow/",
			"chat/client/app/widget/topBar/"
		]; 
		util.loadDir(sourceList, flags, fm, suffixCfg, function (fileMap) {
			console.timeEnd("fp loadChatSource");
			console.log("load loadChatSource-----------------");
			var tab = util.loadCssRes(fileMap);
			// 将预加载的资源缓冲90秒，释放
			tab.timeout = 90000;
			tab.release();
			fpFlags.chatReady = true;
			enterApp();
			
		}, function (r) {
			alert("加载目录失败, " + r.error + ":" + r.reason);
		},dirProcess.handler);
	}

	// 加载活动代码
	var loadEarnSource = function () {
		console.time("fp loadEarnSource");
		var sourceList = [
			"earn/client/app/view/home/",
			"earn/client/app/components1/",
			"earn/client/app/view/activity/miningHome.tpl",
			"earn/client/app/view/activity/miningHome.js",
			"earn/client/app/view/activity/miningHome.wcss",
			"earn/xlsx/awardCfg.c.js",
			"earn/xlsx/awardCfg.s.js",
			"earn/xlsx/item.c.js",
			"earn/xlsx/item.s.js",
		];
		util.loadDir(sourceList, flags, fm, suffixCfg, function (fileMap) {
			console.timeEnd("fp loadEarnSource");
			var tab = util.loadCssRes(fileMap);
			tab.timeout = 90000;
			tab.release();
			console.log("load loadEarnSource-----------------");
			fpFlags.earnReady = true;
			enterApp();
			
		}, function (r) {
			alert("加载目录失败, " + r.error + ":" + r.reason);
		}, dirProcess.handler);
	}

	// 全部所需资源下载完成,进入app,显示界面
	var enterApp = function(){
		if( fpFlags.chatReady && fpFlags.earnReady && fpFlags.walletReady && fpFlags.homePageReady){
			// 加载根组件
			var root = pi_modules.commonjs.exports.relativeGet("pi/ui/root").exports;
			root.cfg.full = false; //PC模式
			var index = pi_modules.commonjs.exports.relativeGet("app/view/base/main").exports;
			index.run(fpFlags.homePageData,function () {
				// 关闭读取界面
				document.body.removeChild(document.getElementById('rcmj_loading_log'));
				var closeBg = new Date().getTime() - self.startTime1;
				var timeArrStr = localStorage.getItem('timeArr');
				var timeArr;
				if (timeArrStr) {
					timeArr = JSON.parse(timeArrStr);
				} else {
					timeArr = [];
				}
				timeArr.push({ homeEnter:self.homeEnter,getData:self.getData,closeBg });
				localStorage.setItem('timeArr',JSON.stringify(timeArr));
			   	loadLeftSource();
			});
			
			
		}
	}

	// 加载一些需要预加载的图片
	var loadImages = function () {
		util.loadDir(["app/res/image1/"], flags, fm, suffixCfg, function (fileMap) {
			var tab = util.loadCssRes(fileMap);
			tab.timeout = 90000;
			tab.release();
		}, function (r) {
			alert("加载目录失败, " + r.error + ":" + r.reason);
		}, dirProcess.handler);
	}


	// 加载剩下的资源
	var loadLeftSource = function () {
		var level2SourceList = [
			"app/components/",
			"app/view/",
			"chat/client/app/view/",
			"chat/client/app/widget/",
			"chat/client/app/res/",
			"earn/client/app/view/",
			"earn/client/app/test/",
			"earn/client/app/components/",
			"earn/client/app/xls/",
			"earn/xlsx/",
			"earn/client/app/res/"
		];

		// 加载其他文件
		util.loadDir(level2SourceList, flags, fm, undefined, function (fileMap) {
			var tab = util.loadCssRes(fileMap);
			tab.timeout = 90000;
			tab.release();
			var emitSourceLoaded = pi_modules.commonjs.exports.relativeGet("app/postMessage/localLoaded").exports.emitSourceLoaded;
			emitSourceLoaded();
			loadLeftImages();
		}, function (r) {
			alert("加载目录失败, " + r.error + ":" + r.reason);
		}, dirProcess.handler);
	}

	// 加载剩下的图片
	var loadLeftImages = function () {
		util.loadDir(["app/res/image/","chat/client/app/res/images/","earn/client/app/res/image/"], flags, fm, suffixCfg, function (fileMap) {
			var tab = util.loadCssRes(fileMap);
			tab.timeout = 90000;
			tab.release();
		}, function (r) {
			alert("加载目录失败, " + r.error + ":" + r.reason);
		}, dirProcess.handler);
	}


};


/**
 * 更新UI界面初始化
 */
function updateUiInit(){
	window.pi_update = window.pi_update || {};

	var cfg = {
    	width: 750, height: 1334, wscale: 0, hscale: 0.25, full: false
	};

	var browserAdaptive = function() {
		var clientWidth = document.documentElement.clientWidth;
		var clientHeight = document.documentElement.clientHeight;
		var rootWidth = cfg.width;
		var rootHeight = cfg.height;
		var scaleW = clientWidth / rootWidth;
		var scaleH = clientHeight / rootHeight;
		var rootScale;
		if (cfg.wscale >= cfg.hscale) {
			// 宽度比例变动
			if (scaleW > scaleH * (cfg.wscale + 1)) {
				// 大于规定的比例
				rootWidth = rootWidth * (cfg.wscale + 1) | 0;
			} else {
				rootWidth = (clientWidth / scaleH) | 0;
			}
			rootScale = scaleW = scaleH;
		} else {
			// 高度比例变动
			if (scaleH > scaleW * (cfg.hscale + 1)) {
				rootHeight = rootHeight * (cfg.hscale + 1) | 0;
			} else {
				rootHeight = (clientHeight / scaleW) | 0;
			}
			rootScale = scaleH = scaleW;
		}
		var rootX = (clientWidth - rootWidth) / 2;
		var rootY = (clientHeight - rootHeight) / 2;
		var cssText = 'z-index:99999;position: absolute;overflow: hidden;left: ' + rootX + 'px;top: ' + rootY + 'px;width:' + rootWidth + 'px;height: ' + rootHeight + 'px;-webkit-transform:scale(' + scaleW + ',' + scaleH + ');-moz-transform:scale(' + scaleW + ',' + scaleH + ');-ms-transform:scale(' + scaleW + ',' + scaleH + ');transform:scale(' + scaleW + ',' + scaleH + ');';
		// var rootUpdate = document.querySelector('#update-root');
		// rootUpdate.style.cssText = cssText;

		return cssText;
	};

	pi_update.rootCssText =  browserAdaptive();


	pi_update.modifyContent = function(option){
		var modified = pi_update.contentModified;
		if(modified) return;
		option.confirmOk = option.confirmOk || "确定";
		option.confirmCancel = option.confirmCancel || "取消";
		var $root = document.createElement("div");
		$root.setAttribute("id","update-root");
		$root.setAttribute("style",pi_update.rootCssText);
		var $updateItemInnerHtml = "";
		for(var i = 0;i < option.updated.length;i++){
			var $item = "<div class='pi-update-item'>" + (i + 1) + "、" + option.updated[i] + "</div>";
			$updateItemInnerHtml += $item;
		}

		var newVersion = option.version ? `：V${option.version}` : "";
		var errorTips = "正在连接服务器";
		if(option.updateError){
			$root.innerHTML = `
			<div class="pi-mask">
				<div class="pi-update-box animated bounceInUp">
					<img src="../res/image/rocket.png" class="pi-update-rocket" />
					<div class="pi-update-content">
					<div class="pi-update-title">发现新版本<span id="pi-version">${newVersion}</span></div>
					<div class="pi-update-items">
						${$updateItemInnerHtml}
					</div>
					</div>
					<div class="pi-update-bottom">
						<div class="pi-update-btns">
							<div class="pi-update-cancel-btn">${option.confirmCancel}</div>
							<div class="pi-update-ok-btn">${option.confirmOk}</div>
						</div>
						<div class="pi-update-progress-container">
							${errorTips}
						</div>
						<div class="pi-update-complete-btn"></div>
					</div>
				</div>
			</div>`;
		}else{
			$root.innerHTML = `
			<div class="pi-mask">
				<div class="pi-update-box animated bounceInUp">
					<img src="../res/image/rocket.png" class="pi-update-rocket" />
					<div class="pi-update-content">
					<div class="pi-update-title">发现新版本<span id="pi-version">${newVersion}</span></div>
					<div class="pi-update-items">
						${$updateItemInnerHtml}
					</div>
					</div>
					<div class="pi-update-bottom">
						<div class="pi-update-btns">
							<div class="pi-update-cancel-btn">${option.confirmCancel}</div>
							<div class="pi-update-ok-btn">${option.confirmOk}</div>
						</div>
						<div class="pi-update-progress-container">
							<div class="pi-update-progress-bg">
								<div class="pi-update-progress"></div>
							</div>
							<div class="pi-update-progress-text">0%</div>
						</div>
						<div class="pi-update-complete-btn"></div>
					</div>
				</div>
			</div>
			`;
		}
		
		var $body = document.querySelector("body");
		$body.appendChild($root);
		pi_update.contentModified = true;

		if(option.updateError){
			var container = document.querySelector(".pi-update-progress-container");
			var dots = ["."];
			setInterval(()=>{
				if(dots.length >= 3) dots = [];
				dots.push(".");
				container.innerHTML = errorTips + dots.join("");
			},1000);
		}
	}


	// 确定弹框
	pi_update.confirm = function(option,callback){
		pi_update.modifyContent(option);
		var $btns = document.querySelector(".pi-update-btns");
		var $cancel = document.querySelector(".pi-update-cancel-btn");
		var $ok = document.querySelector(".pi-update-ok-btn");

		$cancel.onclick = function(){
			var $updateRoot = document.querySelector('#update-root');
			$updateRoot.style.display = "none";
			callback(false);
		};

		$ok.onclick = function(){
			callback(true);
		};

		$btns.style.display = "display";
		// 显示弹框
		var $updateRoot = document.querySelector('#update-root');
		$updateRoot.style.display = "block";
	}

	//e的数据结构{type: "saveFile", total: 4, count: 1}
	// 进度条更新
	pi_update.updateProgress = function(e){
		var updating  = pi_update.updating;
		if(!updating){
			pi_update.updating = true;
		}
		var $progress = document.querySelector(".pi-update-progress");
		var $progressText = document.querySelector(".pi-update-progress-text");
		var percent = e.count / e.total;
		var percentText = parseInt(percent * 100) + "%";
		console.log("percentText = ",percentText);
		$progress.style.width = percentText;
		$progressText.innerHTML = percentText;
	}


	// alert弹框
	pi_update.alert = function(option,completeCB){
		pi_update.modifyContent(option);
		var $updateRoot = document.querySelector('#update-root');
		var $btns = document.querySelector(".pi-update-btns");
		var $progressContainer = document.querySelector(".pi-update-progress-container");
		var $completeBtn = document.querySelector(".pi-update-complete-btn");
		
		$completeBtn.onclick = completeCB;
		// $completeBtn.addEventListener("click",function(){
		// 	completeCB();
		// });

		$updateRoot.style.display = "block";
		$btns.style.display = "none";
		$progressContainer.style.display = "none";
		$completeBtn.innerHTML = option.alertBtnText;
		$completeBtn.style.display = "flex";
	}

	// 关闭弹框
	pi_update.closePop = function(){
		var $updateRoot = document.querySelector('#update-root');
		var $body = document.querySelector("body");
		$updateRoot && $body.removeChild($updateRoot);
	}

}

/**
 * 获取更新内容 版本号  修复的BUG等
 */
function getUpdateContent(){
	var defaultUpdateJson = {
		"version":"0.0.1",
		"h5UpdateContent":["接入了新的支付","支持游戏悬浮窗","支持手机号注册","修复了部分bug"],
		"androidUpdateContent":["接入了新的支付","支持游戏悬浮窗","支持手机号注册","修复了部分bug"],
		"iosUpdateContent":["ios底层修复1","ios底层修复2","ios底层修复3","ios底层修复4"],
	};
	const updateJsonStr = localStorage.getItem("updateJson");
	pi_update.updateJson = updateJsonStr ? JSON.parse(updateJsonStr) : defaultUpdateJson;
	var ajax = pi_modules.ajax.exports;
	const url = winit.appURL + "/update.json";
	const timeout = 1000;
	ajax.get(url + "?" + Math.random(), {}, undefined, undefined, timeout, function (updateJson) {
		localStorage.setItem("updateJson",updateJson);
		pi_update.updateJson = JSON.parse(updateJson);
	}, function () {
		// 取不到服务器的update.json,使用本地json
	});
}
updateUiInit();
// 初始化开始
(winit.init = function () {
	if (!winit) return;
	winit.deps &&
		self.pi_modules &&
		self.pi_modules.butil &&
		self._babelPolyfill &&
		winit.initNext();
	!self._babelPolyfill && setTimeout(winit.init, 17);
})();
