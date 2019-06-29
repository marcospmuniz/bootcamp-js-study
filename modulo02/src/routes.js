import { Router } from 'express';

const routes = new Router();

routes.get('', (req, res) => res.json({ message: 'Hello from the other side!' }));

export default routes;
