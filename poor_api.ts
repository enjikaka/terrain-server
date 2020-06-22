const layerInfoURL = 'https://copernicus.discomap.eea.europa.eu/arcgis/rest/services/Corine/CLC2018_WM/MapServer/0?f=json';
const json = await fetch(layerInfoURL).then(r => r.json());

console.log(json);
