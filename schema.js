const fetch = require('node-fetch')
const util = require('util')
const parseXml = util.promisify(require('xml2js').parseString)
const { GraphQLObjectType, GraphQLInt, GraphQLSchema, GraphQLString, GraphQLList } = require('graphql')

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  description: '...',
  fields: () => ({
    name: {
      type: GraphQLString,
      resolve: xml => xml.GoodreadsResponse.author[0].name[0]
    },
    books: {
      type: new GraphQLList(BookType),
      resolve: xml => xml.GoodreadsResponse.author[0].books[0].book
    }
  })
})

const BookType = new GraphQLObjectType({
  name: 'Book',
  description: '...',
  fields: () => ({
    title: {
      type: GraphQLString,
      resolve: xml => xml.title[0]
    },
    isbn: {
      type: GraphQLString,
      resolve: xml => {
        // console.log(JSON.stringify(xml.isbn));
        return xml.isbn[0]
      }
    }
  })
})

module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    description: '...',
    fields: () => ({
      author: {
        type: AuthorType,
        args: {
          id: { type: GraphQLInt }
        },
        resolve: (_, args) => fetch(
          `https://www.goodreads.com/author/show.xml?id=${args.id}&key=VckTh5FnQX4heFCrnLDeg`
        )
        .then(response => response.text())
        .then(parseXml)
      }
    })
  })
})