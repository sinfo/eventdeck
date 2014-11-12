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
    templatizer["partials"] = {};
    templatizer["pages"]["companies"] = {};
    templatizer["pages"]["members"] = {};

    // body.jade compiled template
    templatizer["body"] = function tmpl_body() {
        return '<body><nav class="ink-navigation"><div><ul class="menu horizontal black"><li class="heading"><a href="/">EventDeck</a></li><li><form data-hook="base-form" class="base-form ink-form"><fieldset data-hook="field-container"></fieldset></form></li><li><a href="/members">Members</a></li><li><a href="/companies">Companies</a></li></ul></div><main data-hook="page-container" class="ink-grid"></main></nav></body>';
    };

    // cards/communication.jade compiled template
    templatizer["cards"]["communication"] = function tmpl_cards_communication() {
        return '<div class="card full"><div class="content"><b data-hook="kind" class="kind"></b><div data-hook="text"></div></div></div>';
    };

    // cards/company.jade compiled template
    templatizer["cards"]["company"] = function tmpl_cards_company() {
        return '<div class="card"><div data-hook="background" class="header wide"></div><div class="content"><div data-hook="name" class="a name"></div><div data-hook="status" class="a status"></div><div class="button-group"><a data-hook="action-edit" class="ink-button orange">edit</a><a href="#" data-hook="action-delete" class="ink-button red">delete</a></div></div></div>';
    };

    // cards/member.jade compiled template
    templatizer["cards"]["member"] = function tmpl_cards_member() {
        return '<div class="card"><div data-hook="background" class="header"></div><div class="content"><a data-hook="name" class="name"></a><div class="button-group"> <a data-hook="action-edit" class="ink-button orange">edit </a><a href="#" data-hook="action-delete" class="ink-button red">delete</a></div></div></div>';
    };

    // cards/participation.jade compiled template
    templatizer["cards"]["participation"] = function tmpl_cards_participation() {
        return '<div class="card"><div class="content"><span data-hook="event" style="margin-right: 4pt;"></span><span data-hook="status" class="kind"></span><div><p data-hook="member"></p><p data-hook="kind"></p></div></div></div>';
    };

    // head.jade compiled template
    templatizer["head"] = function tmpl_head() {
        return '<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0"/><meta name="apple-mobile-web-app-capable" content="yes"/>';
    };

    // includes/formInput.jade compiled template
    templatizer["includes"]["formInput"] = function tmpl_includes_formInput() {
        return '<div class="control-group"><label data-hook="label"></label><div data-hook="message-container" class="control"><div data-hook="message-text" class="ink-alert warning"></div></div><input/></div>';
    };

    // pages/companies/add.jade compiled template
    templatizer["pages"]["companies"]["add"] = function tmpl_pages_companies_add() {
        return '<section class="page companies add"><h2>Add Company</h2><form data-hook="company-form" class="ink-form"><fieldset data-hook="field-container"></fieldset><div class="buttons"><button data-hook="reset" type="submit" class="ink-button">Submit</button></div></form></section>';
    };

    // pages/companies/edit.jade compiled template
    templatizer["pages"]["companies"]["edit"] = function tmpl_pages_companies_edit() {
        return '<section class="page companies edit"><h2>Edit company</h2><form data-hook="company-form" class="ink-form"><fieldset data-hook="field-container"></fieldset><div class="buttons"><button data-hook="reset" type="submit" class="ink-button">Submit</button></div></form></section>';
    };

    // pages/companies/list.jade compiled template
    templatizer["pages"]["companies"]["list"] = function tmpl_pages_companies_list() {
        return '<section class="page companies list"><h2>Companies</h2><div class="button-group"><div data-hook="selected" class="button ink-button">Selected</div><div data-hook="contacted" class="button ink-button">Contacted</div><div data-hook="inconversations" class="button ink-button">In Conversations</div><div data-hook="innegotiations" class="button ink-button">In Negotiations</div><div data-hook="closeddeal" class="button ink-button">Closed Deal</div><div data-hook="rejected" class="button ink-button">Rejected</div><div data-hook="giveup" class="button ink-button">Give Up</div></div><div data-hook="companies-list"></div><p>Try it by clicking the buttons</p><div><button data-hook="fetch" class="ink-button">Fetch</button><a href="/companies/add" class="ink-button">Add Company</a></div></section>';
    };

    // pages/companies/view.jade compiled template
    templatizer["pages"]["companies"]["view"] = function tmpl_pages_companies_view() {
        return '<section class="page companies view"><div class="ink-grid"><div class="column-group horizontal-gutters"><div class="all-100"><h1 data-hook="name"></h1></div><div class="all-33"><div class="button-group"><a data-hook="edit" class="ink-button orange">Edit</a><button data-hook="delete" class="ink-button red">Delete</button></div><img data-hook="img" width="60" height="60"/><div><h4>Area</h4><p data-hook="area"></p></div><div> <h4>Description</h4><p data-hook="description"></p></div></div><div class="all-33"><div><h3>History</h3><p data-hook="history"></p></div><div> <h3>Contacts</h3><p data-hook="contacts" class="contacts"></p></div></div><div class="all-33"><div data-hook="company-participations"></div></div><div class="all-100"> <div data-hook="company-communications"></div></div></div></div></section>';
    };

    // pages/home.jade compiled template
    templatizer["pages"]["home"] = function tmpl_pages_home() {
        return '<section class="page home"><h2>Welcome to a skeleton for EventDeck</h2><p>If you "view source" you\'ll see it\'s 100% client rendered.</p><p>Click around the site using the nav bar at the top. </p><p>Things to note:<ul><li>The url changes, no requests are made to the server.</li><li>Refreshing the page will always get you back to the same page</li><li>Page changes are nearly instantaneous</li><li>In development mode, you don\'t need to restart the server to see changes, just edit and refresh.</li><li>In production mode, it will serve minfied, uniquely named files with super agressive cache headers. To test:<ul> <li>in dev_config.json set <code>isDev</code> to <code>false</code>.</li><li>restart the server.</li><li>view source and you\'ll see minified css and js files with unique names.</li><li>open the "network" tab in chrome dev tools (or something similar). You\'ll also want to make sure you haven\'t disabled your cache.</li><li>without hitting "refresh" load the app again (selecting current URL in url bar and hitting "enter" works great).</li><li>you should now see that the JS and CSS files were both served from cache without making any request to the server at all.</li></ul></li></ul></p></section>';
    };

    // pages/login.jade compiled template
    templatizer["pages"]["login"] = function tmpl_pages_login() {
        return '<section class="page login"><h2>Welcome to EventDeck!</h2><form class="ink-form"><div id="id" class="control-group"><div class="control append-button"><span><input type="text" placeholder="joaquim.couves"/></span><div id="loginId" class="ink-button">Log in</div></div></div><div id="code" class="control-group"><div class="control append-button"><span><input type="text" placeholder="AAAA"/></span><div id="loginCode" class="ink-button">Log in</div></div><p>Type in the field above the code you received on your email.<br>It may take a few minutes so be patient.</p></div></form></section>';
    };

    // pages/loginCode.jade compiled template
    templatizer["pages"]["loginCode"] = function tmpl_pages_loginCode() {
        return '<section class="page login"><h2>Welcome to EventDeck!</h2><form class="ink-form"><div class="control-group"><div class="control append-button"><span><input type="text" placeholder="AAAA" id="code"/></span><div id="login" class="ink-button">Log in</div></div></div></form></section>';
    };

    // pages/members/add.jade compiled template
    templatizer["pages"]["members"]["add"] = function tmpl_pages_members_add() {
        return '<section class="page members add"><h2>Add Person</h2><form data-hook="member-form" class="ink-form"><fieldset data-hook="field-container"></fieldset><div class="buttons"><button data-hook="reset" type="submit" class="ink-button">Submit</button></div></form></section>';
    };

    // pages/members/edit.jade compiled template
    templatizer["pages"]["members"]["edit"] = function tmpl_pages_members_edit() {
        return '<section class="page members edit"><h2>Edit Person</h2><img data-hook="img" width="300" height="300"/><form data-hook="member-form" class="ink-form"><fieldset data-hook="field-container"></fieldset><div class="buttons"><button data-hook="reset" type="submit" class="ink-button">Submit</button></div></form></section>';
    };

    // pages/members/list.jade compiled template
    templatizer["pages"]["members"]["list"] = function tmpl_pages_members_list() {
        return '<section class="page members list"><h2>Members</h2><div data-hook="members-list"></div><p>Try it by clicking the buttons</p><div><button data-hook="fetch" class="ink-button">Fetch</button><a href="/members/add" class="ink-button">Add Member</a></div></section>';
    };

    // pages/members/view.jade compiled template
    templatizer["pages"]["members"]["view"] = function tmpl_pages_members_view() {
        return '<section class="page member view"><h2 data-hook="name"></h2><img data-hook="img" width="300" height="300"/><div class="buttons"><a data-hook="edit" class="ink-button">Edit</a><button data-hook="delete" class="ink-button red">Delete</button></div></section>';
    };

    // partials/comunications.jade compiled template
    templatizer["partials"]["comunications"] = function tmpl_partials_comunications() {
        return '<div><h4>Communications</h4><div data-hook="communications-list"></div></div>';
    };

    // partials/participations.jade compiled template
    templatizer["partials"]["participations"] = function tmpl_partials_participations() {
        return '<div><h4>Participations</h4><div data-hook="participations-list"></div></div>';
    };

    return templatizer;
}));