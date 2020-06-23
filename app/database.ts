import { DataTypes, Database, Model } from './deps.ts';
import { PlotInit } from './model/plot.ts';

async function connect () {
  const username = Deno.env.get('DB_USER');
  const password = Deno.env.get('DB_PWD');
  const dbURL = Deno.env.get('DATABASE_URL');

  if (username && password) {
    return new Database('mysql', {
      host: 'db',
      username,
      password,
      database: 'terrain',
    });
  } else if (dbURL) {
    const [,, url, database] = dbURL.split('/');
    const [username, password] = url.split('@')[0].split(':');
    const host = url.split('@')[1].split(':')[0];

    return new Database('mysql', {
      host,
      username,
      password,
      database,
    });
  } else {
    throw new Error('Missing DB credentials in env vars.');
  }
}

class Plot extends Model {
  static table = 'plot';
  static timestamps = true;

  static fields = {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      length: 11
    },
    terrainType: DataTypes.INTEGER,
    terrainDesc: DataTypes.STRING,
    elevation: DataTypes.INTEGER,
  };
}

export async function ensureModels () {
  const db = await connect();

  db.link([Plot]);
  await db.sync({ drop: true });
  db.close();
}

export async function getPlot(plotCode: string) {
  let db;

  try {
    db = await connect();

    const foundPlots = await Plot.where('id', plotCode).get();

    return foundPlots[0];
  } catch (e) {
    console.log(e);
  } finally {
    if (db) db.close();
  }
}

export async function addPlot(plot: PlotInit) {
  let db;

  try {
    db = await connect();

    const { id, terrainType, terrainDesc, elevation } = plot;

    return Plot.create({
      id,
      terrainType,
      terrainDesc,
      elevation,
    });
  } catch (e) {
    console.log(e);
  } finally {
    if (db) db.close();
  }
}
