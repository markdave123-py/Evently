import { DataTypes, Model } from "sequelize";
import { sequelizeConn } from "../../core/config/database.js";
import User from "../../user/models/user.model.js";

class Event extends Model {}

Event.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ownerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    soldTickets: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      validate: {
        min: 0,
        isLessThanTotalTickets(value) {
          if (value > this.TotalTickets) {
            throw new Error("Sold tickets can't be more than total tickets");
          }
        },
      },
    },
    totalTickets: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
  },
  {
    sequelize: sequelizeConn,
    modelName: "Event",
    tableName: "events",
    timestamps: true,
    indexes: [
      {
        fields: ["id"],
      },
      {
        fields: ["ownerId"],
      },
    ],
  }
);

// Association with User
Event.belongsTo(User, { foreignKey: "ownerId" });
User.hasMany(Event, { foreignKey: "ownerId" });

export default Event;
