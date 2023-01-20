import type { Schema } from "../lib/schema";

const school: Schema = {
  annotations: [
    {
      title: "Annotation 1",
      text: "Description 1",
      width: 800,
      height: 600,
      pos: {
        x: 1200,
        y: 1200,
      },
    },
    {
      title: "Annotation 2",
      text: "Description 2",
      width: 300,
      height: 200,
      pos: {
        x: 1400,
        y: 1100,
      },
    },
  ],
  tables: [
    {
      name: "school",
      pos: {
        x: 722,
        y: 560,
      },
      columns: [
        {
          name: "id",
          pk: true,
          type: "int",
        },
        {
          name: "cpacity",
          type: "int",
        },
        {
          name: "name",
          type: "string",
        },
        {
          name: "address",
          type: "string",
        },
      ],
    },
    {
      name: "class",
      pos: {
        x: 620,
        y: 306,
      },
      columns: [
        {
          name: "id",
          pk: true,
          type: "int",
        },
        {
          name: "grade",
          type: "int",
        },
        {
          name: "school_id",
          fk: {
            table: "school",
            column: "id",
          },
          nn: true,
          uq: true,
        },
      ],
    },
    {
      name: "student",
      pos: {
        x: 271,
        y: 407,
      },
      columns: [
        {
          name: "id",
          pk: true,
          type: "int",
        },
        {
          name: "firstname",
          type: "string",
        },
        {
          name: "lastname",
          type: "string",
        },
        {
          name: "age",
          type: "int",
        },
        {
          name: "class_id",
          fk: {
            table: "class",
            column: "id",
          },
          nn: false,
        },
        {
          name: "class2_id",
          fk: {
            table: "class",
            column: "id",
          },
          nn: false,
        },
        {
          name: "friend",
          fk: {
            table: "student",
            column: "id",
          },
        },
      ],
    },
  ],
};

export default school;
