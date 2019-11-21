<div w-class="asset-container">
    <div w-class="total-asset-container">
        <div w-class="total-asset"><pi-ui-lang>{"zh_Hans":"云资产：≈","zh_Hant":"雲資產：≈","en":""}</pi-ui-lang>{{it.currencyUnitSymbol}}{{it.totalAsset}}</div>
    </div>
    <div w-class="container">
        <div w-class="asset-list" ev-item-click="itemClick">
            <blockchain-components-walletAssetList-walletAssetList>{ assetList:{{it.assetList}},redUp:{{it.redUp}},currencyUnitSymbol:{{it.currencyUnitSymbol}} }</blockchain-components-walletAssetList-walletAssetList>
        </div>
    </div>
</div>