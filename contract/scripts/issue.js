const {We} = require('@wavesenterprise/sdk');
const {TRANSACTIONS, TRANSACTION_TYPES} = require('@wavesenterprise/transactions-factory');
const {Keypair} = require("@wavesenterprise/signer");

const SEED = 'copper venture beauty snake wear million champion enact humor visa prepare garment party rapid annual'
const NODE_URL = 'http://localhost:6862';
const sdk = new We(NODE_URL)

async function issue() {
    const config = await sdk.node.config()
    const fee = config.minimumFee[TRANSACTION_TYPES.Issue]

    const keypair = await Keypair.fromExistingSeedPhrase(SEED);

    console.log(await keypair.address())

    const tx = TRANSACTIONS.Issue.V2({
        fee,
        name: "WAVBER",
        description: 'testtoken',
        script: null,
        chainId: "V".charCodeAt(0),
        senderPublicKey: await keypair.publicKey(),
        reissuable: false,
        quantity: 100000000,
        decimals: 8,
    })

    const signedTx = await sdk.signer.getSignedTx(tx, SEED);

    console.log(signedTx.getRawBody())

    const res = await sdk.broadcast(signedTx);

    console.log(res)
}

issue()
    .then(() => {
        console.log('Successfully executed')
    })
    .catch(console.error)