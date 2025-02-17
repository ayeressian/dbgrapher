import DbGrapherSchema from "../../db-grapher-schema";

const demoSchema: DbGrapherSchema = {
  dbGrapher: { type: "Generic" },
  tables: [
    {
      pos: { x: 1282, y: 853 },
      name: "ram_model",
      columns: [
        { name: "id", type: "int", pk: true },
        { name: "make", type: "string", nn: true },
        { name: "model", type: "string", uq: true, nn: true },
        { name: "speed", type: "int", pk: false, uq: true, nn: true },
        { name: "type", type: "ENUM('ddr4', 'ddr5')", nn: true },
      ],
    },
    {
      pos: { x: 830.78, y: 583.72 },
      name: "cpu_model",
      columns: [
        { name: "id", type: "int", pk: true },
        { name: "make", type: "string", nn: true },
        { name: "model", type: "string", pk: false, nn: true, uq: true },
        { name: "base_clock", type: "int", pk: false, uq: false, nn: true },
        { name: "boost_clock", type: "int", uq: false, nn: false },
        { name: "l1_cache", type: "int", nn: true },
        { name: "l2_cache", type: "int", nn: true },
      ],
    },
    {
      pos: { x: 815.94, y: 247.26 },
      name: "motherboard_model",
      columns: [
        { name: "id", type: "int", pk: true },
        { name: "make", type: "string", nn: true },
        { name: "model", type: "string", nn: true },
        { name: "socket", type: "string", nn: true },
        { name: "ram_type", type: "ENUM('ddr4', 'ddr5')", nn: true },
        { name: "chipset", type: "string", nn: true },
      ],
    },
    {
      pos: { x: 1270.44, y: 310.98 },
      name: "pc",
      columns: [
        { name: "id", type: "int", pk: true },
        {
          name: "fk_cpu_model_id",
          uq: true,
          nn: true,
          fk: { table: "cpu_model", column: "id" },
        },
        {
          name: "fk_psu_model_id",
          uq: true,
          nn: true,
          fk: { table: "psu_model", column: "id" },
        },
        {
          name: "fk_motherboard_model_id",
          uq: true,
          nn: true,
          fk: { table: "motherboard_model", column: "id" },
        },
      ],
    },
    {
      pos: { x: 1277.5, y: 558.9 },
      name: "pc_ram",
      columns: [
        { name: "id", type: "int", pk: true },
        {
          name: "fk_pc_id",
          uq: false,
          nn: true,
          fk: { table: "pc", column: "id" },
        },
        {
          name: "fk_ram_model_id",
          uq: false,
          nn: true,
          fk: { table: "ram_model", column: "id" },
        },
      ],
    },
    {
      pos: { x: 1700.78, y: 305.16 },
      name: "storage",
      columns: [
        { name: "id", type: "int", pk: true },
        {
          name: "fk_pc_id",
          uq: false,
          nn: true,
          fk: { table: "pc", column: "id" },
          pk: false,
        },
        {
          name: "fk_storage_model_id",
          uq: false,
          nn: true,
          fk: { table: "storage_model", column: "id" },
          pk: false,
        },
      ],
    },
    {
      pos: { x: 1609.44, y: 20.32 },
      name: "psu_model",
      columns: [
        { name: "id", type: "int", pk: true },
        { name: "make", type: "string", nn: true },
        { name: "model", type: "string", nn: true },
        { name: "power", type: "int", nn: true },
      ],
    },
    {
      pos: { x: 1263.86, y: 31.59 },
      name: "video_card",
      columns: [
        { name: "id", type: "int", pk: true },
        {
          name: "fk_pc_id",
          uq: false,
          nn: true,
          fk: { table: "pc", column: "id" },
        },
        {
          name: "fk_video_card_model_id",
          uq: false,
          nn: true,
          fk: { table: "video_card_model", column: "id" },
        },
      ],
    },
    {
      pos: { x: 1264.6, y: -204.82 },
      name: "video_card_model",
      columns: [
        { name: "id", type: "int", pk: true },
        { name: "make", type: "string", nn: true },
        { name: "model", type: "string", nn: true },
        { name: "memory", type: "int", nn: true },
      ],
    },
    {
      pos: { x: 2045.06, y: 299.78 },
      name: "storage_model",
      columns: [
        { name: "id", type: "int", pk: true },
        { name: "make", type: "string", nn: true },
        { name: "model", type: "string", nn: true },
        { name: "capacity", type: "int", pk: false, nn: true },
        { name: "type", type: "ENUM('SSD', 'HDD')", nn: true },
      ],
    },
  ],
};
export default demoSchema;
