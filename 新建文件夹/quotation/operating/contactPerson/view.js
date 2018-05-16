import React from "react";
// import styles from "./style.less";
import { Table, Button, Row, Col, Modal, notification, Radio } from "antd";
// import fetch from "srcDir/common/model/itemModel/fetch";
import Operating from "srcDir/resource/workeffort/company/operating/contactPerson/operating/view";
import fetch from "srcDir/common/model/itemModel/fetch";
// import BasicInformation from "srcDir/party/supplier/detail/basicInformation/view";
// const TabPane = Tabs.TabPane;
// const dataSource = [{
//   key: "1",
//   sn: "1",
//   name: "胡彦斌",
//   size: "boss",
//   sex: "男",
//   iphone: "130000",
//   phone: "88777",
//   email: "342@yy.com",
//   remarks: "不错"

// }];
const confirm = Modal.confirm;
const columns = e => [{
  title: "编号",
  dataIndex: "code",
  key: "code",
}, {
  title: "姓名",
  dataIndex: "name",
  key: "name",
}, {
  title: "性别",
  dataIndex: "gender",
  key: "gender",
  render: (text) => {
    if (text === "0") {
      return <span>女</span>;
    } else if (text === "1") {
      return <span>男</span>;
    } else if (text === "2") {
      return <span>未知</span>;
    }
  }
}, {
  title: "手机号码",
  dataIndex: "mobile",
  key: "iphone",
}, {
  title: "座机号码",
  dataIndex: "telephone",
  key: "telephone",
}, {
  title: "邮箱",
  dataIndex: "email",
  key: "email",
}, {
  title: "备注",
  dataIndex: "comments",
  key: "comments",
}, {
  title: "默认联系人",
  dataIndex: "priorityTypeCode",
  key: "priorityTypeCode",
  render: (text, record) => <Radio onChange={() => e.onChange(record, e.props.partyCode)} checked={text === "1" ? 1 : 0} >{}</Radio>
}, {
  title: "操作",
  dataIndex: "",
  key: "",
  render: (text, record) =>
    // console.log(text);
    <div style={{ cursor: "pointer" }}>
      {/* <span onClick={() => { e.showModal("edit", record); }} style={{ color: "#108ee9" }}>
        编辑
      </span>
      <span style={{ paddingLeft: 15, color: "#108ee9" }} onClick={() => { e.delete(record); }} >
        删除
      </span> */}
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
    </div>
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
    this.onChange = this.onChange.bind(this);
  }
  componentDidMount() {
    this.getdata(this.props.partyCode);
  }
  // componentWillReceiveProps(nextProps) {
  //   console.log(nextProps);
  // }
  onChange(text, code) {
    const _this = this;
    confirm({
      title: "确定设置" + text.name + "默认联系人？",
      // content: 'Some descriptions',
      onOk() {
        fetch({
          url: "/sys/contact/updateContactPriority?partyCode=" + code + "&relationshipCode=" + text.relationshipCode,
          method: "POST",
          params: {
            partyCode: code,
            relationshipCode: text.relationshipCode,
          },
          success: function (response) {
            if (response.entity.code === "SUCCESS") {
              notification.success({
                message: response.entity.msg,
              });
              _this.getdata(code);
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
        // console.log("Cancel");
      },
    });
  }
  getdata(partyCode) {
    const _this = this;
    fetch({
      url: "/sys/contact/list?partyCode=" + partyCode,
      method: "GET",
      params: {
        // partyCode: _this.props.partyCode,
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
      title: "确定要删除" + record.name + "?",
      // content: "确定要删除" + record.loginName + "?",
      okText: "确定",
      okType: "danger",
      cancelText: "取消",
      onOk() {
        fetch({
          url: "/sys/contact/del?code=" + record.code,
          method: "DELETE",
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
        <Table dataSource={this.state.dataSource} columns={this.state.columns} pagination={false} />
        <Modal
          visible={this.state.visible}
          title="联系人员"
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
