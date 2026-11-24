const https = require('https');
const fs = require('fs');

async function getOSRM(coords) {
  return new Promise((resolve, reject) => {
    const coordStr = coords.map(c => `${c[0]},${c[1]}`).join(';');
    const url = `https://router.project-osrm.org/route/v1/driving/${coordStr}?overview=full&geometries=geojson&continue_straight=true`;
    https.get(url, { headers: { 'User-Agent': 'Aura/1.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed.routes[0]);
        } catch(e) { reject(e); }
      });
    }).on('error', reject);
  });
}

async function run() {
  // Key Lucknow intersections along the real road route:
  // 1. Hazratganj Chauraha (At Atal Chowk / MG Marg)
  // 2. Halwasiya / Naval Kishore Crossing (MG Marg)
  // 3. Mayfair / Post Office (MG Marg)
  // 4. KD Singh Babu Stadium (MG Marg)
  // 5. Parivartan Chowk (Subhash Chauraha)
  // 6. Kaiserbagh Chauraha (Kaiserbagh Circle)
  // 7. Kaiserbagh Bus Stand / Kotwali
  // 8. Collectorate / CDRI (Mahatma Gandhi Marg)
  // 9. Shah Mina Road Entrance (Near Balrampur Hospital / Tomb)
  // 10. Shah Mina Road / KGMU Dental College
  // 11. KGMU Chowk / Victoria Street Crossing
  // 12. KGMU Trauma Centre Gate 2

  const waypoints = [
    [80.9462, 26.8467],  // Hazratganj Chauraha
    [80.9429, 26.8488],  // MG Marg / Naval Kishore
    [80.9395, 26.8512],  // MG Marg / KD Singh Babu Stadium
    [80.9360, 26.8538],  // Parivartan Chowk
    [80.9324, 26.8552],  // Kaiserbagh Chauraha
    [80.9288, 26.8576],  // Qaiser Bagh Road / Kotwali
    [80.9250, 26.8601],  // Kutchery Road / Near Collectorate
    [80.9205, 26.8624],  // Shah Mina Gate / Balrampur
    [80.9175, 26.8652],  // Shah Mina Road / KGMU Administration
    [80.9148, 26.8678],  // Medical College Chowk Approach
    [80.9135, 26.8694]   // KGMU Trauma Centre Gate 2
  ];

  console.log('Querying multi-waypoint arterial road route...');
  const route = await getOSRM(waypoints);
  console.log('Route distance:', route.distance, 'm');
  console.log('Total coordinates count:', route.geometry.coordinates.length);

  const formatted = route.geometry.coordinates.map(p => ({
    lat: parseFloat(p[1].toFixed(6)),
    lng: parseFloat(p[0].toFixed(6))
  }));

  fs.writeFileSync('C:/Users/Eshan/.gemini/antigravity/scratch/aura-frontend/src/lib/lucknow_road_network.json', JSON.stringify(formatted, null, 2));
  console.log('Successfully saved real road path to lucknow_road_network.json');
}

run().catch(console.error);
