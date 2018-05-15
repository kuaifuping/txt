import React from "react";
// import styles from "./style.less";
import { Form, Input, Button, } from "antd";
// import fetch from "srcDir/common/model/itemModel/fetch";
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
      // fileList: [],
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.cancel = this.cancel.bind(this);
    // this.handlePreview = this.handlePreview.bind(this);
  }
  // componentDidMount() {
  //   console.log(this.props.data);
  //   // this.setInitialValue(this.props);
  // }
  componentWillReceiveProps(nextProps) {
    console.log(nextProps, 123);
  }
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
      }
    });
  }
  cancel() {
    this.props.cancel();
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
          <FormItem
            {...formItemLayout}
            label="国家"
          >
            {getFieldDecorator("name", {
              rules: [
                { required: true, message: "不能为空" },
              ],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="货币"
          >
            {getFieldDecorator("position", {
              rules: [
                { required: true, message: "不能为空" },
              ],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="开户行"
          >
            {getFieldDecorator("sex")(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="银行账号"
          >
            {getFieldDecorator("iphone")(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="账户名"
          >
            {getFieldDecorator("phone")(
              <Input />
            )}
          </FormItem>
          <FormItem
            wrapperCol={{ span: 12, offset: 6 }}
            style={{ textAlign: "center" }}
          >
            <Button type="primary" htmlType="submit" onClick={() => { this.cancel(); }} style={{ marginRight: 5 }} >取消</Button>
            <Button type="primary" htmlType="submit" onClick={() => { this.cancel(); }} style={{ marginLeft: 5 }}>保存</Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}
const View1 = Form.create()(View);
export { View1 as default };
