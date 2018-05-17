import React from "react";
// import moment from "moment";
import styles from "./style.less";
import { Table, Breadcrumb, Row, Col, Button, Cascader, Input, notification, Modal } from "antd";
import fetch from "srcDir/common/model/itemModel/fetch";
const confirm = Modal.confirm;
import { cityMap } from "srcDir/common/model/codeMap";
const addressdata = (k) => {
  // const newdata = [];
  const newdata = k.map((v) => {
    const data = {};
    if (v.children) {
      data.label = v.geoName;
      // data.value = v.geoIdcode;
      data.value = v.geoIdcode;
      data.children = addressdata(v.children);
    } else {
      data.label = v.geoName;
      // data.value = v.geoIdcode;
      data.value = v.geoIdcode;
    }
    return data;
  });
  return newdata;
};
const opdata = addressdata(cityMap);
const routeAddress = {
  add(addRoute, item) {
    addRoute({
      keyName: "",
      path: "/resource/workeffort/company/operating/add",
      name: "资源", title: "/resource/workeffort/company/operating/add",
      component: "resource/workeffort/company/operating/add",
      paramId: item
    });
  },
  editOrDetail(addRoute, item) {
    addRoute({
      keyName: "",
      path: "/resource/workeffort/company/operating/edit",
      name: "资源", title: "/resource/workeffort/company/operating/edit",
      component: "resource/workeffort/company/operating/edit",
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
// 根据数据状态渲染按钮
function renderBtn(record, target) {
  if (status) { // 启用按钮
    return (<Button
      size="small"
      type="primary"
      onClick={() => target.toggleBtn(target.state.serviceStatus, "enable")}
      style={{ display: !target.state.serviceStatus ? "none" : "inlineBlock", marginRight: "10px" }}
    >启用</Button>);
  } // 停用按钮
  return (<Button
    size="small"
    type="primary"
    onClick={() => target.toggleBtn(target.state.serviceStatus, "disable")}
    style={{ display: target.state.serviceStatus ? "none" : "inlineBlock", marginRight: "10px" }}
  >停用</Button>);
}
// 创建react组件
const columns = target => [
  {
    title: "服务标准编号",
    dataIndex: "code",
    key: "code",
  }, {
    title: "服务标准名称",
    dataIndex: "groupName",
    key: "groupName",
  }, {
    title: "服务标准简称",
    dataIndex: "municipalityCode",
    key: "municipalityCode",
    render: (text, record) => (<div className={styles.cascader}>
      <Cascader
        options={opdata} placeholder="选择地区" style={{ width: "100%", border: 0, background: "transparent" }}
        defaultValue={[`${record.provinceCode}`, `${record.countyCode}`, `${record.municipalityCode}`]}
      />
    </div>)
  }, {
    title: "制定日期",
    dataIndex: "contact",
    key: "contact",
  }, {
    title: "制定人",
    dataIndex: "contactMobile",
    key: "contactMobile",
  }, {
    title: "操作",
    dataIndex: "id",
    key: "id",
    width: 400,
    className: styles.tableStyle,
    render: (text, record) =>
      (<div>
        <Button size="small" style={{ marginRight: "10px" }} type="primary" onClick={() => target.showDebtorList({ status: "detail", id: record.code })}>详情</Button>
        <Button size="small" icon="edit" style={{ marginRight: "10px" }} onClick={() => target.showDebtorList({ status: "edit", id: record.code, roleTypeCode: "INSTALL_CARRIER" })}>编辑</Button>
        {renderBtn(target.state.serviceStatus, target)}
        <Button size="small" type="danger" icon="delete" onClick={() => target.delete(record)}>删除</Button>
        <Button size="small" icon="export" onClick={() => target.export(record)} style={{ marginLeft: "10px" }}>导出为PDF</Button>
      </div>)
  }
];
// 服务标准关联检测
function check(record, oprating) {
  if (!record.status) return;
  let title = "";
  if (oprating === "delete") { // 删除
    title = `服务标准：${record}已关联报价单，不允许删除！`;
  } else if (oprating === "disable") { // 停用
    title = `服务标准：${record}正在被使用，请解除关联后再停用。`;
  }
  confirm({
    title: title,
    // content: "确定要删除" + record.loginName + "?",
    okText: "确定",
    okType: "danger",
    cancelText: "取消",
    onOk() {
    },
    onCancel() {
    },
  });
}
class ExaminationPlaceRecord extends React.Component {
  constructor(params) {
    super(params);
    // console.log(params);
    this.state = {
      columns: columns(this),
      searchParams: {},
      serviceStatus: false
    };
    this.showDebtorList = this.showDebtorList.bind(this);
    this.delete = this.delete.bind(this);
    this.export = this.export.bind(this);
    this.initSearch = this.initSearch.bind(this);
    this.toggleBtn = this.toggleBtn.bind(this);
    this.rowClick = this.rowClick.bind(this);
    this.rowMouseEnter = this.rowMouseEnter.bind(this);
  }
  showDebtorList(item) {
    const { addRoute } = this.props.router;
    routeChecked[item.status](addRoute, item);
  }
  delete(record) {
    const _this = this;
    check(record, "delete");
    if (!record.status) return;
    confirm({
      title: `确定要删除服务标准：${record}吗？`,
      // content: "确定要删除" + record.loginName + "?",
      okText: "确定",
      okType: "danger",
      cancelText: "取消",
      onOk() {
        fetch({
          url: "/sys/install/carrier/delete?code=" + record.code,
          method: "DELETE",
          params: {
            code: record.code,
          },
          success: function (response) {
            if (response.entity.code === "SUCCESS") {
              notification.success({
                message: response.entity.msg,
              });
              _this.props.actions.search();
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
  export(record) {
    const _this = this;
    confirm({
      title: "确定要删除送装资源：" + record.groupName + "吗?",
      // content: "确定要删除" + record.loginName + "?",
      okText: "确定",
      okType: "danger",
      cancelText: "取消",
      onOk() {
        fetch({
          url: "/sys/install/carrier/delete?code=" + record.code,
          method: "DELETE",
          params: {
            code: record.code,
          },
          success: function (response) {
            if (response.entity.code === "SUCCESS") {
              notification.success({
                message: response.entity.msg,
              });
              _this.props.actions.search();
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
  initSearch() {
    const clearDom = document.querySelector(".ant-col-3 .anticon.anticon-cross-circle.ant-cascader-picker-clear");
    if (clearDom) {
      clearDom.click();
    }
    this.setState({
      searchParams: {}
    });
    this.props.actions.search();
  }
  // 切换服务状态
  toggleBtn(record, type) {
    if (type === "enable") { // 启用
      // 发送请求 更新列表
    } else { // 停用
      // 根据字段判断当前服务是否被关联使用
      check(type, "disable");
        // 关联使用
      if (!record.status) return;
      confirm({
        title: `服务标准：${type}正在被使用，请解除关联后再停用。`,
        // content: "确定要删除" + record.loginName + "?",
        okText: "确定",
        okType: "danger",
        cancelText: "取消",
        onOk() {
        },
        onCancel() {
        },
      });
        // 未被关联使用 ->发送请求 更新列表
      this.props.actions.search();
    }
  }
  // 行事件
  rowClick(record, index, e) {
    console.log("rowClick");
    console.log(record);
    console.log(index);
    console.log(e);
  }
  rowMouseEnter() {
    console.log("mouseEnter");
  }
  render() {
    // const { search } = this.props.actions;
    const { searchParams } = this.state;
    const getTableList = (params) => {
      console.log(params);
      // search(Object.assign(searchParams, params));
    };
    return (
      <div className={styles.examinationPlaceMsg}>
        <Breadcrumb separator="/" className={styles.Breadcrumb}>
          <Breadcrumb.Item>商品管理</Breadcrumb.Item>
          <Breadcrumb.Item>服务标准列表</Breadcrumb.Item>
        </Breadcrumb>
        <Row type="flex" justify="start" align="top" className={styles.mg}>
          <Col span={2} className={styles.label}>服务标准名称：</Col>
          <Col span={3}>
            <Input
              placeholder="模糊查询"
              value={this.state.searchParams.groupName}
              onChange={
                e => {
                  searchParams.groupName = e.target.value;
                  searchParams.pageNo = 1;
                  this.setState({
                    searchParams: searchParams
                  });
                }
              }
            />
          </Col>
          <Col span={2} className={styles.label}>服务标准简称：</Col>
          <Col span={3}>
            <Input
              style={{ width: "100%" }}
              placeholder="模糊查询"
              value={this.state.searchParams.contact}
              onChange={
                e => {
                  searchParams.contact = e.target.value;
                  searchParams.pageNo = 1;
                  this.setState({
                    searchParams: searchParams
                  });
                }
              }
            />
          </Col>
          {/* <Col span={2} className={styles.label}>联系人电话：</Col>
          <Col span={3}>
            <Input
              style={{ width: "90%" }}
              placeholder="请输入联系人电话"
              value={this.state.searchParams.contactPhone}
              onChange={
                e => {
                  searchParams.contactPhone = e.target.value;
                  searchParams.pageNo = 1;
                  this.setState({
                    searchParams: searchParams
                  });
                }
              }
            />
          </Col>
          <Col span={2} className={styles.label}>所在地区：</Col>
          <Col span={3}>
            <Cascader
              style={{ width: "90%" }}
              options={opdata}
              placeholder="选择地区"
              onChange={
                e => {
                  searchParams.stateProvinceGeoCode = e[0];
                  searchParams.countyGeoCode = e[1];
                  searchParams.municipalityGeoCode = e[2];
                  searchParams.pageNo = 1;
                  this.setState({
                    searchParams: searchParams
                  });
                }
              }
            />
          </Col>*/}
          <Col span={12}>
            {/* <Button style={{ marginRight: 10 }} onClick={() => this.initSearch()}>清除</Button>*/}
            <Button type="primary" icon="plus" onClick={() => this.showDebtorList({ status: "add", id: null, roleTypeCode: "INSTALL_CARRIER" })} style={{ marginRight: 10, float: "right" }}>
              新建服务标准
            </Button>
            <Button type="primary" icon="search" onClick={() => getTableList(searchParams)} style={{ marginRight: 10, float: "right" }}>查询</Button>
          </Col>
        </Row>
        {
          this.props.results && <Table
            rowKey="id"
            bordered="true"
            dataSource={this.props.results.data}
            columns={this.state.columns}
            pagination={{
              total: this.props.results.records,
              current: this.props.results.page,
              showSizeChanger: true,
              onChange: (current) => {
                getTableList({ pageNo: current });
              },
              onShowSizeChange: (current, pageSize) => {
                getTableList({ pageSize: pageSize, pageNo: current });
              }
            }}
            onRowClick={this.rowClick}
            onRowMouseEnter={this.rowMouseEnter}
          />
        }
      </div>
    );
  }
}


export { ExaminationPlaceRecord as default };
