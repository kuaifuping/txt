import React from "react";
// import styles from "./style.less";
import { Form, Select, Input, Button, Row, Col, notification } from "antd";
const configURL = require("srcRootDir/webpack-config/base/url.config.js");
import fetch from "srcDir/common/model/itemModel/fetch";
// let nameInputValue;
// let packageNumInputValue;
// const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;
const setproportion = {
  cashOrmonthly(_this) {
    _this.setState({
      settlement: [1],
      firstCol: 8,
      lastCol: 8
    });
  },
  one(_this) {
    _this.setState({
      settlement: [1],
      firstCol: 8,
      lastCol: 8
    });
  },
  two(_this) {
    _this.setState({
      settlement: [1, 2],
      firstCol: 8,
      lastCol: 4
    });
  },
  three(_this) {
    _this.setState({
      settlement: [1, 2, 3],
      firstCol: 8,
      lastCol: 3
    });
  }
};


const settlementoptions = ["cashOrmonthly", "one", "two", "three"];
import store from "store2";
const codeMap = store.session.get("codeMap");
const getthedictionary = (code) => {
  // let index;
  const codedata = codeMap.filter((v) => {
    let dd;
    if (v.parentCode === code) {
      dd = v;
    }
    return dd;
  });
  return codedata;
};
const dd = (e, _this) => {
  // console.log(settlementoptions[e], e, _this);
  // setproportion[settlementoptions[e - 1]](_this);
  if (parseInt(e, 10) === 100) {
    setproportion[settlementoptions[1]](_this);
  } else if (parseInt(e, 10) === 1) {
    setproportion[settlementoptions[0]](_this);
  } else if (parseInt(e, 10) === 3) {
    setproportion[settlementoptions[2]](_this);
  } else {
    setproportion[settlementoptions[3]](_this);
  }
  fetch({
    url: configURL.remoteServer.financeUrl + "/basics/finSettlementMethod/view?partyCode=" + _this.props.partyCode,
    method: "GET",
    params: {},
    success: (res) => {
      if (res.entity.code === "SUCCESS") {
        _this.setState({
          financeData: res.entity.data ? res.entity.data : {},
        });
      }
    }
  });
};
class View extends React.Component {
  constructor(props) {
    super(props);
    // console.log(props);
    this.state = {
      settlement: [1],
      firstCol: 8,
      lastCol: 8,
      financeData: {},
      // 是否新增完成，用以实现新增后可以无缝修改
      hasSaveOnly: false,
    };
    // this.setInitialValue = this.setInitialValue.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.changePercent = this.changePercent.bind(this);
  }
  componentDidMount() {
    const _this = this;
    if (this.props.status.status !== "add") {
      fetch({
        url: configURL.remoteServer.financeUrl + "/basics/finSettlementMethod/view?partyCode=" + _this.props.partyCode,
        method: "GET",
        params: {},
        success: (res) => {
          if (res.entity.code === "SUCCESS") {
            _this.setState({
              financeData: res.entity.data ? res.entity.data : {},
            });
            dd(_this.state.financeData.paymentMethodTypeCode, _this);
          }
        }
      });
    }
  }
  loginName(rule, value, callback) {
    value = value || "";
    const name = /^[a-zA-Z0-9]/;
    if (!name.test(value)) {
      callback("只能是数字和字母");
    } else {
      if (value.length < 1) {
        callback("不能为空");
      } else if (value.length > 30) {
        callback("最长大度为30");
      } else {
        callback();
      }
    }
  }
  rate(rule, value, callback) {
    const phoneNum = /^[0-9]\d*$/;
    value = value || "";
    if (value.length < 1) {
      callback("税率不能为空。");
    } else if (value.length > 2) {
      callback("税率最大长度为2位。");
    } else {
      if (!phoneNum.test(value)) {
        callback("税率不能以非数字开头");
      } else {
        callback();
      }
    }
  }
  handleSubmit(e) {
    e.preventDefault();
    const _this = this;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // 单独验证结算方式总和
        let count = 0;
        _this.state.settlement.forEach((v) => {
          count += ~~values[`paymentMethodPercent${v}`];
        });
        if (count !== 100) {
          notification.error({ message: "结算比例总和不为100%！" });
          return;
        }
        let url;
        values.partyCode = _this.props.partyCode;
        if (_this.state.hasSaveOnly && _this.props.status.status !== "edit") {
          values.roleTypeCode = _this.props.status.roleTypeCode;
          url = "saveOnly";
        } else {
          values.code = _this.state.financeData.code || values.partyCode;
          url = "update";
        }
        fetch({
          url: configURL.remoteServer.financeUrl + "/basics/finSettlementMethod/" + url,
          method: "POST",
          params: values,
          success: function (response) {
            if (response.entity.code === "SUCCESS") {
              notification.success({
                message: response.entity.msg,
              });
              // 新增才缓存state
              if (url === "saveOnly") {
                _this.setState({
                  financeData: response.entity.data,
                  hasSaveOnly: true
                });
              }
            } else {
              notification.error({
                message: response.entity.msg,
              });
            }
          },
          error() {
          }
        });
      }
    });
  }
  changePercent(rule, value, callback) {
    value = value || "";
    const phoneNum = /^[1-9]\d*$/;
    if (value.length < 1) {
      callback("结算比例为必填");
    } else if (value > 100) {
      callback("单个结算比例不能超过100%");
    } else if (!phoneNum.test(value)) {
      callback("结算比例不能以0或非数字开头");
    } else {
      callback();
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const open = !this.props.status.disable;
    const _this = this;
    // const theWay = this.state.settlement.length > 1 ? 0 : 1;
    // const opened = open ? 1 : theWay;
    // const valueNum = this.state.settlement.length > 1 ? "" : "100";
    // console.log(this.state.financeData);
    return (
      <div >
        <Form onSubmit={this.handleSubmit}>
          <Row gutter={16} type="flex" justify="center">
            <Col span={this.state.firstCol}>
              <FormItem
                label="结算方式"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                // hasFeedback
              >
                {getFieldDecorator("paymentMethodTypeCode", {
                  initialValue: _this.state.financeData ? _this.state.financeData.paymentMethodTypeCode : "",
                  rules: [
                    { required: true, message: "不能为空" },
                  ],
                })(
                  <Select
                    placeholder="请选择结算方式"
                    width="200"
                    disabled={open}
                    onChange={(e) => {
                      dd(e, _this);
                    }}
                  >
                  {
                    getthedictionary("warehouse_settlement_type").map(v => <Option value={v.code}>{v.name}</Option>)
                  }
                  </Select>
                )}
              </FormItem>
            </Col>
              {
                this.state.settlement.map((v) => <Col span={_this.state.lastCol}>
                  <FormItem>
                    {getFieldDecorator(`paymentMethodPercent${v}`, {
                      initialValue: _this.state.financeData ? _this.state.financeData[`paymentMethodPercent${v}`] : "",
                      rules: [
                        { required: true, message: "不能为空" },
                        { validator: this.changePercent }
                      ],
                    })(
                      <Input addonAfter="%" disabled={open} ref={(input) => { this[`paymentMethodPercent${v}`] = input; }} />
                    )}
                  </FormItem>
                </Col>)
              }
          </Row>
          <FormItem
            {...formItemLayout}
            label="纳税人类型"
          >
            {getFieldDecorator("taxpayerTypeCode", {
              initialValue: _this.state.financeData ? _this.state.financeData.taxpayerTypeCode : "",
              rules: [
                { required: true, message: "不能为空" },
              ],
            })(
              <Select placeholder="请选择纳税人类型" disabled={open}>
              {
                getthedictionary("warehouse_taxpayer_type").map(v => <Option value={v.code}>{v.name}</Option>)
              }
              </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="税务登记号"
          >
            {getFieldDecorator("taxpayerId", {
              initialValue: _this.state.financeData ? _this.state.financeData.taxpayerId : "",
              rules: [
                { required: true, message: "不能为空" },
                { validator: this.loginName }
              ],
            })(
              <Input disabled={open} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="发票类型"
          >
            {getFieldDecorator("invTypeCode", {
              initialValue: _this.state.financeData ? _this.state.financeData.invTypeCode : "",
              rules: [
                { required: true, message: "不能为空" },
              ],
            })(
              <Select placeholder="请选择发票类型" disabled={open}>
                {
                  getthedictionary("invoice_type").map(v => <Option value={v.code}>{v.name}</Option>)
                }
              </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="发票税率"
          >
            {getFieldDecorator("invTaxratePercent", {
              initialValue: _this.state.financeData ? _this.state.financeData.invTaxratePercent : "",
              rules: [
                { required: true, message: "不能为空" },
                { validator: this.rate }
              ],
            })(
              <Input disabled={open} addonAfter="%" />
            )}
          </FormItem>
          {
            this.props.status.status !== "detail" && <FormItem
              wrapperCol={{ span: 12, offset: 6 }}
              style={{ textAlign: "center" }}
            >
              <Button type="primary" htmlType="submit">保存</Button>
            </FormItem>
          }
        </Form>
      </div>
    );
  }
}
const View1 = Form.create()(View);
export { View1 as default };
