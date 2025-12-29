import { DataTypes, Model, Sequelize, ModelStatic } from 'sequelize';

export default function (sequelize: Sequelize): ModelStatic<Model> {
    const Model = sequelize.define('inspection_vehicle', {
        inspection_vehicle_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        inspection_inspection_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'inspections',
                key: 'inspection_id'
            }
        },
        car_car_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'cars',
                key: 'car_id'
            }
        },

        // Mileage
        inspection_vehicle_odometer_start: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        inspection_vehicle_odometer_end: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        // Gas Log
        inspection_vehicle_gas_gallons: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        inspection_vehicle_gas_cost: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        // Selected reservations for the report (JSON array of IDs)
        inspection_vehicle_reservation_ids: {
            type: DataTypes.JSON,
            allowNull: true,
            comment: '[1, 2, 3, ...] - reservation IDs included in report'
        },

        created_at: {
            type: 'TIMESTAMP',
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false
        },
        updated_at: {
            type: 'TIMESTAMP',
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false
        },
        deleted_at: {
            type: 'TIMESTAMP',
            allowNull: true
        },
    }, {
        tableName: 'inspection_vehicles',
        underscored: true,
        timestamps: true,
        paranoid: true,
        deletedAt: 'deleted_at',
        updatedAt: 'updated_at',
        createdAt: 'created_at',
        indexes: [
            {
                unique: true,
                fields: ['inspection_inspection_id', 'car_car_id'],
                where: { deleted_at: null }
            }
        ]
    });

    (Model as ModelStatic<any> & { associate?: (models: any) => void }).associate =
        function ({ inspection, car }: any) {
            Model.belongsTo(inspection, {
                as: 'vehicle_inspection',
                foreignKey: 'inspection_inspection_id',
                onDelete: "CASCADE",
                onUpdate: "CASCADE"
            });
            Model.belongsTo(car, {
                as: 'vehicle_car',
                foreignKey: 'car_car_id',
                onDelete: "NO ACTION",
                onUpdate: "NO ACTION"
            });
        };

    return Model;
}
