import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';
import bcrypt from 'bcryptjs';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'full_name',
    validate: {
      len: [2, 100],
      notEmpty: true
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [4, 255],
      notEmpty: true
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'phone_number',
    validate: {
      notEmpty: true
    }
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [4, 500],
      notEmpty: true
    }
  },
  wasteType: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'primary_waste_type',
    validate: {
      notEmpty: true
    }
  }
}, {
  timestamps: true,
  underscored: true,
  tableName: 'users',
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default User;