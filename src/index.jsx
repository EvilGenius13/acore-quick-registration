import { Elysia } from "elysia";
import {html} from "@elysiajs/html"
import mysql from 'mysql2/promise';
import crypto from 'crypto';
import { toBufferLE, toBigIntLE } from 'bigint-buffer';
import { modPow } from 'bigint-crypto-utils';
import IndexPage from '../public/IndexPage';

require('dotenv').config();

const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});
const realmlists = process.env.REALMLIST.split(',');
console.log(realmlists)

const app = new Elysia()
.use(html())
.get("/", () => {
    const realmlists = process.env.REALMLIST.split(',');
    return <IndexPage />;
})
    .post("/register", async (req) => {
        const { username, password, verifyPassword } = req.body;
      
        if (password !== verifyPassword) {
          return `<div class="text-red-500">Passwords do not match.</div>`;
        }
      
        const [user] = await db.execute(
          "SELECT username FROM account WHERE username = ?",
          [username]
        );
      
        if (user.length > 0) {
          return `<div class="text-red-500">Username already exists.</div>`;;
        }
      
        const salt = crypto.randomBytes(32);
        const h1 = crypto.createHash('sha1').update(`${username.toUpperCase()}:${password.toUpperCase()}`).digest();
        const h2 = crypto.createHash('sha1').update(Buffer.concat([salt, h1])).digest();
        const h2BigInt = toBigIntLE(h2);
      
        const g = BigInt(7);
        const N = BigInt('0x894B645E89E1535BBDAD5B8B290650530801B18EBFBF5E8FAB3C82872A3E9BB7');
      
        const verifier = await modPow(g, h2BigInt, N);
        const verifierBuffer = toBufferLE(verifier, 32);
      
        try {
          await db.execute(
            "INSERT INTO account (username, salt, verifier) VALUES (?, ?, ?)",
            [username, salt, verifierBuffer]
          );
          return `<div class="text-green-500">User registered successfully.</div>`;
        } catch (error) {
          return `<div class="text-red-500">Error: ${error.message}</div>`;
        }
      })
    .listen(3000);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
