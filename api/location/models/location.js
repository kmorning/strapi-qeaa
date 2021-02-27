'use strict'

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

const update = async (data) => {
  // Don't perform custom update operations when we publish or unpublish
  if (data.published_at !== undefined) {
    return
  }
  const entered_fields = ['name', 'address', 'city', 'province', 'postal_code', 'country'].filter((key) => {
    if (data[key]) {
      return data[key].length > 0
    }
    return false
  })

  const search_named_fields = entered_fields.filter((key) => key !== 'postal_code')
  const search_named_address = search_named_fields
    .map((key) => {
      return data[key]
    })
    .join(', ')
  const search_fields = search_named_fields.filter((key) => key !== 'name')
  const search_address = search_fields
    .map((key) => {
      return data[key]
    })
    .join(', ')

  //console.log(formatted_address)
  var location
  if ((data.geocoded_address !== search_named_address) | (data.longitude == null) | (data.latitude == null)) {
    try {
      const locations = await strapi.services.location.geosearch(search_named_address, '1')
      location = locations[0]
    } catch {
      try {
        const locations = await strapi.services.location.geosearch(search_address, '1')
        location = locations[0]
      } catch {
        location = null
      }
    }
    //console.log(location)
    if (location) {
      const empty_fields = ['name', 'address', 'city', 'postal_code'].filter((key) => {
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
            break
          case 'postcode':
            if (empty_fields.includes('postal_code')) {
              data.postal_code = location.address[key]
            }
            break
          case ['municipality', 'city', 'town', 'village'].includes(key):
            if (empty_fields.includes('city')) {
              data.city = location.address[key]
            }
        }
      }

      const address = [house_number, road]
        .filter((item) => {
          return item != null
        })
        .join(' ')
      if (empty_fields.includes('address')) {
        data.address = address
      } else if (house_number) {
        if (!data.address.startsWith(house_number)) {
          data.address = address
        }
      }

      data.longitude = parseFloat(location.lon)
      data.latitude = parseFloat(location.lat)

      data.geocoded_address = ['name', 'address', 'city', 'province', 'postal_code', 'country']
        .filter((key) => {
          if (data[key]) {
            return data[key].length > 0
          }
          return false
        })
        .map((key) => {
          return data[key]
        })
        .join(', ')
    } else {
      data.geocoded_address = 'Not Found!'
    }
  }
  data.display_name = ['name', 'address', 'city']
    .filter((key) => {
      if (data[key]) {
        return data[key].length > 0
      }
      return false
    })
    .map((key) => {
      return data[key]
    })
    .join(', ')
}

module.exports = {
  lifecycles: {
    beforeCreate: async (data) => {
      await update(data)
    },
    beforeUpdate: async (params, data) => {
      /*
      console.log('location updating...')
      console.log('parms:')
      console.log(params)
      console.log('data:')
      console.log(data)
      */
      await update(data)
    }
  }
}
