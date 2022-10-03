import {Action, Asset, Context, ContractState, Ctx, Param, Payments, State} from "@wavesenterprise/contract-core";

import Long from 'long'

/**
 * CPMM to swap WEST to custom asset
 */
export default class AMM {
    @State() state: ContractState;
    @Ctx context: Context;

    @Action({onInit: true})
    async _contructor(
        @Param('assetId') assetId: string,
        payments: Payments
    ) {


        console.log(assetId, payments[0].amount.toNumber())
        // console.log(payments[0].amount.toString(), 'payments', payments[0].amount, Long.fromValue(payments[0].amount).toInt())


        this.state.setInt('balance', payments[0].amount.toNumber())
        this.state.setString("assetId", assetId);
        this.state.setString("admin", this.context.tx.senderPublicKey);
    }


    @Action()
    async swap(payments: Payments) {
        const pairAssetAddress = await this.state.getString('assetId');
        const from = payments[0];

        if (!from) {
            throw new Error('Payment required!');
        }

        const amountInWithFee = from.amount.multiply(997).div(1000);

        const reserve0 = await this.state.tryGetString('reserve0')
        const reserve1 = await this.state.tryGetString('reserve1')
    }

    @Action()
    async addLiquidity(payments: Payments) {
        const pairAssetAddress = await this.state.getString('assetId');
        const assetA = payments[0];
        const assetB = payments[1];

        if (!assetA || !assetB) {
            throw new Error('Two assets required!');
        }

        if (assetA.assetId !== undefined) {

            throw new Error("Need to add WEST tokens")
        }

        if (assetB.assetId !== pairAssetAddress) {
            throw new Error("Need to add custom token on second payment")
        }

        const reserve0 = await this.state.tryGetString('reserve0')
        const reserve1 = await this.state.tryGetString('reserve1')

        // this.state.setString('reserve0', (BigInt(reserve0) + BigInt(assetA.amount)).toString())
        // this.state.setString('reserve1', (BigInt(reserve1) + BigInt(assetB.amount)).toString())
    }

    @Action()
    async __issueTokens() {
        const assetod = await Asset.calculateAssetId(1);
        const assetod1 = await Asset.calculateAssetId(2);

        console.log(assetod);

        new Asset(assetod).issue({
            description: "Waves token",
            name: "WAVES",
            decimals: 8,
            isReissuable: false,
            quantity: 1000000,
            assetId: assetod,
            nonce: 1
        });


        // prefix_{Key}


        this.state.getMapping("pref")

        new Asset(assetod).transfer(this.context.sender, 1000000)
    }

    private async onlyAdmin() {
        const adminAddress = await this.state.getString("admin")

        if (adminAddress !== this.context.tx.senderPublicKey) {
            throw new Error('Only admin')
        }


    }
}