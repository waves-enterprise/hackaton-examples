const {We} = require('@wavesenterprise/sdk');
const {TRANSACTIONS} = require('@wavesenterprise/transactions-factory');
const {Keypair} = require("@wavesenterprise/signer");

const SEED = 'copper venture beauty snake wear million champion enact humor visa prepare garment party rapid annual'
const NODE_URL = 'http://localhost:6862';
const sdk = new We(NODE_URL)

async function create() {
    const config = await sdk.node.config()
    const fee = config.minimumFee[103]

    const keypair = await Keypair.fromExistingSeedPhrase(SEED);

    const tx = TRANSACTIONS.CreateContract.V5({
        fee,
        imageHash: '98fc89d54688714e6334fb12dd334e946978b163cacf0ea40cbdb3cc8f08fee4',
        image: 'test:latest',
        validationPolicy: {type: "any"},
        senderPublicKey: await keypair.publicKey(),
        params: [{
            key: 'assetId',
            type: 'string',
            value: 'EXAMPLE'
        }],
        payments: [
            {
                amount: 1
            }
        ],
        contractName: 'stub-contract',
        apiVersion: '1.0'
    })

    const signedTx = await sdk.signer.getSignedTx(tx, SEED);
    const res = await sdk.broadcast(signedTx);


    console.log(res)
}

create()
    .then(() => {
        console.log('Successfully executed')
    })
    .catch(console.error)