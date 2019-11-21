<div w-class="asset-container">
    <div w-class="total-asset-container">
        <div w-class="total-asset"><pi-ui-lang>{"zh_Hans":"本地资产：≈","zh_Hant":"本地資產：≈","en":""}</pi-ui-lang>{{it.currencyUnitSymbol}}{{it.totalAsset}}</div>
        <img src="../../../res/image1/add.png" w-class="add-asset" on-tap="addAssetClick"/>
    </div>
    <div w-class="asset-list" ev-item-click="itemClick">
        <blockchain-components-walletAssetList-walletAssetList>{ assetList:{{it.assetList}},redUp:{{it.redUp}},currencyUnitSymbol:{{it.currencyUnitSymbol}} }</blockchain-components-walletAssetList-walletAssetList>
    </div>
</div>