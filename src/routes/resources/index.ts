import { Express } from 'express';

export const registerResourceRoutes = (app: Express) => {
  app.use(/^(?!(\/api|\/public))/, (req, res) => { res.render('index'); });
};
