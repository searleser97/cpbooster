import * as fs from "fs";
import Config from "./Config";
import * as Path from "path";

export default class SourceFileCreator {
    static create(filePath: string, config: Config) {
        let extension = Path.extname(filePath);
        let template = "";
        if (extension == ".cpp") {
            if (config.cppTemplatePath)
                template = fs.readFileSync(config.cppTemplatePath).toString();
        } else if (extension == ".py") {
            if (config.pyTemplatePath) template = fs.readFileSync(config.pyTemplatePath).toString();
        }
        if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, template);
    }
}
