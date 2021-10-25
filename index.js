const express = require('express')
const { Sequelize, DataTypes } = require('sequelize')
const Task = require('./models/task')

const app = express()
const sequelize = new Sequelize({ dialect: 'sqlite', storage: './task-list.db' })
const tasks = Task(sequelize, DataTypes)

// We need to parse JSON coming from requests
app.use(express.json())

// List tasks
app.get('/tasks', async (req, res) => {
 const list = await tasks.findAll()
  res.json(list)
})

// Create task
app.post('/tasks', async (req, res) => {
  const {description, done, createdAt, updadeAt} = req.body;

  const tar = {description, done, createdAt, updadeAt}
  
  const taskList = await tasks.create(tar)
  res.json(taskList)
})

// Show task
app.get('/tasks/:id', async(req, res) => {
  const taskId = req.params.id
  const findTask = await tasks.findByPk(req.params.id)
  res.send(findTask)
})

// Update task
/*app.put('/tasks/:id', async (req, res) => {
  const taskId = req.params.id
  const actualise = await tasks.findByPk({where: {id: req.params.id}})
  await tasks.update()

  res.send('tasks uptaded')
})
*/

app.put('/tasks/:id', async (req, res) => {
  const taskId = req.params.id
  const body = req.body
  const task = await tasks.findByPk(taskId)

  if (task) {
    await task.update({ ...body })
    res.send({ task })
  } else {
    res.status(404)
    res.send({ message: 'Task not found' })
  }
})



// Delete task
app.delete('/tasks/:id', async (req, res) => {
  const taskId = req.params.id
  await tasks.destroy({where: {id: req.params.id}})
  
})


app.listen(3000, () => {
  console.log('Iniciando o ExpressJS na porta 3000')
})
