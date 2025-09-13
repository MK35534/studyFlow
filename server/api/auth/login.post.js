import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { executeQuery } from '~/lib/database.js'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, password } = body
    
    // Validation
    if (!email || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email et mot de passe requis'
      })
    }
    
    // Rechercher l'utilisateur
    const users = await executeQuery(
      'SELECT * FROM users WHERE email = ?',
      [email]
    )
    
    if (users.length === 0) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Email ou mot de passe incorrect'
      })
    }
    
    const user = users[0]
    
    // Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(password, user.password)
    
    if (!isValidPassword) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Email ou mot de passe incorrect'
      })
    }
    
    // Générer le token JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )
    
    // Retourner les données (sans le mot de passe)
    const { password: _, ...userWithoutPassword } = user
    
    return {
      success: true,
      token,
      user: userWithoutPassword,
      message: 'Connexion réussie'
    }
    
  } catch (error) {
    console.error('Erreur login:', error)
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur serveur lors de la connexion'
    })
  }
})