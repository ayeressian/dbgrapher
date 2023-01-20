import { RelationStore } from "./relation";
import { SchemaStore } from "./schema";
import { TableStore } from "./table";
import { ViewStore } from "./view";

export class Store {
  schema = new SchemaStore(this);
  table = new TableStore();
  view = new ViewStore(this);
  relation = new RelationStore(this);
}
