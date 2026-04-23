const axios = require('axios');

exports.geocode = async (address) => {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: address,
        format: 'json',
        limit: 1
      },
      headers: {
        'User-Agent': 'BenevolatApp/1.0'
      }
    });

    if (response.data && response.data.length > 0) {
      return {
        latitude: parseFloat(response.data[0].lat),
        longitude: parseFloat(response.data[0].lon)
      };
    }
    return null;
  } catch (error) {
    console.error(`Geocoding error: ${error.message}`);
    return null;
  }
};

exports.reverseGeocode = async (latitude, longitude) => {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: {
        lat: latitude,
        lon: longitude,
        format: 'json'
      },
      headers: {
        'User-Agent': 'BenevolatApp/1.0'
      }
    });

    if (response.data) {
      return {
        address: response.data.display_name,
        city: response.data.address.city || response.data.address.town,
        country: response.data.address.country
      };
    }
    return null;
  } catch (error) {
    console.error(`Reverse geocoding error: ${error.message}`);
    return null;
  }
};

module.exports = exports;
