import {DataTypes, ModelStatic, Sequelize} from 'sequelize';

export default function (sequelize: Sequelize, dataTypes: typeof DataTypes): ModelStatic<any> {
    const Model = sequelize.define('user', {
        user_id: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        user_first_name: dataTypes.STRING (25),
        user_last_name: dataTypes.STRING (25),
        user_email: dataTypes.STRING (25),
        user_uid: dataTypes.STRING (50),
        user_active: dataTypes.TINYINT,
        user_type: dataTypes.TINYINT,
        user_credit: dataTypes.INTEGER,
        user_last_ip: dataTypes.STRING(255),
        user_is_first_time_logging_in: dataTypes.TINYINT,
        user_verified: dataTypes.TINYINT,
        user_last_login_device: dataTypes.JSON,
        user_preference: dataTypes.JSON,
        created_at: {
            type: 'TIMESTAMP',
            defaultValue: sequelize.literal ('CURRENT_TIMESTAMP'),
            allowNull: false
        },
        updated_at: {
            type: 'TIMESTAMP',
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false
        },
        user_full_name: {
            type: dataTypes.VIRTUAL,
            get() {
                return `${this.get('user_first_name')} ${this.get('user_last_name')}`
            },
        },
    }, {
        tableName: 'users',
        underscored: true,
        timestamps: true,
        paranoid: true,
        deletedAt: 'deleted_at',
        updatedAt: 'updated_at',
        createdAt: 'created_at',
    });

    (Model as ModelStatic<any> & { associate?: (models: any) => void }).associate =
        function ({ notification, employee, phone }: any) {
            Model.hasOne(employee, {
                as: 'employee',
                foreignKey: 'user_user_id',
                onDelete: "NO ACTION",
                onUpdate: "NO ACTION"
            });
            Model.hasMany(phone, {
                foreignKey: 'user_user_id',
                onDelete: "NO ACTION",
                onUpdate: "NO ACTION"
            });
            Model.hasMany(notification, {
                foreignKey: 'user_user_id',
                onDelete: "NO ACTION",
                onUpdate: "NO ACTION"
            });
        };

    return Model;
}