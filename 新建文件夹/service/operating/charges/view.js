import React from "react";
// import styles from "../../style.less";
import { Table, Button, Row, Col, Modal, notification } from "antd";
// import fetch from "srcDir/common/model/itemModel/fetch";
import Operating from "srcDir/resource/workeffort/company/operating/charges/operating/view";
const configURL = require("srcRootDir/webpack-config/base/url.config.js");
import fetch from "srcDir/common/model/itemModel/fetch";
const confirm = Modal.confirm;
const columns = e => [{
  title: "编号",
  dataIndex: "code",
  key: "code",
}, {
  title: "收费区间",
  dataIndex: "lgsQuantityBreakResultForm",
  key: "lgsQuantityBreakResultForm",
  render: (text) => <span>{text.fromQuantity}~{text.thruQuantity}</span>
}, {
  title: "单价",
  dataIndex: "priceUnitPrice",
  key: "priceUnitPrice",
}, {
  title: "单位",
  dataIndex: "priceUomCode",
  key: "priceUomCode",
  render: (text) => {
    let priceUnitPrice;
    if (text === "45") {
      priceUnitPrice = <span>吨</span>;
    } else if (text === "46") {
      priceUnitPrice = <span>立方米</span>;
    } else if (text === "19") {
      priceUnitPrice = <span>公斤</span>;
    } else if (text === "12") {
      priceUnitPrice = <span>件</span>;
    }
    return priceUnitPrice;
  //   <div className={styles.select}>
  //   <Select style={{ width: "100%", border: 0, background: "transparent" }} defaultValue={text}>
  //     <Option value="45">吨{text}</Option>
  //     <Option value="46">立方米{text}</Option>
  //     <Option value="19">公斤{text}</Option>
  //     <Option value="12">件{text}</Option>
  //   </Select>
  //   {text}
  // </div>
  }
}, {
  title: "操作",
  dataIndex: "id",
  key: "id",
  render: (text, record) =>
    (<div style={{ cursor: "pointer" }}>
        {
          !e.props.status.disable ? <div style={{ color: "rgba(0,0,0,.25)" }}><span>
              编辑
          </span><span style={{ paddingLeft: 15 }}>
              删除
          </span></div> : <div style={{ color: "#108ee9" }}>
            <span onClick={() => { e.showModal("edit", record); }}>
            编辑
            </span>
            <span style={{ paddingLeft: 15 }} onClick={() => { e.delete(record); }}>
            删除
            </span>
          </div>
        }
    </div>)
}];
const operating = {
  add(e, data) {
    e.setState({
      data: data,
      visible: true,
      status: "add",
    });
  },
  edit(e, data) {
    e.setState({
      data: data,
      visible: true,
      status: "edit"
    });
  },
};
class View extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: columns(this),
      dataSource: [],
      status: true,
    };
    this.showModal = this.showModal.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.getdata = this.getdata.bind(this);
    this.delete = this.delete.bind(this);
    // this.onChange = this.onChange.bind(this);
  }
  componentDidMount() {
    this.getdata(this.props.partyCode);
  }
  // componentWillReceiveProps(nextProps) {
  //   console.log(nextProps);
  // }
  // onChange(text, code) {
  //   // console.log(text, code);
  //   const _this = this;
  //   confirm({
  //     title: "确定设置" + text.name + "默认联系人？",
  //     // content: 'Some descriptions',
  //     onOk() {
  //       fetch({
  //         url: "/sys/contact/updateContactPriority?partyCode=" + code + "&relationshipCode=" + text.relationshipCode,
  //         method: "POST",
  //         params: {
  //           partyCode: code,
  //           relationshipCode: text.relationshipCode,
  //         },
  //         success: function (response) {
  //           if (response.entity.code === "SUCCESS") {
  //             notification.success({
  //               message: response.entity.msg,
  //             });
  //             _this.getdata(code);
  //           } else {
  //             notification.error({
  //               message: response.entity.msg,
  //             });
  //           }
  //         },
  //         error() {

  //         }
  //       });
  //     },
  //     onCancel() {
  //       // console.log("Cancel");
  //     },
  //   });
  // }
  getdata(partyCode) {
    const _this = this;
    fetch({
      url: configURL.remoteServer.financeUrl + "/basics/lgsShipmentCostEstimate/listByPartyCode",
      method: "POST",
      params: {
        partyCode: partyCode,
      },
      success: function (response) {
        // console.log(response);
        if (response.entity.code === "SUCCESS") {
          _this.setState({
            dataSource: response.entity.data,
          });
        }
      },
      error() {
      }
    });
  }
  showModal(e, data) {
    operating[e](this, data);
  }
  handleOk() {
    this.setState({ visible: false });
  }
  handleCancel(e) {
    if (e === "SUCCESS") {
      this.getdata(this.props.partyCode);
    }
    this.setState({ visible: false });
  }
  delete(record) {
    const _this = this;
    confirm({
      title: "确定要删除收费区间" + record.lgsQuantityBreakResultForm.fromQuantity + "~" + record.lgsQuantityBreakResultForm.fromQuantity + "?",
      // content: "确定要删除" + record.loginName + "?",
      okText: "确定",
      okType: "danger",
      cancelText: "取消",
      onOk() {
        fetch({
          url: configURL.remoteServer.financeUrl + "/basics/lgsShipmentCostEstimate/remove", // ?code=" + record.code,
          method: "GET",
          params: {
            code: record.code,
          },
          success: function (response) {
            if (response.entity.code === "SUCCESS") {
              notification.success({
                message: response.entity.msg,
              });
              _this.getdata(_this.props.partyCode);
            } else {
              notification.error({
                message: response.entity.msg,
              });
            }
          },
          error() {

          }
        });
      },
      onCancel() {
      },
    });
  }
  render() {
    const open = !this.props.status.disable;
    return (
      <div style={{ padding: 10 }}>
        <Row style={{ marginBottom: 10 }}>
          <Col span={2} offset={22} style={{ textAlign: "right" }}>
            <Button icon="plus" type="primary" disabled={open} onClick={() => { this.showModal("add", null); }}>新增</Button>
          </Col>
        </Row>
        <Table
          rowKey="code"
          dataSource={this.state.dataSource}
          columns={this.state.columns}
          pagination={null}
        />
        <Modal
          visible={this.state.visible}
          title="收费标准"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
        >
          <Operating data={this.state.data} status={this.state.status} partyCode={this.props.partyCode} cancel={(e) => { this.handleCancel(e); }} />
        </Modal>
      </div>
    );
  }
}
// const View1 = Form.create()(View);
export { View as default };
