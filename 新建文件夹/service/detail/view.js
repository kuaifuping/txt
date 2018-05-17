import React from "react";
import { Breadcrumb, Row, Col, Button, Form, Input, Modal, notification, Radio, InputNumber, Table, Checkbox } from "antd";
import fetch from "srcDir/common/ajax/index";
const configURL = require("srcRootDir/webpack-config/base/url.config.js");
import styles from "./style.less";
const RadioGroup = Radio.Group;
const success = Modal.success;
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const suitColumns = () => [
  {
    title: "空间",
    dataIndex: "space",
    key: "space",
    render: (item) => {
      let temp = "";
      item.forEach((val) => {
        temp += val.spaceName + " ";
      });
      return temp;
    }
  }, {
    title: "优惠条件（满？套）",
    dataIndex: "condition.conSuit",
    key: "conSuit",
  }, {
    title: "服务费用标准（元/套）",
    dataIndex: "condition.conPrice",
    key: "conPrice"
  }];
const goodsColumns = (target) => [
  {
    title: "序号",
    dataIndex: "index",
    key: "index",
    render: (val, row, index) => index + 1
  }, {
    title: "品类",
    dataIndex: "label",
    key: "label"
  }, {
    title: "同套系 服务费用标准（元/件）",
    dataIndex: "samePrice",
    key: "samePrice",
    render: (val, row, index) =>
      <InputNumber
        value={val}
        onChange={(e) => {
          const tempList = target.state.goodsServerList;
          tempList[index].samePrice = e;
          target.setState({
            goodsServerList: tempList
          });
        }}
      />
  }, {
    title: "跨套系 <br/> 服务费用标准（元/件）",
    dataIndex: "difPrice",
    key: "difPrice",
    render: (val, row, index) =>
      <InputNumber
        value={val}
        onChange={(e) => {
          const tempList = target.state.goodsServerList;
          tempList[index].difPrice = e;
          target.setState({
            goodsServerList: tempList
          });
        }}
      />
  }];
class View extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      license: [],
      newLicense: [],
      contract: [],
      newContract: [],
      goodsServerList: [], // 品类服务标准费用列表
      serviceType: "1", // 服务范围
      spaceList: [], // 空间类别列表
      spaceChoosed: [], // 选择空间类别
      suitList: [], // 套系服务费用标准列表
      selectedRowKeys: [],
      isAddModalShow: false,
      addServerCondition: [{ // 新建服务标准计费规则条件
        conSuit: "",
        conPrice: ""
      }]
    };
    this.suitColumns = suitColumns();
    this.goodsColumns = goodsColumns(this);
    this.sc = success;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getProKind = this.getProKind.bind(this);
    this.getSpace = this.getSpace.bind(this);
    this.addServerSuit = this.addServerSuit.bind(this);
    this.deletServer = this.deletServer.bind(this);
    this.getProKind();
    this.getSpace();
  }
  // 获取产品类别
  getProKind() {
    const that = this;
    fetch({
      url: (configURL.remoteServer.productUrl || "") + "/category",
      method: "get",
      params: {},
      success(res) {
        // 递归处理类别树JSON，适配树选择器
        const datalist = [];
        res.entity.data.map(function changeKey(item) {
          if (item.hasOwnProperty("children") && item.children !== null) {
            // obj.selectable = false;
            // obj.children = item.children.map((child) => changeKey(child));
            item.children.map((child) => changeKey(child));
          } else {
            datalist.push({
              label: item.categoryName,
              key: item.code,
              value: item.code
            });
          }
          return "";
        });
        that.setState({ goodsServerList: datalist });
      }
    });
  }
  // 获取空间类别
  getSpace() {
    fetch({
      url: (configURL.remoteServer.productUrl || "") + "/space",
      method: "GET",
      params: {
        code: 1
      },
      success: (res) => {
        if (res.entity) {
          res.entity.data.forEach((item) => {
            if (!item.productDTOS) {
              item.productDTOS = [];
            }
          });
          this.setState({
            spaceList: res.entity.data
          });
        }
      },
      error() {
      }
    });
  }
  // 删除套系服务标准
  deletServer() {
    const temp = this.state.suitList;
    this.state.selectedRowKeys.forEach((val) => {
      temp.splice(val, 1);
    });
    this.setState({
      suitList: temp,
      selectedRowKeys: []
    });
  }
  // 新建服务标准
  addServerSuit() {
    if (this.state.spaceChoosed.length === 0) {
      notification.warning({
        message: "请至少选择一个空间"
      });
      return;
    }
    const conditionList = [];
    const temData = this.state.suitList;
    this.state.addServerCondition.map((item) => {
      if (item.conSuit !== "" && item.conPrice !== "") {
        conditionList.push(item);
      }
      return item;
    });
    if (conditionList.length === 0) {
      notification.warning({
        message: "请至少填写一组计费规则"
      });
      return;
    }
    this.state.addServerCondition.map((item) => {
      const temp = [];
      this.state.spaceChoosed.forEach((val) => {
        temp.push({
          spaceName: this.state.spaceList[val].spaceName,
          code: this.state.spaceList[val].code,
        });
      });
      temData.push({
        space: temp,
        condition: item
      });
      return "";
    });
    this.setState({
      suitList: temData,
      isAddModalShow: false,
      spaceChoosed: [],
      addServerCondition: [{
        conSuit: "",
        conPrice: ""
      }]
    });
  }
  handleSubmit(e) {
    e.preventDefault();
    const { validateFieldsAndScroll } = this.props.form;
    const { license, newLicense, contract, newContract } = this.state;
    validateFieldsAndScroll((err, values) => {
      if (values.warehouseAddressCode) {
        values.warehouseAddressCode = values.warehouseAddressCode[2];
      }
      const attachments = [];
      license.concat(newLicense).map((v) => {
        attachments.push({
          attachmentType: "0",
          attachmentUrl: v.url
        });
        return attachments;
      });
      contract.concat(newContract).map((v) => {
        attachments.push({
          attachmentType: "1",
          attachmentUrl: v.url
        });
        return attachments;
      });
      if (!err) {
        const { pid } = this.props;
        let url;
        let method;
        // 判断新增或编辑
        if (!pid) {
          url = (configURL.remoteServer.facilityUrl || "") + "/wms/warehouses";
          method = "POST";
        } else {
          url = (configURL.remoteServer.facilityUrl || "") + `/wms/warehouses/${pid.id}`;
          method = "PUT";
        }
        const sendData = {
          attachments,
          bankAccount: {
            bankAccountCode: values.bankAccountCode,
            bankAccountName: values.bankAccountName,
            // bankCuntry: values.bankCuntry,
            bankName: values.bankName,
            currencyCode: values.currencyCode,
            // currencyName: values.currencyName,
            settlementType: values.settlementType,
            taxpayerType: values.taxpayerType
          },
          contacts: [
            {
              // contactId: 0,
              contactName: values.contactName,
              contactPosition: values.contactPosition,
              description: values.contactDescription,
              email: values.email,
              mobilePhone: values.mobilePhone,
              phone: values.phone,
              sex: values.sex
            }
          ],
          // createdStamp: "2017-11-28T11:11:59.407Z",
          description: values.description,
          ownerPartyCode: this.props.results.data && this.props.results.data.ownerPartyCode,
          // userLoginCode: values.,
          // warehouseAddress: values.,
          warehouseAddressCode: values.warehouseAddressCode,
          warehouseAddressDetail: values.warehouseAddressDetail,
          warehouseCapacity: values.warehouseCapacity,
          // warehouseCode: values.,
          // warehouseId: 0,
          warehouseName: values.warehouseName,
          // warehouseStatus: values.,
          warehouseType: values.warehouseType
        };
        const { back2refresh } = this.props.router;
        fetch({
          url,
          method,
          params: sendData,
          success(res) {
            if (res.entity.code === "SUCCESS") {
              notification.success({
                message: res.entity.msg,
              });
              back2refresh();
            } else {
              notification.error({
                message: res.entity.msg,
              });
            }
          }
        });
      } else {
        notification.warning({
          message: "表单验证没有通过哦",
          description: "表单里有内容没有通过验证，请修改！",
        });
      }
    });
  }
  render() {
    const _this = this;
    const { getFieldDecorator } = this.props.form;
    const { back2refresh } = this.props.router;
    const rowSelection = {
      onChange: (selectedRowKeys) => {
        this.setState({
          selectedRowKeys: selectedRowKeys
        });
      },
      selectedRowKeys: this.state.selectedRowKeys,
      getCheckboxProps: record => ({
        disabled: record.name === "Disabled User", // Column configuration not to be checked
        name: record.name,
      })
    };
    return (
      <div>
        <Breadcrumb separator="/" className={styles.Breadcrumb}>
          <Breadcrumb.Item>商品管理</Breadcrumb.Item>
          <Breadcrumb.Item>服务标准</Breadcrumb.Item>
          <Breadcrumb.Item>详情</Breadcrumb.Item>
        </Breadcrumb>
        <div className={styles.detail_content}>
          <Row className={styles.row}>
            <Col span={12} offset={12} className={styles.tr}>
              <Button type="primary" icon="save" onClick={_this.handleSubmit}>保存</Button>
              <Button type="primary" icon="save" onClick={_this.handleSubmit} style={{ margin: ("0", "10px") }}>复制服务标准</Button>
              <Button icon="rollback" onClick={back2refresh}>返回</Button>
            </Col>
          </Row>
          <article>
            <h5 className={styles.formItem_start_noreq}>基本资料</h5>
            <Row>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label="服务标准编码"
                >1111
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label="创建人"
                >
                  {"张三"}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label="创建日期"
                >
                  {"2017-09-09"}
                </FormItem>
              </Col>
              <Col span={16}>
                <FormItem
                  wrapperCol={{ span: 21 }}
                  labelCol={{ span: 3 }}
                  label="服务标准名称"
                >
                  {getFieldDecorator("warehouseAddressCode", {
                    rules: [{
                      required: true, message: "请输入服务标准名称!",
                    }, {
                      max: 50, message: "不超过50个汉字！"
                    }],
                    // initialValue: ["420000", "420700", "420703"]
                  })(
                    <Input placeholder="xxx服务标准" />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label="简称"
                >
                  {getFieldDecorator("warehouseAddressDetail", {
                    rules: [{
                      required: true, message: "请填写简称!",
                    }, {
                      max: 10, message: "不超过10个汉字"
                    }],
                    initialValue: "我是简称"
                  })(
                    <Input placeholder="A套餐" />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItem
                  label="服务范围"
                  wrapperCol={{ span: 22 }}
                  labelCol={{ span: 2 }}
                >
                  <RadioGroup
                    onChange={(e) => {
                      this.setState({
                        serviceType: e.target.value
                      });
                    }} value={this.state.serviceType}
                  >
                    <Row>
                      <Col span={6}>
                        <Radio value="1">仓储/干线物流服务</Radio>
                      </Col>
                      <Col span={6}>
                        <label style={{ width: "80px" }}>提货费：</label><InputNumber min={0} /> 元/单
                      </Col>
                      <Col span={24}>
                        说明：产品从皇家壹号中央仓库、分仓和工程配送至合作商家指定的仓库
                      </Col>
                    </Row>
                    <Row>
                      <Col span={6}>
                        <Radio value="2">全流程服务</Radio>
                      </Col>
                      <Col span={6}>
                        <label style={{ width: "80px" }}>上门服务费： </label><InputNumber min={0} /> 元/次
                      </Col>
                      <Col span={12}>
                        【当售后补件等特殊情况，单独购买单品，增加上门服务费】
                      </Col>
                      <Col span={24}>
                        说明：产品从皇家壹号中央仓库、分仓或工厂配送至合作商家的客户家里，包含仓储、干线、用户交期管理、配送、售后等全流程服务
                      </Col>
                    </Row>
                  </RadioGroup>
                </FormItem>
              </Col>
            </Row>
          </article>
          <article>
            <h5 className={styles.formItem_start_noreq} style={{ width: "100%" }}>套系服务费用标准</h5>
            <Row style={{ marginBottom: "20px" }}>
              <Col span={6} offset={18} className={styles.tr}>
                <Button type="primary" icon="save" onClick={_this.deletServer} style={{ margin: ("0", "10px") }}>删除选中</Button>
                <Button type="primary" icon="save" onClick={() => this.setState({ isAddModalShow: true })}>新建</Button>
              </Col>
            </Row>
            <Table
              rowSelection={rowSelection}
              columns={this.suitColumns}
              dataSource={this.state.suitList}
            />
          </article>
          <article>
            <h5 className={styles.formItem_start_noreq} style={{ width: "100%" }}>品类服务标准费用</h5>
            {this.state.serviceType === "1" &&
              <Row>
                <Col span={24}>
                  优惠条件：单品满 <InputNumber /> 件，免提货费（适用于：仓储/干线物流服务）
                </Col>
              </Row>
            }
            <Table
              style={{ marginTop: "20px" }}
              dataSource={this.state.goodsServerList}
              columns={this.goodsColumns}
              pagination={false}
            />
          </article>
        </div>
        <Modal
          width="80%"
          style={{ maxWidth: "800px" }}
          visible={this.state.isAddModalShow}
          zIndex={120}
          title="新建服务标准"
          okText="保存"
          onCancel={() => this.setState({ isAddModalShow: false })}
          onOk={this.addServerSuit}
        >
          <Row style={{ marginBottom: "15px" }}>
            <h5 style={{ width: "200px" }}>按空间选择</h5>
            <Checkbox.Group
              value={this.state.spaceChoosed}
              onChange={(valus) => {
                this.setState({
                  spaceChoosed: valus
                });
              }}
            >
              {this.state.spaceList.map((item, index) => <Checkbox value={index} style={{ width: "100px" }}>{item.spaceName}</Checkbox >)}
            </Checkbox.Group>
          </Row>
          <Row>
            <Col span="4"><h5 style={{ width: "auto", lineHeight: "28px" }}>所选空间计费:</h5></Col>
            <Col span="12">
              <Row>
                {this.state.addServerCondition.map((item, index) =>
                  <Col span="24" style={{ marginBottom: "10px" }}>满
                    <InputNumber
                      min={1} value={item.conSuit}
                      style={{ margin: ("0", "5px") }}
                      onChange={(val) => {
                        item.conSuit = val;
                        const temp = this.state.addServerCondition;
                        temp[index] = item;
                        this.setState({
                          addServerCondition: temp
                        });
                      }}
                    /> 套，
                    <InputNumber
                      min={1} value={item.conPrice}
                      style={{ margin: ("0", "5px") }}
                      onChange={(val) => {
                        item.conPrice = val;
                        const temp = this.state.addServerCondition;
                        temp[index] = item;
                        this.setState({
                          addServerCondition: temp
                        });
                      }}
                    /> 元/套
                  </Col>)
                }
              </Row>
            </Col>
            <Col span="6">
              <Button
                type="primary" icon="plus"
                onClick={() => {
                  let canAdd = true;
                  this.state.addServerCondition.map((item) => {
                    if (item.conSuit === "" || item.conPrice === "") {
                      canAdd = false;
                    }
                    return item;
                  });
                  const temp = this.state.addServerCondition;
                  if (canAdd) {
                    temp.push({
                      conSuit: "",
                      conPrice: ""
                    });
                    this.setState({
                      addServerCondition: temp
                    });
                  } else {
                    notification.error({ message: "请填写完整" });
                  }
                }}
              >添加计费规则</Button>
            </Col>
          </Row>
        </Modal>
      </div>
    );
  }
}
const Comp = Form.create()(View);

export { Comp as default };
