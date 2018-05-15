import React from "react";
// import styles from "./style.less";
import { Form, Input, Button, Row, Col, Select, notification } from "antd";
const configURL = require("srcRootDir/webpack-config/base/url.config.js");
import fetch from "srcDir/common/model/itemModel/fetch";
// const codeMap = store.session.get("codeMap");
// const getthedictionary = (code) => {
//   // let index;
//   const codedata = codeMap.filter((v) => {
//     let dd;
//     if (v.parentCode === code) {
//       dd = v;
//     }
//     return dd;
//   });
//   return codedata;
// };
const FormItem = Form.Item;

class View extends React.Component {
  constructor(props) {
    super(props);
    // console.log(props);
    this.state = {
      // fileList: [],
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.cancel = this.cancel.bind(this);
    // this.handlePreview = this.handlePreview.bind(this);
  }
  componentDidMount() {
    this.props.form.resetFields();
    // this.setInitialValue(this.props);
  }
  // componentWillReceiveProps(nextProps) {
  //   console.log(nextProps, 123);
  // }
  handleSubmit(e) {
    e.preventDefault();
    const _this = this;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
        // if (_this.props.status === "add") {
        //   values.roleTypeCode = this.props.status.roleTypeCode;
        // }
        values.lgsQuantityBreakInputForm = {
          fromQuantity: values.fromQuantity,
          thruQuantity: values.thruQuantity,
          // quantityBreakTypeId: "",
        };
        if (_this.props.status === "edit") {
          values.lgsQuantityBreakInputForm.code = this.props.data.lgsQuantityBreakResultForm.code;
        }
        delete values.fromQuantity;
        delete values.thruQuantity;
        values.partyCode = _this.props.partyCode;
        const url = _this.props.status === "edit" ? "/basics/lgsShipmentCostEstimate/update" : "/basics/lgsShipmentCostEstimate/saveInstallCarrierCharge";
        fetch({
          url: configURL.remoteServer.financeUrl + url,
          method: "POST",
          params: values,
          success: function (response) {
            if (response.entity.code === "SUCCESS") {
              notification.success({
                message: response.entity.msg,
              });
              _this.props.form.resetFields();
              _this.props.cancel(response.entity.code);
              _this.cancel();
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
  rate(rule, value, callback) {
    callback();
    // const phoneNum = /^[1-9]\d*$/;
    // if (value.length < 1) {
    //   callback("");
    // } else if (value.length > 6) {
    //   callback("不能超过6位");
    // } else {
    //   if (!phoneNum.test(value)) {
    //     callback("价格不能以0开头");
    //   } else {
    //     callback();
    //   }
    // }
  }
  cancel() {
    this.props.cancel();
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 17 },
    };
    const prefixSelector = getFieldDecorator("priceUomCode", {
      initialValue: this.props.data && this.props.data.priceUomCode || "45", // initialValue: '86',
      rules: [
        { required: true, message: "请选单位" },
        // { validator: this.rate }
      ],
    })(
      <Select style={{ width: 70 }} >
        <Option value="45">吨</Option>
        <Option value="46">立方米</Option>
        <Option value="19">公斤</Option>
        <Option value="12">件</Option>
      </Select>
    );

    return (
      <div >
        <Form onSubmit={this.handleSubmit}>
          {
            this.props.status === "add" ? <FormItem
              {...formItemLayout}
              label="partyCode"
              style={{ display: "none" }}
            >
              {getFieldDecorator("partyCode", {
                initialValue: this.props.partyCode,
                rules: [
                  { required: true, message: "不能为空" },
                  // { validator: this.rate }
                ],
              })(
                <Input />
              )}
            </FormItem> : <FormItem
              {...formItemLayout}
              label="code"
              style={{ display: "none" }}
            >
              {getFieldDecorator("code",
                {
                  initialValue: this.props.data && this.props.data.code,
                  rules: [
                    { required: true, message: "不能为空" },
                    // { validator: this.rate }
                  ],
                })(
                <Input />
              )}
            </FormItem>
          }
          <FormItem
            {...formItemLayout}
            label="收费区间"
          >
            <Row>
              <Col span={9}>
                <FormItem
                  // {...formItemLayout}
                  label=""
                >
                {getFieldDecorator("fromQuantity", {
                  initialValue: this.props.data && this.props.data.lgsQuantityBreakResultForm.fromQuantity,
                  rules: [
                    { required: true, message: "最小收费不能为空" },
                    { validator: this.rate }
                  ],
                })(
                  <Input placeholder="请输入最小收费" />
                )}
                </FormItem>
              </Col>
              <Col span={2} style={{ textAlign: "center" }}>
                ~
              </Col>
              <Col span={13}>
                <FormItem
                  // {...formItemLayout}
                  label=""
                >
                {getFieldDecorator("thruQuantity", {
                  initialValue: this.props.data && this.props.data.lgsQuantityBreakResultForm.thruQuantity,
                  rules: [
                    { required: true, message: "最大收费不能为空" },
                    { validator: this.rate }
                  ],
                })(
                  <Input placeholder="请输入最大收费" addonAfter={prefixSelector} />
                )}
                </FormItem>
              </Col>
            </Row>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="单价"
          >
            {getFieldDecorator("priceUnitPrice", {
              initialValue: this.props.data && this.props.data.priceUnitPrice,
              rules: [
                { required: true, message: "单价不能为空" }
              ],
            })(
              <Input placeholder="请输入单价" />
            )}
          </FormItem>
          <FormItem
            wrapperCol={{ span: 12, offset: 6 }}
            style={{ textAlign: "center" }}
          >
            <Button type="danger" onClick={() => { this.cancel(); }} style={{ marginRight: 5 }} >取消</Button>
            <Button type="primary" htmlType="submit" style={{ marginLeft: 5 }}>保存</Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}
const View1 = Form.create()(View);
export { View1 as default };
