require('dotenv').config()

const request_options = {
    method: 'GET',
    headers: {
        Authorization: process.env.HUD_API_KEY
    }
}

module.exports = request_options