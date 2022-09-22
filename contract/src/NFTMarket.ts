import {
    Action,
    Asset,
    Context,
    Contract,
    ContractState,
    Ctx,
    Param,
    Payments,
    State
} from "@wavesenterprise/contract-core";
import {bytesToString, createAddress, strToBytes} from "@wavesenterprise/crypto-utils";


@Contract()
export default class NFTMarket {
    networkByte = 'V'.charCodeAt(0)

    @State() state: ContractState;
    @Ctx context: Context;

    @Action({onInit: true})
    async _contructor(
        @Param('name') name: string,
    ) {
        this.state.setString("name", name);
        this.state.setString("admin", this.context.tx.senderPublicKey);
    }

    @Action()
    async issue(
        @Param('description') desc: string,
        @Param('collectionId') collectionId: string,
    ) {
        await this.onlyAdmin();

        const nonce = 1;

        const tokenMap = this.state.getMapping(collectionId);
        const assetId = await Asset.calculateAssetId(nonce)

        new Asset(assetId).issue({
            decimals: 1,
            quantity: 1,
            name: `${await this.state.getString('name')}` + collectionId,
            description: desc,
            isReissuable: false,
            nonce: nonce
        });

        let tokenId = await this.state.tryGetInt(`${collectionId}`)

        if (!tokenId) {
            tokenId = 1
        } else {
            tokenId += 1
        }

        tokenMap.set(`${tokenId}`, assetId)
    }


    @Action
    sellToken(
        @Param('tokenId') tokenId: number,
        @Param('price') price: number,
        @Param('collectionId') collectionId: string,
    ) {
        const forSale = this.state.getMapping("forSale");

        forSale.set(`${collectionId}_${tokenId}`, price)
    }

    @Action
    async buy(
        @Param('tokenId') tokenId: number,
        @Param('collectionId') collectionId: string,
        payments: Payments
    ) {
        const selled = this.state.getMapping("selled");
        const forSale = this.state.getMapping("forSale");
        const tokenMap = this.state.getMapping(collectionId);

        const tokenAssetId = await tokenMap.get<string>(tokenId.toString())
        const price = await forSale.get(`${collectionId}_${tokenId}`);
        const isSelled = await selled.tryGet<boolean>(`${collectionId}_${tokenId}`);

        if (!tokenId) {
            throw new Error('Token not minted or already selled')
        }

        if (!price || isSelled === true) {
            throw new Error('Token not for sale')
        }

        if (payments.length === 0) {
            throw new Error(`You need to attach tokens for buy nft`)
        }

        if (payments[0].amount < price) {
            throw new Error(`Need more money for sell token ${collectionId} ${tokenId}`)
        }

        const recipientAddress = createAddress(strToBytes(this.context.tx.senderPublicKey), this.networkByte)

        new Asset(tokenAssetId)
            .transfer(bytesToString(recipientAddress), 1);

        forSale.set(`${collectionId}_${tokenId}`, undefined);
        selled.set(`${collectionId}_${tokenId}`, true)
    }


    private async onlyAdmin() {
        const adminAddress = await this.state.getString("admin")

        if (adminAddress !== this.context.tx.senderPublicKey) {
            throw new Error('Only admin')
        }
    }
}