'use strict';

const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Signature extends Model {
        static associate(models) {
            Signature.belongsTo(models.User, {
                foreignKey: 'userId'
            })
        }
    }
    Signature.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.BIGINT
        },
        serialNumber: {
            allowNull: false,
            type: DataTypes.STRING(100)
        },
        issuer: {
            allowNull: false,
            type: DataTypes.STRING(100)
        },
        issueDate: {
            allowNull: false,
            type: DataTypes.DATEONLY
        },
        expireDate: {
            allowNull: false,
            type: DataTypes.DATE
        },
        description: {
            allowNull: true,
            type: DataTypes.STRING(500)
        },
        apiUrl: {
            allowNull: false,
            type: DataTypes.STRING(200)
        },
        userId: {
            allowNull: true,
            type: DataTypes.BIGINT
        },
        organizationId: {
            allowNull: true,
            type: DataTypes.BIGINT
        },
        type: {
            allowNull: false,
            type: DataTypes.TINYINT
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE
        }
    }, {
        sequelize,
        tableName: 'signatures',
        modelName: 'Signature',
    });

    return Signature;
};
