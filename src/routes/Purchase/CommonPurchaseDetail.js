import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Icon, Row, Col, Card, Input, Button, Modal, Tabs, Table, Collapse, Select, Tooltip, Alert, Form } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './CommonPurchaseDetail.less';
import globalStyles from '../../assets/style/global.less';
import img from '../../assets/u2741.png';
import TextArea from 'antd/lib/input/TextArea';
const { Option } = Select;

@connect(state => ({
  commonPurchaseDetail: state.commonPurchaseDetail,
}))
@Form.create()
export default class CommonPurchaseDetail extends PureComponent {

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseDetail/getConfig',
      payload: {
        orderId: this.props.match.params.id,
      },
    });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseDetail/unmount',
    });
  }

  // 点击生成入库单按钮
  handleClickGenButton() {
    const { dispatch } = this.props;
    this.props.form.resetFields()
    dispatch({
      type: 'commonPurchaseDetail/clickGenButton',
    });
  }
  handleClickCancelGenButton() {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseDetail/clickCancelGenButton',
    });
  }
  handleClickOkGenButton = (e) => {
    const { dispatch } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        dispatch({
          type: 'commonPurchaseDetail/clickOkGenButton',
          payload: {
            ...values,
            waitInStoreOrder: this.props.commonPurchaseDetail.waitInStoreOrder,
            orderId: this.props.match.params.id,
            genInfo: this.props.commonPurchaseDetail.genInfo,
            consignee: this.props.commonPurchaseDetail.consignee,
            mobile: this.props.commonPurchaseDetail.mobile,
            province: this.props.commonPurchaseDetail.province,
            city: this.props.commonPurchaseDetail.city,
            district: this.props.commonPurchaseDetail.district,
            address: this.props.commonPurchaseDetail.address,
            unloadFare: this.props.commonPurchaseDetail.unloadFare,
          }
        })
      }
    });
    // dispatch({
    //   type: 'commonPurchaseDetail/clickOkGenButton',
    //   payload: {
    //     
    //     logisticsFare: this.props.commonPurchaseDetail.logisticsFare,
    //     logisticsSn: this.props.commonPurchaseDetail.logisticsSn,
    //     logisticsCompany: this.props.commonPurchaseDetail.logisticsCompany,
    //     
    //   },
    // });
  }
  // 点击推送按钮
  handleClickPushButton(orderId) {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseDetail/clickPushButton',
      payload: {
        orderId,
      },
    });
  }
  handleClickCancelPushButton() {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseDetail/clickCancelPushButton',
    });
  }
  handleClickOkPushButton(orderId) {
    const { dispatch, commonPurchaseDetail } = this.props;
    const { depot,storageType } = commonPurchaseDetail;
    dispatch({
      type: 'commonPurchaseDetail/clickOkPushButton',
      payload: {
        orderId,
        allOrderId: this.props.match.params.id,
        depot,
        storageType
      },
    });
  }
  // 点击作废按钮
  handleClickObsoleteButton(orderId) {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseDetail/clickObsoleteButton',
      payload: {
        orderId,
      },
    });
  }
  handleClickCancelObsoleteButton() {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseDetail/clickCancelObsoleteButton',
    });
  }
  handleClickOkObsoleteButton(orderId) {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseDetail/clickOkObsoleteButton',
      payload: {
        orderId,
        allOrderId: this.props.match.params.id,
      },
    });
  }
  // 点击全部的时候获取全部待入库数
  handleGetAllStoreNum = (id) => {
    const { dispatch, commonPurchaseDetail } = this.props;
    const { waitInStoreOrder } = commonPurchaseDetail;
    waitInStoreOrder.map(item => {
      if (+item.id === +id) {
        item.nowStoreNum = item.waitStoreNum;
      }
      dispatch({
        type: 'commonPurchaseDetail/changeReducer',
        payload: {
          waitInStoreOrder
        }
      })
    })
  }

  // 修改本次入库数
  handleChangeNowStoreNum(id, e) {
    const { dispatch } = this.props;
    const number = e.target.value;
    const reg = new RegExp('^[0-9]*$');
    if (!reg.test(number)) {
      return;
    }
    dispatch({
      type: 'commonPurchaseDetail/changeNowStoreNum',
      payload: {
        id,
        number,
      },
    });
  }
  // 修改日期
  handleChangeDate(date) {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseDetail/changeDate',
      payload: {
        date: date.format('YYYY-MM-DD HH:mm'),
      },
    });
  }
  // 修改单号
  handleChangeStoreNo(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseDetail/changeStoreNo',
      payload: {
        storeNo: e.target.value,
      },
    });
  }
  // 修改经办人
  handleChangeHandler(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseDetail/changeHandler',
      payload: {
        handler: e.target.value,
      },
    });
  }
  // 修改联系人
  handleChangeConsignee(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseDetail/changeConsignee',
      payload: {
        consignee: e.target.value,
      },
    });
  }
  // 修改联系电话
  handleChangeMobile(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseDetail/changeMobile',
      payload: {
        mobile: e.target.value,
      },
    });
  }
  // 修改入库地址
  handleChangeAddress(addressIds) {
    const { dispatch } = this.props;
    if (Array.isArray(addressIds)) {
      dispatch({
        type: 'commonPurchaseDetail/changeAddress',
        payload: {
          province: addressIds[0],
          city: addressIds[1],
          district: addressIds[2],
          address: this.props.commonPurchaseDetail.address,
        },
      });
    } else {
      dispatch({
        type: 'commonPurchaseDetail/changeAddress',
        payload: {
          province: this.props.commonPurchaseDetail.province,
          city: this.props.commonPurchaseDetail.city,
          district: this.props.commonPurchaseDetail.district,
          address: addressIds.target.value,
        },
      });
    }
  }
  handleChange(type, ...rest) {
    const { dispatch } = this.props;
    switch (type) {
      case 'actionRemark':
      case 'unloadFare':
        dispatch({
          type: 'commonPurchaseDetail/change',
          payload: {
            [type]: rest[0].target.value,
          },
        });
        break;

      default:
        break;
    }
  }

  // 操作相关
  handleTriggerActionModal(url, isNeedRemark, backUrl, name) {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseDetail/triggerActionModal',
      payload: {
        actionUrl: url,
        isNeedRemark,
        backUrl,
        actionName: name,
      },
    });
  }

  handleOkActionModal(id) {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseDetail/okActionModal',
      payload: {
        id,
      },
    });
  }

  handleClickOkCancel() {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseDetail/cancelConfirm',
    });
  }

  // 切换是否编辑含税
  handleChangeIsEditTax() {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseDetail/changeIsEditTax',
    });
  }
  // 切换是否含税
  handleChangeTax(id, purchaseIsTax) {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseDetail/changeTax',
      payload: {
        id,
        purchaseIsTax,
      },
    });
  }
  // // 生成入库单时选择物流单号
  // handleSelectShippingNo=(e)=>{
  //   const { dispatch } = this.props;
  //   dispatch({
  //       type: 'commonPurchaseDetail/changeReducer',
  //         payload: {
  //           seletedIndex:e,
  //       }
  //   })

  // }
  // 点击填充的时候把所选的物流单号填充到下面
  handleAddLogisticInfo = (e) => {
    const { dispatch, commonPurchaseDetail } = this.props;
    const { followInfoDetail, followInfo } = commonPurchaseDetail;
    followInfo.map(item => {
      if (item.shippingNo == followInfoDetail[e]) {
        dispatch({
          type: 'commonPurchaseDetail/fillLogisticInfo',
          payload: {
            selectedInfo: item,
          }
        })
      }
    })
  }
  // 点击推送的时候选择推送仓库
  handleSelectDepot = (type,e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseDetail/changeLogisticsSnReducer',
      payload: {
        [type]: e,
      },
    })
  }
  render() {
    const {
      form,
      commonPurchaseDetail: {
        remark,
        financeRemark,
        goods,
        gifts,
        waitInStoreOrder,
        author,
        date,
        orderNo,
        supplier,
        purchaser,
        otherMoney,
        allPrice,
        freight,
        paidPrice,
        waitPushOrders,
        storeOrders,
        status,
        isShowPushConfirm,
        isPushing,
        isShowGenConfirm,
        isGening,
        isShowObsoleteConfirm,
        isObsoleting,
        genInfo,
        isLoading,
        pushOrObsoleteOrderId,
        addressOptions,
        province,
        city,
        district,
        address,
        consignee,
        mobile,
        logisticsCompany,
        logisticsFare,
        logisticsSn,
        unloadFare,
        // 付款记录
        payInfos,
        // 退货单
        backOrderList,
        // // 添加actionList 按钮
        // isShowOkConfirm,
        // isHanding,
        // url,
        // actionNow,
        // 操作相关
        actionList,
        actionUrl,
        actionRemark,
        isShowActionModal,
        isActing,

        payTypeMap,
        payType,

        // 是否编辑含税
        isEditTax,
        expectPayTime,
        expectShippingDate,
        isOutInv,
        balanceBillLastAmount,
        expectInvDate,
        outInvAmount,
        shouldPayAmount,
        balanceBillOutInvAmount,
        followInfo,
        followInfoDetail,
        selectedInfo,
        depotMap,
        depot,
        actionName,
        bankInfo,
        isAllCash,
        isAllDirect,
        isAllAgency,
        shippingMethodMap,
        shippingMethod,
        isTax,
        shippingInfoDetail,
        storageTypeMap
      },
    } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const isCheck = goods.some(item => !item.isCheck)
    const length = Object.keys(depotMap != undefined && depotMap).length;
    // const actionList = [
    //   {
    //     name: '主管审核',
    //     url: 'xxxx',
    //     color: '#xxx',
    //     isNeedRemark: false,
    //   },
    //   {
    //     name: '主管驳回',
    //     url: 'xxxxxx',
    //     color: '#xxx',
    //     isNeedRemark: true,
    //   },
    // ];

    // 详情 table 的列头数据
    const genColumns = (tableStatus) => {
      const basicColumns = [
        {
          dataIndex: 'NO',
          key: 'NO',
          className: styles.textAlign,
          width: 80,
          render: (NO, record, index) => (
            <span>{NO || index + 1}</span>
          ),
        }, {
          title: '商品编码',
          dataIndex: 'no',
          key: 'no',
          width: 210,
          render: (no, record) => {
            if (record.NO === '合计') {
              return null;
            }
            // return <div className={styles.warning}>{!record.isCheck?<Tooltip title="该条码信息发生变更，正在审核中"><Icon type="warning" style={{color:'#f60'}}/></Tooltip>:""}<span>{no}</span></div>
            return <span>{no}</span>
          },
        }, {
          title: '商品名称',
          dataIndex: 'goodsName',
          key: 'goodsName',
          width: 250,
          render: (goodsName, record) => {
            return <p style={{ width: 230, margin: 0 }} className={globalStyles.twoLine}>
              <Tooltip title={goodsName}>
                <div>
                  {record.tag && record.tag.map((item, index) => {
                    if (item.name === "售后") {
                      return <span className={globalStyles.tag} style={{ background: item.color }} key={index}>{item.name}</span>
                    }
                  })}
                </div>
                {goodsName}
              </Tooltip>
            </p>
          },
        }, {
          title: '单位',
          dataIndex: 'unit',
          key: 'unit',
          className: styles.textAlign,
          width: 80,
          render: (unit) => {
            return <span>{unit}</span>;
          },
        },

      ];
      // 商品详情的 columns
      const detailColumns = basicColumns.concat([
        {
          title: '结算方式',
          dataIndex: 'payMethod',
          key: 'payMethod',
          width: 100,
        },
        {
          title: '采购数',
          dataIndex: 'purchaseNum',
          key: 'purchaseNum',
          className: styles.textAlign,
          width: 120,
          render: (purchaseNum) => {
            return <span>{purchaseNum}</span>;
          },
        },

        {
          title: '已入库数',
          dataIndex: 'storeNum',
          key: 'storeNum',
          className: styles.textAlign,
          width: 120,
          render: (storeNum) => {
            return <span>{storeNum}</span>;
          },
        },
        {
          title: '待入库数',
          dataIndex: 'waitStoreNum',
          key: 'waitStoreNum',
          className: styles.textAlign,
          width: 120,
          render: (waitStoreNum) => {
            return <span>{waitStoreNum}</span>;
          },
        },
        {
          title: '零售价',
          dataIndex: 'marketPrice',
          key: 'marketPrice',
          className: styles.textAlign,
          width: 120,
        },
        {
          title: '平台售价',
          dataIndex: 'shopPrice',
          key: 'shopPrice',
          className: styles.textAlign,
          width: 120,
        },
        {
          title: '平台折扣',
          dataIndex: 'saleDiscount',
          key: 'saleDiscount',
          className: styles.textAlign,
          width: 120,
        },
        {
          title: '采购单价/折扣',
          dataIndex: 'purchasePrice',
          key: 'purchasePrice',
          className: styles.textAlign,
          width: 200,
          render: (purchasePrice, record) => {
            if (record.NO === '合计') {
              return null;
            }
            return (
              <div>
                <span style={{ color: '#FF7640' }}>{purchasePrice}</span>
                /<span style={{ color: '#2DA6DF' }}>{record.purchaseDiscount}</span>
              </div>
            );
          },
        },
        {
          title: '返利后进价',
          dataIndex: '',
          key: '',
          width: 120,
        },
        {
          title: '条码政策',
          key: 'snPolicy',
          dataIndex: 'snPolicy',
          width: 100,
          render: (snPolicy) => {
            return <Tooltip title={snPolicy}>
              {
                snPolicy ? (<img
                  style={{ width: 40, height: 40 }}
                  src={img}></img>) : null
              }
            </Tooltip>
          },
        },
        {
          title: '是否含税',
          dataIndex: 'purchaseIsTax',
          key: 'purchaseIsTax',
          className: styles.textAlign,
          width: 120,
          // filterIcon: <Icon type="edit" onClick={this.handleChangeIsEditTax.bind(this)} />,
          // filterDropdown: <div>11</div>,
          // filterDropdownVisible: false,
          render: (purchaseIsTax, record) => {
            if (purchaseIsTax === 'purchaseIsTax') {
              return null;
            }
            if (isEditTax) {
              return (
                <Select
                  value={purchaseIsTax}
                  onChange={this.handleChangeTax.bind(this, record.id)}
                >
                  <Option value={1}>是</Option>
                  <Option value={0}>否</Option>
                </Select>
              );
            } else {
              return <span>{purchaseIsTax ? '是' : '否'}</span>;
            }
          },
        },
        {
          title: '采购小计',
          dataIndex: 'subtotal',
          key: 'subtotal',
          className: styles.textAlign,
          width: 140,
          render: (subtotal, record) => {
            return <span>{subtotal || (record.purchaseIsTax ? (+record.purchaseNum * +record.supplyPrice) : +record.purchaseNum * +record.purchaseTaxPrice)}</span>;
          },
        },
        {
          title: '备注',
          dataIndex: 'remark',
          key: 'remark',
          width: 140,
          render: (remark) => {
            return <Tooltip title={remark}>
              <p style={{ width: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>{remark}</p>
            </Tooltip>

          }
        },
      ]);

      // 赠品列表
      const giftsColumns = basicColumns.concat([
        {
          title: '采购数',
          dataIndex: 'purchaseNum',
          key: 'purchaseNum',
          className: styles.textAlign,
          width: 120,
          render: (purchaseNum) => {
            return <span>{purchaseNum}</span>;
          },
        }, {
          title: '已入库数',
          dataIndex: 'storeNum',
          key: 'storeNum',
          className: styles.textAlign,
          width: 120,
          render: (storeNum) => {
            return <span>{storeNum}</span>;
          },
        }, {
          title: '待入库数',
          dataIndex: 'waitStoreNum',
          key: 'waitStoreNum',
          className: styles.textAlign,
          width: 120,
          render: (waitStoreNum) => {
            return <span>{waitStoreNum}</span>;
          },
        },
        {
          title: '零售价',
          dataIndex: 'marketPrice',
          key: 'marketPrice',
          className: styles.textAlign,
          width: 120,
        },
        {
          title: '平台售价',
          dataIndex: 'shopPrice',
          key: 'shopPrice',
          className: styles.textAlign,
          width: 120,
        },
        {
          title: '平台折扣',
          dataIndex: 'saleDiscount',
          key: 'saleDiscount',
          className: styles.textAlign,
          width: 120,
        },
        {
          title: '返利后进价',
          dataIndex: '',
          key: '',
          width: 120,
        },
        {
          title: '实付采购价',
          dataIndex: '',
          key: '',
          width: 120,
        },
        {
          title: '条码政策',
          key: 'snPolicy',
          dataIndex: 'snPolicy',
          render: (snPolicy) => {
            return <Tooltip title={snPolicy}>
              {
                snPolicy ? (<img
                  style={{ width: 40, height: 40 }}
                  src={img}></img>) : null
              }
            </Tooltip>
          },
        },
        {
          title: '采购单价/折扣',
          dataIndex: 'purchasePrice',
          key: 'purchasePrice',
          className: styles.textAlign,
          width: 200,
          render: (purchasePrice, record) => {
            if (record.NO === '合计') {
              return null;
            }
            return (
              <div>
                <span style={{ color: '#FF7640' }}>{purchasePrice}</span>
                /<span style={{ color: '#2DA6DF' }}>{record.purchaseDiscount}</span>
              </div>
            );
          },
        }, {
          title: '是否含税',
          dataIndex: 'purchaseIsTax',
          key: 'purchaseIsTax',
          className: styles.textAlign,
          width: 120,
          render: (purchaseIsTax) => {
            if (purchaseIsTax === 'purchaseIsTax') {
              return null;
            }
            return <span>{purchaseIsTax ? '是' : '否'}</span>;
          },
        },
        {
          title: '采购小计',
          dataIndex: 'subtotal',
          key: 'subtotal',
          className: styles.textAlign,
          width: 200,
          render: (subtotal, record) => {
            return <span>0.00</span>;
          },
        },
      ]);

      // 待入库商品清单 columns
      const waitStoreColumns = basicColumns.concat([
        {
          title: '采购数',
          dataIndex: 'purchaseNum',
          key: 'purchaseNum',
          className: styles.textAlign,
          width: 120,
          render: (purchaseNum) => {
            return <span>{purchaseNum}</span>;
          },
        },
        // {
        //   title: '已入库数',
        //   dataIndex: 'storeNum',
        //   with: 200,
        //   className: styles.textAlign,
        //   render: storeNum => <span>{storeNum}</span>,
        // },
        {
          title: '待入库数',
          dataIndex: 'waitStoreNum',
          key: 'waitStoreNum',
          className: styles.textAlign,
          width: 120,
          render: (waitStoreNum) => {
            return <span style={{ color: 'red', fontWeight: 'bold' }}>{waitStoreNum}</span>;
          },
        },
        {
          title: '本次入库数',
          dataIndex: 'nowStoreNum',
          width: 150,
          render: (nowStoreNum, record) => {
            return [
              <Input value={nowStoreNum}
                style={{ width: 100, marginRight: 10 }}
                onChange={this.handleChangeNowStoreNum.bind(this, record.id)}
                value={record.nowStoreNum} />,
              <Button size="small" type="primary" onClick={this.handleGetAllStoreNum.bind(this, record.id)}>全部</Button>
            ]
          },
        },
      ]);

      // 待推送商品清单 columns
      const waitPushColumns = basicColumns.concat([
        {
          title: '采购数',
          dataIndex: 'needReceiveNum',
          key: 'needReceiveNum',
          className: styles.textAlign,
          width: 120,
          render: (needReceiveNum) => {
            return <span>{needReceiveNum}</span>;
          },
        },
        {
          title: '待入库数',
          dataIndex: 'waitStoreNum',
          key: 'waitStoreNum',
          className: styles.textAlign,
          width: 120,
          render: (waitStoreNum) => {
            return <span>{waitStoreNum}</span>;
          },
        },
        {
          title: '本次入库数',
          dataIndex: 'receiveNum',
          width: 100,
          className: styles.textAlign,
          render: receiveNum => <span>{receiveNum}</span>,
        },
      ]);

      // 入库清单 columns
      const storeColumns = basicColumns.concat([
        {
          title: '采购数',
          dataIndex: 'needReceiveNum',
          key: 'needReceiveNum',
          className: styles.textAlign,
          width: 120,
          render: (needReceiveNum) => {
            return <span>{needReceiveNum}</span>;
          },
        },
        {
          title: '待入库数',
          dataIndex: 'waitStoreNum',
          key: 'waitStoreNum',
          className: styles.textAlign,
          width: 120,
          render: (waitStoreNum) => {
            return <span>{waitStoreNum}</span>;
          },
        },
        {
          title: '本次入库数',
          dataIndex: 'receiveNum',
          width: 100,
          className: styles.textAlign,
          render: receiveNum => <span>{receiveNum}</span>,
        },
      ]);

      switch (tableStatus) {
        case 'detail':
          return detailColumns;
        case 'gifts':
          return giftsColumns;
        case 'waitStore':
          return waitStoreColumns;
        case 'waitPush':
          return waitPushColumns;
        case 'store':
          return storeColumns;
        default:
          break;
      }
    };
    // 付款记录
    const payInfosColumns = [
      {
        key: 'payTime',
        dataIndex: 'payTime',
        title: '付款时间',
      },
      {
        key: 'payMoney',
        dataIndex: 'payMoney',
        title: '付款金额',
      },
      {
        key: 'payAccount',
        dataIndex: 'payAccount',
        title: '付款账户',
      },
      // {
      //   key: 'receivableAccount',
      //   dataIndex: 'receivableAccount',
      //   title: '收款账户',
      // },
      // {
      //   key: 'payStatus',
      //   dataIndex: 'payStatus',
      //   title: '付款状态',
      // },
      {
        key: 'remark',
        dataIndex: 'remark',
        title: '备注',
      },
    ];
    // 退货单
    const backGoodsListColumns = [
      {
        title: '主图',
        dataIndex: 'img',
        key: 'img',
        render: (src, record) => (
          <img src={src} style={{ height: 55, width: 55 }} />
        ),
      },
      {
        title: '商品名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '商品条码',
        dataIndex: 'sn',
        key: 'sn',
      },
      {
        title: '单位',
        dataIndex: 'unit',
        key: 'unit',
      },
      {
        title: '退款数量',
        dataIndex: 'returnNum',
        key: 'returnNum',
      },
      {
        title: '退款金额',
        dataIndex: 'returnMoney',
        key: 'returnMoney',
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
      },
    ];
    const {
      purchaseNum: allPurchaseNum,
      storeNum: allStoreNum,
      waitStoreNum: allWaitStoreNum,
    } = goods.reduce((pre, next) => {
      return {
        purchaseNum: +pre.purchaseNum + +next.purchaseNum,
        storeNum: +pre.storeNum + +next.storeNum,
        waitStoreNum: +pre.waitStoreNum + +next.waitStoreNum,
      };
    }, {
        purchaseNum: 0,
        storeNum: 0,
        waitStoreNum: 0,
      });

    const {
      purchaseNum: allGiftsNum,
      subtotal: allGiftsSubtotal,
    } = gifts.reduce((pre, next) => {
      return {
        purchaseNum: +pre.purchaseNum + +next.purchaseNum,
        storeNum: +pre.storeNum + +next.storeNum,
        waitStoreNum: +pre.waitStoreNum + +next.waitStoreNum,
        subtotal: +pre.subtotal + +next.subtotal,
      };
    }, {
        purchaseNum: 0,
        storeNum: 0,
        waitStoreNum: 0,
        subtotal: 0,
      });
    return (
      <PageHeaderLayout title="库存采购订单详情" className={styles.detailPageHeader}>
        <Card bordered={false}>
          <Tabs
            defaultActiveKey="1"
            tabBarExtraContent={
              actionList ?
                actionList.map((actionInfo) => {
                  switch (actionInfo.type) {
                    case 1:
                      return (
                        <Link to={actionInfo.url}>
                          <Button style={{ marginLeft: 10 }}>{actionInfo.name}</Button>
                        </Link>
                      );
                    case 2:
                      return (
                        <a
                          href={actionInfo.url}
                          target="_blank"
                        >
                          <Button type="primary" style={{ marginLeft: 10 }}>{actionInfo.name}</Button>
                        </a>
                      );
                    default:
                      return (
                        <Button
                          style={{ marginLeft: 15 }}
                          onClick={this.handleTriggerActionModal.bind(this, actionInfo.url, actionInfo.isNeedRemark, actionInfo.backUrl, actionInfo.name)}
                        >
                          {actionInfo.name}
                        </Button>
                      );
                  }
                }) :
                null
              /* .concat([
                <Link to={`/purchase/common-purchase-list/common-purchase-add/${this.props.match.params.id}`}>
                  <Button style={{ marginLeft: 15 }}>修改</Button>
                </Link>,
                <Link to={`/purchase/purchase-after-sale-order-list/purchase-after-sale-order-edit/${this.props.match.params.id}`}>
                  <Button style={{ marginLeft: 15 }}>新建售后单</Button>
                </Link>,
              ]) */
            }

          >
            {/* 订单详情 */}
            <Tabs.TabPane tab="订单详情" key="1">
              {
                isCheck ? <Row style={{ marginBottom: 10 }}>
                  <Alert
                    message="该供应商代理品牌下的部分商品正处于审核中，未审核通过前，该采购单依然沿用之前的数据。"
                    type="warning"
                  />
                </Row> : ""
              }
              {
                payType == 0 && !isAllCash || payType == 2 && !isAllDirect || payType == 4 && !isAllAgency ?
                  <Row style={{ marginBottom: 10 }}>
                    <Alert
                      message="当前采购单支付类型与部分条码的结算方式不匹配，请谨慎审核！"
                      type="warning"
                    />
                  </Row> : ""
              }
              <Table
                bordered
                loading={isLoading}
                rowKey={record => record.id}
                dataSource={goods.concat([{ NO: '合计', purchaseNum: allPurchaseNum, storeNum: '', waitStoreNum: '', purchaseIsTax: 'purchaseIsTax', subtotal: allPrice }])}
                columns={genColumns('detail')}
                className={globalStyles.tablestyle}
                pagination={false}
                title={() => (
                  <Row type="flex" align="middle">
                    <span style={{ color: '#F7736F', fontSize: 16, fontWeight: 'bold', marginRight: 30 }}>{status}</span>
                    <span style={{ marginRight: 30 }}>采购单号: {orderNo || '无'}</span>
                    <span style={{ marginRight: 30 }}>供应商: {supplier || '无'}</span>
                    <span style={{ marginRight: 30 }}>采购员: {purchaser}</span>
                    <span style={{ marginRight: 30 }}>日期: {date}</span>
                  </Row>
                )}
              />
              {
                (() => {
                  if (gifts && gifts.length > 0) {
                    return (
                      [
                        <Row style={{ marginTop: 20, marginBottom: 5, fontSize: 16, fontWeight: 'bold' }}>赠品列表</Row>,
                        <Table
                          bordered
                          loading={isLoading}
                          rowKey={record => record.id}
                          dataSource={gifts.concat([{ NO: '合计', purchaseNum: allGiftsNum, storeNum: '', waitStoreNum: '', purchaseIsTax: 'purchaseIsTax', subtotal: allGiftsSubtotal }])}
                          columns={genColumns('gifts')}
                          pagination={false}
                        />,
                      ]
                    );
                  }
                })()
              }
              <Row>
                {/* <Row type="flex" justify="end" style={{ marginTop: 10 }}>
                  <Col>
                    <span>运费金额: </span>
                    <span style={{ marginTop: 10, fontSize: 20, color: '#F7696B' }}>{freight}</span>
                  </Col>
                </Row> */}
                <Row type="flex" justify="end" style={{ marginTop: 10 }}>
                  {/* <Col>
                    <span>应付金额:<span style={{ marginTop: 10, fontSize: 20, color: '#F7696B' }}>{allPrice}</span> </span>
                    
                  </Col> */}
                </Row>
                <Col span={20}>
                  <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginTop: 40 }}>
                    <div style={{ marginBottom: 5, verticalAlign: 'middle', fontSize: '16px', fontWeight: 600 }}>支付类型: {payTypeMap[payType]}</div>
                    <div style={{ marginBottom: 5, verticalAlign: 'middle', fontSize: '16px', fontWeight: 600 }}>运费方式: {shippingMethodMap[shippingMethod]}</div>
                    <div style={{ marginBottom: 5, verticalAlign: 'middle', fontSize: '16px', fontWeight: 600 }}>是否含税: {isTax ? "是" : "否"}</div>
                    {
                      payType === 2 ? (<div style={{ marginBottom: 5, verticalAlign: 'middle', fontSize: '16px', fontWeight: 600 }}>预计付款时间: {expectPayTime}</div>) : null
                    }
                    <div style={{ marginBottom: 5, verticalAlign: 'middle', fontSize: '16px', fontWeight: 600 }}>预计发货时间: {expectShippingDate}</div>
                    <div style={{ marginBottom: 5, verticalAlign: 'middle', fontSize: '16px', fontWeight: 600 }}>预计开票时间: {expectInvDate}</div>
                    <div style={{ marginBottom: 5, verticalAlign: 'middle', fontSize: '16px', fontWeight: 600, display: "inline-block", width: 800, wordWrap: 'break-word' }}>财务备注: {financeRemark}</div>
                    <div style={{ marginBottom: 5, verticalAlign: 'middle', fontSize: '16px', fontWeight: 600, display: "inline-block", width: 800, wordWrap: 'break-word' }}>付款信息: {bankInfo}</div>
                    <div style={{ marginBottom: 5, verticalAlign: 'middle', fontSize: '16px', fontWeight: 600, display: "inline-block", width: 800, wordWrap: 'break-word' }}>订单备注：<pre style={{ display: 'inline-block', verticalAlign: 'top' }}>{remark}</pre></div>

                  </Row>
                </Col>
                <Col span={4}>
                  <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginTop: 40 }}>
                    <span style={{ marginBottom: 5, verticalAlign: 'middle', fontSize: '16px', fontWeight: 600 }}>采购金额:<span style={{ marginTop: 10, fontSize: 18 }}>{"￥" + allPrice}</span></span>
                    <div style={{ marginBottom: 5, verticalAlign: 'middle', fontSize: '16px', fontWeight: 600 }}>挂账抵扣: <span style={{ fontSize: '18px', fontWeight: 600 }}>{"￥" + balanceBillLastAmount}</span></div>
                    <div style={{ marginBottom: 5, verticalAlign: 'middle', fontSize: '16px', fontWeight: 600 }}>抵扣金额是否开票: {isOutInv ? "是" : "否"}</div>
                    <div style={{ marginBottom: 5, verticalAlign: 'middle', fontSize: '16px', fontWeight: 600 }}>抵扣金额需开票金额: <sapn style={{ fontSize: '18px', fontWeight: 600 }}>{"￥" + balanceBillOutInvAmount}</sapn></div>
                    <div style={{ marginBottom: 5, verticalAlign: 'middle', fontSize: '16px', fontWeight: 600 }}>开票总金额: <sapn style={{ fontSize: '18px', fontWeight: 600 }}>{"￥" + outInvAmount}</sapn></div>
                    <div style={{ marginBottom: 5, verticalAlign: 'middle', fontSize: '16px', fontWeight: 600 }}>采购应付总额: <sapn style={{ fontSize: '20px', fontWeight: 600, color: '#F7696B' }}>{"￥" + shouldPayAmount}</sapn></div>
                  </Row>
                </Col>
              </Row>
            </Tabs.TabPane>

            {/* 入库记录 */}
            <Tabs.TabPane tab="入库记录" key="2">
              <Row style={{ height: 80, lineHeight: '80px', backgroundColor: '#FFF9F0', paddingLeft: 30 }}>
                <span style={{ color: '#F7736F', fontSize: 16, fontWeight: 'bold', marginRight: 30 }}>{status}</span>
                <span style={{ marginRight: 30 }}>采购单号 : {orderNo || '无'}</span>
                <span style={{ marginRight: 30 }}>供应商 : {supplier || '无'}</span>
              </Row>

              <Collapse style={{ marginTop: 20 }} defaultActiveKey={['1']}>
                <Collapse.Panel header="待入库商品清单" key="1">
                  <Row type="flex" justify="end" align="middle" style={{ marginBottom: 10 }}>
                    <Button onClick={this.handleClickGenButton.bind(this)} type="primary">生成入库单</Button>
                  </Row>
                  <Table
                    bordered
                    loading={isLoading}
                    rowKey={record => record.id}
                    dataSource={waitInStoreOrder}
                    columns={genColumns('waitStore')}
                    pagination={false}
                    onChange={this.handleTableChange}
                  />
                  {/* <Table
                    bordered
                    loading={isLoading}
                    rowKey={record => record.id}
                    dataSource={genInfo.gifts}
                    columns={genColumns('waitStore')}
                    pagination={false}
                    onChange={this.handleTableChange}
                  /> */}
                </Collapse.Panel>
                <Collapse.Panel header={`待推送入库清单(${waitPushOrders.length}单)`} key="2">
                  {
                    waitPushOrders.map((waitPushOrder) => {
                      return (
                        <Table
                          bordered
                          loading={isLoading}
                          rowKey={record => record.id}
                          dataSource={waitPushOrder.goods}
                          columns={genColumns('waitPush')}
                          pagination={false}
                          style={{ marginBottom: 20 }}
                          title={() => (
                            <Row style={{ position: 'relative', height: 60 }} type="flex" align="middle">
                              <Col style={{ width: '60%', display: 'inline-block' }}>
                                <span>入库时间: {waitPushOrder.date} </span>
                                <span style={{ marginLeft: '20px' }}>物流公司: {waitPushOrder.logisticsCompany} </span>
                                <span style={{ marginLeft: '20px' }}>物流单号: {waitPushOrder.logisticsSn} </span>
                                {/* <span style={{ marginLeft: '20px' }}>物流费用: {waitPushOrder.logisticsFare} </span>
                                <span style={{ marginLeft: '20px' }}>卸货费: {waitPushOrder.unloadFare} </span> */}
                              </Col>
                              <Col style={{ position: 'absolute', right: 0 }}>
                                <Button onClick={this.handleClickObsoleteButton.bind(this, waitPushOrder.orderId)} type="primary">作废</Button>
                                <Button onClick={this.handleClickPushButton.bind(this, waitPushOrder.orderId)} type="primary" style={{ marginLeft: 5 }}>推送</Button>
                              </Col>
                            </Row>
                          )}
                          footer={() => (
                            <Row>
                              {/* <Row gutter={{ md: 24 }} style={{ marginBottom: 10 }}>
                                <span>联系人：{waitPushOrder.consignee}</span>
                                <span>联系电话：{waitPushOrder.mobile}</span>
                              </Row> */}
                              <Row gutter={{ md: 24 }} style={{ marginBottom: 10 }}>
                                <span>收货地址：{waitPushOrder.province}{waitPushOrder.city}{waitPushOrder.district}{waitPushOrder.address}</span>
                              </Row>
                              <Row gutter={{ md: 24 }} style={{ marginBottom: 10 }}>
                                {/* <Col md={8}>入库单号：{waitPushOrder.purchase_import_depot_order_sn}</Col> */}
                                <Col md={8}>经办人：{waitPushOrder.handler}</Col>
                              </Row>
                              <Row style={{ marginBottom: 10 }}>
                                <Row>入库备注：{waitPushOrder.remark}</Row>
                              </Row>
                              <Row gutter={{ md: 24 }} style={{ marginBottom: 10 }}>
                                <Col md={8}>采购单号：{orderNo}</Col>
                                <Col md={8}>采购员：{purchaser}</Col>
                                <Col md={8}>制单人：{purchaser}</Col>
                              </Row>
                              <Row style={{ marginBottom: 10 }}>
                                <Row>采购备注：{remark}</Row>
                              </Row>
                            </Row>
                          )}
                        />
                      );
                    })
                  }
                </Collapse.Panel>
                <Collapse.Panel header={`入库清单(${storeOrders.length}单)`} key="3">
                  {
                    storeOrders.map((storeOrder) => {
                      return (
                        <Table
                          bordered
                          rowClassName={(record, index) => { if (index === 0) return styles.tableHeader; }}
                          loading={isLoading}
                          rowKey={record => record.id}
                          dataSource={storeOrder.goods}
                          columns={genColumns('store')}
                          pagination={false}
                          onChange={this.handleTableChange}
                          title={() => (
                            <Row>
                              <Col>
                                <span>入库时间: {storeOrder.date}</span>
                                <span style={{ marginLeft: '20px' }}>物流公司: {storeOrder.logisticsCompany} </span>
                                <span style={{ marginLeft: '20px' }}>物流单号: {storeOrder.logisticsSn} </span>
                                {/* <span style={{ marginLeft: '20px' }}>物流费用: {storeOrder.logisticsFare} </span>
                                <span style={{ marginLeft: '20px' }}>卸货费: {storeOrder.unloadFare} </span> */}
                              </Col>
                            </Row>
                          )}
                          footer={() => (
                            <Row gutter={{ md: 24 }} style={{ paddingTop: 20, marginLeft: 0, marginRight: 0 }}>
                              {/* <Row gutter={{ md: 24 }} style={{ marginBottom: 10 }}>
                                <span>联系人：{storeOrder.consignee}</span>
                                <span>联系电话：{storeOrder.mobile}</span>
                              </Row> */}
                              {/* <Row gutter={{ md: 24 }} style={{ marginBottom: 10 }}>
                                <span>收货地址：{storeOrder.province}{storeOrder.city}{storeOrder.district}{storeOrder.address}</span>
                              </Row> */}
                              <Row gutter={{ md: 24 }} style={{ marginBottom: 10 }}>
                                <Col md={8}>入库单号：{storeOrder.purchase_import_depot_order_sn}</Col>
                                {/* <Col md={8}>入库仓：默认仓</Col> */}
                                <Col md={8}>经办人：{storeOrder.handler}</Col>
                              </Row>
                              <Row style={{ marginBottom: 10 }}>
                                <Row>入库备注：{storeOrder.remark}</Row>
                              </Row>
                              <Row gutter={{ md: 24 }} style={{ marginBottom: 10 }}>
                                <Col md={8}>采购单号：{orderNo}</Col>
                                <Col md={8}>采购员：{purchaser}</Col>
                                <Col md={8}>制单人: {purchaser}</Col>
                              </Row>
                              <Row style={{ marginBottom: 10 }}>
                                <Row>采购备注：{remark}</Row>
                              </Row>
                            </Row>
                          )}
                        />
                      );
                    })
                  }
                </Collapse.Panel>
              </Collapse>
            </Tabs.TabPane>
            <Tabs.TabPane tab="付款记录" key="3">
              <Row style={{ marginBottom: 20, backgroundColor: '#FFF9F1', padding: 20 }}>
                <span style={{ marginRight: 30, fontSize: 20 }}>采购单号: {orderNo || '无'}</span>
                <span style={{ marginRight: 30, fontSize: 20 }}>供应商: {supplier || '无'}</span>
                <span style={{ marginRight: 30, fontSize: 20 }}>采购员: {purchaser}</span>
                <Row style={{ height: 40, lineHeight: '40px', fontSize: 20, color: '#666666' }}>
                  <span style={{ marginRight: 20 }}>应付货款: {allPrice}</span>
                  <span style={{ marginRight: 20 }}>应付运费: {paidPrice}</span>
                  <span style={{ marginRight: 20 }}>应付卸货费: {paidPrice}</span>
                  <span style={{ marginRight: 20 }}>挂账抵扣金额: <span style={{ color: 'red' }}>{balanceBillLastAmount}</span></span>
                  <span style={{ marginRight: 20 }}>开票总额: <span style={{ color: 'red' }}>{outInvAmount}</span></span>
                </Row>
                <Row style={{ height: 40, lineHeight: '40px', fontSize: 20, color: '#666666' }}>
                  <span style={{ marginRight: 20 }}>应付金额: <span style={{ color: '#FF001E' }}>{shouldPayAmount}</span></span>
                  <span>已付金额: {paidPrice}</span>
                </Row>
              </Row>
              <Table
                bordered
                dataSource={payInfos}
                columns={payInfosColumns}
                pagination={false}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab="退货单" key="4">
              {backOrderList.map(backOrder => (
                <Table
                  bordered
                  columns={backGoodsListColumns}
                  dataSource={backOrder.backGoodsList}
                  rowKey={record => record.sn}
                  style={{ marginBottom: 30 }}
                  pagination={false}
                  title={() => (
                    [
                      <Row>
                        <span style={{ marginRight: 20, fontSize: 20, fontWeight: 'bold', color: '#F57876' }}>{backOrder.status}</span>
                        <span style={{ marginRight: 20 }}>供应商: {backOrder.supplier}</span>
                        <span style={{ marginRight: 20 }}>是否退货: {backOrder.isReturnGoods ? '是' : '否'}</span>
                        <span>创建时间: {backOrder.time}</span>
                      </Row>,
                      <Row>关联售后单号: <Link to={`/purchase/purchase-order-management/purchase-after-sale-order-list/purchase-after-sale-order-detail/${backOrder.id}`}>{backOrder.id}</Link></Row>,
                    ]
                  )}
                />
              ))}
            </Tabs.TabPane>
            <Tabs.TabPane tab="运费详情" key="5">
              <Row className={styles.line}>
                <div>供应商: <span>{shippingInfoDetail.supplierName}</span></div>
                <div>采购员: <span>{shippingInfoDetail.purchaser}</span></div>
                <div>关联应付运费单号: 
                  {
                    shippingInfoDetail.shippingFeeId&&shippingInfoDetail.shippingFeeId.map(item=>(
                      <Link to={`/purchase/freight/freight-list/freight-detail/${item}`}>{`${item} `}</Link>
                    ))
                  }
                </div>
              </Row>
              <Card style={{ marginBottom: 10 }}>
                <Row>
                  <div style={{ display: 'inline-block', fontSize: 18, marginRight: 20 }}>运费信息</div>
                </Row>
                {
                  shippingInfoDetail.detail&&shippingInfoDetail.detail.purchaseShippingList.map(item => {
                    return <Row className={styles.line}>
                      <div>物流单号: <span>{item.shippingNo}</span></div>
                      <div>物流公司: <span>{item.shippingCompany}</span></div>
                      <div>基础运费: <span>{item.amount}</span></div>
                      <div>归属运费: <span>{item.payAmount}</span></div>
                    </Row>
                  })
                }
                <Row className={styles.marginBottom}>
                  <span style={{ color: "#1890ff" }}>运费凭证</span>
                </Row>

                <Row className={styles.marginBottom}>
                  {
                    shippingInfoDetail.detail&&shippingInfoDetail.detail.shippingImgList.map(imgInfo => {
                      return <span className={styles.imgBox}>
                        <img src={imgInfo.imgUrl} />
                      </span>
                    })
                  }
                </Row>
                <Row className={styles.marginBottom}>
                  <div>运费总额: <span style={{ fontSize: 20, color: 'red' }}>{shippingInfoDetail.detail&&shippingInfoDetail.detail.totalAmount}</span></div>
                </Row>
                <Row className={styles.marginBottom}>
                  <Col span={1}>备注：</Col>
                  <Col span={10}>
                    <pre>{shippingInfoDetail.detail&&shippingInfoDetail.detail.remark}</pre>
                  </Col>
                </Row>
              </Card>
            </Tabs.TabPane>
          </Tabs>
          <Modal
            title="请确认是否生成入库单"
            visible={isShowGenConfirm}
            onOk={this.handleClickOkGenButton.bind(this)}
            confirmLoading={isGening}
            onCancel={this.handleClickCancelGenButton.bind(this)}
          >
            <Form onSubmit={this.handleClickOkGenButton}>
              <Form.Item {...formItemLayout} label="选择物流单号:">
                {
                  <Select
                    style={{ width: 200 }}
                    onSelect={this.handleAddLogisticInfo}
                  >
                    {
                      Object.keys(followInfoDetail).map(key => (
                        <Select.Option value={key}>{followInfoDetail[key]}</Select.Option>
                      ))
                    }
                  </Select>
                }
              </Form.Item>
              <Form.Item {...formItemLayout} label="物流公司:">
                {
                  getFieldDecorator('logisticsCompany', {
                    initialValue: logisticsCompany,
                    rules: [
                      {
                        required: true, message: '请输入物流公司',
                      }
                    ]
                  })(
                    <Input
                      style={{ width: 200 }}
                    />
                  )
                }
              </Form.Item>
              <Form.Item {...formItemLayout} label="物流单号:">
                {
                  getFieldDecorator('logisticsSn', {
                    initialValue: logisticsSn,
                    rules: [
                      {
                        required: true, message: '请输入物流单号',
                      }
                    ]
                  })(
                    <Input
                      style={{ width: 200 }}
                    />
                  )
                }
              </Form.Item>
              <Form.Item {...formItemLayout} label="入库备注:">
                {
                  getFieldDecorator('remark', {
                  })(
                    <TextArea
                      rows={4}
                    />
                  )
                }
              </Form.Item>
            </Form>
          </Modal>
          <Modal
            title="确认"
            visible={isShowPushConfirm}
            onOk={this.handleClickOkPushButton.bind(this, pushOrObsoleteOrderId)}
            confirmLoading={isPushing}
            onCancel={this.handleClickCancelPushButton.bind(this)}
          >
            <p style={{ textAlign: 'center' }}>请确认是否推送</p>
            {
              length > 0 ? <Row type="flex" justify="center">
                请选择推送仓库：
              <Select
                  placeholder="请选择推送仓库"
                  className={globalStyles['select-sift']}
                  onSelect={this.handleSelectDepot.bind(this,'depot')}
                  value={depot}
                >
                  {
                    Object.keys(depotMap != undefined && depotMap).map((depotItem) => {
                      return (
                        <Option value={depotItem} key={depotItem}>{depotMap[depotItem]}</Option>
                      );
                    })
                  }
                </Select>
              </Row> : null
            }
            <Row type="flex" justify="center">
              选择库位类型：
              <Select
                placeholder="请选择库位类型"
                className={globalStyles['select-sift']}
                onSelect={this.handleSelectDepot.bind(this,'storageType')}
              >
                {
                  Object.keys(storageTypeMap != undefined && storageTypeMap).map((item) => {
                    return (
                      <Option value={item} key={item}>{storageTypeMap[item]}</Option>
                    );
                  })
                }
              </Select>
            </Row>
          </Modal>
          <Modal
            title="确认"
            visible={isShowObsoleteConfirm}
            onOk={this.handleClickOkObsoleteButton.bind(this, pushOrObsoleteOrderId)}
            confirmLoading={isObsoleting}
            onCancel={this.handleClickCancelObsoleteButton.bind(this)}
          >
            <p style={{ textAlign: 'center' }}>请确认是否作废该单</p>
          </Modal>

          {/* 操作 modal */}
          <Modal
            title="确认"
            visible={isShowActionModal}
            confirmLoading={isActing}
            onOk={this.handleOkActionModal.bind(this, this.props.match.params.id)}
            onCancel={this.handleTriggerActionModal.bind(this, null, null)}
          >
            {
              actionName && actionName.indexOf("审核") === -1 ? <div>
                <p style={{ textAlign: 'center' }}>请确认是否驳回？</p>
                <Input
                  value={actionRemark}
                  onChange={this.handleChange.bind(this, 'actionRemark')}
                  placeholder="操作备注"
                />
              </div> : isCheck ? <p>该采购单中，部分商品条码信息正处于审核状态，若继续审核，该采购单将会沿用之前的数据，请确认是否继续审核？</p> : <p>请确认是否审核通过?</p>
            }
          </Modal>
        </Card>

      </PageHeaderLayout>
    );
  }
}
