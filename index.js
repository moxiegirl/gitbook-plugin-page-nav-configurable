// based on https://github.com/yaneryou/gitbook-plugin-anchor-navigation

var cheerio = require('cheerio');

function get_id(text) {
    return text.replace(/[,;. &%+*\/]/g, "_");
}


module.exports = {
    book: {
        assets: ".",
        css: [ "plugin.css" ]
    },
    hooks: {
        "page": function(section) {
            var $ = cheerio.load(section.content);

            var toc = [];
            var title_id = "";
            var title = "";
            var h2 = 0, h3 = 0, h4 = 0;
            $(':header').each(function(i, elem) {
                var header = $(elem);
                header.attr("id", get_id(header.text()));
                text = header.text();

                switch (header[0].name) {
                    case "h2":
                        header.text(text);
                        toc.push({
                            name: header.text(),
                            url: header.attr("id"),
                            children: []
                        });
                        break;
                    case "h3":
                        header.text(text);
                        if (toc.length == 0) {
                            toc.push({name: "none", url: "", children: []});
                        }
                        toc[toc.length-1].children.push({
                            name: header.text(),
                            url: header.attr("id"),
                            children: []
                        });
                        break;
                    default:
                        break;
                }
            });

            if (toc.length == 0){
                section.content = $.html();
                return section;
            }

            var html = "<div id='anchors-navbar'><i class='fa fa-bars'></i><ul><p><a href='#" + title_id +"'>" + title + "</a></p>";
            for(var i=0;i<toc.length;i++){
                html += "<li><a href='#"+toc[i].url+"'>"+toc[i].name+"</a></li>";
                if(toc[i].children.length>0){
                    html += "<ul>"
                        for(var j=0;j<toc[i].children.length;j++){
                            html += "<li><a href='#"+toc[i].children[j].url+"'>"+toc[i].children[j].name+"</a></li>";
                            if(toc[i].children[j].children.length>0){
                                html += "<ul>";
                                    for(var k=0;k<toc[i].children[j].children.length;k++){
                                        html += "<li><a href='#"+toc[i].children[j].children[k].url+"'>"+toc[i].children[j].children[k].name+"</a></li>";
                                    }
                                html += "</ul>";
                            }
                        }
                    html += "</ul>"
                }
            }
            html += "</ul></div><a href='#"+toc[0].url+"' id='goTop'><i class='fa fa-arrow-up'></i></a>";


            section.content = $.html() + html;

            return section;
        }
    }
};
