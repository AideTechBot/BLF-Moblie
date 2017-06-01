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

    for(var i = 0; i < $("p").length; i++)
    {
        var content =  "" + $("p").eq(i).html();
        var first = 1;
        var j = 1;
        while(content.indexOf("<br><br>") != -1) {
            if(first)
            {
                var after= nthIndex(content,"Quote",j);
                content = "" + content.substring(0, after) + "<span class=\"quoteblock\"><span class=\'quotetitle\'>" + content.substring(after);
                content = "" + content.replace(/<br><br>/, '</span><span class=\'quote\'>');
                first = 0;
                j++;
            } else {
                content = "" +content.replace(/<br><br>/, '</span></span>');
                first = 1;
            }
        }
        $("p").eq(i).html(content);
    }
})();
