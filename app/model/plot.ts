import { getPlot, addPlot } from '../database.ts';
import { getTerrainDataFromPlotCode, getElevation } from '../fetcher.ts';

export interface PlotInit {
  id: string;
  terrainType: number;
  terrainDesc: string;
  elevation: number;
}

export async function getOrCreate(plotCode: string): Promise<PlotInit> {
  let data;

  try {
    data = await getPlot(plotCode);
  } catch(e) {}

  if (!data) {
    const terrainData = await getTerrainDataFromPlotCode(plotCode);
    const elevation = await getElevation(plotCode);

    const terrainType = parseInt(terrainData.value, 10);
    const terrainDesc = terrainData.label.split(':')[1].trim();

    data = {
      id: plotCode,
      terrainType,
      terrainDesc,
      elevation,
    };

    await addPlot({ id: plotCode, terrainType, terrainDesc, elevation });
  }

  return data;
}
