poet-admin
==========

A generic admin for the awesome Node blogging platform, poet.

This repo wraps the stock poet library with a small set of admin pages and routes. The admin routes allow you to do basic CRUD activities on your poet post set from a web interface. 

Admin urls are protected by basic HTTP authentication which is configured in the settings.js file. Cookies are persisted in memory, so this isn't for high- or even medium-scale websites.

