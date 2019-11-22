<div w-class="asset-container">
    <blockchain-components-topBar-topBar>{title:"云资产"}</blockchain-components-topBar-topBar>
    <div w-class="container">
        <div w-class="asset-list" ev-item-click="itemClick">
            <blockchain-components-walletAssetList-walletAssetList>{ assetList:{{it.assetList}},redUp:{{it.redUp}},currencyUnitSymbol:{{it.currencyUnitSymbol}} }</blockchain-components-walletAssetList-walletAssetList>
        </div>
    </div>
</div>