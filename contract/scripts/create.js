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
        imageHash: 'aec264c7cfae12ad2953ecec4855fed0edc7404f4d67c6ad1e070c46026bb10b',
        image: 'go-test:latest',
        validationPolicy: {type: "any"},
        senderPublicKey: await keypair.publicKey(),
        params: [{
            key: 'assetId',
            type: 'string',
            value: 'AmL1n9b8NJtPcMALhN2CScDadLMBg48kEwux6Jg9Ar7J'
        }],
        payments: [
            {
                amount: 100000000
            },
            {
                assetId: "AmL1n9b8NJtPcMALhN2CScDadLMBg48kEwux6Jg9Ar7J",
                amount: 100000
            }
        ],
        contractName: 'gottest',
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