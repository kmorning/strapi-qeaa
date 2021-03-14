'use strict'

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/services.html#core-services)
 * to customize this service
 */

/*
interface Location {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  boundingbox: string[];
  lat: string;
  lon: string;
  display_name: string;
  class: string;
  type: string;
  importance: number;
  icon: string;
};
*/

const fetch = require('node-fetch')

module.exports = {
  geosearch: async (q, addressdetails = '0', limit = '1') => {
    const params = new URLSearchParams({
      q,
      addressdetails,
      limit,
      format: 'json'
    })

    const ENDPOINT = `https://nominatim.openstreetmap.org/search?${params.toString()}`
    //console.log(params.toString())
    const payload = await fetch(ENDPOINT).then((res) => res.json())

    if (!payload || !payload.length) {
      throw new Error(`No response for Address: ${q}`)
    }
    return payload // interface Location
  }
}
