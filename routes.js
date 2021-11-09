const routes = require('next-routes')();

routes
    .add('/campaigns/new', '/campaigns/new')
    .add('/campaigns/:address', '/campaigns/show')
    .add('/campaigns/:address/requests', '/campaigns/requests/request_index')
    .add('/campaigns/:address/requests/new', '/campaigns/requests/request_new');

module.exports = routes;