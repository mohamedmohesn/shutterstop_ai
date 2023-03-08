module.exports = function (sequelize, DataTypes) {
    const Face = sequelize.define(
        "Face", {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            imageId: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "",

            },
            photoName: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "",
            },
            faceId: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "",
            },
            responseData: {
                type: DataTypes.STRING(10000),
                allowNull: false,
                defaultValue: "",
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: true,
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
            tableName: "face",
        }
    );

    return Face;
};