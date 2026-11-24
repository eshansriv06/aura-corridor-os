const https = require('https');
const fs = require('fs');

const query = `
[out:json];
(
  way["name"~"Shah Mina|Mahatma Gandhi|Kaiserbagh|Subhash|Victoria",i](26.840,80.910,26.875,80.950);
);
(._;>;);
out body;
`;

const postData = 'data=' + encodeURIComponent(query);

const req = https.request('https://overpass-api.de/api/interpreter', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'User-Agent': 'Aura-Corridor/1.0'
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log('Total OSM elements:', parsed.elements.length);
      fs.writeFileSync('C:/Users/Eshan/.gemini/antigravity/scratch/aura-frontend/src/lib/lucknow_osm_raw.json', JSON.stringify(parsed.elements, null, 2));
      console.log('Saved to lucknow_osm_raw.json');
    } catch(e) {
      console.error(e);
    }
  });
});

req.write(postData);
req.end();
