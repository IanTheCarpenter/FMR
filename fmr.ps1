function zipToFIPSCode($zip) {
    $map = @{
        "30519" = "13135"
        "30046" = "13135"
        "78753" = "48453"
        "78602" = "48021"
        "76528" = "48099"
    }
    if ($map.$zip -eq $null) {
        return 36081
    }
    else {
        return $map.$zip
    }
}


function get-FMRByFIPS ($FIPS, $zip, $currentYear=$null) {
    
    $fmrURL = "https://www.huduser.gov/hudapi/public/fmr"

    echo "$fmrURL/data/$FIPS"

    if (!currentYear) {$apiCall = (HUDapiCall "$fmrURL/data/$FIPS").data}
    else {$apiCall = (HUDapiCall "$fmrURL/data/$FIPS?year=$currentYear").data}

    if ($apiCall -eq "Invalid Year") {

    }

    #sometimes the FIPS lookup returns a list of zip codes (common for major metro areas)
    if ($apiCall.basicdata.gettype().BaseType -like "*Array*") {
        $data = $apiCall.basicdata | where-object zip_code -eq $zip
    }
    else {
        $data = $apiCall.basicdata
    }
    #  base case: invalid year
    if ($currentYear -lt 2016) {
        return $data
    }

    $data = (get-FMRByFIPS $FIPS $zip [int]$apiCall.year - 1).data
    
    $output = @{
        "county" = $apiCall.county_name
        "data" = @{
            $apiCall.year = $data
        }
    }
    return $output
}


function HUDapiCall ($url) {
    
    return (Invoke-WebRequest $url -Headers $auth ).content | ConvertFrom-Json
}


function HUDapiCall2 ($url) {
    
    $call = Invoke-WebRequest $url -Headers $auth
    
    $call.status
}


function main ($zip) {
    if (($zip.gettype().Name) -eq "Int32") {$zip = $zip.toString()}
    elseif (($zip.gettype().Name) -ne "String") {return "error"}

    $FIPS = zipToFIPSCode $zip

    # HUD API expects padding with trailing 9's
    while ($FIPS.length -lt 10) {
        $FIPS = $FIPS + "9"
        echo $fips
    }

    $currentYear = [int]$apiCall.year - 1
    while ($currentYear -gte 2015) {
        //
        $currentYear--
    }


    return get-FMRByFIPS $FIPS $zip
}
