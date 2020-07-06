#!/usr/bin/env node
import express from "express";
import * as fs from "fs";
import ProblemData from "./ProblemData";
import { exit } from "process";
import Config from "./Config";
import * as readline from "readline";

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let config = new Config();

const app = express();
app.use(express.json());

app.post('/', (request, response) => {
    response.writeHead(200, { "Content-Type": "text/html" });
    response.end("OK");
    let data: ProblemData = request.body;
    fs.mkdirSync("/home/san/Desktop/contests/" + data.group, { recursive: true });
});

let port = 1327;
let server = app.listen(port, () => {
    rl.question("Press any key to stop the problem parser", (answer) => {
        console.log(answer);
        server.close();
        rl.close();
    });
});
console.log("running at:", port);