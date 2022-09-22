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
        imageHash: 'd9bf733034cd5cc70f73d13d60b0df1ec919309f0f105387c3f7be3e63046ba8',
        image: 'nft-marketplace:latest',
        validationPolicy: {type: "any"},
        senderPublicKey: await keypair.publicKey(),
        params: [{
            key: 'name',
            type: 'string',
            value: 'WESTNFT'
        }],
        payments: [],
        contractName: 'nft-markeplace-rc3',
        apiVersion: '1.0'
    })



    const signedTx = await sdk.signer.getSignedTx(tx, SEED);

    console.log(signedTx.getRawBody())

    const res = await sdk.broadcast(signedTx);


    console.log(res)

}

create()
    .then(() => {
        console.log('Successfully executed')
    })
    .catch(console.error)