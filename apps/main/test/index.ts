import chai from "chai";
import chaiDom from "chai-dom";
chai.use(chaiDom);

import "../src/components/import-components";

import "./component/dialog/dialog.test";
import "./component/side-panel.test";
import "./component/dialog/new-open-dialog.test";
import "./component/top-menu/top-menu.test";
import "./component/dialog/table-dialog/table-dialog.test";
import "./component/dialog/table-dialog/column.test";
import "./component/dialog/about-dialog.test";

import "./db-types/db-types.test";
import "./store/slice/schema.test";
