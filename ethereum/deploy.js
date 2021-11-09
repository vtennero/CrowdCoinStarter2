const { compile } = require("solc");
const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const compiledFactory = require('./build/CampaignFactory.json');

const provider = new HDWalletProvider(
  PHRASE,
  // remember to change this to your own phrase!
  RINKEBYAPI
  // remember to change this to your own endpoint!
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting to deploy from account", accounts[0]);

// old version 
  const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ gas: '1000000', gasPrice: '5000000000', from: accounts[0] });

// new version Udemy Q&A troubleshoot
  // const result = await new web3.eth.Contract(JSON.parse(interface))
  // .deploy({ data: '0x' + bytecode, arguments: ['Hi there!'] })
  // .send({ gas: '1000000',from: accounts[0]});

  console.log("Contract deployed to", result.options.address);
};
deploy();
