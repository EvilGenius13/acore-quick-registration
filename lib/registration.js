import crypto from 'crypto';
import { toBufferLE, toBigIntLE } from 'bigint-buffer';
import { modPow } from 'bigint-crypto-utils';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

class Registration {
    constructor() {}

    async registerUser(reqBody) {
        const { username, password, verifyPassword } = reqBody;
        
        if (await this.checkpasswordLength(password)) {
            return `<div class="text-red-500">Password can not exceed 16 characters</div>`
        }
        if (!this.validateInput(password, verifyPassword)) {
            return `<div class="text-red-500">Passwords do not match.</div>`;
        }

        let connection;
        try {
            connection = await pool.getConnection();
            if (await this.checkUsernameExists(connection, username)) {
                return `<div class="text-red-500">Username already exists.</div>`;
            }

            const { salt, verifierBuffer } = await this.hashPassword(username, password);
            await this.saveToDatabase(connection, username, salt, verifierBuffer);
            
            const realmlist = process.env.REALMLIST;
            const realmlistMessage = realmlist ? `<div>Please add these to your realmlist.conf file: ${realmlist.split(',').join(', ')}</div>` : "";

            return `<div class="text-green-500">User registered successfully.</div>${realmlistMessage}`;

        } catch (error) {
            return `<div class="text-red-500">Error: ${error.message}</div>`;
        } finally {
            if (connection) {
                connection.release(); // Release connection back to the pool
            }
        }
    }

    validateInput(password, verifyPassword) {
        return password === verifyPassword;
    }

    async checkUsernameExists(connection, username) {
        const [user] = await connection.execute(
            "SELECT username FROM account WHERE username = ?",
            [username]
        );
        return user.length > 0;
    }

    async checkpasswordLength(password) {
        return password.length > 16;
    }

    async hashPassword(username, password) {
        const salt = crypto.randomBytes(32);
        const h1 = crypto.createHash('sha1').update(`${username.toUpperCase()}:${password.toUpperCase()}`).digest();
        const h2 = crypto.createHash('sha1').update(Buffer.concat([salt, h1])).digest();
        const h2BigInt = toBigIntLE(h2);
        const g = BigInt(7);
        const N = BigInt('0x894B645E89E1535BBDAD5B8B290650530801B18EBFBF5E8FAB3C82872A3E9BB7');
        const verifier = await modPow(g, h2BigInt, N);
        const verifierBuffer = toBufferLE(verifier, 32);
        return { salt, verifierBuffer };
    }

    async saveToDatabase(db, username, salt, verifierBuffer) {
        await db.execute(
            "INSERT INTO account (username, salt, verifier) VALUES (?, ?, ?)",
            [username, salt, verifierBuffer]
        );
    }
}

export default Registration;