import tableModel from "srcDir/common/model/tableModel";
const configURL = require("srcRootDir/webpack-config/base/url.config.js");

const data = tableModel({
  url: (configURL.remoteServer.productUrl || "") + "/price/product/page",
  method: "POST",
  params: {
    pageNo: 1,
    pageSize: 20,
  }
});

export { data as default };
