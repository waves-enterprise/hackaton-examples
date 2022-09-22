const {sdk, SEED} = require('./env');
const {TRANSACTIONS, TRANSACTION_TYPES} = require("@wavesenterprise/transactions-factory");
const {Keypair} = require("@wavesenterprise/signer");

async function sell() {
    const config = await sdk.node.config()
    const fee = config.minimumFee[TRANSACTION_TYPES.CallContract]

    const keypair = await Keypair.fromExistingSeedPhrase(SEED)

    const tx = TRANSACTIONS.CallContract.V5({
        fee: fee,
        contractId: 'CFFVWpnzDueS2kGWt3x7KEBV5uKnxmTAdMpmz1wajFXt',
        contractVersion: 1,
        senderPublicKey: await keypair.publicKey(),
        payments: [],
        params: [
            {
                type: "string",
                value: "sellToken",
                key: 'action'
            },
            {
                type: "string",
                value: "WEST_1",
                key: 'collectionId'
            },
            {
                type: "integer",
                value: 1,
                key: 'tokenId'
            },
            {
                type: "integer",
                value: 100,
                key: 'price'
            }
        ],
    })

    const signedTx = await sdk.signer.getSignedTx(tx, SEED)

    await sdk.broadcast(signedTx)
}

sell()
    .then(() => {
        console.log('Successfully executed')
    })
    .catch(console.error)