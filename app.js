var express = require('express'),
    app = express(),
    Poet = require('poet'),
    connect = require('connect'),
    MemoryStore = express.session.MemoryStore,
    passport = require('passport'),
    BasicStrategy = require('passport-http').BasicStrategy,
    settings = require('./settings'),
    adminRoutes = require('./routes/admin'),
    consolidate = require('consolidate'),
    bcrypt = require('bcrypt')


app.configure('all', function() {
    app.use(express.favicon(__dirname + '/views/favicon.ico'))
    app.use(express.bodyParser())
    app.use(express.cookieParser())

    app.use(connect.session({
        secret: settings.session.secret,
        key : settings.session.key,
        store: new MemoryStore()
    }))

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(express.logger());

    app.engine('jade', consolidate.jade)
    app.set('views', __dirname + '/views')
    app.set('view engine', 'jade')
    app.use(express.static(__dirname + '/views'));

    passport.use(new BasicStrategy(
        function(email, password, done) {
            if (email !== settings.admin_email)
                return done(null, false)

            if (!bcrypt.compareSync(password, settings.admin_password_hash))
                return done(null, false)

            return done(null, email)
        }
    ))

    passport.serializeUser(function(user, done) {
        // override default serialization
        done(null, user);
    });

    passport.deserializeUser(function(id, done) {
        // override default deserialization
        done(null, id)
    });

    var poet = Poet(app, {
        postsPerPage: 2,
        posts: './_posts',
        metaFormat: 'json',
        routes: {
            '/myposts/:post': 'post',
            '/pagination/:page': 'page',
            '/mytags/:tag': 'tag',
            '/mycategories/:category': 'category'
        }
    });

    poet.init().then(function () {
        // initialized, bind other routes for admin
        app.use(app.routes);
        app.get('/', function (req, res) { res.render('index');});

        // admin routes get basic auth.
        app.all('/admin*', passport.authenticate('basic'), function(req, res, next){
            req.session.user = req.session.passport.user
            next()
        })

        app.get('/admin', adminRoutes.renderAdmin)
        app.post('/admin/post', adminRoutes.createPost)
        app.get('/admin/post/:postId', adminRoutes.getPost)
        app.delete('/admin/post/:postId', adminRoutes.deletePost)
        app.put('/admin/post/:postId', adminRoutes.updatePost)

        app.param('postId', function(req, res, next, id) {
            if (!poet.helpers || !poet.helpers.getPost || !poet.helpers.getPost(id))
                return res.send(404, "No post with that id exists.")

            req.slug = id
            req.post = poet.helpers.getPost(id)
            next()
        })

        app.listen(3000);

        poet.watch();

        process.on('SIGTERM', exports.terminate)
        process.on('SIGINT', exports.terminate)
    });
})

exports.terminate = function() {
    console.log('Stopping application and database')

    setTimeout(function() {
        process.exit(0)
    }, 1000)
}

