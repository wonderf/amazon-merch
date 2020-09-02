function preparedParams() {
    var zone = $('#us_zone').prop("checked");
    let u = '';
    if (zone) {
        u = 'https://completion.amazon.com/search/complete?search-alias=aps&client=amazon-search-ui&mkt=1&q={0}';
    } else u = 'https://completion.amazon.co.uk/search/complete?method=completion&q={0}&search-alias=aps&mkt=4&callback=AmazonJSONPCallbackHandler_{1}&noCacheIE=1295031912518';
    if (csv != undefined) {
        words = csv.split('\r\n');
    }
    if (file_name == undefined) {
        result_name = $('#search').val() + "_result.xlsx";
    } else {
        result_name = file_name.split(".csv")[0] + "_result.xlsx";
    }
    var filtering = $("#filter").is(':checked');
    var filterName = $('#filterName').val().split(',').map(x => x.trim())
    var deep = $('#deep').is(':checked');
    var reverse = $('#reverse').is(':checked');

    var search;
    if (words == undefined) {
        search = [$('#search').val()];
    } else search = words;

    return [u, filtering, filterName, deep, reverse, search]
}

function updateProgress(item, enable,filterName) {
    let data = item[1];
    console.log(filterName)
    if(enable) {
        data = data.filter(function (str) {
            for (let i = 0; i < filterName.length; i++)
                if (str.includes(filterName[i])) return true;
            return false;
        })
    }
    console.log(data);

    //check for duplicate and push to table
}

function start_search(params) {
    let a = 'a'.charCodeAt();
    let z = 'z'.charCodeAt();
    let zero = '0'.charCodeAt();
    let nine = '9'.charCodeAt();
    let initialDelay=5000;
    for(let i=0;i<params[5].length;i++) {
        setTimeout(function (input,chars,cur,total) {

        })
    }

    if (params[3]) {
    }
    if (params[4]) {
    }
}

function sendRequest(url,word,filtering,filteringName){
    for (let i = zero; i <= nine; i++) {
        $.ajax({
            url: url.replace("{0}", encodeURIComponent(word + ' ' + String.fromCharCode(i))), // строка, содержащая URL адрес, на который отправляется запрос
            crossDomain: true,
            headers: {
                "accept": "application/json",
                "Access-Control-Allow-Origin": "*"
            },

            success: data => updateProgress(data, filtering,filteringName), // функция обратного вызова, которая вызывается если AJAX запрос выполнится успешно
            dataType: "jsonp" // тип данных, который вы ожидаете получить от сервера
        });
    }


    for (let i = a; i <= z; i++) {
        $.ajax({
            url: url.replace("{0}", encodeURIComponent(word + ' ' + String.fromCharCode(i))), // строка, содержащая URL адрес, на который отправляется запрос
            crossDomain: true,
            headers: {
                "accept": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            success: data => updateProgress(data, filtering,filteringName), // функция обратного вызова, которая вызывается если AJAX запрос выполнится успешно
            dataType: "jsonp" // тип данных, который вы ожидаете получить от сервера
        });
    }
}

