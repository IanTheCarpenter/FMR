// TODO: 
// - add the hourly wage formula 
// - fix 'year' not being ignored while the data is being added to the chartJS object.



const apiCall = require('../hudAPI/apicall')
const convertToCBSA = require('../zipcodes_to_metrocodes')

const requiredHourlyWageFormula = (rent) => {
    // multiply the rent by 3 to get the monthly income needed to afford comfortably
    // divide by the 160 hours worked in a normal month to get the required hourly rate
    const rawCalculation = (rent * 3) / 160
    return Math.round(Math.round(rawCalculation * 100)) / 100
  }

function indexOfObjectWithAttributeValue(list, targetAttribute, targetAttributeValue) {
    // searches the provided list and looks for an attribute with the 
    for (i in list) {
        if (list[i][targetAttribute] === targetAttributeValue) {
            return i
        }
    }
    return -1
}

function dataInsert(existingDatasets, yearDataToInsert) {
    console.log(`***`)
    console.log(`merging: ${JSON.stringify(yearDataToInsert)}`)
    console.log()
    console.log(`into: ${JSON.stringify(existingDatasets)}`)
    console.log(`***`)


    datasetLabels = Object.keys(yearDataToInsert).filter(key => (key !== 'zip_code' || key !== 'year'))
    
    datasetLabels.forEach(apartmentType => {
        i = indexOfObjectWithAttributeValue(existingDatasets, 'label', apartmentType)
        if (i >= 0) {
            existingDatasets[i].data.unshift(yearDataToInsert[apartmentType])
        }
        else (
            existingDatasets.push ({
                label: apartmentType,
                data: [yearDataToInsert[apartmentType]]
            })
        )
    })
    return existingDatasets

}

async function fmrDataLookup(req, res) {
    const { zipCode } = req.params

    const cbsa = convertToCBSA(zipCode)

    // get the data for the current year
    var currentYear = new Date().getFullYear()
    var reply = await apiCall(`${cbsa}?year=${currentYear}`)
    
    if (reply.error) {
        
        if (reply.error?.includes('Missing or invalid value')) {res.status(404).send()}
        // it is possible that data for the current year is not out yet. this will simply start the loop at the previous year
        else if (reply.error?.includes('Invalid Year')) {
            currentYear--
            const reply = await apiCall(`${cbsa}?year=${currentYear}`)
        }  
        else {res.status(501).send()} // all other errors send generic code
    }




    var chartData = {
        labels: [],
        datasets: []
    }


    while (currentYear >= 2016) {
        
        const reply = await apiCall(`${cbsa}?year=${currentYear}`)
        if (reply.error) {
            currentYear = 0
        }
        else {
            chartData.labels.unshift(currentYear)
            console.log(JSON.stringify(reply.data))
            
            if (reply.data.smallarea_status == 1) {
                console.log(`smallarea status: ${reply.data.smallarea_status}`)
                // find the correct zip code within the response
                i = indexOfObjectWithAttributeValue(reply.data.basicData, 'zip_code', zipCode)
                var currentYearData = reply.data.basicdata[i]
            }
            else {
                var currentYearData = reply.data.basicdata
            }
    
            dataInsert(chartData.datasets, currentYearData)
            // Object.keys(currentYearData).forEach(apartmentType => {
            //     chartData.datasets = dataInsert(chartData.datasets, currentYearData)
            // })
            
            currentYear--
        }
        
    }
    res.send(chartData)
}

module.exports = {
    fmrDataLookup
}