import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Input, DatePicker, Icon, Table, Row, Select, Button, Tooltip, Modal } from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './SellerList.less';
import globalStyles from '../../assets/style/global.less';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

@connect(state => ({
  sellerList: state.sellerList,
}))
export default class SellerList extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'sellerList/mount',
    });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'sellerList/unmount',
    });
  }
  showMingpianDetail(userId) {
    const { dispatch } = this.props;
    dispatch({
      type: 'sellerList/getMingpianDetail',
      payload: {
        userId,
      },
    });
  }
  handleCloseModal() {
    const { dispatch } = this.props;
    dispatch({
      type: 'sellerList/updateConfig',
      payload: {
        isShowMingpianModal: false,
        clickItemImg: '',
      },
    });
  }
  // 事件
  handleChangeSiftItem(type, e) {
    const { dispatch } = this.props;
    switch (type) {
      case 'keywords':
        dispatch({
          type: 'sellerList/changeConfig',
          payload: {
            [type]: e.target.value,
          },
        });
        break;
      case 'date':
        dispatch({
          type: 'sellerList/getList',
          payload: {
            startDate: e[0],
            endDate: e[1],
          },
        });
        break;
      // case 'sellerTeam':
      //   dispatch({
      //     type: 'sellerList/getList',
      //     payload: {
      //       [type]: e,
      //     },
      //   });
      //   break;
      // case 'checkStatus':
      //   dispatch({
      //     type: 'sellerList/getList',
      //     payload: {
      //       [type]: e,
      //     },
      //   });
      //   break;
      default:
        dispatch({
          type: 'sellerList/getList',
          payload: {
            [type]: e,
          },
        });
        break;
    }
  }
  handleGetOrderList() {
    const { dispatch } = this.props;
    dispatch({
      type: 'sellerList/getList',
    });
  }

  render() {
    const { sellerList: {
      keywords,
      startDate,
      endDate,
      sellerTeam,
      checkStatus,
      sellerTeamMap,
      accountStatusMap,
      sellerList,
      isLoading,
      hidden,
      salesAreaMap,
      provinceMap,
      stateMap,
      sellerMap,
      isShowMingpianModal,
      clickItemImg,
    } } = this.props;

    const columns = [
      {
        title: '序号',
        key: 'no',
        dataIndex: 'no',
        width: 80,
        align: 'center',
        render: (_, record, index) => {
          return (
            <span style={{ color: (record.checkStatus === '已禁用') ? '#ccc' : '' }} >{+index + 1}</span>
          );
        },
      },
      {
        title: '入职时间',
        key: 'regTime',
        dataIndex: 'regTime',
        align: 'center',
        render: (value, record) => {
          return (
            <span style={{ color: (record.checkStatus === '已禁用') ? '#ccc' : '' }} >{value}</span>
          );
        },
      },
      {
        title: '销售员',
        key: 'sellerName',
        dataIndex: 'sellerName',
        align: 'center',
        render: (sellerName, record) => {
          return (
            <Link to={`/customer/seller-list/seller-detail/${record.userId}`}>
              <span style={{ color: (record.checkStatus === '已禁用') ? '#ccc' : '#169bd5' }}>{sellerName}</span>
            </Link>
          );
        },
      },
      {
        title: '业务手机号',
        key: 'mobile',
        dataIndex: 'mobile',
        align: 'center',
        render: (value, record) => {
          return (
            <span style={{ color: (record.checkStatus === '已禁用') ? '#ccc' : '' }} >{value}</span>
          );
        },
      },
      {
        title: '负责的区域',
        key: 'area',
        dataIndex: 'area',
        align: 'center',
        render: (value, record) => {
          return (
            <Tooltip title={value}>
              <p style={{ width: 150 }} className={globalStyles.textOverflow}>{value}</p>
            </Tooltip>
          );
        },
      },
      {
        title: '负责的省份',
        key: 'province',
        dataIndex: 'province',
        align: 'center',
        render: (value, record) => {
          return (
            <Tooltip title={value}>
              <p style={{ width: 150 }} className={globalStyles.textOverflow}>{value}</p>
            </Tooltip>
          );
        },
      },
      {
        title: '负责的城区',
        key: 'state',
        dataIndex: 'state',
        align: 'center',
        render: (value, record) => {
          return (
            <Tooltip title={value}>
              <p style={{ width: 150 }} className={globalStyles.textOverflow}>{value}</p>
            </Tooltip>
          );
        },
      },
      {
        title: '负责的内勤省份',
        key: 'assistantProvince',
        dataIndex: 'assistantProvince',
        align: 'center',
        render: (value, record) => {
          return (
            <Tooltip title={value}>
              <p style={{ width: 150 }} className={globalStyles.textOverflow}>{value}</p>
            </Tooltip>
          );
        },
      },
      {
        title: '销售分组',
        key: 'sellerTeam',
        dataIndex: 'sellerTeam',
        align: 'center',
        render: (value, record) => {
          return (
            <span style={{ color: (record.checkStatus === '已禁用') ? '#ccc' : '' }} >{value}</span>
          );
        },
      },
      {
        title: '邀请名片',
        // key: 'sellerTeam',
        dataIndex: 'operation',
        key: 'operation',
        render: (value, record) => {
          return (
            <Button type="primary" onClick={() => this.showMingpianDetail(record.userId)}>
              点击查看
            </Button>
          );
        },
      },
      {
        title: '职务',
        key: 'duty',
        dataIndex: 'duty',
        align: 'center',
        render: (value, record) => {
          return (
            <span style={{ color: (record.checkStatus === '已禁用') ? '#ccc' : '' }} >{value}</span>
          );
        },
      },
      {
        title: '账号状态',
        key: 'checkStatus',
        dataIndex: 'checkStatus',
        align: 'center',
        render: (value, record) => {
          return (
            <span style={{ color: (record.checkStatus === '已禁用') ? '#ccc' : '' }} >{value}</span>
          );
        },
      },
    ];
    return (
      <PageHeaderLayout title="销售员管理">
        <Card bordered={false}>
          <Row>
            <Search
              value={keywords}
              className={globalStyles['input-sift']}
              placeholder="请输入销售员/手机号码"
              style={{ width: '200px' }}
              onChange={this.handleChangeSiftItem.bind(this, 'keywords')}
              onSearch={this.handleGetOrderList.bind(this)}
            />
            <RangePicker
              value={[startDate ? moment(startDate, 'YYYY-MM-DD') : null, endDate ? moment(endDate, 'YYYY-MM-DD') : null]}
              format="YYYY-MM-DD"
              onChange={this.handleChangeSiftItem.bind(this, 'date')}
              className={globalStyles['rangePicker-sift']}
            />
            <Select
              value={sellerTeamMap[sellerTeam]}
              className={globalStyles['select-sift']}
              placeholder="销售分组"
              onChange={this.handleChangeSiftItem.bind(this, 'sellerTeam')}
            >
              <Option value="">全部</Option>
              {
                Object.keys(sellerTeamMap).map((sellerTeamId) => {
                  return (
                    <Option value={sellerTeamId}>{sellerTeamMap[sellerTeamId]}</Option>
                  );
                })
              }
            </Select>
            <Select
              value={accountStatusMap[checkStatus]}
              className={globalStyles['select-sift']}
              placeholder="账号状态"
              onChange={this.handleChangeSiftItem.bind(this, 'checkStatus')}
            >
              <Option value="">全部</Option>
              {
                Object.keys(accountStatusMap).map((checkStatusId) => {
                  return (
                    <Option value={checkStatusId}>{accountStatusMap[checkStatusId]}</Option>
                  );
                })
              }
            </Select>
            <Select
              placeholder="负责的区域"
              style={{ width: 200, margin: '0 10px' }}
              onChange={this.handleChangeSiftItem.bind(this, 'areaId')}
              allowClear
              dropdownMatchSelectWidth={false}
            >
              {
                Object.keys(salesAreaMap).map(
                  item => (
                    <Option
                      key={item}
                      value={item}
                    >
                      {salesAreaMap[item]}
                    </Option>
                  )
                )
              }
            </Select>
            <Select
              placeholder="负责的省份"
              style={{ width: 200, margin: '0 10px' }}
              onChange={this.handleChangeSiftItem.bind(this, 'provinceId')}
              allowClear
              dropdownMatchSelectWidth={false}
            >
              {
                Object.keys(provinceMap).map(
                  item => (
                    <Option
                      key={item}
                      value={item}
                    >
                      {provinceMap[item]}
                    </Option>
                  )
                )
              }
            </Select>
            <Select
              placeholder="负责的城区"
              style={{ width: 200, margin: '0 10px' }}
              onChange={this.handleChangeSiftItem.bind(this, 'stateId')}
              allowClear
              dropdownMatchSelectWidth={false}
            >
              {
                Object.keys(stateMap).map(
                  item => (
                    <Option
                      key={item}
                      value={item}
                    >
                      {stateMap[item]}
                    </Option>
                  )
                )
              }
            </Select>
          </Row>
          <Row style={{ marginBottom: 10 }}>
            <Select
              placeholder="内勤省份"
              style={{ width: 200, margin: '0 10px' }}
              onChange={this.handleChangeSiftItem.bind(this, 'assistantProvinceId')}
              allowClear
              dropdownMatchSelectWidth={false}
            >
              {
                Object.keys(provinceMap).map(
                  item => (
                    <Option
                      key={item}
                      value={item}
                    >
                      {provinceMap[item]}
                    </Option>
                  )
                )
              }
            </Select>
            {
              hidden ? '' :
                <Link to="/customer/seller-list/seller-add">
                  <Button type="primary" style={{ float: 'right', right: 0 }}>
                    <Icon type="plus" />
                    新建销售员
                  </Button>
                </Link>
            }
          </Row>
          <Table
            bordered
            dataSource={sellerList}
            columns={columns}
            loading={isLoading}
            rowKey={record => record.id}
            className={globalStyles.tablestyle}
            pagination={false}
          />
          <Modal
            // title="Basic Modal"
            visible={isShowMingpianModal}
            // onOk={this.handleCloseModal.bind(this)}
            onCancel={this.handleCloseModal.bind(this)}
            footer={null}
          >
            <img src={clickItemImg} style={{ width: '100%' }} alt="图片" ></img>

          </Modal>
        </Card>
      </PageHeaderLayout>
    );
  }
}
