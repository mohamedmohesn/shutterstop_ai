module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable("face", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      imageId: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "",

      },
      photoName: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "",
      },
      faceId: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "",
      },
      responseData: {
        type: Sequelize.STRING(10000),
        allowNull: false,
        defaultValue: "",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    }),
  down: (queryInterface) => queryInterface.dropTable("face"),
};