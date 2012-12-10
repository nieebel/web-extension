/*
 * Pagemod for all external links on site
 *
 * @author Arend-Jan Tetteroo <aj@cleanbits.net>
 * @copyright Cleanbits/The Green Web Foundation 2010-2012
 */

/**
 * On Request, find all hrefs and assign green or grey icon
 */
chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {
        if (request.data){
            data = request.data;
           
            $("a").not('.TGWF-addon').each(function (i) {
              var loc = $(this).attr('href');
              var strippedurl = getUrl(loc);
              if (loc && strippedurl) {
                if (data[strippedurl]) {
                  
                  if(data[strippedurl].green){
                   // $(this).addClass('tgwf_green');
                    $(this)
                    .addClass('tgwf_green')
                    .qtip({
                      content: { text: function(api) { 
                        title = getTitleWithLink(data[strippedurl]); 
                        return title;
                      }},
                      show: { delay: 700 },
                      hide: { fixed:true,  delay:500 },
                      style: {
                        classes: 'qtip-green'
                      }
                    });
                  } else {
                    $(this).addClass('tgwf_grey');
                  }
                }
              }
            });
        }
    });

/**
 * If document is ready, find the urls to check
 */
$(document).ready(function() {
    chrome.storage.local.get("tgwf_all_disabled", function(items) {
        if(items.tgwf_all_disabled == 1){
          // Green web search is disabled, return
          return;
        }
        getUrlsAndSendRequest();
    });
});

function getUrlsAndSendRequest()
{
  currenturl = getUrl(document.URL);
  var locs = new Object();
  $("a").not('.TGWF-addon').each(function (i) {
       var loc = $(this).attr('href');
       var strippedurl = getUrl(loc);
       if (loc && strippedurl) {
         /*if (getUrl(loc) == currenturl) {
           return true;
         }*/
         locs[strippedurl] = strippedurl 
       }             
  });
  if(Object.keys(locs).length > 0) {
      chrome.extension.sendRequest({locs: locs}, function(response) {
      });
  }
}