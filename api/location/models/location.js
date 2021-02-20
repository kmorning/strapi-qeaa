'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

 // TODO: auto populate missing fields like postal code
 const update = async (data) => {
    const search_address = ['name', 'address', 'city', 'province', 'postal_code', 'country'].filter( key => {
        if (data[key]) {
            return data[key].length > 0
        }
        return false
    }).map( key => {
        return data[key]
    }).join(", ")
    //console.log(formatted_address)
    if (data.search_address !== search_address | data.longitude == null | data.latitude == null) {
        try {
            const locations = await strapi.services.location.geosearch(search_address, "1")
            console.log(locations)
            data.longitude = parseFloat(locations[0].lon)
            data.latitude = parseFloat(locations[0].lat)
        } catch {
            return
        }
        data.formatted_address = search_address
    }
 }

module.exports = {
    lifecycles: {
        beforeCreate: async (data) => {
            await update(data)
        },
        beforeUpdate: async (params, data) => {
            console.log(data)
            await update(data)
        }
    }
};
