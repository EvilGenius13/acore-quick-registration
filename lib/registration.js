import crypto from 'crypto';
import { toBufferLE, toBigIntLE } from 'bigint-buffer';
import { modPow } from 'bigint-crypto-utils';
import connectToDatabase from './db-connect';

class Registration {
    constructor(dbConfig) {
        this.dbConfig = dbConfig;
    }

    async registerUser(reqBody) {
        const { username, password, verifyPassword } = reqBody;
        if (!this.validateInput(password, verifyPassword)) {
            return `<div class="text-red-500">Passwords do not match.</div>`;
        }

        const db = await this.connectToDatabase();

        try {
            if (await this.checkUsernameExists(db, username)) {
                return `<div class="text-red-500">Username already exists.</div>`;
            }

            const { salt, verifierBuffer } = await this.hashPassword(username, password);
            await this.saveToDatabase(db, username, salt, verifierBuffer);
            return `<div class="text-green-500">User registered successfully.</div>`;
        } catch (error) {
            return `<div class="text-red-500">Error: ${error.message}</div>`;
        } finally {
            if (db) {
                db.end();
            }
        }
    }

    validateInput(password, verifyPassword) {
        return password === verifyPassword;
    }

    async connectToDatabase() {
        return connectToDatabase(this.dbConfig);
    }

    async checkUsernameExists(db, username) {
        const [user] = await db.execute(
            "SELECT username FROM account WHERE username = ?",
            [username]
        );
        return user.length > 0;
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
