import { DataTypes, Database, Model } from './deps.ts';

const db = new Database('mysql', {
  host: 'db',
  username: 'deno',
  password: 'empires',
  database: 'terrain',
});

class Plot extends Model {
  static table = 'plot';
  static timestamps = true;

  static fields = {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      length: 8
    },
    terrain: DataTypes.INTEGER,
    altitude: DataTypes.INTEGER,
  };
}

db.link([Plot]);
db.sync({ drop: true });

export async function getPlot(plotCode: string) {
  return Plot.select('id', 'destination').get();
}
