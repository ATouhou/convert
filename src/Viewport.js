var Viewport = {
    isAtBottom: function (sensitivity) {

        sensitivity = sensitivity || 20;

        if (!document && !window) { return; }

        var doc = document.documentElement;
        var win = window;

        return ((doc.scrollHeight - win.innerHeight) < (win.scrollY + sensitivity));
    },

    isBelowTheFold: function () {
        if (!document && !window) { return; }
        var doc = document.documentElement;
        var win = window;

        var theFold = win.innerHeight;

        return (win.scrollY > theFold);
    }
};

module.exports = Viewport;