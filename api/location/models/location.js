'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

 const geocode = async (data) => {
    const full_address = ['address', 'city', 'postal_code', 'country'].filter( key => {
        if (data[key]) {
            return data[key].length > 0
        }
        return false
    }).map( key => {
        return data[key]
    }).join(", ")
    console.log(full_address)
    try {
        const locations = await strapi.services.location.geosearch(full_address)
        data.longitude = parseFloat(locations[0].lon)
        data.latitude = parseFloat(locations[0].lat)
    } catch {
        return
    }
 }

module.exports = {
    lifecycles: {
        beforeCreate: async (data) => {
            await geocode(data)
        },
        beforeUpdate: async (params, data) => {
            await geocode(data)
        }
    }
};
