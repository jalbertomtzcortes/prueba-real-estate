const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLSchema
} = require("graphql");

const driver = require("../config/neo4j");

const ProjectType = new GraphQLObjectType({
  name: "Project",
  fields: {
    name: { type: GraphQLString }
  }
});

const Query = new GraphQLObjectType({
  name: "Query",
  fields: {

    projectsByCity: {
      type: new GraphQLList(ProjectType),
      args: {
        city: { type: GraphQLString }
      },

      resolve: async (_, args) => {

        const session = driver.session();

        const result = await session.run(
          `
          MATCH (c:City {name:$city})
          -[:HAS_ZONE]->
          (z:Zone)
          -[:HAS_PROJECT]->
          (p:Project)

          RETURN p
          `,
          { city: args.city }
        );

        return result.records.map(r => r.get("p").properties);
      }
    }

  }
});

module.exports = new GraphQLSchema({
  query: Query
});