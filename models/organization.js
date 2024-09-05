"use strict";
require("dotenv").config();

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Organization extends Model {
        static associate(models) {
            Organization.hasMany(models.User, {
                foreignKey: 'organizationId'
            });
            Organization.hasMany(models.ContractParticipant, {
                foreignKey: 'organizationId'
            })
        }
    }
    Organization.init(
        {
            name: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            address: {
                type: DataTypes.STRING(300),
                allowNull: false
            },
            bankName: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            bankNumber: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            taxCode: {
                type: DataTypes.STRING(15),
                allowNull: false,
            },
            phone: {
                type: DataTypes.STRING(25),
                allowNull: false,
            },
            representative: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            businessLicenseNo: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            registrationDate: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
            type: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            status: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: "organizations",
            modelName: "Organization",
        },
    );
    return Organization;
};
