import mysql from 'mysql2/promise'

let pool = null

export function getPool() {
  if (!pool) {
    // Utiliser directement process.env (côté serveur)
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'studyflow-studyflow.e.aivencloud.com',
      port: parseInt(process.env.DB_PORT || '23161'),
      user: process.env.DB_USER || 'maxou',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'studyflow',
      ssl: {
        rejectUnauthorized: false
      },
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    })
    console.log('✅ Pool de connexions MySQL créé')
    console.log(`   → User: ${process.env.DB_USER}, DB: ${process.env.DB_NAME}`)
  }
  return pool
}

export async function executeQuery(query, params = []) {
  try {
    const pool = getPool()
    const [rows] = await pool.execute(query, params)
    
    // Pour les INSERT, UPDATE, DELETE, retourner l'objet complet avec insertId, affectedRows, etc.
    if (query.trim().toUpperCase().startsWith('INSERT') || 
        query.trim().toUpperCase().startsWith('UPDATE') || 
        query.trim().toUpperCase().startsWith('DELETE')) {
      return rows
    }
    
    // Pour les SELECT, retourner les lignes
    return rows
  } catch (error) {
    console.error('Erreur requête SQL:', error)
    throw error
  }
}

// Fonction pour obtenir une connexion du pool si besoin
export async function getConnection() {
  const pool = getPool()
  return await pool.getConnection()
}
