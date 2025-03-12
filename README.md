# AEM Content Fragment creator from AI-generated json file
This script creates content fragments in AEM from a json file generated by AI.

## Installation
Clone this repo onto your local environment. Open the project in VSCode.  Open the `index.js` file and update the 4 variables at the top of that script.
- `env` : the p and e part of your AEM environment (eg: p4500-e3455);
- `credentialsFile` : the path to the file generated in the Setup section below
- `folderPath` : the path in AEM where the CF will be created.  The final path will include '/content/dam' but for the purpose of the API, we can omit that part. 
- `jsonFile`: the path to the json file output by AI with the CF content. See more below.


## Setup
Before using this, some setup is required on the AEM instance. 
1. First, you need to [set up a service worker](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/implementing/developing/generating-access-tokens-for-server-side-apis#fetch-the-aem-as-a-cloud-service-credentials) on the instance.
2. Download the resulting .json file into the folder with this project, and update the variable as described above.
3. You need a CF model to import into.  You must first create a model, since the model is part of the json in the POST.

## JSON generation
AI is  incredibly good at this.  You just need to give it the right prompt. Depending on your model, you will need to adjust the JSON template described below, so that the fields match those of your CF model. 
Here is an example prompt:
```
Please generate 40 Washington state agency services and return those into a single JSON file using the template below. : {
    "properties": {
        "cq:model": "/conf/warp/settings/dam/cfm/models/government-service",
        "title": "<<Title of service>>",
        "description": "<<Description of service>>",
        "elements": {
            "title": {
                "value": "<<Title of service>>",
                ":type": "text/plain"
            },
            "description": {
                "value": "<<Description of service>>",
                ":type": "text/html"
            },
            "link": {
                "value": "<<Web URL to the service>>",
                ":type": "text/plain"
            },
            "icon": {
            "value": "fontawesome:icon/<<some fontawesome icon that matches the service>>",
            },
            "keywords": {
            "value": "<<Descriptive words and phrases for search terms associated with this service separated by commas>>"
            },
            "serviceId": {
                "value": "<<randomized 4 digit number>>"
            },
        }
    }
}
```
What you will get as a response varies based on the AI agent you are using. But it should be a JSON file you can download with all of the fragment definitions grouped together into a single array.  Once you have that file, you can add the path to that file as the variable `jsonFile`.

## Usage 
Now that you have all of the pieces, open a terminal from inside the project folder and run `npm install --save`. Once installation completes, run `npm start`.
The script will grab a new token and perform a `POST` on the AEM instance with each of the items in the AI-provided JSON file. You should see a line for each item in the console saying it was created.

## Troubleshooting
If the process fails before a POST is made, it's likely that one of your variables is pointing to the wrong file name. Double check your variables and make sure those paths are correct.  
If you get 401 responses from each of the item, that means something is off with the token or your service account doesn't have proper access.  Make sure the token is being received, you will see something in the console with the payload of the response, showing when the token expires, etc. If that is displaying, check AEM security to provide your technical account with `jcr:all` permissions on the /content nodes it is writing to. 
