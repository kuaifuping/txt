import React from "react";
// import moment from "moment";
import styles from "./style.less";
import { Table, Breadcrumb, Row, Col, Button, Cascader, Input, notification, Modal, DatePicker } from "antd";
import fetch from "srcDir/common/model/itemModel/fetch";
const confirm = Modal.confirm;
import { cityMap } from "srcDir/common/model/codeMap";
import moment from "moment";
const { RangePicker } = DatePicker;

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
// 创建react组件
const columns = target => [
  {
    title: "报价单号",
    dataIndex: "code",
    key: "code",
  }, {
    title: "报价单名称",
    dataIndex: "groupName",
    key: "groupName",
  }, {
    title: "折扣价格",
    dataIndex: "municipalityCode",
    key: "municipalityCode",
    render: (text, record) => (<div className={styles.cascader}>
      <Cascader
        options={opdata} placeholder="选择地区" style={{ width: "100%", border: 0, background: "transparent" }}
        defaultValue={[`${record.provinceCode}`, `${record.countyCode}`, `${record.municipalityCode}`]}
      />
    </div>)
  }, {
    title: "服务标准",
    dataIndex: "contact",
    key: "contact",
  }, {
    title: "报价标准金额",
    dataIndex: "contactMobile",
    key: "contactMobile",
  }, {
    title: "有效期至",
    dataIndex: "contactMobile1",
    key: "contactMobile1",
  }, {
    title: "报价时间",
    dataIndex: "contactMobile2",
    key: "contactMobile2",
  }, {
    title: "报价人",
    dataIndex: "contactMobile3",
    key: "contactMobile3",
  }, {
    title: "操作",
    dataIndex: "id",
    key: "id",
    width: 300,
    className: styles.tableStyle,
    render: (text, record) =>
      (<div>
        <Button size="small" style={{ marginRight: "10px" }} type="primary" onClick={() => target.showDebtorList({ status: "detail", id: record.code })}>详情</Button>
        <Button size="small" icon="edit" style={{ marginRight: "10px" }} onClick={() => target.showDebtorList({ status: "edit", id: record.code, roleTypeCode: "INSTALL_CARRIER" })}>编辑</Button>
        <Button
          size="small"
          type="primary"
          onClick={() => target.toggleServiceStatus(target.state.serviceStatus)}
          style={{ display: target.state.serviceStatus ? "none" : "inlineBlock", marginRight: "10px" }}
        >停用</Button>
        <Button
          size="small"
          type="primary"
          onClick={() => target.toggleServiceStatus(target.state.serviceStatus)}
          style={{ display: !target.state.serviceStatus ? "none" : "inlineBlock", marginRight: "10px" }}
        >启用</Button>
        <Button size="small" type="danger" icon="delete" onClick={() => target.delete(record)}>删除</Button>
      </div>)
  }
];
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
    this.initSearch = this.initSearch.bind(this);
    this.toggleServiceStatus = this.toggleServiceStatus.bind(this);
    this.rowClick = this.rowClick.bind(this);
    this.rowMouseEnter = this.rowMouseEnter.bind(this);
  }
  showDebtorList(item) {
    const { addRoute } = this.props.router;
    routeChecked[item.status](addRoute, item);
  }
  delete(record) {
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
  toggleServiceStatus(status) {
    console.log("切换服务状态");
    // 按钮显示切换
    this.setState({ serviceStatus: !status });
    // 服务标准状态切换【启用】【停止】
    if (status) {
      console.log("启用");
    } else {
      console.log("停止");
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
    const { search } = this.props.actions;
    const { searchParams } = this.state;
    const getTableList = (params) => {
      // console.log(params);
      search(Object.assign(searchParams, params));
    };
    return (
      <div className={styles.examinationPlaceMsg}>
        <Breadcrumb separator="/" className={styles.Breadcrumb}>
          <Breadcrumb.Item>商品管理</Breadcrumb.Item>
          <Breadcrumb.Item>报单价列表</Breadcrumb.Item>
        </Breadcrumb>
        <Row type="flex" justify="start" align="top" className={styles.mg}>
          <Col span={2} className={styles.label}>报价单名称：</Col>
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
          <Col span={2} className={styles.label}>报价单号：</Col>
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
          <Col span={2} className={styles.label}>服务标准：</Col>
          <Col span={3}>
            <Input
              style={{ width: "90%" }}
              placeholder="模糊查询"
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
          <Button type="primary" icon="search" onClick={() => getTableList(searchParams)} style={{ marginRight: 10, float: "right" }}>查询</Button>
          <Button type="primary" icon="search" onClick={() => getTableList(searchParams)} style={{ marginRight: 10, float: "right" }}>清除</Button>
        </Row>
        <Row type="flex" justify="start" align="top" className={styles.mg}>
          <Col span={2} className={styles.label}>报价时间：</Col>
          <Col span={3}>
            {/* <Cascader
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
            />*/}
            <RangePicker
              defaultValue={[moment("2015/01/01", "YYYY/MM/DD"), moment("2015/01/01", "YYYY/MM/DD")]}
              format={"YYYY/MM/DD"}
            />
          </Col>
          <Col span={2} className={styles.label}>报价人：</Col>
          <Col span={3}>
            <Input
              style={{ width: "90%" }}
              placeholder="模糊查询"
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
          <Col span={4}>
            {/* <Button style={{ marginRight: 10 }} onClick={() => this.initSearch()}>清除</Button>*/}
            <br />
            <Button type="primary" icon="plus" onClick={() => this.showDebtorList({ status: "add", id: null, roleTypeCode: "INSTALL_CARRIER" })} style={{ marginRight: 10, float: "right" }}>
              新建报价单
            </Button>
          </Col>
        </Row>
        {
          this.props.results && <Table
            rowKey="id"
            bordered="true"
            dataSource={this.props.results.data}
            columns={this.state.columns}
            rowSelection={{
              onSelect: () => {}
            }}
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
