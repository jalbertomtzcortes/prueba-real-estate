const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
  GraphQLSchema
} = require("graphql");

const driver = require("../config/neo4j");
const pool = require("../config/database");

const ProjectType = new GraphQLObjectType({
  name: "Project",
  fields: {
    name: { type: GraphQLString },
    zone: { type: GraphQLString },
    city: { type: GraphQLString },
    source: { type: GraphQLString }
  }
});

const CityType = new GraphQLObjectType({
  name: "City",
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    source: { type: GraphQLString }
  }
});

const Query = new GraphQLObjectType({
  name: "Query",
  fields: {

    projectsByCity: {
      type: new GraphQLList(ProjectType),
      args: {
        city: { type: new GraphQLNonNull(GraphQLString) }
      },

      resolve: async (_, args) => {
        if (!driver) return [];

        const session = driver.session();
        try {
          const result = await session.run(
            `
            MATCH (c:City {name:$city})-[:HAS_ZONE]->(z:Zone)-[:HAS_PROJECT]->(p:Project)
            RETURN c.name AS city, z.name AS zone, p.name AS name
            ORDER BY zone, name
            `,
            { city: args.city }
          );

          return result.records.map((record) => ({
            city: record.get("city"),
            zone: record.get("zone"),
            name: record.get("name"),
            source: "neo4j"
          }));
        } finally {
          await session.close();
        }
      }
    },

    projectsByCitySQL: {
      type: new GraphQLList(ProjectType),
      args: {
        city: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: async (_, args) => {
        const query = `
          SELECT p.name, z.name AS zone, c.name AS city
          FROM projects p
          JOIN zones z ON p.zone_id = z.id
          JOIN cities c ON z.city_id = c.id
          WHERE c.name = $1
          ORDER BY z.name, p.name
        `;
        const result = await pool.query(query, [args.city]);
        return result.rows.map((row) => ({ ...row, source: "postgres" }));
      }
    },

    citiesSQL: {
      type: new GraphQLList(CityType),
      resolve: async () => {
        const result = await pool.query(
          `SELECT id::text AS id, name FROM cities ORDER BY name`
        );
        return result.rows.map((row) => ({ ...row, source: "postgres" }));
      }
    }

  }
});

module.exports = new GraphQLSchema({
  query: Query
});
