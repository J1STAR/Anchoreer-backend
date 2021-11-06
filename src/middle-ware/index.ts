import * as express from 'express'
import { CustomError } from '../error';

export const requestLogger = (req: express.Request, res: express.Response, next) => {
    console.log(`${new Date().toISOString()} [${req.method}] ${req.url} From: ${req.headers['x-forwarded-for'] || req.connection.remoteAddress}`);
    next();
}

export const errorHandler = function (err: CustomError, req: express.Request, res: express.Response, next) {
    console.log(err);
    res.status(err.status || 500).send(err || "Internal Server Error");
}