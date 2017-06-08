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

    //helper functions
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
        //alert(count);
        if(content.indexOf("Quote") != -1)
        {
            while((opentag || content.indexOf("Quote", position)) != -1 && (opentag || first)) {
                //alert(opentag + "--"+j+"--" + first + "  :  " + position);
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

    //make naked links <a> links
    var urlRegex = /\b(https?:\/\/[^\s+\"\<\>]+)/ig;
	var snapTextElements = document.evaluate("//text()[not(ancestor::a) " + "and not(ancestor::script) and not(ancestor::style) and " + "contains(translate(., 'HTTP', 'http'), 'http')]", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	for (var x = snapTextElements.snapshotLength - 1; x >= 0; x--) {
		var elmText = snapTextElements.snapshotItem(x);
		if (urlRegex.test(elmText.nodeValue)) {
			var elmSpan = document.createElement("span");
			var sURLText = elmText.nodeValue;
			elmText.parentNode.replaceChild(elmSpan, elmText);
			urlRegex.lastIndex = 0;
			for (var match = null, lastLastIndex = 0;(match = urlRegex.exec(sURLText)); ) {
				elmSpan.appendChild(document.createTextNode(sURLText.substring(lastLastIndex, match.index)));
				var elmLink = document.createElement("a");
				elmLink.setAttribute("href", match[0]);
				elmLink.appendChild(document.createTextNode(match[0]));
				elmSpan.appendChild(elmLink);
				lastLastIndex = urlRegex.lastIndex;
			}
			elmSpan.appendChild(document.createTextNode(sURLText.substring(lastLastIndex)));
			elmSpan.normalize();
		}
	}

    //avatars n shiet
    //-5 to the orginal link because ur taking out the ;wap2
    var users = {}, avatarformats = {};
    $.get(window.location.href.substring(0, window.location.href.length - 5), function(data, status){
        //if(status != 200) {
        //    alert("Data: " + data + "\nStatus: " + status);
        //}
        var wrapper= document.createElement('div');
        wrapper.innerHTML= data;
        //alert(wrapper.innerHTML);

        var links = wrapper.getElementsByTagName('a');
        for(var i = 0; i< links.length; i++){
            if(/u\=(.*?)$/.test(links[i].href))
               users[links[i].innerHTML] = links[i].href.substring(links[i].href.indexOf("u=")+2);
        }
        var avatarlinks = wrapper.getElementsByTagName('img');
        for(var j = 0; j< avatarlinks.length; j++){
            if(/avatar_(.*?)$/.test(avatarlinks[j].src))
            {
               var format = avatarlinks[j].src.slice(-4);
               var user = avatarlinks[j].src.substring(avatarlinks[j].src.indexOf("avatar_")+7,avatarlinks[j].src.indexOf(format));
               avatarformats[user] = format;
            }
        }
        console.log(JSON.stringify(avatarformats));

        //insert images
        for(var y = 0; y < $("b").length; y++)
        {
            var userid =  users[$("b").eq(y).html()];
            var avatar = new Image(15, 15);
            avatar.src = 'https://forum.blockland.us/avatarUpload/avatar_' + userid + avatarformats[userid];
            avatar.userid = userid;
            if(typeof userid !== undefined)
            {
                $("b").eq(y).html( avatar.outerHTML + $("b").eq(y).html());
            }
        }
    });

})();
