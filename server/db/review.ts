import { DataTypes, Model, type ModelStatic, Sequelize } from 'sequelize';

export default function (sequelize: Sequelize, dataTypes: typeof DataTypes): ModelStatic<any> {
    return sequelize.define('review', {
        review_id: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        review_rating: {
            type: dataTypes.INTEGER,
            allowNull: false,
        },
        review_content: {
            type: dataTypes.TEXT,
            allowNull: false,
        },
        review_author_name: {
            type: dataTypes.STRING(255),
            allowNull: false,
        },
        review_author_photo_uri: {
            type: dataTypes.STRING(500),
            allowNull: true,
        },
        review_google_created_at: {
            type: dataTypes.STRING(50),
            allowNull: false,
        },
        created_at: {
            type: dataTypes.DATE,
            allowNull: false,
            defaultValue: dataTypes.NOW,
        },
    }, {
        underscored: true,
        timestamps: true,
        paranoid: true,
        deletedAt: 'deleted_at',
        updatedAt: 'updated_at',
        createdAt: 'created_at',
        indexes: [
            {
                unique: true,
                fields: ["review_author_name"], // enforce uniqueness
            },
        ],
    });
}