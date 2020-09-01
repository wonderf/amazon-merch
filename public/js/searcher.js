function preparedParams(){
    var zone = $('#us_zone').prop("checked");
    if (csv != undefined) {
        words = csv.split('\r\n');
    }
    if (file_name == undefined) {
        result_name = $('#search').val() + "_result.xlsx";
    } else {
        result_name = file_name.split(".csv")[0] + "_result.xlsx";
    }
    var filtering = $("#filter").is(':checked');
    var filterName = $('#filterName').val().split(',').map(x=>x.trim())
    var deep = $('#deep').is(':checked');
    var reverse = $('#reverse').is(':checked');

    var search;
    if (words == undefined) {
        search = [$('#search').val()];
    } else search = words;

    return [zone,filtering,filterName,deep,reverse,search]
}

function updateProgress(item,filterName){

}