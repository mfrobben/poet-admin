"use strict";
var settings = require('../settings'),
    poet = require('poet'),
    fs = require('fs'),
    path = require('path')

function customStringify(obj){
    var string = ''

    obj.keys().forEach(function (key){
        string += '"' + key + '" : "' + obj[key].toString() + '",\n'
    })

    return string
}


exports.renderAdmin = function(req, res) {
    return res.render('admin.jade')
}

exports.listPosts = function(req, res) {
    return res.send(200, poet.posts)
}


exports.createPost = function(req, res) {
    var slug = req.body.title.replace(' ', '_')

    var frontMatterObj = {
        title : req.body.title,
        tags : req.body.tags.split(','),
        category : req.body.category,
        date : Date.now()
    }

    var data = '{{{\n' + '"title" : "' + req.body.title + '"' + '\n}}}\n' + req.body.body

    var filepath = path.normalize(__dirname + '/../_posts/' + slug + '.md')

    fs.writeFile(filepath, data, function(err){
        console.log(err)
        if (err)
            return res.send(500, err)

        return res.send(200)
    })
}

exports.deletePost = function(req, res){
    var filepath = path.normalize(__dirname + '/../_posts/' + req.slug + '.md')

    fs.unlink(filepath, function(){
        return res.send(200)
    })
}

exports.updatePost = function(req, res) {
    var frontMatterObj = {
        title : req.body.title,
        tags : req.body.tags,
        category : req.body.category,
        date : Date.now()
    }

    var data = '{{{\n' + JSON.stringify(frontMatterObj) + '\n}}}\n' + req.body.body

    var filepath = path.normalize(__dirname + '/../_posts/' + req.slug + '.md')

    fs.writeFile(filepath, data, function(err){
        if (err)
            return res.send(500, err)

        return res.send(200)
    })
}
