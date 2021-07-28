import * as Path from "path";
import * as os from "os";

export default class GlobalConstants {
  static readonly cpboosterHome = Path.join(os.homedir(), ".cpbooster");
}
