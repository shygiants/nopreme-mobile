import fs from "fs";
import path from "path";
import { schema } from "../graphql-schema";
import { schema as publicSchema } from "../graphql-schema/public";
import { printSchema } from "graphql";

const schemaPath = path.resolve(__dirname, "../../../data/schema.graphql");
const publicSchemaPath = path.resolve(
  __dirname,
  "../../../data/publicSchema.graphql"
);

fs.writeFileSync(schemaPath, printSchema(schema));
fs.writeFileSync(publicSchemaPath, printSchema(publicSchema));

console.log("Wrote " + schemaPath);
