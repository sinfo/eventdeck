(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof root === 'undefined' || root !== Object(root)) {
        throw new Error('templatizer: window does not exist or is not an object');
    } else {
        root.templatizer = factory();
    }
}(this, function () {
    var jade=function(){function r(r){return null!=r&&""!==r}function n(e){return Array.isArray(e)?e.map(n).filter(r).join(" "):e}var e={};return e.merge=function t(n,e){if(1===arguments.length){for(var a=n[0],s=1;s<n.length;s++)a=t(a,n[s]);return a}var i=n["class"],l=e["class"];(i||l)&&(i=i||[],l=l||[],Array.isArray(i)||(i=[i]),Array.isArray(l)||(l=[l]),n["class"]=i.concat(l).filter(r));for(var o in e)"class"!=o&&(n[o]=e[o]);return n},e.joinClasses=n,e.cls=function(r,t){for(var a=[],s=0;s<r.length;s++)a.push(t&&t[s]?e.escape(n([r[s]])):n(r[s]));var i=n(a);return i.length?' class="'+i+'"':""},e.attr=function(r,n,t,a){return"boolean"==typeof n||null==n?n?" "+(a?r:r+'="'+r+'"'):"":0==r.indexOf("data")&&"string"!=typeof n?" "+r+"='"+JSON.stringify(n).replace(/'/g,"&apos;")+"'":t?" "+r+'="'+e.escape(n)+'"':" "+r+'="'+n+'"'},e.attrs=function(r,t){var a=[],s=Object.keys(r);if(s.length)for(var i=0;i<s.length;++i){var l=s[i],o=r[l];"class"==l?(o=n(o))&&a.push(" "+l+'="'+o+'"'):a.push(e.attr(l,o,!1,t))}return a.join("")},e.escape=function(r){var n=String(r).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");return n===""+r?r:n},e.rethrow=function a(r,n,e,t){if(!(r instanceof Error))throw r;if(!("undefined"==typeof window&&n||t))throw r.message+=" on line "+e,r;try{t=t||require("fs").readFileSync(n,"utf8")}catch(s){a(r,null,e)}var i=3,l=t.split("\n"),o=Math.max(e-i,0),c=Math.min(l.length,e+i),i=l.slice(o,c).map(function(r,n){var t=n+o+1;return(t==e?"  > ":"    ")+t+"| "+r}).join("\n");throw r.path=n,r.message=(n||"Jade")+":"+e+"\n"+i+"\n\n"+r.message,r},e}();

    var templatizer = {};
    templatizer["cards"] = {};
    templatizer["includes"] = {};
    templatizer["pages"] = {};
    templatizer["pages"]["members"] = {};

    // body.jade compiled template
    templatizer["body"] = function tmpl_body() {
        return '<body><nav class="ink-navigation"><div><ul class="menu horizontal black"><li class="heading"><a href="/">EventDeck</a></li><li><a href="/members">Members</a></li><li></li></ul></div></nav><div class="ink-grid"><main data-hook="page-container"></main></div></body>';
    };

    // cards/member.jade compiled template
    templatizer["cards"]["member"] = function tmpl_cards_member() {
        return '<div class="card"><div data-hook="background" class="header"></div><div class="content"><a data-hook="name" class="name"></a><div class="button-group"> <a data-hook="action-edit" class="ink-button orange">edit </a><a href="#" data-hook="action-delete" class="ink-button red">delete</a></div></div></div>';
    };

    // head.jade compiled template
    templatizer["head"] = function tmpl_head() {
        return '<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0"/><meta name="apple-mobile-web-app-capable" content="yes"/>';
    };

    // includes/formInput.jade compiled template
    templatizer["includes"]["formInput"] = function tmpl_includes_formInput() {
        return '<div class="form-group"><label data-hook="label"></label><div data-hook="message-container"><div data-hook="message-text" class="alert alert-danger"></div></div><input class="form-control"/></div>';
    };

    // pages/home.jade compiled template
    templatizer["pages"]["home"] = function tmpl_pages_home() {
        return '<section class="page home"><h2>Welcome to a skeleton for EventDeck</h2><p>If you "view source" you\'ll see it\'s 100% client rendered.</p><p>Click around the site using the nav bar at the top. </p><p>Things to note:<ul><li>The url changes, no requests are made to the server.</li><li>Refreshing the page will always get you back to the same page</li><li>Page changes are nearly instantaneous</li><li>In development mode, you don\'t need to restart the server to see changes, just edit and refresh.</li><li>In production mode, it will serve minfied, uniquely named files with super agressive cache headers. To test:<ul> <li>in dev_config.json set <code>isDev</code> to <code>false</code>.</li><li>restart the server.</li><li>view source and you\'ll see minified css and js files with unique names.</li><li>open the "network" tab in chrome dev tools (or something similar). You\'ll also want to make sure you haven\'t disabled your cache.</li><li>without hitting "refresh" load the app again (selecting current URL in url bar and hitting "enter" works great).</li><li>you should now see that the JS and CSS files were both served from cache without making any request to the server at all.</li></ul></li></ul></p></section>';
    };

    // pages/members/add.jade compiled template
    templatizer["pages"]["members"]["add"] = function tmpl_pages_members_add() {
        return '<section class="page add-member"><h2>Add Person</h2><p>This form and all behavior is defined by the form view in <code>client/forms/member.js</code>.</p><p>The same form-view is used for both editing and creating new users.</p><form data-hook="member-form"><fieldset data-hook="field-container"></fieldset><div class="buttons"><button data-hook="reset" type="submit" class="ink-button">Submit</button></div></form></section>';
    };

    // pages/members/edit.jade compiled template
    templatizer["pages"]["members"]["edit"] = function tmpl_pages_members_edit() {
        return '<section class="page edit-member"><h2>Edit Person</h2><p>This form and all behavior is defined by the form view in <code>client/forms/member.js</code>.</p><p>The same form-view is used for both editing and creating new users.</p><form data-hook="member-form"><fieldset data-hook="field-container"></fieldset><div class="buttons"><button data-hook="reset" type="submit" class="ink-button">Submit</button></div></form></section>';
    };

    // pages/members/list.jade compiled template
    templatizer["pages"]["members"]["list"] = function tmpl_pages_members_list() {
        return '<section class="page pageOne"><h2>Members</h2><ul data-hook="members-list" class="list-group"></ul><p>Try it by clicking the buttons</p><div class="buttons btn-group"><button data-hook="reset" class="ink-button">.reset() </button><button data-hook="fetch" class="ink-button">.fetch() </button><button data-hook="shuffle" class="ink-button">.shuffle() </button><a href="/person/add" class="ink-button">Add Person</a></div><p>Events are always managed so you don\'t get any leaks.</p></section>';
    };

    // pages/members/view.jade compiled template
    templatizer["pages"]["members"]["view"] = function tmpl_pages_members_view() {
        return '<section class="page view-member"><h2 data-hook="name"></h2><img data-hook="img" width="80" height="80"/><div class="buttons"><a data-hook="edit" class="ink-button">Edit</a><button data-hook="delete" class="ink-button red">Delete</button></div></section>';
    };

    return templatizer;
}));