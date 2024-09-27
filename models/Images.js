"use strict";

import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Images = sequelize.define("Image", {
  id: {
    primaryKey: true,
    allowNull: false,
    type: DataTypes.INTEGER,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

// Images.sync();
// Images.sync({ alter: true });
