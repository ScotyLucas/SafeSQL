const { Sequelize, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");

async function setupDatabase(config) {
  const { dbType, host, port, username, password, database, adminUser, adminPass } = config;

  const sequelize = new Sequelize(database, username, password, {
    host,
    port,
    dialect: dbType, // lehet: mysql, mariadb, postgres, mssql
    logging: false
  });

  // Teszteljük a kapcsolatot
  await sequelize.authenticate();
  console.log("Adatbázis kapcsolat sikeres!");

  // User tábla modell
  const User = sequelize.define("User", {
    username: { type: DataTypes.STRING, unique: true },
    password: { type: DataTypes.STRING }
  });

  await sequelize.sync();

  // Admin felhasználó létrehozása
  const hash = await bcrypt.hash(adminPass, 10);
  await User.create({ username: adminUser, password: hash });

  console.log("Admin user létrehozva!");
  await sequelize.close();
}

module.exports = { setupDatabase };
