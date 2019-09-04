import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Debounce from 'lodash-decorators/debounce';
import { Row, Col, Form, Card, Table, Select, Button, Input, Checkbox, Radio, notification, message, Modal, Alert, Tooltip } from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './AfterSaleOrderAdd.less';

const RadioGroup = Radio.Group;
const { Option } = Select;


@connect(state => ({
  afterSaleOrderAdd: state.afterSaleOrderAdd,
}))
export default class AfterSaleOrderAdd extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    // const { id } = this.props.match.params;
    let id = null;
    let orderId = null;
    let userId = null;
    let orderSn = null;
    let type = null;
    if (this.props.location.query) {
      ({ orderId, userId, orderSn, type, id } = this.props.location.query);
    }
    dispatch({
      type: 'afterSaleOrderAdd/getConfig',
      payload: {
        orderId,
        userId,
        orderSn,
        id,
        backOrderType:type,
      },
    });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'afterSaleOrderAdd/unmount',
    });
  }
  getOrderTypeValue(value) {
    const { dispatch } = this.props;
    const { goodsInfos } = this.props.afterSaleOrderAdd;
    const goodsInfosAddType = goodsInfos.map((item) => {
      return {
        ...item,
        type: value,
      };
    });
    dispatch({
      type: 'afterSaleOrderAdd/getOrderTypeValue',
      payload: {
        type: value,
        goodsInfos: goodsInfosAddType,
      },
    });
  }
  // 选择退款方式
  handleChangeRefundType(value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'afterSaleOrderAdd/changeRefundType',
      payload: {
        value,
      },
    });
  }
  // 修改各商品售后数
  handleChangeBackNum(e, orderGoodsId) {
    const number = e.target.value;
    const { dispatch } = this.props;
    const { type, goodsInfos } = this.props.afterSaleOrderAdd;
    const reg = new RegExp('^[0-9]*$');
    if (!reg.test(number)) {
      return;
    }
    const goodsInfosAddType = goodsInfos.map((item) => {
      return {
        ...item,
        type,
      };
    });
    dispatch({
      type: 'afterSaleOrderAdd/getOrderTypeValue',
      payload: {
        type,
        goodsInfos: goodsInfosAddType,
      },
    });
    dispatch({
      type: 'afterSaleOrderAdd/changeBackNum',
      payload: {
        number,
        orderGoodsId,
        type,
      },
    });
  }
  // 修改各商品售后金额
  handleChangeReturnAmount(e, orderGoodsId) {
    const number = e.target.value;
    const { dispatch } = this.props;
    const { goodsInfos } = this.props.afterSaleOrderAdd;
    dispatch({
      type: 'afterSaleOrderAdd/changeReturnAmount',
      payload: {
        number,
        orderGoodsId,
      },
    });
  }
  // 删除商品
  handleDeleteGoods(orderGoodsId) {
    const { dispatch } = this.props;
    dispatch({
      type: 'afterSaleOrderAdd/deleteGoods',
      payload: {
        orderGoodsId,
      },
    });
  }
  // 是否协商退货金额
  handleChangeIsSpecial(e) {
    const { dispatch } = this.props;
    const isSpecialArr = [];
    if (e.target.checked) {
      isSpecialArr.push(1);
    } else {
      isSpecialArr.push(0);
    }
    dispatch({
      type: 'afterSaleOrderAdd/changeIsSpecial',
      payload: {
        isSpecial: isSpecialArr[0],
      },
    });
  }
  // 协商退款金额
  handleChangeSpecialPrice = (e) => {
    const { value } = e.target;
    const { dispatch } = this.props;
    dispatch({
      type: 'afterSaleOrderAdd/changeSpecialPrice',
      payload: {
        value,
      },
    });
  }
  // 选择订单号
  handleSelectOrder(orderId) {
    const { dispatch, afterSaleOrderAdd } = this.props;
    const { siftOrderInfos } = afterSaleOrderAdd;
    let orderInfo = [];
    for (let i = 0; i < siftOrderInfos.length; i += 1) {
      if (+siftOrderInfos[i].id === +orderId) {
        orderInfo = [Object.assign({}, siftOrderInfos[i])];
        break;
      }
    }
    dispatch({
      type: 'afterSaleOrderAdd/changeOrder',
      payload: {
        orderId,
        userId: orderInfo[0].userId,
      },
    });
  }
  // 搜索订单号
  @Debounce(200)
  handleSearchOrder(value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'afterSaleOrderAdd/searchOrderList',
      payload: {
        keywords: value,
        status: [1, 2, 3, 5],
      },
    });
  }
  // 更改退款信息
  handleChangeRefundInfo(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'afterSaleOrderAdd/changeRefundInfo',
      payload: {
        value: e.target.value,
      },
    });
  }
  // 更改制单备注
  handleChangeRemark(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'afterSaleOrderAdd/changeRemark',
      payload: {
        value: e.target.value,
      },
    });
  }
  // 选择是否退货
  handleChangeIsReturnRadio(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'afterSaleOrderAdd/changeIsReturnRadio',
      payload: {
        value: e.target.value,
      },
    });
  }
  handleCloseModal=()=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'afterSaleOrderAdd/configReducer',
      payload: {
        isShowModal:false,
      },
    });
  }
  // 提交主管审核
  handleClickSaveBtn() {
    const { dispatch, afterSaleOrderAdd } = this.props;
    const { orderInfos, isReturn, specialPrice, isSpecial, refundType, refundInfo, remark, goodsInfos, pageId, type, backOrderType, relateOutInvFollowList, orderId } = afterSaleOrderAdd;
    console.log("orderId",orderId)
    const goodsList = [];
    for (let i = 0; i < goodsInfos.length; i += 1) {
      const { orderGoodsId, backNumber, returnAmount } = goodsInfos[i];
      if (+backNumber > 0) {
        const obj = {
          orderGoodsId,
          backNumber,
          backAmount: returnAmount,
        };
        goodsList.push(obj);
      }
    }
    if (isSpecial && (specialPrice === '-1' || specialPrice === '')) {
      message.warning('勾选审批退款金额,值不能为空');
      return;
    }
    if (refundInfo === '') {
      notification.warning({
        message: '警告提示',
        description: '退款信息不能为空！',
      });
      return;
    }
    if (type === '') {
      message.warning('售后类型不能为空');
      return;
    }
    if (goodsList.length === 0) {
      notification.warning({
        message: '警告提示',
        description: '商品的退货数不能全为0！',
      });
      return;
    }
    if(backOrderType == 1&&relateOutInvFollowList.length>0) {
      dispatch({
        type:'afterSaleOrderAdd/configReducer',
        payload:{
          isShowModal:true,
          goodsList
        }
      })
    }else{
      if (pageId) {
        dispatch({
          type: 'afterSaleOrderAdd/clickSaveBtn',
          payload: {
            pageId,
            type,
            backOrderId: pageId,
            specialPrice,
            isSpecial,
            refundType,
            refundInfo,
            remark,
            goodsList,
            backOrderType,
            orderId
          },
        });
      } else {
        dispatch({
          type: 'afterSaleOrderAdd/clickSaveBtn',
          payload: {
            pageId,
            type,
            // orderId: orderInfos[0].id,
            specialPrice,
            isSpecial,
            refundType,
            refundInfo,
            remark,
            goodsList,
            backOrderType,
            orderId
          },
        });
      }
    }
  }
  handleConfirmCheck=()=>{
    const { dispatch, afterSaleOrderAdd } = this.props;
    const { orderInfos, specialPrice, isSpecial, refundType, refundInfo, remark, pageId, type,  goodsList } = afterSaleOrderAdd;
    if (pageId) {
      dispatch({
        type: 'afterSaleOrderAdd/clickSaveBtn',
        payload: {
          pageId,
          type,
          backOrderId: pageId,
          specialPrice,
          isSpecial,
          refundType,
          refundInfo,
          remark,
          goodsList,
          backOrderType
        },
      });
    } else {
      dispatch({
        type: 'afterSaleOrderAdd/clickSaveBtn',
        payload: {
          pageId,
          type,
          orderId: orderInfos[0].id,
          specialPrice,
          isSpecial,
          refundType,
          refundInfo,
          remark,
          goodsList,
          backOrderType
        },
      });
    }
  }

  render() {
    const {
      afterSaleOrderAdd: {
        siftOrderInfos,
        orderInfos,
        goodsInfos,
        refundTypeMap,
        orderTypeMap,
        refundType,
        refundInfo,
        isReturn,
        pageId,
        specialPrice,
        isSpecial,
        remark,
        isLoading,
        type,
        backOrderType,
        isShowModal,
        relateOutInvFollowList,
      },
    } = this.props;
    const allSubtotal = goodsInfos&&goodsInfos.reduce((pre, next) => {
      return pre + +next.subtotal;
    }, 0);

    const allBackNumber =goodsInfos&&goodsInfos.reduce((pre, next) => {
      return pre + +next.backNumber;
    }, 0);

    const allReturnAmount = goodsInfos&&goodsInfos.reduce((pre, next) => {
      return pre + (+next.returnAmount);
    }, 0);
    // const allReturnAmount = goodsInfos.reduce((pre, next) => {
    //   return pre + (+next.backNumber * +next.price);
    // }, 0);

    // table 的列头数据
    const columns = [
      {
        dataIndex: 'no',
        key: 'no',
        width: 50,
        render: (no, record, index) => (
          <span>{ no || index + 1}</span>
        ),
      }, {
        // title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: 50,
        render: (op, record) => {
          if (record.no) {
            return null;
          }
          if (record.isNotGoods) {
            return {
              children: <span>hehehehehe</span>,
              props: {
                colSpan: 0,
              },
            };
          }
          return (
            <div>
              {!record.isNotGoods && <Button icon="minus" onClick={() => { this.handleDeleteGoods(record.orderGoodsId); }} />}
            </div>);
        },
      },
      {
        title: '主图',
        dataIndex: 'goodsThumb',
        key: 'goodsThumb',
        width: 60,
        render: (goodsThumb, record) => {
          if (record.isNotGoods) {
            return {
              children: <span>hehehehehe</span>,
              props: {
                colSpan: 0,
              },
            };
          }
          return <img className={styles.goodsImg} src={goodsThumb} />;
        },
      }, {
        title: '商品名称',
        dataIndex: 'goodsName',
        key: 'goodsName',
        width: 300,
        render: (goodsName, record) => {
          if (record.isNotGoods) {
            return {
              children: <span>hehehehehe</span>,
              props: {
                colSpan: 0,
              },
            };
          } else {
            return {
              children: <span>{goodsName}</span>,
              props: {
                colSpan: 1,
              },
            };
          }
        },
      }, {
        title: '商品条码',
        dataIndex: 'goodsSn',
        key: 'goodsSn',
        width: 150,
        render: (goodsSn, record) => {
          if (record.isNotGoods) {
            return {
              children: <span>hehehehehe</span>,
              props: {
                colSpan: 0,
              },
            };
          } else {
            return {
              children: <span>{goodsSn}</span>,
              props: {
                colSpan: 1,
              },
            };
          }
        },
      }, {
        title: '单位',
        dataIndex: 'unit',
        key: 'unit',
        width: 60,
        render: (unit, record) => {
          if (record.isNotGoods) {
            return {
              children: <span>hehehehehe</span>,
              props: {
                colSpan: 0,
              },
            };
          }
          return <span>{unit}</span>;
        },
      },
      {
        title: '是否含税',
        dataIndex: 'isTax',
        key: 'isTax',
        width: 100,
        render: (isTax, record) => {
          if (record.isNotGoods) {
            return {
              children: <span>hehehehehe</span>,
              props: {
                colSpan: 0,
              },
            };
          }
          return <span>{+isTax ? '是' : '否'}</span>;
        },
      },
      {
        title: '单价',
        dataIndex: 'price',
        key: 'price',
        width: 120,
        render: (price, record) => {
          if (record.isNotGoods) {
            return {
              children: <span>hehehehehe</span>,
              props: {
                colSpan: 0,
              },
            };
          }
          return <span>{price}</span>;
        },
      }, 
        {
        title: backOrderType==1?"剩余可退数(开票后)":"剩余可退数(开票前)",
        dataIndex: 'waitInvoiceRestReturnNum',
        key: 'waitInvoiceRestReturnNum',
        width: 140,
        render: (waitInvoiceRestReturnNum, record) => {
          if (record.isNotGoods) {
            return {
              children: <div style={{ width: '100%', textAlign: 'right', fontSize: '14px', fontWeight: '700', color: '#A1A1A1' }}>总计</div>,
              props: {
                colSpan: 8,
              },
            };
          }
          return <Tooltip
          title={<div>
            <div>原下单数量:{record.totalNum}</div>
            {
              backOrderType==0?<div>
              <div>未开票数量：{record.waitInvoiceNum}</div>
              <div>未开票售后数量：{record.waitInvoiceBackNum}</div>
              <div>开票前剩余可退数量：{waitInvoiceRestReturnNum}</div>
              </div>:<div>
                <div>已开票数量：{record.invoicedNum}</div>
                <div>已开票售后数量：{record.invoicedBackNum}</div>
                <div>开票后剩余可退数量：{record.invoicedRestReturnNum}</div>
              </div>
            }
          </div>}
          ><span>{backOrderType==0?waitInvoiceRestReturnNum:record.invoicedRestReturnNum}</span></Tooltip>;
        },
      },
      {
        title: '小计（元）',
        dataIndex: 'subtotal',
        key: 'subtotal',
        width: 150,
        render: (subtotal, record) => {
          if (record.isNotGoods && allSubtotal) {
            return allSubtotal.toFixed(2);
          }
          if (record.isNotGoods && !allSubtotal) {
            return null;
          }
          return subtotal;
        },
      },
      {
        title: '售后数量',
        dataIndex: 'backNumber',
        key: 'backNumber',
        render: (backNumber, record) => {
          if (record.isNotGoods && allBackNumber) {
            return allBackNumber;
          }
          if (record.isNotGoods && !allBackNumber) {
            return null;
          }
          if (+record.type === 3) {
            return <span>0</span>;
          }
          return (
            <Input value={backNumber} onChange={event => this.handleChangeBackNum(event, record.orderGoodsId)} />
          );
        },
      },
      {
        title: '售后金额',
        dataIndex: 'returnAmount',
        key: 'returnAmount',
        render: (returnAmount, record) => {
          if (record.isNotGoods && allReturnAmount) {
            return allReturnAmount.toFixed(2);
          }
          if (record.isNotGoods && !allReturnAmount) {
            return null;
          }
          if (+record.type === 0 || +record.type === 1 || +record.type === 3) {
            return <span>{(+record.backNumber * +record.price).toFixed(2)}</span>;
          }
          if (+record.type === 2) {
            return <Input value={returnAmount} onChange={event => this.handleChangeReturnAmount(event, record.orderGoodsId)} />;
          }
        },
      },
      // {
      //   title: '退货数',
      //   dataIndex: 'backNumber',
      //   key: 'backNumber',
      //   width: 80,
      //   render: (backNumber, record) => {
      //     if (record.isNotGoods && allBackNumber) {
      //       return allBackNumber;
      //     }
      //     if (record.isNotGoods && !allBackNumber) {
      //       return null;
      //     }
      //     return (
      //       <Input value={backNumber} onChange={event => this.handleChangeBackNum(event, record.orderGoodsId)} />
      //     );
      //   },
      // },
      // {
      //   title: '退货金额',
      //   dataIndex: 'returnAmount',
      //   key: 'returnAmount',
      //   width: 80,
      //   render: (returnAmount, record) => {
      //     if (record.isNotGoods && allReturnAmount) {
      //       return allReturnAmount.toFixed(2);
      //     }
      //     if (record.isNotGoods && !allReturnAmount) {
      //       return null;
      //     }
      //     return <span>{(+record.backNumber * +record.price).toFixed(2)}</span>;
      //   },
      // },
    ];

    return (
      <PageHeaderLayout title={pageId ? (backOrderType==0?"修改正常售后单":"修改开票后售后单") : (backOrderType==0?"新建正常售后单":"新建开票后售后单")} className={styles.addPageHeader}>
        <div
        style={{background:"#fff0f0",height:40,marginBottom:10,color:"red",fontWeight:"bold",padding:10}}
        >
        注：直发商品和非直发商品需分开建售后单。
        </div>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={24} sm={24} style={{ marginBottom: 24 }}>
                  {
                    <span>
                      <span><span style={{ color: 'red' }}>*</span>关联销售单号</span>
                      <Select
                        showSearch
                        style={{ width: 240, marginLeft: '25px' }}
                        placeholder="请输入关联订单号进行搜索"
                        optionFilterProp="children"
                        disabled={!!pageId && true}
                        onSelect={this.handleSelectOrder.bind(this)}
                        onSearch={this.handleSearchOrder.bind(this)}
                        // onFocus={this.handleSearchUsersFocus.bind(this)}
                        // onBlur={this.handleSearchUsersBlur.bind(this)}
                        filterOption={false}
                        value={orderInfos.length > 0 ? orderInfos[0].orderSn : null}
                      >
                        {
                          siftOrderInfos ?
                            siftOrderInfos.map((order) => {
                              return <Option key={order.id} value={order.id}>{order.orderSn}</Option>;
                            })
                          :
                            <Option disabled key="no fount">没发现匹配项</Option>
                        }
                      </Select>
                      <span style={{ display: 'inline-block', marginBottom: '5px', verticalAlign: 'middle', marginLeft: 30 }} >
                        售后类型
                      </span>
                      <span style={{ marginLeft: 30 }}>
                        <Select
                          value={orderTypeMap[type]}
                          placeholder="请选择售后类型"
                          style={{ width: 200 }}
                          onChange={this.getOrderTypeValue.bind(this)}
                        >
                          {
                            Object.keys(orderTypeMap).map(
                              item => (
                                <Option
                                  key={item}
                                  value={item}
                                >
                                  {orderTypeMap[item]}
                                </Option>
                                )
                              )
                            }
                        </Select>
                      </span>
                      <span style={{ marginLeft: '10px', color: '#ccc' }}>注意：先关联单号，再选售后类型</span>
                    </span>
                  }
                </Col>
                {/* <Col md={12} sm={24} style={{ marginBottom: 24 }}>
                  {
                    <span>
                      <span style={{ marginRight: '20px' }}>是否退货</span>
                      <RadioGroup onChange={this.handleChangeIsReturnRadio.bind(this)} value={isReturn ? 1 : 0}>
                        <Radio value={0}>否</Radio>
                        <Radio value={1}>是</Radio>
                      </RadioGroup>
                    </span>
                  }
                </Col> */}
              </Row>
              {
                orderInfos.length > 0 ?
                  <Row style={{ marginBottom: 20 }}>
                    <div style={{ display: 'inline-block', marginRight: 20 }}>客户:{orderInfos[0].customer}</div>
                    <div style={{ display: 'inline-block', marginRight: 20 }}>手机号:{orderInfos[0].mobile}</div>
                    <div style={{ display: 'inline-block', marginRight: 20 }}>业务员:{orderInfos[0].saler}</div>
                  </Row>
                :
                ''
              }
              {
                backOrderType==1&&relateOutInvFollowList.length>0?<Row style={{marginBottom:10}}>
                <Alert
                  message={<div>
                    <span>关联采购单为已开票订单，请谨慎做售后操作。 关联来票号:</span>
                    {
                      relateOutInvFollowList.map(item=>(
                        <Link to={``} key={item.inInvSn}>{`${item.inInvSn} / `}</Link>
                      ))
                    }
                  </div>}
                  type="warning"
                  />
                </Row>:""
              }
            </div>
            <Table
              bordered
              loading={isLoading}
              rowKey={record => record.orderGoodsId}
              dataSource={goodsInfos.concat([{ orderGoodsId: goodsInfos.length * 10000000, id: '总计', isNotGoods: true }])}
              columns={columns}
              pagination={false}
              footer={() => (
                [
                  <Row type="flex" align="middle" justify="end" style={{ marginTop: 20, marginBottom: 20 }}>
                    <Checkbox checked={!!isSpecial} onChange={this.handleChangeIsSpecial.bind(this)}>已通过协商,申请获批退款金额</Checkbox>
                    <Input
                      size="small"
                      style={{ width: 80, marginRight: 10 }}
                      disabled={!isSpecial}
                      value={(specialPrice === '-1') ? '' : specialPrice}
                      onChange={this.handleChangeSpecialPrice.bind(this)}
                    />元
                  </Row>,
                  <Row type="flex" align="middle" justify="end">
                    <span style={{ marginLeft: '24px' }}>应退总额: ￥</span>
                    <span style={{ fontWeight: 'bold', color: '#f36' }}>{!isSpecial ? Number(allReturnAmount).toFixed(2) : (specialPrice === '-1' ? 0.00 : specialPrice)}</span>
                  </Row>,
                ]
              )}
            />


            <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginTop: 20, background: 'rgb(240, 242, 245)' }}>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginTop: 20 }}>
                <Col md={24}>
                  <Row style={{ marginBottom: 14 }}>
                    <span style={{ display: 'inline-block', marginBottom: 5, verticalAlign: 'top' }}>
                    退款方式
                    </span>
                    <span style={{ marginLeft: 30 }}>
                      <Select
                        size="small"
                        style={{ width: 200, display: 'inline-block' }}
                        value={refundTypeMap[refundType] || ''}
                        onChange={this.handleChangeRefundType.bind(this)}
                      >
                        {
                          (Object.entries(refundTypeMap).map((value) => {
                            return <Option key={value[0]}>{value[1]}</Option>;
                          }))
                        }
                      </Select>
                    </span>
                  </Row>
                </Col>
              </Row>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginTop: 20 }}>
                <Col md={24}>
                  <Row style={{ marginBottom: 14 }}>
                    <span style={{ display: 'inlinelock', marginBottom: 5, verticalAlign: 'top' }}>
                    退款账户
                    </span>
                    <Input.TextArea
                      onChange={this.handleChangeRefundInfo.bind(this)}
                      value={refundInfo}
                      placeholder="请填写客户收款账户"
                      style={{ width: '100%', border: '1px solid #BCBCBC' }}
                      autosize={{ minRows: 2, maxRows: 6 }}
                    />
                  </Row>
                </Col>
              </Row>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginTop: 20 }}>
                <Col md={24}>
                  <Row style={{ marginBottom: 14 }}>
                    <span style={{ display: 'inlinelock', marginBottom: 5, verticalAlign: 'top' }}>
                    退款备注
                    </span>
                    <Input.TextArea
                      onChange={this.handleChangeRemark.bind(this)}
                      value={remark}
                      placeholder="请填写退货原因"
                      style={{ width: '100%', border: '2px dashed #BCBCBC' }}
                      autosize={{ minRows: 2, maxRows: 6 }}
                    />
                  </Row>
                </Col>
              </Row>
            </Row>

            <div className={styles.fixed}>
              <span className={styles.saveBtn} onClick={this.handleClickSaveBtn.bind(this)}>提交主管审核</span>
              <Link to="/sale/after-sale-order-list" className={styles.cancelBtn}>取消</Link>
            </div>
          </div>
        </Card>
        <Modal
        title="提示"
        visible={isShowModal}
        onCancel={this.handleCloseModal}
        onOk={this.handleConfirmCheck}
        >
          关联采购单已开票，请确认是否继续做售后？
        </Modal>
      </PageHeaderLayout>
    );
  }
}
