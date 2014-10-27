var Cookie = require("./Cookie");

var User = function () {

    var userSession =  Cookie.getCookie('convertJSSession');
    this.firstview = true;
    this.session = {
        pageviews: 1
    };

    if (userSession) {
        this.session = JSON.parse(userSession);
        this.session.pageviews += 1;
        this.firstview = false;
    }

    Cookie.setCookie('convertJSSession', JSON.stringify(this.session));

    console.log(this);

};

module.exports = User;