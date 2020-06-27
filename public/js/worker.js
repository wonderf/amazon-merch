function start(evt){
    evt.preventDefault();
                if(csv != undefined){
                    words = csv.split('\r\n');
                }
                var filtering = $("#filter").is(':checked');
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

            
                var updateProgress = function(word){
                    progress++;
                    if(words!=undefined){
                        $('.progress-bar').css('width', parseInt(words.indexOf(word)+1/words.length * 100) + '%');
                        $('h3').text(`${results.length} Results (${parseInt((words.indexOf(word)+1)/words.length * 100)}% last search:${word})`);
                    }
                    else{
                        $('.progress-bar').css('width', parseInt(progress/callbacks.length * 100) + '%');
                        $('h3').text(`${results.length} Results `);
                    }
                    if (progress >= callbacks.length) {
                        $input.removeAttr('readonly');
                        $('body').removeClass('loading');

                        $('script[jsonp="aws"]').remove();
                        if(filtering){
                            results=results.filter(function(str){return str.indexOf('shirt')!=-1})
                        }
                        $('ul').empty().append(
                            results.map(function(r){
                                return `<li class='list-group-item'><a href="https://www.amazon.com/s?k=${r}&i=fashion-novelty&bbn=12035955011&rh=p_6%3AATVPDKIKX0DER&hidden-keywords=ORCA" target="_blank">${r}</a></li>`
                            })
                        )
                        progress=0;
                    }
                };

                var a = 'a'.charCodeAt();
                var z = 'z'.charCodeAt();
                var zero = '0'.charCodeAt();
                var nine = '9'.charCodeAt();
                if(deep){
                    for(var i=0;i<search.length;i++){
                        setTimeout(function(input){
                            var k=0;
                            window['AmazonJSONPCallbackHandler_'+k] = function(json){
                                results = results.concat(json[1]);
                                updateProgress(input);
                            };
    
                            var newScript = document.createElement('script');
                            newScript.setAttribute('jsonp', 'aws');
                            newScript.src = 'https://completion.amazon.com/search/complete?search-alias=aps&client=amazon-search-ui&mkt=1&q='
                            +encodeURIComponent(input )+'&callback=AmazonJSONPCallbackHandler_'+k;
                            $('head').append(newScript);
                            k++;
                            var generated = wordsGenerator();
                            for (var l = 0; l < generated.length; l++) {
                                window['AmazonJSONPCallbackHandler_'+k] = function(json){
                                    results = results.concat(json[1]);
                                    updateProgress(input);
                                };
        
                                var newScript = document.createElement('script');
                                newScript.setAttribute('jsonp', 'aws');
                                newScript.src = 'https://completion.amazon.com/search/complete?search-alias=aps&client=amazon-search-ui&mkt=1&q='
                                +encodeURIComponent(input+' '  + generated[l])+'&callback=AmazonJSONPCallbackHandler_'+k;
                                k++;
                                $('head').append(newScript);
                            }
                        },
                        //PERIOD FOR WAITING
                        5000 * i,search[i]);
                        
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