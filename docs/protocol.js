const baseURL = '/api';
const GET = 'HTTP GET method';
const POST = 'HTTP POST method';

function protocol() {
  const path = '';
  const Status = {
    code: String,
    msg: String
  };
  let query = 'arguments after path';
  let data = 'payload in request';

  switch (path) {
    /*User*/
    case POST`/login`:
      data = {
        username: String,
        password: String
      };
      return Status;

    case POST`/register`:
      data = {
        username: String,
        password: String
      };
      return Status;


    default:
  }
}
