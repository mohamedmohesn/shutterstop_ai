module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable("product", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      uuid: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "",
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "",
      },
      displayName: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "",
      },
      storeType: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "gc",
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "apparel",
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
  down: (queryInterface) => queryInterface.dropTable("product"),
};