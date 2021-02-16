'use strict';

const slugify = require('slugify');

const setSlug = (data) => {
    if (data.name && data.day && data.time) {
        const s = data.name + `-` + data.day.toString() + `-` + data.time.toString()
        data.slug = slugify(s)
    }
}

const validateTypes = async (data) => {
    // validate unique type categories
    let unique_catagories = await strapi.query('meeting-type-category').find({unique: true})

    for ( let i = 0; i < unique_catagories.length; i++) {
        let id = unique_catagories[i].id
        let types = await strapi.query('meeting-type').find({ category: id })
        let ids = types.map( type => type.id)
        let found_ids = data.types.filter(type => ids.includes(type))
        if (found_ids.length > 1) {
            let found_types = types.filter(type => found_ids.includes(type.id))
            let found_details = found_types.map( type => type.detail)
            return "Meeting can only have one of the selected types: " + found_details
        }
    }
    return null
};

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
    lifecycles: {
        beforeCreate: async (data) => {
            setSlug(data)
        },
        beforeUpdate: async (params, data) => {
            setSlug(data)
            const err = await validateTypes(data)
            if (err) {
                //console.log('duplicates found')
                //throw new Error('Duplicates Found!')
                throw strapi.errors.badRequest(err)
            }
            //let types = await strapi.query('meeting-type').find({ id_in: data.types })
            //console.log(types)
        }
    }
};
