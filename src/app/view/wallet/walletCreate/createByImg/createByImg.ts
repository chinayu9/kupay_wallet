/**
 * creation complete
 */
import { popNew } from '../../../../../pi/ui/root';
import { drawImg } from '../../../../../pi/util/canvas';
import { Widget } from '../../../../../pi/widget/widget';
import { ahash } from '../../../../utils/ahash';

export class CreateComplete extends Widget {
    public ok: () => void;
    public reader: FileReader = new FileReader();
    constructor() {
        super();
    }
    public create() {
        super.create();
        this.init();
    }
    public init(): void {
        this.state = {
            choosedImg: false,// 是否选择图片
            imgBase64Data: '',// 图片base64
            inputWords: ''// 输入字符串
        };
    }
    public backPrePage() {
        this.ok && this.ok();
    }
    public chooseImg() {
        this.trigger();// 触发input file输入框点击事件
    }
    /**
     * 
     */
    public change(e: any) {
        // todo

        // this.reader.onload = (r) => {
        //     const imgBase64Data = r.currentTarget.result;
        //     const img = document.getElementById('choosedImg');
        //     img.src = imgBase64Data;
        //     this.state.choosedImg = true;
        //     this.state.imgBase64Data = imgBase64Data;
        //     this.paint();
        // };
        // this.reader.readAsDataURL(e.target.files[0]);

    }

    public inputIng(event: any) {
        const currentValue = event.currentTarget.value;
        this.state.inputWords = currentValue;
    }
    public nextStep() {
        // todo 临时数据
        this.state.choosedImg = '../../app/res/image/banner2.png';
        if (this.state.choosedImg === false) {
            popNew('app-components-message-messagebox', { itype: 'message', title: '提示', content: '请选择图片' });

            return;
        }
        if (this.state.inputWords === '') {
            popNew('app-components-message-messagebox', { itype: 'message', title: '提示', content: '请输入字符' });

            return;
        }

        const img = new Image();
        img.onload = () => {
            const ab = drawImg(img);
            const r = ahash(new Uint8Array(ab), img.width, img.height, 4);

            this.removeImg();
            popNew('app-view-wallet-walletCreate-createByImg-walletCreate', {
                choosedImg: r, inputWords: this.state.inputWords
            });
            this.ok && this.ok();

        };
        img.src = this.state.choosedImg;

    }
    public removeImg() {
        this.state.choosedImg = false;
        document.getElementById('hideForm').reset();
        this.paint();
    }

    private trigger() {
        // IE
        if (document.all) {
            document.getElementById('imgInput').click();
        } else {
            const e = document.createEvent('MouseEvents');
            e.initEvent('click', true, true);              // 这里的click可以换成你想触发的行为
            document.getElementById('imgInput').dispatchEvent(e);   // 这里的clickME可以换成你想触发行为的DOM结点
        }
    }
}
