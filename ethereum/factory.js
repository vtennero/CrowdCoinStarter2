import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json'

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0xc13c00Db233deF897EF2dbcf4834d5A82C6F5210'
);

export default instance;