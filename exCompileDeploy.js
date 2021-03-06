const ethers = require('ethers');
const solc = require('solc');
const ganache = require("ganache-core");

const randomWallet = ethers.Wallet.createRandom();
const ganacheProvider = ganache.provider({
    accounts: [{
        balance: ethers.utils.parseEther("10").toString(),
        secretKey: randomWallet.privateKey,
    }]
});

const provider = new ethers.providers.Web3Provider(ganacheProvider);
const wallet = randomWallet.connect(provider);

async function deploy() {
    const content = `
        pragma solidity ^0.8.11;
        contract Contract {
            uint public x;
            constructor(uint _x) {
                x = _x;
            }
            function addOne() public {
                x++;
            }
        }
    `;

    const input = {
        language: 'Solidity',
        sources: { 'contract.sol': { content } },
        settings: { outputSelection: { '*': { '*': ['*'] } } }
    };
    const output = JSON.parse(solc.compile(JSON.stringify(input)));

    const { Contract } = output.contracts['contract.sol'];
    const factory = ethers.ContractFactory.fromSolidity(Contract, wallet);
    const contract = await factory.deploy(5);

    let x = await contract.x();
    console.log(x.toString());
    await contract.addOne();
    x = await contract.x();

//     console.log(x.toString());

}

deploy();
