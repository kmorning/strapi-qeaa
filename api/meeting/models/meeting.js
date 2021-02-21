'use strict'

const { v4: uuidv4 } = require('uuid')

const setSlug = (data) => {
  console.log(data)
  if (data.slug) {
    if (data.slug.length === 36) {
      return
    }
  }
  data.slug = uuidv4()
}

const validateTypes = async (data) => {
  // validate unique type categories
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
  return null
}

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    beforeCreate: async (data) => {
      setSlug(data)
      const err = await validateTypes(data)
      if (err) {
        throw strapi.errors.badRequest(err)
      }
    },
    beforeUpdate: async (params, data) => {
      setSlug(data)
      const err = await validateTypes(data)
      if (err) {
        throw strapi.errors.badRequest(err)
      }
    }
  }
}
