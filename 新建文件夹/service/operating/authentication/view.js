import React from "react";
// import styles from "./style.less";
import { Table, Button, Row, Col, Modal, notification } from "antd";
import Operating from "srcDir/party/distributor/detail/qualification/operating/view";
import fetch from "srcDir/common/model/itemModel/fetch";
// import BasicInformation from "srcDir/party/supplier/detail/basicInformation/view";
// const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;
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
const columns = e => [{
  title: "编号",
  dataIndex: "contentCode",
  key: "contentCode",
}, {
  title: "附件名称",
  dataIndex: "contentName",
  key: "contentName",
}, {
  title: "图片",
  dataIndex: "contentDesc",
  key: "contentDesc",
  width: 150,
  render: (text, record) =>
    (<div>
      <img
        src={text} alt={record.contentName}
        style={{ cursor: "pointer", width: "80%" }}
        onClick={() => {
          e.setState({
            previewImage: text || "",
            previewVisible: true,
          });
        }}
      />
    </div>)
}, {
  title: "操作",
  dataIndex: "code",
  key: "code",
  render: (text, record) =>
    (<div style={{ cursor: "pointer" }}>
      <span onClick={() => { e.showModal("edit", record); }}>
        编辑
      </span>
      <span style={{ paddingLeft: 15 }} onClick={() => e.delete(record)}>
        删除
      </span>
    </div>)
}];

class View extends React.Component {
  constructor(props) {
    super(props);
    // console.log(props);
    this.state = {
      columns: columns(this),
      visible: false,
      data: null,
      dataSource: [],
      status: true,
      previewVisible: false,
      previewImage: ""
    };
    // this.handleSubmit = this.handleSubmit.bind(this);
    this.showModal = this.showModal.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.delete = this.delete.bind(this);
    this.getdata = this.getdata.bind(this);
  }
  componentDidMount() {
    // console.log();
    // const _this = this;
    // fetch({
    //   url: "/sys/qual/list?partyCode=" + _this.props.partyCode,
    //   method: "GET",
    //   params: {
    //     // partyCode: _this.props.partyCode,
    //   },
    //   success: function (response) {
    //     // console.log(response);
    //     if (response.entity.code === "SUCCESS") {
    //       _this.setState({
    //         dataSource: response.entity.data,
    //       });
    //     }
    //   },
    //   error() {
    //   }
    // });
    this.getdata(this.props.partyCode);
  }
  getdata(partyCode) {
    const _this = this;
    fetch({
      url: "/sys/qual/list?partyCode=" + partyCode,
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
      title: "确定要删除" + record.contentName + "?",
      // content: "确定要删除" + record.loginName + "?",
      okText: "确定",
      okType: "danger",
      cancelText: "取消",
      onOk() {
        fetch({
          url: "/sys/qual/del?code=" + record.code,
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
    return (
      <div style={{ padding: 10 }}>
        <Row style={{ marginBottom: 10 }}>
          <Col span={2} offset={22} style={{ textAlign: "right" }}>
            <Button icon="plus" type="primary" onClick={() => { this.showModal("add", null); }}>新增</Button>
          </Col>
        </Row>
        <Table
          dataSource={this.state.dataSource}
          columns={this.state.columns}
          // bordered
          // title={() => <Button icon="plus">新增</Button>}
        />
        <Modal
          visible={this.state.visible}
          title="资质管理"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
        >
          <Operating data={this.state.data} status={this.state.status} partyCode={this.props.partyCode} cancel={(e) => { this.handleCancel(e); }} />
        </Modal>
        <Modal
          visible={this.state.previewVisible}
          footer={null}
          zIndex={12}
          onCancel={() => {
            this.setState({ previewVisible: false });
          }}
        >
          <img alt="资质图片" style={{ width: "100%" }} src={this.state.previewImage} />
        </Modal>
      </div>
    );
  }
}
export { View as default };
