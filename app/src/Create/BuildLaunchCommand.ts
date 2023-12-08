import * as Path from "path";

function expandRange(filePath: string): string[] {
    const directory = Path.dirname(filePath);
    const fullFilename = Path.basename(filePath);
    const extension = Path.extname(fullFilename);
    const filenameWithoutExtension = Path.basename(fullFilename, extension);

    const rangePattern = /\{([a-zA-Z])\.\.([a-zA-Z])\}/;
    const rangeMatch = filenameWithoutExtension.match(rangePattern);

    if (!rangeMatch) return [filePath];

    const [ , startChar, endChar ] = rangeMatch;
    let expandedPaths = [];
    let startCode = startChar.toLowerCase().charCodeAt(0);
    let endCode = endChar.toLowerCase().charCodeAt(0);

    if (endCode < startCode) {
      [startCode, endCode] = [endCode, startCode];
    }

    for (let i = startCode; i <= endCode; i++) {
        expandedPaths.push(
        	Path.join(directory, 
				filenameWithoutExtension.replace(
					rangePattern, String.fromCharCode(i)) + extension
			)
		);
    }

    return expandedPaths;
}

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
	case "code":
      return filePath.includes('{')
        ? `code ${expandRange(filePath).map(fp => `"${fp}"`).join(' ')}`
        : `code "${filePath}"`;

    default:
      return `${terminalName} "${filePath}"`;
  }
}

