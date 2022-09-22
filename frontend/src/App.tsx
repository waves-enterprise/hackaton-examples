import React from 'react';
import './App.css';
import {We} from "@wavesenterprise/sdk";
import {TRANSACTION_TYPES, TRANSACTIONS} from "@wavesenterprise/transactions-factory";
import {Keypair} from "@wavesenterprise/signer";

const nodeUrl = `https://carter.welocal.dev/node-0`

const sdk = new We(nodeUrl)
const SEED = 'when cluster camera mistake movie certain category garlic regret believe visit evidence cute legal expire'

function App() {
    const handleTx = async () => {
        const recipient = await Keypair.generate();
        const config: any = await sdk.node.config();
        const fee = config.minimumFee[TRANSACTION_TYPES.Transfer]

        const senderKP = await Keypair.fromExistingSeedPhrase(SEED);

        const tx = TRANSACTIONS.Transfer.V3({
            attachment: "",
            amount: 100000000,
            recipient: await recipient.address(),
            fee,
            senderPublicKey: await senderKP.publicKey()
        })

        const signedTx = await sdk.signer.getSignedTx(tx, SEED)

        const res = await sdk.broadcast(signedTx)
        console.log('Sended Tx:', res)
    }

    return (
        <div className="App">
            <button onClick={handleTx}>Send Tx</button>
        </div>
    );
}

export default App;
