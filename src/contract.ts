import {Action, Asset, Contract, Param} from "@wavesenterprise/contract-core";

@Contract()
export class NativeTokensTest {
    @Action({onInit: true})
    async init() {

    }

    @Action()
    async issue(
        @Param('qty') qty: number,
        @Param('decimals') decimals: number,
        @Param('name') name: string,
        @Param('isReissuable') isReissuable: boolean,
    ) {
        const assetId = await Asset.calculateAssetId(0)

        new Asset(assetId.value).issue({
            name: name,
            decimals: decimals,
            description: 'Test token',
            isReissuable: isReissuable,
            quantity: qty,
            nonce: 1,
            assetId: assetId.value
        })
    }

    @Action()
    async transfer(
        @Param('assetOut') assetOut: string,
        @Param('recipient') recipient: string,
        @Param('amount') amount: number
    ) {
        new Asset(assetOut).transfer(recipient, amount)
    }

    @Action()
    async burn(
        @Param('assetToBurn') assetToBurn: string,
        @Param('qty') qty: number,
    ) {
        new Asset(assetToBurn).burn({
            assetId: new Uint8Array(Buffer.from(assetToBurn)),
            amount: qty,
        })
    }

    @Action()
    async reissue(
        @Param('assetToReissue') assetToReissue: string,
        @Param('qty') qty: number,
        @Param('isReissuable') isReissuable: boolean,
    ) {
        new Asset(assetToReissue).reissue({
            assetId: assetToReissue,
            isReissuable: isReissuable,
            quantity: qty,
        })
    }
}