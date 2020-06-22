import { DataTypes, Database, Model } from './deps.ts';

let db;

const username = Deno.env.get('DB_USER');
const password = Deno.env.get('DB_PWD');

if (username && password) {
  db = new Database('mysql', {
    host: 'db',
    username,
    password,
    database: 'terrain',
  })
} else {
  throw new Error('Missing DB credentials in env vars.');
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

db.link([Plot]);
db.sync({ drop: true });

export async function getPlot(plotCode: string) {
  const foundPlots = await Plot.where('id', plotCode).get();

  return foundPlots[0];
}

export async function addPlot(plotCode: string, terrain: string, elevation: number) {
  return Plot.create({
    id: plotCode,
    terrain,
    elevation,
  })
}