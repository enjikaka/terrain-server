import { getPlot } from './database.ts';
import { ServerRequest } from './deps.ts';

export async function GET (req: ServerRequest) {
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

  let data = await getPlot(code);

  if (!data) {
    data = await fetchPlot(code);
  }

  console.log(data);
}
