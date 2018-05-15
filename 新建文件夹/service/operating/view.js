import React from "react";
import styles from "./style.less";
import { Tabs } from "antd";
// import fetch from "srcDir/common/model/itemModel/fetch";
import BasicInformation from "srcDir/resource/workeffort/company/operating/basicInformation/view";
import Authentication from "srcDir/party/distributor/detail/qualification/view";
import Paymentmethod from "srcDir/resource/workeffort/company/operating/paymentmethod/view";
// import Bankinformation from "srcDir/resource/workeffort/company/operating/bankinformation/view";
import Bankinformation from "srcDir/party/distributor/detail/bankinformation/view";
import FinancialInformation from "srcDir/resource/workeffort/company/operating/financialInformation/view";
import ContactPerson from "srcDir/resource/workeffort/company/operating/contactPerson/view";
import Charges from "srcDir/resource/workeffort/company/operating/charges/view";
const TabPane = Tabs.TabPane;

const stateMachine = {
  add(_this) {
    _this.setState({
      disable: true,
    });
  },
  edit(_this) {
    _this.setState({
      disable: true,
    });
  },
  detail(_this) {
    _this.setState({
      disable: false,
    });
  }
};
class View extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disable: true,
      partyCode: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setdata = this.setdata.bind(this);
    this.partyCode = this.partyCode.bind(this);
  }
  componentDidMount() {
    // console.log();
    const item = this.props.pid.status;
    stateMachine[item](this);
    this.setdata();
    // this.setInitialValue("add");
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== "") {
      this.setdata(nextProps.results.data);
    }
  }
  setdata(value) {
    let type;
    if (!value) {
      type = "";
    } else {
      type = value.code;
    }
    this.setState({
      partyCode: type,
    });
  }
  partyCode(e) {
    // console.log(e);
    this.setState({
      partyCode: e
    });
  }
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
      }
    });
  }
  render() {
    const parameter = { status: this.props.pid.status, roleTypeCode: this.props.pid.roleTypeCode, disable: this.state.disable };
    const _this = this;
    return (
      <div className={styles.examinationPlaceMsg}>
        <Tabs defaultActiveKey="1" >
          <TabPane tab="基本资料" key="1">
            <BasicInformation status={parameter} data={this.props.results ? this.props.results : ""} partyCode={(e) => this.partyCode(e)} />
          </TabPane>
          <TabPane tab="资质类型" key="2" disabled={this.state.partyCode.length > 0 ? 0 : 1} >
            <Authentication status={parameter} partyCode={this.state.partyCode} />
          </TabPane>
          <TabPane tab="联系人员" key="3" disabled={this.state.partyCode.length > 0 ? 0 : 1} >
            <ContactPerson status={parameter} partyCode={this.state.partyCode} />
          </TabPane>
          {
            this.props.pid.status !== "add" && <TabPane tab="送装师傅" key="4">
              <Paymentmethod status={parameter} partyCode={this.state.partyCode} router={_this.props.router} />
            </TabPane>
          }
          <TabPane tab="收费标准" key="5" disabled={this.state.partyCode.length > 0 ? 0 : 1}>
            <Charges status={parameter} partyCode={this.state.partyCode} />
          </TabPane>
          <TabPane tab="银行信息" key="6" disabled={this.state.partyCode.length > 0 ? 0 : 1}>
            <Bankinformation status={parameter} partyCode={this.state.partyCode} />
          </TabPane>
          <TabPane tab="财务信息" key="7" disabled={this.state.partyCode.length > 0 ? 0 : 1} >
            <FinancialInformation status={parameter} partyCode={this.state.partyCode} />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export { View as default };
