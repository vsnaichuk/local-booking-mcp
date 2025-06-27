import { Parser } from "htmlparser2";

export interface DeskInfo {
  number: string;
  isAvailable: boolean;
  coords?: {
    x: number;
    y: number;
    width?: number;
    height?: number;
  };
}

export function transformRoomPlanResponse(svgContent: string): string {
  const desks = parseRoomPlanSvg(svgContent);
  return createTextVisualization(desks);
}

function parseRoomPlanSvg(svgContent: string): DeskInfo[] {
  const desks: DeskInfo[] = [];
  let currentDesk: Partial<DeskInfo> | null = null;
  let currentCoords: Partial<DeskInfo["coords"]> = {};

  const parser = new Parser(
    {
      onopentag(name, attr) {
        if (name === "g" && attr.elementtype === "Desk") {
          currentDesk = {
            isAvailable:
              attr.isavailableforbooking === "True" &&
              attr.isreserved === "False",
          };
        } else if (name === "rect" && currentDesk) {
          currentDesk.number = attr.number || "";
          currentCoords = {
            x: parseInt(attr.x || "0"),
            y: parseInt(attr.y || "0"),
            width: parseInt(attr.width || "0"),
            height: parseInt(attr.height || "0"),
          };
        }
      },
      onclosetag(name) {
        if (name === "g" && currentDesk) {
          desks.push({
            ...currentDesk,
            coords: currentCoords,
          } as DeskInfo);
          currentDesk = null;
          currentCoords = {};
        }
      },
    },
    {
      lowerCaseTags: true,
      lowerCaseAttributeNames: true,
    }
  );
  parser.write(svgContent);
  parser.end();

  return desks;
}

function createTextVisualization(items: DeskInfo[]): string {
  // Find boundaries to create our grid
  let maxX = 0;
  let maxY = 0;

  items.forEach((item) => {
    const rightEdge = item.coords.x + item.coords.width;
    const bottomEdge = item.coords.y + item.coords.height;

    if (rightEdge > maxX) maxX = rightEdge;
    if (bottomEdge > maxY) maxY = bottomEdge;
  });

  // Create a simplified grid view
  // We'll divide by 100 to make it more manageable in text
  const gridWidth = Math.ceil(maxX / 500) + 1;
  const gridHeight = Math.ceil(maxY / 500) + 1;

  // Create grid with spaces
  const grid = Array(gridHeight)
    .fill(null)
    .map(() => Array(gridWidth).fill(" "));

  // Place items in the grid
  items.forEach((item) => {
    const gridX = Math.floor(item.coords.x / 500);
    const gridY = Math.floor(item.coords.y / 500);

    // Mark available spots with their number and unavailable with XX
    grid[gridY][gridX] = item.isAvailable ? item.number : `XX`;
  });

  let visualization = "";
  for (let y = 0; y < gridHeight; y++) {
    let row = "";
    for (let x = 0; x < gridWidth; x++) {
      // Pad each cell to a fixed width for better alignment
      row += (grid[y][x] + "   ").substring(0, 3) + " ";
    }
    visualization += row.trimEnd() + "\n";
  }

  return "```\n" + visualization + "```";
}
