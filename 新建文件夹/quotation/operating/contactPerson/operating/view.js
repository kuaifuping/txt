import React from "react";
// import styles from "./style.less";
import { Form, Input, Button, Radio, notification } from "antd";
import fetch from "srcDir/common/model/itemModel/fetch";
// let nameInputValue;
// let packageNumInputValue;
// const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
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
class View extends React.Component {
  constructor(props) {
    super(props);
    // console.log(props);
    this.state = {
      // fileList: [],
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.cancel = this.cancel.bind(this);
    this.adminChangeCheckbox = this.adminChangeCheckbox.bind(this);
    // this.handlePreview = this.handlePreview.bind(this);
  }
  // componentDidMount() {
  //   console.log(this.props.data);
  //   // this.setInitialValue(this.props);
  // }
  // componentWillReceiveProps(nextProps) {
  //   console.log(nextProps, 123);
  // }
  adminChangeCheckbox(e) {
    console.log(e);
  }
  handleSubmit(e) {
    e.preventDefault();
    const _this = this;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
        const status = _this.props.status;
        if (status === "edit") {
          values.emailCode = this.props.data.emailCode;
          values.telephoneCode = this.props.data.telephoneCode;
          values.mobileCode = this.props.data.mobileCode;
          values.partyCode = this.props.partyCode;
        }
        fetch({
          url: status === "edit" ? "/sys/contact/update" : "/sys/contact/save",
          method: "POST",
          params: values,
          success: function (response) {
            // console.log(response);
            if (response.entity.code === "SUCCESS") {
              notification.success({
                message: response.entity.msg,
              });
              _this.props.form.resetFields();
              _this.props.cancel(response.entity.code);
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
  cancel() {
    this.props.form.resetFields();
    this.props.cancel();
  }
  mobile(rule, value, callback) {
    const phoneNum = /^1\d{10}$/;
    if (value.length < 1) {
      callback("手机号不能为空。");
    } else if (value.length > 11) {
      callback("手机号最大长度为11位。");
    } else {
      if (!phoneNum.test(value)) {
        callback("请输入正确的手机号");
      } else {
        callback();
      }
    }
  }
  name(rule, value, callback) {
    if (value.length < 2) {
      callback("最小长度为2");
    } else if (value.length > 10) {
      callback("最大长度为10");
    } else if (value.length < 0) {
      callback("不能为空");
    } else {
      callback();
    }
  }
  email(rule, value, callback) {
    const re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
    if (!value) {
      callback();
      return;
    }
    if (re.test(value)) {
      if (value.length < 6) {
        callback("邮箱最小长度为6");
      } else if (value.length > 30) {
        callback("邮箱最大长度为30");
      } else {
        callback();
      }
    } else {
      // 可以为空
      if (value.length === 0) {
        callback();
      }
      callback("请输入正确的邮箱地址");
    }
  }
  telephone(rule, value, callback) {
    if (!value) {
      callback();
      return;
    }
    const re = /0\d{3}-\d{7,8}/;
    if (re.test(value)) {
      if (value.length > 13) {
        callback("最大长度为13");
      } else {
        callback();
      }
    } else {
      callback("请输入正确的座机号(格式如：0000-0000000)");
    }
  }
  comments(rule, value, callback) {
    if (!value) {
      callback();
      return;
    }
    if (value.length > 50) {
      callback("备注不超过为50");
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
    return (
      <div >
        <Form onSubmit={this.handleSubmit}>
        {
          this.props.status === "add" ? <FormItem
            {...formItemLayout}
            label="partyCode"
            style={{ display: "none" }}
          >
            {getFieldDecorator("partyCode", { initialValue: this.props.partyCode })(
              <Input />
            )}
          </FormItem> : <FormItem
            {...formItemLayout}
            label="code"
            style={{ display: "none" }}
          >
            {getFieldDecorator("code",
              { initialValue: this.props.data ? this.props.data.code : "" })(
              <Input />
            )}
          </FormItem>
        }
          <FormItem
            {...formItemLayout}
            label="姓名"
          >
            {getFieldDecorator("name",
              {
                initialValue: this.props.data ? this.props.data.name : "",
                rules: [
                  { required: true, message: "不能为空", },
                  { validator: this.name }
                ],
              })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="职位"
            style={{ display: "none" }}
          >
            {getFieldDecorator("position",
              {
                initialValue: this.props.data ? this.props.data.position : "",
                rules: [
                ],
              })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="性别"
          >
            {getFieldDecorator("gender", {
              initialValue: this.props.data ? this.props.data.gender : "",
            })(
              <RadioGroup>
                {
                  getthedictionary("sex_").map((v) =>
                    <Radio value={v.code}>{v.name}</Radio>
                  )
                }
              </RadioGroup>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="手机号码"
          >
            {getFieldDecorator("mobile", {
              initialValue: this.props.data ? this.props.data.mobile : "",
              rules: [
                { required: true, message: "不能为空", },
                { validator: this.mobile }
              ],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="座机号码"
          >
            {getFieldDecorator("telephone",
              {
                initialValue: this.props.data ? this.props.data.telephone : "",
                rules: [
                  // { required: true, message: "不能为空", },
                  // { validator: this.telephone }
                ],
              })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="邮箱"
          >
            {getFieldDecorator("email",
              {
                initialValue: this.props.data ? this.props.data.email : "",
                rules: [
                  { validator: this.email }
                ],
              })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="备注"
          >
            {getFieldDecorator("comments",
              {
                initialValue: this.props.data ? this.props.data.comments : "",
                rules: [
                  // { required: true, message: "不能为空", },
                  { validator: this.comments }
                ],
              })(
              <Input type="textarea" />
            )}
          </FormItem>
          <FormItem
            wrapperCol={{ span: 12, offset: 6 }}
            style={{ textAlign: "center" }}
          >
            <Button type="primary" onClick={() => { this.cancel(); }} style={{ marginRight: 5 }} >取消</Button>
            <Button type="primary" htmlType="submit" style={{ marginLeft: 5 }}>保存</Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}
const View1 = Form.create()(View);
export { View1 as default };
