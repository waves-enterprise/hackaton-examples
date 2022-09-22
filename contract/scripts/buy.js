const {sdk, SEED} = require('./env');
const {TRANSACTIONS, TRANSACTION_TYPES} = require("@wavesenterprise/transactions-factory");
const {Keypair} = require("@wavesenterprise/signer");

async function buy() {
    const config = await sdk.node.config()
    const fee = config.minimumFee[TRANSACTION_TYPES.CallContract]

    const keypair = await Keypair.fromExistingSeedPhrase(SEED)

    const tx = TRANSACTIONS.CallContract.V5({
        fee: fee,
        contractId: 'CFFVWpnzDueS2kGWt3x7KEBV5uKnxmTAdMpmz1wajFXt',
        contractVersion: 1,
        senderPublicKey: await keypair.publicKey(),
        payments: [
            {
                amount: 100
            }
        ],
        params: [
            {
                type: "string",
                value: "buy",
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
        ],
    })

    const signedTx = await sdk.signer.getSignedTx(tx, SEED)

    await sdk.broadcast(signedTx)
}

buy()
    .then(() => {
        console.log('Successfully executed')
    })
    .catch(console.error)