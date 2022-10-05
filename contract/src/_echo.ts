import {
    ContractServiceClient,
    ContractTransactionResponse
} from "@wavesenterprise/js-contract-grpc-client/contract/contract_contract_service";
import {credentials, Metadata} from "@grpc/grpc-js";

export const CONNECTION_ID = process.env.CONNECTION_ID || '';
export const CONNECTION_TOKEN = process.env.CONNECTION_TOKEN || '';
export const NODE = process.env.NODE || '';
export const NODE_PORT = process.env.NODE_PORT || '';
export const HOST_NETWORK = process.env.HOST_NETWORK || '';

export class RPCConnectionConfig {
    constructor(
        private _connectionId: string,
        private _connectionToken: string,
        private _node: string,
        private _nodePort: string,
    ) {
    }

    public connectionId() {
        return this._connectionId;
    }

    public connectionToken() {
        return this._connectionToken;
    }

    public node() {
        return this._node;
    }

    public nodePort() {
        return this._nodePort;
    }
}

export const envConfig = (): RPCConnectionConfig => {
    return new RPCConnectionConfig(CONNECTION_ID, CONNECTION_TOKEN, NODE, NODE_PORT);
};


const config = envConfig();
const address = `${config.node()}:${config.nodePort()}`;

export async function main() {
    const contractService = new ContractServiceClient(address, credentials.createInsecure());

    const connectionMeta = new Metadata();

    connectionMeta.set('authorization', config.connectionToken());

    const conn = contractService.connect(
        {
            connectionId: config.connectionId(),
        },
        connectionMeta,
    );


    conn.on('data', (resp: ContractTransactionResponse) => {
        console.log(resp.transaction.payments[0].assetId)
        console.log(resp.transaction.payments[0].amount.toNumber())
    });
}


