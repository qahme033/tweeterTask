/**
 * Tweetie: A simple Twitter feed plugin
 * Author: Sonny T. <hi@sonnyt.com>, sonnyt.com
 */

(function ($) {
    'use strict';

    $.fn.twittie = function () {
        var options = (arguments[0] instanceof Object) ? arguments[0] : {},
            callback = (typeof arguments[0] === 'function') ? arguments[0] : arguments[1];

        // Default settings
        var settings = $.extend({
            'username': null,
            'list': null,
            'hashtag': null,
            'count': 10,
            'hideReplies': false,
            'dateFormat': '%b/%d/%Y',
            'template': '{{date}} - {{tweet}}',
            'apiPath' : 'api/tweet.php',
            'loadingText': 'Loading...'
        }, options);

        if (settings.list && !settings.username) {
            $.error('If you want to fetch tweets from a list, you must define the username of the list owner.');
        }

        /**
         * Applies @reply, #hash and http links
         * @param  {String} tweet A single tweet
         * @return {String}       Fixed tweet
         *
         * Thanks to @Wachem enhanced linking.
         */
        var linking = function (tweet) {
            var twit = tweet.replace(/(https?:\/\/([-\w\.]+)+(:\d+)?(\/([\w\/_\.]*(\?\S+)?)?)?)/ig,'<a href="$1" target="_blank" title="Visit this link">$1</a>')
                 .replace(/#([a-zA-Z0-9_]+)/g,'<a href="https://twitter.com/search?q=%23$1&amp;src=hash" target="_blank" title="Search for #$1">#$1</a>')
                 .replace(/@([a-zA-Z0-9_]+)/g,'<a href="https://twitter.com/$1" target="_blank" title="$1 on Twitter">@$1</a>');

            return twit;
        };

        /**
         * Formating a date
         * @param  {String} twt_date Twitter date
         * @return {String}          Formatted date
         */
        var dating = function (twt_date) {
            // fix for IE
            var time = twt_date.split(' ');
            twt_date = new Date(Date.parse(time[1] + ' ' + time[2] + ', ' + time[5] + ' ' + time[3] + ' UTC'));

            var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            var _date = {
                '%d': twt_date.getDate(),
                '%m': twt_date.getMonth()+1,
                '%b': months[twt_date.getMonth()].substr(0, 3),
                '%B': months[twt_date.getMonth()],
                '%y': String(twt_date.getFullYear()).slice(-2),
                '%Y': twt_date.getFullYear()
            };

            var date = settings.dateFormat;
            var format = settings.dateFormat.match(/%[dmbByY]/g);

            for (var i = 0, len = format.length; i < len; i++) {
                date = date.replace(format[i], _date[format[i]]);
            }

            return date;
        };

        /**
         * Templating a tweet using '{{ }}' braces
         * @param  {Object} data Tweet details are passed
         * @return {String}      Templated string
         */
        var templating = function (data) {
            var temp = settings.template;
            var temp_variables = ['date', 'tweet', 'avatar', 'url', 'retweeted', 'screen_name', 'user_name'];

            for (var i = 0, len = temp_variables.length; i < len; i++) {
                temp = temp.replace(new RegExp('{{' + temp_variables[i] + '}}', 'gi'), data[temp_variables[i]]);
            }

            return temp;
        };

        // Set loading
       	this.html('<span>'+settings.loadingText+'</span>');

        var that = this;

        // Fetch tweets
        $.getJSON(settings.apiPath, { username: settings.username, list: settings.list, hashtag: settings.hashtag, count: settings.count, exclude_replies: settings.hideReplies }, function (twt) {
            var deleteCheckedButton = '<button type="button" onclick="deleteHanlder()"class="btn btn-danger btn-xs">Delete Checked</button>'
            var toggleButton = '<button type="button" onclick="toggleHandler()"class="btn btn-default btn-xs">Toggle</button>'
            that.find('span').fadeOut('fast', function () {
                that.append('<thead><tr><th></th><th>date</th><th>tweet</th><th>delete</th></tr></thead><tbody></tbody><tfoot><tr><th></th><th>date</th><th>tweets</th><th>'+deleteCheckedButton+ toggleButton+'</th></tr></tfoot>');

                for (var i = 0; i < settings.count; i++) {
                    var tweet = false;
                    if(twt[i]) {
                        tweet = twt[i];
                    } else if(twt.statuses !== undefined && twt.statuses[i]) {
                        tweet = twt.statuses[i];
                    } else {
                        break;
                    }

                    var temp_data = {
                        user_name: tweet.user.name,
                        date: dating(tweet.created_at),
                        tweet: (tweet.retweeted) ? linking('RT @'+ tweet.user.screen_name +': '+ tweet.retweeted_status.text) : linking(tweet.text),
                        avatar: '<img src="'+ tweet.user.profile_image_url +'" />',
                        url: 'https://twitter.com/' + tweet.user.screen_name + '/status/' + tweet.id_str,
                        retweeted: tweet.retweeted,
                        screen_name: linking('@'+ tweet.user.screen_name)
                    };
                    var link = tweet.text.split('https')[1]
                    var linkbutton = '<button onclick="linkHandler(\'' + link + '\')" " class="btn btn-primary btn-xs">Full Tweet</button>'
                    var editButton = '<button type="button" id='+ tweet.id +' onclick="editHandler(\'' + tweet.id + '\')"class="btn btn-warning btn-xs">Edit</button>'
                    var deleteCheck = '<label><input type="checkbox" value=""></label>'
                    that.find('tbody').append('<tr><td>' + linkbutton + editButton + '</td><td>' + dating(tweet.created_at) + '</td><td>' + tweet.text.split('https')[0] + '</td><td>' + deleteCheck + '</td></tr>');
                }

                if (typeof callback === 'function') { callback(); }
            });
        });
    };

})(jQuery);

function linkHandler(link){
    window.open("http://twitter.com/"+link) 
}
function deleteHanlder(id){
    var checks = $(':checkbox')
        for (var i = checks.length - 1; i >= 0; i--) {
                if(checks[i].checked == true){
                    console.log(checks[i].parentNode.parentNode.parentNode)
                    $('#tablefoo').DataTable().row(checks[i].parentNode.parentNode.parentNode).remove().draw()
                }
        }  
}

function editHandler(id){

    text = $('#' + id)[0].parentNode.parentNode.children[2].innerHTML
    $('#' + id)[0].parentNode.parentNode.children[2].innerHTML = '<textarea style="width:100%" onkeypress="editRow(event)">' + text + '"</textarea>'
}

function editRow(e){
        console.log(e)
    if(e.key == 'Enter'){
        e.preventDefault()
        text = e.path[0].value
        console.log(e.path[2])
        e.path[0].outerHTML = e.path[0].value

    }
}

function toggleHandler(){
    var flag = false
    var checks = $(':checkbox')
    for (var i = checks.length - 1; i >= 0; i--) {
        if(checks[i].checked == false){
            flag = true
        }
    }
    $(":checkbox").prop('checked', flag);  

}