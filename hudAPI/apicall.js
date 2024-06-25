require('dotenv').config()
const delay = (ms) => new Promise(res => setTimeout(res,ms))

async function apiCall(url) {
    const request_options = {
        method: 'GET',
        headers: {
            Authorization: process.env.HUD_API_KEY
        }
    }
    api_URL = 'https://www.huduser.gov/hudapi/public'
    console.log(`calling: ${api_URL}/${url}`)

    
    const response = await fetch(`${api_URL}/${url}`, request_options)
    output = await response.json()
    await delay(1000)
    return output
}

module.exports = apiCall