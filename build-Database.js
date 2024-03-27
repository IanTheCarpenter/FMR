const request_options = require('./hudAPI/apicall')
const delay = (ms) => new Promise(res => setTimeout(res,ms))
const fs = require('fs')

url = 'https://www.huduser.gov/hudapi/public/fmr'

async function buildDatabase() {
    // get list of state codes
    try {
        var response = await fetch(`${url}/listMetroAreas`, request_options)
    }
    catch (err) {
        console.log(`unable to retrieve list of states:`)
        console.log(err)
    }
    const metroAreas = await response.json()
    
    let metroCodesList = []
    for (const i in metroAreas) {
        metroCodesList.push(metroAreas[i].cbsa_code)
    }

    let validMetros = []
    let zipcodeData = {}
    
    // retreive current data
    for (const i in metroCodesList) {
        await delay(1000)
        try {
            var response = await fetch(`${url}/data/${metroCodesList[i]}`, request_options) 
            metroData = await response.json()

            if (metroData.data && metroData.data.basicdata.length > 0 ) {
                console.log(`metro area ${metroCodesList[i]} has ${metroData.data.basicdata.length} zip codes`)
                for (const j in metroData.data.basicdata) {
                    zipcodeData[metroData.data.basicdata[j].zip_code] = metroData.data.basicdata[j]
                }
                validMetros.push(metroCodesList[i])
            }
            else {
                console.log(`metro area ${metroCodesList[i]} has no zip codes`)   
            }
        }
        catch (err) {
            console.log(`failed api call to url: ${url}/data/${metroCodesList[i]}`)
            console.log(err)
        }

        // console.log(metroData.data)


    }
    console.log(validMetros)
    console.log()
    console.log()
    console.log(JSON.stringify(zipcodeData))
    
}

async function test() {
    try {
        var response = await fetch(`${url}/data/METRO18580N48007`, request_options) 
    }
    catch (err) {
        console.log(err)
    }
    data = await response.json()
    console.log(data)
}

// test()
buildDatabase()