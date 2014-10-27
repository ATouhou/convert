var Cookie = {};

var getCookie = function ( name ) {
    var start = document.cookie.indexOf( name + "=" );
    var len = start + name.length + 1;

    if (!start && (name !== document.cookie.substring(0, name.length))) {
        return null;
    }

    if ( start === -1 ) {
        return null;
    }

    var end = document.cookie.indexOf( ';', len );

    if ( end === -1 ) {
        end = document.cookie.length;
    }

    return decodeURIComponent(document.cookie.substring(len, end));
};

var setCookie = function (name, value, expires, path, domain, secure) {

    var today = new Date();

    today.setTime(today.getTime());

    if (expires) {
        expires = expires * 1000 * 60 * 60 * 24;
    }

    var expires_date = new Date( today.getTime() + (expires) );

    document.cookie = name + '=' + encodeURIComponent(value) +
    ((expires) ? ';expires='+expires_date.toGMTString() : '') +
    ((path) ? ';path=' + path : '' ) +
    ((domain) ? ';domain=' + domain : '' ) +
    ((secure) ? ';secure' : '' );
};

var deleteCookie = function ( name, path, domain ) {
    if (getCookie( name )) {
        document.cookie = name + '=' +
        ( ( path ) ? ';path=' + path : '') +
        ( ( domain ) ? ';domain=' + domain : '' ) +
        ';expires=Thu, 01-Jan-1970 00:00:01 GMT';
    }
};

Cookie.getCookie = getCookie;
Cookie.setCookie = setCookie;
Cookie.deleteCookie = deleteCookie;

module.exports = Cookie;