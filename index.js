class EditorJsParser {

    constructor(config = null){}    

    parse(block, withClass = null){
        let html = "";
        if(block && block.type){
            switch(block.type){
                case "paragraph":
                    html = this._parseParagraph(block, withClass);
                break;
                case "header":
                    html = this._parseHeader(block, withClass);
                break;
                case "list":
                    html = this._parseList(block, withClass);
                break;
                case "image":
                    html = this._parseImage(block, withClass);
                break;
                case "embed":
                    html = this._parseEmbed(block, withClass)
                break;
                case "quote":
                    html = this._parseQuote(block, withClass)
                break;
                case "delimiter":
                    html = this._parseDelimiter(block, withClass)
                break;
                case "poll":
                    html = this._parsePoll(block, withClass)
                break;
                case "linkTool":
                    html = this._parseLinkTool(block, withClass);
                break;
                case "survey":
                    html = this._parseSurvey(block);
                break;
                default:
                    html = block;
                break;
            }
        }
        return html;
    }

    _parseClass(withClass = null){
        let c = "";
        let m = ""
        if(withClass){
            let parts = withClass.split(" ");
            parts.forEach((row)=>{
                m += row.replace(/\W/g, '')+" ";
            })
            m = m.trim();
            c=' class="'+m+'"';
        }
        return c;
    }

    _getImageObject(theObject) {
        var result = null;
        if(theObject instanceof Array) {
            for(var i = 0; i < theObject.length; i++) {
                result = this._getImageObject(theObject[i]);
                if (result) {
                    break;
                }   
            }
        }
        else
        {
            for(var prop in theObject) {
                if(prop == 'url') {
                    if(theObject[prop]) {
                        result = theObject
                        return theObject;
                    }
                }
                if(theObject[prop] instanceof Object || theObject[prop] instanceof Array) {
                    result = this._getImageObject(theObject[prop]);
                    if (result) {
                        break;
                    }
                } 
            }
        }
        return result;
    }

    _parseParagraph(block, withClass = null){
        let c = this._parseClass(withClass);
        let html = {};
        html.is_empty = true;
        html.type = "paragraph";
        if(block && block.data && block.data.text){
            if(block.data.text.trim() != ""){ html.is_empty = false; }
            html.text = block.data.text.trim();
            html.html = "<p"+c+">"+block.data.text.trim()+"</p>";
        }
        return html;
    }

    _parseHeader(block, withClass = null){
        let c = this._parseClass(withClass);
        let html = {};
        html.is_empty = true;
        if(block && block.data && block.data.text){
            if(block.data.text.trim() != ""){ html.is_empty = false; }
            html.type = "header";
            html.text = block.data.text.trim();
            var level = "h1";
            switch(block.data.level){
                case 1:
                    level = "h1";
                break;
                case 2:
                    level = "h2";
                break;
                case 3:
                    level = "h3";
                break;
                case 4:
                    level = "h4";
                break;
            }
            html.html = "<"+level+c+">"+block.data.text.trim()+"</"+level+">";
        }
        return html;
    }

    _parseList(block, withClass){
        let c = this._parseClass(withClass);
        let html = {};
        html.type = "list";
        html.is_empty = true;
        html.items = [];
        let o = "ul";
        let m = "";
        if(block && block.data && block.data.items){
            if(block.data.items.length > 0){ html.is_empty = false; }
            html.type = block.data.style+"-list";
            switch(block.data.style){
                case "unordered":
                    o = "ul";
                break;
                case "ordered":
                    o = "ol";
                break;
            }
            html.items = block.data.items;
            block.data.items.forEach((row)=>{
                m += "<li>"+row+"</li>";
            })
        }
        html.html = "<"+o+c+">"+m+"</"+o+">";
        return html;
    }

    _parseImage(block, withClass){
        let c = this._parseClass(withClass);
        let html = {};
        html.type = "image";
        html.is_empty = true;
        html.caption = null;
        html.url = null;
        html.html = null;
        if(block && block.data){
            if(block.data.caption){ html.caption = block.data.caption; }
            const url = this._getImageObject(block.data);
            if(url){
                if(url.url){
                    html.is_empty = false;
                    html.url = url.url;
                    html.html = "<img"+c+' src="'+url.url+'">';
                }
            }
        }
        return html;
    }

    _parseEmbed(block, withClass){
        let c = this._parseClass(withClass);
        let html = {};
        html.type = "embed";
        html.is_empty = true;
        html.service = null;
        html.src = null;
        html.embed = null;
        html.height = null;
        html.width = null;
        html.html = null;

        if(block && block.data){
            html.service = block.data.service;
            html.src = block.data.source;
            html.embed = block.data.embed;
            html.height = block.data.height;
            html.width = block.data.width;
            html.is_empty = false;
            html.html = "<iframe"+c+" src=\""+html.embed+"\" frameborder=\"no\" allowtransparency=\"true\" allowfullscreen=\"true\" height=\""+html.height+"\"></iframe>"
        }

        return html;
    }

    _parseQuote(block, withClass){
        let c = this._parseClass(withClass);
        let html = {};
        html.type = "quote";
        html.is_empty = true;
        html.text = null;
        html.caption = null;
        html.html = null;
        if(block && block.data){
            if(block.data.text){
                if(block.data.text.trim() != ""){
                    html.text = block.data.text;
                    html.caption = block.data.caption;
                    html.is_empty = false;
                    let cap = (html.caption) ? "-"+html.caption : "";
                    html.html = "<div"+c+"><blockquote>"+html.text+"</blockquote><span>"+cap+"</span></div>"
                }
            }
        }
        return html;
    }

    _parseDelimiter(block, withClass){
        let c = this._parseClass(withClass);
        let html = {};
        html.type = "delimiter";
        html.html = "<div"+c+"></div>";

        return html;
    }

    _parsePoll(block, withClass){
        let c = this._parseClass(withClass);
        let html = {};
        html.type = "poll";
        html.is_empty = true;
        html.question = null;
        html.answers = [];
        if(block && block.data && block.data.poll){
            html.question = block.data.poll.question;
            html.answers = block.data.poll.answers;
            html.showResults = (block.data.poll.showResults) ? true : false;
            if(block.data.poll.answers.length > 0){ html.is_empty = false; }
        }

        return html;
    }

    _parseLinkTool(block, withClass){
        let c = this._parseClass(withClass);
        let html = {};
        html.type = "linkTool";
        html.is_empty = true;
        if(block.success && block.success == 1){
            html.is_empty = false;
            html.meta = block.meta;
        }
        return html;
    }

    _parseSurvey(block){
        let html = {};
        html.type = "survey";
        html.is_empty = true;
        if(block){
            if(block.data){
                html.is_empty = false;
                if(block.data.title){
                    html.title = block.data.title;
                }
                if(block.data.link){
                    html.link = block.data.link;
                }
                if(block.data.fields){
                    html.fields = block.data.fields;
                }
                if(block.data.id){
                    html.id = block.data.id;
                }
            }
        }
        return html;
    }
    
}

module.exports = EditorJsParser;