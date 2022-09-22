const {We} = require("@wavesenterprise/sdk");

const SEED = 'copper venture beauty snake wear million champion enact humor visa prepare garment party rapid annual'
const NODE_URL = 'http://localhost:6862';
const sdk = new We(NODE_URL)



module.exports = {
    NODE_URL,
    SEED,
    sdk
}