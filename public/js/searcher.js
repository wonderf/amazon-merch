class Searcher{
    constructor() {
        var zone = $('#us_zone').prop("checked");
        this.u = '';
        if (zone) {
            this.u = 'https://completion.amazon.com/search/complete?search-alias=aps&client=amazon-search-ui&mkt=1&q={0}';
        } else this.u = 'https://completion.amazon.co.uk/search/complete?method=completion&q={0}&search-alias=aps&mkt=4&callback=AmazonJSONPCallbackHandler_{1}&noCacheIE=1295031912518';
        if (csv != undefined) {
            this.words = csv.split('\r\n');
        }
        if (file_name == undefined) {
            result_name = $('#search').val() + "_result.xlsx";
        } else {
            result_name = file_name.split(".csv")[0] + "_result.xlsx";
        }
        this.filtering = $("#filter").is(':checked');
        this.filterName = $('#filterName').val().split(',').map(x => x.trim())
        this.deep = $('#deep').is(':checked');
        this.reverse = $('#reverse').is(':checked');
        if (this.words == undefined) {
            this.search = [$('#search').val()];
        } else this.search = this.words;
        this.count = 0;
    }




    start_search() {

        const initialDelay = 5000;
        let now=0;
        let startSequnce=[];
        const a = 'a'.charCodeAt();
        const z = 'z'.charCodeAt();
        const zero = '0'.charCodeAt();
        const nine = '9'.charCodeAt();
        for(let i=a;i<=z;i++) startSequnce.push(i);
        for(let i=zero;i<=nine;i++) startSequnce.push(i);
        this.total = this.search.length*36+(this.deep?1:0 )*this.search.length*wordsGenerator()+(this.reverse?1:0)*this.search.length*wordsGenerator();
        for (let i = 0; i < this.search.length; i++) {
            //todo params
            setTimeout(function (word, seq,sendSimpleRequest,url ) {
                sendSimpleRequest(word,seq,url)
            },5000*i,this.search[i],startSequnce,sendSimpleRequest,this.u)
        }

        //deep search
        if (this.deep) {
            for(let i=0;i<this.search.length;i++){
                for(let j=0;j<wordsGenerator().length/36;i++){
                    setTimeout(function (word, seq,sendSimpleRequest,url ) {
                        sendSimpleRequest(word,seq,url)
                    },5000*this.search.length+180000 * i + 5000 * j,this.search[i],wordsGenerator().slice(j * 36, (j + 1) * 36),sendSimpleRequest,this.u)
                }
            }
        }
        //reverse search
        if (this.reverse) {
            for(let i=0;i<this.search.length;i++){
                for(let j=0;j<wordsGenerator().length/36;i++){

                }
            }
        }
    }
//todo work with this

}

function wordsGenerator() {
    var a = 'a'.charCodeAt();
    var z = 'z'.charCodeAt();
    var zero = '0'.charCodeAt();
    var nine = '9'.charCodeAt();
    var alpha = [];
    var result = [];
    for (let i = zero; i <= nine; i++) {
        alpha.push(String.fromCharCode(i));
    }
    for (let i = a; i <= z; i++) {
        alpha.push(String.fromCharCode(i));
    }
    for (let i = 0; i < alpha.length; i++) {
        for (let j = 0; j < alpha.length; j++) {
            result.push(alpha[i] + alpha[j]);
        }
    }
    return result;
}
function updateProgress(item) {
    let data = item[1];
    count++;
    console.log(this.filterName)
    if (this.filtering) {
        data = data.filter(function (str) {
            for (let i = 0; i < this.filterName.length; i++)
                if (str.includes(this.filterName[i])) return true;
            return false;
        })
    }
    console.log(data);

    //check for duplicate and push to table
}

function sendSimpleRequest( word,sequnce,url) {
    for (let i = 0; i < sequnce.length; i++) {
        $.ajax({
            url: url.replace("{0}", encodeURIComponent(word + ' ' + String.fromCharCode(sequnce[i]))), // строка, содержащая URL адрес, на который отправляется запрос
            crossDomain: true,
            headers: {
                "accept": "application/json",
                "Access-Control-Allow-Origin": "*"
            },

            success: data => updateProgress(data), // функция обратного вызова, которая вызывается если AJAX запрос выполнится успешно
            dataType: "jsonp" // тип данных, который вы ожидаете получить от сервера
        });
    }
}


