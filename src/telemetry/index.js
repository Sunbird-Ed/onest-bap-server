
const axios = require('axios');


exports.send = (requestContext, requestMessage, response) => {
    let data = JSON.stringify({
        "data": {
          "id": "onest-batch-1",
          "events": [
            {
              "context": requestContext,
              "message": requestMessage,
              "sync_response": response
            }
          ]
        }
      });
      
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://dev.obsrv.sunbird.org/obsrv/v1/data/onest',
        headers: { 
          'Content-Type': 'application/json', 
          'x-api-key': 'TaXev840SX2K51Im3wbkT2g45kovddTx3lQbqtKy'
        },
        data : data
      };
      
      axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log('telemetry send error',error);
      });
}

