import {DataTypes, Model, Sequelize, ModelStatic} from 'sequelize';

export default function (sequelize: Sequelize): ModelStatic<Model> {
    const Model = sequelize.define('reservation', {
        reservation_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        reservation_passenger_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        car_car_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'cars',
                key: 'car_id',
            }
        },
        reservation_source: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'asset_options',
                key: 'asset_option_id'
            }
        },
        reservation_email: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        reservation_phone: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        reservation_date: {
            type: DataTypes.DATEONLY,  // Stores only YYYY-MM-DD
            allowNull: false,
        },
        reservation_time: {
            type: DataTypes.TIME,      // Stores only HH:mm:ss
            allowNull: true,
        },

        // ✅ NEW (internal counter per day)
        reservation_daily_index: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: '0..999 per day (generated server-side)',
        },

        // ✅ NEW (public printable ID)
        reservation_charter_order: {
            type: DataTypes.CHAR(11),
            allowNull: true,
            comment: 'IMMUTABLE: DDD + MMDDYYYY (example: 00309152025)',
        },

        reservation_pickup_location: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },
        reservation_airline: {
            type: DataTypes.STRING(150),
            allowNull: true,
        },
        reservation_service_type: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'asset_options',
                key: 'asset_option_id'
            },
        },
        reservation_fly_info: {
            type: DataTypes.STRING(150),
            allowNull: true,
        },
        reservation_dropoff_location: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },
        reservation_hour: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            comment: 'How many hours the reservation is gonna be',
        },
        reservation_passengers: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        reservation_base: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        reservation_m_and_g: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Meet and Greet'
        },
        reservation_fuel: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        reservation_airport_fee: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        reservation_total: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        reservation_real_value: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        reservation_tax: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        reservation_tips: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        reservation_status: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'asset_options',
                key: 'asset_option_id'
            }
        },
        reservation_sign: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        reservation_stop: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        reservation_special_instructions: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        reservation_email_proposal_sent_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        reservation_email_itinerary_sent_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        reservation_email_hook_sent_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        reservation_itinerary: {
            type: DataTypes.JSON,
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
        tableName: 'reservations',
        underscored: true,
        timestamps: true,
        paranoid: true,
        deletedAt: 'deleted_at',
        updatedAt: 'updated_at',
        createdAt: 'created_at',
    });

    (Model as ModelStatic<any> & { associate?: (models: any) => void }).associate =
        function ({car, asset_option}: any) {
            Model.belongsTo(car, {
                as: 'reservation_car',
                foreignKey: 'car_car_id',
                onDelete: "NO ACTION",
                onUpdate: "NO ACTION"
            });
            Model.belongsTo(asset_option, {
                as: 'reservation_status_option',
                foreignKey: 'reservation_status',
                onDelete: "NO ACTION",
                onUpdate: "NO ACTION"
            });
            Model.belongsTo(asset_option, {
                as: 'reservation_source_option',
                foreignKey: 'reservation_source',
                onDelete: "NO ACTION",
                onUpdate: "NO ACTION"
            });
            Model.belongsTo(asset_option, {
                as: 'reservation_service_type_option',
                foreignKey: 'reservation_service_type',
                onDelete: "NO ACTION",
                onUpdate: "NO ACTION"
            });
        };

    return Model;
}