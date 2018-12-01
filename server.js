const express = require('express');
const app = express()
const graphqlHttp = require('express-graphql')

const schema = require('./schema');

app.use('/graphql', graphqlHttp({
  schema,
  graphiql: true
}))

app.listen(4000)
console.log('listening...')