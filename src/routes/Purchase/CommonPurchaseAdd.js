import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Debounce from 'lodash-decorators/debounce';
import { Row, Col, Card, Input, Select, Button, Modal, Table, Checkbox, Radio, DatePicker, message, Tooltip, Icon, Alert, AutoComplete } from 'antd';
import moment from 'moment';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './CommonPurchaseAdd.less';
import img from '../../assets/u2741.png';
import globalStyles from '../../assets/style/global.less';
import findIndex from 'lodash/findIndex';

const { Option } = Select;
const RadioGroup = Radio.Group;
const {TextArea} = Input;

@connect(state => ({
  commonPurchaseAdd: state.commonPurchaseAdd,
  user: state.user,
}))
export default class CommonPurchaseAdd extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    const { id } = this.props.match.params;
    // 如果有 id 证明为修改订单, 否则为新增订单
    if (id) {
      dispatch({
        type: 'commonPurchaseAdd/mount',
        payload: {
          id,
        },
      });
    } else {
      dispatch({
        type: 'commonPurchaseAdd/mount',
        payload: {},
      });
    }
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseAdd/unmount',
    });
  }
  // 选择商品
  handleSelectGoods(isGift = false, goodsId) {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseAdd/changeGoods',
      payload: {
        goodsId,
        isGift,
      },
    });
  }
  // 确认删除, 修改订单时有效
  // 删除列表中的商品
  handleDeleteGoods(goodsId, rowId, isGift = false) {
    const { dispatch } = this.props;
    const isEdit = !!this.props.match.params.id;
    // if (isEdit) {
    //   dispatch({
    //     type: 'commonPurchaseAdd/clickDeleteGoodsButton',
    //     payload: {
    //       goodsId,
    //       rowId,
    //       isGift,
    //     },
    //   });
    // } else {
      dispatch({
        type: 'commonPurchaseAdd/deleteGoods',
        payload: {
          goodsId,
          isGift,
        },
      });
    // }
  }
  handleChangeIsTax=(e)=>{
    const { dispatch, commonPurchaseAdd } = this.props;
    const { bankInfo } = commonPurchaseAdd;
    let bankType = "";
    if(bankInfo.length>0) {
      const hasPublic = bankInfo.some(item=>item.type==1);
      const hasPrivate = bankInfo.some(item=>item.type==2);
      bankType = hasPublic&&+e?1:(hasPrivate&&!+e?2:'');
    }
      dispatch({
        type: 'commonPurchaseAdd/changeIsTax',
        payload: {
          isTax: e,
          bankType,
        },
      });
  }
  handleClickCancelDeleteGoodsButton() {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseAdd/updatePage',
      payload:{
        isShowDeleteConfirm: false,
      }
    });
  }
  handleClickOkDeleteGoodsButton(goodsId, rowId, isGift) {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseAdd/clickOkDeleteGoodsButton',
      payload: {
        goodsId,
        rowId,
        orderId: this.props.match.params.id,
        isGift,
      },
    });
  }
  // 选择供应商

  // 选择采购财务备注
  handleChangeItem(type,e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseAdd/updatePage',
      payload: {
        [type]:e,
      },
    });
  }
  //  // 付款日期选择
   handleChangePaymentItem=(e, dataStrings) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseAdd/updatePage',
      payload: {
        expectPayTime: dataStrings,
      },
    });
  }

  // 开票日期选择
  handleChangeSiftItem=(e, dataStrings) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseAdd/updatePage',
      payload: {
        expectInvDate: dataStrings,
      },
    });
  }
  // 发货日期选择
  handleDateChangeSiftItem=(e, dataStrings) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseAdd/updatePage',
      payload: {
        expectShippingDate: dataStrings,
      },
    });
  }
  // 修改商品的采购数量
  handleChangePurchaseNum(goodsId, isGift = false, e) {
    e.persist()
    const number = e.target.value;
    const { dispatch } = this.props;
    const reg = new RegExp('^[0-9]*$');
    if (!reg.test(number)) {
      return;
    }
    dispatch({
      type: 'commonPurchaseAdd/changePurchaseNum',
      payload: {
        goodsId,
        number,
        isGift,
      },
    });
  }
  handleChangeRemark(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseAdd/updatePage',
      payload: {
        remark: e.target.value,
      },
    });
  }
  // 打开关闭每一列的备注修改弹窗
  handleTriggerEditRemarkModal(itemId,type,e) {
    e.persist();
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseAdd/triggerEditRemarkModal',
      payload: {
        itemId,
        type,
      },
    });
  }
  // 确认修改备注
  handleOkEditRemarkModal() {
    const { dispatch, commonPurchaseAdd } = this.props;
    const { goodsInfos, itemId, orderRemark, type, gifts } = commonPurchaseAdd;
    if(type == "gifts") {
      gifts.map(item=>{
        if(+item.id === +itemId) {
          item.remark = orderRemark;
          item.isChange = false;
        }
      })
      dispatch({
        type: 'commonPurchaseAdd/updatePage',
        payload:{
          gifts,
          isShowEditRemarkModal:false,
        }
      });
    }else if(type == "goods") {
      goodsInfos.map(item=>{
        if(+item.id === +itemId) {
          item.remark = orderRemark;
          item.isChange = false;
        }
      })
      dispatch({
        type: 'commonPurchaseAdd/updatePage',
        payload:{
          goodsInfos,
          isShowEditRemarkModal:false,
        }
      });
    }
  }
  // change 每列的备注
  handleChangeOrderRemark(e) {
    e.persist();
    const { dispatch, commonPurchaseAdd } = this.props;
    const {  itemId, goodsInfos, orderRemark, type, gifts } = commonPurchaseAdd;
    if(type == "goods") {
      goodsInfos.map(item=>{
        if(+item.id === +itemId){
          item.isChange=true;
          item.remark = orderRemark;
          dispatch({
            type: 'commonPurchaseAdd/updatePage',
            payload: {
              orderRemark:item.isChange?e.target.value:item.remark,
              goodsInfos,
            },
          });       
        }
      }) 
    }else if(type == "gifts") {
      gifts.map(item=>{
        if(+item.id === +itemId){
          item.isChange=true;
          item.remark = orderRemark;
          dispatch({
            type: 'commonPurchaseAdd/updatePage',
            payload: {
              orderRemark:item.isChange?e.target.value:item.remark,
              gifts,
            },
          });       
        }
      })   
    }
  }
  // 判断是否勾选了挂账抵扣
  handleIsDeduction(e) {   
    const isDeduction = e.target.checked;
    const { dispatch, commonPurchaseAdd, match } = this.props;
    const { balanceBillAmount, isChange, balanceBillTotalAmount, balanceBillLastAmount, goodsInfos, isOutInv, balanceBillOutInvAmount } = commonPurchaseAdd;
      if(!isChange){
        dispatch({
          type: 'commonPurchaseAdd/updatePage',
          payload: {
            balanceBillAmount: +balanceBillTotalAmount,
            balanceBillOutInvAmount: balanceBillOutInvAmount,
          }
        })
      }
      dispatch({
        type: 'commonPurchaseAdd/updatePage',
        payload: {
          isDeduction,
        }
      })
      if(!isDeduction){
        dispatch({
          type: 'commonPurchaseAdd/updatePage',
          payload: {
            balanceBillAmount: 0,
            balanceBillOutInvAmount: 0,
            realBalanceBillOutInvAmount: 0,
            isOutInv: 0,
          }
        })  
      }else{


      }  
    // }    
  }
  // 填写挂账抵扣金额
  inputDeductionValue(e) {
    const balanceBillAmount = e.target.value;
    const { dispatch, commonPurchaseAdd } = this.props;
    const { balanceBillTotalAmount, isDeduction } = commonPurchaseAdd;
    if(!isDeduction){
      dispatch({
        type: 'commonPurchaseAdd/updatePage',
        payload: {
          balanceBillAmount: 0,
        }
      })
    }else{ 
      if(balanceBillAmount <= +balanceBillTotalAmount ){
        dispatch({
          type: 'commonPurchaseAdd/updatePage',
          payload: {
            balanceBillAmount,
          }
        })
      }
      else{
        message.warning("挂账抵扣金额超出可用金额，请重新输入");
        dispatch({
          type: 'commonPurchaseAdd/updatePage',
          payload: {
            balanceBillAmount: +balanceBillTotalAmount,
          }
        })
        return;
      }
    }
  }
  changeDeductionValue=(e)=>{
    const balanceBillAmount = e.target.value;
    const { dispatch, commonPurchaseAdd } = this.props;
    const { balanceBillTotalAmount, isDeduction,balanceBillOutInvAmount } = commonPurchaseAdd;    
    if(isDeduction){      
      if( +balanceBillTotalAmount){       
          dispatch({
            type: 'commonPurchaseAdd/updatePage',
            payload: {
              balanceBillAmount,
              isChange: true,
            }
          })
               
      }else{
        message.warning("无可用抵扣金额");
        dispatch({
          type: 'commonPurchaseAdd/updatePage',
          payload: {
            balanceBillAmount: +balanceBillTotalAmount,
          }
        })
        return;
      }
    }else{
      dispatch({
        type: 'commonPurchaseAdd/updatePage',
        payload: {
          balanceBillAmount: 0,
          isChange: false,
        }
      })
    }
  }
  // 抵扣金额是否开票
  deductionIsBill(e) {
    const isOutInv =  e.target.value;
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseAdd/updatePage',
      payload: {
        isOutInv,
      }
    })
    if(!isOutInv){
      dispatch({
        type: 'commonPurchaseAdd/updatePage',
        payload: {
          balanceBillOutInvAmount: 0,
          realBalanceBillOutInvAmount: 0,
        }
      })
    }   
  }
  // 抵扣金额需开票金额
  saveDeductionValue(e) {
    const { dispatch, commonPurchaseAdd } = this.props;
    const { isOutInv, balanceBillOutInvAmount } = commonPurchaseAdd;
    const realBalanceBillOutInvAmount = e.target.value;
    if(isOutInv) {
        dispatch({
          type: 'commonPurchaseAdd/updatePage',
          payload: {
            balanceBillOutInvAmount:e.target.value,
            realBalanceBillOutInvAmount,
            isRealBalanceBillOutInvAmount:true
          }
        })
    }
  }
  blurSaveDeductionValue(e) {
    const { dispatch, commonPurchaseAdd } = this.props;
    const { balanceBillAmount,balanceBillOutInvAmount } = commonPurchaseAdd;
    const realBalanceBillOutInvAmount = e.target.value;

 if(realBalanceBillOutInvAmount > +balanceBillAmount || balanceBillOutInvAmount > +balanceBillAmount) {
        message.warning("开票金额超出抵扣金额");
        return;
      }else{
        dispatch({
          type: 'commonPurchaseAdd/updatePage',
          payload: {
            balanceBillOutInvAmount:e.target.value,
            realBalanceBillOutInvAmount,
          }
        })
      }
  }
  handleClickSaveBtn() {
    const { dispatch, commonPurchaseAdd, user } = this.props;
    const {
      financeRemark,
      expectInvDate,
      expectShippingDate,
      isTax,
      isShowPaymentDate,
      expectPayTime,
      balanceBillAmount,
      isDeduction,
      isOutInv,
      realBalanceBillOutInvAmount,
      payCondition,
      bankInfoId,
      isCheck,
      bankType,
      payType,
      isAllCash,
      isAllDirect,
      isAllAgency,
    } = commonPurchaseAdd;
    if (+isTax) {     
      if (!expectInvDate) {
        message.warning('请添加预开票时间');
        return;        
      }
    }  
    if (!expectShippingDate) {
      message.warning('请添加预计发货时间');
      return;
    }    
    if (isShowPaymentDate) {
      if (!expectPayTime) {
        message.warning('请添加预付款时间');
        return;
      }
    }
    if(!this.props.match.params.id){
      if(isDeduction) {
        if(!+balanceBillAmount){
          message.warning('请填写挂账抵扣金额');
          return;
        }        
      }  
      if(isOutInv) {
        if(+realBalanceBillOutInvAmount > +balanceBillAmount) {
          message.warning('开票金额超出挂账抵扣金额');
          return;
        }
      }      
    } 
    if(financeRemark&&bankInfoId) {
      message.error("只能选择一条财务备注");
      dispatch({
        type:"commonPurchaseAdd/updatePage",
        payload:{
          financeRemark:"",
          bankInfoId:"",
          bankType:"",
        }
      })
      return;
    }
    const { name } = user.currentUser;
    if(isCheck) {
      dispatch({
        type:"commonPurchaseAdd/updatePage",
        payload:{
          showConfirmModal:true,
        }
      })
    }else if(payType == 0&&!isAllCash || payType == 2&&!isAllDirect || payType == 4&&!isAllAgency){
      dispatch({
        type:"commonPurchaseAdd/updatePage",
        payload:{
          showModal:true,
        }
      })
    }else{
      dispatch({
        type: 'commonPurchaseAdd/clickSaveBtn',
        payload: {
          orderId: this.props.match.params.id,
        },
      });
    }
  }
  @Debounce(200)
  handleSearchGoods(isGift = false, value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseAdd/searchGoods',
      payload: {
        goods: this.props.commonPurchaseAdd.goods,
        value,
        isGift,
      },
    });
  }
  handleTriggerGoodsListModal(isGift = false) {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseAdd/triggerGoodsListModal',
      payload: {
        isGift,
      },
    });
  }
  handleChangeGoodsListModalPage(curPage) {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseAdd/changeGoodsListModalPage',
      payload: {
        curPage,
      },
    });
  }
  handleChangeGoodsModalKeyword(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseAdd/updatePage',
      payload: {
        keyword: e.target.value,
      },
    });
  }
  handleSearchGoodsModal(keyword) {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseAdd/searchGoodsModal',
      payload: {
        curPage: 1,
        keyword,
      },
    });
  }
  handleChangeSelectGoods(isGift = false, selectedGoodsKeys) {    
    const { dispatch } = this.props;
    const payload = {};
    if (!isGift) {
      payload.selectedGoodsKeys = selectedGoodsKeys;
    } else {
      payload.selectedGiftsKeys = selectedGoodsKeys;
    }
    dispatch({
      type: 'commonPurchaseAdd/updatePage',
      payload: {
        ...payload,
      },
    });
  }
  handleClickOkGoodsListModal(isGift) {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseAdd/clickOkGoodsListModal',
      payload: {
        isGift,
      },
    });
  }
  handleChangePayType(value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseAdd/changePayType',
      payload: {
        payType: value,
        isShowPaymentDate: false,
      },
    });
  }
  handleChangePayCondition=(value)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseAdd/changePayTypeReducer',
      payload: {
        payCondition: value,
      },
    });
  }

  // 赠品相关
  handleShowGifts() {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseAdd/showGifts',
    });
  }
  handleToggleRemoveGiftsConfirm() {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseAdd/toggleRemoveGiftsConfirm',
    });
  }
  handleOkRemoveGifts() {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseAdd/okRemoveGifts',
    });
  }
  // 修改是否有运费
  handleChangeHaveFreight(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseAdd/changeHaveFreight',
    });
  }
  // 运费值
  handleChangeFreight(freight) {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseAdd/changeFreight',
      payload: {
        freight,
      },
    });
  }
  handleChangeBankInfoType=(e)=>{
    const { dispatch, commonPurchaseAdd } = this.props;
    const { finalBankInfos } = commonPurchaseAdd;
    let bankInfoDetail = [];
        finalBankInfos.map(item=>{
        if(+item.type === +e) {
          bankInfoDetail = item.bankInfoDetail;
        }
    })
    dispatch({
      type: 'commonPurchaseAdd/updatePage',
      payload: {
        bankType:e,
        bankInfoId:bankInfoDetail[0]&&bankInfoDetail[0].id,
        bankInfoDetail,
      },
    });
  }
  handleChangeBankDetail=(e)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseAdd/updatePage',
      payload: {
        bankInfoId:e,
      },
    });
  }
  handleCancelConfirm=(type)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseAdd/updatePage',
      payload: {
        [type]:false,
      },
    });
  }
  handleConfirmCheck=()=>{
    const { dispatch, commonPurchaseAdd } = this.props;
    const { isAllAgency, isAllCash, isAllDirect, payType } = commonPurchaseAdd;
    if(payType == 0&&!isAllCash || payType == 2&&!isAllDirect || payType == 4&&!isAllAgency) {
      dispatch({
        type: 'commonPurchaseAdd/updatePage',
        payload: {
          showModal:true,
          showConfirmModal:false,
        },
      });
    }else{
      dispatch({
        type: 'commonPurchaseAdd/clickSaveBtn',
        payload: {
          showConfirmModal:false,
          orderId:this.props.match.params.id,
        },
      });
    }
  }
  handleConfirm=()=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseAdd/clickSaveBtn',
      payload: {
        showModal:false,
        orderId:this.props.match.params.id,
      },
    });
  }

  handleSelectSupplier(supplierId, option) {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseAdd/changeSupplier',
      payload: {
        supplierId,
        isCheck:false,
        bankInfoId:"",
        bankType:"",
      },
    });
  }
  // 搜索供应商
  @Debounce(200)
  handleChangeSupplier(text) {
    const { dispatch } = this.props;
    dispatch({
      type: 'commonPurchaseAdd/searchSupplier',
      payload: {
        supplierSearchText: text,
      },
    });
  }
  render() {
    const {
      commonPurchaseAdd: {
        suppliers,
        payTypeMap,
        payType,
        financeRemarks,
        financeRemark,
        total,
        modalGoodsList,
        goodsInfos,
        selectedGoodsKeys,
        otherMoney,
        remark,
        isSaving,
        searchGoodsName,
        giftSearchGoodsName,
        supplierId,
        siftGoods,
        giftSiftGoods,
        deleteRowId,
        deleteGoodsId,
        isShowDeleteConfirm,
        isLoading,
        isDeleting,
        isGoodsLoading,
        isShowGoodsListModal,
        curPage,
        keyword,
        isShowGifts,
        gifts,
        isShowRemoveGiftsConfirm,
        selectedGiftsKeys,
        // 运费
        isHaveFreight,
        freight,

        isGiftsMode,
        isShowPaymentDate,
        // 挂账抵扣金额
        balanceBillAmount,
        //是否勾选挂账抵扣
        isDeduction,
        isOutInv,
        balanceBillTotalAmount,
        balanceBillOutInvAmount,
        isChange,
        balanceBillLastAmount,
        realBalanceBillOutInvAmount,
        isRealBalanceBillOutInvAmount,
        expectShippingDate,
        supplierType,
        payConditionMap,
        payCondition,
        isShowEditRemarkModal,
        orderRemark,
        bankInfo,
        bankType,
        showConfirmModal,
        isCheck,
        bankInfoId,
        status,
        isTax,
        finalBankInfos,
        bankInfoDetail,
        shippingMethodMap,
        payTypePartMap,
        showModal,
        supplier,
        supplierSearchText,
        id,
        shippingMethod,
        expectInvDate,
        expectPayTime
      },
    } = this.props;
    goodsInfos.forEach(item=>{
      item.isDisabled=false
    })
    const allSubtotal = goodsInfos.reduce((pre, next) => {
      return pre + (+next.purchaseNum * (!+isTax ? +next.supplyPrice : +next.purchaseTaxPrice));
    }, 0);
    const allPurchaseNum = goodsInfos.reduce((pre, next) => {
      return pre + +next.purchaseNum;
    }, 0);
    const allGiftsSubtotal = gifts.reduce((pre, next) => {
      return pre + (+next.purchaseNum * (!isTax ? +next.supplyPrice : +next.purchaseTaxPrice));
    }, 0);
    const allGiftsPurchaseNum = gifts.reduce((pre, next) => {
      return pre + +next.purchaseNum;
    }, 0);
    const totalBillValue = isOutInv?(+allSubtotal + +otherMoney - balanceBillAmount + +balanceBillOutInvAmount ):(+allSubtotal + +otherMoney - balanceBillAmount );
    const totalPaymentValue = isDeduction?(allSubtotal + +otherMoney - +balanceBillAmount ).toFixed(2):(allSubtotal + +otherMoney).toFixed(2);
    const goodsIds = goodsInfos.filter(item => item.purchaseIsTax === 1).map(item => item.goodsId);
   
   

    // 商品外部列表
    const columns = [
     
      {
        dataIndex: 'NO',
        key: 'NO',
        width: '50px',
        render: (NO, record, index) => (
          <span>{ NO || index + 1}</span>
        ),
      }, {
        dataIndex: 'operation',
        key: 'operation',
        width: '50px',
        render: (op, record) => {
          if (record.NO) {
            return null;
          }
          return (
            <div>
              {!record.isNotGoods && <Button icon="minus" onClick={this.handleDeleteGoods.bind(this, record.goodsId, record.id, false)} />}
            </div>);
        },
      }, {
        title: '商品图片',
        dataIndex: 'img',
        key: 'img',
        render: (imgSrc, record) => (
          imgSrc ? <img src={imgSrc} style={{ width: 55, height: 55 }} /> : null
        ),
      }, {
        title: '商品编码',
        dataIndex: 'no',
        key: 'no',
        width: '150px',
        render: (no, record) => {
          if (record.NO) {
            return null;
          }
          if (record.isNotGoods) {
            const options = siftGoods.slice(0, 49).map((oneSiftGoods) => {
              return <Option disabled={goodsInfos.some((goodsInfo) => { return +goodsInfo.goodsId === +oneSiftGoods.goodsId; })} key={oneSiftGoods.goodsId} no={oneSiftGoods.no}>{oneSiftGoods.goodsName}</Option>;
            });
            if (options.length === 0) options.push(<Option disabled key="no fount">没发现匹配项</Option>);
            return {
              children: (
                [
                  <Select
                    mode="combobox"
                    placeholder="输入商品编码/商品名称"
                    filterOption={false}
                    onSelect={this.handleSelectGoods.bind(this, false)}
                    onSearch={this.handleSearchGoods.bind(this, false)}
                    defaultActiveFirstOption
                    showArrow={false}
                    value={searchGoodsName}
                    style={{ width: '200px' }}
                  >
                    {options}
                  </Select>,
                  <Button type="primary" onClick={this.handleTriggerGoodsListModal.bind(this, false)}>更多</Button>,
                ]
              ),
              props: {
                colSpan: 2,
              },
            };
          } else {
            return {
              children: <div className={styles.warning}>{!record.isCheck?<Tooltip title="该条码信息发生变更，正在审核中"><Icon type="warning" style={{color:'#f60'}}/></Tooltip>:""}<span>{no}</span></div>,
              props: {
                colSpan: 1,
              },
            };
          }
        },
      }, {
        title: '商品名称',
        dataIndex: 'goodsName',
        key: 'goodsName',
        width: '200px',
        render: (goodsName, record) => {
          if (record.NO) {
            return null;
          }
          if (record.isNotGoods) {
            return {
              children: <span>我啥也不是mmp</span>,
              props: {
                colSpan: 0,
              },
            };
          } else {
            return {
              children: <p style={{width:170,margin:0}} className={globalStyles.twoLine}>
              <Tooltip title={goodsName}>
                  {goodsName}
              </Tooltip>
          </p>,
              props: {
                colSpan: 1,
              },
            };
          }
        },
      },
      {
        title: '条码政策',
        key: 'snPolicy',
        dataIndex: 'snPolicy',
        width:100,
        render: (snPolicy, record) => {
           return record.isNotGoods?null:(<Tooltip title={snPolicy}>
           {snPolicy?(<img 
              style={{width:40,height:40}}
              src={img} alt="条码政策"></img>):null}
          </Tooltip>)

        },
      }, 
      {
        title: '结算方式',
        key: 'payMethod',
        dataIndex: 'payMethod',
        width:100,
      }, 
      {
        title: '单位',
        dataIndex: 'unit',
        key: 'unit',
        width: '70px',
        render: (unit, record) => {
          if (record.isNotGoods) {
            return null;
          }
          return <span>{unit}</span>;
        },
      }, 
      {
        title: '零售价',
        key: 'marketPrice',
        dataIndex: 'marketPrice',
        render: (marketPrice,record) => {
          if (record.NO) {
            return null;
          }
          if (record.isNotGoods) {
            return null;
          }
          return <span style={{ color: '#D4294A' }}>{marketPrice}</span>
        },
      }, 
      {
        title: '平台售价',
        key: 'shopPrice',
        dataIndex: 'shopPrice',
        render: (shopPrice,record) => {
          if (record.NO) {
            return null;
          }
          if (record.isNotGoods) {
            return null;
          }
          return <span style={{ color: '#FF663F' }}>{shopPrice}</span>
        },
      }, 
       {
        title: '平台折扣',
        dataIndex: 'saleDiscount',
        key: 'saleDiscount',
        render: (saleDiscount,record) => {
          if (record.NO) {
            return null;
          }
          if (record.isNotGoods) {
            return null;
          }
          return (
              <span style={{ color: '#0FA2D9' }}>{saleDiscount}</span>
          );
        },
      },
      {
        title: '返利后进价',
        dataIndex: 'rebatePurchasePrice',
        key: 'rebatePurchasePrice',
        render:(rebatePurchasePrice,record)=>{
          return <span>{+isTax?record.taxRebatePurchasePrice:rebatePurchasePrice}</span>
        }
      },
      // {
      //   title: '零售价/平台售价/折扣',
      //   dataIndex: 'marketPrice',
      //   key: 'marketPrice',
      //   width:100,
      //   render: (_, record) => {
      //     if (record.NO) {
      //       return null;
      //     }
      //     if (record.isNotGoods) {
      //       return null;
      //     }
      //     return (
      //       <div>
      //         <span style={{ color: '#D4294A' }}>{record.marketPrice}</span>
      //         <span>/</span>
      //         <span style={{ color: '#FF663F' }}>{record.shopPrice}</span>
      //         <span>/</span>
      //         <span style={{ color: '#0FA2D9' }}>{record.saleDiscount}</span>
      //       </div>
      //     );
      //   },
      // },
       {
        title: '采购单价/折扣',
        dataIndex: 'supplyPrice',
        key: 'supplyPrice',
        width:100,
        render: (_, record) => {
          if (record.NO) {
            return null;
          }
          if (record.isNotGoods) {
            return null;
          }
          return (
            <div>
              <span style={{ color: '#FF663F' }}>{+isTax ? record.purchaseTaxPrice : record.supplyPrice}</span>
              <span>/</span>
              <span style={{ color: '#0FA2D9' }}>{+isTax ? record.purchaseTaxDiscount : record.purchaseDiscount}</span>
            </div>
          );
        },
      },
      {
        title: '采购数',
        dataIndex: 'purchaseNum',
        key: 'purchaseNum',
        width: '120px',
        render: (purchaseNum, record) => {
          if (record.NO) {
            return record.purchaseNum;
          }
          if (record.isNotGoods) {
            return null;
          }
          return (
            <Input onChange={this.handleChangePurchaseNum.bind(this, record.goodsId, false)} value={purchaseNum} />
          );
        },
      }, {
        title: '小计（元）',
        dataIndex: 'subtotal',
        key: 'subtotal',
        width: '100px',
        render: (subtotal, record) => {
          if (record.NO) {
            return subtotal && subtotal.toFixed(2);
          }
          if (record.isNotGoods) {
            return null;
          }
          if (+isTax) {
            return <span>{(+record.purchaseTaxPrice * +record.purchaseNum).toFixed(2)}</span>;
          }
          return <span>{(+record.supplyPrice * +record.purchaseNum).toFixed(2)}</span>;
        },
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        width: 100,
        render: (remark, record) => {
          return record.isNotGoods?null:<Tooltip title={remark}>
            <a onClick={this.handleTriggerEditRemarkModal.bind(this, record.id,"goods")}><span className={globalStyles['ellipsis-col']}><Icon type="edit" />{remark}</span></a>
          </Tooltip>
        }  
      }
    ];
    // 赠品列表
    const giftColumns = [
      {
        dataIndex: 'NO',
        key: 'NO',
        width: '50px',
        fixed: true,
        render: (NO, record, index) => (
          <span>{ NO || index + 1}</span>
        ),
      }, {
        dataIndex: 'operation',
        key: 'operation',
        width: '50px',
        render: (op, record) => {
          if (record.NO) {
            return null;
          }
          return (
            <div>
              {!record.isNotGoods && <Button icon="minus" onClick={this.handleDeleteGoods.bind(this, record.goodsId, record.id, true)} />}
            </div>);
        },
      }, {
        title: '商品图片',
        dataIndex: 'img',
        key: 'img',
        render: (imgSrc, record) => (
          imgSrc ? <img src={imgSrc} style={{ width: 55, height: 55 }} /> : null
        ),
      }, {
        title: '商品编码',
        dataIndex: 'no',
        key: 'no',
        width: '150px',
        render: (no, record) => {
          if (record.NO) {
            return null;
          }
          if (record.isNotGoods) {
            const options = giftSiftGoods.slice(0, 49).map((oneSiftGoods) => {
              return <Option disabled={gifts.some((gift) => { return +gift.goodsId === +oneSiftGoods.goodsId; })} key={oneSiftGoods.goodsId} no={oneSiftGoods.no}>{oneSiftGoods.goodsName}</Option>;
            });
            if (options.length === 0) options.push(<Option disabled key="no fount">没发现匹配项</Option>);
            return {
              children: (
                [
                  <Select
                    mode="combobox"
                    placeholder="输入商品编码/商品名称"
                    filterOption={false}
                    onSelect={this.handleSelectGoods.bind(this, true)}
                    onSearch={this.handleSearchGoods.bind(this, true)}
                    defaultActiveFirstOption
                    showArrow={false}
                    value={giftSearchGoodsName}
                    style={{ width: 200 }}
                  >
                    {options}
                  </Select>,
                  <Button type="primary" onClick={this.handleTriggerGoodsListModal.bind(this, true)}>更多</Button>,
                ]
              ),
              props: {
                colSpan: 2,
              },
            };
          } else {
            return {
              children: <span>{no}</span>,
              props: {
                colSpan: 1,
              },
            };
          }
        },
      }, {
        title: '商品名称',
        dataIndex: 'goodsName',
        key: 'goodsName',
        width: '200px',
        render: (goodsName, record) => {
          if (record.NO) {
            return null;
          }
          if (record.isNotGoods) {
            return {
              children: <span>我啥也不是mmp</span>,
              props: {
                colSpan: 0,
              },
            };
          } else {
            return {
              children: <p style={{width:170,margin:0}} className={globalStyles.twoLine}>
              <Tooltip title={goodsName}>
                  {goodsName}
              </Tooltip>
          </p>,
              props: {
                colSpan: 1,
              },
            };
          }
        },
      }, 
      {
        title: '条码政策',
        key: 'snPolicy',
        dataIndex: 'snPolicy',
        width:100,
        render: (snPolicy, record) => {
           return record.isNotGoods?null:(<Tooltip title={snPolicy}>
           {snPolicy?(<img 
              className={styles.logo}
              src={img} alt="条码政策"></img>):null}
          </Tooltip>)

        },
      }, 
      {
        title: '结算方式',
        key: 'payMethod',
        dataIndex: 'payMethod',
        width:100,
      },   
      {
        title: '单位',
        dataIndex: 'unit',
        key: 'unit',
        width: '70px',
        render: (unit, record) => {
          if (record.isNotGoods) {
            return null;
          }
          return <span>{unit}</span>;
        },
      },
      {
        title: '零售价',
        key: 'marketPrice',
        dataIndex: 'marketPrice',
        render: (marketPrice,record) => {
          if (record.NO) {
            return null;
          }
          if (record.isNotGoods) {
            return null;
          }
          return <span style={{ color: '#D4294A' }}>{marketPrice}</span>
        },
      }, 
      {
        title: '平台售价',
        key: 'shopPrice',
        dataIndex: 'shopPrice',
        render: (shopPrice,record) => {
          if (record.NO) {
            return null;
          }
          if (record.isNotGoods) {
            return null;
          }
          return <span style={{ color: '#FF663F' }}>{shopPrice}</span>
        },
      }, 
       {
        title: '折扣',
        dataIndex: 'saleDiscount',
        key: 'saleDiscount',
        render: (saleDiscount,record) => {
          if (record.NO) {
            return null;
          }
          if (record.isNotGoods) {
            return null;
          }
          return (
              <span style={{ color: '#0FA2D9' }}>{saleDiscount}</span>
          );
        },
      }, 
      {
        title: '采购单价/折扣',
        dataIndex: 'supplyPrice',
        key: 'supplyPrice',
        render: (_, record) => {
          if (record.NO) {
            return null;
          }
          if (record.isNotGoods) {
            return null;
          }
          return (
            <div>
              <span style={{ color: '#FF663F' }}>{ +isTax ? record.purchaseTaxPrice : record.supplyPrice}</span>
              <span>/</span>
              <span style={{ color: '#0FA2D9' }}>{ +isTax ? record.purchaseTaxDiscount : record.purchaseDiscount}</span>
            </div>
          );
        },
      },
      {
        title: '采购数',
        dataIndex: 'purchaseNum',
        key: 'purchaseNum',
        width: '140px',
        render: (purchaseNum, record) => {
          if (record.NO) {
            return record.purchaseNum;
          }
          if (record.isNotGoods) {
            return null;
          }
          return (
            <Input onChange={this.handleChangePurchaseNum.bind(this, record.goodsId, true)} value={purchaseNum} />
          );
        },
      },
      {
        title: '小计（元）',
        dataIndex: 'subtotal',
        key: 'subtotal',
        width: '200px',
        render: (subtotal, record) => {
          if (record.NO) {
            // return subtotal && subtotal.toFixed(2);
            return <span>0.00</span>;
          }
          if (record.isNotGoods) {
            return null;
          }
          if (record.purchaseIsTax) {
            // return <span>{(+record.purchasePrice * +record.purchaseNum).toFixed(2)}</span>;
            return <span>0.00</span>;
          }
          // return <span>{(+record.supplyPrice * +record.purchaseNum).toFixed(2)}</span>;
          return <span>0.00</span>;
        },
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        width: 100,
        render: (remark, record) => {
          return record.isNotGoods?null:<Tooltip title={remark}>
            <a onClick={this.handleTriggerEditRemarkModal.bind(this, record.id,"gifts")}><span className={globalStyles['ellipsis-col']}><Icon type="edit" />{remark}</span></a>
          </Tooltip>
        }  
      }
      
    ];
    // 弹窗商品列表
    const goodsColumns = [
      {
        title: '主图',
        dataIndex: 'img',
        key: 'img',
        render: (src, record) => (
          <img src={src} style={{ width: 55, height: 55 }} />
        ),
      },
      {
        title: '商品编码',
        dataIndex: 'no',
        key: 'no',
      },
      {
        title: '商品名称',
        dataIndex: 'goodsName',
        key: 'goodsName',
        width:200,
      },
      {
        title: '单位',
        dataIndex: 'unit',
        key: 'unit',
      },
      {
        title: '结算方式',
        dataIndex: 'payMethod',
        key: 'payMethod',
      },
      {
        title: '未税价',
        dataIndex: 'supplyPrice',
        key: 'supplyPrice',
      },
      {
        title: '含税价',
        dataIndex: 'purchaseTaxPrice',
        key: 'purchaseTaxPrice',
      },
    ];
    const rowSelection2 = {
      columnWidth: '120px',
      selectedRowKeys: goodsIds,
      onChange: (selectedRowKeys, selectedRow) => {
        const { dispatch } = this.props;
        dispatch({
          type: 'commonPurchaseAdd/changeIsTax',
          payload: {
            selectedRow,
            selectedRowKeys,
            isGift: false,
          },
        });
      },
      getCheckboxProps: record => ({ 
        disabled: record.isNotGoods === true,
      }),
    };

    return (
      <PageHeaderLayout 
      title={this.props.match.params.id ? '修改采购订单' : '新增采购订单'} 
      className={styles.addPageHeader}
      iconType="question-circle"
      tips={
        <div>
            <p>建采购单规则:</p>
            <p>1.含税和不含税商品请分开建单</p>
            <p>2.现款结算方式的条码和账期结算方式的条码情分开建单</p>
        </div>}
      >
        <Card bordered={false} loading={isLoading}>
          <div className={styles.tableList}>
            <Row style={{ marginBottom: 24 }}>
              <span>供应商(必选):  </span>
              <AutoComplete
                  dataSource={suppliers && suppliers.map((suggest) => {
                      return (
                      <Select.Option value={suggest.id.toString()}>{suggest.name}</Select.Option>
                      );
                  })}
                  onSelect={this.handleSelectSupplier.bind(this)}
                  onSearch={this.handleChangeSupplier.bind(this)}
                  style={{width:400}}
                  disabled={!!this.props.match.params.id}
                  >
                  <Input
                      placeholder={id?supplier:"请输入供应商"}
                      value={supplierSearchText}
                  />
              </AutoComplete>
            </Row>
            {
              isCheck?<Row>
              <Alert
                message="该供应商代理品牌下的部分商品正处于审核中，未审核通过前，采购单依然沿用之前的数据。"
                type="warning"
                showIcon
               />
            </Row>:""
            }
            <Row
              style={{ marginTop: 10, marginBottom: 10 }}
            >
              <Col>
                <Table
                  bordered
                  loading={isGoodsLoading}
                  // rowSelection={rowSelection2}
                  rowKey={record => record.goodsId}
                  dataSource={goodsInfos.concat([{ goodsId: '商品输入框', id: '商品输入框', isNotGoods: true }, { NO: '合计', goodsId: '不知道', id: '不知道', isNotGoods: true, purchaseNum: allPurchaseNum, subtotal: allSubtotal }])}
                  columns={columns}
                  pagination={false}
                  // className={styles.checkWidth}
                  className={globalStyles.tablestyle}
                />
                {/* <span style={{ position: 'absolute', top: 18, left: 64 }}>含税</span> */}
              </Col>
            </Row>
            <Row
              style={{ marginTop: 10, marginBottom: 10 }}
            >
              <Button style={{ marginRight: 10 }} type="primary" onClick={this.handleShowGifts.bind(this)}>添加赠品+</Button>
              <Button disabled={!isShowGifts} onClick={this.handleToggleRemoveGiftsConfirm.bind(this)}>清空赠品</Button>
            </Row>
            {
              isShowGifts ?
                <Table
                  bordered
                  loading={isGoodsLoading}
                  rowKey={record => record.id}
                  dataSource={gifts.concat([{ goodsId: '商品输入框', id: '商品输入框', isNotGoods: true }, { NO: '合计', goodsId: '不知道', id: '不知道', isNotGoods: true, purchaseNum: allGiftsPurchaseNum, subtotal: allGiftsSubtotal }])}
                  columns={giftColumns}
                  className={globalStyles.tablestyle}
                  pagination={false}
                /> :
                null
            }
            {/* <Row type="flex" justify="end" style={{ marginTop: 10 }}>
              <Col>
                <Checkbox onChange={this.handleChangeHaveFreight.bind(this)} value={isHaveFreight} />
                <span>运费: </span>
                <InputNumber value={freight} onChange={this.handleChangeFreight.bind(this)} disabled={!isHaveFreight} style={{ width: 100 }} />
              </Col>
            </Row> */}
            {/* <Row type="flex" justify="end" style={{ marginTop: 5 }}>
              <Col>
                <span style={{ marginLeft: 20 }}>采购货值: </span>
                <span style={{ fontSize: 24, fontWeight: 'bold', color: '#f36' }}>{(allSubtotal + +otherMoney).toFixed(2)}</span>
              </Col>
            </Row> */}
            {/* <Row type="flex" justify="end" style={{ marginTop: 5 }}>
              <Col>
                <span style={{ marginLeft: 20 }}>采购总额: </span>
                <span style={{ fontSize: 24, fontWeight: 'bold', color: '#f36' }}>{(allSubtotal + +otherMoney).toFixed(2)}</span>
              </Col>
            </Row> */}
            <Row>
              <Col span={12}>
                  {
                  supplierId ?
                    <Row style={{ marginBottom: 14 }}>
                      {[
                        +supplierType===2?(<Row style={{ marginBottom: 14 }}>
                          <span style={{ marginBottom: 5, verticalAlign: 'middle', fontSize: '16px', fontWeight: 600 }}>
                                供应商类型:
                            </span>
                            <span style={{ marginLeft: 15, marginRight: 5 }}>
                              账期供应商
                            </span>
                      </Row>):null,
                        <Row  style={{ marginBottom: 14 }}>
                            <span style={{ marginBottom: 5, verticalAlign: 'middle', fontSize: '16px', fontWeight: 600 }}>
                                结算模式：
                            </span>
                            <span style={{ marginLeft: 15, marginRight: 5 }}>
                              {supplierType}
                            </span>
                        </Row>,
                        <span style={{ marginBottom: 5, verticalAlign: 'middle', fontSize: '16px', fontWeight: 600 }}>
                            支付类型：
                        </span>,
                        <Select
                          style={{ width: 200, display: 'inline-block' }}
                          value={payTypePartMap[payType]}
                          placeholder="支付类型"
                          onChange={this.handleChangePayType.bind(this)}
                        >
                          {
                            (Object.entries(payTypePartMap).map((value) => {
                              return <Option key={value[0]}>{value[1]}</Option>;
                            }))
                          }
                        </Select>,
                      ]}
                    </Row> :
                    null
                }
                {isShowPaymentDate ? (
                   <Row style={{ marginBottom: 14 }}>
                    {/* <span style={{ marginBottom: 5, verticalAlign: 'middle', fontSize: '16px', fontWeight: 600 }}>
                      账期条件:
                      </span>
                      <Select
                        style={{ width: 200, display: 'inline-block' }}
                        placeholder="账期条件"
                        onChange={this.handleChangePayCondition.bind(this)}
                        value={payConditionMap[payCondition]}
                      >
                          {
                            (Object.entries(payConditionMap).map((value) => {
                              return <Option key={value[0]}>{value[1]}</Option>;
                            }))
                          }
                      </Select> */}
                    <Col style={{ marginTop: 14 }}>
                      <span style={{ marginRight: 10, fontSize: '16px', fontWeight: 600 }}>预计付款时间:</span>
                      <DatePicker
                        onChange={this.handleChangePaymentItem}
                        value={expectPayTime ? moment(expectPayTime, 'YYYY-MM-DD') : null}
                      />
                    </Col>                
                  </Row>
                ) : null}
                <Row style={{ marginBottom: 14 }}>
                  <Col>
                    <span style={{ marginRight: 10, fontSize: '16px', fontWeight: 600 }}>预计发货时间:</span>
                    <DatePicker
                      onChange={this.handleDateChangeSiftItem}
                      value={expectShippingDate ? moment(expectShippingDate, 'YYYY-MM-DD') : null}
                    />
                  </Col>
                </Row>
                <Row style={{ marginBottom: 14 }}>
                  <Col>
                    <span style={{ marginRight: 10, fontSize: '16px', fontWeight: 600 }}>是否含税:</span>
                    <Select
                    value={isTax}
                    onChange = {this.handleChangeIsTax}
                    >
                        <Select.Option value={1}>
                            是
                        </Select.Option>
                        <Select.Option value={0}>
                            否
                        </Select.Option>
                    </Select>
                  </Col>
                </Row>
                {+isTax ? (
                  <Row style={{ marginBottom: 14 }}>
                      <Col>
                        <span style={{ marginRight: 10, fontSize: '16px', fontWeight: 600 }}>预计开票时间:</span>
                        <DatePicker
                          onChange={this.handleChangeSiftItem}
                          value={expectInvDate ? moment(expectInvDate, 'YYYY-MM-DD') : null}
                        />
                      </Col>                
                  </Row>) : null}
                 <Row style={{ marginBottom: 14 }}>
                    <span style={{ marginRight: 10, fontSize: '16px', fontWeight: 600 }}>财务备注:</span>
                    <Select
                      value={financeRemark || undefined}
                      placeholder="请选择供应商财务备注"
                      onChange={this.handleChangeItem.bind(this,'financeRemark')}
                      style={{ width: 600 }}
                    >
                      {financeRemarks&&financeRemarks.map(oneFinanceRemark => (
                        <Option value={oneFinanceRemark}>{oneFinanceRemark}</Option>
                      ))}
                    </Select>
                  </Row>
                  <Row style={{ marginBottom: 14 }}>
                  <span style={{ marginRight: 10, fontSize: '16px', fontWeight: 600 }}>付款信息:</span>
                  <Select
                    placeholder="请选择账户类型"
                    // value={finalBankInfos[0]&&finalBankInfos[0].type||bankType}
                    value={bankType}
                    onChange={this.handleChangeBankInfoType.bind(this)}
                    style={{ width: 150,marginRight:10 }}
                  >
                    {
                      finalBankInfos.map(item=>{
                        return <Select.Option
                        key={item.type}
                        value={item.type}
                        >
                          {+item.type===1?"对公账户":"对私账户"}
                        </Select.Option>
                      })
                    }
                  </Select>
                  <Select
                    placeholder="请选择供应商财务备注"
                    value={bankInfoId}
                    onChange={this.handleChangeBankDetail.bind(this)}
                    style={{ width: 500 }}
                  >
                    {
                      bankInfoDetail.map(info=>{
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
                <Row style={{ marginBottom: 14 }}>
                    <span style={{ marginRight: 10, fontSize: '16px', fontWeight: 600 }}>运费方式:</span>
                    <Select
                      onChange={this.handleChangeItem.bind(this,'shippingMethod')}
                      style={{ width: 200 }}
                      value={shippingMethodMap[shippingMethod]}
                    >
                        {
                          (Object.keys(shippingMethodMap).map((item) => {
                            return <Option key={item} value={item}>{shippingMethodMap[item]}</Option>;
                          }))
                        }
                    </Select>
                  </Row>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginTop: 20 }}>
                  <Col md={12}>
                    <Row style={{ marginBottom: 14, width:600 }}>
                      <span style={{ marginBottom: 5, verticalAlign: 'top', fontSize: '16px', fontWeight: 600, marginRight: 10 }}>采购制单备注:</span>
                      <Input.TextArea value={remark} onChange={this.handleChangeRemark.bind(this)} rows={4} 
                        placeholder="1.仅供采购做相关订单信息的备注，设置后在库存采购列表及详情显示，此备注随业务流转，财务，仓库可见。
                        2.如果为赠品售后所建的采购单，则需备注关联采购单号"
                      />
                    </Row>
                  </Col>
                </Row>
              </Col>
              <Col span={7} offset={3}>
                <Row style={{ marginBottom: 10 }}>                
                  <span style={{ marginLeft: 22 }}>采购总额: </span>
                  <span style={{ fontSize: 24, fontWeight: 'bold', color: '#000' }}>{(+allSubtotal + +otherMoney).toFixed(2)}</span>                  
                </Row>
                {
                  isShowPaymentDate?null:(<Row>
                    <Row style={{ marginBottom: 10 }}><Checkbox style={{ marginRight: 10 }} onChange={this.handleIsDeduction.bind(this)} disabled={this.props.match.params.id?true:false}></Checkbox>挂账抵扣：    
                    {
                      this.props.match.params.id?(<Input style={{width: 80,marginRight:4}} 
                        onBlur={this.inputDeductionValue.bind(this)} 
                        onChange={this.changeDeductionValue}
                        value={ isChange? balanceBillAmount:balanceBillLastAmount }
                        disabled={!isDeduction}
                        />):(<Input style={{width: 80,marginRight:4}} 
                          onBlur={this.inputDeductionValue.bind(this)} 
                          onChange={this.changeDeductionValue}
                          value={ isChange? balanceBillAmount: balanceBillTotalAmount}
                          disabled={!isDeduction}
                          />)
                    }                
                    {this.props.match.params.id?null:<span>剩余可抵扣总金额：<span style={{fontSize:18,fontWeight:"bold"}}>{balanceBillTotalAmount}</span></span>}
                    </Row>
                    {
                      +isTax?( isDeduction?(<div><Row style={{ marginBottom: 10, marginLeft: 22 }}><span>抵扣金额是否开票：</span>
                        <RadioGroup onChange={this.deductionIsBill.bind(this)} defaultValue={isOutInv}>
                          <Radio value={1}>是</Radio>
                          <Radio value={0}>否</Radio>
                        </RadioGroup> 
                      </Row>
                      <Row style={{ marginBottom: 10, marginLeft: 22 }}><span>抵扣金额需开票金额：
                        <Input style={{width: 100}} 
                          onChange={this.saveDeductionValue.bind(this)} disabled={isOutInv?false:true} value={isRealBalanceBillOutInvAmount?realBalanceBillOutInvAmount:balanceBillOutInvAmount}
                          onBlur={this.blurSaveDeductionValue.bind(this)}
                          />
                      </span>                  
                      </Row>
                      </div>):null):null
                    }
                    {
                      +isTax?( <Row style={{ marginBottom: 10 }}>
                        <span style={{ marginLeft: 22 }}>开票总金额: </span>
                        <span style={{ fontSize: 24, fontWeight: 'bold', color: '#000' }}>{this.props.match.params.id?(allSubtotal - +balanceBillLastAmount + +balanceBillOutInvAmount).toFixed(2):totalBillValue.toFixed(2)}</span>           
                      </Row>):null
                    }             
                    
                    <Row style={{ marginBottom: 10 }}>
                      <span style={{ marginLeft: 22 }}>采购应付总额: </span>
                      <span style={{ fontSize: 24, fontWeight: 'bold', color: 'red' }}>{this.props.match.params.id?(totalPaymentValue-balanceBillLastAmount).toFixed(2):totalPaymentValue}</span>       
                    </Row>
                    <Row>
                      <span style={{ marginLeft: 22 }}>
                        挂账抵扣场景说明
                        <Tooltip title={
                          <div>
                            <p>说明</p>
                            <p>举例：第一次下单1000，打款1100，（挂账100）；</p>
                            <p>第二次下单2000，勾选挂账抵扣100，货款应付总额1900</p>
                            <p>勾选抵扣开票，开票总金额2000；不勾选抵扣开票；开票金额1900（平坦到每个商品）</p>
                          </div>
                        }>
                          <Icon type="question-circle" />
                        </Tooltip>
                      </span>
                    </Row>
                    </Row>)
                }
                  
              </Col>
              </Row>
              <Row>
              <Button loading={isSaving} type="primary" onClick={this.handleClickSaveBtn.bind(this)}>提交主管审核</Button>
              <Link to="/purchase/purchase-list">
                <Button style={{ marginLeft: 20 }}>取消</Button>
              </Link>
            </Row>
          </div>
        </Card>
        {/* 商品选择弹窗 */}
        <Modal
          visible={isShowGoodsListModal}
          onOk={this.handleClickOkGoodsListModal.bind(this, isGiftsMode)}
          onCancel={this.handleTriggerGoodsListModal.bind(this)}
          width={1000}
        >
          <Table
            bordered
            style={{
              marginTop: 20,
            }}
            dataSource={modalGoodsList}
            rowKey={record => record.goodsId}
            columns={goodsColumns}
            rowSelection={{
              selectedRowKeys: !isGiftsMode ? selectedGoodsKeys : selectedGiftsKeys,
              onChange: this.handleChangeSelectGoods.bind(this, isGiftsMode),
              getCheckboxProps: (record) => {
                let disabled = null;
                if (!isGiftsMode) {
                  disabled = goodsInfos.some((goodsInfo) => {
                    return +record.goodsId === +goodsInfo.goodsId;
                  });
                } else {
                  disabled = gifts.some((goodsInfo) => {
                    return +record.goodsId === +goodsInfo.goodsId;
                  });
                }
                return {
                  disabled,
                };
              },
            }}
            pagination={{
              total,
              current: curPage,
              pageSize: 40,
              onChange: this.handleChangeGoodsListModalPage.bind(this),
            }}
            title={() => (
              <Row type="flex">
                <Input.Search
                  value={keyword}
                  style={{ width: 400 }}
                  placeholder="请输入商品名/商品条码"
                  onChange={this.handleChangeGoodsModalKeyword.bind(this)}
                  onSearch={this.handleSearchGoodsModal.bind(this)}
                />
              </Row>
            )}
            footer={() => (
              modalGoodsList.length > 0 ? null : '暂无直发商品'
            )}
          />
        </Modal>
        <Modal
          visible={isShowRemoveGiftsConfirm}
          onOk={this.handleOkRemoveGifts.bind(this)}
          onCancel={this.handleToggleRemoveGiftsConfirm.bind(this)}
        >
          <p style={{ textAlign: 'center' }}>请问是否确认清空赠品?</p>
        </Modal>
        <Modal
          title="确认"
          visible={isShowDeleteConfirm}
          onOk={this.handleClickOkDeleteGoodsButton.bind(this, deleteGoodsId, deleteRowId, isGiftsMode)}
          confirmLoading={isDeleting}
          onCancel={this.handleClickCancelDeleteGoodsButton.bind(this)}
        >
          <p style={{ textAlign: 'center' }}>请确认删除</p>
        </Modal>
        {/* 编辑备注弹窗 */}
        <Modal
            visible={isShowEditRemarkModal}
            title="编辑备注信息"
            onOk={this.handleOkEditRemarkModal.bind(this)}
            onCancel={this.handleTriggerEditRemarkModal.bind(this,null,null)}
          >
            <TextArea
              style={{ marginTop: 20 }}
              value={orderRemark}
              placeholder="请输入备注"
              onChange={this.handleChangeOrderRemark.bind(this)}
              onPressEnter={this.handleOkEditRemarkModal.bind(this)}
            />
          </Modal>
          <Modal
          visible={showConfirmModal}
          title="提示"
          onOk={this.handleConfirmCheck}
          onCancel={this.handleCancelConfirm.bind(this,'showConfirmModal')}
          >
          该采购单中，部分商品条码信息正处于审核状态，若继续下单，该采购单将会沿用之前的数据，请确认是否继续提交？
          </Modal>
          <Modal
          visible={showModal}
          title="提示"
          onOk={this.handleConfirm}
          onCancel={this.handleCancelConfirm.bind(this,'showModal')}
          >
          当前采购单支付类型与部分条码的结算方式不匹配，请确认是否继续建单
          </Modal>
      </PageHeaderLayout>
    );
  }
}
