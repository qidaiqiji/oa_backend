import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Debounce from 'lodash-decorators/debounce';
import { Row, Col, Form, Card, Table, Select, Input, DatePicker, Modal, InputNumber, Tooltip } from 'antd';
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './SupplierFundsDetail.less';
import globalStyles from '../../assets/style/global.less';

const { Option } = Select;
const { RangePicker } = DatePicker;


@connect(state => ({
  supplierFundsDetail: state.supplierFundsDetail,
  user: state.user,
}))
@Form.create()
export default class Tablist extends PureComponent {
  componentDidMount() {
    const { dispatch, supplierFundsDetail } = this.props;
    const { fundsType, startDate, endDate } = supplierFundsDetail;
    const { id } = this.props.match.params;
    dispatch({
      type: 'supplierFundsDetail/getConfig',
      payload: {
        supplierId: id,
        fundsType,
        startDate,
        endDate,
      },
    });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierFundsDetail/unmount',
    });
  }

  // 日期选择搜索
  handleChangeDate(dates, datesString) {
    const { dispatch, supplierFundsDetail } = this.props;
    const { supplierId, fundsType } = supplierFundsDetail;
    dispatch({
      type: 'supplierFundsDetail/getList',
      payload: {
        supplierId,
        fundsType,
        startDate: datesString[0],
        endDate: datesString[1],
      },
    });
  }
  // 资金类型选择
  handleChangeFundsType(value) {
    const { dispatch, supplierFundsDetail } = this.props;
    const { supplierId, startDate, endDate } = supplierFundsDetail;
    dispatch({
      type: 'supplierFundsDetail/getList',
      payload: {
        supplierId,
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
      type: 'supplierFundsDetail/clickAddRecord',
      payload: {
        recordType: 0,
      },
    });
  }
  // 添加付款记录弹窗
  handleClickAddPayRecord() {
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierFundsDetail/clickAddRecord',
      payload: {
        recordType: 1,
      },
    });
  }
  // 取消弹窗
  handleClickCancelChangeRecordButton() {
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierFundsDetail/clickCancelChangeRecord',
    });
  }
  // 修改付款金额
  handleChangeAmount(value) {
    // const { value } = e.target;
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierFundsDetail/changeAmount',
      payload: {
        amount: value,
      },
    });
  }
  // 修改收款账户
  handleChangeReceivableAccount(value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierFundsDetail/changeReceivableAccount',
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
      type: 'supplierFundsDetail/changeRemark',
      payload: {
        remark: value,
      },
    });
  }
  // 确认弹窗
  handleClickOkChangeRecordButton() {
    const { dispatch, supplierFundsDetail } = this.props;
    const { supplierId, amount, remark, receivableAccount, recordType } = supplierFundsDetail;
    dispatch({
      type: 'supplierFundsDetail/clickOkChangeRecord',
      payload: {
        recordType,
        supplierId,
        amount,
        receivableAccount,
        remark,
      },
    });
  }


  render() {
    const {
      supplierFundsDetail: {
        supplierId,
        startDate,
        endDate,
        fundsType,
        supplierCompany,
        contacts,
        payableTotalAmount,
        receivableTotalAmount,
        receivableTotal,
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


    // table 的列头数据
    const columns = [
      {
        title: '时间',
        dataIndex: 'time',
        key: 'time',
      }, {
        title: '订单金额',
        dataIndex: 'amount',
        key: 'amount',
        width: 170,
        render: (value, record) => {
          return (
            <span style={{ color: (+record.type === 0 || +record.type === 2) ? 'green' : 'red' }}>{value}</span>
          );
        },
      }, {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        width: 160,
        render: (value) => {
          return (
            <span style={{ color: (+value === 0 || +value === 2) ? 'green' : 'red' }}>{fundsTypeMap[+value]}</span>
          );
          // return (value === '应收') ? <span style={{ color:}}>{value}</span> : <span style={{ color:  }}>{value}</span>;
        },
      }, {
        title: '订单号',
        dataIndex: 'orderSn',
        key: 'orderSn',
      }, {
        title: '流水号',
        dataIndex: 'transactionSn',
        key: 'transactionSn',
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        render: value => (
          <Tooltip title={value}>
            <span className={globalStyles['ellipsis-col']}>{value}</span>
          </Tooltip>
        ),
      },
    ];

    return (
      <PageHeaderLayout title="资金明细" className={styles.addPageHeader}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Row>
                <div style={{ color: '#949494', display: 'inline', paddingRight: 25 }}>
                  供应商公司名称 : <span style={{ marginLeft: 10 }} >{supplierCompany}</span>
                </div>
                <div style={{ color: '#949494', display: 'inline', paddingRight: 25 }}>
                  联系人 : <span style={{ paddingLeft: 10 }}>{contacts}</span>
                </div>
                <Row type="flex" align="middle">
                  <Col style={{ color: '#949494', display: 'inline-block', marginRight: 25 }}>
                    挂账应收总金额 : <span style={{ color: 'green', marginLeft: 10 }}>{receivableTotalAmount}</span>
                  </Col>
                  <Col style={{ color: '#949494', display: 'inline-block', marginRight: 25 }}>
                    账期应付总金额 : <span style={{ color: 'red', marginLeft: 10 }}>{payableTotalAmount}</span>
                  </Col>
                  <Col style={{ color: '#949494', display: 'inline-block', marginRight: 25 }}>
                    总应收额 : {
                      ((total) => {
                          if (+total > 0) {
                            return <span style={{ color: 'green', marginLeft: 10 }}>{total}</span>;
                          } else if (+total < 0) {
                            return <span style={{ color: 'red', marginLeft: 10 }}>{total}</span>;
                          } else {
                            return <span style={{ color: 'orange', marginLeft: 10 }}>{total}</span>;
                          }
                      })(receivableTotal)
                    }
                  </Col>
                  <RangePicker className={globalStyles['rangePicker-sift']} style={{ marginRight: 25 }} onChange={this.handleChangeDate.bind(this)} defaultValue={[moment(startDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY-MM-DD')]} format="YYYY-MM-DD" />
                  <Select
                    style={{ width: 120 }}
                    value={fundsType}
                    onChange={this.handleChangeFundsType.bind(this)}
                    className={globalStyles['select-sift']}
                  >
                    <Option key="-1" value="-1">全部类型</Option>
                    {
                    (Object.entries(fundsTypeMap).map((value) => {
                      return <Option key={value[0].toString()}>{value[1]}</Option>;
                    }))
                  }
                  </Select>
                </Row>
              </Row>
            </div>

            <Table
              bordered
              loading={isLoading}
              rowKey={record => record.id}
              dataSource={streamList}
              // dataSource={supplierInfos}
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
            onOk={this.handleClickOkChangeRecordButton.bind(this)}
            confirmLoading={isRecordLoading}
            onCancel={this.handleClickCancelChangeRecordButton.bind(this)}
          >
            <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginTop: 10, marginBottom: 25 }}>
              <Col md={12} style={{ height: 26, lineHeight: '26px' }}>
                <span style={{ fontSize: '18px', color: '#333333', fontFamily: 'Arial Negreta', fontWeight: '600' }}>{recordType ? '添加付款记录' : '添加收款记录'}</span>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={8}>
                <Col md={24} style={{ height: 26, lineHeight: '26px' }}>
                  <span style={{ fontSize: '16px', color: '#AEAEAE', fontFamily: 'Arial Negreta', fontWeight: '500' }}>{recordType ? '付款金额 :' : '收款金额 :'}</span>
                  <span style={{ color: '#d7d7d7', marginLeft: '8px' }}>
                    <InputNumber
                      size="small"
                      style={{ width: 200 }}
                      value={amount}
                      min={0}
                      // max={recordType ? Math.abs(+payableTotalAmount) : Math.abs(+receivableTotalAmount)}
                      onChange={this.handleChangeAmount.bind(this)}
                    />
                  </span>
                </Col>
                <Col md={24} style={{ height: 26, lineHeight: '26px' }}>
                  <span style={{ fontSize: '16px', color: '#AEAEAE', fontFamily: 'Arial Negreta', fontWeight: '500' }}>{recordType ? '付款账户 :' : '收款账户 :'}</span>
                  <span style={{ color: '#d7d7d7', marginLeft: '8px' }}>
                    <Select
                      size="small"
                      style={{ width: 200 }}
                      // value={receivableAccountMap[receivableAccount]}
                      value={receivableAccount}
                      onChange={this.handleChangeReceivableAccount.bind(this)}
                    >
                      {
                        receivableAccountMap.map((item) => {
                          return (
                            <Option value={item.id}>
                              <Tooltip
                                title={item.accountInfo}
                              >
                                <div>{item.accountInfo}</div>
                              </Tooltip>
                            </Option>
                          );
                        })
                      }
                    </Select>
                  </span>
                </Col>
              </Col>
              <Col md={16} style={{ height: 52 }}>
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
  }
}
