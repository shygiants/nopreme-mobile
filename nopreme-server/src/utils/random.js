import { uniqueNamesGenerator } from "unique-names-generator";

import adjectives from "../assets/dictionaries/adjectives.json";
import names from "../assets/dictionaries/names.json";
import { nameExists } from "../db-schema/User";

const config = {
  dictionaries: [adjectives, names],
  length: 2,
  separator: " ",
};

export async function getInitialRandomName() {
  var name = uniqueNamesGenerator(config);

  while (await nameExists({ name })) {
    name = uniqueNamesGenerator(config);
  }

  return name;
}
