import { getDbClient, getCollectionClient } from '../../data/access/dbaccess';

const express = require('express');
const router = express.Router();

// Get Posts
router.get('/covid/global/:status', async (request, response) => {
    try {
        const client = await getCollectionClient(request.path);
        
        if (client === undefined) {
            let error = { error: 'Invalid global endpoint', accepted: ['/covid/global/confirmed', '/covid/global/deaths', '/covid/global/recovered'] };
            response.send(JSON.stringify(error));
        }
        else {
            response.send(await client.find({}).toArray());
        }
    }
    catch(err) {
        response.send(err);
    }
});

module.exports = router;
