import {Request, Response} from 'express';
import {handleDataToReturn, handleError, manageFilter, throwError, logger} from "../../utils/index.ts";
import models from '../../db/index.ts';
import {Op, Transaction} from "sequelize";
import Reservation from "../../classes/Reservation.ts";
import moment from "moment";
import Asset from "../../classes/Asset.ts";

export const _reservation = {
    listReservation: async (req: Request, res: Response) => {
        try {
            const _query = manageFilter(req.query, models.reservation);

            const query = {
                ..._query,
                order: [
                    ['reservation_date', 'ASC'],
                    [{ model: models.car, as: 'reservation_car' }, 'car_plate', 'ASC'],
                    ['reservation_time', 'ASC'],
                ],
                include: [{
                    model: models.asset_option, as: 'reservation_status_option', required: false
                }, {
                    model: models.asset_option, as: 'reservation_source_option', required: false
                }, {
                    model: models.car, as: 'reservation_car', required: false
                }]
            };

            const reservation = await Reservation.listReservation('findAndCountAll', query)
            res.json(await handleDataToReturn(reservation, req?.authUser?.auth));
        } catch (e: any) {
            handleError(res, e);
        }
    },
    listReservationByPk: async (req: Request, res: Response) => {
        const {reservation_id} = req.params

        try {
            const query = {
                include: [{
                    model: models.asset_option, as: 'reservation_status_option', required: false
                }, {
                    model: models.asset_option, as: 'reservation_source_option', required: false
                },{
                    model: models.asset_option, as: 'reservation_service_type_option', required: false
                }, {
                    model: models.car, as: 'reservation_car', required: false
                }]
            }
            const reservation = await Reservation.listReservationByPk(+reservation_id, query)
            res.json(await handleDataToReturn(reservation, req?.authUser?.auth));
        } catch (e: any) {
            handleError(res, e);
        }
    },
    createReservation: async (req: Request, res: Response) => {
            let data = req.body;
            let transaction: Transaction | undefined;

            try {
                transaction = await models.sequelize!.transaction();

                /* --------------------------------------------------
                   1) Normalize & validate date
                -------------------------------------------------- */
                const dateOnly = moment(data.reservation_date).format('YYYY-MM-DD');
                if (!dateOnly || dateOnly === 'Invalid date') {
                    // throw new Error('Invalid reservation_date');
                    throwError('Invalid reservation_date')
                }

                /* --------------------------------------------------
                   2) Lock last reservation of the same day
                -------------------------------------------------- */
                const lastRow = await models.reservation.findOne({
                    where: {
                        reservation_date: dateOnly,
                        deleted_at: null, // paranoid
                    },
                    order: [['reservation_daily_index', 'DESC']],
                    transaction,
                    lock: transaction.LOCK.UPDATE,
                });

                /* --------------------------------------------------
                   3) Compute next daily index (STARTS AT 1)
                -------------------------------------------------- */
                const lastIndex = lastRow?.reservation_daily_index ?? 0;
                const nextIndex = lastIndex + 1;

                if (nextIndex > 999) {
                    throwError(`Daily reservation limit reached for ${dateOnly}`);
                }

                /* --------------------------------------------------
                   4) Build charter order (DDD + MMDDYYYY)
                -------------------------------------------------- */
                const dailyPart = String(nextIndex).padStart(3, '0');
                const datePart = moment(dateOnly).format('MMDDYYYY');

                data = {
                    ...data,
                    reservation_date: dateOnly,
                    reservation_daily_index: nextIndex,
                    reservation_charter_order: `${dailyPart}${datePart}`,
                };

                /* --------------------------------------------------
                   5) Create reservation (Policy A)
                -------------------------------------------------- */
                const reservation = await Reservation.createReservationFactory(transaction, data, req.authUser);

                await transaction.commit();

                logger.audit('CREATE', {
                    resource: 'reservation',
                    resourceId: reservation?.get('reservation_id'),
                    userId: req.authUser?.user_id
                });

                res.json(await handleDataToReturn({}, req?.authUser?.auth));

            } catch (e: any) {
                if (transaction) await transaction.rollback();
                handleError(res, e);
            }
        },
    // backfillReservation: async (req: Request, res: Response) => {
    //     let transaction: Transaction | undefined;
    //
    //     try {
    //         transaction = await models.sequelize!.transaction();
    //
    //         // Optional: allow ?onlyEmpty=true (default true)
    //         const onlyEmpty = req.query?.onlyEmpty !== 'false';
    //
    //         const where: any = { deleted_at: null };
    //
    //         if (onlyEmpty) {
    //             where[Op.or] = [
    //                 { reservation_daily_index: null },
    //                 { reservation_charter_order: null },
    //             ];
    //         }
    //
    //         const rows = await models.reservation.findAll({
    //             where,
    //             attributes: ['reservation_id', 'reservation_date', 'reservation_time'],
    //             order: [
    //                 ['reservation_date', 'ASC'],
    //                 ['reservation_time', 'ASC'],
    //                 ['reservation_id', 'ASC'],
    //             ],
    //             transaction,
    //             lock: transaction.LOCK.UPDATE,
    //         });
    //
    //         if (!rows.length) {
    //             await transaction.commit();
    //             return res.json(await handleDataToReturn({ updated: 0, days: 0 }, req?.authUser?.auth));
    //         }
    //
    //         // Group by date
    //         const byDate: Record<string, any[]> = {};
    //         for (const r of rows) {
    //             const dateOnly = moment(r.reservation_date).format('YYYY-MM-DD');
    //             if (!dateOnly || dateOnly === 'Invalid date') {
    //                 throwError(`Invalid reservation_date for reservation_id=${r.reservation_id}`);
    //             }
    //             byDate[dateOnly] ||= [];
    //             byDate[dateOnly].push(r);
    //         }
    //
    //         let updated = 0;
    //         const days = Object.keys(byDate).length;
    //
    //         for (const dateOnly of Object.keys(byDate)) {
    //             const list = byDate[dateOnly];
    //
    //             for (let i = 0; i < list.length; i++) {
    //                 const reservation_daily_index = i + 1; // ✅ starts at 1
    //                 if (reservation_daily_index > 999) {
    //                     throwError(`Daily reservation limit reached while backfilling for ${dateOnly}`);
    //                 }
    //
    //                 const dailyPart = String(reservation_daily_index).padStart(3, '0');
    //                 const datePart = moment(dateOnly).format('MMDDYYYY');
    //                 const reservation_charter_order = `${dailyPart}${datePart}`;
    //
    //                 await models.reservation.update(
    //                     { reservation_daily_index, reservation_charter_order },
    //                     { where: { reservation_id: list[i].reservation_id }, transaction }
    //                 );
    //
    //                 updated++;
    //             }
    //         }
    //
    //         await transaction.commit();
    //
    //         res.json(await handleDataToReturn({ updated, days }, req?.authUser?.auth));
    //
    //     } catch (e: any) {
    //         if (transaction) await transaction.rollback();
    //         console.log(e.message);
    //         handleError(res, e);
    //     }
    // },
    updateReservation: async (req: Request, res: Response) => {
        let data = req.body;
        let transaction: Transaction | undefined;
        try {
            transaction = await models.sequelize!.transaction();

            await Reservation.updateReservationFactory(transaction, data, req.authUser);

            await transaction.commit();

            logger.audit('UPDATE', {
                resource: 'reservation',
                resourceId: data.reservation_id,
                userId: req.authUser?.user_id
            });

            res.json(await handleDataToReturn({}, req?.authUser?.auth));
        } catch (e: any) {
            if (transaction) {
                await transaction.rollback();
            }
            handleError(res, e)
        }
    },
    deleteReservation: async (req: Request, res: Response) => {
        const {reservation_id} = req.params;
        let transaction: Transaction | undefined;
        try {
            transaction = await models.sequelize!.transaction();
            await Reservation.deleteReservation(transaction, +reservation_id, req.authUser);

            await transaction.commit();

            logger.audit('DELETE', {
                resource: 'reservation',
                resourceId: +reservation_id,
                userId: req.authUser?.user_id
            });

            res.json(await handleDataToReturn({}, req?.authUser?.auth));
        } catch (e: any) {
            if (transaction) {
                await transaction.rollback();
            }
            handleError(res, e)
        }
    },
    checkAvailability: async (req: Request, res: Response) => {
        debugger
    }
}