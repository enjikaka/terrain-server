import { getPlot, addPlot } from './database.ts';
import { getTerrainDataFromPlotCode, getElevation } from './fetcher.ts';
import { ServerRequest, extname } from './deps.ts';

export async function OPTIONS (req: ServerRequest) {
  const headers = new Headers();

  headers.append('Access-Control-Allow-Origin', '*');
  headers.append('Access-Control-Allow-Methods', 'GET');

  req.respond({
    headers,
    status: 204,
  });
}

export async function GET (req: ServerRequest) {
  let databaseCall;

  try {
    const [, code] = req.url.split('/');

    if (code.length !== 11 || extname(code) !== '') {
      req.respond({
        status: 422,
        body: 'Not a valid plus code'
      });
    }

    let data;

    try {
      data = await getPlot(code);
    } catch(e) {}

    if (!data) {
      const terrainData = await getTerrainDataFromPlotCode(code);
      const elevation = await getElevation(code);

      const terrainType = parseInt(terrainData.value, 10);
      const terrainDesc = terrainData.label.split(':')[1].trim();

      data = {
        id: code,
        terrainType,
        terrainDesc,
        elevation,
      };

      databaseCall = addPlot({ id: code, terrainType, terrainDesc, elevation });
    }

    const headers = new Headers();

    headers.append('Access-Control-Allow-Origin', '*');

    req.respond({
      headers,
      status: 200,
      body: JSON.stringify(data)
    });
  } catch (e) {
    console.log(e);
  } finally {
    await databaseCall;
  }
}
