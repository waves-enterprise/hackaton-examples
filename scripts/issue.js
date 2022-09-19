const {sdk, SEED} = require('./env');
const {TRANSACTIONS, TRANSACTION_TYPES} = require("@wavesenterprise/transactions-factory");
const {Keypair} = require("@wavesenterprise/signer");



async function issue() {
    const config = await sdk.node.config()
    const fee = config.minimumFee[TRANSACTION_TYPES.CallContract]

    const keypair = await Keypair.fromExistingSeedPhrase(SEED)

    const tx = TRANSACTIONS.CallContract.V5({
        fee: fee,
        contractId: 'EBTLScUgUpWwRtFpaLPYtsYdWnwzN7T2dPS7oqFrfLT2',
        contractVersion: 1,
        senderPublicKey: await keypair.publicKey(),
        payments: [],
        params: [
            {
                type: "string",
                value: "issueTokens",
                key: 'action'
            }
        ],
    })

    const signedTx = await sdk.signer.getSignedTx(tx, SEED)

    await sdk.broadcast(signedTx)
}

issue()
    .then(() => {
        console.log('Successfully executed')
    })
    .catch(console.error)