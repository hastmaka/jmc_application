import {DataTypes, ModelStatic, Sequelize} from 'sequelize';

export default function (sequelize: Sequelize,  { INTEGER, STRING, ENUM, DECIMAL, VIRTUAL }: typeof DataTypes): ModelStatic<any> {
    const Model = sequelize.define('address', {
        address_id: {
            type: INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        address_primary: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: 'asset_options',
                key: 'asset_option_id'
            }
        },
        address_type: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'asset_options',
                key: 'asset_option_id'
            }
        },
        address_street: {
            type: STRING(50),
            allowNull: false,
            comment: '123 Main St.'
        },
        address_apt: {
            type: STRING(25),
            allowNull: true
        },
        address_city: {
            type: STRING(25),
            allowNull: false,
            comment: 'Los Angeles'
        },
        address_zip: {
            type: STRING(25),
            allowNull: false,
            comment: '90001'
        },
        address_state: {
            type: STRING(25),
            allowNull: false,
            comment: 'CA'
        },
        address_country: {
            type: STRING(25),
            allowNull: false,
            comment: 'USA'
        },
        address_latitude: {
            type: DECIMAL(10, 7),
            allowNull: true
        },
        address_longitude: {
            type: DECIMAL(10, 7),
            allowNull: true
        },

        employee_employee_id: {
            type: INTEGER,
            allowNull: true,
            references: {
                model: 'employees',
                key: 'employee_id'
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
        },
        fullAddress: {
            type: VIRTUAL,
            get() {
                let fullAddress = `${this.get('address_street')},`

                if (this.get('address_apt')) {
                    fullAddress += ` ${this.get('address_apt')}`
                }

                fullAddress += ` ${this.get('address_city')}, ${this.get('address_state')}, ${this.get('address_zip')}, ${this.get('address_country')}`;
                return fullAddress;
            },
        },
    }, {
        underscored: true,
        timestamps: true,
        paranoid: true,
        deletedAt: 'deleted_at',
        updatedAt: 'updated_at',
        createdAt: 'created_at',
        // hooks: {
        //     afterCreate: async (instance, options) => {
        //         let Log = (require('../classes/Log')).default;
        //
        //         await Log.post(Log.handleValues(instance, options, 'address'), options.transaction);
        //     },
        //     afterUpdate: async (instance, options) => {
        //         let Log = (require('../classes/Log')).default;
        //
        //         await Log.post(Log.handleValues(instance, options, 'address'), options.transaction);
        //     },
        // }
    });

    (Model as ModelStatic<any> & { associate?: (models: any) => void }).associate =
        function ({ employee, asset_option }: any) {
            Model.belongsTo(employee, {
                foreignKey: 'employee_employee_id',
                onDelete: "NO ACTION",
                onUpdate: "NO ACTION"
            });
            Model.belongsTo(asset_option, {
                as: 'address_primary_option',
                foreignKey: 'address_primary',
                onDelete: "NO ACTION",
                onUpdate: "NO ACTION"
            });
            Model.belongsTo(asset_option, {
                as: 'address_type_option',
                foreignKey: 'address_type',
                onDelete: "NO ACTION",
                onUpdate: "NO ACTION"
            });
        };

    return Model;
}