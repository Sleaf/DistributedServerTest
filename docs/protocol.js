const baseURL = '/api';
const GET = 'HTTP GET method';
const POST = 'HTTP POST method';
const Int = {
  404: 'not exist',
  408: 'overload',
  508: 'databse error'
};

function protocol() {
  const path = '';
  const Status = {
    'OK': {
      code: 200,
      status: 'OK',
      data: Object
    },
    'FAIL': {
      code: Int,
      status: 'FAIL',
      msg: String
    },
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
        flight_id: String,
        user_id: String
      };
      return Status;
    default:

  }
}
