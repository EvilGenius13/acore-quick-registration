import { Elysia } from "elysia";
import {html} from "@elysiajs/html";
import IndexPage from "../public/IndexPage";
import Registration from '../lib/registration';
require('dotenv').config();

const app = new Elysia()
.use(html())
.get("/", () => {
    return <IndexPage />;
})
.post("/register", async (req) => {
    const registration = new Registration({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    });
    return await registration.registerUser(req.body);
})
.listen(3000);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
