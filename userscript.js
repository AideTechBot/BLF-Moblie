// ==UserScript==
// @name         BLF Mobile
// @namespace    http://github.com/AideTechBot
// @version      0.1
// @description  adds functionnality to wap2 BLF
// @author       Aide33
// @match        https://forum.blockland.us/*
// @grant        none
// @require http://code.jquery.com/jquery-1.12.4.min.js
// ==/UserScript==

(function() {
    'use strict';

    function nthIndex(str, pat, n){
        var L= str.length, i= -1;
        while(n-- && i++<L){
            i= str.indexOf(pat, i);
            if (i < 0) break;
        }
        return i;
    }

    //fixing the quote blocks
    //breaks when more than one quote
    //TODO: redo this entirely
    for(var i = 0; i < $("p").length; i++)
    {
        var content =  "" + $("p").eq(i).html();
        var first = 1;
        var position = 0;
        var j = 1;
        var opentag = 1;
        var count = 1;
        while(nthIndex(content,"Quote",count) != -1){
            count++;
        }
        alert(count);
        if(content.indexOf("Quote") != -1)
        {
            while((opentag || content.indexOf("Quote", position)) != -1 && (opentag || first)) {
                alert(opentag + "--"+j+"--" + first + "  :  " + position);
                if(first)
                {
                    var after= nthIndex(content,"Quote",j);
                    if(j == count || after == -1) break;
                    content = "" + content.substring(0, after) + "<span class=\"quoteblock\"><span class=\'quotetitle\'>quote" + content.substring(after+"Quote".length);
                    content = "" + content.replace(/<br><br>/, '</span><span class=\'quote\'>');
                    first = 0;
                    j++;
                    position = after + "Quote".length;
                    opentag = 1;
                } else {
                    //alert(position);
                    content = "" +content.replace(/<br><br>/, '</span></span>');
                    first = 1;
                    opentag = 0;
                }
            }
        }
        $("p").eq(i).html(content);
    }

    //for(var i = 0; i < $("")
})();
