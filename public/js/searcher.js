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
        filtering = $("#filter").is(':checked');
        filterName = $('#filterName').val().split(',').map(x => x.trim())
        this.deep = $('#deep').is(':checked');
        this.reverse = $('#reverse').is(':checked');
        if (this.words == undefined) {
            this.search = [$('#search').val()];
        } else this.search = this.words;
        this.count = 0;
        autosave = $('#autosave').is(':checked');
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
        this.total = this.search.length*36+(this.deep?1:0 )*this.search.length*wordsGenerator().length+(this.reverse?1:0)*this.search.length*wordsGenerator().length;
        for (let i = 0; i < this.search.length; i++) {
            //todo params
            setTimeout(function (word, seq,sendSimpleRequest,url ) {
                sendSimpleRequest(word,seq,url)
            },5000*i,this.search[i],startSequnce,sendSimpleRequest,this.u)
        }

        //deep search
        if (this.deep) {
            for(let i=0;i<this.search.length;i++){
                for(let j=0;j<wordsGenerator().length/36;j++){
                    setTimeout(function (word, seq,sendSimpleRequest,url ) {
                        sendSimpleRequest(word,seq,url)
                    },5000*this.search.length+180000 * i + 5000 * j,this.search[i],wordsGenerator().slice(j * 36, (j + 1) * 36),sendSimpleRequest,this.u)
                }
            }
        }
        //reverse search
        if (this.reverse) {
            for(let i=0;i<this.search.length;i++){
                for(let j=0;j<wordsGenerator().length/36;j++){
                    setTimeout(function (word, seq,sendSimpleRequest,url ) {
                        sendSimpleRequest(word,seq,url,true)
                    },5000*this.search.length+180000 * i + 5000 * j,this.search[i],wordsGenerator().slice(j * 36, (j + 1) * 36),sendSimpleRequest,this.u)
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
function updateProgress(item,url) {
    let data = item[1];
    if (filterName && filtering) {
        data = data.filter(function (str) {
            for (let i = 0; i < this.filterName.length; i++)
                if (str.includes(this.filterName[i])) return true;
            return false;
        })
    }
    count+=data.length;
    console.log(data);
    //var markup = "<tr><td><input type='checkbox' name='record'></td><td></td><td></td></tr>";
    //$("table tbody").append(markup);
    if(!autosave) {
        data.forEach(item => {
            $('table tbody').append("<tr>\n" +
                "\n" +
                "                            <td nowrap=\"true\"><input type=\"checkbox\" class=\"mr-2\">" + item + "</td>\n" +
                "                            <td class=\"rightcol\"> <a href=\"https://www.amazon.com/s?k=" + item + "&i=fashion-novelty&bbn=12035955011&rh=p_6%3AATVPDKIKX0DER&hidden-keywords=ORCA\" target=\"_blank\">Amazon</a> | <a href=\"https://www.google.com/search?q=" + item + "\" target=\"_blank\">Google</a></td>\n" +
                "                        </tr>")
        })
        // $('table tbody').append("<tr>\n" +
        //      "                            <th scope=\"row\"><input type=\"checkbox\" class=\"mr-2\">dog allergy</th>\n" +
        //     "                            <td class=\" text-right r\">Amazon | Google</td>\n" +
        //      "                        </tr>")

        //check for duplicate and push to table
    }else{
        data.forEach(item=>{
            converted.push({
                name:item,
                href:`https://www.amazon.com/s?k=${item}&i=fashion-novelty&bbn=12035955011&rh=p_6%3AATVPDKIKX0DER&hidden-keywords=ORCA`
            })
        });
        if(converted.length>1000){

            saveToXls(converted);
            converted=[];
        }
    }
    $('#rightCounter')[0].textContent=`${count} Results`;

}

function sendSimpleRequest( word,sequnce,url,reverse) {
    if(reverse){
        for (let i = 0; i < sequnce.length; i++) {
            $.ajax({
                url: url.replace("{0}", encodeURIComponent(String.fromCharCode(sequnce[i]) +' '+word )), // строка, содержащая URL адрес, на который отправляется запрос
                crossDomain: true,
                headers: {
                    "accept": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },

                success: data => updateProgress(data,), // функция обратного вызова, которая вызывается если AJAX запрос выполнится успешно
                dataType: "jsonp" // тип данных, который вы ожидаете получить от сервера
            });
        }
    }
    else{
        for (let i = 0; i < sequnce.length; i++) {
            $.ajax({
                url: url.replace("{0}", encodeURIComponent(word + ' ' + String.fromCharCode(sequnce[i]))), // строка, содержащая URL адрес, на который отправляется запрос
                crossDomain: true,
                headers: {
                    "accept": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },

                success: data => updateProgress(data,), // функция обратного вызова, которая вызывается если AJAX запрос выполнится успешно
                dataType: "jsonp" // тип данных, который вы ожидаете получить от сервера
            });
        }
    }

}

function clear(){
    $('tbody tr').remove();
    $('#centerCounter')[0].textContent="0 Results"
    $('#rightCounter')[0].textContent="0 Results";
    count=0;

}


