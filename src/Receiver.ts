import express, { text } from "express";
import * as fs from "fs";
import * as Path from "path";
import ProblemData from "./ProblemData";
import Config from "./Config";
import { exit } from "process";
import { exec, spawnSync, spawn } from "child_process";

export default class Receiver {
    app = express();
    contestName = "NO_NAME";
    config: Config;
    isActive = false;
    lastRequestTime = process.hrtime();
    constructor(config: Config) {
        this.config = config;
        this.app.use(express.json());
        this.app.post("/", (request, response) => {
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
                if (config.cppTemplatePath != "")
                    cppTemplate = fs.readFileSync(config.cppTemplatePath).toString();
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
            console.info(
                '\nserver waiting for "Competitive Companion Plugin" to send problems...\n'
            );
        });

        let interval = setInterval(() => {
            if (!this.isActive) return;
            let elapsedTime = process.hrtime(this.lastRequestTime)[0];
            if (elapsedTime >= 1) {
                if (serverRef) serverRef.close();
                clearInterval(interval);
                let contestPath = Path.join(this.config.contestsDirectory, this.contestName);
                console.log("\n\tDONE!\n");
                console.log(`The path to your contest folder is: "${contestPath}"`);
                console.log("\n\tHappy Coding!\n");
                let command = "";
                if (this.config.terminal === "konsole")
                    command = `konsole --workdir "${contestPath}"`;
                else if (this.config.terminal === "gnome-terminal")
                    command = `gnome-terminal --working-directory="${contestPath}"`;
                else if (this.config.terminal === "deepin-terminal")
                    command = `deepin-terminal --work-directory "${contestPath}"`;
                else if (this.config.terminal === "xterm")
                    command = `xterm -e 'cd "${contestPath}" && bash' & disown`;
                else {
                    exit(0);
                }
                spawn(command, { shell: true });
                exit(0);
            }
        }, 100);
    }
}
