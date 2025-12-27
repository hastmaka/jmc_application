import {Request, Response} from "express";
import {Op, Transaction} from "sequelize";
import models from "../../db/index.ts";
import {handleDataToReturn, handleError, throwError} from "../../utils/index.js";
import User from "../../classes/User.ts";

export const _user = {
    async login(req: Request, res: Response) {
        const token = req.headers['x-access-token'];
        const transaction: Transaction = await models.sequelize!.transaction();

        try {
            const auth = await User.manageToken(token as string, req.ip);
            await User.updateUser(transaction, {user_last_ip: req.ip}, {where: {user_uid: auth.user_uid}})
            await transaction.commit();
            res.json(await handleDataToReturn({}, auth));
        } catch (e: any) {
            if (transaction) {
                await transaction.rollback();
            }
            throwError(e.message);
        }
    },

    async updateUser(req: Request, res: Response) {
        let data = req.body;
        let transaction: Transaction | undefined;
        try {
            transaction = await models.sequelize!.transaction();

            await User.updateUserFactory(transaction, data, req.authUser);

            await transaction.commit();

            res.json(await handleDataToReturn({}, req?.authUser?.auth));
        } catch (e: any) {
            if (transaction) {
                await transaction.rollback();
            }
            console.log(e.message);
            handleError(res, e)
        }
    },

    async updateUserPreference(req: Request, res: Response) {
        let transaction: Transaction | undefined;
        try {
            const { user_preference } = req.body;
            const user_id = req.authUser?.auth?.user?.user_id;

            if (!user_id) {
                return handleError(res, new Error('User not found'));
            }

            transaction = await models.sequelize!.transaction();

            // Fetch existing preference and merge with new values
            const existingUser = await User.listByPk(user_id, { attributes: ['user_preference'] });
            const existingRaw = existingUser?.user_preference;
            const existingPreference = typeof existingRaw === 'string'
                ? JSON.parse(existingRaw)
                : (existingRaw || {});
            const newPreference = typeof user_preference === 'string'
                ? JSON.parse(user_preference)
                : user_preference;

            const mergedPreference = {
                ...existingPreference,
                ...newPreference
            };

            await User.updateUser(transaction, { user_preference: JSON.stringify(mergedPreference) }, {
                where: { user_id: { [Op.eq]: user_id } }
            }, req.authUser);

            await transaction.commit();

            res.json(await handleDataToReturn({}, req?.authUser?.auth));
        } catch (e: any) {
            if (transaction) {
                await transaction.rollback();
            }
            console.log(e.message);
            handleError(res, e)
        }
    }
}