import mysql from 'mysql2/promise';

async function connectToDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE
    });
    return connection;
  } catch (error) {
    throw new Error("Database not available");
  }
}

export default connectToDatabase;