import tableModel from "srcDir/common/model/tableModel";
const data = (id) => tableModel({
  url: "sys/install/carrier/view?code=" + id.id,
  method: "GET",
  params: {
    // _index: "1",
    // id: id.id,
    // sort: "t.lastModifiedDate desc",
    // "Q_t.apAssetInfo.id_eq_long": id
  }
});

export { data as default };
