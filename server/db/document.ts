import { DataTypes, Sequelize, ModelStatic } from 'sequelize';

export default function (sequelize: Sequelize): ModelStatic<any> {
    const Model  = sequelize.define('document', {
        document_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        document_primary: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'asset_options',
                key: 'asset_option_id',
            }
        },
        document_name: {
            type: DataTypes.STRING(150),
            allowNull: true,
        },
        document_type: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'asset_options',
                key: 'asset_option_id',
            }
        },
        document_url: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        document_description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        document_expiration: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        uploaded_by: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },

        car_car_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'cars',
                key: 'car_id',
            }
        },
        employee_employee_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'employees',
                key: 'employee_id',
            }
        }
    }, {
        tableName: 'documents',
        underscored: true,
        timestamps: true,
        paranoid: true,
        deletedAt: 'deleted_at',
        updatedAt: 'updated_at',
        createdAt: 'created_at',
    });

    (Model as ModelStatic<any> & { associate?: (models: any) => void }).associate =
        function ({ car, employee, asset_option}: any) {
            Model.belongsTo(car, {
                foreignKey: 'car_car_id',
                onDelete: 'NO ACTION',
                onUpdate: 'NO ACTION'
            });
            Model.belongsTo(employee, {
                foreignKey: 'employee_employee_id',
                onDelete: 'NO ACTION',
                onUpdate: 'NO ACTION'
            });
            Model.belongsTo(asset_option, {
                as: 'document_primary_option',
                foreignKey: 'document_primary',
                onDelete: "NO ACTION",
                onUpdate: "NO ACTION"
            });
            Model.belongsTo(asset_option, {
                as: 'document_type_option',
                foreignKey: 'document_type',
                onDelete: "NO ACTION",
                onUpdate: "NO ACTION"
            });
        };

    return Model;
}
