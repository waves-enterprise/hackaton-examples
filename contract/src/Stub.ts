import {Action, Context, Contract, ContractState, Ctx, Param, State} from "@wavesenterprise/contract-core";


@Contract()
export default class Stub {
    @State state: ContractState;
    @Ctx context: Context;

    @Action({
        onInit: true
    })
    initCall(
        @Param('name') name: string,
    ) {
        this.state.setString("nameFromInit", name);
        this.state.setString('senderPublicKey', this.context.tx.senderPublicKey)
    }

    @Action()
    async exampleAction() {
        const senderPK = await this.state.getString('senderPublicKey')


        // this.context.tx.payments[0].amount.add()
        this.state.setString("example_spk", senderPK + "_MyAction")
    }
}