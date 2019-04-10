"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_errors_1 = require("http-errors");
var express_1 = require("express");
var path_1 = require("path");
var cookie_parser_1 = require("cookie-parser");
var morgan_1 = require("morgan");
var node_sass_middleware_1 = require("node-sass-middleware");
var index_1 = require("./routes/index");
var users_1 = require("./routes/users");
var app = express_1.default();
// view engine setup
app.set('views', path_1.default.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(morgan_1.default('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(cookie_parser_1.default());
app.use(node_sass_middleware_1.default({
    src: path_1.default.join(__dirname, 'public'),
    dest: path_1.default.join(__dirname, 'public'),
    indentedSyntax: true,
    sourceMap: true
}));
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use('/', index_1.default);
app.use('/users', users_1.default);
var notFoundHandler = function (req, res, next) {
    next(http_errors_1.default(404));
};
// catch 404 and forward to error handler
app.use(notFoundHandler);
var errorHandler = function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
};
// error handler
app.use(errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map