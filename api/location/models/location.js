'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

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
    var location
    if (data.geocoded_address !== search_address | data.longitude == null | data.latitude == null) {
        try {
            const locations = await strapi.services.location.geosearch(search_address, "1")
            location = locations[0]
            console.log(locations)
            //data.longitude = parseFloat(locations[0].lon)
            //data.latitude = parseFloat(locations[0].lat)
        } catch {
            location = null
        }
        //data.formatted_address = search_address
    }

    if (location) {
        const empty_fields = ['name', 'address', 'city', 'postal_code'].filter( key => {
            if (data[key]) {
                return data[key].length < 3
            }
            return true
        })

        var house_number
        var road
        for (var key in location.address) {
            switch (key) {
                case ['place', 'ameninty', 'office', 'club', 'house_name'].includes(key):
                    if (empty_fields.includes('name')) {
                        data.name = location.address[key]
                    }
                    break
                case 'house_number':
                    house_number = location.address[key]
                    break
                case 'road':
                    road = location.address[key]
                case 'postcode':
                    if (empty_fields.includes('postal_code')) {
                        data.postal_code = location.address[key]
                    }
                    break
            }
        }

        const address = [house_number, road].filter( item => {return item != null}).join(" ")

        if (empty_fields.includes['address']) {
            data.address = address
        } else if (house_number) {
            if (!data.address.startsWith(house_number)) {
                data.address = address
            }
        }

        data.longitude = parseFloat(location.lon)
        data.latitude = parseFloat(location.lat)

        data.geocoded_address =  ['name', 'address', 'city', 'province', 'postal_code', 'country'].filter( key => {
            if (data[key]) {
                return data[key].length > 0
            }
            return false
        }).map( key => {
            return data[key]
        }).join(", ")
    }
 }

module.exports = {
    lifecycles: {
        beforeCreate: async (data) => {
            await update(data)
        },
        beforeUpdate: async (params, data) => {
            //console.log(data)
            await update(data)
        }
    }
};
