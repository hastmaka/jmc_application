import {DataTypes, ModelStatic, Sequelize} from 'sequelize';

export default function (sequelize: Sequelize): ModelStatic<any> {
    const Model = sequelize.define('employee', {
        employee_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        employee_first_name: {
            type: DataTypes.STRING(25),
            allowNull: false
        },
        employee_middle_name: DataTypes.STRING(25),
        employee_last_name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        employee_email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            comment: 'Employee email is only for contact purpose'
        },
        employee_certification: DataTypes.STRING(100),
        employee_driver_license: DataTypes.STRING(20),
        employee_note: DataTypes.TEXT('long'),
        employee_hire_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        employee_termination_date: DataTypes.DATEONLY,
        employee_role: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'asset_options',
                key: 'asset_option_id'
            }
        },

        phone_phone_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'phones',
                key: 'phone_id'
            }
        },
        address_address_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'addresses',
                key: 'address_id'
            }
        },
        user_user_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            unique: true,
            references: {
                model: 'users',
                key: 'user_id'
            }
        },

        // temp fields
        // employee_phone: DataTypes.STRING(10),
        // employee_address: DataTypes.STRING(255),

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
        employee_full_name: {
            type: DataTypes.VIRTUAL,
            get() {
                return `${this.get('employee_first_name')} ${this.get('employee_last_name')}`
            },
        },
    }, {
        underscored: true,
        timestamps: true,
        paranoid: true,
        deletedAt: 'deleted_at',
        updatedAt: 'updated_at',
        createdAt: 'created_at',
    });

    (Model as ModelStatic<any> & { associate?: (models: any) => void }).associate =
        function ({ address, phone, user, document, asset_option }: any) {
            // Model.belongsTo(address, {
            //     as: 'employee_address',
            //     foreignKey: 'address_address_id',
            //     onDelete: "NO ACTION",
            //     onUpdate: "NO ACTION"
            // });
            // Model.belongsTo(phone, {
            //     as: 'employee_phone',
            //     foreignKey: 'phone_phone_id',
            //     onDelete: "NO ACTION",
            //     onUpdate: "NO ACTION"
            // });
            Model.belongsTo(user, {
                as: 'user',
                foreignKey: 'user_user_id',
                onDelete: "NO ACTION",
                onUpdate: "NO ACTION"
            });
            Model.hasMany(document, {
                as: 'employee_document',
                foreignKey: 'employee_employee_id',
                onDelete: "NO ACTION",
                onUpdate: "NO ACTION"
            });
            Model.belongsTo(asset_option, {
                as: 'employee_role_option',
                foreignKey: 'employee_role',
                onDelete: "NO ACTION",
                onUpdate: "NO ACTION"
            });
        };

    return Model;
}