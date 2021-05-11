const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers

  const user = users.find(user => user.username === username)

  if (!user) {
    return response.status(404).send({ error: 'User not found!' })
  }

  request.user = user;

  return next();
}

app.post('/users', (request, response) => {
  const { name, username } = request.body

  const userAlreadyExists = users.some((user) => user.username === username)

  if(userAlreadyExists) {
    return response.status(400).json({ error: 'User already exists!' })
  }

  users.push({
    id: uuidv4(),
    name,
    username,
    todos: []
  })

  const user = users.find((user) => user.username === username)

  return response.status(201).json(user)
});

app.get('/users', (request, response) => {
  return response.json(users)
})

app.use(checksExistsUserAccount)

app.post('/todos', (request, response) => {
  const { title, deadline } = request.body
  const { user } = request

  todosOperation = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  }

  user.todos.push(todosOperation)

  return response.status(201).send()
});

app.get('/todos', (request, response) => {
  const { user } = request

  return response.status(200).json(user.todos)
});

app.put('/todos/:id', (request, response) => {
  const { id } = request.params
  const { user } = request
  const { title, deadline } = request.body

  const todoAlreadyExists = user.todos.find((todo) => todo.id === id)

  if(!todoAlreadyExists) {
    return response.status(400).json({ error: "Todo don't exists!" })
  }

  const indexTodo = user.todos.findIndex(todoIndex => todoIndex.id === id)

  user.todos[indexTodo].title = title
  user.todos[indexTodo].deadline = deadline

  return response.status(200).send()
});

app.patch('/todos/:id/done', (request, response) => {
  const { id } = request.params
  const { user } = request

  const todoAlreadyExists = user.todos.find((todo) => todo.id === id)

  if(!todoAlreadyExists) {
    return response.status(400).json({ error: "Todo don't exists!" })
  }

  const indexTodo = user.todos.findIndex(todoIndex => todoIndex.id === id)

  user.todos[indexTodo].done = true

  return response.status(200).send()
});

app.delete('/todos/:id', (request, response) => {
  const { id } = request.params
  const { user } = request

  const indexTodo = user.todos.findIndex(todoIndex => todoIndex.id === id)

  user.todos.splice(indexTodo, 1)

  return response.status(204).send()
});

module.exports = app;