var applySettings = {
    production: function () {
        console.log('entering production mode')
        settings.mongo = {
            uri: '',
            name: '',
            host: '',
            port: 1234,
            username: '',
            password: ''
        }
        settings.session = {
            secret: 'secretcookie',
            key: 'poet.production.sid',
            cookie: {
                httpOnly: true,
                domain: '',
                maxAge: 2419200000
            }
        }
        settings.httpsRequired = true
        settings.authRequired = true
    },
    test: function () {
        console.log('entering test mode')
        settings.mongo = {
            name: 'poet-test'
        }
        settings.session = {
            secret: 'secretcookie',
            key: 'poet.test.sid',
            cookie: {
                httpOnly: true,
                maxAge: 2419200000
            }
        },
        settings.httpsRequired = false
        settings.authRequired = false
    }
}


//	configs common to all our environments
var common_settings = {
    api_port: 3000,
    admin_email : 'admin@admin.com',
    admin_password_hash: '$2a$10$VGctnhdoom7ULdTVJLYNu.zWhLdbAijOXDgSaaYv5mpuWDiswpj7G' // just 'password' without quotes.
}

var settings = {}

//apply the settings common to all our environments
for (var key in common_settings)
    settings[key] = common_settings[key]

var settingsEnv = process.env['NODE_ENV']

if (!settingsEnv)
    settingsEnv = 'test'

//set all of our settings based on NODE_ENV
applySettings[settingsEnv]()

//export all our settings
for (var key in settings)
    exports[key] = settings[key]

