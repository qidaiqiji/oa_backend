import React, { PureComponent } from 'react';
import { connect } from 'dva';
import NP from 'number-precision';
import { Card, Row, Table, AutoComplete, Input, Select, Checkbox, Col, Cascader, Button, message, Modal, Alert, Tooltip, Icon } from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './PurchaseAfterSaleOrderEdit.less';
import globalStyles from '../../assets/style/global.less';
import area from '../../area.json';

const { Search, TextArea } = Input;
const { Option } = Select;

@connect(state => ({
  purchaseAfterSaleOrderEdit: state.purchaseAfterSaleOrderEdit,
}))
export default class PurchaseAfterSaleOrderEdit extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseAfterSaleOrderEdit/mount',
      payload: {
        purchaseOrderId: this.props.match.params.id,
        backOrderType:this.props.match.params.type,
      },
    });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseAfterSaleOrderEdit/unmount',
    });
  }
  // 同步改变项
  handleChangeItemSync(type, ...rest) {
    const { dispatch } = this.props;
    switch (type) {
      case 'isReturnGoods':
      case 'isSpecial':
        dispatch({
          type: 'purchaseAfterSaleOrderEdit/changeItemSync',
          payload: {
            [type]: rest[0].target.checked,
          },
        });
        break;
      case 'specialPrice':
      case 'consigneeName':
      case 'mobile':
      case 'addressDetail':
      case 'remark':
      case 'keywords':
        dispatch({
          type: 'purchaseAfterSaleOrderEdit/changeItemSync',
          payload: {
            [type]: rest[0].target.value,
          },
        });
        break;
      case 'receiptMethod':
      case 'address':
        dispatch({
          type: 'purchaseAfterSaleOrderEdit/changeItemSync',
          payload: {
            [type]: rest[0],
          },
        });
        break;
      default:
        break;
    }
  }
  // 改变关联采购单的搜索项
  handleChangePurchaseOrderSnKeywords(value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseAfterSaleOrderEdit/getPurchaseOrderInfo',
      payload: {
        purchaseOrderId: value,
      },
    });
  }
  // 选择关联采购单的搜索项
  // handleGetPurchaseOrderInfo(value) {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'purchaseAfterSaleOrderEdit/getPurchaseOrderInfo',
  //     payload: {
  //       purchaseOrderId: value,
  //     },
  //   });
  // }
  // 修改 table 中商品的退货数
  handleChangeGoodsReturnNum(id, e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseAfterSaleOrderEdit/changeGoodsReturnNum',
      payload: {
        id,
        returnNum: e.target.value,
      },
    });
  }
  handleChangeGoodsReturnMoney=(id,e)=>{
    const { dispatch } = this.props;
    dispatch({
      type:'purchaseAfterSaleOrderEdit/changeGoodsReturnMoney',
      payload:{
        id,
        backAmount: e.target.value,
      }
    })

  }
  // 生成采购售后单
  handleSaveOrder(allReturnNum) {
    const { dispatch, purchaseAfterSaleOrderEdit } = this.props;
    const { backOrderType, relateInInvFollowList,goodsList } = purchaseAfterSaleOrderEdit;
    const isGift = goodsList.some(item=>item.isGift)
    if (allReturnNum && allReturnNum > 0) {
      if(backOrderType==1&&relateInInvFollowList.length>0||isGift) {
        dispatch({
          type: 'purchaseAfterSaleOrderEdit/changeItemSyncResolved',
          payload:{
            isShowModal:true,
            isGift,
          }
        });
      }else{
        dispatch({
          type: 'purchaseAfterSaleOrderEdit/saveOrder',
        });
      }
    } else {
      message.warning('商品数量不能全部为空，为空的商品不能退单！');
    }
  }
  // 改变售后类型
  handleChangeBackType=(value)=>{
    const { dispatch } = this.props;
    dispatch({
      type:"purchaseAfterSaleOrderEdit/mountResolved",
      payload:{
        type:value,
      }
    })
  }
  handleCloseModal=()=>{
    const { dispatch } = this.props;
    dispatch({
      type:"purchaseAfterSaleOrderEdit/changeItemSyncResolved",
      payload:{
        isShowModal:false,
      }
    })
  }
  handleConfirmCheck=()=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseAfterSaleOrderEdit/saveOrder',
    });
  }
  render() {
    const {
      purchaseAfterSaleOrderEdit: {
        // 下面两个是同一个东西
        payTypeMap,
        receiptMethod,
        keywords,
        purchaseOrderListSuggests,
        supplier,
        purchaser,
        goodsList,
        purchaseOrderId,
        isReturnGoods,
        isSpecial,
        specialPrice,
        remark,
        address,
        addressDetail,
        mobile,
        consigneeName,
        isTableLoading,
        isSaveLoading,
        orderTypeMap,
        type,
        isShowModal,
        bankType,
        backOrderType,
        relateInInvFollowList,
        isGift
      },
    } = this.props;
    const purchaseOrderListSuggestsOptions = purchaseOrderListSuggests.map((purchaseOrderListSuggest) => {
      return (
        <Option value={purchaseOrderListSuggest.id.toString()}>{purchaseOrderListSuggest.value}</Option>
      );
    });
    const allSubtotal = goodsList.reduce((pre, next) => {
      return pre + (+next.subtotal);
    }, 0);
    const allReturnNum = goodsList.reduce((pre, next) => {
      return pre + (+next.returnNum);
    }, 0);
    const allReturnMoney = goodsList.reduce((pre, next) => {
      return pre + (+next.backAmount);
    }, 0);
    let newGoodsList = null;
    if (goodsList.length !== 0) {
      newGoodsList = goodsList.concat({
        returnNum: allReturnNum,
        subtotal: allSubtotal,
        returnMoney: allReturnMoney,
      });
    } else {
      newGoodsList = goodsList;
    }
    const goodsColumns = [
      {
        render: (_, record, i) => {
          return {
            children: record.returnMoney === undefined ? i + 1 : <div style={{ textAlign: 'center' }}>总计</div>,
            props: {
              colSpan: record.returnMoney === undefined ? 1 : 8,
            },
          };
        },
      },
      {
        title: '主图',
        dataIndex: 'img',
        key: 'img',
        render: (imgSrc, record) => {
          return {
            children: <img src={imgSrc} className={globalStyles['table-goods-img']} />,
            props: {
              colSpan: record.returnMoney === undefined ? 1 : 0,
            },
          };
        },
      },
      {
        title: '商品名称',
        dataIndex: 'name',
        key: 'name',
        width:300,
        render: (name, record) => {
          return {
            children: name,
            props: {
              colSpan: record.returnMoney === undefined ? 1 : 0,
            },
          };
        },
      },
      {
        title: '商品条码',
        dataIndex: 'sn',
        key: 'sn',
        render: (sn, record) => {
          return {
            children: sn,
            props: {
              colSpan: record.returnMoney === undefined ? 1 : 0,
            },
          };
        },
      },
      {
        title: '单位',
        dataIndex: 'unit',
        key: 'unit',
        render: (unit, record) => {
          return {
            children: unit,
            props: {
              colSpan: record.returnMoney === undefined ? 1 : 0,
            },
          };
        },
      },
      {
        title: '是否含税',
        dataIndex: 'isTax',
        key: 'isTax',
        render: (isTax, record) => {
          return {
            children: <span>{isTax ? '是' : '否'}</span>,
            props: {
              colSpan: record.returnMoney === undefined ? 1 : 0,
            },
          };
        },
      },
      {
        title: '单价',
        dataIndex: 'price',
        key: 'price',
        render: (price, record) => {
          return {
            children: <span>{price}</span>,
            props: {
              colSpan: record.returnMoney === undefined ? 1 : 0,
            },
          };
        },
      },
      {
        title: backOrderType==0?'剩余可退数(开票前)':'剩余可退数(开票后)',
        dataIndex: 'waitInvoiceRestReturnNum',
        key: 'waitInvoiceRestReturnNum',
        render: (waitInvoiceRestReturnNum, record) => {
          return {
            children: <Tooltip title={
              <div>
                <div>原下单数量：{record.totalNum}</div>
                 {
                    backOrderType==0?<div>
                    <div>未开票数量：{record.waitInvoiceNum}</div>
                    <div>未开票售后数量：{record.waitInvoiceBackNum}</div>
                    <div>开票前剩余可退数量：{record.waitInvoiceRestReturnNum}</div>
                  </div>:<div>
                    <div>已开票数量：{record.invoicedNum}</div>
                    <div>已开票售后数量：{record.invoicedBackNum}</div>
                    <div>开票后剩余可退数量：{record.invoicedRestReturnNum}</div>
                  </div>
                 }
              </div>
            }><span>{backOrderType==0?waitInvoiceRestReturnNum:record.invoicedRestReturnNum}</span></Tooltip>,
            props: {
              colSpan: record.returnMoney === undefined ? 1 : 0,
            },
          };
        },
      },
      {
        title: '小计',
        dataIndex: 'subtotal',
        key: 'subtotal',
      },
      {
        title: '退货数',
        dataIndex: 'returnNum',
        key: 'returnNum',
        render: (returnNum, record) => {
          return  record.returnMoney === undefined?
             <Input value={returnNum} onChange={this.handleChangeGoodsReturnNum.bind(this, record.id)} />
            : record.returnNum;        
        },
      },
      {
        title: '退货金额',
        dataIndex: 'backAmount',
        key: 'backAmount',
        render: (_, record) => {
        // return record.returnMoney === undefined ? (NP.round(NP.times((record.isTax ? +record.taxPrice : +record.supplyPrice), +record.returnNum), 2)) : NP.round(record.returnMoney, 2);
        const returnMoney = (NP.round(NP.times(+record.price, +record.returnNum), 2));
        return record.returnMoney === undefined?
        (+type === 2?(<Input value={record.backAmount} onChange={this.handleChangeGoodsReturnMoney.bind(this, record.id)} />):<span>{returnMoney}</span>):<span>{NP.round(record.returnMoney, 2)}</span>
        },
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
      },
    ];
    return (
      <PageHeaderLayout title={backOrderType==0?"新建正常售后单":"新建开票后售后单"}>
        <Card bordered={false}>
          <Row type="flex" align="middle" style={{ marginBottom: 10 }}>
            <Search
              placeholder="请输入关联采购单号"
              className={globalStyles['input-sift']}
              style={{
                marginBottom: 0,
              }}
              value={keywords}
              onSearch={this.handleChangePurchaseOrderSnKeywords.bind(this)}
              onChange={this.handleChangeItemSync.bind(this, 'keywords')}
              // onSelect={this.handleGetPurchaseOrderInfo.bind(this)}
              // dataSource={purchaseOrderListSuggestsOptions}
              disabled={this.props.match.params.id}
            />
            {/* <Checkbox
              onChange={this.handleChangeItemSync.bind(this, 'isReturnGoods')}
              checked={isReturnGoods}
            >
              是否退货
            </Checkbox> */}
            <span>售后类型：</span>
            <Select
              // value={purchaseOrderStatusMap[status]}
              placeholder="请选择售后类型"
              className={globalStyles['select-sift']}
              onChange={this.handleChangeBackType.bind(this)}
            >
              {Object.keys(orderTypeMap).map(key => (
                  <Option value={key}>{orderTypeMap[key]}</Option>
              ))}
            </Select>
            <Tooltip title="入库前退货退款（不会产生出库单），入库后退货退款（会产生出库单)"><Icon type="question-circle" /></Tooltip>
          </Row>
          {
            backOrderType==1&&relateInInvFollowList.length>0?<Row style={{marginBottom:10}}>
            <Alert
              message={<div>
                <span>关联采购单为已开票订单，请谨慎做售后操作。 关联来票号:</span>
                {
                  relateInInvFollowList.map(item=>{
                    return <Link to={`/purchase/invoice-management/purchase-in-inv-follow-list/purchase-in-inv-follow-detail/${item.id}`} key={item.inInvSn}>{`${item.inInvSn} / `}</Link>
                  })
                }
                </div>}
              type="warning"
              />
          </Row>:""
          }
          <Table
            bordered
            pagination={false}
            rowKey={record => record.id}
            loading={isTableLoading}
            columns={goodsColumns}
            dataSource={newGoodsList}
            className={globalStyles.tablestyle}
            title={() => {
              return (
                [
                  <span style={{ marginRight: 20 }}>供应商: {supplier === '' ? '无' : supplier}</span>,
                  <span>采购员: {purchaser === '' ? '无' : purchaser}</span>,
                ]
              );
            }}
            footer={() => {
              return (
                [
                  <Row type="flex" align="middle" justify="end">
                    <Checkbox
                      onChange={this.handleChangeItemSync.bind(this, 'isSpecial')}
                      checked={isSpecial}
                    >
                      已通过协商, 申请获批退款金额:
                      <Input onChange={this.handleChangeItemSync.bind(this, 'specialPrice')} value={specialPrice} style={{ width: 100, marginRight: 5 }} disabled={!isSpecial} /> 元
                    </Checkbox>
                  </Row>,
                  <Row type="flex" align="middle" justify="end" style={{ marginRight: 5, marginTop: 10 }}>
                    应退总额: {isSpecial ? specialPrice.toString() : NP.round(allReturnMoney.toString(), 2)}
                  </Row>,
                ]
              );
            }}
          />
          <Row type="flex" align="middle" style={{ marginTop: 10 }}>
            <Col style={{ marginRight: 15 }}>收款方式:</Col>
            <Col>
              <Select style={{ width: 250 }} value={receiptMethod} onChange={this.handleChangeItemSync.bind(this, 'receiptMethod')} placeholder="请选择收款方式">
                {
                  Object.keys(payTypeMap).map((payTypeId) => {
                    return (
                      <Option value={payTypeId}>{payTypeMap[payTypeId]}</Option>
                    );
                  })
                }
              </Select>
            </Col>
          </Row>
          {
            (+type === 1) &&
            <Row type="flex" align="top" style={{ marginTop: 10 }}>
              <Col style={{ marginRight: 15 }}>收货信息:</Col>
              <Col>
                <Col>收货人: <Input onChange={this.handleChangeItemSync.bind(this, 'consigneeName')} value={consigneeName} className={globalStyles['input-sift']} /></Col>
                <Col>手机号: <Input onChange={this.handleChangeItemSync.bind(this, 'mobile')} value={mobile} className={globalStyles['input-sift']} /></Col>
                <Col>收货地址: <Cascader options={area.data} onChange={this.handleChangeItemSync.bind(this, 'address')} value={address} className={globalStyles['input-sift']} /><Input placeholder="详细地址" onChange={this.handleChangeItemSync.bind(this, 'addressDetail')} value={addressDetail} className={globalStyles['input-sift']} /></Col>
              </Col>
            </Row>
          }
          <Row type="flex" align="top" style={{ marginTop: 10 }}>
            <Col style={{ marginRight: 15 }}>制单备注:</Col>
            <Col>
              <TextArea onChange={this.handleChangeItemSync.bind(this, 'remark')} value={remark} placeholder="客户需求背景，协商处理结果写到这里，方便主管对其审核相关业务事项。" style={{ width: 500 }} autosize={{ minRows: 2, maxRows: 26 }} />
            </Col>
          </Row>
          <Row style={{ marginTop: 20 }}>
            <Button loading={isSaveLoading} type="primary" onClick={this.handleSaveOrder.bind(this, allReturnNum)}>提交主管审核</Button>
            <Link to="/purchase/purchase-after-sale-order-list">
              <Button style={{ marginLeft: 10 }}>取消</Button>
            </Link>
          </Row>
        </Card>
        <Modal
        title="提示"
        visible={isShowModal}
        onCancel={this.handleCloseModal}
        onOk={this.handleConfirmCheck}
        >
          {
            isGift?"当前商品为赠品，赠品做售后，营业外收入会做相应的扣减。":"关联采购单已开票，请确认是否继续做售后？"
          }
        </Modal>
      </PageHeaderLayout>
    );
  }
}
