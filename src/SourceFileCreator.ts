import * as fs from "fs";
import Config from "./Config";
import * as Path from "path";
import Util from "./Util";

export default class SourceFileCreator {
    static create(filePath: string, config: Config, timeLimitInSeconds: number) {
        let extension = Path.extname(filePath);
        let template = `${Util.getCommentString(extension)} time-limit: ${timeLimitInSeconds}\n`;
        if (extension == ".cpp" && config.cppTemplatePath) {
            template += fs.readFileSync(config.cppTemplatePath).toString();
        } else if (extension == ".py" && config.pyTemplatePath) {
            template += fs.readFileSync(config.pyTemplatePath).toString();
        }
        if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, template);
    }
}
