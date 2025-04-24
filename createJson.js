const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, 'state-agencies.txt');
const outputFile = path.join(__dirname, 'services.json');

fs.readFile(inputFile, 'utf-8', (err, data) => {
  if (err) {
    console.error('Error reading the input file:', err);
    return;
  }

  const serviceBlocks = data.split(/\n(?=\d+\.\s\*\*)/g); // Split by numbered services
  const services = [];

  serviceBlocks.forEach(block => {
    const titleMatch = block.match(/\*\*(.+?)\*\*/);
    const descriptionMatch = block.match(/- \*\*Description\*\*: (.+)/);
    const linkMatch = block.match(/- \*\*Link\*\*: (.+)/);
    const agencyMatch = block.match(/- \*\*Agency\*\*: (.+)/);
    const iconMatch = block.match(/- \*\*Icon\*\*: (.+)/);
    const keywordsMatch = block.match(/- \*\*Keywords\*\*: (.+)/);
    const serviceIdMatch = block.match(/- \*\*Service ID\*\*: (\d{4})/);

    if (
      titleMatch && descriptionMatch && linkMatch && agencyMatch &&
      iconMatch && keywordsMatch && serviceIdMatch
    ) {
      const title = titleMatch[1];
      const description = descriptionMatch[1];
      const link = linkMatch[1];
      const agency = agencyMatch[1];
      const icon = iconMatch[1];
      const keywords = keywordsMatch[1];
      const serviceId = serviceIdMatch[1];

      const service = {
        properties: {
          "cq:model": "/conf/residentportal/settings/dam/cfm/models/government-service",
          title: title,
          description: description,
          elements: {
            title: {
              value: title,
              ":type": "text/plain"
            },
            description: {
              value: description,
              ":type": "text/html"
            },
            link: {
              value: link,
              ":type": "text/plain"
            },
            agency: {
              value: agency,
              ":type": "tag"
            },
            icon: {
              value: icon
            },
            keywords: {
              value: keywords
            },
            serviceId: {
              value: serviceId
            }
          }
        }
      };

      services.push(service);
    }
  });

  fs.writeFile(outputFile, JSON.stringify(services, null, 2), err => {
    if (err) {
      console.error('Error writing the output file:', err);
    } else {
      console.log('services.json has been created with', services.length, 'entries.');
    }
  });
});
