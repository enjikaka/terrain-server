import { ServerRequest, extname } from './deps.ts';
import { getOrCreate } from './model/plot.ts';

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
  const [, code] = req.url.split('/');

  if (code.length !== 11 || extname(req.url) !== '') {
    req.respond({
      status: 422,
      body: 'Not a valid plus code'
    });
  }

  let data;

  try {
    data = await getOrCreate(code);
  } catch (e) {
    console.log(e);
    req.respond({
      status: 422,
      body: 'Not a valid plus code'
    });

    return;
  }

  const headers = new Headers();

  headers.append('Access-Control-Allow-Origin', '*');
  headers.append('Cache-Control', 'max-age=31536000');

  req.respond({
    headers,
    status: 200,
    body: JSON.stringify(data)
  });
}
