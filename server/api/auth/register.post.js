import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { executeQuery } from '~/lib/database.js'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { firstname, lastname, email, password } = body
    
    // Validation
    if (!firstname || !lastname || !email || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Tous les champs sont requis'
      })
    }
    
    if (password.length < 6) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Le mot de passe doit contenir au moins 6 caractères'
      })
    }
    
    // Validation email simple
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Format d\'email invalide'
      })
    }
    
    // Vérifier si l'email existe déjà
    const existingUsers = await executeQuery(
      'SELECT id FROM users WHERE email = ?',
      [email]
    )
    
    if (existingUsers.length > 0) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Un compte avec cet email existe déjà'
      })
    }
    
    // Hacher le mot de passe
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    
    // Créer l'utilisateur
    const result = await executeQuery(
      'INSERT INTO users (firstname, lastname, email, password) VALUES (?, ?, ?, ?)',
      [firstname.trim(), lastname.trim(), email.toLowerCase(), hashedPassword]
    )
    
    // Récupérer l'utilisateur créé
    const newUser = await executeQuery(
      'SELECT id, firstname, lastname, email, created_at FROM users WHERE id = ?',
      [result.insertId]
    )
    
    const user = newUser[0]
    
    // Générer le token JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )
    
    return {
      success: true,
      token,
      user,
      message: 'Compte créé avec succès'
    }
    
  } catch (error) {
    console.error('Erreur register:', error)
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur serveur lors de la création du compte'
    })
  }
})