require('dotenv').config()


async function apiCall(url) {
    const request_options = {
        method: 'GET',
        headers: {
            Authorization: process.env.HUD_API_KEY
        }
    }
    api_URL = 'https://www.huduser.gov/hudapi/public/fmr'
    
    const response = await fetch(`${api_URL}/${url}`, request_options)
    output = await response.json()
    // console.log(output)
    return output
}

module.exports = apiCall