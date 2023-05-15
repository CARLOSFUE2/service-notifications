import express from "express";
import notificationsRouter from "./notifications";

function createRouter(app) {
  app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Headers', "X-Requested-With")
    next();
  });
  const router = express.Router();
  app.use('/api/v1', router);
  router.use('/notifications', notificationsRouter);
}


module.exports = createRouter;
