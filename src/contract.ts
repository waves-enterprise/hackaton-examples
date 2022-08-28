import {Action, Asset, Contract, Param} from "@wavesenterprise/contract-core";

@Contract()
export class NativeTokensTest {
    @Action({onInit: true})
    async init() {

    }

    @Action()
    async issue() {
        const assetId = await Asset.calculateAssetId(0)

        new Asset(assetId.value).issue({
            name: 'Test Token',
            decimals: 8,
            description: 'Test token',
            isReissuable: true,
            quantity: 100,
            nonce: 0,
            assetId: assetId.value
        })
    }

    @Action()
    async transfer(
        @Param('assetOut') assetOut: string,
        @Param('recipient') recipient: string,
        @Param('amount') amount: number
    ) {
        const assetId = await Asset.calculateAssetId(0)

        new Asset(assetOut).transfer(recipient, amount)
    }

    @Action()
    async burn(
        @Param('assetToBurn') assetToBurn: string,
    ) {
        const assetId = await Asset.calculateAssetId(0)

        new Asset(assetToBurn).burn({
            assetId: new Uint8Array(Buffer.from(assetToBurn)),
            amount: 10
        })
    }

    @Action()
    async reissue(
        @Param('assetToReissue') assetToReissue: string,
    ) {
        const assetId = await Asset.calculateAssetId(0)

        new Asset(assetToReissue).reissue({
            assetId: assetToReissue,
            isReissuable: true,
            quantity: 100
        })
    }
}