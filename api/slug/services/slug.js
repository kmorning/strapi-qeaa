'use strict'

const slugify = require('slugify')

module.exports = {
  setSlug: (params, data) => {
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
}
