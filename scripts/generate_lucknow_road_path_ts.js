const fs = require('fs');

const pts = JSON.parse(fs.readFileSync('C:/Users/Eshan/.gemini/antigravity/scratch/aura-frontend/src/lib/lucknow_dense_road_path.json', 'utf-8'));

let content = `// Authentic High-Resolution Lucknow Emergency Green Corridor Road Network
// Modeled exactly along real asphalt roadways:
// Mahatma Gandhi Marg -> Parivartan Chowk -> Kaiserbagh Circle -> The Residency Perimeter -> Shah Mina Road -> KGMU Trauma Centre, Chowk

export interface RouteCoordinate {
  lat: number;
  lng: number;
  name?: string;
}

export const ROUTE_PATH_COORDINATES: RouteCoordinate[] = [
`;

pts.forEach((p) => {
  const cleanName = (p.name || "").replace(/\u2014/g, "-").replace(/\u2013/g, "-");
  content += `  { lat: ${p.lat.toFixed(6)}, lng: ${p.lng.toFixed(6)}, name: "${cleanName}" },\n`;
});

content += `];\n`;

fs.writeFileSync('C:/Users/Eshan/.gemini/antigravity/scratch/aura-frontend/src/lib/lucknowRoadPath.ts', content);
console.log('Successfully wrote src/lib/lucknowRoadPath.ts with', pts.length, 'coordinates');
