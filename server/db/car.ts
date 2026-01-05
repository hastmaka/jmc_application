import { DataTypes, Model, Sequelize, ModelStatic } from 'sequelize';

export default function (sequelize: Sequelize): ModelStatic<Model> {
    const Model = sequelize.define('car', {
        car_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        car_make: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        car_model: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        car_year: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        car_vin: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        car_plate: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        car_color: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        car_capacity: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        car_status: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'asset_options',
                key: 'asset_option_id'
            }
        },
        car_type: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'asset_options',
                key: 'asset_option_id'
            }
        },
        car_note: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        car_inspection_date: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        car_registration_expiration: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        car_insurance_expiration: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },

        // ==============================
        // Service & mileage tracking
        // ==============================

        car_odometer_current: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Last known odometer reading'
        },
        car_service_last_odometer: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Odometer at last completed service'
        },
        car_maintenance_interval_miles: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Miles between maintenance (vehicle specific)'
        },
        car_service_next_odometer: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Next service due at this odometer'
        },
        car_service_next_due_date: {
            type: DataTypes.DATEONLY,
            allowNull: true,
            comment: 'Next service due date (time-based maintenance)'
        },
        car_service_notes: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Maintenance notes or special instructions'
        },
        car_owner_percentage: {
            type: DataTypes.DECIMAL(3, 2),
            allowNull: true,
            defaultValue: 1.00,
            comment: 'Owner earns this percentage (0.60 = 60%)'
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
        car_name: {
            type: DataTypes.VIRTUAL,
            get() {
                const make = this.get('car_make'),
                    model = this.get('car_model'),
                    plate = this.get('car_plate'),
                    rawYear = this.get('car_year'),
                    year = typeof rawYear === "string" ? rawYear.substring(0, 4) : "";
                return `${make} ${model} ${year} (${plate})`;
            }
        }
    }, {
        tableName: 'cars',
        underscored: true,
        timestamps: true,
        paranoid: true,
        deletedAt: 'deleted_at',
        updatedAt: 'updated_at',
        createdAt: 'created_at',
    });

    (Model as ModelStatic<any> & { associate?: (models: any) => void }).associate =
        function ({ asset_option, document }: any) {
            Model.belongsTo(asset_option, {
                as: 'car_status_option',
                foreignKey: 'car_status',
                onDelete: "NO ACTION",
                onUpdate: "NO ACTION"
            });
            Model.belongsTo(asset_option, {
                as: 'car_type_option',
                foreignKey: 'car_type',
                onDelete: "NO ACTION",
                onUpdate: "NO ACTION"
            });
            Model.hasMany(document, {
                as: 'car_document',
                foreignKey: 'car_car_id',
                onDelete: "NO ACTION",
                onUpdate: "NO ACTION"
            });
        };

    return Model
}