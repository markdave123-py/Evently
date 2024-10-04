import { DataTypes, Model } from "sequelize";
import { sequelizeConn } from "../../core/config/database.js";
import Event from "../../event/models/event.model.js";
import User from "../../user/models/user.model.js";

class Reservation extends Model {}

Reservation.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    eventId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "events",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    status: {
      type: DataTypes.ENUM("waiting", "booked", "cancelled"),
      allowNull: false,
      defaultValue: "waiting",
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize: sequelizeConn,
    modelName: "Reservation",
    tableName: "reservations",
    timestamps: true,
  }
);

// Associations
Reservation.belongsTo(Event, { foreignKey: "eventId" });
Reservation.belongsTo(User, { foreignKey: "userId" });

export default Reservation;
