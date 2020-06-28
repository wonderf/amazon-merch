function start(evt){
    evt.preventDefault();
                if(csv != undefined){
                    words = csv.split('\r\n');
                }
                var filtering = $("#filter").is(':checked');
                var filterName = $('#filterName').val().split(' ');
                var deep =$('#deep').is(':checked');
                $('body').addClass('loading');

                var url = 'https://completion.amazon.com/search/complete?search-alias=aps&client=amazon-search-ui&mkt=1&q=';

                var $input = $(evt.target).find('input')
                    .attr('readonly', true);

                var search;
                if(words == undefined){
                    search= [$input.val()];
                }
                else search = words;
                var progress = 0;
                $('.progress-bar').css('width', '0%');
               
                var callbacks = [];

            
                var updateProgress = function(word,part){
                    progress++;
                    if(filtering){
                        results=results.filter(function(str){
                            for(let i=0;i<filterName.length;i++)
                                if(str.includes(filterName[i])) return true;
                            return false;
                        })
                    }
                    count+=results.length;
                    if(words!=undefined){
                        if(deep){
                            $('h3').text(`${count} Results (${parseInt(((part+1)*(words.indexOf(word)+1))/(words.length * 100*36))}% last search:${word})`);
                        }
                        else{
                        $('.progress-bar').css('width', parseInt(words.indexOf(word)+1/words.length * 100) + '%');
                        $('h3').text(`${count} Results (${parseInt((words.indexOf(word)+1)/words.length * 100)}% last search:${word})`);
                        }
                    }
                    else{
                        if(deep){
                            $('h3').text(`${count} Results (${parseInt((part+1)/36 * 100)}% last search:${word})`);
                        }else{
                            $('.progress-bar').css('width', parseInt(progress/callbacks.length * 100) + '%');
                            $('h3').text(`${count} Results `);
                        }
                    }
                    if (progress >= callbacks.length) {
                        $input.removeAttr('readonly');
                        $('body').removeClass('loading');

                        $('script[jsonp="aws"]').remove();
                        
                        $('ul').append(
                            results.map(function(r){
                                return `<li class='list-group-item'><a href="https://www.amazon.com/s?k=${r}&i=fashion-novelty&bbn=12035955011&rh=p_6%3AATVPDKIKX0DER&hidden-keywords=ORCA" target="_blank">${r}</a></li>`
                            })
                        )
                        
                        results=[];
                        progress=0;
                    }
                };

                var a = 'a'.charCodeAt();
                var z = 'z'.charCodeAt();
                var zero = '0'.charCodeAt();
                var nine = '9'.charCodeAt();
                if(deep){
                    for(var i=0;i<search.length;i++){
                        for(let j=0;j<36;j++){
                        setTimeout(function(input,chars,part){
                            var k=0;
                            this.parting = part;
                            window['AmazonJSONPCallbackHandler_'+k] = function(json){
                                results = results.concat(json[1]);
                                updateProgress(input,parting);
                            };
    
                            var newScript = document.createElement('script');
                            newScript.setAttribute('jsonp', 'aws');
                            newScript.src = 'https://completion.amazon.com/search/complete?search-alias=aps&client=amazon-search-ui&mkt=1&q='
                            +encodeURIComponent(input )+'&callback=AmazonJSONPCallbackHandler_'+k;
                            $('head').append(newScript);
                            k++;
                            
                            for (var l = 0; l < chars.length; l++) {
                                window['AmazonJSONPCallbackHandler_'+k] = function(json){
                                    results = results.concat(json[1]);
                                    updateProgress(input,parting);
                                };
        
                                var newScript = document.createElement('script');
                                newScript.setAttribute('jsonp', 'aws');
                                newScript.src = 'https://completion.amazon.com/search/complete?search-alias=aps&client=amazon-search-ui&mkt=1&q='
                                +encodeURIComponent(input+' '  + chars[l])+'&callback=AmazonJSONPCallbackHandler_'+k;
                                k++;
                                $('head').append(newScript);
                            }
                        },
                        //PERIOD FOR WAITING
                        5000 * i *wordsGenerator().length + 5000*j,search[i],wordsGenerator().slice(j*36,(j+1)*36),j);
                    }
                        
                    }
                }else{
                for(var i=0;i<search.length;i++){
                    setTimeout(function(input){
                        window['AmazonJSONPCallbackHandler_'+0] = function(json){
                            results = results.concat(json[1]);
                            updateProgress(input);
                        };

                        var newScript = document.createElement('script');
                        newScript.setAttribute('jsonp', 'aws');
                        newScript.src = 'https://completion.amazon.com/search/complete?search-alias=aps&client=amazon-search-ui&mkt=1&q='
                        +encodeURIComponent(input )+'&callback=AmazonJSONPCallbackHandler_'+0;
                        $('head').append(newScript);
                        for (var l = a; l <= z; l++) {
                        window['AmazonJSONPCallbackHandler_'+l] = function(json){
                            results = results.concat(json[1]);
                            updateProgress(input);
                        };

                        var newScript = document.createElement('script');
                        newScript.setAttribute('jsonp', 'aws');
                        newScript.src = 'https://completion.amazon.com/search/complete?search-alias=aps&client=amazon-search-ui&mkt=1&q='
                        +encodeURIComponent(input+' '  + String.fromCharCode(l))+'&callback=AmazonJSONPCallbackHandler_'+l;
                        $('head').append(newScript);
                    }
                    for (var l = zero; l <= nine; l++) {
                        window['AmazonJSONPCallbackHandler_'+l] = function(json){
                            results = results.concat(json[1]);
                            updateProgress(input);
                        };

                        var newScript = document.createElement('script');
                        newScript.setAttribute('jsonp', 'aws');
                        newScript.src = 'https://completion.amazon.com/search/complete?search-alias=aps&client=amazon-search-ui&mkt=1&q='
                        +encodeURIComponent(input +' ' + String.fromCharCode(l))+'&callback=AmazonJSONPCallbackHandler_'+l;
                        $('head').append(newScript);
                    }
                    },
                    //PERIOD FOR WAITING
                    5000 * i,search[i]);
                    
                }
            }

                return false;
}
function wordsGenerator(){
    var a = 'a'.charCodeAt();
    var z = 'z'.charCodeAt();
    var zero = '0'.charCodeAt();
    var nine = '9'.charCodeAt();
    var alpha=[];
    var result = [];
    for(let i=zero;i<=nine;i++){
        alpha.push(String.fromCharCode(i));
    }
    for(let i=a;i<=z;i++){
        alpha.push(String.fromCharCode(i));
    }
    for(let i=0;i<alpha.length;i++){
        for(let j=0;j<alpha.length;j++){
            result.push(alpha[i]+alpha[j]);
        }
    }
    return result;
}
function getCSVFile(event) {
    const input = event.target
    if ('files' in input && input.files.length > 0) {
    placeFileCSVContent(
    input.files[0])
    }
}
function placeFileCSVContent(file) {
    readCSVFileContent(file).then(content => {
    csv = content
    }).catch(error => console.log(error))
}
function readCSVFileContent(file) {
    const reader = new FileReader()
return new Promise((resolve, reject) => {
    reader.onload = event => resolve(event.target.result)
    reader.onerror = error => reject(error)
    reader.readAsText(file)
})
}

async function digestMessage(message) {
    const msgUint8 = new TextEncoder().encode(message);                           // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);           // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
    return hashHex;
  }

function testAccess(){
    var inputed = prompt("");
    digestMessage(inputed).then(m=>{
        if(m!="5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8")
            testAccess();
    })
}

function saveToXls(){
    var wb = XLSX.utils.book_new();
    wb.Props = {
            Title: "SheetJS Tutorial",
            Subject: "Test",
            Author: "Red Stapler",
            CreatedDate: new Date()
    };
    
    wb.SheetNames.push("Test Sheet");
    var ws_data = collectResult();
    var ws = {};
    // var ws = XLSX.utils.aoa_to_sheet(ws_data);
    // var ws = XLSX.utils.json_to_sheet(ws_data);
    wb.Sheets["Test Sheet"] = ws_data;
    var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});
    saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), 'test.xlsx');
}

function s2ab(s) {
  
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
    
}

function collectResult(){
    let lis = $('li');
    // let data = [];
    let data = {};
    for(let i=0;i<lis.length;i++){
        // data.push({
        //     name:lis[i].outerHTML,
        // });
        // data.push(lis[i].outerHTML);
        let cell = XLSX.utils.encode_cell({c:0,r:i});
        
        data[cell]={f: `=HYPERLINK("${lis[i].children[0].href}","${lis[i].textContent}")`,v:lis[i].textContent,t:"s"}
    }
    data["!ref"]=`A1:${XLSX.utils.encode_cell({c:0,r:lis.length-1})}`
    return data;
}