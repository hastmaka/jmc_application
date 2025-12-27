import {DataTypes, ModelStatic, Sequelize} from 'sequelize';

export default function (sequelize: Sequelize,  { INTEGER, STRING }: typeof DataTypes): ModelStatic<any> {
    const Model = sequelize.define('asset', {
        asset_id: {
            type: INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        asset_name: {
            type: STRING,
            allowNull: false
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
        underscored: true,
        timestamps: true,
        paranoid: true,
        deletedAt: 'deleted_at',
        updatedAt: 'updated_at',
        createdAt: 'created_at'
    });

    (Model as ModelStatic<any> & { associate?: (models: any) => void }).associate =
        function ({ asset_option }: any) {
            Model.hasMany(asset_option, {
                foreignKey: 'asset_asset_id',
                onDelete: "NO ACTION",
                onUpdate: "NO ACTION"
            });
        };

    return Model;
}