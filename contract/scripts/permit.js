const {We} = require('@wavesenterprise/sdk');
const {TRANSACTIONS, TRANSACTION_TYPES} = require('@wavesenterprise/transactions-factory');
const {Keypair} = require("@wavesenterprise/signer");

const SEED = 'copper venture beauty snake wear million champion enact humor visa prepare garment party rapid annual'
const NODE_URL = 'http://localhost:6862';
const sdk = new We(NODE_URL)

async function permit() {
    const config = await sdk.node.config()
    const fee = config.minimumFee[TRANSACTION_TYPES.Issue]

    const keypair = await Keypair.fromExistingSeedPhrase(SEED);

    TRANSACTIONS.Data.V2({
        data:[

            {key: 'value'},
        ]


    })


    const tx = TRANSACTIONS.Permit.V2({
        fee,
        target: "",
        role
    })

    const signedTx = await sdk.signer.getSignedTx(tx, SEED);

    console.log(signedTx.getRawBody())

    const res = await sdk.broadcast(signedTx);

    console.log(res)
}

permit()
    .then(() => {
        console.log('Successfully executed')
    })
    .catch(console.error)