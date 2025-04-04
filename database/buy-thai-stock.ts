import mysql, { ConnectionOptions } from 'mysql2';

const access: ConnectionOptions = {
  host: process.env.DB_HOST || 'thstock-host-db',
  user: process.env.DB_USER || 'any',
  password: process.env.DB_PASSWORD || '1234',
  database: process.env.DB_NAME || 'th-stock',
  port: Number(process.env.DB_PORT) || 3306,
};

const connection = mysql.createConnection(access);

connection.connect((connectionError) => {
  if (connectionError) {
    console.error('Error connecting to the database:', connectionError);
    return;
  }
  try {
    connection.query('SELECT * FROM stock_orders', (error, results) => {
      if (error) {
        console.error('Error querying stock orders:', error);
        return;
      }
      console.log('Stock Orders:', results);
    });
  } finally {
    connection.end();
  }
});

export const connectToDatabase = () => {
  return mysql.createConnection(access);
};

export class Database {
  async connect() {
    const connection = mysql.createConnection(access);
    return new Promise<mysql.Connection>((resolve, reject) => {
      connection.connect((err) => {
        if (err) {
          reject(err);
        } else {
          resolve(connection);
        }
      });
    });
  }

  async query(queryString: string) {
    return new Promise((resolve, reject) => {
      connection.query(queryString, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  async close(connection: mysql.Connection) {
    return new Promise<boolean>((resolve, reject) => {
      connection.end((err) => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  }
}