import type DbViewer from "lib/component/DBViewer/DBViewer";
import "../lib/main";
// import bigSchema from "./big-schema";
import schema from "./school";

window.onload = async () => {
  const dbViewerElem = document.createElement("db-viewer") as DbViewer;
  document.body.appendChild(dbViewerElem);
  await Promise.resolve();
  dbViewerElem.setSchema(schema, "centerByTables");

  setTimeout(() => {
    dbViewerElem.setSchema(schema, "centerByTables");
    console.log("new set");
  }, 2000);

  dbViewerElem.addEventListener("tableClick", (event) => {
    console.log("tableClick", event.detail);
  });

  dbViewerElem.addEventListener("tableDblClick", (event) => {
    console.log("tableDblClick", event.detail);
  });

  dbViewerElem.addEventListener("tableContextMenu", (event) => {
    console.log("tableContextMenu", event.detail);
  });

  dbViewerElem.addEventListener("relationClick", (event) => {
    console.log("relationClick", event.detail);
  });

  dbViewerElem.addEventListener("relationDblClick", (event) => {
    console.log("relationDblClick", event.detail);
  });

  dbViewerElem.addEventListener("relationContextMenu", (event) => {
    console.log("relationContextMenu", event.detail);
  });

  dbViewerElem.addEventListener("viewportClick", (event) => {
    console.log("viewportClick", event.detail);
  });

  dbViewerElem.addEventListener("viewportClick", (event) => {
    console.log("viewportClick", event.detail);
  });

  dbViewerElem.addEventListener("zoom", (event) => {
    console.log("zoom", event.detail);
  });

  // const dbViewerElem2 = document.createElement("db-viewer");
  // document.body.appendChild(dbViewerElem2);
  // dbViewerElem2.setSchema(schema, "centerByTables");
  // setTimeout(() => {
  //   console.log("loaded");
  //   dbViewerElem.setSchema({...bigSchema}, "centerByTables");
  // }, 2000);
};
