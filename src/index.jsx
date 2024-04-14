import { Elysia } from "elysia";
import {html} from "@elysiajs/html"
import IndexPage from '../public/IndexPage';

const app = new Elysia()
    .use(html())
    .get("/", () => {
        return <IndexPage />;
    })
    .listen(3000);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
