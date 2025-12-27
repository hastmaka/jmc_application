import Ez from "./Ez.ts";
import {Op, Transaction} from "sequelize";
import models from '../db/index.ts'
import {verifyIdToken} from "../utils/firebase/firebase.ts";
import {encodeDecode, expiresIn, isExpired, throwError} from "../utils/index.ts";
import jwt from 'jwt-simple'

class User extends Ez {
    constructor(data: any, user: any = {}) {
        super(data,  models.user, user);
    }

    static async listUser(method: string, options: Record<string, any> = {}) {
        const instance = new User({});
        return await instance.list(method, options);
    }

    static async listByPk(id: number, options: Record<string, any> = {}) {
        const instance = new User({});
        return await instance.listByPk(id, options);
    }

    static async createUser(transaction: Transaction, data: any) {
        const instance = new User(data);
        return await instance.create(transaction);
    }

    static async updateUser(transaction: Transaction | undefined, record: Record<string, any>, options: any, user?: any) {
        const instance = new User(record, user);
        return await instance.update(transaction, options);
    }

    static async updateUserFactory(transaction: Transaction | undefined, record: Record<string, any>, user: any) {
        let options = {
            where: {
                user_id: {
                    [Op.eq]: record.user_id
                }
            }
        };

        return await User.updateUser(transaction, record, options, user);
    }

    static async manageToken(encryptedData: string, ip: string = '') {
        let user_uid, dbUser, decodedUser, isEzToken = false;
        const token = await encodeDecode(encryptedData, 'decode');

        try {
            decodedUser = jwt.decode(token, process.env.SIMPLE_CRYPTO_SECRET as string);
            user_uid = decodedUser.user.user_uid;
            isEzToken = true;
        } catch (e) {
            console.log('Token is not from Ez Server, will verify with Firebase');
        }

        if (!isEzToken) {
            try {
                const { uid } = await verifyIdToken(token) as Record<string, any>;

                if (!uid) {
                    throwError('Unauthorized, user not found in Firebase');
                }

                const options = {
                    where: {
                        user_uid: {
                            [Op.eq]: uid,
                        },
                    },
                };

                dbUser = await User.listUser('findOne', options);

                if (!dbUser) {
                    throwError('Unauthorized, user not found');
                }

                user_uid = uid;
            } catch (e: any) {
                throw new Error(e.message);
            }
        } else {
            const options = {
                where: {
                    user_uid: {
                        [Op.eq]: user_uid,
                    },
                },
            };

            dbUser = await User.listUser('findOne', options);

            if (!dbUser) {
                throwError('Unauthorized, user not found');
            }

            if (ip !== decodedUser.ip) {
                throwError('Unauthorized, Client ip changed was detected, log in again');
            }

            if (!isExpired(decodedUser.exp)) {
                return {
                    user_uid,
                    user: dbUser.dataValues,
                    token: prepareToken(dbUser.dataValues, ip),
                };
            }

            throwError('Unauthorized, token is expired');
        }

        return {
            user_uid,
            user: dbUser.dataValues,
            token: prepareToken(dbUser.dataValues, ip),
        };
    }
}

function prepareToken(user: Record<string, any>, ip: string | number) {
    const expires = expiresIn(1, 'hours')
    // console.log(response);
    return jwt.encode({
        exp: expires,
        ip,
        user,
    }, process.env.SIMPLE_CRYPTO_SECRET!)
}

export default User;