const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json') // Replace with your db.json path

server.use(jsonServer.defaults())

// User Endpoints (all assuming /users as the base URL)
server.get('/users', (req, res) => {
  // GET all users
  res.json(router.db.get('users').value())
})

server.post('/users', (req, res) => {
  // POST a new user (assign a unique ID)
  const newUser = { ...req.body, id: Math.random().toString(36).substring(2, 15) }
  router.db.get('users').push(newUser).write()
  res.json(newUser)
})

server.put('/users/:id', (req, res) => {
  // PUT update user data
  const { id } = req.params;
  const userIndex = router.db.get('users').findIndex(user => user.id === id)
  if (userIndex !== -1) {
    router.db.get('users').splice(userIndex, 1, req.body).write()
    res.json(req.body)
  } else {
    res.sendStatus(404) // User not found
  }
})

server.delete('/users/:id', (req, res) => {
  // DELETE a user
  const { id } = req.params;
  const userIndex = router.db.get('users').findIndex(user => user.id === id)
  if (userIndex !== -1) {
    router.db.get('users').splice(userIndex, 1).write()
    res.sendStatus(204) // No content to return on successful delete
  } else {
    res.sendStatus(404) // User not found
  }
})

server.listen(3000, () => {
  console.log('JSON Server is running')
})
