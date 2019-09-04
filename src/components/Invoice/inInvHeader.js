import React from 'react';
import { Card, Row, Col, Table, Input, DatePicker, Button, message, Icon, Radio, Modal, Popconfirm } from 'antd';
import { connect } from 'dva';
import moment from 'moment';

const RadioGroup = Radio.Group;
@connect(state => ({
  purchaseInInvFollowDetail: state.purchaseInInvFollowDetail,
  financePurchaseInInvDetail: state.financePurchaseInInvDetail,
}))
export default class InInvHeader extends React.Component {
    state={
      isEditorShopping: false,
      isEditorOk: true,
      shippingNo: '',
      remark: '',
      isChange: false,
      copy: [],
      isEditorRemark: false,
      isEditorPurchase: false,
      purchaseRemark: '',
      isSuitDetail: -1,
    }
    componentWillMount = () => {
    //   console.log(this.props);
    //   const invArr = JSON.parse(JSON.stringify(this.state.list));
    //   invArr.forEach((item) => {
    //     item.isEditor = false;
    //   });
    //   this.setState({
    //     copy: invArr,
    //   });
    }

    componentDidMount() {
      const { incomeInvoiceList, isSuitDetail } = this.props.purchaseInInvFollowDetail;
      // const { incomeInvoiceList } = nextProps.financePurchaseInInvDetail
      const invArr = JSON.parse(JSON.stringify(incomeInvoiceList));
      invArr.forEach((item) => {
        item.isEditor = false;
      });
      this.setState({
        copy: invArr,
        isSuitDetail,
      });
    }
    componentWillReceiveProps(nextProps) {
      console.log('变化', nextProps);

      if (nextProps.purchaseInInvFollowDetail.incomeInvoiceList.length !== this.props.purchaseInInvFollowDetail.incomeInvoiceList.length) {
        const { incomeInvoiceList } = nextProps.purchaseInInvFollowDetail;
        // const { incomeInvoiceList } = nextProps.financePurchaseInInvDetail
        const invArr = JSON.parse(JSON.stringify(incomeInvoiceList));
        invArr.forEach((item) => {
          item.isEditor = false;
        });
        this.setState({
          copy: invArr,
        });
      }
    }
  // 是否对应明细
 onChangeIsSuitDetail = (e) => {
   const { dispatch } = this.props;
  //  this.setState({
  //    isSuitDetail: e.target.value,
  //  });
   dispatch({
     type: 'purchaseInInvFollowDetail/onChangeIsSuitDetail',
     payload: {
       isSuitDetail: e.target.value,
     },
   });
 }
 invoiceInput(type, e, dataStrings) {
   const { dispatch } = this.props;
   switch (type) {
     case 'invAmount':
     case 'invSn':
       dispatch({
         type: 'purchaseInInvFollowDetail/changeConfig',
         payload: {
           [type]: e.target.value,
         },
       });
       break;
     case 'invDate':
       dispatch({
         type: 'purchaseInInvFollowDetail/changeConfig',
         payload: {
           [type]: dataStrings,
         },
       });
       break;
     default:
       break;
   }
 }
    // 编辑物流
    editorShippingOpen=(shippingNo) => {
      console.log(shippingNo);
      this.setState(prevstate => ({ isEditorShopping: !prevstate.isEditorShopping, shippingNo }));
    }
    // 编辑 备注
    editorRemarkOpen=(remark) => {
      console.log(remark);
      this.setState(prevstate => ({ isEditorRemark: !prevstate.isEditorRemark, remark }));
    }
    // 编辑采购备注
    editorPurchaseOpen=(purchaseRemark) => {
      console.log(purchaseRemark);
      this.setState(prevstate => ({ isEditorPurchase: !prevstate.isEditorPurchase, purchaseRemark }));
    }
    editorShippingOk=() => {
      const { dispatch } = this.props;
      if (this.state.isChange) {
        console.log('编辑了');
        dispatch({
          type: 'purchaseInInvFollowDetail/editorShippingOk',
          payload: {
            shippingNo: this.state.shippingNo,
          },
        });
        this.setState({
          isChange: false, // 如果多个同时开启 修改完一个之后又去修改另一个，然后没有修改接下来修改的直接点提交有bug，需要定义多个变量
        });
      }
      this.setState(prevstate => ({ isEditorShopping: !prevstate.isEditorShopping }));
    }
    editorRemarkOk=() => {
      console.log(this.state.remark);
      const { dispatch } = this.props;
      if (this.state.isChange) {
        console.log('编辑了');
        dispatch({
          type: 'purchaseInInvFollowDetail/editorRemarkOk',
          payload: {
            remark: this.state.remark,
          },
        });
        this.setState({
          isChange: false, // 如果多个同时开启 修改完一个之后又去修改另一个，然后没有修改接下来修改的直接点提交有bug，需要定义多个变量
        });
      }
      this.setState(prevstate => ({ isEditorRemark: !prevstate.isEditorRemark }));
    }
    editorPurchaseOk=() => {
      const { dispatch } = this.props;
      if (this.state.isChange) {
        console.log('编辑了');
        dispatch({
          type: 'purchaseInInvFollowDetail/editorPurchaseOk',
          payload: {
            purchaseRemark: this.state.purchaseRemark,
          },
        });
        this.setState({
          isChange: false, // 如果多个同时开启 修改完一个之后又去修改另一个，然后没有修改接下来修改的直接点提交有bug，需要定义多个变量
        });
      }
      this.setState(prevstate => ({ isEditorPurchase: !prevstate.isEditorPurchase }));
    }
    editorShippingNo=(e) => {
      console.log('每次都有编辑？');
      this.setState({
        shippingNo: e.target.value,
        isChange: true,
      });
    }
    editorRemark=(e) => {
      this.setState({
        remark: e.target.value,
        isChange: true,
      });
    }
    editorPurchaseRemark=(e) => {
      this.setState({
        purchaseRemark: e.target.value,
        isChange: true,
      });
    }
    editorInput=(type, id, e, dataStrings) => {
      this.state.copy.map((item) => {
        if (item.id === id) {
          switch (type) {
            case 'invAmount':
            case 'invSn':
              item[type] = e.target.value;
              break;
            case 'invDate':
              item[type] = dataStrings;
              break;
            default:
              break;
          }
        }
      });

      this.setState(prevstate => ({ copy: prevstate.copy }));
    }


    // 确定事件
    invInputOk=() => {
      const { dispatch, purchaseInInvFollowDetail, id } = this.props;
      const { invAmount, invSn, invDate } = purchaseInInvFollowDetail;

      if (!invAmount) {
        message.warning('请填写发票金额后进行确认');
        return;
      }
      if (!invSn) {
        message.warning('请填写发票号后进行确认');
        return;
      }
      if (!invDate) {
        message.warning('请填写发票日期后进行确认');
        return;
      }
      dispatch({
        type: 'purchaseInInvFollowDetail/invInputOk',
        payload: {
          invAmount, invSn, invDate, incomeInvOrderId: id,
        },
      });
      this.setState(prevstate => ({ isEditor: !prevstate.isEditor }));
    }
    // 编辑事件
    editor=(id) => {
      this.state.copy.map((item) => {
        if (item.id === id) {
          item.isEditor = true;
        }
      });
      this.setState(prevstate => ({ copy: prevstate.copy }));
    }
    editorOk=(id) => {
      const { dispatch } = this.props;
      console.log('修改后的', this.state.copy);
      const res = this.state.copy.map((item) => {
        if (item.id === id) {
          item.isEditor = false;
          dispatch({
            type: 'purchaseInInvFollowDetail/editorOk',
            payload: {
              invoiceId: item.id,
              invAmount: item.invAmount,
              invSn: item.invSn,
              invDate: item.invDate,
            },
          });
        }
      });
      this.setState((prevstate) => {
        return ({ copy: prevstate.copy });
      });
    }
    delete=(id) => {
      const { dispatch } = this.props;
      dispatch({
        type: 'purchaseInInvFollowDetail/delete',
        payload: {
          invId: id,
        },
      });
    }
    ySuitDetail=() => {
      const { dispatch, purchaseInInvFollowDetail } = this.props;
      const { detail, incomeInvoiceList } = purchaseInInvFollowDetail;
      console.log('所有的数据', detail, incomeInvoiceList);
      detail.forEach((item) => {
        item.editable = false;
      });
      dispatch({
        type: 'financePurchaseInInvDetail/ySuitDetail',
        payload: {
          detail,
          incomeInvoiceList,
          isSuitDetailMask: true,
        },
      });
    }
    nSuitDetail=() => {
      const { dispatch, purchaseInInvFollowDetail } = this.props;
      const { incomeInvoiceList } = purchaseInInvFollowDetail;
      dispatch({
        type: 'financePurchaseInInvDetail/nSuitDetail',
        payload: {
          incomeInvoiceList,
          notSuitDetailMask: true,
        },
      });
    }
    handleClickActionPopUP=(url, name, backUrl) => {
      const { dispatch } = this.props;
      console.log('默认的按钮', url, name, backUrl);
      dispatch({
        type: 'purchaseInInvFollowDetail/changeConfig',
        payload: {
          url,
          isShowActionModal: true,
          backUrl,
        },
      });
    }
    // handleTriggerActionModal=() => {
    //   const { dispatch } = this.props;
    //   dispatch({
    //     type: 'purchaseInInvFollowDetail/changeConfig',
    //     payload: {
    //       url: '',
    //       isShowActionModal: false,
    //       backUrl: '',
    //     },
    //   });
    // }
    confirmActionList=(url, backUrl) => {
      const { dispatch } = this.props;
      dispatch({
        type: 'purchaseInInvFollowDetail/aboutActionList',
        payload: {
          url,
          backUrl,
        },
      });
    }
    render() {
      const { purchaseInInvFollowDetail: {
        status,
        incomeInvOrderSn,
        supplierName,
        purchaserName,
        createTime,
        shouldInvAmount,
        historyInvAmount,
        realInvAmount,
        debtInvAmount,
        invoiceNum,
        shippingNo,
        remark,
        detail,
        isLoading,
        purchaseRemark,
        isSuitDetail,
        canEdit,
        invAmount,
        invSn,
        invDate,
        actionList,
        isShowActionModal,
      },

      } = this.props;
      const column = [
        {
          title: '采购单号',
          dataIndex: 'purchaseOrderSn',
          key: 'purchaseOrderSn',
        },
        {
          title: '采购时间',
          dataIndex: 'purchaseDate',
          key: 'purchaseDate',
        },
        {
          title: '商品名称',
          dataIndex: 'goodsName',
          key: 'goodsName',
          render: (goodsName, record) => {
            return (
              [record.tag && record.tag.map((item) => {
                return <span key={item} style={{ background: item.color }}>{item.name}</span>;
              }),
                <span>{ goodsName }</span>,
              ]
            );
          },
        }, {
          title: '条码',
          dataIndex: 'goodsSn',
          key: 'goodsSn',
        }, {
          title: '采购价',
          dataIndex: 'price',
          key: 'price',
        },
        {
          title: '采购数量',
          dataIndex: 'num',
          key: 'num',
        }, {
          title: '采购合计',
          dataIndex: 'taxAmount',
          key: 'taxAmount',
          render: (taxAmount, record) => {
            return ([
              (<span style={{ color: 'red' }}>{taxAmount} </span>),
            ]);
          },
        }, {
          title: '贷款申请单号',
          dataIndex: 'outcomeApplyId',
          key: 'outcomeApplyId',
        },
        {
          title: '付款日期',
          dataIndex: 'payTime',
          key: 'payTime',
        },
      ];
      return (
        <Card>
          <div style={{ background: '#f2f2f2', padding: 20, marginBottom: 30 }}>
            <Row style={{ marginTop: 10 }}>
              <Col span={2}>状态：<span style={{ color: 'red', fontWeight: 'bold' }}>{status}</span></Col>
              <Col span={4}>来票单号：<span style={{ fontWeight: 'bold' }}>{incomeInvOrderSn}</span></Col>
              <Col span={6}>供应商：<span style={{ fontWeight: 'bold' }}>{supplierName}</span></Col>
              <Col span={3}>采购员：<span style={{ fontWeight: 'bold' }}>{purchaserName}</span></Col>
              <Col span={4}>创建时间：<span style={{ fontWeight: 'bold' }}>{createTime}</span></Col>
              <Col span={5}>
                {actionList.map((actionInfo) => {
                switch (+actionInfo.type) {
                  case 2:
                    return (
                      <a
                        href={actionInfo.url}
                        target="_blank"
                        key={actionInfo.name}
                      >
                        <Button style={{ marginLeft: 10 }}>{actionInfo.name}</Button>
                      </a>
                    );
                default:
                 return (
                   <Popconfirm title={`是否确定做${actionInfo.name}操作?`} onConfirm={this.confirmActionList.bind(this, actionInfo.url, actionInfo.backUrl)} onCancel={this.cancelActionList} okText="确定" cancelText="取消">
                     <Button
                       type="primary"
                       style={{ marginLeft: 10 }}
                      //  onClick={this.handleClickActionPopUP.bind(this, actionInfo.url, actionInfo.name, actionInfo.backUrl)}
                     >
                       {actionInfo.name}
                     </Button>
                   </Popconfirm>
                );
                }
              }
                  )}
              </Col>
            </Row>
            <Row style={{ marginTop: 10 }}>
              <Col span={6}>应开票总额：<span style={{ fontWeight: 'bold' }}><span style={{ color: 'red' }}>{shouldInvAmount}</span>(含未开：{historyInvAmount})</span></Col>
              <Col span={4}>实际开票总额：<span style={{ fontWeight: 'bold' }}>{realInvAmount}</span></Col>
              <Col span={3}>未开金额：<span style={{ color: 'red', fontWeight: 'bold' }}>{debtInvAmount}</span></Col>
              <Col span={3}>发票张数：<span style={{ color: 'red', fontWeight: 'bold' }}>{invoiceNum}</span></Col>
            </Row>
            <Row style={{ marginTop: 10 }}>
              <Col span={6}>物流单号：{ this.state.isEditorShopping ? <Input value={this.state.shippingNo} style={{ width: 160 }} onChange={this.editorShippingNo.bind(this)} /> : <span style={{ fontWeight: 'bold' }}> {this.state.shippingNo ? this.state.shippingNo : shippingNo}</span> }  </Col>
              { canEdit === 1 ? (!this.state.isEditorShopping ? <Col span={1}>   <Icon type="edit" style={{ fontSize: 18 }} onClick={this.editorShippingOpen.bind(this, this.state.shippingNo ? this.state.shippingNo : shippingNo)} /></Col>
             : <Col span={2}> <Button onClick={this.editorShippingOk.bind(this)} > 确定</Button></Col>) : null}
              <Col span={4}>备注：{ this.state.isEditorRemark ? <Input value={this.state.remark} style={{ width: 160 }} onChange={this.editorRemark.bind(this)} /> : <span style={{ fontWeight: 'bold' }}> {this.state.remark ? this.state.remark : remark}</span> }  </Col>
              { canEdit === 1 ? (!this.state.isEditorRemark ? <Col span={1}>   <Icon type="edit" style={{ fontSize: 18 }} onClick={this.editorRemarkOpen.bind(this, this.state.remark ? this.state.remark : remark)} /></Col>
            : <Col span={2}> <Button onClick={this.editorRemarkOk.bind(this)} > 确定</Button></Col>) : null}
            </Row>
            <Row style={{ marginTop: 10 }}>
              {
                  this.state.copy.map((item, index) => {
                      return (
                        <Col key={index} style={{ marginTop: 6 }} span={24}>
                          <Row>
                            <Col span={6}>发票金额：{ item.isEditor ? <Input defaultValue={item.invAmount} style={{ width: 160 }} onChange={this.editorInput.bind(this, 'invAmount', item.id)} /> : <span style={{ fontWeight: 'bold' }}>{item.invAmount}</span> }</Col>
                            <Col span={5}>发票号：{ item.isEditor ? <Input defaultValue={item.invSn} style={{ width: 160 }} onChange={this.editorInput.bind(this, 'invSn', item.id)} /> : <span style={{ fontWeight: 'bold' }}> {item.invSn}</span> }</Col>
                            <Col span={6}>发票日期：{item.isEditor ? <DatePicker defaultValue={moment(item.invDate)} onChange={this.editorInput.bind(this, 'invDate', item.id)} /> : <span style={{ fontWeight: 'bold' }}>{item.invDate}</span>}</Col>
                            {canEdit === 1 ? (item.isEditor ?
                              <Col span={2}> <Button onClick={this.editorOk.bind(this, item.id)} > 确定</Button></Col>
                          : <Col span={1}>   <Icon type="edit" style={{ fontSize: 18 }} onClick={this.editor.bind(this, item.id)} /></Col>) : null }
                            {canEdit === 1 ? <Col span={1}><Icon type="delete" style={{ fontSize: 18 }} onClick={this.delete.bind(this, item.id)} /> </Col> : null }
                          </Row>
                        </Col>
                      );
                  })
                }
              {canEdit === 1 ? (
                <Col style={{ marginTop: 6 }} span={24}>
                  <Row>
                    <Col span={6}>发票金额：<Input style={{ width: 160 }} value={invAmount} onChange={this.invoiceInput.bind(this, 'invAmount')} /></Col>
                    <Col span={5}>发票号：<Input style={{ width: 160 }} value={invSn} onChange={this.invoiceInput.bind(this, 'invSn')} /></Col>
                    <Col span={6}>发票日期：<DatePicker defaultValue={moment(invDate)} onChange={this.invoiceInput.bind(this, 'invDate')} /></Col>
                    <Col span={2}><Button onClick={this.invInputOk} >确定</Button></Col>
                  </Row>
                </Col>)
               : null }
            </Row>
            <Row style={{ marginTop: 10 }}>
              {canEdit === 1 ?
                <Col span={6}>是否对应明细：
                  <RadioGroup onChange={this.onChangeIsSuitDetail} value={isSuitDetail}>
                    <Radio value={1}>是</Radio>
                    <Radio value={0}>否</Radio>
                  </RadioGroup>
                </Col>
                : <Col span={6}>是否对应明细：<span style={{ fontWeight: 'bold' }}>{isSuitDetail === 1 ? '是' : '否'}</span> </Col>}
              <Col span={8}>采购备注：{ this.state.isEditorPurchase ? <Input value={this.state.purchaseRemark} style={{ width: 260 }} onChange={this.editorPurchaseRemark.bind(this)} /> : <span style={{ fontWeight: 'bold' }}> {this.state.purchaseRemark ? this.state.purchaseRemark : purchaseRemark}</span> }  </Col>
              { canEdit === 1 ? (!this.state.isEditorPurchase ? <Col span={1}>   <Icon type="edit" style={{ fontSize: 18 }} onClick={this.editorPurchaseOpen.bind(this, this.state.purchaseRemark ? this.state.purchaseRemark : purchaseRemark)} /></Col>
            : <Col span={2}> <Button onClick={this.editorPurchaseOk.bind(this)} > 确定</Button></Col>) : null}
            </Row>
          </div>
          <Table
            bordered
            loading={isLoading}
            dataSource={detail}
            columns={column}
            pagination={false}
          />
          {status === '待入库' ? (
            <Row style={{ marginTop: 10 }} >
              <Col span={3}><Button type="primary" onClick={this.ySuitDetail.bind(this)} >对应明细分票</Button> </Col>
              <Col><Button type="primary" onClick={this.nSuitDetail} >不对应明细分票</Button> </Col>
            </Row>
                              ) : null}


        </Card>
      );
    }
}
