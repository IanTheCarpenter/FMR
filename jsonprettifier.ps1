$json = Get-Content "C:\Users\ICA\Documents\code\fmr\zipcodeData_2024.JSON" -raw

$output = ""
$count = 0

foreach ($i in $json) {
    $count++
}
$count