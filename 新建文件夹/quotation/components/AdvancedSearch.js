import React from "react";
import styles from "../style.less";
import { Form, Row, Col, Input, Button, DatePicker } from "antd";
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
import fetch from "srcDir/common/ajax/index";

class AdvancedSearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bussList: [],
      BLFetching: false
    };
    this.handleSearch = this.handleSearch.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.searchBussList = this.searchBussList.bind(this);
  }
  // 获取供应商列表
  searchBussList(value) {
    if (value.length > 1 || this.state.bussList.length > 0) {
      return;
    }
    this.setState({ BLFetching: true });
    const that = this;
    fetch({
      url: "/sys/supplier/list",
      method: "post",
      params: {
        pageSize: 1000,
        statusCode: 1
      },
      success(res) {
        const bussList = res.entity.data;
        that.setState({ BLFetching: false, bussList });
      }
    });
  }
// 数据验证成功之后的回调
  handleSearch(e) {
    e.preventDefault();
    this.props.form.validateFields((err, formObj) => {
      // 提交前格式化参数
      formObj.supplierCode = formObj.supplierCode && formObj.supplierCode.key;
      // 未声明参数过滤
      const finalParam = {};
      for (const key in formObj) {
        if (formObj.hasOwnProperty(key) && formObj[key] !== undefined && formObj[key] !== "all" && formObj[key].length > 0) {
          finalParam[key] = formObj[key];
        }
      }
      this.props.setSearchParams(finalParam);
    });
  }
  handleReset() {
    this.props.form.resetFields();
    this.props.setSearchParams({});
  }
  render() {
    const form = this.props.form;
    return (
      <Form
        className={styles.searchArea}
        onSubmit={this.handleSearch}
      >
        <Row type="flex" justify="start">
          <SearchItem form={form} label="报价单名称" id="code" comp={<Input style={{ textTransform: "uppercase" }} placeholder="支持模糊搜索" />} />
          <SearchItem form={form} label="报价单号" id="name" comp={<Input placeholder="支持模糊搜索" />} />
          <SearchItem form={form} label="服务标准" id="name" comp={<Input placeholder="支持模糊搜索" />} />
          {/* <SearchItem
            form={form} label="供应商" id="supplierCode"
            span={5}
            comp={
              <Select
                style={{ width: "100%" }}
                showSearch
                labelInValue
                placeholder="输入供应商编码/名称"
                onSearch={this.searchBussList}
                notFoundContent={this.state.BLFetching ? <Spin size="small" /> : null}
                optionFilterProp="title"
              >
                {this.state.bussList.map(buss => <Option value={buss.code} title={`${buss.groupName}(${buss.bizCode})`}>{`${buss.groupName}(${buss.bizCode})`}</Option>)}
              </Select>
            }
          />
          <SearchItem
            form={form}
            label="审核状态"
            id="statusCode"
            options={{ initialValue: "all" }}
            comp={
              <Select>
                <Option value="all">所有</Option>
                <Option value="CHECKED">已审核</Option>
                <Option value="UNCHECKED">待审核</Option>
              </Select>
            }
          />*/}
          <Col span={8} style={{ textAlign: "center", paddingRight: "10px", display: "inline" }}>
            <Button type="primary" htmlType="submit" icon="search" size="large">查询</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleReset} size="large">
              清除
            </Button>
            <Button type="primary" icon="plus-circle-o" size="large" onClick={() => this.props.toDetail("add", {})} style={{ marginLeft: "10px" }}>新增报价单</Button>
          </Col>
        </Row>
        <Row type="flex" justify="start">
          {/* SearchItem form={form} label="报价时间" id="name" comp={<Input placeholder="支持模糊搜索" />} />*/}
          <SearchItem form={form} label="报价人" id="name" comp={<Input placeholder="支持模糊搜索" />} />
          <SearchItem
            form={form}
            label="采购日期"
            id="auditedDate"
            span={4}
            labelSpan={9}
            compSpan={14}
            comp={
              <RangePicker
                format="YYYY-MM-DD"
              />
            }
          />
          <Col span={8}>
            <Button icon="export" onClick={this.export} size="large" style={{ marginBottom: "8px", marginLeft: "10px", float: "right" }}>导出为PDF</Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

// 封装表单Item
const SearchItem = (props) => {
  const { getFieldDecorator } = props.form;
  // Item总占位
  const span = props.span || 4;
  // laebl标签占位
  const labelSpan = props.labelSpan || 8;
  // 输入控件占位
  const compSpan = props.compSpan || 15;
  // 输入控件设置
  const options = props.options || {};
  const formItemLayout = {
    labelCol: { span: labelSpan },
    wrapperCol: { span: compSpan },
  };
  const RightItem = getFieldDecorator(props.id, options)(props.comp);
  return (
    <Col span={span}>
      <FormItem
        {...formItemLayout}
        label={props.label}
        style={{ marginBottom: "12px" }}
      >
        {RightItem}
      </FormItem>
    </Col>
  );
};

export default Form.create()(AdvancedSearchForm);
