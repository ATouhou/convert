var Cookie = require("./Cookie");

var User = function () {

    var keys = {
        VISIT: 'convertJsVisit',
        VISITOR: 'convertJsVisitor'
    };

    var visitCookie =  Cookie.getCookie(keys.VISIT);
    var visitorCookie = Cookie.getCookie(keys.VISITOR);

    this.firstview = true;
    this.visit = {
        pageviews: 1
    };

    this.visitor = {
        returning: false,
        visits: 1
    };

    if (visitCookie) {
        this.visit = JSON.parse(visitCookie);
        this.visit.pageviews += 1;
        this.firstview = false;
    }

    //Visit only lasts while browser session
    Cookie.setCookie(keys.VISIT, JSON.stringify(this.visit));

    if (visitorCookie) {
        this.returning = true;
        this.visitor = JSON.parse(visitorCookie);
        if (this.firstview) {
            this.visitor.visits += 1;
        }
    }

    //Visitor lasts 30 days from last visit
    Cookie.setCookie(keys.VISITOR, JSON.stringify(this.visitor), 30);

};

module.exports = User;