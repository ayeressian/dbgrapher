import DbGrapherSchema from "../../db-grapher-schema";

const demoSchema: DbGrapherSchema = {
  dbGrapher: { type: "Generic" },
  tables: [
    {
      pos: { x: 1700.78, y: 305.16 },
      name: "pc_storage",
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
          name: "fk_storage_id",
          uq: false,
          nn: true,
          fk: { table: "storage", column: "id" },
          pk: false,
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
          name: "fk_ram_id",
          uq: false,
          nn: true,
          fk: { table: "ram", column: "id" },
        },
      ],
    },
    {
      pos: { x: 1271.44, y: 311.98 },
      name: "pc",
      columns: [
        { name: "id", type: "int", pk: true },
        {
          name: "fk_cpu_id",
          uq: false,
          nn: true,
          fk: { table: "cpu", column: "id" },
        },
        {
          name: "fk_motherboard_id",
          uq: false,
          nn: true,
          fk: { table: "motherboard", column: "id" },
        },
        {
          name: "fk_video_card_id",
          uq: false,
          nn: true,
          fk: { table: "video_card", column: "id" },
        },
        {
          name: "fk_psu_id",
          uq: false,
          nn: true,
          fk: { table: "psu", column: "id" },
        },
      ],
    },
    {
      pos: { x: 1282, y: 853 },
      name: "ram",
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
      name: "cpu",
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
      pos: { x: 810.94, y: 233.26 },
      name: "motherboard",
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
      pos: { x: 1695.06, y: 637.78 },
      name: "storage",
      columns: [
        { name: "id", type: "int", pk: true },
        { name: "make", type: "string", nn: true },
        { name: "model", type: "string", nn: true },
        { name: "capacity", type: "int", pk: false, nn: true },
        { name: "type", type: "ENUM('SSD', 'HDD')", nn: true },
      ],
    },
    {
      pos: { x: 1609.44, y: 20.32 },
      name: "psu",
      columns: [
        { name: "id", type: "int", pk: true },
        { name: "make", type: "string", nn: true },
        { name: "model", type: "string", nn: true },
        { name: "power", type: "int", nn: true },
      ],
    },
    {
      pos: { x: 1264.6, y: -18.82 },
      name: "video_card",
      columns: [
        { name: "id", type: "int", pk: true },
        { name: "make", type: "string", nn: true },
        { name: "model", type: "string", nn: true },
        { name: "memory", type: "int", nn: true },
      ],
    },
  ],
};
export default demoSchema;
