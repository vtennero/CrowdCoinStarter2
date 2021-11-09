const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
// just have one campaign for all the it statements in this file:
let campaignAddress;
let campaign;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({data:compiledFactory.bytecode})
    .send({from:accounts[0], gas: '1000000'});

    await factory.methods.createCampaign('100').send({
        from: accounts[0],
        gas: '1000000'
    });

    // get the address of newly deployed campaign
    // code below means we want to take the first element of the array and assign it to variable campaignAddress
    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

    campaign = await new web3.eth.Contract(
        // interface for compiled campaign, needs to be parsed in JSON
        JSON.parse(compiledCampaign.interface),
        // address of already deployed version as second argument
        campaignAddress
    );
});

describe('Campaigns', () => {
    // check that campaigns are deployed
    it('deploys a factory and a campaign', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('marks caller as the campaign manager', async () => {
        const manager = await campaign.methods.manager().call();
        assert.equal(accounts[0],manager);
    });

    // people are able to donate money
    it('allows ppl to contribute and marks them approvers', async () => {
        await campaign.methods.contribute().send({
            value: '200',
            // ganache creates 10 accounts
            from: accounts[1]
        });
        const isContributor = await campaign.methods.approvers(accounts[1]).call();
        assert(isContributor);
    });

    it('requires a minimum contribution', async () => {
        try {
            await campaign.methods.contribute().send({
                // inferior to 100
                value: '5' ,
                from: accounts[1]
            });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it('allows a manager to make a payment request', async () => {
        await campaign.methods
            .createRequest('buy batteries', '100', accounts[1])
            .send({
                from: accounts[0],
                gas: '1000000'
            });
        const request = await campaign.methods.requests(0).call();

        assert.equal('buy batteries', request.description);
    });

    it('processes requests', async () => {
        await campaign.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei('10','ether')
        });

        await campaign.methods
            .createRequest('A', web3.utils.toWei('5','ether'), accounts[1])
            .send({ from: accounts[0], gas: '1000000'});

        await campaign.methods.approveRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        await campaign.methods.finalizeRequest(0).send({
            from:accounts[0],
            gas: '1000000'
        });

        let balance = await web3.eth.getBalance(accounts[1]);
        balance = web3.utils.fromWei(balance, 'ether');
        balance = parseFloat(balance);

        // because gas doesnt get cleared between tests, the value of balance is not 105 so the test shouldnt be 105 but higher than 104
        // console.log(balance);
        assert(balance > 104);
    });
});