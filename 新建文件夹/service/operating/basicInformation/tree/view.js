import React from "react";
import styles from "./style.less";
import { Tree, Button } from "antd";
// import fetch from "srcDir/common/model/itemModel/fetch";
// import history from "srcDir/common/router/history";
import { cityMap } from "srcDir/common/model/codeMap";
const TreeNode = Tree.TreeNode;
// import store from "store2";
// const codeMap = store.session.get("codeMap").children;
class View extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],
    };
    this.onExpand = this.onExpand.bind(this);
    this.setdata = this.setdata.bind(this);
    this.onCheck = this.onCheck.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.setCheckedKeys = this.setCheckedKeys.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onClick = this.onClick.bind(this);
  }
  componentDidMount() {
    this.setCheckedKeys(this.props.data);
  }
  componentWillReceiveProps(nextProps) {
    this.setCheckedKeys(nextProps.data);
  }
  onExpand(expandedKeys) {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }
  onCheck(checkedKeys) {
    // console.log("onCheck", checkedKeys);
    // this.props.checked(checkedKeys, this.props.name);
    this.setState({ checkedKeys });
  }
  onSelect(selectedKeys, info) {
    console.log("onSelect", info, "选中数据");
    this.setState({ selectedKeys });
  }
  onClick() {
    this.props.onOK(this.state.checkedKeys, this.props.name);
  }
  onCancel() {
    this.props.handleCancel();
  }
  setdata(value) {
    this.setState({
      formdata: value,
    });
  }
  setCheckedKeys(data) {
    this.setState({
      checkedKeys: data,
      // expandedKeys: data
    });
  }
  renderTreeNodes(data) {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.geoName} key={item.geoIdcode} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.geoName} key={item.geoIdcode} dataRef={item} />;
    });
  }
  render() {
    return (
      <div>
        <Tree
          checkable
          onExpand={this.onExpand}
          expandedKeys={this.state.expandedKeys}
          autoExpandParent={this.state.autoExpandParent}
          onCheck={this.onCheck}
          checkedKeys={this.state.checkedKeys}
          onSelect={this.onSelect}
          selectedKeys={this.state.selectedKeys}
        >
          {this.renderTreeNodes(cityMap)}
        </Tree>
        <div className={styles.footer}>
          <Button onClick={() => this.onCancel()} style={{ marginRight: 10 }}>取消</Button>
          <Button type="primary" onClick={() => this.onClick()}>保存</Button>
        </div>
      </div>
    );
  }
}
export { View as default };
