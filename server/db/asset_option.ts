import {DataTypes, ModelStatic, Sequelize} from 'sequelize';

export default function (sequelize: Sequelize, {INTEGER, STRING, BOOLEAN}: typeof DataTypes): ModelStatic<any> {
    const Model = sequelize.define('asset_option', {
        asset_option_id: {
            type: INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        asset_option_name: {
            type: STRING,
            allowNull: false
        },
        asset_option_active: {
            type: BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        asset_asset_id: {
            type: INTEGER,
            allowNull: false,
            references: {
                model: 'assets',
                key: 'asset_id'
            }
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
        }
    }, {
        tableName: 'asset_options',
        underscored: true,
        timestamps: true,
        paranoid: true,
        deletedAt: 'deleted_at',
        updatedAt: 'updated_at',
        createdAt: 'created_at',
    });

    (Model as ModelStatic<any> & { associate?: (models: any) => void }).associate =
        function ({asset, log}: any) {
            Model.belongsTo(asset, {
                foreignKey: 'asset_asset_id',
                onDelete: "NO ACTION",
                onUpdate: "NO ACTION"
            });
        };

    return Model;
}