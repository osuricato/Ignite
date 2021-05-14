import express from 'express'

import { createCourse } from './routes';

const app = express()

app.get('/', createCourse)

app.listen(3333, () => {
  console.log('Server is running on port 3333.')
})

export default app