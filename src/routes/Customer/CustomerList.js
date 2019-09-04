import React, { PureComponent } from 'react';
import moment from 'moment';
import { stringify } from 'qs';
import { connect } from 'dva';
import { Card, Input, DatePicker, Icon, Table, Row, Col, Select, Tooltip, Button, Checkbox, Tabs, Alert, message, Modal, Form, Popconfirm, Radio } from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './CustomerList.less';
import globalStyles from '../../assets/style/global.less';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const { TextArea } = Input;
@connect(state => ({
  customerList: state.customerList,
}))
@Form.create()
export default class CustomerList extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerList/mount',
    });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerList/unmount',
    });
  }
  changeMoreStatus() {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerList/changeViewMore',
    });
  }
  handleChangeSiftItem(type, e, dataStrings) {
    const { dispatch } = this.props;
    switch (type) {
      case 'customerId':
      case 'customerKeywords':
      case 'goodsSn':
      case 'inviter':
        dispatch({
          type: 'customerList/changeConfig',
          payload: {
            [type]: e.target.value,
          },
        });
        break;
      case 'regDate':
        dispatch({
          type: 'customerList/getList',
          payload: {
            regStartDate: dataStrings[0],
            regEndDate: dataStrings[1],
            currentPage: 1,
          },
        });
        break;
      case 'payDate':
        dispatch({
          type: 'customerList/getList',
          payload: {
            payStartDate: dataStrings[0],
            payEndDate: dataStrings[1],
            currentPage: 1,
          },
        });
        break;
      case 'lastLoginTime':
        dispatch({
          type: 'customerList/getList',
          payload: {
            lastLoginStartTime: dataStrings[0],
            lastLoginEndTime: dataStrings[1],
            currentPage: 1,
          },
        });
        break;
      case 'lostDate':
        dispatch({
          type: 'customerList/getList',
          payload: {
            lostStartDate: dataStrings[0],
            lostEndDate: dataStrings[1],
            currentPage: 1,
          },
        });
        break;
      case 'currentPage':
        dispatch({
          type: 'customerList/getList',
          payload: {
            [type]: e,
          },
        });
        break;
      case 'pageSize':
        dispatch({
          type: 'customerList/getList',
          payload: {
            [type]: dataStrings,
          },
        });
        break;
      default:
        dispatch({
          type: 'customerList/getList',
          payload: {
            [type]: e,
            currentPage: 1,
          },
        });
        break;
    }
  }
  handleGetOrderList() {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerList/getList',
      payload: {
        currentPage: 1,
      },
    });
  }
  handleChangeCheckBox(type, e) {
    const { dispatch, customerList } = this.props;
    const checkArr = customerList[type];
    const { sellerTeam } = customerList;
    switch (type) {
      case 'area':
      case 'customerTag':
      case 'customerType':
      case 'customerSource':
      case 'saleAmountPerMonth':
      case 'importedPercent':
      case 'duty':
      case 'payMethod':
      case 'userRank':
        if (checkArr.indexOf(e.target.value) > -1) {
          checkArr.splice(checkArr.indexOf(e.target.value), 1);
        } else {
          checkArr.push(e.target.value);
        }
        dispatch({
          type: 'customerList/changeConfig',
          payload: {
            [type]: checkArr,
          },
        });
        break;
      case 'lastMonthPaid':
        dispatch({
          type: 'customerList/changeConfig',
          payload: {
            [type]: e,
          },
        });
        break;
      case 'sellerTeam':
        dispatch({
          type: 'customerList/changeConfig',
          payload: {
            [type]: (sellerTeam === e.target.value) ? '' : e.target.value,
          },
        });
        break;
      default:
        break;
    }
  }

  handleChangeSelectOrderIds(selectOrderIds) {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerList/changeSelectOrderIds',
      payload: {
        selectOrderIds,
      },
    });
  }
  handleChangeSortList(type) {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerList/changeSortList',
      payload: {
        sort: type,
      },
    });
  }
  handleConfirmBtn(type) {
    const { dispatch } = this.props;
    switch (type) {
      case 'submit':
        dispatch({
          type: 'customerList/getList',
          payload: {
            currentPage: 1,
          },
        });
        break;
      case 'empty':
        dispatch({
          type: 'customerList/emptySiftItem',
        });
        break;
      default:
        break;
    }
  }
  // handleSelectInvitor(inviter, option) {
  //   const { dispatch } = this.props;
  //   const { children } = option.props;
  //   dispatch({
  //       type: 'customerList/getList',
  //       payload: {
  //           inviter,
  //           keywords: children,
  //       },
  //   });
  // }
  // handleChangeInvitor(text) {
  //   const { dispatch } = this.props;
  //   dispatch({
  //       type: 'customerList/getConfigList',
  //       payload: {
  //           keywords: text,
  //       },
  //   });
  // }
  handleBindSeveral = () => {
    this.props.form.resetFields()
    const { dispatch, customerList } = this.props;
    const { selectOrderIds } = customerList;
    if (selectOrderIds.length <= 0) {
      Modal.warning({
        title: '请选择客户！',
        okText: '确认',
        cancelText: '取消',
      });
    } else {
      dispatch({
        type: 'customerList/updateConfig',
        payload: {
          showModal: true,
          selectOrderIds,
          disabled: false,
          name: [],
        },
      });
    }
  }
  handleSelectType = (e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerList/selectType',
      payload: {
        type: e,
      },
    });
  }
  handleSubmit = (e) => {
    const { dispatch, customerList } = this.props;
    const { disabled } = customerList;
    if (!disabled) {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          dispatch({
            type: 'customerList/updateConfig',
            payload: {
              values,
            }
          });
          this.showConfirm()
        }
      });
    } else {
      dispatch({
        type: 'customerList/updateConfig',
        payload: {
          showModal: false,
          selectOrderIds: []
        }
      });
    }
  }
  showConfirm() {
    const { dispatch } = this.props;
    Modal.confirm({
      title: '确认',
      content: "确认要更改客户的绑定关系",
      okText: '确认',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'customerList/confirmBind',
          payload: {
            showModal: false,
            selectOrderIds: [],
          }

        })
      },
    });
  }
  handleCloseModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerList/updateConfig',
      payload: {
        showModal: false,
      },
    });
  }
  // 增加的弹窗方法
  commitCustomerServiceRecord() {
    const { dispatch, customerList } = this.props;
    const { serviceContentInput, serviceType, currentCustomerId } = customerList;
    dispatch({
      type: 'customerList/newCustomerServiceRecord',
      payload: {
        currentCustomerId,
        serviceContent: serviceContentInput,
        serviceType,
      },
    });
  }
  showCreateServiceTypeModal() {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerList/updatePageReducer',
      payload:{
        isShowCreateServiceTypeModal:true,
      }
    });
  }
  hideCreateServiceTypeModal() {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerList/hideCreateServiceTypeModal',
    });
  }
  createServiceType() {
    const { dispatch, customerList } = this.props;
    const { createServiceType } = customerList;
    dispatch({
      type: 'customerList/createServiceType',
      payload: {
        serviceTypeName: createServiceType,
      },
    });
  }
  getCreateServiceTypeValue(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerList/updatePageReducer',
      payload: {
        createServiceType: e.target.value,
      },
    });
  }
  handleCancelServiceRecordModal() {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerList/updatePageReducer',
      payload:{
        isShowNewServiceRecordModal:false
      }
    });
  }
  getServiceTypeValue(value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerList/updatePageReducer',
      payload: {
        serviceType: value,
      },
    });
  }
  getServiceContentValue(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerList/updatePageReducer',
      payload: {
        serviceContentInput: e.target.value,
      },
    });
  }
  handleShowModal=(customerId)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'customerList/getCustomerDetail',
      payload: {
        currentCustomerId:customerId,
        isShowNewServiceRecordModal:true,
      },
    });
  }

  render() {
    const {
      form,
      customerList: {
        customerActionList,
        hiddenItem,
        customerId, // 模糊筛选vvvvvv
        customerKeywords,
        goodsSn,
        regStartDate,
        regEndDate,
        payStartDate,
        payEndDate,
        // 配置项vvvvvvv
        seller,
        sellerMap, // 模糊筛选^^^^^^^^
        sellerTeam,
        sellerTeamMap,
        area,
        areaMap,
        customerTag,
        customerTagMap,
        customerType,
        customerTypeMap,
        customerSource,
        customerSourceMap,
        saleAmountPerMonth,
        saleAmountPerMonthMap,
        importedPercent,
        importedPercentMap,
        duty,
        dutyMap,
        payMethod,
        payMethodMap,
        userRank,
        userRankMap, // 配置项^^^^^

        isLoadingConfig, // 等待配置项加载
        sort, // 排序内容
        order, // 排序方式
        currentPage, // 第几页
        pageSize,
        viewMoreStatus,
        total, // 列表总条数
        customerInfo, // 客户列表数据
        isLoading,
        selectOrderIds,
        inviterMap,
        agentMap,
        areaManagerList,
        provinceManagerList,
        stateManagerList,
        salerList,
        showModal,
        sellerTypeMap,
        disabled,
        name,
        lostStartDate,
        lostEndDate,
        lastMonthPaid,
        isShowNewServiceRecordModal,
        serviceContentInput,
        confirmLoading,
        serviceTypeMap,
        serviceType,
        isShowCreateServiceTypeModal,
        customerDetail,
        lastLoginStartTime,
        lastLoginEndTime,
      },
    } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 15 },
    };
    const orderColumns = [
      {
        title: 'ID',
        key: 'customerId',
        dataIndex: 'customerId',
        width: '100px',
      },
      {
        title: '客户名称',
        key: 'customerName',
        dataIndex: 'customerName',
        width: '100px',
        render: (customerName, record) => {
          return (
            <Link to={`/customer/customer-list/customer-detail/${record.customerId}`}>
              <span style={{ color: '#169bd5' }}>{customerName}</span>
            </Link>
          );
        },
      },
      {
        title: '下单总额',
        key: 'totalOrderAmount',
        dataIndex: 'totalOrderAmount',
        width: '150px',
      },
      {
        title: '客户类型',
        key: 'customerType',
        dataIndex: 'customerType',
        width: '100px',
      },
      {
        title: '客户标签',
        key: 'customerTag',
        dataIndex: 'customerTag',
        width: '100px',
      },
      {
        title: '店铺名',
        key: 'companyName',
        dataIndex: 'companyName',
        width: '220px',
      },
      {
        title: '省份区域',
        key: 'area',
        dataIndex: 'area',
        width: '100px',
      },
      {
        title: '手机号',
        key: 'mobile',
        dataIndex: 'mobile',
        width: '150px',
      },
      {
        title: '注册时间',
        key: 'regTime',
        dataIndex: 'regTime',
        width: '130px',
      },
      {
        title: '最近登录时间',
        key: 'lastLoginTime',
        dataIndex: 'lastLoginTime',
        width: '130px',
      },
      {
        title: '点击次数',
        key: 'clickCount',
        dataIndex: 'clickCount',
        width: '100px',
      },
      // {
      //   title: '区域主管',
      //   key: 'sellerLeader',
      //   dataIndex: 'sellerLeader',
      //   width: '85px',
      // },
      {
        title: '区域经理',
        key: 'areaManager',
        dataIndex: 'areaManager',
        width: '85px',
      },
      {
        title: '省区经理',
        key: 'provinceManager',
        dataIndex: 'provinceManager',
        width: '85px',
      },
      {
        title: '城区经理',
        key: 'stateManager',
        dataIndex: 'stateManager',
        width: '85px',
      },
      {
        title: '内勤',
        key: 'seller',
        dataIndex: 'seller',
        width: '85px',
      },
      {
        title: '经销商',
        key: 'areaAgent',
        dataIndex: 'areaAgent',
        width: 60,
        render: (areaAgent) => {
          return <p style={{ width: 60 }} classNames={globalStyles.textOverflow}>{areaAgent}</p>
        }
      },
      {
        title: '邀请者',
        key: 'inviter',
        dataIndex: 'inviter',
        width: '85px',
      },
      {
        title: '印象认知',
        key: 'remark',
        dataIndex: 'remark',
        width: '200px',
        render: remark => (
          <Tooltip title={remark}>
            <span className={globalStyles['ellipsis-col']}>{remark}</span>
          </Tooltip>
        ),
      },
      {
        title: '客勤记录',
        key: 'sellerDutyLogList',
        dataIndex: 'sellerDutyLogList',
        width: 60,
        render: (sellerDutyLogList) => {
          return <Tooltip title={
            <div>
              {
               sellerDutyLogList&&sellerDutyLogList.map((item,index) => {
                  if(index<5){
                    return <p>{`[ ${item.time} ]${item.content}`}</p>
                  }
                })
              }
            </div>
          }><Icon type="ellipsis" /></Tooltip>
        }
      },
      {
        title: '操作',
        key: '',
        dataIndex: '',
        width: 100,
        render: (record) => {
          return <div style={{color:'#1890ff'}} onClick={this.handleShowModal.bind(this,record.customerId)}>新增客勤</div>
        }
      },
    ];
    const expandGoodsTable = (orderList) => {
      return (
        <Card bordered={false} bodyStyle={{ padding: 0, backgroundColor: '#FBFBFB' }}>
          <Row style={{ marginLeft: 38, marginBottom: 10 }}>
            {
              orderList.detail.customerTagList.map((customerTapId) => {
                return (
                  <Tooltip title={customerTagMap[customerTapId] ? customerTagMap[customerTapId].desc : ''}>
                    <span
                      className={styles['customer-tag']}
                      style={{ backgroundColor: `${customerTagMap[customerTapId] ? customerTagMap[customerTapId].color : ''}` }}
                    >
                      {customerTagMap[customerTapId] ? customerTagMap[customerTapId].name : ''}
                    </span>
                  </Tooltip>
                );
              })
            }
          </Row>
          <Row style={{ marginBottom: 10 }}>
            <Col md={8}>
              <span className={styles['detail-title']}>最近下单：</span>
              <span>{orderList.detail.lastPayTime}</span>
            </Col>
            <Col md={8}>
              <span className={styles['detail-title']}>店铺数：</span>
              <span>{orderList.detail.storeNum}</span>
            </Col>
            <Col md={8}>
              <span className={styles['detail-title']}>账户名：</span>
              <span>{orderList.detail.userName}</span>
            </Col>
          </Row>
          <Row style={{ marginBottom: 10 }}>
            <Col md={8}>
              <span className={styles['detail-title']}>下单次数：</span>
              <span>{orderList.detail.totalOrderCount}</span>
            </Col>
            <Col md={8}>
              <span className={styles['detail-title']}>月销售额：</span>
              <span>{orderList.detail.saleAmountPerMonth}</span>
            </Col>
            <Col md={8}>
              <span className={styles['detail-title']}>会员等级：</span>
              <span>{orderList.detail.userRank}</span>
            </Col>
          </Row>
          <Row>
            <Col md={8}>
              <span className={styles['detail-title']}>职务：</span>
              <span>{orderList.detail.duty}</span>
            </Col>
            <Col md={8}>
              <span className={styles['detail-title']}>进口品占比：</span>
              <span>{orderList.detail.importedPercent}</span>
            </Col>
            <Col md={8}>
              <span className={styles['detail-title']}>账号来源：</span>
              <span>{orderList.customerSource}</span>
            </Col>
          </Row>
        </Card>
      );
    };
    const exportSiftOrder = `http://erp.xiaomei360.com/common/export-custome-list?${
      stringify({
        customerId,
        customerKeywords,
        goodsSn,
        regStartDate,
        regEndDate,
        payStartDate,
        payEndDate,
        seller,
        currentPage,
        pageSize,
        sort,
        order,
        sellerTeam,
        area,
        customerTag,
        customerType,
        customerSource,
        saleAmountPerMonth,
        importedPercent,
        duty,
        payMethod,
        userRank,

      })
      }`;
    const exportSelectedOrder = `&${stringify({ customerId: selectOrderIds })}`;
    return (
      <PageHeaderLayout title="客户列表"
        iconType="question-circle"
        tips={
          <div>
            <p>客户标签</p>
            <p>1.新用户：注册通过以后，30天内-</p>
            <p>2.沉默用户：注册通过以后，超过30天，未下单转化</p>
            <p>3.新客户：从下单时间往后推，60天内</p>
            <p>4.普通客户：从当前时间往前推90天（历史），两个自然月内都有下单（当前时间）</p>
            <p>5.优质客户：从当前时间往前推180天（历史），期间5个自然月内有下单记录，且平均月销售额（180天）高于阀值（阀值可自定义配置）</p>
            <p>6.高危客户：从最后下单时间起45天，未下单</p>
            <p>7.流失客户：从最后下单时间起90天，未下单</p>
            <p>8.边缘召回客户：从最后下单时间起90天，未下单，成功召回下单，45天内标记</p>
            <h3>销售额异常标记</h3>
            <p>客户诊断</p>
            <p>1.当月（自然月）下单月销售额比近3个月平均月销售额的低于30%。标记 销售额低于30%</p>
            <p>2.2当月（自然月）下单月销售额比近3个月平均月客单价的高于30%。标记 销售额高于30%</p>
            <p>（如果180天内有3个月都有下单则这最近的3个月总销售额/3; 如果180天内有2个月有下单则这最近的2个月总销售额/2）</p>
          </div>}
      >
        <Card bordered={false}>
          <Card loading={isLoadingConfig} bordered={false} bodyStyle={{ padding: 0 }}>
            {/* <Row> */}
              <Search
                value={customerId}
                className={globalStyles['input-sift']}
                placeholder="客户ID"
                style={{ width: '140px' }}
                onChange={this.handleChangeSiftItem.bind(this, 'customerId')}
                onSearch={this.handleGetOrderList.bind(this)}
              />
              <Search
                value={customerKeywords}
                className={globalStyles['input-sift']}
                style={{ width: '220px' }}
                placeholder="客户名称/手机号/门店名称"
                onChange={this.handleChangeSiftItem.bind(this, 'customerKeywords')}
                onSearch={this.handleGetOrderList.bind(this)}
              />
              <Search
                value={goodsSn}
                className={globalStyles['input-sift']}
                placeholder="商品条码，查看客户"
                onChange={this.handleChangeSiftItem.bind(this, 'goodsSn')}
                onSearch={this.handleGetOrderList.bind(this)}
              />
              <span className={styles['search-span']}>注册时间: </span>
              <RangePicker
                value={[regStartDate ? moment(regStartDate, 'YYYY-MM-DD') : null, regEndDate ? moment(regEndDate, 'YYYY-MM-DD') : null]}
                format="YYYY-MM-DD"
                onChange={this.handleChangeSiftItem.bind(this, 'regDate')}
                className={globalStyles['rangePicker-sift']}
              />
              <span className={styles['search-span']}>最近下单时间: </span>
              <RangePicker
                value={[payStartDate ? moment(payStartDate, 'YYYY-MM-DD') : null, payEndDate ? moment(payEndDate, 'YYYY-MM-DD') : null]}
                format="YYYY-MM-DD"
                onChange={this.handleChangeSiftItem.bind(this, 'payDate')}
                className={globalStyles['rangePicker-sift']}
              />
              <span className={styles['search-span']}>流失时间: </span>
              <RangePicker
                value={[lostStartDate ? moment(lostStartDate, 'YYYY-MM-DD') : null, lostEndDate ? moment(lostEndDate, 'YYYY-MM-DD') : null]}
                format="YYYY-MM-DD"
                onChange={this.handleChangeSiftItem.bind(this, 'lostDate')}
                className={globalStyles['rangePicker-sift']}
              />
              <span className={styles['search-span']}>最近登录时间: </span>
              <RangePicker
                value={[lastLoginStartTime ? moment(lastLoginStartTime, 'YYYY-MM-DD') : null, lastLoginEndTime ? moment(lastLoginEndTime, 'YYYY-MM-DD') : null]}
                format="YYYY-MM-DD"
                onChange={this.handleChangeSiftItem.bind(this, 'lastLoginTime')}
                className={globalStyles['rangePicker-sift']}
              />
              {/* {
                (!hiddenItem.seller) ?
                  (
                    <Select
                      value={sellerMap[seller]}
                      className={globalStyles['select-sift']}
                      placeholder="请选择业务员"
                      onChange={this.handleChangeSiftItem.bind(this, 'seller')}
                    >
                      <Option value="">全部</Option>
                      {
                        Object.keys(sellerMap).map((sellerId) => {
                          return (
                            <Option value={sellerId}>{sellerMap[sellerId]}</Option>
                          );
                        })
                      }
                    </Select>
                  ) : ''
              } */}
            {/* </Row>
            <Row style={{ marginTop: 10 }}> */}
              {/* <AutoComplete
              dataSource={inviterMap ? Object.keys(inviterMap).map(key => (
                  <Select.Option value={key}>{inviterMap[key]}</Select.Option>
              )) : ''}
              onSelect={this.handleSelectInvitor.bind(this)}
              onSearch={this.handleChangeInvitor.bind(this)}
              className={globalStyles['input-sift']}
              // value={keywords}
              dropdownMatchSelectWidth={false}
              
              allowClear
              >
                  <Input
                      placeholder="请输入邀请者"
                  />
              </AutoComplete> */}
              <Search
                // value={customerId}
                className={globalStyles['input-sift']}
                placeholder="邀请者"
                style={{ width: '200px' }}
                onChange={this.handleChangeSiftItem.bind(this, 'inviter')}
                onSearch={this.handleGetOrderList.bind(this)}
              />
              <Select
                placeholder="所属区域经理"
                style={{ width: 200, margin: '0 10px' }}
                onChange={this.handleChangeSiftItem.bind(this, 'areaManagerId')}
                allowClear
                dropdownMatchSelectWidth={false}
              >
                <Option value="">全部</Option>
                {
                  Object.keys(areaManagerList).map(
                    item => (
                      <Option
                        key={item}
                        value={item}
                      >
                        {areaManagerList[item]}
                      </Option>
                    )
                  )
                }
              </Select>
              <Select
                placeholder="所属省份经理"
                style={{ width: 200, margin: '0 10px' }}
                onChange={this.handleChangeSiftItem.bind(this, 'provinceManagerId')}
                allowClear
                dropdownMatchSelectWidth={false}
              >
                <Option value="">全部</Option>
                {
                  Object.keys(provinceManagerList).map(
                    item => (
                      <Option
                        key={item}
                        value={item}
                      >
                        {provinceManagerList[item]}
                      </Option>
                    )
                  )
                }
              </Select>
              <Select
                placeholder="所属城区经理"
                style={{ width: 200, margin: '0 10px' }}
                onChange={this.handleChangeSiftItem.bind(this, 'stateManagerId')}
                allowClear
                dropdownMatchSelectWidth={false}
              >
                <Option value="">全部</Option>
                {
                  Object.keys(stateManagerList).map(
                    item => (
                      <Option
                        key={item}
                        value={item}
                      >
                        {stateManagerList[item]}
                      </Option>
                    )
                  )
                }
              </Select>
              <Select
                placeholder="请选择内勤"
                style={{ width: 200, margin: '0 10px' }}
                onChange={this.handleChangeSiftItem.bind(this, 'seller')}
                allowClear
                dropdownMatchSelectWidth={false}
              >
                <Option value="">全部</Option>
                {
                  Object.keys(salerList).map(
                    item => (
                      <Option
                        key={item}
                        value={item}
                      >
                        {salerList[item]}
                      </Option>
                    )
                  )
                }
              </Select>
              <Select
                placeholder="所属经销商"
                style={{ width: 200, margin: '0 10px' }}
                onChange={this.handleChangeSiftItem.bind(this, 'areaAgentId')}
                allowClear
                dropdownMatchSelectWidth={false}
              >
                <Option value="">全部</Option>
                {
                  Object.keys(agentMap).map(
                    item => (
                      <Option
                        key={item}
                        value={item}
                      >
                        {agentMap[item]}
                      </Option>
                    )
                  )
                }
              </Select>
              <Link to="/customer/customer-list/add-customer">
                <Button type="primary" style={{ float: 'right', right: 0 }}>
                  <Icon type="plus" />
                  新建客户
                </Button>
              </Link>
            {/* </Row>
            <Row> */}
              
            {/* </Row> */}
            {/* {
              (!hiddenItem.sellerTeam) ?
                (
                  <Row style={{ marginTop: 20, border: '1px solid #D7D7D7' }}>
                    <Col md={3} className={styles['check-title']}>
                      <span>销售分组</span>
                    </Col>
                    <Col md={20} className={styles['check-content']}>
                      {
                        Object.keys(sellerTeamMap).map((sellerTeamId) => {
                          return <Col md={3}><Checkbox checked={sellerTeam === sellerTeamId} value={sellerTeamId} onChange={this.handleChangeCheckBox.bind(this, 'sellerTeam')} /> {sellerTeamMap[sellerTeamId]}</Col>;
                        })
                      }
                    </Col>
                  </Row>
                ) : ''
            } */}
            <Row style={{ border: '1px solid #D7D7D7', borderTop: 0, marginTop:10 }}>
              <Col md={3} className={`${styles['check-title']} ${viewMoreStatus ? styles['area-title'] : ''}`}>
                <span>归属地区</span>
              </Col>
              <Col md={20} className={`${styles['check-content']} ${viewMoreStatus ? styles['area-content'] : ''}`}>
                <div style={{ height: 'auto' }}>
                  {
                    Object.keys(areaMap).map((areaId) => {
                      return <Col md={3}><Checkbox checked={area.indexOf(areaId) > -1} value={areaId} onChange={this.handleChangeCheckBox.bind(this, 'area')} /> {areaMap[areaId]}</Col>;
                    })
                  }
                </div>
              </Col>
              <Button className={styles['viewMore-btn']} onClick={this.changeMoreStatus.bind(this)}>更多<Icon type={viewMoreStatus ? 'down' : 'right'} /></Button>
            </Row>
            <Row style={{ border: '1px solid #D7D7D7', borderTop: 0 }}>
              <Col md={3} className={styles['check-title']}>
                <span>客户标签</span>
              </Col>
              <Col md={20} className={styles['check-content']}>
                {
                  Object.keys(customerTagMap).map((customerTagId) => {
                    return <Col md={3}><Checkbox checked={customerTag.indexOf(customerTagId) > -1} value={customerTagId} onChange={this.handleChangeCheckBox.bind(this, 'customerTag')} /> {customerTagMap[customerTagId].name}</Col>;
                  })
                }
              </Col>
            </Row>
            <Row style={{ border: '1px solid #D7D7D7', borderTop: 0 }}>
              <Col md={3} className={styles['check-title']}>
                <span>客户类型</span>
              </Col>
              <Col md={20} className={styles['check-content']}>
                {
                  Object.keys(customerTypeMap).map((customerTypeId) => {
                    return <Col md={3}><Checkbox checked={customerType.indexOf(customerTypeId) > -1} value={customerTypeId} onChange={this.handleChangeCheckBox.bind(this, 'customerType')} /> {customerTypeMap[customerTypeId]}</Col>;
                  })
                }
              </Col>
            </Row>
            <Row style={{ border: '1px solid #D7D7D7', borderTop: 0 }}>
              <Col md={3} className={styles['check-title']}>
                <span>账号来源</span>
              </Col>
              <Col md={20} className={styles['check-content']}>
                {
                  Object.keys(customerSourceMap).map((customerSourceId) => {
                    return <Col md={3}><Checkbox checked={customerSource.indexOf(customerSourceId) > -1} value={customerSourceId} onChange={this.handleChangeCheckBox.bind(this, 'customerSource')} /> {customerSourceMap[customerSourceId]}</Col>;
                  })
                }
              </Col>
            </Row>
            <Row>
              <Col md={3} className={styles['check-title']}>
                <span>高级筛选</span>
              </Col>
              <Col md={21} style={{ height: '80px' }}>
                <Tabs
                  type="card"
                  // size="small"
                  tabBarGutter={0}
                  tabBarStyle={{
                    border: '1px solid #D7D7D7',
                    borderTop: 0,
                    marginBottom: 0,
                    borderLeftStyle: 'none',
                  }}
                >
                  <TabPane className={styles['tabs-content']} tab="月销售额" key="1">
                    <Col md={20} className={styles['check-content']}>
                      {
                        Object.keys(saleAmountPerMonthMap).map((saleAmountPerMonthIdString) => {
                          const saleAmountPerMonthId = parseInt(saleAmountPerMonthIdString, 10);
                          return <Col md={3}><Checkbox checked={saleAmountPerMonth.indexOf(saleAmountPerMonthId) > -1} value={saleAmountPerMonthId} onChange={this.handleChangeCheckBox.bind(this, 'saleAmountPerMonth')} /> {saleAmountPerMonthMap[saleAmountPerMonthId]}</Col>;
                        })
                      }
                    </Col>
                  </TabPane>
                  <TabPane className={styles['tabs-content']} tab="进口品占比" key="2">
                    <Col md={20} className={styles['check-content']}>
                      {
                        Object.keys(importedPercentMap).map((importedPercentId) => {
                          return <Col md={3}><Checkbox checked={importedPercent.indexOf(importedPercentId) > -1} value={importedPercentId} onChange={this.handleChangeCheckBox.bind(this, 'importedPercent')} /> {importedPercentMap[importedPercentId]}</Col>;
                        })
                      }
                    </Col>
                  </TabPane>
                  <TabPane className={styles['tabs-content']} tab="职务" key="3">
                    <Col md={20} className={styles['check-content']}>
                      {
                        Object.keys(dutyMap).map((dutyId) => {
                          return <Col md={3}><Checkbox checked={duty.indexOf(dutyId) > -1} value={dutyId} onChange={this.handleChangeCheckBox.bind(this, 'duty')} /> {dutyMap[dutyId]}</Col>;
                        })
                      }
                    </Col>
                  </TabPane>
                  <TabPane className={styles['tabs-content']} tab="结算方式" key="4">
                    <Col md={20} className={styles['check-content']}>
                      {
                        Object.keys(payMethodMap).map((payMethodId) => {
                          return <Col md={3}><Checkbox checked={payMethod.indexOf(payMethodId) > -1} value={payMethodId} onChange={this.handleChangeCheckBox.bind(this, 'payMethod')} /> {payMethodMap[payMethodId]}</Col>;
                        })
                      }
                    </Col>
                  </TabPane>
                  <TabPane className={styles['tabs-content']} tab="会员等级" key="5">
                    <Col md={20} className={styles['check-content']}>
                      {
                        Object.keys(userRankMap).map((userRankId) => {
                          return <Col md={3}><Checkbox checked={userRank.indexOf(userRankId) > -1} value={userRankId} onChange={this.handleChangeCheckBox.bind(this, 'userRank')} /> {userRankMap[userRankId]}</Col>;
                        })
                      }
                    </Col>
                  </TabPane>
                  <TabPane className={styles['tabs-content']} tab="次月复购" key="6">
                    <Col md={20} className={styles['check-content']}  style={{display:'flex',alignItems:'center'}}>
                      <Checkbox.Group onChange={this.handleChangeCheckBox.bind(this, 'lastMonthPaid')} value={lastMonthPaid}>
                        <Checkbox value={1}/> 次月已复购
                        <Checkbox value={2}/> 次月未复购
                      </Checkbox.Group>
                    </Col>
                  </TabPane>
                </Tabs>
              </Col>
            </Row>
            <Row style={{ marginTop: 20 }}>
              <Col span={20}>
                <Button type="primary" onClick={this.handleConfirmBtn.bind(this, 'submit')}>确定</Button>
                <Button type="dashed" onClick={this.handleConfirmBtn.bind(this, 'empty')} style={{ marginLeft: 20 }}>清空</Button>
              </Col>
              <Col span={4}>
                {
                  customerActionList.map(item => {
                    if (item.type == 1) {
                      return <Button type="primary" onClick={this.handleBindSeveral}>{item.name}</Button>
                    }
                  })
                }
              </Col>
            </Row>
          </Card>
          <Row style={{ marginTop: 20, border: '1px solid #D7D7D7' }}>
            <Button className={styles['sort-btn']} onClick={this.handleChangeSortList.bind(this, 'regTime')}>注册时间<Icon type={(sort === 'regTime' && order === 1) ? 'up' : 'down'} /></Button>
            <Button className={styles['sort-btn']} onClick={this.handleChangeSortList.bind(this, 'storeNum')}>店铺数量<Icon type={(sort === 'storeNum' && order === 1) ? 'up' : 'down'} /></Button>
            <Button className={styles['sort-btn']} onClick={this.handleChangeSortList.bind(this, 'totalOrderAmount')}>订单金额<Icon type={(sort === 'totalOrderAmount' && order === 1) ? 'up' : 'down'} /></Button>
            <Button className={styles['sort-btn']} onClick={this.handleChangeSortList.bind(this, 'lastPayTime')}>下单时间<Icon type={(sort === 'lastPayTime' && order === 1) ? 'up' : 'down'} /></Button>
            <Button className={styles['sort-btn']} onClick={this.handleChangeSortList.bind(this, 'lastLoginTime')}>最近登录时间<Icon type={(sort === 'lastLoginTime' && order === 1) ? 'up' : 'down'} /></Button>
            <Button className={styles['sort-btn']} onClick={this.handleChangeSortList.bind(this, 'clickCount')}>点击数<Icon type={(sort === 'clickCount' && order === 1) ? 'up' : 'down'} /></Button>
          </Row>
          <Table
            bordered
            dataSource={customerInfo}
            columns={orderColumns}
            loading={isLoading}
            rowKey={record => record.customerId}
            expandedRowRender={expandGoodsTable}
            className={globalStyles.tablestyle}
            defaultExpandAllRows
            pagination={{
              total,
              showTotal:total => `共 ${total} 个结果`,
              pageSizeOptions: ['40', '50', '60', '80', '100', '120', '150', '200', '300'],
              current: currentPage,
              pageSize,
              showSizeChanger: true,
              onShowSizeChange: this.handleChangeSiftItem.bind(this, 'pageSize'),
              onChange: this.handleChangeSiftItem.bind(this, 'currentPage'),
            }}
            rowSelection={{
              selectedRowKeys: selectOrderIds,
              onChange: this.handleChangeSelectOrderIds.bind(this),
            }}
            // 导出
            footer={() => {
              return (
                customerActionList ?
                  customerActionList.map((actionInfo) => {
                    switch (+actionInfo.type) {
                      case 2:
                        return (
                          <a
                            href={actionInfo.url}
                            target="_blank"
                          >
                            <Button type="primary" style={{ marginLeft: 10 }}>{actionInfo.name}</Button>
                          </a>
                        );
                      case 3:
                        return (
                          <a
                            href={actionInfo.url + exportSelectedOrder}
                            target="_blank"
                          >
                            <Button type="primary" style={{ marginLeft: 10 }} disabled={selectOrderIds.length === 0} >{actionInfo.name}</Button>
                          </a>
                        );
                      default:
                        break;
                    }
                  })
                  :
                  null
              );
            }}
          />
        </Card>
        <Modal
          visible={showModal}
          title="批量绑定"
          onCancel={this.handleCloseModal}
          onOk={this.handleSubmit}
          maskClosable={false}
        >
          <Form onSubmit={this.handleSubmit}>
            <Form.Item {...formItemLayout} label="更改绑定角色">
              {
                getFieldDecorator('type', {
                  rules: [
                    {
                      required: true, message: '请选择绑定角色',
                    }
                  ]
                })(
                  <Select
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    onSelect={this.handleSelectType}
                  >
                    {
                      Object.keys(sellerTypeMap).map(item => {
                        return <Select.Option value={item}>
                          {sellerTypeMap[item]}
                        </Select.Option>
                      })
                    }
                  </Select>
                )
              }
            </Form.Item>
            {
              disabled && name.length > 0 ? <Row style={{ marginTop: -20 }}>
                <Alert
                  message="选择的客户，更改绑定角色存在多个销售员，请重新选择客户"
                  type="warning"
                  showIcon
                  className={styles.alert}
                />
              </Row> : ''
            }
            <Form.Item {...formItemLayout} label="原绑定人">
              {
                name.map(item => (
                  <span key={item}>{`${item}，`}</span>
                ))
              }
            </Form.Item>
            <Form.Item {...formItemLayout} label="更改为">
              {
                getFieldDecorator('seller', {
                  rules: [
                    {
                      required: true, message: '请选择更改人',
                    }
                  ]
                })(
                  <Select
                    disabled={disabled}
                  >
                    {
                      Object.keys(sellerMap).map(item => {
                        return <Select.Option value={item}>
                          {sellerMap[item]}
                        </Select.Option>
                      })
                    }
                  </Select>
                )
              }
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="客情详情"
          visible={isShowNewServiceRecordModal}
          onOk={this.commitCustomerServiceRecord.bind(this)}
          confirmLoading={confirmLoading}
          maskClosable={false}
          onCancel={this.handleCancelServiceRecordModal.bind(this)}
          // okText={viewServiceRecordId ? '更新' : '发布'}
          width="50%"
        >
          <div>
            <div style={{ display: 'inline-block' }}>
              <Icon type="file-text" style={{ fontSize: '20px', margin: '0 5px' }} />
              <span>客勤类型</span>
            </div>
            <div style={{ display: 'inline-block', marginLeft: '100px' }}>
              <Select
                value={serviceTypeMap[serviceType]}
                placeholder="请选择客勤类型"
                style={{ width: 200 }}
                onChange={this.getServiceTypeValue.bind(this)}
              >
                {
                  Object.keys(serviceTypeMap).map(
                    item => (
                      <Option
                        key={item}
                        value={item}
                      >
                        {serviceTypeMap[item]}
                      </Option>
                    )
                  )
                }
              </Select>
              <span className="primary" style={{ marginLeft: '10px', color: '#169BD5', cursor: 'pointer' }} onClick={this.showCreateServiceTypeModal.bind(this)}>新建</span>
            </div>
          </div>
          <TextArea
            name="serviceContent"
            style={{ width: '100%', margin: '15px 0' }}
            rows={6}
            placeholder="请在这里输入任务内容详情"
            value={serviceContentInput}
            // value={viewServiceRecordId ? viewServiceRecord.serviceContent : ''}
            onChange={this.getServiceContentValue.bind(this)}
          />
          <div style={{ background: '#F2F2F2', border: '1px solid rgb(169, 169, 169)', height: '100px', padding: '10px 20px' }}>
            <h3 style={{ color: '#999', fontWeight: 'bold', fontSize: '16px', display: 'inline-block', paddingRight: '10px' }}>绑定客户</h3>
            <span>(1)</span>
            <p>{customerDetail.customerName}</p>
          </div>
        </Modal>
        <Modal
          title="新建客勤类型"
          visible={isShowCreateServiceTypeModal}
          confirmLoading={confirmLoading}
          onCancel={this.hideCreateServiceTypeModal.bind(this)}
          onOk={this.createServiceType.bind(this)}
        >
          <Input placeholder="请输入客勤类型" onChange={this.getCreateServiceTypeValue.bind(this)} />
        </Modal>
      </PageHeaderLayout>
    );
  }
}
