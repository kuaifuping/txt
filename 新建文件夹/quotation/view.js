import React from "react";
// import moment from "moment";
import styles from "./style.less";
import { Table, Breadcrumb, Button, Badge, Affix } from "antd";
import SearchWrap from "./components/AdvancedSearch.js";

// 创建react组件
const columns = that => [
  {
    title: "报价单号",
    dataIndex: "code",
    key: "code",
  }, {
    title: "报价名称",
    dataIndex: "name",
    key: "name",
  }, {
    title: "报价折扣",
    dataIndex: "supplierName",
    key: "supplierName",
  }, {
    title: "服务标准",
    dataIndex: "pricedBy",
    key: "pricedBy",
  }, {
    title: "报价标准金额",
    dataIndex: "pricedDate",
    key: "pricedDate",
  }, {
    title: "有效期至",
    dataIndex: "auditor",
    key: "auditor"
  }, {
    title: "报价时间",
    dataIndex: "auditDate",
    key: "auditDate",
  }, {
    title: "报价人",
    dataIndex: "statusCode",
    key: "statusCode",
    render: (value) => {
      switch (value) {
      case "UNCHECKED":
        return (<span><Badge status="default" />待审核</span>);
      case "CHECKED":
        return (<span><Badge status="success" />已审核</span>);
      default:
        return (<span><Badge status="warning" />未知错误</span>);
      }
    }
  }, {
    title: "操作",
    render: (value, row) => (
      <div>
        <Button size="small" type="primary" style={{ marginRight: "10px" }} onClick={() => that.toDetail("check", row)}>查看</Button>
        <Button size="small" icon="edit" onClick={() => that.toDetail("edit", row)}>修改</Button>
      </div>
    )
  }
];
class OrderList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: columns(this),
      pageSize: 10,
      mustHasDescription: "false",
      searchParams: {},
    };
    this.toDetail = this.toDetail.bind(this);
    this.setSearchParams = this.setSearchParams.bind(this);
  }
  // 设置搜索条件，搜索
  setSearchParams(searchParams) {
    this.setState({ searchParams });
    console.log("搜索参数：", searchParams);
    // 刷新表格
    this.props.actions.search(Object.assign({
      pageNo: 1,
      pageSize: this.state.pageSize,
      mustHasDescription: this.state.mustHasDescription
    }, searchParams));
  }
  // 跳转详情
  toDetail(type, row) {
    const { addRoute } = this.props.router;
    addRoute({ keyName: "定价详情", path: "/product/sku/priceDetail", name: "定价详情", title: "/product/sku/priceDetail", component: "product/sku/priceDetail", paramId: { params: row, type } });
  }

  render() {
    const rowSelection = {
      // selectedRowKeys,
      // selectedRows,
      onChange: (Keys, Rows) => {
        this.setState({
          selectedRowKeys: Keys,
          selectedRows: Rows
        });
        if (Rows.length) {
          this.setState({
            isSelected: false
          });
        } else {
          this.setState({
            isSelected: true
          });
        }
      },
      getCheckboxProps: record => {
        let isDld = false;
        isDld = record.statusCode === "UNCHECKED" || record.statusCode === "REJECTED"; // 判断是否为待审核状态
        return { disabled: isDld };
      }
    };
    return (
      <div className={styles.examinationPlaceMsg}>
        <Affix>
          <Breadcrumb separator="/" className={styles.Breadcrumb}>
            <Breadcrumb.Item>商品管理</Breadcrumb.Item>
            <Breadcrumb.Item>物料定价</Breadcrumb.Item>
          </Breadcrumb>
        </Affix>
        {
          this.props.results && <div>
            <SearchWrap setSearchParams={this.setSearchParams} toDetail={this.toDetail} />
            <Table
              rowKey="code"
              dataSource={this.props.results.data}
              rowSelection={rowSelection}
              columns={this.state.columns}
              pagination={{
                total: this.props.results.total,
                current: this.props.results.page,
                onChange: (current, pageSize) => {
                  this.props.actions.search(Object.assign({
                    pageNo: current,
                    pageSize: pageSize,
                    mustHasDescription: this.state.mustHasDescription
                  }, this.state.searchParams));
                },
                onShowSizeChange: (current, pageSize) => {
                  this.setState({ pageSize });
                  this.props.actions.search(Object.assign({
                    pageNo: 1,
                    pageSize: pageSize,
                    mustHasDescription: this.state.mustHasDescription
                  }, this.state.searchParams));
                },
                showSizeChanger: true,
                defaultPageSize: 20,
                pageSizeOptions: ["10", "20", "50", "100", "200", "500"]
              }}
            />
          </div>
        }
      </div>
    );
  }
}

export { OrderList as default };
