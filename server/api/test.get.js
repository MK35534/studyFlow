export default defineEventHandler(async (event) => {
  console.log('API TEST appelée !')
  return { message: 'Test API fonctionne' }
})