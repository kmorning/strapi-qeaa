'use strict';

const slugify = require('slugify');

const setSlug = (data) => {
    if (data.name && data.day && data.time) {
        const s = data.name + `-` + data.day.toString() + `-` + data.time.toString()
        data.slug = slugify(s)
    }
}

const validateTypes = async (data) => {
    // validate unique types
    let unique_catagories = await strapi.query('meeting-type-category').find({unique: true})
    //console.log(unique_catagories)
    //let unique_cat_ids = unique_catagories.map(category => {return category.id})

    for ( let i = 0; i < unique_catagories.length; i++) {
        let id = unique_catagories[i].id
        let types = await strapi.query('meeting-type').find({ category: id })
        let ids = types.map( type => type.id)
        let found_ids = data.types.filter(type => ids.includes(type))
        if (found_ids.length > 1) {
            return false
            //console.log('duplicates found')
        }
    }
    return true

    /*
    unique_cat_ids.forEach( async id => {
        let types = await strapi.query('meeting-type').find({ category: id })
        let ids = types.map( type => type.id)
        //console.log(ids)
        let found_ids = data.types.filter(type => ids.includes(type))
        //console.log(found_ids)
        if (found_ids.length > 1) {
            throw new Error('Invalid type selections!')
        }
    })
    */
    
    //console.log('ids: ' + unique_ids)
    //let types = await strapi.query('meeting-type').find({ id_in: data.types })
    //console.log('this is a unique type: ' + types[0].category.id)
    //let unique_types = types.filter(type => type.category === unique_ids[0])
    //console.log(data.types)
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
            const result = await validateTypes(data)
            if (result === false) {
                //console.log('duplicates found')
                //throw new Error('Duplicates Found!')
                throw strapi.errors.badRequest("Having both 'Open' and 'Closed' types is not allowed")
            }
            //let types = await strapi.query('meeting-type').find({ id_in: data.types })
            //console.log(types)
        }
    }
};
