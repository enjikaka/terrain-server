import { DataTypes, Database, Model, serve, ServerRequest } from './deps.ts';

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

function handleRequest (req: ServerRequest) {
  if (req.method === 'GET') {
    const [, code] = req.url.split('/');

    if (code.length !== 11) {
      req.respond({
        status: 422,
        body: 'Not a valid plus code'
      });
    } else {
      req.respond({
        status: 200,
        body: code
      });
    }
  } else {
    req.respond({
      status: 405,
      body: 'Method Not Allowed'
    });
  }
}

const server = serve({ port: 5000 });

console.log("http://localhost:5000/");

for await (const req of server) {
  handleRequest(req);
}
