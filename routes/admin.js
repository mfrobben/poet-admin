"use strict";
var settings = require('../settings'),
    poet = require('poet'),
    fs = require('fs'),
    path = require('path')

function frontMatterStringify(obj){
    var string = '{{{\n'

    Object.keys(obj).forEach(function (key, index){
        if (index != 0)
            string += ',\n'

        string += '    "' + key + '" : ' + (Array.isArray(obj[key]) ? '[ "' + obj[key].toString() + '"]' : '"' + obj[key].toString() + '"');
    })

    string += '\n}}}\n\n\n'

    return string
}

function getCleanDateString(){
    var date = new Date();
    // do leading zeros plus month correction for date strings, returns YYYY-MM-DD (2013-10-01 for Oct 1 example)
    return (date.getUTCFullYear() + '-' +
        (date.getUTCMonth() + 1  < 10 ? '0' + (date.getUTCMonth()+1).toString() : date.getUTCMonth()+1) + '-' +
        (date.getUTCDate() < 10 ? '0' + (date.getUTCDate()) : date.getUTCDate()))
}


exports.renderAdmin = function(req, res) {
    return res.render('admin.jade')
}

exports.getPost = function(req, res) {
    return res.send(200, req.post)
}


exports.createPost = function(req, res) {
    var frontMatterObj = {
        title : req.body.title,
        tags : req.body.tags.split(','),
        category : req.body.category,
        date : getCleanDateString()
    }

    var filename = req.body.filename || (req.body.title.replace(' ', '_') + '.md')

    var data = frontMatterStringify(frontMatterObj) + req.body.body

    var filepath = path.normalize(__dirname + '/../_posts/' + filename)

    fs.exists(filepath, function(exists){
        if (exists === true)
            return res.send(500, 'File already exists with that name.')

        fs.writeFile(filepath, data, function(err){
            if (err)
                return res.send(500, err)

            return res.send(200, {})
        })
    })


}

exports.deletePost = function(req, res){
    var filepath = path.normalize(__dirname + '/../_posts/' + req.slug + '.md')

    fs.unlink(filepath, function(){
        return res.send(200, {})
    })
}

exports.updatePost = function(req, res) {
    var frontMatterObj = {
        title : req.body.title,
        tags : req.body.tags,
        category : req.body.category,
        date : getCleanDateString()
    }

    var data = frontMatterStringify(frontMatterObj) + req.body.body

    var isSameFile = (req.body.filename === req.slug + '.md')

    var filepath = path.normalize(__dirname + '/../_posts/' + req.body.filename)

    fs.exists(filepath, function(exists){
        // if user specified new filename but file already exists,
        if (exists && isSameFile === false)
            return res.send(500, 'File already exists with that name.')

        fs.writeFile(filepath, data, function(err){
            if (err)
                return res.send(500, err)

            return res.send(200, {})
        })
    })

}
