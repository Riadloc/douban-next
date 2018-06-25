const database = require("../static/config")
const mysql = require("mysql")

const table = 'douban';
const pool = mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : 'corejava',
  database : 'world'
});


let query = function( sql, values ) {

  return new Promise(( resolve, reject ) => {
    pool.getConnection(function(err, connection) {
      if (err) {
        console.error(err);
        resolve( err )
      } else {
        connection.query(sql, values, ( err, rows) => {

          if ( err ) {
            console.error(err);
            reject( err )
          } else {
            resolve( rows )
          }
          connection.release()
        })
      }
    })
  })

}

let createTable = function( sql ) {
  return query( sql, [] )
}


let findDataById = function( {table='douban',  id} ) {
  let  _sql =  "SELECT * FROM ?? WHERE id = ? "
  return query( _sql, [ table, id] )
}


let findDataByParams = function({page=1,pageSize=12,keyword,rentRange=[0,10000],unit,order='update_time'}) {
  const start = (page - 1) * pageSize;
  let  _sql =  "SELECT * FROM ?? WHERE title REGEXP ? AND (rent>=? AND rent <=?) AND unit REGEXP ? ORDER BY ?? DESC LIMIT ? , ?"
  return query( _sql, [table, keyword, rentRange[0], rentRange[1], unit, order, start, pageSize ] )
}


let insertData = function(values ) {
  let _sql = "REPLACE INTO douban SET ?"
  return query( _sql, values)
}


let updateData = function( table, values, id ) {
  let _sql = "UPDATE ?? SET ? WHERE id = ?"
  return query( _sql, [ table, values, id ] )
}


let deleteDataById = function( table, id ) {
  let _sql = "DELETE FROM ?? WHERE id = ?"
  return query( _sql, [ table, id ] )
}


let select = function( table, keys ) {
  let  _sql =  "SELECT ?? FROM ?? "
  return query( _sql, [ keys, table ] )
}

let count = function( {keyword,rentRange=[0,10000],unit} ) {
  let  _sql =  "SELECT COUNT(*) AS total_count FROM ?? WHERE title REGEXP ? AND (rent>=? AND rent <=?) AND unit REGEXP ?"
  return query( _sql, [ table, keyword, rentRange[0], rentRange[1], unit ] )
}

module.exports = {
  query,
  createTable,
  findDataById,
  findDataByParams,
  deleteDataById,
  insertData,
  updateData,
  select,
  count,
}
