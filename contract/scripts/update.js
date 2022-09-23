const {We} = require('@wavesenterprise/sdk');
const {TRANSACTIONS} = require('@wavesenterprise/transactions-factory');
const {Keypair} = require("@wavesenterprise/signer");

const SEED = 'copper venture beauty snake wear million champion enact humor visa prepare garment party rapid annual'
const NODE_URL = 'http://localhost:6862';
const sdk = new We(NODE_URL);

const CONTRACT_ID = 'A1t23q7F6F3y2KE1ScgZLJErMcKazdLogCoTeVCkj1Ry'

async function create() {
    const config = await sdk.node.config()
    const fee = config.minimumFee[103]

    const keypair = await Keypair.fromExistingSeedPhrase(SEED);

    const tx = TRANSACTIONS.UpdateContract.V4({
        fee,
        contractId: CONTRACT_ID,
        imageHash: 'bd1b8a36961f1c26595cf6d597b9a146fe2c5935bacd5044d142411b39878a7e',
        image: 'nft-mp:latest',
        validationPolicy: {type: "any"},
        senderPublicKey: await keypair.publicKey(),
        contractName: 'amm-v1',
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