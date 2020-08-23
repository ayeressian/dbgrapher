import Ajv from "ajv";
import validationSchema from "./validation-schema.json";
import { Schema } from "db-viewer-component";

const ajv = new Ajv();
const ajvCompiled = ajv.compile(validationSchema);

export function validateJson(dbSchema: Schema): boolean {
  const validJson = ajvCompiled(dbSchema);
  return validJson as boolean;
}
