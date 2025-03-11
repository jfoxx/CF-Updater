function parseServices() {
    const fs = require('fs');
    var servicesJson = fs.readFileSync('services.json' , 'utf8');
    var servicesObj = JSON.parse(servicesJson);
    var items = servicesObj.data.governmentServiceList.items;
        items.forEach((service) => {
       console.log( service.serviceId);
    });
}

parseServices();