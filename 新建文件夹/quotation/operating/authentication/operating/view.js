import React from "react";
// import styles from "./style.less";
import { Form, Input, Button, notification } from "antd";
import fetch from "srcDir/common/model/itemModel/fetch";
import Upload from "srcDir/common/upload/upload";
// let nameInputValue;
// let packageNumInputValue;
// const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
// const Option = Select.Option;
// const RadioButton = Radio.Button;
// const RadioGroup = Radio.Group;
class View extends React.Component {
  constructor(props) {
    super(props);
    // console.log(props);
    this.state = {
      fileList: "",
      dd: ""
      // columns: columns(this),
    };
    // this.setInitialValue = this.setInitialValue.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.cancel = this.cancel.bind(this);
    // this.handlePreview = this.handlePreview.bind(this);
  }
  // componentDidMount() {
  //   console.log(this.props.data);
  // }
  // componentWillReceiveProps(nextProps) {
  //   console.log(nextProps, 123);
  // }
  upload(e) {
    let ff;
    if (e.length > 0) {
      ff = e[0].response;
    } else {
      return false;
    }
    this.setState({
      fileList: ff,
    });
  }
  handleSubmit(e) {
    e.preventDefault();
    // console.log(13213);
    const _this = this;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
        fetch({
          url: _this.props.status === "edit" ? "/sys/qual/update" : "/sys/qual/save",
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
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const _this = this;
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
                { initialValue: this.props.data && this.props.data.code })(
                <Input />
              )}
            </FormItem>
          }
          <FormItem
            {...formItemLayout}
            label="附件名称"
          >
            {getFieldDecorator("contentName",
              {
                initialValue: this.props.data && this.props.data.contentName
              })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="上传"
          >
            <Upload callBack={(e) => _this.upload(e)} length="1" dataimg={this.props.data ? this.props.data.contentDesc : ""} />{/* 允许上传的长度 length */}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="上传"
            style={{ display: "none" }}
          >
            {getFieldDecorator("contentDesc",
              {
                initialValue: this.state.fileList,
              })(
              <Input />
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
