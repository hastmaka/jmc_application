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
    },

    /**
     * GET /v1/reservation/summary?month=2026-01
     * Returns monthly aggregated reservation data
     */
    listReservationSummary: async (req: Request, res: Response) => {
        try {
            const { month, excludeToday } = req.query;

            if (!month || typeof month !== 'string') {
                return handleError(res, new Error('month parameter required (YYYY-MM format)'));
            }

            // Parse month to get date range
            const startDate = moment(month, 'YYYY-MM').startOf('month').format('YYYY-MM-DD');
            let endDate = moment(month, 'YYYY-MM').endOf('month');

            // Cap to yesterday when excludeToday=true (for PDF reports)
            if (excludeToday === 'true') {
                const yesterday = moment().subtract(1, 'day');
                endDate = moment.min(endDate, yesterday);
            }
            const endDateStr = endDate.format('YYYY-MM-DD');

            if (!moment(startDate).isValid()) {
                return handleError(res, new Error('Invalid month format. Use YYYY-MM'));
            }

            // Fetch all reservations for the month
            const reservations = await models.reservation.findAll({
                where: {
                    reservation_date: {
                        [Op.between]: [startDate, endDateStr]
                    }
                },
                include: [{
                    model: models.car,
                    as: 'reservation_car',
                    required: false
                }],
                order: [['reservation_date', 'ASC']]
            });

            // Status IDs: 5=Pending, 6=Confirmed, 7=Completed, 8=Cancelled
            const STATUS = { PENDING: 5, CONFIRMED: 6, COMPLETED: 7, CANCELLED: 8 };

            // Initialize aggregates
            const byStatus = {
                pending: { count: 0, total: 0 },
                confirmed: { count: 0, total: 0 },
                completed: { count: 0, total: 0 },
                cancelled: { count: 0, total: 0 }
            };

            const carStats: Record<number, { car_id: number, car_name: string, car_color: string, car_owner_percentage: number, count: number, total: number }> = {};
            const dailyStats: Record<string, { date: string, count: number, total: number }> = {};

            // Reservation breakdown totals (exclude cancelled)
            const breakdown = {
                base: 0,
                fuel: 0,
                mAndG: 0,
                airportFee: 0,
                tax: 0,
                tips: 0,
                total: 0
            };

            // Daily revenue breakdown (exclude cancelled)
            const dailyRevenue: Record<string, {
                date: string,
                base: number,
                fuel: number,
                mAndG: number,
                airportFee: number,
                tax: number,
                tips: number,
                total: number
            }> = {};

            let totalReservations = 0;

            for (const r of reservations) {
                const status = r.get('reservation_status') as number;
                const total = ((r.get('reservation_total') as number) || 0) / 100;
                const date = r.get('reservation_date') as string;
                const car = r.get('reservation_car') as any;

                // Get individual components
                const base = ((r.get('reservation_base') as number) || 0) / 100;
                const fuel = ((r.get('reservation_fuel') as number) || 0) / 100;
                const mAndG = ((r.get('reservation_m_and_g') as number) || 0) / 100;
                const airportFee = ((r.get('reservation_airport_fee') as number) || 0) / 100;
                const tax = ((r.get('reservation_tax') as number) || 0) / 100;
                const tips = ((r.get('reservation_tips') as number) || 0) / 100;
                const hour = (r.get('reservation_hour') as number) || 1;

                totalReservations++;

                // Aggregate by status
                switch (status) {
                    case STATUS.PENDING:
                        byStatus.pending.count++;
                        byStatus.pending.total += total;
                        break;
                    case STATUS.CONFIRMED:
                        byStatus.confirmed.count++;
                        byStatus.confirmed.total += total;
                        break;
                    case STATUS.COMPLETED:
                        byStatus.completed.count++;
                        byStatus.completed.total += total;
                        break;
                    case STATUS.CANCELLED:
                        byStatus.cancelled.count++;
                        break;
                }

                // Aggregate breakdown (exclude cancelled)
                if (status !== STATUS.CANCELLED) {
                    const baseTotal = base * hour;
                    const fuelTotal = fuel * hour;

                    breakdown.base += baseTotal;
                    breakdown.fuel += fuelTotal;
                    breakdown.mAndG += mAndG;
                    breakdown.airportFee += airportFee;
                    breakdown.tax += tax;
                    breakdown.tips += tips;
                    breakdown.total += total;

                    // Daily revenue breakdown
                    if (!dailyRevenue[date]) {
                        dailyRevenue[date] = {
                            date,
                            base: 0,
                            fuel: 0,
                            mAndG: 0,
                            airportFee: 0,
                            tax: 0,
                            tips: 0,
                            total: 0
                        };
                    }
                    dailyRevenue[date].base += baseTotal;
                    dailyRevenue[date].fuel += fuelTotal;
                    dailyRevenue[date].mAndG += mAndG;
                    dailyRevenue[date].airportFee += airportFee;
                    dailyRevenue[date].tax += tax;
                    dailyRevenue[date].tips += tips;
                    dailyRevenue[date].total += total;
                }

                // Aggregate by car (exclude cancelled)
                if (car && status !== STATUS.CANCELLED) {
                    const carId = car.car_id;
                    if (!carStats[carId]) {
                        carStats[carId] = {
                            car_id: carId,
                            car_name: car.car_name || 'Unknown',
                            car_color: car.car_color || '#888888',
                            car_owner_percentage: parseFloat(car.car_owner_percentage) || 1,
                            count: 0,
                            total: 0
                        };
                    }
                    carStats[carId].count++;
                    carStats[carId].total += total;
                }

                // Aggregate by day (exclude cancelled)
                if (status !== STATUS.CANCELLED) {
                    if (!dailyStats[date]) {
                        dailyStats[date] = { date, count: 0, total: 0 };
                    }
                    dailyStats[date].count++;
                    dailyStats[date].total += total;
                }
            }

            // Calculate earnings
            const completedTotal = byStatus.completed.total;
            const potentialTotal = byStatus.pending.total + byStatus.confirmed.total + byStatus.completed.total;
            const nonCancelledCount = byStatus.pending.count + byStatus.confirmed.count + byStatus.completed.count;
            const avgPerReservation = nonCancelledCount > 0 ? potentialTotal / nonCancelledCount : 0;

            // Sort all cars by count and calculate owner shares
            const topCars = Object.values(carStats)
                .sort((a, b) => b.count - a.count)
                .map(car => ({
                    ...car,
                    ownerShare: Math.round(car.total * car.car_owner_percentage * 100) / 100
                }));

            // Calculate owner's total earnings across all cars
            const ownerTotal = topCars.reduce((sum, car) => sum + car.ownerShare, 0);

            // Build daily breakdown (fill missing days with zeros)
            const dailyBreakdown = [];
            const current = moment(startDate);
            const end = moment(endDateStr);
            while (current.isSameOrBefore(end)) {
                const dateStr = current.format('YYYY-MM-DD');
                dailyBreakdown.push(dailyStats[dateStr] || { date: dateStr, count: 0, total: 0 });
                current.add(1, 'day');
            }

            // Build daily revenue breakdown (only days with data, sorted by date)
            const dailyRevenueBreakdown = Object.values(dailyRevenue)
                .sort((a, b) => a.date.localeCompare(b.date))
                .map(d => ({
                    date: d.date,
                    base: Math.round(d.base * 100) / 100,
                    fuel: Math.round(d.fuel * 100) / 100,
                    mAndG: Math.round(d.mAndG * 100) / 100,
                    airportFee: Math.round(d.airportFee * 100) / 100,
                    tax: Math.round(d.tax * 100) / 100,
                    tips: Math.round(d.tips * 100) / 100,
                    total: Math.round(d.total * 100) / 100
                }));

            const summary = {
                month,
                totalReservations,
                byStatus,
                earnings: {
                    completed: Math.round(completedTotal * 100) / 100,
                    potential: Math.round(potentialTotal * 100) / 100,
                    avgPerReservation: Math.round(avgPerReservation * 100) / 100
                },
                breakdown: {
                    base: Math.round(breakdown.base * 100) / 100,
                    fuel: Math.round(breakdown.fuel * 100) / 100,
                    mAndG: Math.round(breakdown.mAndG * 100) / 100,
                    airportFee: Math.round(breakdown.airportFee * 100) / 100,
                    tax: Math.round(breakdown.tax * 100) / 100,
                    tips: Math.round(breakdown.tips * 100) / 100,
                    total: Math.round(breakdown.total * 100) / 100
                },
                dailyRevenueBreakdown,
                topCars,
                ownerTotal: Math.round(ownerTotal * 100) / 100,
                dailyBreakdown
            };

            res.json(await handleDataToReturn(summary, req?.authUser?.auth));
        } catch (e: any) {
            handleError(res, e);
        }
    }
}