var express = require('express');
var router = express.Router();

// Get pages index

router.get('/', function(req, res) {
    res.send('hello');
})
// Get add pages 

router.get('/add-page', function(req, res) {
    var title="";
    var slug="";
    var content="";

    res.render('admin/add-page',{
        title: title,
        slug:slug,
        content:content
    });
});

// Exports 
module.exports = router;