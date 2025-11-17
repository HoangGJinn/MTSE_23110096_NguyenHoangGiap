const path = require('path');
const express = require('express');

const configViewEngine = (app) => {
    // Set folder chứa các file giao diện
    app.set('views', path.join('./src', 'views'));
    app.set('view engine', 'ejs');

    // Set folder chứa các file tĩnh (css, js, image, ...)
    app.use(express.static(path.join('./src', 'public')));
}

module.exports = configViewEngine;