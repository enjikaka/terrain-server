import { getPlot, addPlot } from './database.ts';
import { getTerrainDataFromPlotCode, getElevation } from './fetcher.ts';
import { ServerRequest } from './deps.ts';

export async function GET (req: ServerRequest) {
  let databaseCall;

  try {
    const [, code] = req.url.split('/');

    if (code.length !== 11) {
      req.respond({
        status: 422,
        body: 'Not a valid plus code'
      });
    }

    let data;

    try {
      data = await getPlot(code);
      console.log('db', data);
    } catch(e) {}

    if (!data) {
      const terrainData = await getTerrainDataFromPlotCode(code);
      const elevation = await getElevation(code);

      data = {
        id: code,
        terrainType: terrainData.value,
        terrainDesc: terrainData.label.split(':')[1].trim(),
        elevation,
      };

      databaseCall = addPlot(code, terrainData.value, 200);
    }

    req.respond({
      status: 200,
      body: JSON.stringify(data)
    });
  } catch (e) {
    console.log(e);
  } finally {
    await databaseCall;
  }
}
