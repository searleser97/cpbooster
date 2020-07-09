import { string } from "yargs";

export default class Util {
    static replaceAll(text: string, oldString: string, newString: string): string {
        return text.split(oldString).join(newString);
    }
};