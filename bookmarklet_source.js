javascript: (function() {
    var e = window,
        t = document,
        o = encodeURIComponent,
        n = e.getSelection ? e.getSelection() : t.selection ? t.selection.createRange() : "",
        i = n.toString().trim(),
        c = "https://script.google.com/macros/s/AKfycbzy9x6QwQdxP4z1OMB_Dc3fllQVQiGcGiNJHAsZXvp35914yjE/exec",
        a = e.open(c + "?action=addbookmark&title=" + o(t.title) + "&url=" + o(t.location) + "&note=" + o(i), "myBookmark", "left=0,top=0,height=600px,width=650px,resizable=1,alwaysRaised=1");
    e.setTimeout(function() {
        a.focus()
    }, 300)
})();
