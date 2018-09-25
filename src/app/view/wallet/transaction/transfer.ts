/**
 * 转账
 */
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { ERC20Tokens } from '../../../config';
import { estimateMinerFee, transfer, resendNormalTransfer } from '../../../net/pullWallet';
import { MinerFeeLevel, TransRecordLocal, TxStatus, TxType } from '../../../store/interface';
import { timeOfArrival } from '../../../utils/constants';
// tslint:disable-next-line:max-line-length
import { fetchGasPrice, getCurrentAddrBalanceByCurrencyName, getCurrentAddrByCurrencyName, popPswBox, fetchBtcMinerFee } from '../../../utils/tools';
import { wei2Eth, sat2Btc } from '../../../utils/unitTools';
import { doScanQrCode } from '../../../logic/native';

interface Props {
    currencyName:string;
    tx?:TransRecordLocal;
}
export class Transfer extends Widget {
    public ok:() => void;
    public async setProps(props:Props,oldProps:Props) {
        super.setProps(props,oldProps);
        this.init();
       
    }

    public async init() {
        const cn = (this.props.currencyName === 'ETH' || ERC20Tokens[this.props.currencyName]) ? 'ETH' : 'BTC';
        const toa = timeOfArrival[cn];
        const list = [];
        for (let i = 0;i < toa.length;i++) {
            const obj = {
                ...toa[i],
                minerFee:'0.000000'
            };
            list.push(obj);
        }
        const tx = this.props.tx;
        console.log(tx);
        const curLevel:MinerFeeLevel = tx ? tx.minerFeeLevel + 1: MinerFeeLevel.STANDARD;
        this.state = {
            fromAddr:getCurrentAddrByCurrencyName(this.props.currencyName),
            toAddr:tx ? tx.toAddr : '',
            amount:tx ? tx.pay : 0,
            balance:getCurrentAddrBalanceByCurrencyName(this.props.currencyName),
            minerFee:list[curLevel].minerFee,
            minerFeeList:list,
            curLevel,
            minLevel:curLevel,
            inputDisabled:tx ? true : false
        };
        this.updateMinerFeeList();
        
    }
    // 更新矿工费
    public async updateMinerFeeList() {
        const cn = (this.props.currencyName === 'ETH' || ERC20Tokens[this.props.currencyName]) ? 'ETH' : 'BTC';
        const toa = timeOfArrival[cn];
        const list = [];
        const obj = await estimateMinerFee(this.props.currencyName);
        const gasLimit = obj.gasLimit;
        // const btcMinerFee = obj.btcMinerFee;
        for (let i = 0;i < toa.length;i++) {
            const obj = {
                ...toa[i],
                // tslint:disable-next-line:max-line-length
                minerFee: cn === 'ETH' ? wei2Eth(gasLimit * fetchGasPrice(toa[i].level)) : sat2Btc(fetchBtcMinerFee(toa[i].level))
            };
            list.push(obj);
        } 
        this.state.minerFeeList = list;
        this.state.minerFee = list[this.state.curLevel].minerFee;
        this.paint();
    }
    public backPrePage() {
        this.ok && this.ok();
    }
    public speedDescClick() {
        const content = "到账速度受网络拥堵影响，拥堵时支付较高矿工费的交易会优先确认。我们把交易速度分为三个标准，并附上参考时间，您可以任意选择，矿工费可以激励矿工优先打包您的交易，如果矿工费过低，矿工没有动力去打包你的交易，可能会将您的交易延后处理。";
        popNew('app-components-modalBox-modalBox1',{ title:'到账速度',content,tips:'转账时不能全部转完，要预留出矿工费' });
    }

    public chooseMinerFee() {
        popNew('app-components-modalBox-chooseModalBox',{ 
            currencyName:this.props.currencyName,
            minerFeeList:this.state.minerFeeList,
            curLevel:this.state.curLevel,
            minLevel:this.state.minLevel },(index) => {
                this.state.curLevel = this.state.minerFeeList[index].level;
                this.state.minerFee = this.state.minerFeeList[index].minerFee;
                this.paint();
            });
    }
    // 收款地址变化
    public toAddrChange(e:any) {
        this.state.toAddr = e.value;
        this.paint();
    }

    // 转账金额变化
    public amountChange(e:any) {
        this.state.amount = Number(e.value);
        this.paint();
    }

    // 转账
    public async nextClick() {
        if (!this.state.toAddr) {
            popNew('app-components-message-message', {  content: '请输入收款地址' });

            return;
        }
        if (!this.state.amount) {
            popNew('app-components-message-message', { content: '请输入转账金额'});

            return;
        }

        if (this.state.balance < this.state.amount + this.state.minerFee) {
            popNew('app-components-message-message', { content: '余额不足' });

            return;
        }

        const minerFeeLevel = this.state.curLevel;
        const currencyName = this.props.currencyName;
        const fromAddr = this.state.fromAddr;
        const toAddr = this.state.toAddr;
        const pay = this.state.amount;
        const passwd = await popPswBox();
        if (!passwd) return;
        const t = new Date();
        const tx:TransRecordLocal = {
            hash:"",
            addr:fromAddr,
            txType:TxType.TRANSFER,
            fromAddr,
            toAddr,
            pay: pay,
            time: t.getTime(),
            status:TxStatus.PENDING,
            confirmedBlockNumber: 0,
            needConfirmedBlockNumber:0,
            info: '',
            currencyName,
            fee: this.state.minerFee,
            nonce:undefined,
            minerFeeLevel
        };
        let ret;
        if(!this.props.tx){
            ret = await transfer(passwd,tx);
        }else{
            const tx = {...this.props.tx};
            tx.minerFeeLevel = minerFeeLevel;
            ret = await resendNormalTransfer(passwd,tx);
        }
        if (ret) {
            this.ok && this.ok();
        }
    }

    public doScanClick(){
        doScanQrCode((res)=>{
            this.state.toAddr = res;
            this.paint();
        });
    }
}