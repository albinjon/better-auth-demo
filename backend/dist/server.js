import express, {} from "express";
export default function createServer() {
    const app = express();
    app.get("/", (req, res, next) => {
        res.send("Hello world!");
    });
    return app;
}
