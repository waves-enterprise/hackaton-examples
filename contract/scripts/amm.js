const {We} = require('@wavesenterprise/sdk');
const {TRANSACTIONS} = require('@wavesenterprise/transactions-factory');
const {Keypair} = require("@wavesenterprise/signer");

const SEED = 'copper venture beauty snake wear million champion enact humor visa prepare garment party rapid annual'
const NODE_URL = 'http://localhost:6862';
const sdk = new We(NODE_URL)

const call = process.argv[2];

const CONTRACT_ID = 'A1t23q7F6F3y2KE1ScgZLJErMcKazdLogCoTeVCkj1Ry'

console.log("Call ", {call})

async function addLiquidity() {
    const config = await sdk.node.config()
    const fee = config.minimumFee[103]

    const keypair = await Keypair.fromExistingSeedPhrase(SEED);

    const tx = TRANSACTIONS.CallContract.V5({
        contractId: CONTRACT_ID,
        params: [
            {
                key: 'action',
                value: 'addLiquidity',
                type: 'string'
            },
        ],
        senderPublicKey: await keypair.publicKey(),
        fee: fee,
        contractVersion: 2,
        payments: [
            {
                amount: 100000000
            },
            {
                assetId: "AmL1n9b8NJtPcMALhN2CScDadLMBg48kEwux6Jg9Ar7J",
                amount: 100000
            }
        ]
    })

    const signedTx = await sdk.signer.getSignedTx(tx, SEED);

    const res = await sdk.broadcast(signedTx);

    console.log(res)
}

async function swap() {
    const config = await sdk.node.config()
    const fee = config.minimumFee[103]

    const keypair = await Keypair.fromExistingSeedPhrase(SEED);

    const tx = TRANSACTIONS.CallContract.V5({
        contractId: CONTRACT_ID,
        params: [
            {
                key: 'action',
                value: 'swap',
                type: 'string'
            },
        ],
        senderPublicKey: await keypair.publicKey(),
        fee: fee,
        contractVersion: 2,
        payments: [
            {
                amount: 100000000
            },
        ]
    })

    const signedTx = await sdk.signer.getSignedTx(tx, SEED);

    const res = await sdk.broadcast(signedTx);

    console.log(res)
}


const methods = {
    addLiquidity,
    swap
}

methods[call]()
    .then(() => {
        console.log('Successfully executed')
    })
    .catch(console.error)