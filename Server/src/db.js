require("dotenv").config();
const { Sequelize } = require("sequelize");

const fs = require("fs");
const path = require("path");
const { DB_DEPLOY} = process.env;

const sequelize = new Sequelize(DB_DEPLOY, {
  logging: false,
  native: false,
  dialectOptions: {
    ssl: {
      require: false,
    },
  },
});
const basename = path.basename(__filename);

const modelDefiners = [];

fs.readdirSync(path.join(__dirname, "/Models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/Models", file)));
  });

modelDefiners.forEach((modelDefiner) => {
  if (typeof modelDefiner === "function") {
    modelDefiner(sequelize);
  }
});

let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

const { Room, Hotel, Booking, User, Auth, Rating } = sequelize.models;

// Aca vendrian las relaciones
// Product.hasMany(Reviews);

/*User.hasMany(Booking, { foreignKey: "userId", targetKey: "id" });*/
/*Room.hasMany(Booking, { foreignKey: "roomId", targetKey: "id" });*/
Hotel.hasMany(Rating, {
  foreignKey: "hotelId",
});

Rating.belongsTo(Hotel, {
  foreignKey: "hotelId",
});

Room.hasMany(Booking, {
  foreignKey: "roomId",
});

Booking.belongsTo(Room, {
  foreignKey: "roomId",
});

Hotel.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

User.hasOne(Hotel, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

Hotel.hasMany(Room, {
  foreignKey: "hotelId",
  onDelete: "CASCADE",
});
Room.belongsTo(Hotel, {
  foreignKey: "hotelId",
  onDelete: "CASCADE",
});
Auth.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});
User.hasOne(Auth, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize, // para importart la conexión { conn } = require('./db.js');
};
