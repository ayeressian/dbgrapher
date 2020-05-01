import schemaToSqlSchema from '../src/schema-to-sql-schema';
import schema from './school-schema.test.json';
import schemaSql from './school-schema.sql';

describe('schema-to-sql-schema', () => {
  it ('should return correct result', () => {
    expect(schemaToSqlSchema(schema)).toEqual(schemaSql);
  });
});