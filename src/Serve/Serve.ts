/*
    cpbooster "Competitive Programming Booster"
    Copyright (C) 2020  Sergio G. Sanchez V.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import Config from "../Config/Config";
import ICommandGlobalArgs from "../Types/ICommandGlobalArgs";
import CCServer from "./CCServer";

export interface ICommandServeArgs extends ICommandGlobalArgs {
  port?: number;
}

export function serve(args: ICommandServeArgs) {
  const config = Config.read(args.configPath);
  if (args.port) {
    config.port = args.port;
  }
  new CCServer(config).run();
}
