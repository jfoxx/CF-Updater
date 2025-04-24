//change to your environment
const env = 'p129103-e1259846';

//path to your downloaded service credentials json file  see: https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/implementing/developing/generating-access-tokens-for-server-side-apis#fetch-the-aem-as-a-cloud-service-credentials
const credentialsFile = './demo1cloud-service-credentials.json';

//folder path to content fragment parent
const folderPath = 'north-carolina/services/';

//json file output from the AI agent that is placed inline with this project
const jsonFile = './services.json';


function createCFs(endpoint, sourceFile) {
    // Load the source file
    const fs = require('fs');
    const source = fs.readFileSync(sourceFile, 'utf8');
    const data = JSON.parse(source) || [];

    const exchange = require("@adobe/aemcs-api-client-lib");
    var config = JSON.parse(fs.readFileSync(credentialsFile, 'utf8'));
    exchange(config).then(res => {
        data.forEach((entry) => {
            const name = entry.properties.title.toLowerCase().replace(/ /g, '-');
            const url = `${endpoint}/${name}`;
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${res.access_token}`,
                },
                body: JSON.stringify(entry),
            };
    
            fetch(url, options)
                .then((response) => {
                    if (response.ok) {
                        console.log(`Created: ${name}`);
                    } else {
                        console.error(`Failed to create: ${name}: ${endpoint} responded with ${response.status}`);
                    }
                })
                .catch((error) => {
                    console.error(`Error: ${error}`);
                });
            
        });

    }).catch(e => {
        console.log("Failed to exchange for access token ", e);
    }) 
}


createCFs(`https://author-${env}.adobeaemcloud.com/api/assets/${folderPath}`, `${jsonFile}`);