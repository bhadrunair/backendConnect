import { Express } from "express"
import { Request, Response } from "express"
import { createProductHandler, deleteProductHandler, getProductHandler, updateProductHandler } from "./controller/product.controller";
import { createSessionHandler, findSessionHandler, updateSessionHandler } from "./controller/session.controller";
import createUserHandler, { getUserHandler } from "./controller/user.controller";
import requireUser from "./middleware/requireUser";
import validateResources from "./middleware/validateResources";
import { productCreateSchema, productDeleteSchema, productGetSchema, productUpdateSchema } from "./schema/product.schema";
import sessionSchema from "./schema/session.schema";
import userSchema from "./schema/user.schema";

const routes = async(app: Express) => {

    app.route('/api/v1/healthcheck').get((req: Request, res: Response) => {

        return res.status(200).send('This check is working');
    });

    app.route('/api/v1/user').post(validateResources(userSchema), createUserHandler);
    app.route('/api/v1/user').get(requireUser, getUserHandler);

    app.route('/api/v1/session').post(validateResources(sessionSchema), createSessionHandler)
    .get(requireUser, findSessionHandler);
    app.route('/api/v1/session').patch(requireUser, updateSessionHandler);

    app.route('/api/v1/product').post([validateResources(productCreateSchema), requireUser], createProductHandler);
    app.route('/api/v1/product/:productId').get(validateResources(productGetSchema), getProductHandler);
    app.route('/api/v1/product/:productId').patch([validateResources(productUpdateSchema), requireUser], updateProductHandler);
    app.route('/api/v1/product/:productId').delete([validateResources(productDeleteSchema), requireUser], deleteProductHandler);

}

export default routes;