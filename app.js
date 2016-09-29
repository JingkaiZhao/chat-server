'use strict';
const koa = require('koa');
const request = require('koa-request');
const bodyParser = require('koa-bodyparser');

let app = koa();

require('koa-qs')(app);

app.use(bodyParser());

let messages = {
    1: [{
        message: 'abc',
        timestamp: Date.now(),
        from: 2,
    }, {
        message: 'cde',
        timestamp: Date.now() + 1000,
        from: 2,
    }],
    2: [{
        message: 'def',
        timestamp: Date.now() + 10000,
        from: 1,
    }, {
        message: 'gh',
        timestamp: Date.now() + 100000,
        from: 1,
    }]
};

app.use(function *(next) {
    let req = this.request;
    let requestUrl = req.url;

    let responseBody;
    if (requestUrl.indexOf('pull_messages') > -1) {
        let client = this.query.client;
        responseBody = messages[client];
    } else if (requestUrl.indexOf('push_message') > -1) {
        try {
            let message = req.body;
            let src = this.query.src;
            let target = this.query.target;
            req.body.from = src;
            if (messages[target]) {
                messages[target].push(req.body);
            } else {
                messages[target] = [req.body];
            };
            responseBody = {status: 'success'};
        } catch (e) {
            responseBody = {status: 'error'};
        }

    }


    this.body = responseBody;
});

app.listen(3000);
