'use strict';

const slugify = require('slugify')

const setSlug = (data) => {
    if (data.name && data.day && data.time) {
        const s = data.name + `-` + data.day.toString() + `-` + data.time.toString()
        data.slug = slugify(s)
    }
}

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
        }
    }
};
