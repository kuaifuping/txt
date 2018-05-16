import React from "react";
// import styles from "./style.less";
import { Form, Input, Button, Cascader, notification, Row, Col, Modal } from "antd";
import fetch from "srcDir/common/model/itemModel/fetch";
// import history from "srcDir/common/router/history";
import Tree from "srcDir//resource/workeffort/company/operating/basicInformation/tree/view";
const FormItem = Form.Item;
import { cityMap } from "srcDir/common/model/codeMap";
const addressdata = (k) => {
  // const newdata = [];
  const newdata = k.map((v) => {
    const data = {};
    if (v.children) {
      data.label = v.geoName;
      data.value = v.geoIdcode;
      data.children = addressdata(v.children);
    } else {
      data.label = v.geoName;
      data.value = v.geoIdcode;
    }
    return data;
  });
  return newdata;
};
const opdata = addressdata(cityMap);
class View extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      title: "",
      label: "",
      orginGeo: [],
      destGeo: [],
      destGeoName: "",
      orginGeoName: ""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setdata = this.setdata.bind(this);
    this.showModal = this.showModal.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.getTree = this.getTree.bind(this);
    this.getcityName = this.getcityName.bind(this);
  }
  componentDidMount() {
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.data.data) {
      this.setdata(nextProps.data.data);
    }
  }
  setdata(value) {
    this.getcityName(value.orginGeo, "orginGeo");
    this.getcityName(value.destGeo, "destGeo");
    this.setState({
      formdata: value,
      orginGeo: value.orginGeo,
      destGeo: value.destGeo,
    });
  }
  getTree(e, t) {
    // console.log(e, t);
    const arry = t === 0 ? { orginGeo: e } : { destGeo: e };
    // console.log(arry);
    // dataObj = a;
    this.setState(arry);
  }
  getcityName(e, name) {
    const arryname = [];
    const dataDel = (id, dataJson) => {
      dataJson.map((v) => {
        if (v.geoIdcode === id) {
          arryname.push(v.geoName);
        } else {
          if (v.children) {
            dataDel(id, v.children);
          }
        }
        return true;
      });
      // console.log(datadel, 123131);
      return true;
    };
    // const arry = [];
    // console.log(e, "e");
    e.map(v => {
      const gg = dataDel(v, cityMap);
      // arry.push(gg);
      return gg;
    });
    // console.log(arryname, name);
    let namestr;
    arryname.map(v => {
      if (namestr) {
        namestr = namestr + "、" + v;
      } else {
        namestr = v;
      }
      return true;
    });
    if (name === "orginGeo") {
      this.setState({
        orginGeoName: namestr,
      });
    } else {
      this.setState({
        destGeoName: namestr,
      });
    }
  }
  handleOk(e, t) {
    // console.log(e, 13, t);
    this.getTree(e, t);
    const name = t === 0 ? "orginGeo" : "destGeo";
    this.getcityName(e, name);
    this.setState({
      visible: false,
    });
  }
  showModal(e) {
    let label;
    let data;
    if (e === "始发地") {
      label = 0;
      data = this.state.orginGeo;
    } else {
      label = 1;
      data = this.state.destGeo;
    }
    this.setState({
      title: e,
      visible: true,
      label: label,
      dataTree: data
    });
  }
  handleCancel() {
    // console.log(e);
    this.setState({
      visible: false,
    });
  }
  handleSubmit(e) {
    e.preventDefault();
    const _this = this;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log("Received values of form: ", values);
        values.provinceCode = values.select[0] || "";
        values.municipalityCode = values.select[2] || "";
        values.countyCode = values.select[1] || "";
        delete values.select;
        if (this.props.status.status === "edit") {
          values.code = this.state.formdata.code;
        }
        // _this.state.buyerList.map(v => {
        //   if (values.buyer === v.name) {
        //     values.buyer = v.code;
        //   }
        //   return false;
        // });
        // _this.state.maintainer.map(v => {
        //   if (values.maintainer === v.name) {
        //     values.maintainer = v.code;
        //   }
        //   return false;
        // });
        delete values.showDataO;
        delete values.showDataD;
        fetch({
          url: _this.props.status.status === "edit" ? "/sys//install/carrier/update" : "/sys//install/carrier/save",
          method: "POST",
          params: values,
          success: function (response) {
            // console.log(response);
            if (response.entity.code === "SUCCESS") {
              notification.success({
                message: response.entity.msg,
              });
              if (_this.props.status.status === "edit") {
                // _this.props.partyCode(_this.props.partyCode);
              } else {
                _this.props.partyCode(response.entity.data.code);
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
  render() {
    const _this = this;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const open = !this.props.status.disable;
    const formdata = this.state.formdata;
    return (
      <div >
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            wrapperCol={{ span: 4, offset: 22 }}
          >
            <Button type="primary" htmlType="submit">保存</Button>
          </FormItem>
          {
            _this.props.status.status !== "add" && <FormItem
              {...formItemLayout}
              label="送装公司编码"
            >
              <span className="ant-form-text">{formdata ? formdata.code : ""}</span>
            </FormItem>
          }
          <FormItem
            {...formItemLayout}
            label="送装公司名称"
          >
            {getFieldDecorator("groupName", {
              initialValue: formdata ? formdata.groupName : "",
              rules: [
                { required: true, message: "不能为空", },
                {
                  max: 77,
                  message: "送装公司名称不超过77字",
                }
              ],
            })(
              <Input disabled={open} placeholder="请输入送装公司名称" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="始发地"
          >
            <Row>
              <Col span={20}>
                {getFieldDecorator("showDataO", {
                  initialValue: this.state.orginGeoName,
                  rules: [
                    { required: true, message: "不能为空", },
                  ],
                })(
                  <Input disabled={1} value="" placeholder="请添加始发地" />
                )}
              </Col>
              <Col span={4} style={{ paddingLeft: 15 }}>
                <Button disabled={open} onClick={() => this.showModal("始发地")}>添加</Button>
              </Col>
            </Row>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="始发地"
            style={{ display: "none" }}
          >
            {getFieldDecorator("orginGeo", {
              initialValue: this.state.orginGeo,
              rules: [
                { required: true, message: "不能为空", },
              ],
            })(
              <Input disabled={1} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="目的地"
          >
            <Row>
              <Col span={20}>
                {getFieldDecorator("showDataD", {
                  initialValue: this.state.destGeoName,
                  rules: [
                    { required: true, message: "不能为空", },
                  ],
                })(
                  <Input disabled={1} value="" placeholder="请添加目的地" />
                )}
              </Col>
              <Col span={4} style={{ paddingLeft: 15 }}>
                <Button disabled={open} onClick={() => this.showModal("目的地")}>添加</Button>
              </Col>
            </Row>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="目的地"
            style={{ display: "none" }}
          >
            {getFieldDecorator("destGeo", {
              initialValue: this.state.destGeo,
              rules: [
                { required: true, message: "不能为空", },
              ],
            })(
              <Input disabled={1} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="所属地区"
          >
            {getFieldDecorator("select", {
              initialValue: formdata ? [`${formdata.provinceCode}`, `${formdata.countyCode}`, `${formdata.municipalityCode}`] : [],
              rules: [
                { required: true, message: "不能为空" },
              ],
            })(
              <Cascader options={opdata} disabled={open} placeholder="选择地区" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="详细地址"
          >
            {getFieldDecorator("address",
              {
                initialValue: formdata ? formdata.address : "",
                rules: [
                  // { required: true, message: "不能为空", },
                  {
                    max: 50,
                    message: "详细地址不超过50字",
                  }
                ],
              })(
              <Input disabled={open} placeholder="请输入详细地址" />
            )}
          </FormItem>
          {
            _this.props.status.status !== "add" && <FormItem
              {...formItemLayout}
              label="详细地址"
              style={{ display: "none" }}
            >
              {getFieldDecorator("addressCode",
                {
                  initialValue: formdata ? formdata.addressCode : "",
                })(
                <Input disabled={open} />
              )}
            </FormItem>
          }
          <FormItem
            {...formItemLayout}
            label="备注"
          >
            {getFieldDecorator("comments",
              {
                initialValue: formdata ? formdata.comments : "",
                rules: [
                  // { required: true, message: "不能为空", },
                  {
                    max: 100,
                    message: "备注不超过100字",
                  }
                ],
              })(
              <Input type="textarea" disabled={open} />
            )}
          </FormItem>
        </Form>
        <Modal
          title={`请选择${this.state.title}`}
          visible={this.state.visible}
          // onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
        >
          <Tree
            // checked={(e, t) => this.getTree(e, t)}
            name={this.state.label}
            data={this.state.dataTree}
            onOK={(e, t) => this.handleOk(e, t)}
            handleCancel={() => this.handleCancel()}
            // ref={(e) => { this.tree = e; }}
          />
        </Modal>
      </div>
    );
  }
}
const View1 = Form.create()(View);
export { View1 as default };
