export function getTerminalCommand(terminalName: string, contestPath: string): string | null {
  switch (terminalName) {
    case "konsole":
      return `konsole --workdir "${contestPath}"`;
    case "gnome-terminal":
      return `gnome-terminal --working-directory="${contestPath}"`;
    case "deepin-terminal":
      return `deepin-terminal --work-directory "${contestPath}"`;
    case "xterm":
      return `xterm -e 'cd "${contestPath}" && bash' & disown`;
    case "terminal":
      return `open -a terminal "${contestPath}"`;
    default:
      return null;
  }
}
