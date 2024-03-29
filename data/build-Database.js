const apiCall = require('../hudAPI/apicall')
const delay = (ms) => new Promise(res => setTimeout(res,ms))
const fs = require('fs')
 

async function generateDatabaseFromScratch() {
    
    // const metroCodesList = await buildMetroCodes()

    const metroCodesList = [
        'METRO12060M12060', 'METRO35620MM0875',
        'METRO16740M16740', 'METRO16980M16980',
        'METRO17820M17820', 'METRO19100M19100',
        'METRO33100MM2680', 'METRO19100MM2800',
        'METRO16980MM2960', 'METRO25540M25540',
        'METRO27140M27140', 'METRO27260M27260',
        'METRO35620MM5190', 'METRO35840M35840',
        'METRO37340M37340', 'METRO37980M37980',
        'METRO38300M38300', 'METRO40900M40900',
        'METRO41700M41700', 'METRO41740M41740',
        'METRO45300M45300', 'METRO46520M46520',
        'METRO47900M47900', 'METRO33100MM8960'
    ]


    metrosWithZipcodeData = []
    historicalZipcodeData = []
    

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
            (console.log(err))
        }
    }


    const currentYear = yearToFetch


    // get most recent data
    for (const i in metroCodesList) {
        // TOS for this API is 60 calls/minute
        await delay(1000)
        yearToFetch = currentYear
        
        console.log(`fetching data for metro area: ${metroCodesList[i]}`)

        const zipcode_data = await getZipcodes(metroCodesList[i], yearToFetch)
        
        if (zipcode_data) {
            // add the data already retrieved
            for (const j in zipcode_data) {
                historicalZipcodeData = dataInsert(historicalZipcodeData, zipcode_data[j], yearToFetch)
            }

            yearToFetch--
                
            // retrieve historical data
            while (yearToFetch > 2016) {
                await delay(1000)
                try {
                    const zipcode_data_history = await getZipcodes(metroCodesList[i], yearToFetch)
                    if (zipcode_data_history ) {
                        for (const j in zipcode_data_history) {
                            historicalZipcodeData = dataInsert(historicalZipcodeData, zipcode_data_history[j], yearToFetch)
                        }
                    }
                    else {
                        yearToFetch = 0
                    }
                }
                catch (err) {
                    if (err.message.contains('cannot set properties of undefined')) {
                        console.log(`No data found for zip ${zipcode_data_history[k]} in year ${yearToFetch}`)
                    }
                    console.log(err)
                }
                yearToFetch--
            }
            yearToFetch = currentYear
        }
        console.log()
    }
    console.log(metrosWithZipcodeData)
    
    fs.writeFile('zipcodes_database_v2.json', JSON.stringify(historicalZipcodeData), (err) => {
        if (err) throw new Error
    })
}


function findByAttr(list, attr, value) {
    for (const i in list) {
        if (list[i][attr] === value) {
            return i
        }
    }
    return -1
}


async function buildMetroCodes() {

    const metroAreas = await apiCall('listMetroAreas')
    
    let metroCodesList = []
    for (const i in metroAreas) {
        metroCodesList.push(metroAreas[i].cbsa_code)
    }

    return metroCodesList
}

function dataInsert(existingData, newItem, year) {
    const extractedZipcode = newItem.zip_code
    delete newItem['zip_code']

    newData = {
        zip_code: extractedZipcode,
        data: {
            [`y${year}`]: newItem
        }
    }



    index = findByAttr(existingData, 'zip_code', newData.zip_code)

    if (index < 0) {
        // add an entry for the new zip
        existingData.push(newData)

    }
    else {
        // already exists
        existingData[index].data = Object.assign (existingData[index].data, newData.data)
    }
    return existingData
}


async function getZipcodes (metro_area, year) {

    try {
        var metroData = await apiCall(`data/${metro_area}?year=${year}`)
        
        if (metroData.data && metroData.data.basicdata.length > 0 ) {
            console.log(`  fetching metroArea: ${metro_area} in year ${year}`)
            return metroData.data.basicdata
        }
        else if (metroData.error && metroData.error.includes('Invalid year')) {
            console.log(`getZipcodes: invalid year`)
            throw new Error('Invalid year')
        }
        else {
            console.log(`  metro area ${metro_area} has no zip codes for year: ${year}`)
            return null
        }
    }
    catch (err) {
        if (err.message.includes('404')) {
            console.log(`  metro area ${metro_area} not found on server`)
        }
        else {
            throw err
        }
    }
 
}

generateDatabaseFromScratch()

module.exports = generateDatabaseFromScratch