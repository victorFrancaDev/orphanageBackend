import { Router } from 'express';
import OrphanagesControllers from "./controllers/orphanagesControllers";

const routes = Router();

routes.get('/orphanages/:id', OrphanagesControllers.show);
routes.get('/orphanages', OrphanagesControllers.index);
routes.post('/orphanages/create', OrphanagesControllers.create);

export default routes;