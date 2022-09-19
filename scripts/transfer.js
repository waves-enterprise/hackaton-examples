const {sdk, SEED} = require('./env');
const {TRANSACTIONS, TRANSACTION_TYPES} = require("@wavesenterprise/transactions-factory");
const {Keypair} = require("@wavesenterprise/signer");

async function transfer() {
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
                value: "transfer",
                key: 'action'
            },
            {
                type: "string",
                value: "HfDCMMAcfDmA6S7HrUTRiapt47otPy2rhkvKTGsFEK7L",
                key: 'assetOut'
            },
            {
                type: "string",
                value: "3NhCzjv9RVbvVKWXYU6JxcjUVJCKLPRb9si",
                key: 'recipient'
            },
            {
                type: "integer",
                value: 1000000,
                key: 'amount'
            }

        ],
    })

    const signedTx = await sdk.signer.getSignedTx(tx, SEED)

    await sdk.broadcast(signedTx)
}

transfer()
    .then(() => {
        console.log('Successfully executed')
    })
    .catch(console.error)