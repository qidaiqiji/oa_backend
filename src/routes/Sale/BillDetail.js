import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import Debounce from 'lodash-decorators/debounce';
import { getUrl } from '../../utils/request';
import { Row, Col, Card, Input, Select, Modal, Table, Button, Form, DatePicker, message, Popconfirm, Icon, Tabs, Checkbox, Tooltip, InputNumber, Upload, Carousel } from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './BillDetail.less';
import globalStyles from '../../assets/style/global.less';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Search } = Input;
const { Option } = Select;
const FormItem = Form.Item;
@connect(state => ({
  billDetail: state.billDetail,
}))
@Form.create()
export default class billDetail extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    const customerId = this.props.match.params.id;
    dispatch({
      type: 'billDetail/mount',
      payload: {
        customerId,
      },
    });
    dispatch({
      type: 'billDetail/updateState',
      payload: {
        customerId,
      },
    });
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'billDetail/unmount',
    });
  }
  beforeUpload = (file) => {
    const isImage = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isImage) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isImage && isLt2M;
  }
  handleRemoveUpload(info) {
    const { dispatch } = this.props;
    return false;
  }
  handleChangeUpload(info) {
    const { dispatch } = this.props;
    const { commitReceiveRecord } = this.props.billDetail;
    const { status, response } = info.file;
    if (status === 'done') {
      commitReceiveRecord.imageUrl = response.data.url;
      dispatch({
        type: 'billDetail/updateState',
        payload: {
          imageUrl: response.data.url,
          commitReceiveRecord,
        },
      });
    } else if (status === 'error') {
      message.error({
        message: '上传文件失败，请稍候重试',
      });
    }
  }
  handleReceiveFormModalOk() {
    const { dispatch } = this.props;
    const { commitReceiveRecord, paymentDetailData, confirmLoading } = this.props.billDetail;
    dispatch({
      type: 'billDetail/receiveRecordAdd',
      payload: {
        ...commitReceiveRecord,
      },
    }).then(
      () => {
        if (!confirmLoading) {
          // dispatch({
          //   type: 'billDetail/getSalePaymentDetail',
          //   payload: {
          //     checkBillId: commitReceiveRecord.checkBillId,
          //   },
          // });
          const resetCommitReceiveRecord = {};
          resetCommitReceiveRecord.shouldReceiveAmount = paymentDetailData.awaitReceiveAmount;
          // const receiveRecord = {};
          dispatch({
            type: 'billDetail/updateState',
            payload: {
              showReceiveFormModal: false,
              commitReceiveRecord: resetCommitReceiveRecord,
              // receiveRecord,
            },
          });
        }
      }
    );
  }
  handleReceiveFormModalCancel() {
    const { dispatch } = this.props;
    // const commitReceiveRecord = {};
    // const receiveRecord = {};
    dispatch({
      type: 'billDetail/updateState',
      payload: {
        showReceiveFormModal: false,
        // commitReceiveRecord,
        // receiveRecord,
      },
    });
  }
  showReceiveFormModal(record, e) {
    const { dispatch } = this.props;
    const { commitReceiveRecord, paymentDetailData } = this.props.billDetail;
    commitReceiveRecord.shouldReceiveAmount = paymentDetailData.awaitReceiveAmount;
    commitReceiveRecord.checkBillId = record.checkBillId;
    dispatch({
      type: 'billDetail/updateState',
      payload: {
        showReceiveFormModal: true,
        commitReceiveRecord,
      },
    });
  }
  showReceiveModal(record, e) {
    const { dispatch } = this.props;
    const { commitReceiveRecord } = this.props.billDetail;
    const { remark } = record;
    commitReceiveRecord.shouldReceiveAmount = record.awaitReceiveAmount;
    commitReceiveRecord.checkBillId = record.checkBillId;
    dispatch({
      type: 'billDetail/updateState',
      payload: {
        showReceiveModal: true,
        receiveRecord: record,
        commitReceiveRecord,
        remark,
      },
    });
    dispatch({
      type: 'billDetail/getSalePaymentDetail',
      payload: {
        checkBillId: record.checkBillId,
      },
    });
  }
  handleReceiveModalOk() {
    const { dispatch } = this.props;
    const { customerId } = this.props.billDetail;
    dispatch({
      type: 'billDetail/updateState',
      payload: {
        showReceiveModal: false,
      },
    });
    dispatch({
      type: 'billDetail/getCreditCheckBillList',
      payload: {
        returnDataName: 'awaitCustomerData',
        customerId,
        status: 1,
      },
    });
  }
  handleReceiveModalCancel() {
    const { dispatch } = this.props;
    dispatch({
      type: 'billDetail/updateState',
      payload: {
        showReceiveModal: false,
      },
    });
  }
  // handleFloat(num, precision = 12) {
  //   const { dispatch } = this.props;
  //   return +parseFloat(+num.toPrecision(precision));
  // }
  @Debounce(300)
  handleChangeSalePrice(index, value) {
    const { dispatch } = this.props;
    const { selectedRowsObjArray, selectedRowsAmount, useBalance } = this.props.billDetail;
    selectedRowsAmount[index].editNum = value;
    selectedRowsAmount[index].realAmount = value;
    selectedRowsAmount[index].realAmount = Number(selectedRowsAmount[index].salePrice * value).toFixed(2);
    selectedRowsObjArray[index].goodsNum = value;
    dispatch({
      type: 'billDetail/updateState',
      payload: {
        selectedRowsAmount,
        selectedRowsObjArray,
      },
    });
    dispatch({
      type: 'billDetail/changeGoodsNum',
      payload: {
        goodsInfoList: selectedRowsObjArray,
        useBalance,
        customerId: this.props.match.params.id,
      },
    });
  }
  changeUseDiscount(e) {
    const { dispatch } = this.props;
    const { selectedRowsObjArray } = this.props.billDetail;
    const useBalanceNow = e.target.checked ? 1 : 0;
    dispatch({
      type: 'billDetail/updateState',
      payload: {
        useBalance: useBalanceNow,
      },
    });
    dispatch({
      type: 'billDetail/changeGoodsNum',
      payload: {
        goodsInfoList: selectedRowsObjArray,
        useBalance: useBalanceNow,
        customerId: this.props.match.params.id,
      },
    });
  }
  showReconciliationModal() {
    const { dispatch } = this.props;
    const { selectedRows, selectedRowsAmount } = this.props.billDetail;
    if (selectedRows.length > 0) {
      for (let i = 0; i < selectedRows.length; i += 1) {
        const { recId, salePrice, realNum, realAmount, canEdit } = selectedRows[i];
        const editNum = realNum;
        const obj = {
          recId,
          salePrice,
          realNum,
          realAmount,
          canEdit,
          editNum,
        };
        selectedRowsAmount.push(obj);
      }
    }
    dispatch({
      type: 'billDetail/updateState',
      payload: {
        showReconciliationModal: true,
        selectedRowsAmount,
      },
    });
  }
  handleReconciliationModalOk() {
    const { dispatch } = this.props;
    const { selectedRowsObjArray, useBalance, customerId } = this.props.billDetail;
    dispatch({
      type: 'billDetail/createBillOrder',
      payload: {
        goodsInfoList: selectedRowsObjArray,
        useBalance,
        customerId,
      },
    }).then(
      () => {
        dispatch({
          type: 'billDetail/mount',
          payload: {
            customerId,
            expireStartTime: '',
            expireEndTime: '',
            orderStartTime: '',
            orderEndTime: '',
            orderSn: '',
            goodsKeywords: '',
            pageSize: 40,
            currentPage: 1,
          },
        });
        dispatch({
          type: 'billDetail/getCreditCheckBillList',
          payload: {
            returnDataName: 'awaitCustomerData',
            customerId,
            status: 1,
          },
        });
        dispatch({
          type: 'billDetail/updateState',
          payload: {
            customerId,
            expireStartTime: '',
            expireEndTime: '',
            orderStartTime: '',
            orderEndTime: '',
            orderSn: '',
            goodsKeywords: '',
            pageSize: 40,
            currentPage: 1,
            selectBillIds: [],
            selectedRows: [],
            selectedRowsAmount: [],
            resetSelectedRowsAmount: [],
            selectedRowsObjArray: [],
            resetSelectedRowsObjArray: [],
            receiveRecord: {},
          },
        });
      }
    );
    dispatch({
      type: 'billDetail/updateState',
      payload: {
        showReconciliationModal: false,
      },
    });
  }
  handleReconciliationModalCancel() {
    const { dispatch } = this.props;
    const { selectedRows, resetSelectedRowsObjArray, resetSelectedRowsAmount } = this.props.billDetail;
    if (selectedRows.length > 0) {
      for (let i = 0; i < selectedRows.length; i += 1) {
        const { recId, salePrice, realNum, realAmount, canEdit } = selectedRows[i];
        const editNum = realNum;
        const obj1 = {
          recId,
          salePrice,
          realNum,
          realAmount,
          canEdit,
          editNum,
        };
        const obj2 = {
          recId,
          goodsNum: realNum,
        };
        resetSelectedRowsAmount.push(obj1);
        resetSelectedRowsObjArray.push(obj2);
      }
    }
    dispatch({
      type: 'billDetail/updateState',
      payload: {
        selectedRowsAmount: resetSelectedRowsAmount,
        selectedRowsObjArray: resetSelectedRowsObjArray,
        useBalance: 0,
        showReconciliationModal: false,
      },
    });
    dispatch({
      type: 'billDetail/changeGoodsNum',
      payload: {
        goodsInfoList: resetSelectedRowsObjArray,
        useBalance: 0,
        customerId: this.props.match.params.id,
      },
    });
  }
  handleChangeSelectBillIds(selectBillIds, selectedRows) {
    const { dispatch } = this.props;
    const { useBalance } = this.props.billDetail;
    const selectedRowsObjArray = [];
    if (selectedRows.length > 0) {
      for (let i = 0; i < selectedRows.length; i += 1) {
        const { recId, realNum } = selectedRows[i];
        const obj = {
          recId,
          goodsNum: realNum,
        };
        selectedRowsObjArray.push(obj);
      }
    }
    dispatch({
      type: 'billDetail/changeGoodsNum',
      payload: {
        goodsInfoList: selectedRowsObjArray,
        useBalance,
        customerId: this.props.match.params.id,
      },
    });
    dispatch({
      type: 'billDetail/changeSelectBillIds',
      payload: {
        selectBillIds,
        selectedRows,
        selectedRowsObjArray,
      },
    });
  }
  handleSearch(type, e) {
    const { dispatch } = this.props;
    const { orderSn, goodsKeywords } = this.props.billDetail;
    switch (type) {
      case 'orderSn':
        dispatch({
          type: 'billDetail/requestPaymentList',
          payload: {
            [type]: orderSn,
            currentPage: 1,
          },
        });
        break;
      case 'goodsKeywords':
        dispatch({
          type: 'billDetail/requestPaymentList',
          payload: {
            [type]: goodsKeywords,
            currentPage: 1,
          },
        });
        break;
      default:
        break;
    }
  }
  deleteReceiveRecord(payRecId) {
    const { dispatch } = this.props;
    const { paymentDetailData } = this.props.billDetail;
    dispatch({
      type: 'billDetail/deletePayRecord',
      payload: {
        payRecId,
      },
    }).then(
      () => {
        dispatch({
          type: 'billDetail/getSalePaymentDetail',
          payload: {
            checkBillId: paymentDetailData.checkBillId,
          },
        });
      }
    );
  }
  saveSaleRemark(checkBillId) {
    const { dispatch } = this.props;
    const { remark, customerId } = this.props.billDetail;
    dispatch({
      type: 'billDetail/addRemark',
      payload: {
        checkBillId,
        remark,
      },
    });
    dispatch({
      type: 'billDetail/getCreditCheckBillList',
      payload: {
        returnDataName: 'awaitCustomerData',
        customerId,
        status: 1,
      },
    });
  }
  handleChangeInputValue(type, e, dataStrings) {
    const { dispatch } = this.props;
    const { commitReceiveRecord } = this.props.billDetail;
    switch (type) {
      case 'orderSn':
      case 'goodsKeywords':
      case 'remark':
        dispatch({
          type: 'billDetail/updateState',
          payload: {
            [type]: e.target.value,
          },
        });
        break;
      case 'shouldReceiveAmount':
        commitReceiveRecord.shouldReceiveAmount = e.target.value;
        dispatch({
          type: 'billDetail/updateState',
          payload: {
            commitReceiveRecord,
          },
        });
        break;
      case 'payer':
        commitReceiveRecord.payer = e.target.value;
        dispatch({
          type: 'billDetail/updateState',
          payload: {
            commitReceiveRecord,
          },
        });
        break;
      case 'financialAccountId':
        commitReceiveRecord.financialAccountId = e;
        dispatch({
          type: 'billDetail/updateState',
          payload: {
            commitReceiveRecord,
          },
        });
        break;
      case 'payDate':
        commitReceiveRecord.payDate = dataStrings;
        dispatch({
          type: 'billDetail/updateState',
          payload: {
            commitReceiveRecord,
          },
        });
        break;
      case 'expireDate':
        dispatch({
          type: 'billDetail/updateState',
          payload: {
            expireStartTime: dataStrings[0],
            expireEndTime: dataStrings[1],
            currentPage: 1,
          },
        });
        dispatch({
          type: 'billDetail/requestPaymentList',
          payload: {
            expireStartTime: dataStrings[0],
            expireEndTime: dataStrings[1],
            currentPage: 1,
            customerId: this.props.match.params.id,
          },
        });
        break;
      case 'orderDate':
        dispatch({
          type: 'billDetail/updateState',
          payload: {
            orderStartTime: dataStrings[0],
            orderEndTime: dataStrings[1],
            currentPage: 1,
          },
        });
        dispatch({
          type: 'billDetail/requestPaymentList',
          payload: {
            orderStartTime: dataStrings[0],
            orderEndTime: dataStrings[1],
            currentPage: 1,
            customerId: this.props.match.params.id,
          },
        });
        break;
      case 'currentPage':
        dispatch({
          type: 'billDetail/updateState',
          payload: {
            currentPage: e,
          },
        });
        dispatch({
          type: 'billDetail/requestPaymentList',
          payload: {
            [type]: e,
            customerId: this.props.match.params.id,
          },
        });
        break;
      case 'pageSize':
        dispatch({
          type: 'billDetail/updateState',
          payload: {
            pageSize: dataStrings,
            currentPage: 1,
          },
        });
        dispatch({
          type: 'billDetail/requestPaymentList',
          payload: {
            [type]: dataStrings,
            currentPage: 1,
            customerId: this.props.match.params.id,
          },
        });
        break;
      default:
        break;
    }
  }
  handleCarouselModalCancel() {
    const { dispatch } = this.props;
    dispatch({
      type: 'billDetail/updateState',
      payload: {
        showCarouselModal: false,
        srcArr: [],
        carouselModalTitle: '',
      },
    });
  }
  showCarousel(carouselModalTitle, srcArr) {
    const { dispatch } = this.props;
    dispatch({
      type: 'billDetail/updateState',
      payload: {
        showCarouselModal: true,
        srcArr,
        carouselModalTitle,
      },
    });
  }
  handleOperator(url) {
    const { dispatch } = this.props;
    dispatch({
      type: 'billDetail/handleOperatorRequest',
      payload: {
        url,
      },
    });
  }
  handlePrevious = () => {
    this.sliderWrapper.next();
  }
  handleNext = () => {
    this.sliderWrapper.prev();
  }
  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const uploadButton = (
      <div>
        <Icon type={isLoading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传收款截图</div>
      </div>
    );
    const uploadImageUrl = `${getUrl(API_ENV)}/sale/credit-check-pay-record/upload-img`;
    const {
      customerDetailData: {
        customerInfo,
      },
      paymentListData: {
        paymentList,
        actionList
      },
      countedData,
      paymentListData,
      awaitCustomerData,
      awaitFinanceData,
      creditCompleteData,
      paymentDetailData,
      statusData,
      // 参数
      expireStartTime,
      expireEndTime,
      orderStartTime,
      orderEndTime,
      orderSn,
      goodsKeywords,
      pageSize,
      currentPage,
      goodsInfoList,
      useBalance,
      commitReceiveRecord,

      // 控制样式或状态
      isLoading,
      total,
      selectBillIds,
      selectedRows,
      editNum,
      resetSelectedRowsObjArray,
      selectedRowsAmount,
      selectedRowsObjArray,
      resetSelectedRowsAmount,
      showReconciliationModal,
      confirmLoading,
      showReceiveModal,
      showReceiveFormModal,
      receiveRecord,
      imageUrl,
      remark,
      srcArr,
      carouselModalTitle,
      showCarouselModal,
      // actionList,
    } = this.props.billDetail;
    console.log("2",selectedRows)
    const CarouselModal = () => {
      return (
        <Modal
          title={carouselModalTitle}
          // visible
          visible={showCarouselModal}
          onCancel={this.handleCarouselModalCancel.bind(this)}
          footer={null}
        >
          <Carousel effect="fade" ref={(element) => { this.sliderWrapper = element; }} className={styles.carousel} >
            {
            srcArr ? srcArr.map((src, index) => (
              <img src={src} key={index} alt="展示图" style={{ width: '472px', height: '260px', background: '#ccc' }} />)) : ''
            }
          </Carousel>
          <Icon
            type="left"
            onClick={this.handleNext}
            style={{ position: 'absolute', top: '50%', left: '0%', fontSize: '40px' }}
          />
          <Icon
            type="right"
            style={{ position: 'absolute', top: '50%', right: '0%', fontSize: '40px' }}
            onClick={this.handlePrevious}
          />
        </Modal>
      );
    };
    // 待对账列表表格渲染
    const paymentColumn = [
      {
        title: '到期时间',
        key: 'expireTime',
        dataIndex: 'expireTime',
        render: (value, record) => {
          return <span style={record.isExpire ? { color: 'red' } : {}}>{value}</span>;
        },
      },
      {
        title: '总单号',
        key: 'groupSn',
        dataIndex: 'groupSn',
        render: (value, record) => {
          return <Link to={`/sale/sale-order/sale-order-list/sale-order-detail/${record.groupId}`}>{value}</Link>;
        },
      },
      {
        title: '商品名称',
        key: 'goodName',
        dataIndex: 'goodName',
        render: (value, record) => {
          return <div>{record.tag ? <span style={{ color: 'white', backgroundColor: '#ff6600', padding: '1px 3px' }}>{record.tag}</span> : ''}<span>{value}</span></div>;
        },
      },
      {
        title: '条形码',
        key: 'goodsSn',
        dataIndex: 'goodsSn',
      },
      {
        title: '销售价',
        key: 'salePrice',
        dataIndex: 'salePrice',
      },
      {
        title: '实际数量',
        key: 'realNum',
        dataIndex: 'realNum',
        render: (value, record) => {
          return (<Tooltip placement="topRight" title={record.realNumRemark}><div style={{ color: record.realNumColor }} >{value}</div></Tooltip>);
        },
      },
      {
        title: '实际金额',
        key: 'realAmount',
        dataIndex: 'realAmount',
        render: (value, record) => {
          return (<Tooltip placement="topRight" title={record.realAmountRemark}><div style={{ color: record.realAmountColor, cursor: 'pointer' }}>{value}</div></Tooltip>);
        },
      },
      {
        title: '下单时间',
        key: 'orderTime',
        dataIndex: 'orderTime',
      },
      {
        title: '账期条件',
        key: 'creditType',
        dataIndex: 'creditType',
      },
      {
        title: '子单号',
        key: 'orderSn',
        dataIndex: 'orderSn',
      },
    ];
    const paymentSelectedColumn = [
      {
        title: '到期时间',
        key: 'expireTime',
        dataIndex: 'expireTime',
        render: (value, record) => {
          return <span style={record.isExpire ? { color: 'red' } : {}}>{value}</span>;
        },
      },
      {
        title: '总单号',
        key: 'groupSn',
        dataIndex: 'groupSn',
        render: (value) => {
          return <Link to="#">{value}</Link>;
        },
      },
      {
        title: '商品名称',
        key: 'goodName',
        dataIndex: 'goodName',
        render: (value, record) => {
          return <div>{record.tag ? <span style={{ color: 'white', backgroundColor: '#ff6600', padding: '1px 3px' }}>{record.tag}</span> : ''}<span>{value}</span></div>;
        },
      },
      {
        title: '条形码',
        key: 'goodsSn',
        dataIndex: 'goodsSn',
      },
      {
        title: '销售价',
        key: 'salePrice',
        dataIndex: 'salePrice',
      },
      {
        title: '实际数量',
        key: 'realNum',
        dataIndex: 'realNum',
        render: (value, record, index) => {
          if (record.canEdit) {
            return <InputNumber max={value} min={0} precision={0} onChange={this.handleChangeSalePrice.bind(this, index)} value={selectedRowsAmount[index].editNum} />;
          } else {
            return (<Tooltip placement="topRight" title={record.realNumRemark}><div style={{ color: record.realNumColor }}>{value}</div></Tooltip>);
          }
        },
      },
      {
        title: '实际金额',
        key: 'realAmount',
        dataIndex: 'realAmount',
        render: (value, record, index) => {
          if (record.canEdit) {
            return <div style={+selectedRowsAmount[index].editNum === +selectedRowsAmount[index].realNum ? {} : { color: record.realNumColor }}>{selectedRowsAmount[index].realAmount}</div>;
          } else {
            return (<Tooltip placement="topRight" title={record.realAmountRemark}><div style={{ color: record.realAmountColor, cursor: 'pointer' }}>{value}</div></Tooltip>);
          }
        },
      },
      {
        title: '下单时间',
        key: 'orderTime',
        dataIndex: 'orderTime',
      },
      {
        title: '账期条件',
        key: 'creditType',
        dataIndex: 'creditType',
      },
      {
        title: '子单号',
        key: 'orderSn',
        dataIndex: 'orderSn',
      },
    ];
    // 待客户对账表格
    const awaitCustomerColumn = [
      {
        title: '对账单号',
        dataIndex: 'checkBillSn',
        key: 'checkBillSn',
        render: (value, record) => {
          const tag = record.checkBillTag.length ?
            record.checkBillTag.map(item =>
              (<Tooltip placement="top" title={item.remark} ><span style={{ color: 'white', backgroundColor: '#ff0000', padding: '1px 3px', marginRight: '3px', cursor: 'pointer' }}>{item.title}</span></Tooltip>)
            ) : '';
          return <div>{tag}<span>{value}</span></div>;
        },
      },
      {
        title: '应结算总金额',
        dataIndex: 'shouldReceiveAmount',
        key: 'shouldReceiveAmount',
      },
      {
        title: '实际收款金额',
        dataIndex: 'receivedAmount',
        key: 'receivedAmount',
        render: (value) => {
          return <span style={{ color: '#f00' }}>{value}</span>;
        },
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
      },
      {
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        width: '450px',
        render: (_, record) => {
          const operate = record.perActionList.map((actionInfo) => {
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
              case 4:
                return (
                  <Popconfirm
                    title={`确认${actionInfo.name}?`}
                    icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                    onConfirm={this.handleOperator.bind(this, actionInfo.url)}
                  >
                    <Button
                      style={{ marginLeft: 10 }}
                      type="primary"
                    >
                      {actionInfo.name}
                    </Button>
                  </Popconfirm>
                );
              default:
                return (
                  <Button
                    style={{ marginLeft: 10 }}
                    type="primary"
                    onClick={this.handleOperator.bind(this, actionInfo.url)}
                  >
                    {actionInfo.name}
                  </Button>
                );
            }
          });
          operate.splice(1, 0, <Button style={{ marginLeft: 10 }} type="primary" onClick={this.showReceiveModal.bind(this, record)} >添加付款记录</Button>);
          return <div>{operate}</div>;
        },
      },
    ];
    // 待财务销账表格
    const awaitFinanceColumn = [
      {
        title: '对账单号',
        dataIndex: 'checkBillSn',
        key: 'checkBillSn',
        render: (value, record) => {
          const tag = record.checkBillTag.length ?
            record.checkBillTag.map(item =>
              (<Tooltip placement="top" title={item.remark} ><span style={{ color: 'white', backgroundColor: '#ff0000', padding: '1px 3px', marginRight: '3px' }}>{item.title}</span></Tooltip>)
            ) : '';
          return <div>{tag}<span>{value}</span></div>;
        },
      },
      {
        title: '应结算总金额',
        dataIndex: 'shouldReceiveAmount',
        key: 'shouldReceiveAmount',
      },
      {
        title: '实际收款金额',
        dataIndex: 'receivedAmount',
        key: 'receivedAmount',
        render: (value) => {
          return <span style={{ color: '#f00' }}>{value}</span>;
        },
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
      },
      {
        title: '付款信息',
        dataIndex: 'payInfo',
        key: 'payInfo',
        width: '400px',
        render: (value) => {
          return (<Tooltip placement="top" title={value} overlayStyle={{ width: '400px' }} ><div>{value.map(item => `${item}\n`)}</div></Tooltip>);
        },
      },
      {
        title: '客户付款截图',
        dataIndex: 'payImage',
        key: 'payImage',
        width: '150px',
        render: (value) => {
          const img = Array.isArray(value) ? value.map(item => <img src={item} style={{ width: 55, height: 55 }}/>) : '';
          const imgLength = value.length;
          return (
            <div style={{ position: 'relative' }} onClick={this.showCarousel.bind(this, '客户付款截图', value)}>
              <div style={{ overflow: 'hidden', height: '55px' }} >{img}<span className={styles.imgNum}>{imgLength}</span></div>
            </div>
          );
        },
      },
    ];
    const creditCompleteColumn = [
      {
        title: '对账单号',
        dataIndex: 'checkBillSn',
        key: 'checkBillSn',
        render: (value, record) => {
          const tag = record.checkBillTag.length ?
            record.checkBillTag.map(item =>
              (<Tooltip placement="top" title={item.remark} ><div style={{ color: 'white', backgroundColor: '#ff0000', padding: '1px 3px', marginRight: '3px' }}>{item.title}</div></Tooltip>)
            ) : '';
          return <div>{tag}<span>{value}</span></div>;
        },
      },
      {
        title: '应结算总金额',
        dataIndex: 'shouldReceiveAmount',
        key: 'shouldReceiveAmount',
      },
      {
        title: '实际收款金额',
        dataIndex: 'receivedAmount',
        key: 'receivedAmount',
        render: (value) => {
          return <span style={{ color: '#f00' }}>{value}</span>;
        },
      },
      {
        title: '收款信息',
        dataIndex: 'receivedInfo',
        key: 'receivedInfo',
        width: '400px',
        render: (value) => {
          return (<Tooltip placement="top" title={value} overlayStyle={{ width: '400px' }} ><span>{value.map(item => `${item}\n`)}</span></Tooltip>);
        },
      },
      {
        title: '收款截图',
        dataIndex: 'receiveImage',
        key: 'receiveImage',
        width: '150px',
        render: (value) => {
          const img = Array.isArray(value) ? value.map(item => <img src={item} style={{ width: 55, height: 55 }} alt="收款截图" />) : '';
          const imgLength = value.length;
          return (
            <div style={{ position: 'relative' }} onClick={this.showCarousel.bind(this, '收款截图', value)}>
              <div style={{ overflow: 'hidden', height: '55px' }} >{img}<span className={styles.imgNum}>{imgLength}</span></div>
            </div>
          );
        },
      },
    ];
    const paymentDetailColumn = [
      {
        title: '付款日期',
        dataIndex: 'payTime',
        key: 'payTime',
      },
      {
        title: '实际应收款总额',
        dataIndex: 'realShouldReceiveAmount',
        key: 'realShouldReceiveAmount',
      },
      {
        title: '收款账户',
        dataIndex: 'financialAccount',
        key: 'financialAccount',
      },
      {
        title: '付款人',
        dataIndex: 'payer',
        key: 'payer',
      },
      {
        title: '客户付款截图',
        dataIndex: 'payImg',
        key: 'payImg',
        width: '150px',
        render: (value) => {
          return (
            <div style={{ position: 'relative' }} onClick={this.showCarousel.bind(this, '客户付款截图', new Array(value))}>
              <div style={{ overflow: 'hidden', height: '55px' }} ><img src={value} style={{ width: 55, height: 55 }} alt="客户付款截图" /><span className={styles.imgNum}>1</span></div>
            </div>
          );
        },
      },
      {
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        width: '80px',
        render: (_, record) => {
          return (<Button type="primary" onClick={this.deleteReceiveRecord.bind(this, record.recId)} >删除</Button>);
        },
      },
    ];
    // 第二个tab展开表格
    const billExpandTable = (checkBillList) => {
      const { detail } = checkBillList;
      const goodsColumns = [
        {
          title: '到期时间',
          dataIndex: 'expireTime',
          key: 'expireTime',
          render: (value, record) => {
            return <span style={record.isExpire ? { color: 'red' } : {}}>{value}</span>;
          },
        },
        {
          title: '总订单',
          dataIndex: 'groupSn',
          key: 'groupSn',
          render: (value, record) => {
            return <Link to={`/sale/sale-order/sale-order-list/sale-order-detail/${record.recId}`}>{value}</Link>;
          },
        },
        {
          title: '商品名称',
          dataIndex: 'goodsName',
          key: 'goodsName',
          render: (value, record) => {
            return <div>{record.tag ? <span style={{ color: 'white', backgroundColor: '#ff6600', padding: '1px 3px' }}>{record.tag}</span> : ''}<span>{value}</span></div>;
          },
        },
        {
          title: '条形码',
          dataIndex: 'goodsSn',
          key: 'goodsSn',
        },
        {
          title: '销售价',
          dataIndex: 'salePrice',
          key: 'salePrice',
        },
        {
          title: '实际数量',
          dataIndex: 'realNum',
          key: 'realNum',
          render: (value, record) => {
            return (<Tooltip placement="topRight" title={record.realNumRemark}><div style={{ color: record.realNumColor }}>{value}</div></Tooltip>);
          },
        },
        {
          title: '实际金额',
          dataIndex: 'realAmount',
          key: 'realAmount',
          render: (value, record) => {
            return (<Tooltip placement="topRight" title={record.realAmountRemark}><div style={{ color: record.realAmountColor }}>{value}</div></Tooltip>);
          },
        },
        {
          title: '下单时间',
          dataIndex: 'orderTime',
          key: 'orderTime',
        },
        {
          title: '子单号',
          dataIndex: 'orderSn',
          key: 'orderSn',
        },
      ];

      return (
        <Table
          columns={goodsColumns}
          dataSource={detail}
          bordered
          pagination={false}
          rowKey={record => record.recId}
        />
      );
    };
    return (
      <PageHeaderLayout title="销售账期分表">
        <Card bordered={false} >
          <Tabs defaultActiveKey="1" size="large">
            <TabPane tab="待对账列表" key="1">
              <div className={styles.extraButton}>
                {/* {
                  actionList.map(item=>(
                    <Button type="primary" href={item.url}>{item.name}</Button>
                  ))
                } */}
                
                <Button type="primary" onClick={this.showReconciliationModal.bind(this)} >生成对账单</Button>
              </div>
              <Row>
                <Col span={4} >
                待结算总额:<span className={styles.awaitAmount}>{customerInfo ? customerInfo.awaitPayAmount : '' }</span>
                </Col>
                <Col span={4} >
                客户姓名:<span className={styles.customerInfo}>{customerInfo ? customerInfo.customerName : '' }</span>
                </Col>
                <Col span={4} >
                所属业务员:<span className={styles.customerInfo}>{customerInfo ? customerInfo.seller : '' }</span>
                </Col>
                <Col span={4} >
                门店名称:<span className={styles.customerInfo}>{customerInfo ? customerInfo.companyName : '' }</span>
                </Col>
                <Col span={4} offset={4}>
                已选金额:<span className={styles.selectAmount}>{countedData.shouldReceiveAmount}</span>
                </Col>
              </Row>
              <Row gutter={16} style={{ margin: '20px 0' }}>
                <Col span={5} >
                  <span style={{ verticalAlign: '-webkit-baseline-middle', marginRight: '10px' }}>到期时间</span>
                  <RangePicker
                    className={globalStyles['rangePicker-sift']}
                    format="YYYY-MM-DD"
                    onChange={this.handleChangeInputValue.bind(this, 'expireDate')}
                    value={[expireStartTime ? moment(expireStartTime, 'YYYY-MM-DD') : null, expireEndTime ? moment(expireEndTime, 'YYYY-MM-DD') : null]}
                  />
                </Col>
                <Col span={5} >
                  <span style={{ verticalAlign: '-webkit-baseline-middle', marginRight: '10px' }} >下单时间</span>
                  <RangePicker
                    className={globalStyles['rangePicker-sift']}
                    format="YYYY-MM-DD"
                    onChange={this.handleChangeInputValue.bind(this, 'orderDate')}
                    value={[orderStartTime ? moment(orderStartTime, 'YYYY-MM-DD') : null, orderEndTime ? moment(orderEndTime, 'YYYY-MM-DD') : null]}
                  />
                </Col>
                <Col span={4} >
                  <Search
                    placeholder="请输入总单号/子单号"
                    onChange={this.handleChangeInputValue.bind(this, 'orderSn')}
                    onSearch={this.handleSearch.bind(this, 'orderSn')}
                  />
                </Col>
                <Col span={4} >
                  <Search
                    placeholder="商品名称/条码"
                    onChange={this.handleChangeInputValue.bind(this, 'goodsKeywords')}
                    onSearch={this.handleSearch.bind(this, 'goodsKeywords')}
                  />
                </Col>
              </Row>
              <Table
                bordered
                dataSource={paymentList}
                columns={paymentColumn}
                loading={isLoading}
                rowKey={record => record.recId}
                pagination={{
                  total: paymentListData.total,
                  current: currentPage,
                  pageSize,
                  showSizeChanger: true,
                  pageSizeOptions: ['30', '50', '60', '80', '100', '120', '150', '200', '300','500','1000'],
                  onShowSizeChange: this.handleChangeInputValue.bind(this, 'pageSize'),
                  onChange: this.handleChangeInputValue.bind(this, 'currentPage'),
                }}
                rowSelection={{
                  selectedRowKeys: selectBillIds,
                  onChange: this.handleChangeSelectBillIds.bind(this),
                  getCheckboxProps: record => ({
                    disabled: !record.isBackFinished
                  }),
                }}
              />

              {/* 待对账列表弹窗 */}
              <Modal
                width="100%"
                closable={false}
                visible={showReconciliationModal}
                onOk={this.handleReconciliationModalOk.bind(this)}
                confirmLoading={confirmLoading}
                onCancel={this.handleReconciliationModalCancel.bind(this)}
              >
                <Table
                  bordered
                  dataSource={selectedRows}
                  columns={paymentSelectedColumn}
                  rowKey={record => record.recId}
                  pagination={false}
                  style={{ marginTop: '20px' }}
                />
                <Card bordered={false}>
                  <Row>
                    <Col span={5} offset={19}>
                      <p style={{ marginLeft: '24px' }}>销售总金额：<span className={styles.countedAmount}>{countedData.saleTotalAmount}</span></p>
                      <p><Checkbox onChange={this.changeUseDiscount.bind(this)}>挂账抵扣：-<span className={styles.countedAmount}>{countedData.balanceAmount}</span></Checkbox></p>
                      <p style={{ marginLeft: '24px' }}>售后折扣：-<span className={styles.countedAmount}>{countedData.afterSaleDiscount}</span></p>
                      <p style={{ marginLeft: '24px' }}>应结算总金额：<span className={styles.selectAmount} >{countedData.shouldReceiveAmount}</span></p>
                    </Col>
                  </Row>
                </Card>
              </Modal>
            </TabPane>
            <TabPane tab="对账列表" key="2">
              <Row style={{ margin: '10px 0 20px 0' }}>
                <Col span={4} >
                客户姓名:<span className={styles.customerInfo}>{customerInfo ? customerInfo.customerName : '' }</span>
                </Col>
                <Col span={4} >
                门店名称:<span className={styles.customerInfo}>{customerInfo ? customerInfo.companyName : '' }</span>
                </Col>
                <Col span={4} >
                所属业务员:<span className={styles.customerInfo}>{customerInfo ? customerInfo.seller : '' }</span>
                </Col>
              </Row>
              <Card
                title={<div>待客户对账<Icon type="down" /></div>}
                style={{ marginTop: '20px' }}
              >
                <Table
                  expandedRowRender={billExpandTable}
                  bordered
                  dataSource={awaitCustomerData.checkBillList}
                  columns={awaitCustomerColumn}
                  pagination={false}
                  loading={isLoading}
                  rowKey={record => record.checkBillId}
                />
              </Card>
              <Card
                title={<div>待财务对账<Icon type="down" /></div>}
                style={{ marginTop: '20px' }}
              >
                <Table
                  expandedRowRender={billExpandTable}
                  bordered
                  dataSource={awaitFinanceData.checkBillList}
                  columns={awaitFinanceColumn}
                  pagination={false}
                  loading={isLoading}
                  rowKey={record => record.checkBillId}
                />
              </Card>
              <Modal
                width="90%"
                // closable={false}
                visible={showReceiveModal}
                onOk={this.handleReceiveModalOk.bind(this)}
                confirmLoading={confirmLoading}
                onCancel={this.handleReceiveModalCancel.bind(this)}
              >
                <div style={{ background: '#f2f2f2', padding: '10px', marginTop: '25px' }}>
                  <Row style={{ margin: '10px 0 20px 0' }}>
                    <Col span={4} style={{ fontSize: '20px', fontWeight: 'bold' }} >
                    收款信息
                    </Col>
                  </Row>
                  <Row style={{ margin: '10px 0 20px 0' }}>
                    <Col span={4} style={{ height: '32px' }} >
                    应结算总金额:<span className={styles.customerInfo}>{paymentDetailData.shouldReceiveAmount}</span>
                    </Col>
                    <Col span={4} style={{ height: '32px' }} >
                    实际应收总金额:<span className={styles.customerInfo}>{paymentDetailData.realShouldReceiveAmount}</span>
                    </Col>
                    <Col span={4} style={{ height: '32px' }} >
                    对账单号:<span className={styles.customerInfo}>{paymentDetailData.checkBillSn}</span>
                    </Col>
                    <Col span={4} style={{ height: '32px' }} >
                    客户姓名:<span className={styles.customerInfo}>{customerInfo ? customerInfo.customerName : '' }</span>
                    </Col>
                    <Col span={4} style={{ height: '32px' }} >
                    门店名称:<span className={styles.customerInfo}>{customerInfo ? customerInfo.companyName : '' }</span>
                    </Col>
                    <Col span={2} style={{ height: '32px' }} >
                    所属业务员:<span className={styles.customerInfo}>{customerInfo ? customerInfo.seller : '' }</span>
                    </Col>
                    <Col span={2} >
                      <Button type="primary" onClick={this.showReceiveFormModal.bind(this, receiveRecord)} style={{ float: 'right', marginTop: '-10px' }}>添加付款记录</Button>
                    </Col>
                  </Row>
                </div>
                <Table
                  bordered
                  dataSource={paymentDetailData.paymentDetail}
                  columns={paymentDetailColumn}
                  rowKey={record => record.recId}
                  pagination={false}
                  style={{ marginTop: '20px' }}
                />
                <Row style={{ margin: '10px 0 20px 0' }}>
                  <Col span={12} >
                    <Input
                      placeholder="可备注特殊需求，方便财务审核相关业务事项"
                      onChange={this.handleChangeInputValue.bind(this, 'remark')}
                      value={remark}
                    />
                  </Col>
                  <Col span={2} style={{ marginLeft: '10px' }}>
                    <Button type="primary" onClick={this.saveSaleRemark.bind(this, receiveRecord.checkBillId)} >保存</Button>
                  </Col>
                </Row>
              </Modal>
              <Modal
                width="550px"
                visible={showReceiveFormModal}
                onOk={this.handleReceiveFormModalOk.bind(this)}
                confirmLoading={confirmLoading}
                onCancel={this.handleReceiveFormModalCancel.bind(this)}
              >
                <div style={{ background: '#fffff5', padding: '10px', marginTop: '25px' }}>
                  <Row style={{ margin: '10px 0' }}>
                    <Col span={10} style={{ fontSize: '20px', fontWeight: 'bold' }} >
                    添加付款记录
                    </Col>
                  </Row>
                  <Row >
                    <Col span={10} style={{ fontSize: '16px', fontWeight: 'bold' }} >
                    应结算总金额:<span className={styles.receiveRecord}>{paymentDetailData.shouldReceiveAmount}</span>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={10} style={{ fontSize: '16px', fontWeight: 'bold' }}>
                    待结算总金额:<span className={styles.receiveRecord}>{paymentDetailData.awaitReceiveAmount}</span>
                    </Col>
                  </Row>
                  <Row style={{ margin: '10px 0' }}>
                    <Col span={6} style={{ height: '32px', lineHeight: '32px', fontSize: '16px', fontWeight: 'bold' }}>
                    实际应收款:
                    </Col>
                    <Col span={7} >
                      <Input
                        value={commitReceiveRecord.shouldReceiveAmount}
                        className={styles.receivedAmount}
                        onChange={this.handleChangeInputValue.bind(this, 'shouldReceiveAmount')}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                    实际收款总额须与收款截图金额保持一致
                    </Col>
                  </Row>
                </div>
                <Form layout="vertical">
                  <FormItem
                    {...formItemLayout}
                    label={<span className={styles.require} >付款人</span>}
                  >
                    <Input onChange={this.handleChangeInputValue.bind(this, 'payer')} value={commitReceiveRecord.payer} />
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label={<span className={styles.require} >收款账户</span>}
                  >
                    <Select
                      placeholder="请选择收款账户"
                      onChange={this.handleChangeInputValue.bind(this, 'financialAccountId')}
                      value={commitReceiveRecord.financialAccountId}
                    >
                      {statusData.collectAccountMap ? (
                          statusData.collectAccountMap.map(
                            item => (
                              <Option
                                key={item.id}
                                value={item.id}
                              >
                                {item.accountInfo}
                              </Option>
                              )
                          )) : ''
                        }
                    </Select>
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label={<span className={styles.require} >付款日期</span>}
                  >
                    <DatePicker
                      onChange={this.handleChangeInputValue.bind(this, 'payDate')}
                      format="YYYY-MM-DD"
                      placeholder="请选择付款日期"
                      value={commitReceiveRecord.payDate ? moment(commitReceiveRecord.payDate, 'YYYY-MM-DD') : null}
                    />
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label={<span className={styles.require} >上传收款截图</span>}
                  >
                    <Upload
                      name="file"
                      listType="picture-card"
                      action={uploadImageUrl}
                      showUploadList={false}
                      beforeUpload={this.beforeUpload}
                      onChange={this.handleChangeUpload.bind(this)}
                      onRemove={this.handleRemoveUpload.bind(this)}
                      headers={{
                        authorization: `Basic ${window.btoa(`${localStorage.getItem('token')}:`)}`,
                      }}
                    >
                      {commitReceiveRecord.imageUrl ? <img src={commitReceiveRecord.imageUrl} alt="收款截图" style={{ width: '102px', height: '102px' }} /> : uploadButton}
                    </Upload>
                  </FormItem>
                </Form>
              </Modal>
              <CarouselModal />
            </TabPane>
            <TabPane tab="已销账记录" key="3">
              <Row style={{ margin: '10px 0 20px 0' }}>
                <Col span={4} >
                客户姓名:<span className={styles.customerInfo}>{customerInfo ? customerInfo.customerName : '' }</span>
                </Col>
                <Col span={4} >
                门店名称:<span className={styles.customerInfo}>{customerInfo ? customerInfo.companyName : '' }</span>
                </Col>
                <Col span={4} >
                所属业务员:<span className={styles.customerInfo}>{customerInfo ? customerInfo.seller : '' }</span>
                </Col>
              </Row>
              <Card
                title={<div>已销账<Icon type="down" /></div>}
                style={{ marginTop: '20px' }}
              >
                <Table
                  expandedRowRender={billExpandTable}
                  bordered
                  dataSource={creditCompleteData.checkBillList}
                  columns={creditCompleteColumn}
                  pagination={false}
                  loading={isLoading}
                  rowKey={record => record.checkBillId}
                />
              </Card>
              <CarouselModal />
            </TabPane>
          </Tabs>
        </Card>
      </PageHeaderLayout>
    );
  }
}
