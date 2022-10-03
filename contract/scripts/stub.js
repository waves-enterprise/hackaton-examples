const {We} = require('@wavesenterprise/sdk');
const {TRANSACTIONS} = require('@wavesenterprise/transactions-factory');
const {Keypair} = require("@wavesenterprise/signer");

const SEED = 'copper venture beauty snake wear million champion enact humor visa prepare garment party rapid annual'
const NODE_URL = 'http://localhost:6862';
const sdk = new We(NODE_URL)

const call = process.argv[2];

const CONTRACT_ID = 'CaPeG2t3Xsjcq9E6o4g4ncPg4S6zJmjdEQsQpuHSVERE'

console.log("Call ", {call})

async function exampleAction() {
    const config = await sdk.node.config()
    const fee = config.minimumFee[104]

    const keypair = await Keypair.fromExistingSeedPhrase(SEED);

    const tx = TRANSACTIONS.CallContract.V5({
        contractId: CONTRACT_ID,
        params: [
            {
                key: 'action',
                value: 'exampleAction',
                type: 'string'
            },
        ],
        senderPublicKey: await keypair.publicKey(),
        fee: fee,
        contractVersion: 1,
        payments: []
    })

    const signedTx = await sdk.signer.getSignedTx(tx, SEED);

    const res = await sdk.broadcast(signedTx);

    console.log(res)
}

const methods = {
    exampleAction
}

methods[call]()
    .then(() => {
        console.log('Successfully executed')
    })
    .catch(console.error)