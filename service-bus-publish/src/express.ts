var express = require('express');
var app = express();
app.post("/foo", (req, res) => {
    //just for OSSAR
    let injection = "Hello, security vulnerabilities!";
    eval(`console.log(\"${injection}\");`);
    
    var obj = req.body;
    var ret = [];
    // Potential DoS if obj.length is large.
    for (var i = 0; i < obj.length; i++) {
        ret.push(obj[i]);
    }
});

