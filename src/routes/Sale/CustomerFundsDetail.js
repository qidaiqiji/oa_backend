import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Debounce from 'lodash-decorators/debounce';
import { Row, Col, Form, Card, Table, Select, Input, DatePicker, Modal, InputNumber, Tooltip } from 'antd';
import { Link } from 'dva/router';
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './CustomerFundsDetail.less';
import globalStyles from '../../assets/style/global.less';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;


@connect(state => ({
  customerFundsDetail: state.customerFundsDetail,
  user: state.user,
}))
@Form.create()
export default class Tablist extends PureComponent {
  componentDidMount() {
    const { dispatch, customerFundsDetail } = this.props;
    const { fundsType, startDate, endDate } = customerFundsDetail;
    const { id } = this.props.match.params;
    dispatch({
      type: 'customerFundsDetail/getConfig',
      payload: {
        userId: id,
        fundsType,
        startDate,
        endDate,
      },
    });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerFundsDetail/unmount',
    });
  }

  // 日期选择搜索
  handleChangeDate(dates, datesString) {
    const { dispatch, customerFundsDetail } = this.props;
    const { userId, fundsType } = customerFundsDetail;
    dispatch({
      type: 'customerFundsDetail/getList',
      payload: {
        userId,
        fundsType,
        startDate: datesString[0],
        endDate: datesString[1],
      },
    });
  }
  // 资金类型选择
  handleChangeFundsType(value) {
    const { dispatch, customerFundsDetail } = this.props;
    const { userId, startDate, endDate } = customerFundsDetail;
    dispatch({
      type: 'customerFundsDetail/getList',
      payload: {
        userId,
        fundsType: value,
        startDate,
        endDate,
      },
    });
  }
  // 添加收款记录弹窗
  handleClickAddReceivedRecord() {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerFundsDetail/clickAddRecord',
      payload: {
        recordType: 0,
      },
    });
  }
  // 添加付款记录弹窗
  handleClickAddPayRecord() {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerFundsDetail/clickAddRecord',
      payload: {
        recordType: 1,
      },
    });
  }
  // 取消弹窗
  handleClickCancelChangeRecordButton() {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerFundsDetail/clickCancelChangeRecord',
    });
  }
  // 修改付款金额
  handleChangeAmount(value) {
    // const { value } = e.target;
    const { dispatch } = this.props;
    dispatch({
      type: 'customerFundsDetail/changeAmount',
      payload: {
        amount: value,
      },
    });
  }
  // 修改收款账户
  handleChangeReceivableAccount(value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerFundsDetail/changeReceivableAccount',
      payload: {
        receivableAccount: value,
      },
    });
  }
  // 修改结算备注
  handleChangeRemark(e) {
    const { value } = e.target;
    const { dispatch } = this.props;
    dispatch({
      type: 'customerFundsDetail/changeRemark',
      payload: {
        remark: value,
      },
    });
  }
  // 确认弹窗
  handleClickOkChangeRecordButton() {
    const { dispatch, customerFundsDetail } = this.props;
    const { userId, amount, remark, receivableAccount, recordType } = customerFundsDetail;
    dispatch({
      type: 'customerFundsDetail/clickOkChangeRecord',
      payload: {
        recordType,
        userId,
        amount,
        receivableAccount,
        remark,
      },
    });
  }


  render() {
    const {
      customerFundsDetail: {
        userId,
        startDate,
        endDate,
        fundsType,
        customer,
        payableAmount,
        receivableAmount,
        fundsTypeMap,
        receivableAccountMap,
        receivableAccount,
        streamList,
        isLoading,
        isShowRecordConfirm,
        isRecordLoading,
        recordType,
        amount,
        remark,
      },
    } = this.props;
    const allSubtotal = streamList.reduce((pre, next) => {
      return pre + +next.amount;
    }, 0);

    // table 的列头数据
    const columns = [
      {
        title: '时间',
        dataIndex: 'time',
        key: 'time',
        width: 230,
        render: (time, record) => {
          if (record.isNotStream) {
            return {
              children: <div style={{ width: '100%', textAlign: 'center', fontSize: '16px', fontWeight: '700', color: '#A1A1A1' }}>总额</div>,
              props: {
                colSpan: 1,
              },
            };
          }
          return record.time;
        },
      }, {
        title: '订单金额',
        dataIndex: 'amount',
        key: 'amount',
        width: 170,
        render: (amount, record) => {
          if (record.isNotStream && allSubtotal) {
            return {
              children: <div style={{ width: '100%', textAlign: 'left', fontSize: '14px', fontWeight: '500', color: '#A1A1A1' }}>{allSubtotal.toLocaleString()}</div>,
              props: {
                colSpan: 5,
              },
            };
          }
          if (record.isNotStream && !allSubtotal) {
            return {
              children: null,
              props: {
                colSpan: 5,
              },
            };
          }
          return <span style={{ color: +amount > 0 ? 'green' : 'red' }}>{amount.toLocaleString()}</span>;
        },
      }, {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        width: 160,
        render: (type, record) => {
          if (record.isNotStream) {
            return {
              children: <span>hehehehehe</span>,
              props: {
                colSpan: 0,
              },
            };
          } else {
            return {
              children: <span>{(fundsTypeMap[type] === '挂账' || fundsTypeMap[type] === '账期欠款') ? <span style={{ color: 'green' }}>{fundsTypeMap[type]}</span> : <span style={{ color: 'red' }}>{fundsTypeMap[type]}</span>}</span>,
              props: {
                colSpan: 1,
              },
            };
          }
        },
      }, {
        title: '订单号',
        dataIndex: 'orderSn',
        key: 'orderSn',
        width: 270,
        render: (orderSn, record) => {
          if (record.isNotStream) {
            return {
              children: <span>hehehehehe</span>,
              props: {
                colSpan: 0,
              },
            };
          }
          return <span>{orderSn}</span>;
        },
      },
      {
        title: '流水号',
        dataIndex: 'transactionSn',
        key: 'transactionSn',
        width: 270,
        render: (transactionSn, record) => {
          if (record.isNotStream) {
            return {
              children: <span>hehehehehe</span>,
              props: {
                colSpan: 0,
              },
            };
          }
          return <span>{transactionSn}</span>;
        },
      },
      {
        title: '账户信息',
        dataIndex: 'financialAccount',
        key: 'financialAccount',
        width: 270,
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        width:200,
        render: (remark, record) => {
          if (record.isNotStream) {
            return {
              children: <span>hehehehehe</span>,
              props: {
                colSpan: 0,
              },
            };
          }
          return <Tooltip title={remark}>
            <p style={{width:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",margin:0}}>{remark}</p>
          </Tooltip>;
        },
      },
    ];

    return (
      (() => {
        return (
          <PageHeaderLayout title="资金明细" className={styles.addPageHeader}>
            <Card bordered={false}>
              <div className={styles.tableList}>
                <div className={styles.tableListForm}>
                  <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={12} sm={24} style={{ marginBottom: 24 }}>
                      <Col md={8} sm={24} style={{ color: '#949494' }}>
                        客户名称 : <span>{customer}</span>
                      </Col>
                      <Col md={8} sm={24} style={{ color: '#949494' }}>
                        应收总金额 : <span style={{ color: '#FF6600' }}>{(+receivableAmount).toLocaleString()}</span>
                      </Col>
                      <Col md={8} sm={24} style={{ color: '#949494' }}>
                        应付总金额 : <span style={{ color: '#FF6600' }}>{(+payableAmount).toLocaleString()}</span>
                      </Col>
                    </Col>
                    <Col md={12} sm={24} style={{ marginBottom: 24 }}>
                      <Col md={12} sm={24}>
                        下单时间 : <RangePicker className={globalStyles['rangePicker-sift']} onChange={this.handleChangeDate.bind(this)} defaultValue={[moment(startDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY-MM-DD')]} format="YYYY-MM-DD" />
                      </Col>
                      <Col md={12} sm={24}>
                        <Select
                          style={{ width: 120 }}
                          value={fundsType.toString()}
                          onChange={this.handleChangeFundsType.bind(this)}
                          className={globalStyles['select-sift']}
                        >
                          <Option value={'-1'}>全部</Option>
                          {
                            (Object.entries(fundsTypeMap).map((value) => {
                              return <Option value={value[0]}>{value[1]}</Option>;
                            }))
                          }
                        </Select>
                      </Col>
                    </Col>
                  </Row>
                </div>

                <Table
                  bordered
                  loading={isLoading}
                  rowKey={record => record.id}
                  dataSource={streamList.concat([{ id: streamList.length * 10000000, isNotStream: true }])}
                  // dataSource={customerInfos}
                  columns={columns}
                  pagination={false}
                />

                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={5} offset={19} sm={24} style={{ marginBottom: 24 }}>
                    <Col md={12} sm={24} style={{ color: '#949494' }}>
                      <span className={styles.addReceivedBtn} onClick={this.handleClickAddReceivedRecord.bind(this)}>添加收款记录</span>
                    </Col>
                    <Col md={12} sm={24} style={{ color: '#949494' }}>
                      <span className={styles.addPayBtn} onClick={this.handleClickAddPayRecord.bind(this)}>添加付款记录</span>
                    </Col>
                  </Col>
                </Row>

              </div>
              <Modal
                style={{ top: 300 }}
                width={1000}
                visible={isShowRecordConfirm}
                onOk={() => { this.handleClickOkChangeRecordButton(); }}
                confirmLoading={isRecordLoading}
                onCancel={this.handleClickCancelChangeRecordButton.bind(this)}
              >
                <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginTop: 10, marginBottom: 25 }}>
                  <Col md={12} style={{ height: 26, lineHeight: '26px' }}>
                    <span style={{ fontSize: '18px', color: '#333333', fontFamily: 'Arial Negreta', fontWeight: '600' }}>{recordType ? '添加付款记录' : '添加收款记录'}</span>
                  </Col>
                </Row>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={9}>
                    <Row md={24} style={{ height: 26, lineHeight: '26px' }}>
                      <span style={{ fontSize: '16px', color: '#AEAEAE', fontFamily: 'Arial Negreta', fontWeight: '500' }}>{recordType ? '付款金额 :' : '收款金额 :'}</span>
                      <span style={{ color: '#d7d7d7', marginLeft: '8px' }}>
                        <InputNumber
                          size="small"
                          style={{ width: 150 }}
                          value={amount}
                          min={0}
                          max={recordType ? Math.abs(+payableAmount) : Math.abs(+receivableAmount)}
                          onChange={this.handleChangeAmount.bind(this)}
                        />
                      </span>
                    </Row>
                    <Row md={24} style={{ height: 26, lineHeight: '26px' }}>
                      <span style={{ fontSize: '16px', color: '#AEAEAE', fontFamily: 'Arial Negreta', fontWeight: '500' }}>{recordType ? '付款账户 :' : '收款账户 :'}</span>
                      <span style={{ color: '#d7d7d7', marginLeft: '8px' }}>
                        <Select
                          size="small"
                          style={{ width: 150 }}
                          value={receivableAccount}
                          onChange={this.handleChangeReceivableAccount.bind(this)}
                        >
                          {
                            receivableAccountMap.map((item) => {
                              return <Option key={item.id} value={item.id}>{item.accountInfo}</Option>;
                            })
                          } 
                        </Select>
                      </span>
                    </Row>
                  </Col>
                  <Col md={15} style={{ height: 52 }}>
                    <Col md={4} style={{ height: 52 }}>
                      <span style={{ fontSize: '16px', color: '#AEAEAE', fontFamily: 'Arial Negreta', fontWeight: '500' }}>结算备注 : </span>
                    </Col>
                    <Col md={20} style={{ height: 52 }}>
                      <span style={{ color: '#d7d7d7', marginLeft: '8px' }}>
                        <Input.TextArea
                          onChange={this.handleChangeRemark.bind(this)}
                          value={remark}
                          placeholder="客户支付类型，特殊申请信息，账期政策等，协商处理结果写到这里，方便财务对其审核相关业务事项。"
                          style={{ width: '100%', border: '2px dashed #BCBCBC' }}
                          autosize={{ minRows: 2, maxRows: 2 }}
                        />
                      </span>
                    </Col>
                  </Col>
                </Row>
              </Modal>
            </Card>
          </PageHeaderLayout>
        );
      })()
    );
  }
}
