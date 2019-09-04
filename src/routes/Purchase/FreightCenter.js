import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Card, Table, Input, DatePicker, Select, Row, Col, Button, Icon, Tooltip, Modal, message, Form, AutoComplete, Radio } from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './FreightCenter.less';
import globalStyles from '../../assets/style/global.less';
import TextArea from 'antd/lib/input/TextArea';
import ManualUpload from '../../components/ManualUpload';
import ClearIcon from '../../components/ClearIcon';
import differenceBy from 'lodash/differenceBy';
import uniqBy from 'lodash/uniqBy';
import Debounce from 'lodash-decorators/debounce';
const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
@connect(state => ({
  freightCenter: state.freightCenter,
  manualUpload: state.manualUpload,
}))
@Form.create({
  onValuesChange(props, changedValues, allValues) {
    const { dispatch } = props;
    dispatch({
      type: 'freightCenter/updatePageReducer',
      payload: {
        ...allValues,
      }
    })
  }
})
export default class FreightCenter extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'freightCenter/getList'
    })
    dispatch({
      type: 'freightCenter/getConfig'
    })

  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'freightCenter/unmountReducer',
    })
  }
  handleShowModals = (type) => {
    const { dispatch } = this.props;
    this.props.form.resetFields();
    dispatch({
      type: 'freightCenter/updatePageReducer',
      payload: {
        [type]: true,
      }
    })
    dispatch({
      type: 'manualUpload/updatePageReducer',
      payload: {
        fileList: [],
        files: []
      }
    })
  }
  handleCloseModal = (type) => {
    const { dispatch } = this.props;
    dispatch({
      type: "freightCenter/updatePageReducer",
      payload: {
        [type]: false,
      }
    })
  }
  handleChangeSiftItem = (type, e) => {
    const { dispatch } = this.props;
    dispatch({
      type: "freightCenter/updatePageReducer",
      payload: {
        [type]: e.target.value,
      }
    })
  }
  handleSearchSiftItem = (type, e) => {
    const { dispatch } = this.props;
    dispatch({
      type: "freightCenter/getList",
      payload: {
        [type]: e,
        currentPage: 1,
      }
    })
  }
  handleChangeDate = (date, dateString) => {
    const { dispatch } = this.props;
    dispatch({
      type: "freightCenter/getList",
      payload: {
        createTimeStart: dateString[0],
        createTimeEnd: dateString[1],
        currentPage: 1,
      }
    })
  }
  handleShowUploadModal = (currentRow) => {
    const { dispatch, freightCenter } = this.props;
    const { shippingList } = freightCenter;
    currentRow.shippingOrderFee.shippingList.map(item => {
      shippingList.push({ id: item.id, amount: item.amount })
    })
    let isEdit = false;
    if (currentRow.shippingOrderFee.id) {
      isEdit = true;
    }
    const unPaidShippingList = differenceBy(currentRow.shippingOrderFee.shippingList.length > 0 && currentRow.shippingOrderFee.shippingList, [{ isPaid: 1 }], 'isPaid')
    const totalLogisticFee = unPaidShippingList.reduce((prev, next) => {
      return prev + (+next.amount)
    }, 0)
    dispatch({
      type: "freightCenter/updatePageReducer",
      payload: {
        currentRow,
        shippingList,
        showCreateModal: true,
        purchaseOrderId: currentRow.id,
        isEdit,
        totalLogisticFee,
      }
    })
    dispatch({
      type: "manualUpload/updatePageReducer",
      payload: {
        fileList: [],
        files: []
      }
    })
  }
  handleChangeAmount = (shippingInfoRecord, e) => {
    const { dispatch, freightCenter } = this.props;
    const { currentRow } = freightCenter;
    currentRow.shippingOrderFee.shippingList.map(item => {
      if (+item.id === +shippingInfoRecord.id) {
        item.amount = e.target.value;
      }
    })
    const unPaidShippingList = differenceBy(currentRow.shippingOrderFee.shippingList.length > 0 && currentRow.shippingOrderFee.shippingList, [{ isPaid: 1 }], 'isPaid')
    const totalLogisticFee = unPaidShippingList.reduce((prev, next) => {
      return prev + (+next.amount)
    }, 0)
    dispatch({
      type: "freightCenter/updatePageReducer",
      payload: {
        amount: e.target.value,
        shippingInfoRecord,
        currentRow,
        totalLogisticFee,
      }
    })
  }
  handleConfirmChange = (shippingInfoRecord) => {
    const { dispatch, freightCenter } = this.props;
    const { currentRow, newShippingList } = freightCenter;
    currentRow.shippingOrderFee.shippingList.map(item => {
      if (+item.id === +shippingInfoRecord.id) {
        shippingInfoRecord.amount = item.amount;
      }
    })
    newShippingList.push({ id: shippingInfoRecord.id, amount: shippingInfoRecord.amount });
    const infos = (({ shippingNo, amount }) => ({ shippingNo, amount }))(shippingInfoRecord)
    dispatch({
      type: "freightCenter/changeAmount",
      payload: {
        infos,
        shippingInfoRecord,
        newShippingList,
      }
    })
  }
  handleChangeRemark = (e) => {
    const { dispatch, freightCenter } = this.props;
    const { currentRow } = freightCenter;
    currentRow.shippingOrderFee.remark = e.target.value;
    dispatch({
      type: "freightCenter/updatePageReducer",
      payload: {
        currentRow,
        remark: e.target.value,
      }
    })
  }
  handleChangeSelectRows = (selectedRowKeys, selectRows) => {
    const { dispatch } = this.props;
    let totalSelectshippingList = [];
    selectRows.map(item => {
      totalSelectshippingList.push(...item.shippingOrderFee.shippingList)
    })
    const uniqShippingList = uniqBy(totalSelectshippingList, 'shippingNo');
    let totalAmount = uniqShippingList.reduce((pre, next) => {
      return pre + (+next.amount)
    }, 0)
    let finalBankInfos = [];
    selectRows[0] && selectRows[0].bankInfo.map(item => {
      finalBankInfos.push({ type: item.type, bankInfoDetail: [] });
    })
    let hash = {};
    finalBankInfos = finalBankInfos.reduce((preVal, curVal) => {
      hash[curVal.type] ? '' : hash[curVal.type] = true && preVal.push(curVal);
      return preVal
    }, [])
    selectRows[0] && selectRows[0].bankInfo.map(item => {
      finalBankInfos.map(info => {
        if (+item.type === +info.type) {
          info.bankInfoDetail.push(item)
        }
      })
    })
    dispatch({
      type: 'freightCenter/updatePageReducer',
      payload: {
        selectedRowKeys,
        selectRows,
        totalAmount,
        finalBankInfos,
      }
    })
  }
  handleApplyFreight = () => {
    const { dispatch, freightCenter } = this.props;
    const { selectRows } = freightCenter;
    const firstRow = [selectRows[0]];
    const diff = differenceBy(selectRows, firstRow, 'supplierInfoId');
    const isAllSign = selectRows.every(item => item.isShippingSign);
    if (diff.length > 0) {
      message.error("不同供应商不允许合并申请运费");
      return;
    } else if (!isAllSign) {
      dispatch({
        type: 'freightCenter/updatePageReducer',
        payload: {
          showConfirmModal: true,
        }
      })
    } else {
      dispatch({
        type: 'freightCenter/updatePageReducer',
        payload: {
          showApplyModal: true,
          bankInfoId: '',
          bankType: '',
          remark: '',
          payType: '',
        }
      })
    }
  }
  handleConfirmApply = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'freightCenter/confirmApply',
      payload: {
        submitLoading: true,
      }
    })
  }
  handleChangeItem = (type, e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'freightCenter/updatePageReducer',
      payload: {
        [type]: e.target.value
      }
    })
  }
  handleSubmit = () => {
    const { dispatch, manualUpload } = this.props;
    const { fileList } = manualUpload;
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('files[]', file);
    });
    this.props.form.validateFields((err, values) => {
      if (!err) {
        Object.keys(values).map(item => {
          formData.append(item, values[item]);
        })
        dispatch({
          type: 'freightCenter/addNewRecord',
          payload: {
            formData,
            values,
            buttonLoading: true,
          }
        })
      }
    });
    // this.props.form.resetFields();
  }
  handleConfirmUpload = () => {
    const { dispatch, manualUpload, freightCenter } = this.props;
    const { fileList } = manualUpload;
    const { purchaseOrderId, shippingList, remark, newShippingList, isEdit, currentRow, totalLogisticFee } = freightCenter;
    shippingList.map(item => {
      newShippingList.map(newItem => {
        if (item.id == newItem.id) {
          item.amount = newItem.amount;
        }
      })
    })
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('files[]', file);
    });
    shippingList.forEach((item, index) => {
      for (let key in item) {
        formData.append(`shippingList[${index}][${key}]`, shippingList[index][key])
      }
    })
    formData.append('purchaseOrderId', purchaseOrderId)
    formData.append('remark', remark);
    formData.append('totalAmount', totalLogisticFee);
    if (isEdit) {
      formData.append('id', currentRow.shippingOrderFee.id)
    }
    dispatch({
      type: 'freightCenter/confrimUpload',
      payload: {
        formData,
        showCreateModal: false,
      }
    })
    dispatch({
      type: 'manualUpload/updatePageReducer',
      payload: {
        fileList: [],
        files: []
      }
    })
  }
  handlePreviewAttachment = (previewUrl) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'freightCenter/updatePageReducer',
      payload: {
        previewModal: true,
        previewUrl,
      }
    })
  }
  handleClear = (type) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'freightCenter/getList',
      payload: {
        [type]: "",
        currentPage: 1,
      }
    })
  }
  handleClearSelectedRows = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'freightCenter/updatePageReducer',
      payload: {
        selectedRowKeys: []
      }
    })
  }
  handleChangeBankInfoType = (e) => {
    const { dispatch, freightCenter } = this.props;
    const { finalBankInfos } = freightCenter;
    let bankInfoDetail = [];
    finalBankInfos.map(item => {
      if (+item.type === +e) {
        bankInfoDetail = item.bankInfoDetail;
      }
    })
    dispatch({
      type: 'freightCenter/updatePageReducer',
      payload: {
        bankType: e,
        bankInfoId: bankInfoDetail[0] && bankInfoDetail[0].id,
        bankInfoDetail,
      },
    });
  }
  handleChangeBankDetail = (e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'freightCenter/updatePageReducer',
      payload: {
        bankInfoId: e
      }
    })
  }
  handleChangeCurPage = (currentPage) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'freightCenter/getList',
      payload: {
        currentPage
      }
    })
  }
  handleChangePageSize = (curPage, pageSize) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'freightCenter/getList',
      payload: {
        pageSize
      }
    })
  }
  handleSelectSupplier(supplierId, option) {
    const { dispatch } = this.props;
    const { children } = option.props;
    dispatch({
      type: 'freightCenter/getList',
      payload: {
        curPage: 1,
        supplierId,
        supplierSearchText: children,
      },
    });
  }
  // 搜索供应商
  @Debounce(200)
  handleChangeSupplier(text) {
    const { dispatch } = this.props;
    dispatch({
      type: 'freightCenter/changeSupplier',
      payload: {
        supplierSearchText: text,
      },
    });
  }
  handleShowDeleteModal = (deleteId) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'freightCenter/updatePageReducer',
      payload: {
        deleteId,
        showDeleteModal: true,
      },
    });

  }
  handleConfirmDelete = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'freightCenter/deleteInfo',
      payload: {
        showDeleteModal: false,
      }
    });
  }
  handleChangeFollowRemark = (index, editId, e) => {
    const { dispatch, freightCenter } = this.props;
    const { purchaseOrderList } = freightCenter;
    purchaseOrderList[index].followRemark = e.target.value;
    dispatch({
      type: 'freightCenter/updatePageReducer',
      payload: {
        purchaseOrderList,
        editId,
        followRemark: e.target.value,
      }
    });
  }
  handleSaveFolloeRemark = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'freightCenter/saveRemark',
    });
  }
  handleShowApplyModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'freightCenter/updatePageReducer',
      payload: {
        showApplyModal: true,
        showConfirmModal: false,
      }
    })
  }
  handleDeleteImg=(deleteImgId)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'freightCenter/deleteImg',
      payload: {
        deleteImgId
      }
    })

  }
  render() {
    const {
      form,
      freightCenter: {
        isLoading,
        showCreateModal,
        showApplyModal,
        showConfirmModal,
        currentPage,
        purchaseOrderList,
        total,
        currentRow,
        selectedRowKeys,
        showAddNewRecord,
        totalAmount,
        buttonLoading,
        amount,
        values,
        shippingFeeStatusMap,
        purchaserMap,
        previewModal,
        previewUrl,
        orderId,
        finalBankInfos,
        bankType,
        bankInfoId,
        bankInfoDetail,
        supplierSuggest,
        submitLoading,
        payType,
        remark,
        pageSize,
        assignAmount,
        totalLogisticFee,
        showDeleteModal,
        actionList,
        selectType
      },
    } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    const columns = [
      {
        title: '状态',
        key: 'status',
        dataIndex: 'status',
        render: (status) => {
          return <span>{shippingFeeStatusMap[status]}</span>
        }
      },
      {
        title: '采购单号',
        key: 'purchaseOrderId',
        dataIndex: 'purchaseOrderId',
        render: (purchaseOrderId, record) => {
          return <div>
            <Link to={+record.isSale ? `/purchase/purchase-order-management/sale-purchase/sale-purchase-order-list/sale-purchase-order-detail/${purchaseOrderId}` : `/purchase/purchase-order-management/common-purchase-list/common-purchase-detail/${purchaseOrderId}`}>{purchaseOrderId}</Link>
            {
              record.isReject ? <Tooltip title={record.rejectRemark}>
                <div>
                  <span className={globalStyles.tag} style={{ background: 'red' }}>驳回</span>
                </div>
              </Tooltip> : ""
            }
          </div>
        }
      },
      {
        title: '供应商',
        key: 'supplierName',
        dataIndex: 'supplierName',
        width: 200,
      },
      {
        title: '采购数量',
        key: 'purchaseGoodsNum',
        dataIndex: 'purchaseGoodsNum',
      },
      {
        title: '已入库数量',
        key: 'storeNum',
        dataIndex: 'storeNum',
      },
      {
        title: '待入库数量',
        key: 'waitStoreNum',
        dataIndex: 'waitStoreNum',
      },
      {
        title: '运费总额',
        key: 'amount',
        dataIndex: 'amount',
        width: 100,
        render: (amount, record) => {
          return <div>
            <span>{amount}</span>
            <div>
              {
                record.tag.map(item => (
                  item.name == "运费待归属" && <Tooltip key={item} title={<div>
                    <p>存在同一物流单号对应多个采购单，实际运费以入库后进行归属均摊；</p>
                    <p>消失条件：1：如果已全部入库，则此处运费总额为归属运费总额，则不需要打标签</p>
                    <p>2.如果未全部入库，则运费总额为基础运费累积总额，需要打标签</p>
                  </div>}>
                    <span style={{ backgroundColor: item.color }} className={globalStyles.tag} >{item.name}</span>
                  </Tooltip>
                ))
              }
            </div>
          </div>
        }
      },
      {
        title: <div>均摊运费 <Tooltip title={<div>
          <p>均摊运费=归属运费总额除以已入库数量</p>
          <p>均摊运费总额以实际入库后（仓库回传数据）的数据进行均摊</p>
        </div>}><Icon type="question-circle" /></Tooltip></div>,
        key: 'averageFee',
        dataIndex: 'averageFee',
      },
      {
        title: '采购员',
        key: 'purchaser',
        dataIndex: 'purchaser',
        render: (purchaser) => {
          return <span>{purchaserMap[purchaser]}</span>
        }
      },
      {
        title: '下单时间',
        key: 'createTime',
        dataIndex: 'createTime',
        width: 100
      },
      {
        title: '跟进备注',
        key: 'followRemark',
        dataIndex: 'followRemark',
        render: (followRemark, record, index) => {
          return <Input
            onChange={this.handleChangeFollowRemark.bind(this, index, record.id)}
            onBlur={this.handleSaveFolloeRemark}
            value={followRemark}
          />
        }
      },
      {
        title: '操作',
        key: '',
        dataIndex: '',
        width: 170,
        render: (_, record) => {
          return <div>
            <Button type="primary" size="small" onClick={this.handleShowUploadModal.bind(this, record)}>{record.shippingOrderFee.id ? "编辑运费信息" : "上传运费信息"}</Button>
            {
              record.shippingOrderFee.id && <span style={{ fontSize: 18, display: 'inline-block', marginLeft: 10 }} onClick={this.handleShowDeleteModal.bind(this, record.shippingOrderFee.id)}><Icon type="delete" /></span>
            }
          </div>
        }
      },
    ]
    return (
      <PageHeaderLayout title="运费中心">
        <Card bordered={false}>
          {
            selectedRowKeys.length > 0 ? <Card style={{ marginBottom: 10 }}>
              <Row className={styles.select}>
                <span>
                  <Icon
                    type="close"
                    onClick={this.handleClearSelectedRows}
                    style={{
                      fontSize: 16,
                      color: '#C9C9C9',
                      marginRight: '10px',
                    }}
                  />已选择 {selectedRowKeys.length} 项
                  </span>
                <span>应付总运费：<span style={{ color: "red" }}>{totalAmount}</span></span>
                <Button type="primary" onClick={this.handleApplyFreight}>申请运费</Button>
              </Row>
            </Card> :
              <Row>
                <Col span={18}>
                  <Select
                    placeholder="请选择状态"
                    className={globalStyles['select-sift']}
                    onChange={this.handleSearchSiftItem.bind(this, 'status')}
                    allowClear
                    dropdownMatchSelectWidth={false}
                  >
                    <Option value={""}>全部</Option>
                    {
                      Object.keys(shippingFeeStatusMap).map((statusId) => {
                        return (
                          <Option value={statusId}>{shippingFeeStatusMap[statusId]}</Option>
                        );
                      })
                    }
                  </Select>
                  <Search
                    className={globalStyles['input-sift']}
                    placeholder="采购单号"
                    onChange={this.handleChangeSiftItem.bind(this, 'orderId')}
                    value={orderId}
                    onSearch={this.handleSearchSiftItem.bind(this, 'orderId')}
                    suffix={orderId ? <ClearIcon
                      handleClear={this.handleClear.bind(this, "orderId")}
                    /> : ""}
                  />
                  <AutoComplete
                    dataSource={supplierSuggest && supplierSuggest.map((suggest) => {
                      return (
                        <Select.Option value={suggest.id.toString()}>{suggest.name}</Select.Option>
                      );
                    })}
                    onSelect={this.handleSelectSupplier.bind(this)}
                    onSearch={this.handleChangeSupplier.bind(this)}
                    className={globalStyles['input-sift']}
                    allowClear
                    placeholder="请输入供应商"
                    dropdownMatchSelectWidth={false}
                  >
                    {/* <Search
                          
                          value={supplierSearchText}
                      /> */}
                  </AutoComplete>
                  <Select
                    className={globalStyles['select-sift']}
                    placeholder="请选择采购员"
                    onChange={this.handleSearchSiftItem.bind(this, 'purchaser')}
                    allowClear
                    dropdownMatchSelectWidth={false}
                  >
                    <Option value={""}>全部</Option>
                    {
                      Object.keys(purchaserMap).map((purchaser) => {
                        return (
                          <Option value={purchaser}>{purchaserMap[purchaser]}</Option>
                        );
                      })
                    }
                  </Select>
                  下单时间：
                  <RangePicker
                    //   value={[startDate ? moment(startDate, 'YYYY-MM-DD') : '', endDate ? moment(endDate, 'YYYY-MM-DD') : '']}
                    format="YYYY-MM-DD"
                    onChange={this.handleChangeDate}
                    className={globalStyles['rangePicker-sift']}
                  />
                </Col>
                <Col span={6}>
                  <Button type="primary" style={{ marginRight: 10 }} onClick={this.handleShowModals.bind(this, 'showAddNewRecord')}>新建运费信息</Button>
                  <Tooltip title="新建运费信息功能为异常情况下可使用，例如：若一个采购单因为异常需要增加新的物流单号及物流费用，则通过此入口进行处理，且补单的物流费用不进行均摊，请知悉。">
                    <Icon type="question-circle" />
                  </Tooltip>
                  {
                    actionList && actionList.map(item => {
                      return <Button href={item.url} target="_blank">{item.name}</Button>
                    })
                  }
                </Col>
              </Row>
          }
          <Table
            bordered
            dataSource={purchaseOrderList}
            columns={columns}
            loading={isLoading}
            rowKey={record => record.id}
            className={globalStyles.tablestyle}
            pagination={{
              total,
              current: currentPage,
              showTotal: total => `共 ${total} 个结果`,
              pageSizeOptions: ['20', '50', , '80', '100', '120', '200'],
              pageSize,
              showSizeChanger: true,
              onChange: this.handleChangeCurPage,
              onShowSizeChange: this.handleChangePageSize,
            }}
            rowSelection={{
              selectedRowKeys,
              onChange: this.handleChangeSelectRows.bind(this),
            }}
          />
          <Modal
            visible={showCreateModal}
            className={styles.modalStyle}
            width={1200}
            onCancel={this.handleCloseModal.bind(this, 'showCreateModal')}
            onOk={this.handleConfirmUpload}
          >
            <Row>
              <h2 style={{ display: 'inline-block', marginRight: 30 }}>上传运费信息</h2>
              <span>(温馨提示：此处物流数据由采购单跟单表处流转过来，请先在采购跟单表处跟进物流信息。)</span>
            </Row>
            <Row className={styles.topLine}>
              <span>采购单号：{currentRow.id}</span>
              <span>供应商：{currentRow.supplierName}</span>
              <span>采购员：{currentRow.purchaser}</span>
            </Row>
            <Row>
              {
                Object.keys(currentRow).length > 0 && currentRow.shippingOrderFee.shippingList && currentRow.shippingOrderFee.shippingList.map(item => {
                  return (
                    +item.isPaid ? <div className={styles.paid}>
                      <Row className={styles.line} key={item.id}>
                        <Col span={6}><span>物流单号：<span>{item.shippingNo}</span></span></Col>
                        <Col span={6}><span>物流公司：<span>{item.shippingCompany}</span></span></Col>
                        <Col span={6}><span>基础运费：<span>{item.amount}</span></span></Col>
                        <Col span={6}>
                          <span>归属运费：
                            <Tooltip title="归属运费：一个物流单号对应多个采购单时，系统根据入库数量自动平摊计算本单归属运费；一个物流单号对应一个采购单时，归属运费即为他本身。">
                              <Icon type="question-circle" />
                            </Tooltip>
                            <span style={{ marginLeft: 4 }}>{item.amount}</span></span>
                        </Col>
                      </Row>
                    </div> : <Row className={styles.line} key={item.id}>
                        <Col span={6}>
                          <span style={{ marginRight: 6 }}>物流单号：<span>{item.shippingNo}</span></span>
                          {
                            item.relatePurchaseOrderIdList.length > 0 && <Tooltip title={item.relatePurchaseOrderIdList.map(item => (
                              <span>{`${item}/`}</span>
                            ))}><span style={{ color: "#1890ff" }}>关联采购单号</span></Tooltip>
                          }
                        </Col>
                        <Col span={6}><span>物流公司：<span>{item.shippingCompany}</span></span></Col>
                        <Col span={6}><span>基础运费：</span>
                          <Input style={{ width: 100 }}
                            onChange={this.handleChangeAmount.bind(this, item)}
                            onBlur={this.handleConfirmChange.bind(this, item)}
                            value={item.amount}
                            disabled={!item.canEdit}
                          />
                        </Col>
                        <Col span={6}>
                          <span>归属运费：
                        <Tooltip title="归属运费：一个物流单号对应多个采购单时，系统根据入库数量自动平摊计算本单归属运费；一个物流单号对应一个采购单时，归属运费即为他本身。">
                              <Icon type="question-circle" />
                            </Tooltip>
                            <span style={{ marginLeft: 4 }}>{assignAmount}</span></span>
                        </Col>
                      </Row>
                  )
                })
              }
            </Row>
            <span style={{ color: '#1890ff' }}>运费凭证</span>
            <Row className={styles.attachment}>
              {
                Object.keys(currentRow).length > 0 && currentRow.shippingOrderFee.shippingImgList && currentRow.shippingOrderFee.shippingImgList.map(item => {
                  return <div className={styles.imgBox}>
                    <img src={item.imgUrl} />
                    <div className={styles.cover}>
                      <Icon type="eye" style={{ fontSize: 18, color: "#fff" }} onClick={this.handlePreviewAttachment.bind(this, item.imgUrl)} />
                      <Icon type="delete" style={{ fontSize: 18, color: "#fff" }} onClick={this.handleDeleteImg.bind(this, item.id)} />
                    </div>
                  </div>
                })
              }
            </Row>
            <Row>
              <ManualUpload
                multiple={true}
              />
            </Row>
            <Row>
              运费总额：<span style={{ color: "red", fontWeight: 'blod', fontSize: 18 }}>{totalLogisticFee}</span>
            </Row>
            备注：
            <TextArea rows={4} onChange={this.handleChangeRemark} value={Object.keys(currentRow).length > 0 && currentRow.shippingOrderFee.remark} />
          </Modal>
          <Modal
            visible={showApplyModal}
            onCancel={this.handleCloseModal.bind(this, 'showApplyModal')}
            onOk={this.handleConfirmApply}
            className={styles.modalStyle}
            confirmLoading={submitLoading}
            width={800}
            okText="提交主管审核"
            maskClosable={false}
          >
            <Row type="flex" align="middle">
              <Col span={4}>
                应付运费总额:
                  <Tooltip title="系统已自动去重相同物流单号所对应的应收运费。"><Icon type="question-circle" /></Tooltip>
              </Col>
              <Col><span style={{ fontSize: 18, fontWeight: 'bold', color: 'red' }}>{totalAmount}</span></Col>
            </Row>
            <Row type="flex" align="middle">
              <Col span={3}>支付类型:</Col>
              <Select
                value={payType}
                placeholder="请选择支付方式"
                className={globalStyles['select-sift']}
                onChange={this.handleSearchSiftItem.bind(this, 'payType')}
              >
                <Select.Option value={1}>现款现付</Select.Option>
              </Select>
            </Row>
            <Row type="flex" align="middle">
              <Col span={3}>付款信息：</Col>
              <Radio.Group onChange={this.handleChangeItem.bind(this,'selectType')} value={selectType}>
                <Radio value={1}>付给供应商</Radio>
                <Radio value={2}>其他</Radio>
              </Radio.Group>
            </Row>
            <Row style={{marginLeft:60}}>
              <Col>
                {
                  selectType==1&&<Row>
                    <Select
                      placeholder="请选择账户类型"
                      value={bankType}
                      // value={finalBankInfos[0]&&finalBankInfos[0].type||bankType}
                      onChange={this.handleChangeBankInfoType.bind(this)}
                      style={{ width: 150, marginRight: 10 }}
                    >
                      {
                        finalBankInfos.map(item => {
                          return <Select.Option
                            key={item.type}
                            value={item.type}
                          >
                            {+item.type === 1 ? "对公账户" : "对私账户"}
                          </Select.Option>
                        })
                      }
                    </Select>
                    <Select
                      placeholder="请选择供应商财务备注"
                      value={bankInfoId}
                      onChange={this.handleChangeBankDetail.bind(this)}
                      style={{ width: 400 }}
                    >
                      {
                        bankInfoDetail.map(info => {
                          return <Select.Option
                            key={info.id}
                            value={info.id}
                          >
                            {`开户名称:${info.bankName} 开户行:${info.bankInfo} 银行账户:${info.bankAccount}`}
                          </Select.Option>
                        })
                      }
                    </Select>
                  </Row>
                }
                {
                  selectType==2&&<Input style={{ width: 400 }} 
                  placeholder="请填写收款人、收款方式和收款账号"
                  onChange={this.handleChangeItem.bind(this,'payInfo')}/>
                }
                
              </Col>
            </Row>
            <Row>
              申请运费备注
              </Row>
            <Row>
              <TextArea
                rows={4}
                onChange={this.handleChangeItem.bind(this, 'remark')}
                value={remark}
              >
              </TextArea>
            </Row>
          </Modal>
          <Modal
            title="申请运费"
            onCancel={this.handleCloseModal.bind(this, 'showConfirmModal')}
            visible={showConfirmModal}
            onOk={this.handleShowApplyModal}

          >
            <p>当前的采购单物流跟进未全部签收，请确定是否提交申请运费。</p>
          </Modal>
        </Card>
        <Modal
          visible={showAddNewRecord}
          width={1000}
          onCancel={this.handleCloseModal.bind(this, 'showAddNewRecord')}
          onOk={this.handleSubmit}
          confirmLoading={buttonLoading}
          maskClosable={false}
        >
          <Row>
            <h2 style={{ display: 'inline-block', marginRight: 30 }}>新建运费信息</h2>
            <span>(温馨提示：此处物流数据由采购单跟单表处流转过来，请先在采购跟单表处跟进物流信息。)</span>
          </Row>
          <Form onSubmit={this.handleSubmit}>
            <Row>
              <Form.Item {...formItemLayout}>
                {
                  getFieldDecorator('purchaseOrderId', {
                    // initialValue: values.purchaseOrderId,
                    rules: [
                      {
                        required: true, message: '请输入关联采购单号',
                      }
                    ]
                  })(
                    <Input
                      style={{ width: 200 }}
                      placeholder="请输入关联采购单号"
                    />
                  )
                }
              </Form.Item>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item {...formItemLayout} label="物流单号">
                  {
                    getFieldDecorator('shippingNo', {
                      // initialValue: values.shippingNo,
                      rules: [
                        {
                          required: true, message: '请输入物流单号',
                        }
                      ]
                    })(
                      <Input
                        style={{ width: 200 }}
                        placeholder="请输入物流单号"
                      />
                    )
                  }
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item {...formItemLayout} label="物流公司">
                  {
                    getFieldDecorator('shippingCompany', {
                      // initialValue: values.shippingCompany,
                      rules: [
                        {
                          required: true, message: '请输入物流公司',
                        }
                      ]
                    })(
                      <Input
                        style={{ width: 200 }}
                        placeholder="请输入物流公司"
                      />
                    )
                  }
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item {...formItemLayout} label="基础运费">
                  {
                    getFieldDecorator('amount', {
                      rules: [
                        {
                          required: true, message: '请输入基础运费',
                        }
                      ]
                    })(
                      <Input
                        style={{ width: 200 }}
                        placeholder="请输入基础运费"
                      />
                    )
                  }
                </Form.Item>
              </Col>
            </Row>
            <Row style={{ marginBottom: 10 }}>
              <span style={{ color: '#1890ff' }}>运费凭证</span>
            </Row>
            <Row style={{ margin: '10px 0' }}>
              <ManualUpload
                multiple={true}
              />
            </Row>
            <Row style={{ margin: '10px 0' }}>
              <Col span={8}><span>运费总额：<span style={{ color: "red", fontWeight: 'bold' }}>{amount}</span></span></Col>
            </Row>
            <Row style={{ margin: '10px 0' }}>备注：</Row>
            <Row>
              <Col span={16}>
                <Form.Item {...formItemLayout}>
                  {
                    getFieldDecorator('remark', {
                      initialValue: values.remark,
                      rules: [
                        {
                          required: true, message: '请输入备注',
                        }
                      ]
                    })(
                      <TextArea rows={4} />
                    )
                  }
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
        <Modal
          visible={previewModal}
          footer={null}
          onCancel={this.handleCloseModal.bind(this, 'previewModal')}
        >
          <img style={{ width: '100%' }} src={previewUrl} />
        </Modal>
        <Modal
          visible={showDeleteModal}
          onOk={this.handleConfirmDelete}
          onCancel={this.handleCloseModal.bind(this, 'showDeleteModal')}
          title="确认"
        >
          请确认是否删除？

        </Modal>
      </PageHeaderLayout>
    );
  }
}
