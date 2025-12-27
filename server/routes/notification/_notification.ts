import {Request, Response} from 'express';
import {handleDataToReturn, handleError} from "../../utils/index.ts";
import Notification from "../../classes/Notification.ts";

export const _notification = {
    list: async function(req: Request, res: Response){
        try {
            let query = {
                where: {
                    notification_status: 24
                }
            }
            const notification = await Notification.listNotification('findAndCountAll', query)
            res.json(await handleDataToReturn(notification, req?.authUser?.auth));
        } catch (e: any) {
            handleError(res, e.message);
        }
    },
    listQuantity: async function(req: Request, res: Response){},
    update: async function(req: Request, res: Response){},
    delete: async function(req: Request, res: Response){},
}