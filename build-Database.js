const apiCall = require('./hudAPI/apicall')
const delay = (ms) => new Promise(res => setTimeout(res,ms))
const fs = require('fs')
 

async function generateDatabaseFromScratch() {
    
    const metroCodesList = await buildMetroCodes()
    metrosWithZipcodeData = []
    historicalZipcodeData = {}
    

    var yearToFetch = new Date().getFullYear()

    // test to see if the current year is valid
    try {
        var zipcode_data = await getZipcodes(metroCodesList[0], yearToFetch)
    }
    catch (err) {
        if (err.message.includes('Invalid year')) {
            yearToFetch--
        }
        else {
            throw err
        }
    }

    // get most recent data
    for (const i in metroCodesList) {
        
        // TOS for this API is 60 calls/minute
        await delay(1000)

        const zipcode_data = await getZipcodes(metroCodesList[i], yearToFetch)

        if (zipcode_data) {
            metrosWithZipcodeData.push(metroCodesList[i])
            for (const j in zipcode_data) {
                if (!historicalZipcodeData[zipcode_data[j].zip_code]) {
                    historicalZipcodeData[zipcode_data[j].zip_code] = {}
                }
                historicalZipcodeData[zipcode_data[j].zip_code][yearToFetch.toString()] = zipcode_data[j]
            }
        }
    }
    console.log(metrosWithZipcodeData)
    
    yearToFetch--

    // metrosWithZipcodeData = [
    //     'METRO12060M12060', 'METRO35620MM0875',
    //     'METRO16740M16740', 'METRO16980M16980',
    //     'METRO17820M17820', 'METRO19100M19100',
    //     'METRO33100MM2680', 'METRO19100MM2800',
    //     'METRO16980MM2960', 'METRO25540M25540',
    //     'METRO27140M27140', 'METRO27260M27260',
    //     'METRO35620MM5190', 'METRO35840M35840',
    //     'METRO37340M37340', 'METRO37980M37980',
    //     'METRO38300M38300', 'METRO40900M40900',
    //     'METRO41700M41700', 'METRO41740M41740',
    //     'METRO45300M45300', 'METRO46520M46520',
    //     'METRO47900M47900', 'METRO33100MM8960'
    // ]

    // get historical data by looping through the metro codes that previously returned good data
    while(yearToFetch > 2016) {
        for (const i in metrosWithZipcodeData) {
            await delay(1000)
            try {
                var zipcode_data = await getZipcodes(metrosWithZipcodeData[i], yearToFetch)
                console.log(`fetching metro area: ${metrosWithZipcodeData[i]} in year: ${yearToFetch}`)
            }
            catch (err) {
                if (err.message.includes('Invalid year')) {
                    metrosWithZipcodeData = metrosWithZipcodeData.filter((m) => m === metrosWithZipcodeData[i])
                    console.log(`removing metro area: ${metrosWithZipcodeData[i]}`)
                }
                else {
                    throw err
                }
            }
            for (const j in zipcode_data) {
                if (!historicalZipcodeData[zipcode_data[j].zip_code]) {
                    historicalZipcodeData[zipcode_data[j].zip_code] = {}
                }

                historicalZipcodeData[zipcode_data[j].zip_code][yearToFetch.toString()] = zipcode_data[j]
            }
        }
        yearToFetch--
    }
    fs.writeFile('zipcodes_database', JSON.stringify(historicalZipcodeData), (err) => {
        if (err) throw new Error
    })
}


function generateDatabaseFromFile() {
    return require('./zipcodes_database.json')
}


async function buildMetroCodes() {
    try {
        var metroAreas = await apiCall('listMetroAreas')
    }
    catch (err){
        throw err
    }
    
    let metroCodesList = []
    for (const i in metroAreas) {
        metroCodesList.push(metroAreas[i].cbsa_code)
    }

    return metroCodesList
}


async function getZipcodes (metro_area, year) {

    try {
        var metroData = await apiCall(`data/${metro_area}?year=${year}`)
        if (metroData.data && metroData.data.basicdata.length > 0 ) {
            return metroData.data.basicdata
        }
        else {
            console.log(`metro area ${metro_area} has no zip codes`)
            return null
        }
    }
    catch (err) {
        if (err.message.includes('404')) {
            console.log(`metro area ${metro_area} not found on server`)
        }
        else {
            console.log(err)
        }
    }
 
}


module.exports = {
    generateDatabaseFromScratch,
    generateDatabaseFromFile
}