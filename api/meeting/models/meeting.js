'use strict'

const slugify = require('slugify')

const setSlug = (params, data) => {
  if (data.name) {
    const name_slug = slugify(data.name, { lower: true })
    if (data.slug) {
      if (data.slug.startsWith(name_slug)) {
        return
      }
    }
    data.slug = name_slug + `-` + params.id.toString()
  }
}

const validateTypes = async (data) => {
  // validate has location
  if (data.location == null) {
    return 'Meeting must have a location'
  }
  // validate unique type categories
  if (data.types) {
    let unique_catagories = await strapi.query('meeting-type-category').find({ unique: true })

    for (var category in unique_catagories) {
      let id = category.id
      let types = await strapi.query('meeting-type').find({ category: id })
      let ids = types.map((type) => type.id)
      let found_ids = data.types.filter((type) => ids.includes(type))
      if (found_ids.length > 1) {
        let found_types = types.filter((type) => found_ids.includes(type.id))
        let found_details = found_types.map((type) => type.detail)
        return 'Meeting can only have one of the selected types: ' + found_details
      }
    }
  }
  return null
}

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    beforeCreate: async (data) => {
      //setSlug(data)
      const err = await validateTypes(data)
      if (err) {
        throw strapi.errors.badRequest(err)
      }
    },

    afterCreate: async (result, data) => {
      // Trigger update to set slug
      await strapi.query('meeting').update({ id: result.id }, data)
    },
    beforeUpdate: async (params, data) => {
      setSlug(params, data)
      //console.log(params)
      const err = await validateTypes(data)
      if (err) {
        throw strapi.errors.badRequest(err)
      }
    }
  }
}
