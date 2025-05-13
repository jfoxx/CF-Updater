//change to your environment
const env = 'p129103-e1259846';

//path to your downloaded service credentials json file  see: https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/implementing/developing/generating-access-tokens-for-server-side-apis#fetch-the-aem-as-a-cloud-service-credentials
const credentialsFile = './demo1cloud-service-credentials.json';

//folder path to content fragment parent
const folderPath = 'north-carolina/services/';

//json file output from the AI agent that is placed inline with this project
const jsonFile = './serviceUrls.json';

// body
const postBody = {
    "properties": {
        "elements": {
            "income": {
                "value": [
                    "state-portal:demographics/income/100000-149999",
                    "state-portal:demographics/income/15000-24999",
                    "state-portal:demographics/income/150000-199999",
                    "state-portal:demographics/income/200000-249999",
                    "state-portal:demographics/income/25000-34999",
                    "state-portal:demographics/income/250000-299999",
                    "state-portal:demographics/income/35000-54999",
                    "state-portal:demographics/income/55000-74999",
                    "state-portal:demographics/income/7500-14999",
                    "state-portal:demographics/income/75000-99999",
                    "state-portal:demographics/income/0-7499",
                    "state-portal:demographics/income/above-300000"
                ]
            },
            "military": {
                "value": [
                    "state-portal:demographics/military/none",
                    "state-portal:demographics/military/veteran",
                    "state-portal:demographics/military/family-active",
                    "state-portal:demographics/military/active"
                ]
            },
            "employment": {
                "value": [
                    "state-portal:demographics/employment/ft-multiple",
                    "state-portal:demographics/employment/ft-single",
                    "state-portal:demographics/employment/pt",
                    "state-portal:demographics/employment/not-employed"
                ]
            },
            "familyStatus": {
                "value": [
                    "state-portal:demographics/family/married",
                    "state-portal:demographics/family/married-with-children",
                    "state-portal:demographics/family/single",
                    "state-portal:demographics/family/single-with-children"
                ]
            }
        }
    }
};


function createCFs(sourceFile) {
    // Load the source file
    const fs = require('fs');
    const source = fs.readFileSync(sourceFile, 'utf8');
    const data = JSON.parse(source) || [];

    const exchange = require("@adobe/aemcs-api-client-lib");
    var config = JSON.parse(fs.readFileSync(credentialsFile, 'utf8'));
    exchange(config).then(res => {
        data.forEach((entry) => {
            const options = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${res.access_token}`,
                },
                body: JSON.stringify(postBody),
            };
            fetch(entry, options)
                .then((response) => {
                    if (response.ok) {
                        console.log(`Created: ${entry}`);
                    } else {
                        console.error(`Failed to create: ${entry}: responded with ${response.status}`);
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


createCFs(`${jsonFile}`);