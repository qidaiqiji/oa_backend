import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Row, Button, Col, Select, Modal } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './SellerTeam.less';
import globalStyles from '../../assets/style/global.less';

const { confirm } = Modal;

const { Option } = Select;

@connect(state => ({
  sellerTeam: state.sellerTeam,
}))
export default class SellerTeam extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'sellerTeam/mount',
    });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'sellerTeam/unmount',
    });
  }
  // 事件
  handleChangeAreaItem(groupId, e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'sellerTeam/changeAreaItem',
      payload: {
        areaId: e,
        groupId,
      },
    });
  }
  handleSaveItem() {
    const { dispatch } = this.props;
    dispatch({
      type: 'sellerTeam/saveItem',
    });
  }
  handleEmptyItem() {
    const { dispatch } = this.props;
    confirm({
      title: '确定要清空当前选中的区域组吗?',
      content: '清空后需点击保存提交更新数据',
      okText: '确认',
      okType: 'primary',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'sellerTeam/changeAreaItem',
          payload: {
            areaId: '',
            groupId: '',
          },
        });
      },
      onCancel() {
      },
    });
  }

  render() {
    const { sellerTeam: {
      areaMap,
      groupList,
      isLoading,
      hidden,
    } } = this.props;
    return (
      <PageHeaderLayout title="分组管理">
        <Card bordered={false}>
          <Card bordered={false} bodyStyle={{ padding: 0 }}>
            {
              groupList.map((groupItem) => {
                return (
                  <Card style={{ marginTop: 20 }} bodyStyle={{ padding: 0 }}>
                    <Row>
                      <Col md={8} style={{ borderRight: '1px solid #E8E8E8', display: 'flex', alignItems: 'center', minHeight: 200 }}>
                        <div className={styles['div-middle']}>
                          <h1>{groupItem.groupName}</h1>
                          <Select
                            value={areaMap[groupItem.areaId]}
                            className={globalStyles['select-sift']}
                            placeholder="请选择销售区域组"
                            style={{ width: 190 }}
                            disabled={!!groupItem.areaId || false}
                            onChange={this.handleChangeAreaItem.bind(this, groupItem.groupId)}
                          >
                            {
                              Object.keys(areaMap).map((areaItem) => {
                                return (
                                  <Option value={areaItem}>{areaMap[areaItem]}</Option>
                                );
                              })
                            }
                          </Select>
                        </div>
                      </Col>
                      <Col md={8} style={{ borderRight: '1px solid #E8E8E8', minHeight: 200 }}>
                        <div style={{ margin: '20px' }}>
                          <Row>
                            <span style={{ fontSize: 16, fontWeight: 600 }}>组员</span><span style={{ color: 'red', marginLeft: 20 }}>({groupItem.sellerCount})</span>
                          </Row>
                          <Row style={{ marginTop: 10 }}>
                            <span>主管：</span><span>{groupItem.sellerLeader}</span>
                          </Row>
                          <Row style={{ marginTop: 10 }}>
                            {
                              groupItem.sellerList ? groupItem.sellerList.map((sellerName) => {
                                return <span style={{ marginRight: 15 }}>{sellerName}</span>;
                              }) :
                              null
                            }
                          </Row>
                        </div>
                      </Col>
                      <Col md={8}>
                        <div style={{ margin: '20px' }}>
                          <Row>
                            <span style={{ fontSize: 16, fontWeight: 600 }}>区域</span><span style={{ color: 'red', marginLeft: 20 }}>({groupItem.areaList ? groupItem.areaList.length : ''})</span>
                          </Row>
                          <Row style={{ marginTop: 10 }}>
                            {
                              groupItem.areaList ? groupItem.areaList.map((areaName) => {
                                return <span style={{ marginRight: 15 }}>{areaName}</span>;
                              }) :
                              null
                            }
                          </Row>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                );
              })
            }
          </Card>
          {
            hidden ? '' :
            <Row style={{ marginTop: 50 }}>
              <Button type="primary" style={{ width: 150 }} onClick={this.handleSaveItem.bind(this)} loading={isLoading}>保存</Button>
              <Button type="dashed" style={{ marginLeft: 20, width: 150 }} onClick={this.handleEmptyItem.bind(this)}>清空</Button>
            </Row>
          }
        </Card>
      </PageHeaderLayout>
    );
  }
}
