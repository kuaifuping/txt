import tableModel from "srcDir/common/model/tableModel";

const data = tableModel({
  url: "/sys/install/carrier/list",
  method: "POST",
  params: {
    pageSize: "10",
    // sort: "t.dispatchTime desc"
  }
});

export { data as default };
