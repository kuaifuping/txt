import React from "react";
// import moment from "moment";
// import styles from "./style.less";
import { Table } from "antd";
import fetch from "srcDir/common/model/itemModel/fetch";

// 创建react组件
const routeAddress = {
  add(addRoute, item) {
    addRoute({
      keyName: "",
      path: "/resource/workeffort/person/operating/add",
      name: "资源", title: "/resource/workeffort/person/operating/add",
      component: "resource/workeffort/person/operating/add",
      paramId: item
    });
  },
  editOrDetail(addRoute, item) {
    addRoute({
      keyName: "",
      path: "/resource/workeffort/person/operating/edit",
      name: "资源", title: "/resource/workeffort/person/operating/edit",
      component: "resource/workeffort/person/operating/edit",
      paramId: item
    });
  }
};

const routeChecked = {
  add(_this, val) {
    routeAddress.add(_this, val);
  },
  edit(_this, val) {
    routeAddress.editOrDetail(_this, val);
  },
  detail(_this, val) {
    routeAddress.editOrDetail(_this, val);
  }
};

const columns = target => [
  {
    title: "ID",
    dataIndex: "code",
    key: "code",
  }, {
    title: "姓名",
    dataIndex: "name",
    key: "name",
  }, {
    title: "手机号",
    dataIndex: "mobile",
    key: "mobile",
  }, {
    title: "座机电话",
    dataIndex: "telephone",
    key: "telephone",
  }, {
    title: "电子邮箱",
    dataIndex: "email",
    key: "email",
  }, {
    title: "微信号",
    dataIndex: "wechat",
    key: "wechat",
  }, {
    title: "备注",
    dataIndex: "comments",
    key: "comments",
  }, {
    title: "操作",
    width: 120,
    // className: styles.tableStyle,
    render: (text, record) =>
      <div>
        <span onClick={() => target.showDebtorList({ status: "detail", id: record.code })}>
          详情
        </span>
      </div>
  }
];
class ExaminationPlaceRecord extends React.Component {
  constructor(params) {
    super(params);
    // console.log(params);
    this.state = {
      columns: columns(this),
      searchParams: {},
      data: []
    };
    this.showDebtorList = this.showDebtorList.bind(this);
  }
  componentDidMount() {
    // console.log();
    // this.setInitialValue(this.props);
    const _this = this;
    fetch({
      url: "sys/install/master/list?partyCode=" + _this.props.partyCode,
      method: "POST",
      params: {
        partyCode: _this.props.partyCode,
      },
      success: function (response) {
        if (response.entity.code === "SUCCESS") {
          _this.setState({
            data: response.entity.data
          });
        }
      },
      error() {
      }
    });
  }
  showDebtorList(item) {
    console.log(this.props.router, 14312432);
    const { addRoute } = this.props.router;
    routeChecked[item.status](addRoute, item);
  }
  render() {
    // const { search } = this.props.actions;
    // const { searchParams } = this.state;
    // const getTableList = (params) => {
    //   // console.log(params);
    //   search(Object.assign(searchParams, params));
    // };
    return (
      <div>
        <Table
          rowKey="id"
          dataSource={this.state.data}
          columns={this.state.columns}
          // pagination={{
          //   total: this.props.results.total,
          //   current: this.props.results.page,
          //   showSizeChanger: true,
          //   onChange: (current) => {
          //     getTableList({ _index: current });
          //   },
          //   onShowSizeChange: (current, pageSize) => {
          //     getTableList({ _size: pageSize, _index: 1 });
          //   }
          // }}
        />
      </div>
    );
  }
}


export { ExaminationPlaceRecord as default };
