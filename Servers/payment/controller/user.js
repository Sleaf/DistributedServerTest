const databasePool = require('../store/database');

/*
  OkPacket {
  fieldCount: 0,
  affectedRows: 1,
  insertId: 0,
  serverStatus: 34,
  warningCount: 0,
  message: '(Rows matched: 1  Changed: 0  Warnings: 0',
  protocol41: true,
  changedRows: 0
  }
*/

/*
* 返回查询到的结果
* */
function findAccount(...args) {
  const label = ['username', 'password'];
  let sqlStr = `SELECT * FROM accounts`;
  if (args.length > 0) {
    sqlStr += '  WHERE ';
    for (let i = 0; i < args.length; i++) {
      sqlStr += `${label[i]} = ? && `
    }
  }
  //去除尾部与号
  sqlStr = sqlStr.slice(0, -3);
  let sqlParams = args;
  return new Promise((resolve, reject) => {
    databasePool.query(sqlStr, sqlParams, (error, results) => {
      if (error) {
        reject({
          code: error.code,
          msg: error.sqlMessage
        });
      } else {
        resolve(results);
      }
    });
  });
}

/*
* 插入数据
* */
function insertAccount(username, password) {
  let sqlStr = `INSERT INTO accounts (username,password) VALUES(?,?)`;
  let sqlParams = [username, password];
  return new Promise((resolve, reject) => {
    databasePool.query(sqlStr, sqlParams, (error, results) => {
      if (error) {
        reject({
          code: error.code,
          msg: error.sqlMessage
        });
      } else {
        resolve(results);
      }
    });
  });
}

/*
* 返回查询到的结果
* */
async function login(ctx) {
  const username = ctx.request.body.username;
  const password = ctx.request.body.password;
      console.log(ctx.cookies.get('sessionID'));
  try {
    const res = await findAccount(username, password);
    let ret = {
      code: 404,
      status: 'FAIL',
      msg: 'account not exist or wrong password'
    };
    if (res.length > 0) {
      ret = {
        code: 200,
        status: 'OK',
        data: ctx.cookies.get('sessionID')
      }
    }
    // return Promise.resolve(ret)
    ctx.body = ret;
  } catch (e) {
    // return Promise.reject({
    //   code: 'DATABASE_ERROR',
    //   msg: e.msg
    // })
    ctx.body = {
      code: 508,
      status: 'FAIL',
      msg: e.msg
    };
  }
}

/*
* 返回注册结果
* */
async function register(ctx) {
  const username = ctx.request.body.username;
  const password = ctx.request.body.password;
  try {
    const queryRes = await findAccount(username);
    let ret = {
      code: 404,
      status: 'FAIL',
      msg: 'account is exist'
    };
    if (queryRes.length < 1) {
      await insertAccount(username, password);
      ret = {
        code: 200,
        status: 'OK',
        data: null
      }
    }
    // return Promise.resolve(ret)
    ctx.body = ret;
  } catch (e) {
    // return Promise.reject({
    //   code: 'DATABASE_ERROR',
    //   msg: e.msg
    // })
    ctx.body = {
      code: 508,
      status: 'FAIL',
      msg: e.msg
    };
  }
}

module.exports = {
  login,
  register
};