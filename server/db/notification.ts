import {DataTypes, Model, Sequelize, ModelStatic} from 'sequelize';

export default function (sequelize: Sequelize): ModelStatic<Model> {
    const Model = sequelize.define('notification', {
        notification_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        user_user_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'users',
                key: 'user_id',
            }
        },
        notification_title: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        notification_type: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'asset_options',
                key: 'asset_option_id'
            }
        },
        notification_status: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'asset_options',
                key: 'asset_option_id'
            }
        },
        notification_message: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        notification_read_at: {
            type: DataTypes.DATE,
            allowNull: true
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
        tableName: 'notifications',
        underscored: true,
        timestamps: true,
        paranoid: true,
        deletedAt: 'deleted_at',
        updatedAt: 'updated_at',
        createdAt: 'created_at',
    });

    (Model as ModelStatic<any> & { associate?: (models: any) => void }).associate =
        function ({user, asset_option}: any) {
            Model.belongsTo(user, {
                foreignKey: 'user_user_id',
                onDelete: "NO ACTION",
                onUpdate: "NO ACTION"
            });
            Model.belongsTo(asset_option, {
                as: 'notification_type_option',
                foreignKey: 'notification_type',
                onDelete: "NO ACTION",
                onUpdate: "NO ACTION"
            });
            Model.belongsTo(asset_option, {
                as: 'notification_status_option',
                foreignKey: 'notification_status',
                onDelete: "NO ACTION",
                onUpdate: "NO ACTION"
            });
        };

    return Model
}