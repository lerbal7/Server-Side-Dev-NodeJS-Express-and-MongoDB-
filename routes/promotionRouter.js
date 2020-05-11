const express = require('express');
const bodyParser = require('body-parser');

const promotionRouter = express.Router();

promotionRouter.use(bodyParser.json());

promotionRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res, next) => {
    res.end('Will send all promotions to you!');
})
.post((req, res, next) => {
    res.end('Will add the promotion ' + req.body.name + ' with details ' + req.body.description);
})
.put((req, res, next) => {
    res.end('PUT operation not supported on /promotions');
})
.delete((req, res, next) => {
    res.end('Deleting all the promotions!');
});

promotionRouter.route('/:promotionId')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res, next) => {
    res.end('Will send details of the promotion: ' + req.params.promotionId);
})
.post((req, res, next) => {
    res.end('POST operation not supported on /promotions/' + req.params.promotionId);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.write('Updating the promotion ' + req.params.promotionId);
    res.end('Will update the promotion: ' + req.body.name + ' with details: ' + req.body.description);
})
.delete((req, res, next) => {
    res.end('Deleting promotion ' + req.params.promotionId);
});

module.exports = promotionRouter;