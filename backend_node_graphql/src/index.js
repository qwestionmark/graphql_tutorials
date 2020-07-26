const { GraphQLServer } = require('graphql-yoga')

const links = [{
  id: 'link-0',
  url: 'www.howtographql.com',
  description: 'Fullstack tutorial for GraphQL'
}]

let idCount = links.length
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: () => links,
    link: (id) => links.find(link => link.id ===`link-${id}`),
  },
  Mutation: {
    post: (parent, args) => {
       const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url,
      }
      links.push(link)
      return link
    },
    updateLink: (parent, args) => {
      const { id, url, description } = args;
      const linkIdx = links.findIndex(link => link.id === `link-${id}`);
      const link = links[linkIdx];
      if (!link) return 'No link found with that ID';
      if (url) link.url = url;
      if (description) link.description = description;
      links.splice(linkIdx, 1, link);
      return link
    },
    deleteLink: (parent, args) => {
      const id = args.id;
      const linkIdx = links.findIndex(link => link.id === `link-${id}`);
      const link = links[linkIdx];
      if (!link) return 'No link found with that ID';
      links.splice(linkIdx, 1);
      return link
    }
    
  },
}


const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
})
server.start(() => console.log(`Server is running on http://localhost:4000`))
