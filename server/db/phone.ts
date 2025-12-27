import { Sequelize, DataTypes, ModelStatic } from 'sequelize';

export default function (sequelize: Sequelize, { INTEGER, BOOLEAN, STRING, TEXT }: typeof DataTypes): ModelStatic<any> {
    const Model = sequelize.define('phone', {
        phone_id: {
            type: INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        phone_type: {
            type: INTEGER,
            comment: 'MOBILE, HOME, ETC',
        },
        phone_number: {
            type: STRING(20),
        },
        phone_comment: {
            type: TEXT('long'),
        },
        phone_primary: {
            type: BOOLEAN,
            defaultValue: true,
        },
        created_at: {
            type: 'TIMESTAMP',
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false,
        },
        updated_at: {
            type: 'TIMESTAMP',
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false,
        },
        deleted_at: {
            type: 'TIMESTAMP',
            allowNull: true,
        },
    }, {
        underscored: true,
        timestamps: true,
        paranoid: true,
        deletedAt: 'deleted_at',
        updatedAt: 'updated_at',
        createdAt: 'created_at',
        // hooks: {
        //     afterCreate: async (instance: any, options: any) => {
        //         const Log = require('../../classes/Log');
        //         await Log.post(Log.handleValues(instance, options, 'phone'), options.transaction);
        //     },
        //     afterUpdate: async (instance: any, options: any) => {
        //         const Log = require('../../classes/Log');
        //         await Log.post(Log.handleValues(instance, options, 'phone'), options.transaction);
        //     },
        // }
    });

    (Model as ModelStatic<any> & { associate?: (models: any) => void }).associate = function ({ client, employee, user }: any) {
        Model.belongsTo(client, {foreignKey: 'client_client_id', onDelete: "NO ACTION", onUpdate: "NO ACTION"});
        Model.belongsTo(employee, {foreignKey: 'employee_employee_id', onDelete: "NO ACTION", onUpdate: "NO ACTION"});
        Model.belongsTo(user, {foreignKey: 'user_user_id', onDelete: "NO ACTION", onUpdate: "NO ACTION"});
    };

    return Model;
}