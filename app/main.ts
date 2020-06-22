import { serve, ServerRequest } from './deps.ts';
import { GET } from './handler.ts';

function handleRequest (req: ServerRequest) {
  if (req.method === 'GET') {

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
