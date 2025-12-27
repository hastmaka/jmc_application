import { DataTypes, Model, Sequelize, ModelStatic } from 'sequelize';

export default function (sequelize: Sequelize): ModelStatic<Model> {
    const Model = sequelize.define('inspection', {
        inspection_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        employee_employee_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'employees',
                key: 'employee_id'
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
        inspection_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },

        // Shift Info
        inspection_start_time: {
            type: DataTypes.TIME,
            allowNull: true,
        },
        inspection_end_time: {
            type: DataTypes.TIME,
            allowNull: true,
        },

        // Mileage
        inspection_odometer_start: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        inspection_odometer_end: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        inspection_total_miles: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        // Gas Log
        inspection_gas_gallons: {
            type: DataTypes.DECIMAL(10, 3),
            allowNull: true,
        },
        inspection_gas_cost: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },

        // Break Log (JSON array)
        inspection_breaks: {
            type: DataTypes.JSON,
            allowNull: true,
            comment: '[{start: "10:30", end: "11:00", initial: "JG"}, ...]'
        },

        // Audit
        inspection_notes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        inspection_signature: {
            type: DataTypes.TEXT,
            allowNull: true,
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
        tableName: 'inspections',
        underscored: true,
        timestamps: true,
        paranoid: true,
        deletedAt: 'deleted_at',
        updatedAt: 'updated_at',
        createdAt: 'created_at',
        indexes: [
            {
                unique: true,
                fields: ['employee_employee_id', 'car_car_id', 'inspection_date'],
                where: { deleted_at: null }
            }
        ]
    });

    (Model as ModelStatic<any> & { associate?: (models: any) => void }).associate =
        function ({ employee, car }: any) {
            Model.belongsTo(employee, {
                as: 'inspection_employee',
                foreignKey: 'employee_employee_id',
                onDelete: "NO ACTION",
                onUpdate: "NO ACTION"
            });
            Model.belongsTo(car, {
                as: 'inspection_car',
                foreignKey: 'car_car_id',
                onDelete: "NO ACTION",
                onUpdate: "NO ACTION"
            });
        };

    return Model;
}
