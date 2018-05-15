import React from "react";
// import styles from "./style.less";
import { Table, Button, Row, Col, Modal } from "antd";
// import fetch from "srcDir/common/model/itemModel/fetch";
import Operating from "srcDir/resource/workeffort/company/operating/contactPerson/operating/view";
// import BasicInformation from "srcDir/party/supplier/detail/basicInformation/view";
// const TabPane = Tabs.TabPane;
const dataSource = [{
  key: "1",
  name: "胡彦斌",
  age: 32,
  address: "西湖区湖底公园1号",
  img: "yyy",
  bank: "143214321",
  bankname: "黄飞鸿",
  id: "1ßß"

}, {
  key: "2",
  name: "胡彦斌1",
  age: 3222,
  address: "西湖区湖底公园1号",
  img: "yyy1",
  bank: "1432143211",
  bankname: "黄飞鸿2",
  id: "133"

}];
const operating = {
  add(e, data) {
    e.setState({
      data: data,
      visible: true,
    });
  },
  edit(e, data) {
    e.setState({
      data: data,
      visible: true,
    });
  },
};
const columns = e => [{
  title: "编号",
  dataIndex: "name",
  key: "name",
}, {
  title: "国家",
  dataIndex: "age",
  key: "age",
}, {
  title: "货币",
  dataIndex: "address",
  key: "address",
}, {
  title: "开户行",
  dataIndex: "img",
  key: "img",
}, {
  title: "银行账号",
  dataIndex: "bank",
  key: "bank",
}, {
  title: "账户名",
  dataIndex: "bankname",
  key: "bankname",
}, {
  title: "默认账户",
  dataIndex: "id",
  key: "id",
  render: (text) => {
    console.log(text);
    return (
      <div>
        是
      </div>
    );
  }
}, {
  title: "操作",
  dataIndex: "key",
  key: "key",
  render: (text, record) => {
    console.log(text);
    return (
      <div style={{ cursor: "pointer" }}>
        <span onClick={() => { e.showModal("edit", record); }}>
          编辑
        </span>
        <span style={{ paddingLeft: 15 }} >
          删除
        </span>
      </div>
    );
  }
}];

class View extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: columns(this)
    };
    this.showModal = this.showModal.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }
  // componentDidMount() {
  //   // console.log();
  //   this.setInitialValue(this.props);
  // }
  showModal(e, data) {
    operating[e](this, data);
  }
  handleOk() {
    this.setState({ visible: false });
  }
  handleCancel() {
    this.setState({ visible: false });
  }
  render() {
    return (
      <div style={{ padding: 10 }}>
        <Row style={{ marginBottom: 10 }}>
          <Col span={2} offset={22} style={{ textAlign: "right" }}>
            <Button icon="plus" type="primary" onClick={() => { this.showModal("add", null); }}>新增</Button>
          </Col>
        </Row>
        <Table dataSource={dataSource} columns={this.state.columns} />
        <Modal
          visible={this.state.visible}
          title="银行信息"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
        >
          <Operating data={this.state.data} cancel={() => { this.handleCancel(); }} />
        </Modal>
      </div>
    );
  }
}
export { View as default };
