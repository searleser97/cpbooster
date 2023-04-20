export function getEditorCommand(terminalName: string, contestPath: string): string | null {
  switch (terminalName) {
    case "alacritty":
      return `alacritty --working-directory="${contestPath}" & disown`;
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
    case "kitty":
      return `kitty --single-instance --directory "${contestPath}"`;
    case "vscode":
      return `code "${contestPath}"`;
    default:
      return `${terminalName} "${contestPath}"`;
  }
}
