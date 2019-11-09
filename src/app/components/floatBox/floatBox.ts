import { WebViewManager } from '../../../pi/browser/webview';
import { getRealNode } from '../../../pi/widget/painter';
import { Widget } from '../../../pi/widget/widget';
import { getGameItem } from '../../view/play/home/gameConfig';

/**
 * 悬浮框
 */
export class FloatBox extends Widget {
    public ok:() => void;
    
    public floatBoxClick() {
        console.log('点击悬浮框');
        const webviewName = this.props.webviewName;
        const gameItem = getGameItem(webviewName);
        WebViewManager.open(webviewName, `${gameItem.url}?${Math.random()}`, webviewName,'',gameItem.screenMode);
        this.ok && this.ok();
    }

    public attach() {
        super.attach();
        const $this = getRealNode(this.tree);
        this.dragDom($this);
    }

    public dragDom(element:any, callback?:Function) {
        let nowLeft = -1;
        const screenWidth = document.querySelector('[w-tag="pi-ui-root"]').clientWidth;    // 屏幕宽度
        const screenHeigth = document.querySelector('[w-tag="pi-ui-root"]').clientHeight;  // 屏幕高度
        const elementWidth = element.clientWidth;
        const elementHeight = element.clientHeight;    
        const params = {
            left: 0,
            top: 0,
            currentX: 0,
            currentY: 0,
            leftLimit: screenWidth - elementWidth,  // 不超出右边界
            topLimit: screenHeigth - elementHeight, // 不超出下边界
            flag: false
        };
        // 获取相关CSS属性
        const getCss = (o,key) => {
            return o.currentStyle ? o.currentStyle[key] : document.defaultView.getComputedStyle(o,<any>false)[key];     
        };
        
        // 拖拽的实现
        if (getCss(element, 'left') !== 'auto') {
            params.left = getCss(element, 'left');
        }
        if (getCss(element, 'top') !== 'auto') {
            params.top = getCss(element, 'top');
        }
        // o是移动对象
        element.ontouchstart = (event) => {
            console.log('onmousedown');
            params.flag = true;
            event = event || window.event;
            params.currentX = event.changedTouches[0].clientX * 2; // 自适应，根dom被缩放，简单处理乘以两倍
            params.currentY = event.changedTouches[0].clientY * 2;
        };
        element.ontouchend = () => {
            console.log('onmouseup');
            if (nowLeft !== -1) {
                nowLeft = nowLeft < (screenWidth / 2) ? -(elementWidth / 3) :params.leftLimit + (elementWidth / 3);
                element.style.left =  `${nowLeft}px`;
                nowLeft = -1;
            }
            params.flag = false;    
            if (getCss(element, 'left') !== 'auto') {
                params.left = getCss(element, 'left');
            }
            if (getCss(element, 'top') !== 'auto') {
                params.top = getCss(element, 'top');
            }
            callback && callback();
        };
        document.ontouchmove = (event:any) => {
            console.log('onmousemove');
            event = event || window.event;
            // tslint:disable-next-line:one-variable-per-declaration
            const nowX = event.changedTouches[0].clientX * 2, nowY = event.changedTouches[0].clientY * 2;
            // tslint:disable-next-line:one-variable-per-declaration
            const disX = nowX - params.currentX, disY = nowY - params.currentY;
            if (params.flag) {
                nowLeft = parseInt(<any>params.left,10) + disX;
                let nowTop = parseInt(<any>params.top,10) + disY;
                nowLeft = nowLeft < 0 ? 0 : (nowLeft > params.leftLimit ? params.leftLimit : nowLeft);
                nowTop = nowTop < 0 ? 0 : (nowTop > params.topLimit ? params.topLimit : nowTop);
                element.style.left =  `${nowLeft}px`;
                element.style.top =   `${nowTop}px`;
            }
        };  
    }
}