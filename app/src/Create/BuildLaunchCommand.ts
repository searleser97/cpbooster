import * as Path from "path";

export function buildLaunchCommand(terminalName: string, filePath: string): string | null {
  const fileDirectory = Path.dirname(filePath);
  switch (terminalName) {
	// Terminals
	case "alacritty":
	  return `alacritty --working-directory="${fileDirectory}" & disown`;
	case "konsole":
	  return `konsole --workdir "${fileDirectory}"`;
	case "gnome-terminal":
	  return `gnome-terminal --working-directory="${fileDirectory}"`;
	case "deepin-terminal":
	  return `deepin-terminal --work-directory "${fileDirectory}"`;
	case "xterm":
	  return `xterm -e 'cd "${fileDirectory}" && bash' & disown`;
	case "terminal":
	  return `open -a terminal "${fileDirectory}"`;
	case "kitty":
	  return `kitty --directory "${fileDirectory}"`;

	// Editors
	case "vscode":
	  return `code "${filePath}"`;

    default:
      return `${terminalName} "${filePath}"`;
  }
}

