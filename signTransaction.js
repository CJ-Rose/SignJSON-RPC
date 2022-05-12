const { FeeMarketEIP1559Transaction } = require('@ethereumjs/tx');
const { default: Common, Chain, Hardfork } = require('@ethereumjs/common');
const axios = require('axios');
require('dotenv').config()

const common = new Common({ chain: Chain.Rinkeby, hardfork: Hardfork.London });
 // if you set up the .env file correctly, your private key and alchemy endpoint will be accessed automatically using `process.env`
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ALCHEMY_ENDPOINT = process.env.ALCHEMY_ENDPOINT;

const txParams = {
  "nonce": 4, // you will need to change this!
  "gasLimit": "0x5249",
  "maxPriorityFeePerGas": "0x3b9aca00",
  "maxFeePerGas": "0x3b9acaff",
  "to": "0x7B99CBF7300B1208B64Fa648435d26b2116991e8", // choose someone to send some ETH to!
//   "value": "0x5af3107a4000", // .0001 ether
  "chainId": "0x04", // rinkeby chain id
  "type": "0x02",
  "data": "0x6d4e6654" // eip 1559
}

const tx = FeeMarketEIP1559Transaction.fromTxData(txParams, { common });

const privateKey = Buffer.from(PRIVATE_KEY, 'hex');

const signedTx = tx.sign(privateKey);

const serializedTx = signedTx.serialize();

const rawTx = "0x" + serializedTx.toString("hex");

axios.post(ALCHEMY_ENDPOINT, {
  jsonrpc: "2.0",
  id: 1,
  method: "eth_sendRawTransaction",
  params: [rawTx]
}).then((response) => {
  if(response.data.error) {
    console.log(response.data.error);
  }
  else {
    console.log("Tx hash: " + response.data.result);
  }
});