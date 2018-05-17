import itemModel from "srcDir/common/model/itemModel";
const configURL = require("srcRootDir/webpack-config/base/url.config.js");

const data = (config) => {
  let returnObj;
  if (config) {
    returnObj = itemModel({
      id: config.id,
      url: (configURL.remoteServer.facilityUrl || "") + `/wms/warehouses/${config.id}`,
      method: "GET",
      params: {
        warehouseId: config.id
      }
    });
  } else {
    returnObj = itemModel({
      url: (configURL.remoteServer.facilityUrl || "") + "/wms/warehouses/0",
      method: "GET",
    });
  }
  return returnObj;
};


export { data as default };
