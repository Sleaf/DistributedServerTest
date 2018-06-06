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
    /*scan*/
    case GET`/scan`:
      query = {
        date: 'YYYY-MM-DD'
      };
      return Status;

    /*order*/
    case POST`/order`:
      data = {
        date: 'YYYY-MM-DD',
        id: String,
        username: String
      };
      return Status;
    default:

  }
}
