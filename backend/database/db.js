import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('ecosajha', 'postgres', 'admin123', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');
    await sequelize.sync({ force: false });
    console.log('Database synced successfully');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

export { sequelize, connectDB };

