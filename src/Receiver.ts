import express, { text } from "express";
import * as fs from "fs";
import * as Path from "path";
import ProblemData from "./ProblemData";
import Config from "./Config";
import { exit } from "process";
import { exec } from "child_process";

export default class Receiver {
    app = express();
    contestName = "NO_NAME";
    config: Config;
    isActive = false;
    lastRequestTime = process.hrtime();
    constructor(config: Config) {
        this.config = config;
        this.app.use(express.json());
        this.app.post('/', (request, response) => {
            response.writeHead(200, { "Content-Type": "text/html" });
            response.end("OK");

            let problemData: ProblemData = request.body;
            this.contestName = problemData.group;
            console.info("received:", problemData.name);
            let contestPath = Path.join(config.contestsDirectory, problemData.group);
            fs.mkdirSync(contestPath, { recursive: true });
            let FilesPathNoExtension = `${Path.join(contestPath, problemData.name)}`;
            let cppFilePath = `${FilesPathNoExtension}.cpp`;
            if (!fs.existsSync(cppFilePath)) {
                let cppTemplate = "";
                if (config.cppTemplatePath != "") cppTemplate = fs.readFileSync(config.cppTemplatePath).toString();
                fs.writeFileSync(cppFilePath, cppTemplate);
            }
            problemData.tests.forEach((testcase, idx) => {
                fs.writeFileSync(`${FilesPathNoExtension}.in${idx + 1}`, testcase.input);
                fs.writeFileSync(`${FilesPathNoExtension}.ans${idx + 1}`, testcase.output);
            });
            if (!this.isActive) this.isActive = true;
            this.lastRequestTime = process.hrtime();
        });
    }

    run() {
        let serverRef = this.app.listen(this.config.port, () => {
            console.info("\nserver running at port:", this.config.port);
            console.info("\nserver waiting for \"Competitive Companion Plugin\" to send problems...");
        });

        let interval = setInterval(() => {
            if (!this.isActive) return;
            let elapsedTime = process.hrtime(this.lastRequestTime)[0];
            if (elapsedTime >= 1) {
                let contestPath = Path.join(this.config.contestsDirectory, this.contestName);
                // default option will be to use x-terminal-emulator, and then check for specific terminal names.
                let command = `konsole --workdir "${contestPath}"`;
                // let command = `gnome-terminal --working-directory="${contestPath}`;
                console.log(command);
                exec(command);
                clearInterval(interval);
                if (serverRef) serverRef.close();
                exit(0);
            }
        }, 100);
    }
}