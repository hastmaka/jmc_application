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

        // Break Log (JSON array)
        inspection_breaks: {
            type: DataTypes.JSON,
            allowNull: true,
            comment: '[{start: "10:30", end: "11:00"}, ...]'
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
                fields: ['employee_employee_id', 'inspection_date'],
                where: { deleted_at: null }
            }
        ]
    });

    (Model as ModelStatic<any> & { associate?: (models: any) => void }).associate =
        function ({ employee, inspection_vehicle }: any) {
            Model.belongsTo(employee, {
                as: 'inspection_employee',
                foreignKey: 'employee_employee_id',
                onDelete: "NO ACTION",
                onUpdate: "NO ACTION"
            });
            Model.hasMany(inspection_vehicle, {
                as: 'inspection_vehicles',
                foreignKey: 'inspection_inspection_id',
                onDelete: "CASCADE",
                onUpdate: "CASCADE"
            });
        };

    return Model;
}
