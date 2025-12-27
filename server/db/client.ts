import {DataTypes, ModelStatic, Sequelize} from 'sequelize';

export default function (sequelize: Sequelize, dataTypes: typeof DataTypes): ModelStatic<any> {
    const Model = sequelize.define('client', {
        client_id: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        client_first_name: dataTypes.STRING(25),
        client_last_name: dataTypes.STRING(25),
        client_email: dataTypes.STRING(25),
        client_phone: dataTypes.STRING(25),
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
        client_full_name: {
            type: dataTypes.VIRTUAL,
            get() {
                return `${this.get('client_first_name')} ${this.get('client_last_name')}`
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
        function ({user}: any) {
            Model.belongsTo(user, {
                foreignKey: 'user_user_id',
                onDelete: "NO ACTION",
                onUpdate: "NO ACTION" });
        };

    return Model;
}