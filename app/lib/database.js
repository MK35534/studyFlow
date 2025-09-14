import mysql from 'mysql2/promise'

let connection = null

export async function getConnection() {
  if (!connection) {
    try {
      connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 23161,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'studyflow'
      })
      
      console.log('✅ Connexion MySQL établie')
    } catch (error) {
      console.error('❌ Erreur connexion MySQL:', error)
      throw error
    }
  }
  
  return connection
}

export async function executeQuery(query, params = []) {
  try {
    const conn = await getConnection()
    const [rows] = await conn.execute(query, params)
    return rows
  } catch (error) {
    console.error('❌ Erreur requête SQL:', error)
    throw error
  }
}