module.exports = function (sequelize, DataTypes) {
    const productMedia = sequelize.define(
        "ProductMedia", {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            productId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'product',
                    key: 'id',
                },
            },
            uuid: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "",
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "",
            },
            imageLocation: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "",
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        }, {
            tableName: "productMedia",
        }
    );

    return productMedia;
};