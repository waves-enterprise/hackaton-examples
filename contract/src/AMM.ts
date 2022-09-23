import {Action, Asset, Context, ContractState, Ctx, Param, Payments, State} from "@wavesenterprise/contract-core";

/**
 * CPMM to swap WEST to custom asset
 */
export default class AMM {
    @State() state: ContractState;
    @Ctx context: Context;

    @Action({onInit: true})
    async _contructor(
        @Param('assetId') assetId: string,
    ) {
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

        const amountInWithFee = (from.amount * 997) / 1000;

        const reserve0 = await this.state.tryGetString('reserve0')
        const reserve1 = await this.state.tryGetString('reserve1')

        if (!from.assetId) {
            const amountOut = (BigInt(reserve1) * BigInt(amountInWithFee)) / (BigInt(reserve0) + BigInt(amountInWithFee));

            new Asset(pairAssetAddress).transfer(this.context.tx.sender, Number(amountOut))

            this.state.setString('reserve0', String(BigInt(reserve0) + BigInt(amountInWithFee)))
            this.state.setString('reserve1', String(BigInt(reserve1) - amountOut))
        } else if (from.assetId === pairAssetAddress) {
            const amountOut = (BigInt(reserve0) * BigInt(amountInWithFee)) / (BigInt(reserve1) + BigInt(amountInWithFee));

            new Asset("").transfer(this.context.tx.sender, Number(amountOut))

            this.state.setString('reserve0', String(BigInt(reserve0) - amountOut))
            this.state.setString('reserve1', String(BigInt(reserve1) + BigInt(amountInWithFee)))
        } else {
            throw new Error('Non matching assets to swap!')
        }
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

        this.state.setString('reserve0', (BigInt(reserve0) + BigInt(assetA.amount)).toString())
        this.state.setString('reserve1', (BigInt(reserve1) + BigInt(assetB.amount)).toString())
    }

    @Action()
    async __issueTokens() {
        const assetod = await Asset.calculateAssetId(1);

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


        new Asset(assetod).transfer(this.context.sender, 1000000)
    }

    private async onlyAdmin() {
        const adminAddress = await this.state.getString("admin")

        if (adminAddress !== this.context.tx.senderPublicKey) {
            throw new Error('Only admin')
        }


    }
}