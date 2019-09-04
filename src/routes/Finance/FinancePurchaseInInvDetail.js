import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import NP from 'number-precision';
import moment from 'moment';
import { Card, Row, Col, message, Table, Modal, Input, Radio, Button, Select, Icon, DatePicker } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './FinancePurchaseInInvDetail.less';
import TextArea from 'antd/lib/input/TextArea';


const Option = Select.Option;
const RadioGroup = Radio.Group;
const Search = Input.Search;
@connect(state => ({
  financePurchaseInInvDetail: state.financePurchaseInInvDetail,
}))
export default class FinancePurchaseInInvDetail extends React.Component {
     state={
       id: '',
       radioGroupValue: -1,
       InvoiceNum: -1,
       InvoiceMoney: '',
       InvoiceDate: '',
       editList: [],
       goodsValue: '',
       sum: 0,
       taxSum: 0,
       amountSum :0,
       arr: '',
       list: [],
       nMXSum: 0,
       nMXAmount: 0,
       nMXTax: 0,
       checkType: '',
       isEditorShopping: false,
       isEditorOk: true,
       shippingNo: '',
       remark: '',
       //  isChange: false,
       copy: [],
       isEditorRemark: false,
       isEditorPurchase: false,
       purchaseRemark: '',
       isSuitDetail: -1,
       awaitStorageInvList: [],
       awaitStorageInvLists: [],
     }
     componentWillMount = () => {
       const { match } = this.props;
       const { params } = match;
       this.state.id = params.id;
       const { location, dispatch } = this.props;
       if (location.pathname === '/purchase/purchase-in-inv-follow-list/purchase-in-inv-follow-detail') {
         dispatch({
           type: 'financePurchaseInInvDetail/updateStateReducer',
           payload: {
             pageChange: '1',
           },
         });
       } else if (location.pathname === '/purchase/purchase-in-inv-follow-list-n/purchase-in-inv-follow-detail-n') {
       dispatch({
           type: 'financePurchaseInInvDetail/updateStateReducer',
           payload: {
             pageChange: '2',
           },
         });
       } else if (location.pathname === '/finance/finance-purchase-in-inv-list/finance-purchase-in-inv-detail') {

         dispatch({
           type: 'financePurchaseInInvDetail/updateStateReducer',
           payload: {
             pageChange: '3',
           },
         });
       }
     }

     componentDidMount() {
       const { match, dispatch } = this.props;
       const { params } = match;
       dispatch({
         type: 'financePurchaseInInvDetail/mount',
         payload: {
           incomeInvOrderId: params.id,
         },
       });
       const { incomeInvoiceList, isSuitDetail } = this.props.financePurchaseInInvDetail;
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
     componentWillReceiveProps(nextProps,nextState) {
       const arr = [];
       this.state.editList.map((item) => {
         if (item.editable) {
           arr.push(item);
         }
       });
       this.state.arr = arr;
       if (nextProps.financePurchaseInInvDetail.incomeInvoiceList.length !== this.props.financePurchaseInInvDetail.incomeInvoiceList.length) {
         const { incomeInvoiceList } = nextProps.financePurchaseInInvDetail;
         // const { incomeInvoiceList } = nextProps.financePurchaseInInvDetail
         const invArr = JSON.parse(JSON.stringify(incomeInvoiceList));
         invArr.forEach((item) => {
           item.isEditor = false;
         });
         this.setState({
           copy: invArr,
         });
       }
       if (this.props.financePurchaseInInvDetail.awaitStorageInvList.length !== nextProps.financePurchaseInInvDetail.awaitStorageInvList.length) {
         const { awaitStorageInvList } = nextProps.financePurchaseInInvDetail;
         const awaitStorageInvLists = JSON.parse(JSON.stringify(awaitStorageInvList));
         this.setState({ awaitStorageInvList: awaitStorageInvLists });
       }
     }
     componentWillUnmount() {
       const { dispatch } = this.props;
       dispatch({
         type: 'financePurchaseInInvDetail/unmount',
       });
     }
     editableOpen= (goodsSn, itemId) => {
       const { dispatch } = this.props;
       dispatch({
         type: 'financePurchaseInInvDetail/editableOpen',
         payload: {
           goodsSn,
           iseditGoodsMask: true,
           itemId,
         },
       });
     }
     editGoods=(e) => {
       this.state.goodsValue = e.target.value;
     }
     editGoodsOk=() => {
       const { dispatch, financePurchaseInInvDetail } = this.props;
       const { goodsSn, itemId } = financePurchaseInInvDetail;
       dispatch({
         type: 'financePurchaseInInvDetail/editGoodsOk',
         payload: {
           invGoodsName: this.state.goodsValue,
           goodsSn,
           iseditGoodsMask: false,
         },
       });

       this.state.editList.map((item) => {
         if (item.id === itemId) {
           item.invGoodsName = this.state.goodsValue;
         }
       });

       this.setState(prevstate => ({ editList: prevstate.editList }));
     }
     hideEditGoodsCanCel=() => {
       const { dispatch } = this.props;
       dispatch({
         type: 'financePurchaseInInvDetail/updateStateReducer',
         payload: {
           iseditGoodsMask: false,
         },
       });
     }
     radioGroupValue=(e) => {
       this.setState({
         radioGroupValue: e.target.value,
       });
     }
     hideEditGoodsOk=() => {
       const { dispatch, financePurchaseInInvDetail } = this.props;
       const { invNameList, itemId } = financePurchaseInInvDetail;
       if (this.state.radioGroupValue === -1) {
         message.warning('请选择商品名');
         return false;
       } else {
         let name = '';
         invNameList.map((item) => {
           item.id === this.state.radioGroupValue && (name = item.name);
         });

         this.state.editList.map((item) => {
           if (item.id === itemId) {
             item.invGoodsName = name;
             item.invGoodsId = this.state.radioGroupValue;
           }
         });
         dispatch({
           type: 'financePurchaseInInvDetail/hideEditGoodsOk',
           payload: {
             goodsSn: '',
           },
         });
         this.setState(prevstate => ({ editList: prevstate.editList }));
       }
       this.setState({ radioGroupValue: -1 });
     }
     hideEditGoodsDelete=() => {
       const { dispatch, financePurchaseInInvDetail } = this.props;
       const { goodsSn, everyID, itemId } = financePurchaseInInvDetail;
       if (this.state.radioGroupValue === -1) {
         message.warning('请选择商品名');
         return false;
       } else {
         dispatch({
           type: 'financePurchaseInInvDetail/hideEditGoodsDelete',
           payload: {
             id: this.state.radioGroupValue,
           },
         });
         this.state.editList.map((item) => {
           if (item.invGoodsId = this.state.radioGroupValue) {
             item.invGoodsNameId = '';
             item.invGoodsId = '';
             item.invGoodsName = '';
           } else {
             console.log('每条数据', item);
           }
           if (item.id === itemId) {
             everyID.map((items) => {
               if (items.newId === this.state.radioGroupValue) {
                 items.newId = '';
               }
             });
           }
         });
       }
       this.setState(prevstate => ({ editList: prevstate.editList, radioGroupValue: -1 }));
     }


     sizeValue=(record, e) => {
       this.state.editList.map((item) => {
         if (item.id === record.id) {
           item.size = e.target.value;
         }
       });
       this.setState(prevstate => ({ editList: prevstate.editList }));
     }
     unitValue=(record, e) => {
       this.state.editList.map((item) => {
         if (item.id === record.id) {
           item.unit = e.target.value;
         }
       });
       this.setState(prevstate => ({ editList: prevstate.editList }));
     }
    numValue=(record, e) => {
      const { taxRate } = this.props.financePurchaseInInvDetail;
      this.state.editList.map((item) => {
        if (item.id === record.id) {
          item.keepNum = +e.target.value;
          item.amount = NP.round(NP.times(+item.keepNum, +item.priceNoTax), 2);
          item.taxAmount = NP.round(NP.times(+item.keepNum, +item.priceNoTax, +taxRate), 2);
          item.totalAmount = NP.plus(+item.amount, +item.taxAmount);
        }
      });
      this.setState(prevstate => ({ editList: prevstate.editList }));
    }
    priceValue=(record, e) => {
      const { taxRate } = this.props.financePurchaseInInvDetail;
      this.state.editList.map((item) => {
        if (item.id === record.id) {
          item.priceNoTax = e.target.value;
        }
      });
      this.setState(prevstate => ({ editList: prevstate.editList }));
    }
    amountValue=(record, e) => {
      const { taxRate } = this.props.financePurchaseInInvDetail;      
      this.state.editList.map((item) => {
        if (+item.id === +record.id) {
          item.amount = e.target.value;
          item.taxAmount = NP.round(NP.times(+item.amount, +taxRate), 2);
          item.totalAmount = NP.plus(+item.amount, +item.taxAmount);
          item.priceNoTax = NP.round(NP.divide(+item.amount, +item.keepNum),9);          
        }
      });
      this.setState(prevstate => ({ editList: prevstate.editList }));
    }
    taxAmountValue=(record, e) => {
      this.state.editList.map((item) => {
        if (item.id === record.id) {
          item.taxAmount = e.target.value;
          item.totalAmount = NP.plus(+item.amount, +item.taxAmount);
        }
      });
      this.setState(prevstate => ({ editList: prevstate.editList }));
    }
    totalAmountValue=(record, e) => {
      this.state.editList.map((item) => {
        if (item.id === record.id) {
          item.totalAmount = e.target.value;
        }
      });
      this.setState(prevstate => ({ editList: prevstate.editList }));
    }
    // 增加备注
    addRemarks=(e)=>{
      const { dispatch } = this.props;
      // console.log(e.target.value)
      dispatch({
        type: 'financePurchaseInInvDetail/addRemarks',
        payload: {
          financeRemark: e.target.value,
        },
      });
    }

    handleChangeInvoice=(e) => {
      const { awaitInvoiceBillSn } = this.props.financePurchaseInInvDetail;
      awaitInvoiceBillSn.map((item) => {
        if (+item.id === +e) {
          this.setState({
            InvoiceNum: item.id,
            InvoiceMoney: item.invAmount,
            InvoiceDate: item.invDate,
            InvoiceSn: item.invSn,
          });
        }
      });
      // e = '';
    }

     getCheckRowMX=(type) => {
       this.state.checkType = type;
       if (this.state.InvoiceNum === -1) {
         message.warning('请选择发票号');
         return false;
       }
       if (this.state.checkType === 'y') {
         if (+this.state.InvoiceMoney !== +this.state.sum) this.isMoneyMaskFunc();
         else this.sendData();
       } else if (this.state.checkType !== 'y') {
         if (+this.state.InvoiceMoney !== +this.state.nMXSum) this.isMoneyMaskFunc();
         else this.sendData();
       }
     }
     isMoneyMaskFunc=() => {
       const { dispatch } = this.props;
       dispatch({
         type: 'financePurchaseInInvDetail/updateStateReducer',
         payload: {
           isMoneyMask: true,
         },
       });
     }
     sendData=() => {
       const { dispatch } = this.props;
       const { nSuitDetailList, everyID, itemId,financeRemark } = this.props.financePurchaseInInvDetail;
       if (this.state.checkType === 'y') {
         const invGoodsList = this.state.editList.filter(item => item.editable !== false).map((item) => {
           item.invGoodsNameId = item.invGoodsId;
           item.price = +item.priceNoTax;
           item.num = +item.keepNum;
           if (item.id === itemId) {
             everyID.map((items) => {
               if (items.goodsSn === item.goodsSn) {
                 item.invGoodsNameId = items.newId;
               }
             });
           }
           return (({ id, invGoodsNameId, size, unit, num, price, amount, taxAmount, totalAmount }) => (
             { id, invGoodsNameId, size, unit, num, price, amount, taxAmount, totalAmount }))(item);
         });
         console.log(this.state.editList.every(item => +item.invGoodsId !== 0));
         if (!this.state.editList.filter(item => item.editable !== false).every(item => +item.invGoodsId !== 0)) {
           message.warning('请选择发票商品名称');
           return false;
         }
         dispatch({
           type: 'financePurchaseInInvDetail/getCheckRowMX',
           payload: {
             invId: this.state.InvoiceNum,
             invGoodsList,
             isSuitDetailMask: false,
             isSuitDetail: 1,
             notSuitDetailMask: false,
             goodsCheckboxIds: [],
             financeRemark
           },
         });
       } else {
         const invGoodsList = nSuitDetailList.filter(item => item.editable !== false).map((item) => {
           item.invGoodsNameId = item.id;
           return (({ invGoodsNameId, size, unit, num, price, amount, taxAmount, totalAmount }) => (
             { invGoodsNameId, size, unit, num, price, amount, taxAmount, totalAmount }))(item);
         });
         dispatch({
           type: 'financePurchaseInInvDetail/getCheckRowMX',
           payload: {
             invId: this.state.InvoiceNum,
             invGoodsList,
             isSuitDetailMask: false,
             isSuitDetail: 0,
             notSuitDetailMask: false,
             goodsCheckboxIds: [],
             financeRemark
           },
         });
       }
       this.setState({
         nMXSum: 0,
         InvoiceNum: -1,
         InvoiceMoney: '',
         InvoiceDate: '',
         InvoiceSn: '',
       });
     }
     notCheckRowMX=() => {
       const { dispatch } = this.props;
       dispatch({
         type: 'financePurchaseInInvDetail/updateStateReducer',
         payload: {
           isSuitDetailMask: false,
           goodsCheckboxIds: [],
         },
       });
       this.setState({
         sum: 0,
         taxSum: 0,
         amountSum :0,
       });
     }
     nNotCheckRowMX=() => {
       const { dispatch } = this.props;
       dispatch({
         type: 'financePurchaseInInvDetail/updateStateReducer',
         payload: {
           notSuitDetailMask: false,
           nSuitDetailList: [],
         },
       });
       this.setState({
         nMXSum: 0,
         nMXAmount: 0,
          nMXTax: 0,
       });
     }
     hideMoneytoolTipOk=() => {
       const { dispatch } = this.props;
       dispatch({
         type: 'financePurchaseInInvDetail/updateStateReducer',
         payload: {
           isMoneyMask: false,
         },
       });
       this.sendData();
     }
     hideMoneytoolTipCanCel=() => {
       const { dispatch } = this.props;
       dispatch({
         type: 'financePurchaseInInvDetail/updateStateReducer',
         payload: {
           isMoneyMask: false,
         },
       });
     }
  // 搜索发票商品
     handleSearchInvGoodsName(goodsKeywords) {
       const { dispatch } = this.props;
       dispatch({
         type: 'financePurchaseInInvDetail/updateState',
         payload: {
           isShowInvGoodsNameModal: true,
         },
       });
       dispatch({
         type: 'financePurchaseInInvDetail/getInvGoodsNameListData',
         payload: {
           goodsKeywords,
           currentPage: 1,
         },
       });
     }
     // 不对应明细的勾选
     handleCheckGoods(selectedIds, selectedRows) {
       const { dispatch } = this.props;
       dispatch({
         type: 'financePurchaseInInvDetail/updateState',
         payload: {
           selectedIds,
           selectedRows,
         },
       });
     }
     nSuitCheckOk=() => {
       const { dispatch, financePurchaseInInvDetail } = this.props;
       const { selectedRows, nSuitDetailList } = financePurchaseInInvDetail;
       this.state.list.concat(selectedRows);
       const addIndexNSuitDetailList = nSuitDetailList.concat(selectedRows)
       addIndexNSuitDetailList.forEach((item,index)=>{
           item.index=index
       })
       dispatch({
         type: 'financePurchaseInInvDetail/updateState',
         payload: {
           nSuitDetailList: addIndexNSuitDetailList,
           isShowInvGoodsNameModal: false,
           selectedIds: [],
           selectedRows: [],
         },
       });
     }
     nSuitCheckCancel=() => {
       const { dispatch } = this.props;
       dispatch({
         type: 'financePurchaseInInvDetail/updateState',
         payload: {
           isShowInvGoodsNameModal: false,
         },
       });
     }
     // 删除行
     handleDeleteColumn(id) {
       const { dispatch, financePurchaseInInvDetail } = this.props;
       const { nSuitDetailList } = financePurchaseInInvDetail;
       const index = nSuitDetailList.findIndex(element => element.id === id);
       nSuitDetailList.splice(index, 1);
       this.state.list.splice(index, 1);
       dispatch({
         type: 'financePurchaseInInvDetail/updateState',
         payload: {
           nSuitDetailList,
         },
       });
     }
     // 新建弹窗
     showAddInvoiceGoodsNameModal=() => {
       const { dispatch } = this.props;
       const { addInvoiceGoodsNameList } = this.props.financePurchaseInInvDetail;
       if (addInvoiceGoodsNameList.length === 0) {
         addInvoiceGoodsNameList.push({ isAdd: true });
       }

       dispatch({
         type: 'financePurchaseInInvDetail/updateState',
         payload: {
           isShowAddInvoiceGoodsNameModal: true,
           addInvoiceGoodsNameList,
         },
       });
     }
  // 保存新建数据
     saveAdd(type, e) {
       const { dispatch } = this.props;
       const { addInvoiceGoodsNameList } = this.props.financePurchaseInInvDetail;

       addInvoiceGoodsNameList[0][type] = e.target.value;
       dispatch({
         type: 'financePurchaseInInvDetail/updateState',
         payload: {
           addInvoiceGoodsNameList,
         },
       });
     }
     handleAddInvoiceGoodsNameModalOk=() => {
       const { dispatch } = this.props;
       dispatch({
         type: 'financePurchaseInInvDetail/handleAddInvoiceGoodsNameModalOk',
         payload: {
           isShowAddInvoiceGoodsNameModal: false,
         },
       });
     }
     handleAddInvoiceGoodsNameModalCancel=() => {
       const { dispatch } = this.props;
       dispatch({
         type: 'financePurchaseInInvDetail/updateState',
         payload: {
           isShowAddInvoiceGoodsNameModal: false,
         },
       });
     }
  // 保存修改发票明细数据
     saveEdit(type, record, e) {
       const { dispatch } = this.props;
       const { nSuitDetailList, taxRate } = this.props.financePurchaseInInvDetail;
       const index = nSuitDetailList.findIndex((element => element.index === record.index));
       switch (type) {
         case 'num':
           nSuitDetailList[index].num = +e.target.value;
           !nSuitDetailList[index].price && (nSuitDetailList[index].price = 0);
           nSuitDetailList[index].amount = NP.round(NP.times(+nSuitDetailList[index].num, +nSuitDetailList[index].price), 2);
           nSuitDetailList[index].taxAmount = NP.round(NP.times(+nSuitDetailList[index].num, +nSuitDetailList[index].price, +taxRate), 2);
           nSuitDetailList[index].totalAmount = NP.round(NP.plus(nSuitDetailList[index].amount, nSuitDetailList[index].taxAmount), 2);

           break;
         case 'price':

           nSuitDetailList[index].price = e.target.value;
           !nSuitDetailList[index].num && (nSuitDetailList[index].num = 0);
           break;
         case 'amount':
         if(!nSuitDetailList[index].num){
           message.warning("请输入商品数量");
           return;
         }
          nSuitDetailList[index].amount = e.target.value;
          nSuitDetailList[index].price = NP.round(NP.divide(+nSuitDetailList[index].amount, +nSuitDetailList[index].num),9)
          nSuitDetailList[index].taxAmount = NP.round(NP.times(+nSuitDetailList[index].num, +nSuitDetailList[index].price, +taxRate), 2);
         case 'taxAmount':
           nSuitDetailList[index][type] = e.target.value;
           nSuitDetailList[index].totalAmount = NP.round(NP.plus(nSuitDetailList[index].amount, nSuitDetailList[index].taxAmount), 2);

           break;
         case 'totalAmount':
           nSuitDetailList[index][type] = e.target.value || 0;
           break;
         default:
           nSuitDetailList[index][type] = e.target.value;
           break;
       }

       if (nSuitDetailList.length > 0) {
         this.state.nMXSum = nSuitDetailList.filter(item => item.totalAmount).reduce((total, item) => {
           return NP.plus(NP.round(+total, 2), NP.round(+item.totalAmount, 2));
         }, 0);
         this.state.nMXAmount = nSuitDetailList.filter(item => item.amount).reduce((total, item) => {
          return NP.plus(NP.round(+total, 2), NP.round(+item.amount, 2));
        }, 0);
        this.state.nMXTax = nSuitDetailList.filter(item => item.taxAmount).reduce((total, item) => {
          return NP.plus(NP.round(+total, 2), NP.round(+item.taxAmount, 2));
        }, 0);
       } else {
         this.state.nMXSum = 0;
         this.state.nMXAmount = 0;
         this.state.nMXTax = 0;
       }
       this.setState(prevstate => ({ list: prevstate.list }));
       this.setState(prevstate => ({ nMXSum: prevstate.nMXSum }));
       dispatch({
         type: 'financePurchaseInInvDetail/updateState',
         payload: {
           nSuitDetailList,
         },
       });
     }
     // 保存推送入库的修改
     saveEditEnd(type, record, e) {
       const { dispatch } = this.props;
       const { awaitStorageInvList, taxRate } = this.props.financePurchaseInInvDetail;

       this.state.awaitStorageInvList.forEach((item) => {
         if (item.detailList.findIndex(element => element.id === record.id) > -1) {
           const index = item.detailList.findIndex(element => element.id === record.id);
           switch (type) {
             case 'size':
               item.detailList[index].size = e.target.value;
               break;
             case 'unit':
               item.detailList[index].unit = e.target.value;
               break;
             case 'num':
               item.detailList[index].num = +e.target.value;
               !item.detailList[index].price && (item.detailList[index].price = 0);
               item.detailList[index].amount = NP.round(NP.times(+item.detailList[index].num, +item.detailList[index].price), 2);
               item.detailList[index].taxAmount = NP.round(NP.times(+e.target.value, +item.detailList[index].price, +taxRate), 2);
               item.detailList[index].totalAmount = NP.round(NP.plus(item.detailList[index].amount, item.detailList[index].taxAmount), 2);
               break;
             case 'price':
               item.detailList[index].price = e.target.value;
               !item.detailList[index].num && (item.detailList[index].num = 0);
               item.detailList[index].amount = NP.round(NP.times(+item.detailList[index].num, +item.detailList[index].price), 2);
               item.detailList[index].taxAmount = NP.round(NP.times(+e.target.value, +item.detailList[index].price, +taxRate), 2);
               item.detailList[index].totalAmount = NP.round(NP.plus(item.detailList[index].amount, item.detailList[index].taxAmount), 2);
               break;
             case 'amount':
             case 'taxAmount':
               item.detailList[index][type] = e.target.value;
               item.detailList[index].totalAmount = NP.round(NP.plus(item.detailList[index].amount, item.detailList[index].taxAmount), 2);
               break;
             case 'totalAmount':
               item.detailList[index][type] = e.target.value;
               break;
             default:
               //  item.detailList[index][type] = e.target.value;
               break;
           }
         }
         this.setState(prevstate => ({ list: prevstate.list }));
         this.setState(prevstate => ({ incomeMXSum: prevstate.incomeMXSum }));
       });

       this.setState(prevstate => ({ awaitStorageInvList: prevstate.awaitStorageInvList }));
     }
     incomeInvChange=(id) => {
       const { dispatch } = this.props;
       //  const { awaitStorageInvList } = this.props.financePurchaseInInvDetail;
       this.state.awaitStorageInvList.forEach((item) => {
         if (item.id === id) {
           this.state.isChangeId = id;
           item.isChange = true;
           item.detailList.forEach((items) => {
             items.isChange = true;
           });
         }
       });
       this.setState(prevstate => ({ awaitStorageInvList: prevstate.awaitStorageInvList }));
     }
     // 推送入库修改确认
     incomeInvChangeOk=(id) => {
       const { dispatch } = this.props;
       //  const { awaitStorageInvList } = this.props.financePurchaseInInvDetail;
       this.state.awaitStorageInvList.forEach((item) => {
         if (item.id === id) {
           this.state.isChangeId = id;
           item.isChange = false;
           item.detailList.forEach((items) => {
             items.isChange = false;
           });
           const checkedList = item.detailList.map((item) => {
             return (({ id, size, unit, num, price, amount, taxAmount, totalAmount }) => (
               { id, size, unit, num, price, amount, taxAmount, totalAmount }
             ))(item);
           });
           dispatch({
             type: 'financePurchaseInInvDetail/saveItemList',
             payload: {
               checkedList,
               invoiceId: item.id,
             },
           });
         }
       });
     }
     // 推送入库 取消修改
     incomeInvChangeCancel=(id) => {
       const { dispatch, financePurchaseInInvDetail } = this.props;
       const { awaitStorageInvList, saveSuccess } = financePurchaseInInvDetail;
       this.state.awaitStorageInvList = JSON.parse(JSON.stringify(awaitStorageInvList));

       this.state.awaitStorageInvList.forEach((item) => {
         if (item.id === id) {
           this.state.isChangeId = id;
           item.isChange = false;
           item.detailList.forEach((items) => {
             items.isChange = false;
           });
         }
       });
       this.setState(prevstate => ({ awaitStorageInvList: prevstate.awaitStorageInvList }));
     }
     ySuitDetail=() => {
       const { dispatch, financePurchaseInInvDetail } = this.props;
       const { detail } = financePurchaseInInvDetail;
       const list = JSON.parse(JSON.stringify(detail));
       this.state.editList = list;
       this.state.editList.forEach((item) => {
         item.editable = false;
       });
       dispatch({
         type: 'financePurchaseInInvDetail/updateState',
         payload: {
           isSuitDetailMask: true,
         },
       });
     }
    nSuitDetail=() => {
      const { dispatch, financePurchaseInInvDetail } = this.props;
      const { incomeInvoiceList } = financePurchaseInInvDetail;
      dispatch({
        type: 'financePurchaseInInvDetail/updateStateReducer',
        payload: {
          incomeInvoiceList,
          notSuitDetailMask: true,
        },
      });
    }

  // 打开编辑物流
  editorShippingOpen=(shippingNo) => {
    this.setState(prevstate => ({ isEditorShopping: !prevstate.isEditorShopping, shippingNo }));
  }
  // 编辑物流输入
  editorShippingNo=(e) => {
    this.setState({
      shippingNo: e.target.value,
    });
  }
  // 编辑物流确认事件
  editorShippingOk=() => {
    const { dispatch } = this.props;
    dispatch({
      type: 'financePurchaseInInvDetail/editorShippingOk',
      payload: {
        shippingNo: this.state.shippingNo,
      },
    });

    this.setState(prevstate => ({ isEditorShopping: !prevstate.isEditorShopping }));
  }
  // 打开编辑 备注
  editorRemarkOpen=(remark) => {
    this.setState(prevstate => ({ isEditorRemark: !prevstate.isEditorRemark, remark }));
  }
   // 编辑备注输入
   editorRemark=(e) => {
     this.setState({
       remark: e.target.value,
       // isChange: true,
     });
   }
    // 编辑备注确认事件
    editorRemarkOk=() => {
      const { dispatch } = this.props;
      dispatch({
        type: 'financePurchaseInInvDetail/editorRemarkOk',
        payload: {
          purchaseRemark: this.state.remark,
        },
      });
      this.setState(prevstate => ({ isEditorRemark: !prevstate.isEditorRemark }));
    }

    // 已有发票编辑事件
    editor=(id) => {
      this.state.copy.map((item) => {
        if (item.id === id) {
          item.isEditor = true;
        }
      });
      this.setState(prevstate => ({ copy: prevstate.copy }));
    }
    // 已有发票编辑输入
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
  // 已有发票事件编辑确认
    editorOk=(id) => {
      const { dispatch } = this.props;
      this.setState((prevstate) => {
        return ({ copy: prevstate.copy });
      });
      this.state.copy.forEach((item) => {
        if (item.id === id) {
          item.invoiceId = item.id;
          dispatch({
            type: 'financePurchaseInInvDetail/editorOk',
            payload: {
              invoiceId: item.invoiceId,
              invAmount: item.invAmount,
              invSn: item.invSn,
              invDate: item.invDate,
            },
          });
          item.isEditor = false;
        }
      });
    }
    // 已有发票事件删除事件
    delete=(id) => {
      const { dispatch } = this.props;
      dispatch({
        type: 'financePurchaseInInvDetail/delete',
        payload: {
          invId: id,
        },
      });
    }
    // 新增发票信息输入
    invoiceInput(type, e, dataStrings) {
      const { dispatch } = this.props;
      switch (type) {
        case 'invAmount':
        case 'invSn':
          dispatch({
            type: 'financePurchaseInInvDetail/updateState',
            payload: {
              [type]: e.target.value,
            },
          });
          break;
        case 'invDate':
          dispatch({
            type: 'financePurchaseInInvDetail/updateState',
            payload: {
              [type]: dataStrings,
            },
          });
          break;
        default:
          break;
      }
    }
    // 新增发票信息确定事件
    invInputOk=() => {
      const { dispatch, financePurchaseInInvDetail } = this.props;
      const { invAmount, invSn, invDate, incomeInvOrderId } = financePurchaseInInvDetail;

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
        type: 'financePurchaseInInvDetail/invInputOk',
        payload: {
          invAmount, invSn, invDate, incomeInvOrderId,
        },
      });
    }
    // 编辑 采购备注输入
    editorPurchaseRemark=(e) => {
      this.setState({
        purchaseRemark: e.target.value,
      });
    }
    // 编辑采购备注状态
        editorPurchaseOpen=(purchaseRemark) => {
          this.setState(prevstate => ({ isEditorPurchase: !prevstate.isEditorPurchase, purchaseRemark }));
        }
    // 编辑采购备注确认
    editorPurchaseOk=() => {
      const { dispatch } = this.props;

      dispatch({
        type: 'financePurchaseInInvDetail/editorPurchaseOk',
        payload: {
          remark: this.state.purchaseRemark,
        },
      });
      this.setState(prevstate => ({ isEditorPurchase: !prevstate.isEditorPurchase }));
    }
  // 是否对应明细
 onChangeIsSuitDetail = (e) => {
   const { dispatch } = this.props;
   dispatch({
     type: 'financePurchaseInInvDetail/onChangeIsSuitDetail',
     payload: {
       isSuitDetail: e.target.value,
     },
   });
 }
confirmActionList=(url, backUrl) => {
  // console.log(url, backUrl);
}
actionListOperation=(url, name, backUrl, type) => {
  const { dispatch } = this.props;
  this.state.actionOperationName = name;
  this.state.actionOperationUrl = url;
  this.state.actionOperationBackUrl = backUrl;
  this.state.actionOperationType = type;
  dispatch({
    type: 'financePurchaseInInvDetail/updateStateReducer',
    payload: {
      actionListOperationMask: true,
    },
  });
}
hideActionListMaskOk=() => {
  const { dispatch } = this.props;
  dispatch({
    type: 'financePurchaseInInvDetail/actionListOperationMaskOk',
    payload: {
      url: this.state.actionOperationUrl,
      backUrl: this.state.actionOperationBackUrl,
      remark: this.state.actionOperationRemark,
      actionListOperationMask: false,
    },
  });
}
hideActionListMaskCanCel=() => {
  const { dispatch } = this.props;
  dispatch({
    type: 'financePurchaseInInvDetail/updateStateReducer',
    payload: {
      actionListOperationMask: false,
    },
  });
}
actionListOperationRemark=(e) => {
  this.state.actionOperationRemark = e.target.value;
}

// 获取商品搜索
getGoodsKeyWords=(e) => {
  const { dispatch } = this.props;
  dispatch({
    type: 'financePurchaseInInvDetail/updateState',
    payload: {
      goodsKeywords: e.target.value,
    },
  });
}
// 不对应商品弹窗

handleChangeSiftItem(type, e, dataStrings) {
  const { dispatch, financePurchaseInInvDetail } = this.props;
  const { goodsKeywords, currentPage, pageSize } = financePurchaseInInvDetail;
  switch (type) {
    case 'goodsKeyWords':
      dispatch({
        type: 'financePurchaseInInvDetail/getInvGoodsNameListData',
        payload: {
          goodsKeywords,
          currentPage: 1,
        },
      });
      break;
    case 'currentPage':
      dispatch({
        type: 'financePurchaseInInvDetail/getInvGoodsNameListData',
        payload: {
          goodsKeywords,
          [type]: e,
          pageSize,
        },
      });
      break;
    case 'pageSize':
      dispatch({
        type: 'financePurchaseInInvDetail/getInvGoodsNameListData',
        payload: {
          goodsKeywords,
          currentPage,
          [type]: dataStrings,
        },
      });
      break;
    default:
      break;
  }
}
// 作废按钮
incomeInvDelete=(id) => {
  const { dispatch } = this.props;
  dispatch({
    type: 'financePurchaseInInvDetail/incomeInvDelete',
    payload: {
      id,
    },
  });
}
// 入库按钮
invBillInStorage=(id) => {
  const invBillAll = [];
  if (id !== 'all') {
    invBillAll.push(id);
  } else {
    const { financePurchaseInInvDetail } = this.props;
    const { awaitStorageInvList, storageInvList, realInvAmount } = financePurchaseInInvDetail;
    awaitStorageInvList.map((item) => {
      invBillAll.push(item.id);
    });
    const awaitStorageAmount = awaitStorageInvList.reduce((prev, item) => {
      return prev + (+item.invAmount);
    }, 0);
    const storageAmount = storageInvList.length > 0 ? storageInvList.reduce((prev, item) => {
      return prev + (+item.invAmount);
    }, 0) : 0;
    if ((+realInvAmount).toFixed(2) !== (+awaitStorageAmount + +storageAmount).toFixed(2)) {
      message.warning('金额与实际开票总额不符合');
      return false;
    }
  }
  const { dispatch } = this.props;
  dispatch({
    type: 'financePurchaseInInvDetail/invBillInStorage',
    payload: {
      incomeInvIdList: invBillAll,
    },
  });
}
render() {
  if (this.state.arr.length > 0) {
    this.state.sum = this.state.arr.reduce((total, item) => {
      return NP.plus(+total, +item.totalAmount);
    }, 0);
    this.state.amountSum = this.state.arr.reduce((total, item) => {
      return NP.plus(+total, +item.amount);
    }, 0);
    this.state.taxSum = this.state.arr.reduce((total, item) => {
      return NP.plus(+total, +item.taxAmount);
    }, 0);
  } else {
    this.state.sum = 0;
    this.state.taxSum = 0;
    this.state.amountSum = 0;

  }
  //  this.setState(prevstate=>({editList: prevstate.editList }))
  const { financePurchaseInInvDetail: {  // 在render中 用this.props 解构出你的state名 financePurchaseInInvDetail 变量
    isSuitDetailMask,
    iseditGoodsMask,
    notSuitDetailMask,
    isLoading,
    detail,
    invNameList,
    incomeInvoiceList,
    isMoneyMask,
    goodsCheckboxIds,
    nSuitDetailList,
    isShowInvGoodsNameModal,
    invoiceGoodsObj,
    isInvGoodsNameLoading,
    selectedIds,
    isShowAddInvoiceGoodsNameModal,
    addInvoiceGoodsNameList,
    awaitStorageInvList,
    storageInvList,
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
    purchaseRemark,
    isSuitDetail,
    actionList,
    canEdit,
    taxRate,

    invAmount,
    invSn,
    invDate,
    isOkloading,
    actionListOperationMask,
    //
    currentPage,
    pageSize,
    goodsKeywords,
    pageChange,
    awaitInvoiceBillSn,
    financeRemark
  },
  dispatch,
  } = this.props;
  const firstColumn = [
    {
      title: '采购单号',
      dataIndex: 'purchaseOrderSn',
      key: 'purchaseOrderSn',
      render: (purchaseOrderSn, record) => {
        return (
          record.isSalePurchase === 0 ?
            <Link to={`/purchase/purchase-order-management/common-purchase-list/common-purchase-detail/${purchaseOrderSn}`}>{purchaseOrderSn}</Link>
            : <Link to={`/purchase/purchase-order-management/sale-purchase/sale-purchase-order-list/sale-purchase-order-detail/${purchaseOrderSn}`}>{purchaseOrderSn}</Link>
        );
      },
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
            return <span key={item} style={{ background: item.color, color: '#fff', borderRadius: '5px', paddingLeft: '8px', paddingRight: '8px', marginRight: '5px' }}>{item.name}</span>;
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
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (totalAmount) => {
        return ([
          (<span style={{ color: 'red' }}>{totalAmount} </span>),
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
  const rowSelection = {
    selectedRowKeys: goodsCheckboxIds,
    onChange: (selectedRowKeys, selectedRows) => {
      this.state.editList.map((items) => {
        items.editable = false;
      });
      if (selectedRows.length > 0) {
        selectedRows.map((item) => {
          item.editable = true;
        });
      }
      this.state.editList.map((item) => {
        !item.keepNum && (item.keepNum = 0);
        !item.priceNoTax && (item.priceNoTax = 0);
        item.amount = NP.round(NP.times(item.keepNum, item.priceNoTax), 2);
        item.taxAmount = NP.round(NP.times(item.keepNum, item.priceNoTax, +taxRate), 2);
        item.totalAmount = NP.plus(item.amount, item.taxAmount);
      });
      this.setState(prevstate => ({ editList: prevstate.editList }));
      this.setState({
        editList: this.state.editList,
      });
      dispatch({
        type: 'financePurchaseInInvDetail/updateState',
        payload: {
          list: this.state.editList,
          goodsCheckboxIds: selectedRowKeys,
        },
      });
    },
  };
  const column = [
    {
      title: '采购单号',
      dataIndex: 'purchaseOrderSn',
      key: 'purchaseOrderSn',
      render: (purchaseOrderSn, record) => {
        return (
          record.isSalePurchase === 0 ?
            <Link to={`/purchase/purchase-order-management/common-purchase-list/common-purchase-detail/${purchaseOrderSn}`}>{purchaseOrderSn}</Link>
            : <Link to={`/purchase/purchase-order-management/sale-purchase/sale-purchase-order-list/sale-purchase-order-detail/${purchaseOrderSn}`}>{purchaseOrderSn}</Link>
        );
      },
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      key: 'goodsName',
      width: 280,
      render: (goodsName, record) => {
        return (
          [record.tag && record.tag.map((item) => {
            return <span key={item} style={{ background: item.color, color: '#fff', borderRadius: '5px', paddingLeft: '8px', paddingRight: '8px', marginRight: '5px' }}>{item.name}</span>;
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
      title: '发票商品名称',
      dataIndex: 'invGoodsName',
      key: 'invGoodsName',
      editable: false,
      render: (invGoodsName, record) => {
        return (
          [
            (<p> <span>{invGoodsName}</span> <span className={styles.edit} onClick={this.editableOpen.bind(this, record.goodsSn, record.id)}>编辑</span>   </p>),
          ]
        );
      },
    },
    {
      title: '规格',
      dataIndex: 'size',
      key: 'size',
      render: (size, record) => {
        return (
          record.editable ?
            <Input value={size} onChange={this.sizeValue.bind(this, record)} style={{ width: 100 }} />
            : <span>{size}</span>
        );
      },
    },
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
      render: (unit, record) => {
        return (
          record.editable ? <Input style={{ width: 100 }} value={unit} onChange={this.unitValue.bind(this, record)} /> : <span>{unit}</span>
        );
      },
    }, {
      title: '数量',
      dataIndex: 'keepNum',
      key: 'keepNum',
      render: (keepNum, record) => {
        return (
          record.editable ? <Input style={{ width: 100 }} value={keepNum} onChange={this.numValue.bind(this, record)} /> : <span>{keepNum}</span>
        );
      },
    },
    {
      title: '单价',
      dataIndex: 'priceNoTax',
      key: 'priceNoTax',
      render: (price, record) => {
        return (
          record.editable ? <Input style={{ width: 100 }} value={price} onChange={this.priceValue.bind(this, record)} /> : <span>{price}</span>
        );
      },
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount, record) => {
        return (
          record.editable ? <Input style={{ width: 100 }} value={amount} onChange={this.amountValue.bind(this, record)} /> : <span>{amount}</span>
        );
      },
    },
    {
      title: '税额',
      dataIndex: 'taxAmount',
      key: 'taxAmount',
      render: (taxAmount, record) => {
        return (
          record.editable ? <Input style={{ width: 100 }} value={taxAmount} onChange={this.taxAmountValue.bind(this, record)} /> : <span>{taxAmount}</span>
        );
      },
    },
    {
      title: '价税合计',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (totalAmount, record) => {
        return (
          record.editable ? <Input style={{ width: 100 }} value={totalAmount} onChange={this.totalAmountValue.bind(this, record)} /> : <span>{totalAmount}</span>
        );
      },
    },
  ];


  // 修改不对应明细
  const nSuitDetailListColumn = [
    {
      dataIndex: 'operator',
      key: 'operator',
      width: 80,
      align: 'center',
      render: (_, record) => (
        record.isExtraRow ? null :
        <Icon type="minus" style={{ cursor: 'pointer', fontSize: '17px', fontWeight: 'bold', border: '1px solid #ccc', borderRadius: '4px', color: '#ccc' }} onClick={this.handleDeleteColumn.bind(this, record.id)} />
      ),
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      key: 'goodsName',
      width: '300px',
    },
    {
      title: '条码',
      dataIndex: 'goodsSn',
      key: 'goodsSn',
      render: (value, record) => (
        record.isExtraRow ? null :
        <span>{value}</span>
      ),
    },
    {
      title: '发票商品名称',
      dataIndex: 'invGoodsName',
      key: 'invGoodsName',
      width: '300px',
      render: (value, record) => {
        if (record.isExtraRow) {
          return {
            children: (
              <div>
                <Search
                  style={{ width: 250, marginLeft: 20 }}
                  enterButton="更多"
                  placeholder="发票商品名称/商品名称"
                  onChange={this.getGoodsKeyWords}
                  onSearch={this.handleChangeSiftItem.bind(this, 'goodsKeyWords')}
                />
              </div>
            ),
          };
        } else {
          return {
            children: <span>{value}</span>,
          };
        }
      },
    },
    {
      title: '规格',
      dataIndex: 'size',
      key: 'size',
      width: '100px',
      render: (value, record) => (
        record.isExtraRow ? null :
        <Input
          onPressEnter={this.saveEdit.bind(this, 'size', record)}
          onChange={this.saveEdit.bind(this, 'size', record)}
          value={value}
        />
      ),
    },
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
      width: '80px',
      render: (value, record) => (
        record.isExtraRow ? null :
        <Input
          onPressEnter={this.saveEdit.bind(this, 'unit', record)}
          onChange={this.saveEdit.bind(this, 'unit', record)}
          value={value}
        />
      ),
    },
    {
      title: '数量',
      dataIndex: 'num',
      key: 'num',
      render: (value, record) => (
        record.isExtraRow ? null :
        <Input
          onPressEnter={this.saveEdit.bind(this, 'num', record)}
          onChange={this.saveEdit.bind(this, 'num', record)}
          value={value}
        />
      ),
    },
    {
      title: '单价',
      dataIndex: 'price',
      key: 'price',
      render: (value, record) => (
        record.isExtraRow ? null :
        <Input
          onPressEnter={this.saveEdit.bind(this, 'price', record)}
          onChange={this.saveEdit.bind(this, 'price', record)}
          value={value}
        />
      ),
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (value, record) => (
        record.isExtraRow ? null :
        <Input
          onPressEnter={this.saveEdit.bind(this, 'amount', record)}
          onChange={this.saveEdit.bind(this, 'amount', record)}
          value={value}
        />

      ),
    },
    {
      title: '税额',
      dataIndex: 'taxAmount',
      key: 'taxAmount',
      render: (value, record) => (
        record.isExtraRow ? null :
        <Input
          onPressEnter={this.saveEdit.bind(this, 'taxAmount', record)}
          onChange={this.saveEdit.bind(this, 'taxAmount', record)}
          value={value}
        />
      ),
    },
    {
      title: '价税合计',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (value, record) => (
        record.isExtraRow ? null :
        <Input
          onPressEnter={this.saveEdit.bind(this, 'totalAmount', record)}
          onChange={this.saveEdit.bind(this, 'totalAmount', record)}
          value={value}
        />
      ),
    },
  ];
  const invoiceGoodsListColumns = [
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      key: 'goodsName',
      align: 'center',
      width: '300px',
      render: (value, record) => (
        record.isAdd ?
          (
            <Input
              onPressEnter={this.saveAdd.bind(this, 'goodsName')}
              onBlur={this.saveAdd.bind(this, 'goodsName')}
              defaultValue={value}
            />
          ) : <div>{value}</div>
      ),
    },
    {
      title: '条码',
      dataIndex: 'goodsSn',
      key: 'goodsSn',
      align: 'center',
      render: (value, record) => (
        record.isAdd ?
          (
            <Input
              onPressEnter={this.saveAdd.bind(this, 'goodsSn')}
              onBlur={this.saveAdd.bind(this, 'goodsSn')}
              defaultValue={value}
            />
          ) : <div>{value}</div>
      ),
    },
    {
      title: '发票商品名称',
      dataIndex: 'invGoodsName',
      key: 'invGoodsName',
      align: 'center',
      render: (value, record) => (
        record.isAdd ?
          (

            <Input
              onPressEnter={this.saveAdd.bind(this, 'invGoodsName')}
              onBlur={this.saveAdd.bind(this, 'invGoodsName')}
              defaultValue={value}
            />
          ) : <div>{value}</div>
      ),
    },
    {
      title: '规格',
      dataIndex: 'size',
      key: 'size',
      width: '150px',
      align: 'center',
      render: (value, record) => (
        record.isAdd ?
          (

            <Input
              onPressEnter={this.saveAdd.bind(this, 'size')}
              onBlur={this.saveAdd.bind(this, 'size')}
              defaultValue={value}
            />
          ) : <div>{value}</div>
      ),
    },
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
      width: '150px',
      align: 'center',
      render: (value, record) => (
        record.isAdd ?
          (
            <Input
              onPressEnter={this.saveAdd.bind(this, 'unit')}
              onBlur={this.saveAdd.bind(this, 'unit')}
              defaultValue={value}
            />
          ) : <div>{value}</div>
      ),
    },
  ];

  // 关于入库
  const inconmeInvColumn = [
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      key: 'goodsName',
      width: '300px',
    },
    {
      title: '条码',
      dataIndex: 'goodsSn',
      key: 'goodsSn',
    },
    {
      title: '发票商品名称',
      dataIndex: 'invGoodsName',
      key: 'invGoodsName',
      width: '300px',
    },
    {
      title: '规格',
      dataIndex: 'size',
      key: 'size',
      width: '100px',
      render: (value, record) => (
        record.isChange ?
          <Input
            onChange={this.saveEditEnd.bind(this, 'size', record)}
            value={value}
          /> :
          <span>{value}</span>
      ),
    },
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
      width: '80px',
      render: (value, record) => (
        record.isChange ?
          <Input
            onChange={this.saveEditEnd.bind(this, 'unit', record)}
            value={value}
          /> :
          <span>{value}</span>
      ),
    },
    {
      title: '数量',
      dataIndex: 'num',
      key: 'num',
      render: (value, record) => (
        record.isChange ?
          <Input
            onChange={this.saveEditEnd.bind(this, 'num', record)}
            value={value}
          /> :
          <span>{value}</span>
      ),
    },
    {
      title: '单价',
      dataIndex: 'price',
      key: 'price',
      render: (value, record) => (
        record.isChange ?
          <Input
            onChange={this.saveEditEnd.bind(this, 'price', record)}
            value={value}
          /> :
          <span>{value}</span>
      ),
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (value, record) => (
        record.isChange ?
          <Input
            onChange={this.saveEditEnd.bind(this, 'amount', record)}
            value={value}
          /> :
          <span>{value}</span>
      ),
    },
    {
      title: '税额',
      dataIndex: 'taxAmount',
      key: 'taxAmount',
      render: (value, record) => (
        record.isChange ?
          <Input
            onChange={this.saveEditEnd.bind(this, 'taxAmount', record)}
            value={value}
          /> :
          <span>{value}</span>
      ),
    },
    {
      title: '价税合计',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (value, record) => (
        record.isChange ?
          <Input
            onChange={this.saveEditEnd.bind(this, 'totalAmount', record)}
            value={value}
          /> :
          <span>{value}</span>
      ),
    },
  ];

  return (
    <PageHeaderLayout title={pageChange === '1' ? '来票跟进表详情' : pageChange === '2' ? '未开票金额列表详情' : '采购来票单详情'}>
      <Card bordered={false} >
        <div>
          <Card>
            <div style={{ background: '#f2f2f2', padding: 20, marginBottom: 30 }}>
              <Row style={{ marginTop: 10 }}>
                <Col span={2}>状态：<span style={{ color: 'red', fontWeight: 'bold' }}>{status}</span></Col>
                <Col span={4}>来票单号：<span style={{ fontWeight: 'bold' }}>{incomeInvOrderSn}</span></Col>
                <Col span={6}>供应商：<span style={{ fontWeight: 'bold' }}>{supplierName}</span></Col>
                <Col span={3}>采购员：<span style={{ fontWeight: 'bold' }}>{purchaserName}</span></Col>
                <Col span={4}>创建时间：<span style={{ fontWeight: 'bold' }}>{createTime}</span></Col>
                <Col style={{ float: 'right' }}>
                  {actionList.map((actionInfo) => {
                switch (+actionInfo.type) {
                    case 4:
                    return (
                      <Button type="primary" style={{ marginLeft: 10 }} onClick={this.actionListOperation.bind(this, actionInfo.url, actionInfo.name, actionInfo.backUrl, actionInfo.type)}>{actionInfo.name}</Button>
                    );
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
                  //  <Popconfirm title={`是否确定做${actionInfo.name}操作?`} onConfirm={this.confirmActionList.bind(this, actionInfo.url, actionInfo.backUrl)} onCancel={this.cancelActionList} okText="确定" cancelText="取消">
                  //    <Button
                  //      type="primary"
                  //      style={{ marginLeft: 10 }}
                  //     //  onClick={this.handleClickActionPopUP.bind(this, actionInfo.url, actionInfo.name, actionInfo.backUrl)}
                  //    >
                  //      {actionInfo.name}
                  //    </Button>
                  //  </Popconfirm>
                   <Button type="primary" style={{ marginLeft: 10 }} onClick={this.actionListOperation.bind(this, actionInfo.url, actionInfo.name, actionInfo.backUrl, actionInfo.type)}>{actionInfo.name}</Button>
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
                <Col span={5}>物流单号：{ this.state.isEditorShopping ? <Input value={this.state.shippingNo} style={{ width: 200 }} onChange={this.editorShippingNo.bind(this)} /> : <span style={{ fontWeight: 'bold' }}> {this.state.shippingNo ? this.state.shippingNo : shippingNo}</span> }  </Col>
                { canEdit === 1 ? (!this.state.isEditorShopping ? <Col span={1}>   <Icon type="edit" style={{ fontSize: 18 }} onClick={this.editorShippingOpen.bind(this, this.state.shippingNo ? this.state.shippingNo : shippingNo)} /></Col>
             : <Col span={1}> <Button disabled={isOkloading} onClick={this.editorShippingOk.bind(this)} > 确定</Button></Col>) : null}
                <Col span={4} >备注：{ this.state.isEditorRemark ? <Input value={this.state.remark} style={{ width: 160 }} onChange={this.editorRemark.bind(this)} /> : <span style={{ fontWeight: 'bold' }}> {this.state.remark ? this.state.remark : purchaseRemark}</span> }  </Col>
                { canEdit === 1 ? (!this.state.isEditorRemark ? <Col span={1}>   <Icon type="edit" style={{ fontSize: 18 }} onClick={this.editorRemarkOpen.bind(this, this.state.remark ? this.state.remark : purchaseRemark)} /></Col>
            : <Col span={2}> <Button disabled={isOkloading} onClick={this.editorRemarkOk.bind(this)} > 确定</Button></Col>) : null}
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
                              <Col span={2}> <Button disabled={isOkloading} onClick={this.editorOk.bind(this, item.id)} > 确定</Button></Col>
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
                      <Col span={6}>发票日期：<DatePicker value={moment(invDate)} onChange={this.invoiceInput.bind(this, 'invDate')} allowClear={false} /></Col>
                      <Col span={2}><Button disabled={isOkloading} onClick={this.invInputOk} >确定</Button></Col>
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
                <Col span={6}>采购备注：{ this.state.isEditorPurchase ? <TextArea rows={3} value={this.state.purchaseRemark} style={{ width: 260 }} onChange={this.editorPurchaseRemark.bind(this)} /> : <pre style={{ fontWeight: 'bold' }}> {this.state.purchaseRemark ? this.state.purchaseRemark : remark}</pre> }  </Col>
                { canEdit === 1 ? (!this.state.isEditorPurchase ? <Col span={1}>   <Icon type="edit" style={{ fontSize: 18 }} onClick={this.editorPurchaseOpen.bind(this, this.state.purchaseRemark ? this.state.purchaseRemark : remark)} /></Col>
            : <Col span={2}> <Button disabled={isOkloading} onClick={this.editorPurchaseOk.bind(this)} > 确定</Button></Col>) : null}
              </Row>
            </div>
            <Table
              bordered
              loading={isLoading}
              dataSource={detail}
              columns={firstColumn}
              rowKey={record => record.id}
              pagination={false}
            />
            {status === '待财务入库' ?
              <Row style={{ marginTop: 10 }} >
                <Col span={3}><Button type="primary" onClick={this.ySuitDetail.bind(this)} >对应明细分票</Button> </Col>
                <Col><Button type="primary" onClick={this.nSuitDetail} >不对应明细分票</Button></Col>
              </Row> : null}
          </Card>

          {/*      上面得 */}

          { this.state.awaitStorageInvList.length > 0 ? (
            <div>
              <Row className={styles.classifyType}>
                <Col span={18} style={{ marginLeft: 30 }}>待推送入库发票({ this.state.awaitStorageInvList.length})</Col>
                <Col style={{ float: 'right', marginRight: 30 }}><Button type="primary" onClick={this.invBillInStorage.bind(this, 'all')}>全部入库</Button></Col>
              </Row>
              <Card>
                <div>
                  { this.state.awaitStorageInvList && this.state.awaitStorageInvList.map(item => (
                    <div style={{ marginBottom: 30 }}>
                      <Row style={{ fontSize: 18, marginBottom: 10 }}><Col span={4}>操作时间：{item.time}</Col></Row>
                      <Row style={{ fontSize: 18, marginBottom: 10 }}>
                        <Col span={4}>发票号：<span style={{ fontWeight: 'bold' }}>{item.invSn}</span></Col>
                        <Col span={4}>发票金额：<span style={{ fontWeight: 'bold', color: 'red' }}>{item.invAmount}</span></Col>
                        <Col span={5}>发票日期：<span style={{ fontWeight: 'bold' }}>{item.invDate}</span></Col>
                        <Col span={10}>备注:<span style={{ fontWeight: 'bold' }}>{item.financeRemark}</span></Col>
                        <Col style={{ float: 'right' }}><Button type="primary" onClick={this.invBillInStorage.bind(this, item.id)}>入库</Button></Col>
                      </Row>
                      <Table
                        bordered
                        rowKey={record => record.id}
                        dataSource={item.detailList}
                        columns={inconmeInvColumn}
                        pagination={false}
                      />
                      <Row className={styles.btn}>
                        <Col>
                          {!item.isChange ? <Button disabled={item.isChange} onClick={this.incomeInvChange.bind(this, item.id)}>修改</Button>
                      :
                          <div>
                            <Button onClick={this.incomeInvChangeCancel.bind(this, item.id)}>取消修改</Button>
                            <Button onClick={this.incomeInvChangeOk.bind(this, item.id)}>保存</Button>
                          </div>
                      }
                        </Col>
                        <Col><Button onClick={this.incomeInvDelete.bind(this, item.id)}>作废</Button></Col>
                      </Row>
                    </div>
                  ))

                }
                </div>
              </Card>
            </div>
          ) : null}

          {storageInvList.length > 0 ? (
            <div>
              <Row className={styles.classifyType}><Col span={18} style={{ marginLeft: 30 }}>已入库发票（{storageInvList.length}）</Col></Row>
              <Card>
                <div >


                  { storageInvList && storageInvList.map(item => (
                    <div style={{ marginBottom: 30 }}>
                      <Row style={{ fontSize: 18, marginBottom: 10 }}><Col span={4}>操作时间：{item.time}</Col></Row>
                      <Row style={{ fontSize: 18 }}>
                        <Col span={4}>发票号：<span style={{ fontWeight: 'bold' }}>{item.invSn}</span></Col>
                        <Col span={4}>发票金额：<span style={{ fontWeight: 'bold', color: 'red' }}>{item.invAmount}</span></Col>
                        <Col span={14}>发票日期：<span style={{ fontWeight: 'bold' }}>{item.invDate}</span></Col>
                      </Row>
                      <Table
                        bordered
                        rowKey={record => record.id}
                        dataSource={item.detailList}
                        columns={inconmeInvColumn}
                        pagination={false}
                      />
                    </div>
                ))

              }
                </div>
              </Card>
            </div>
            ) : null}
          {/*  关于是否明细分票  */}
          <Modal
            visible={isSuitDetailMask}
            title="对应明细来票"
            width={1800}
            closable={false}
                //  onOk={this.handleOk}
                //  onCancel={this.handleCancel}
            footer={null}
          >
            <Row style={{ margin: 10 }}>
              <Col span={3} style={{ paddingBottom: 4 }}>发票号：
                <Select placeholder="请选择发票号" style={{ width: 120 }} value={this.state.InvoiceSn} onChange={this.handleChangeInvoice}>
                  {awaitInvoiceBillSn && awaitInvoiceBillSn.map(item => (
                    <Option key={item.id}>{item.invSn}</Option>
                   ))
                  }
                </Select>
              </Col>
              <Col span={3}>发票金额：<span style={{ color: 'red', fontWeight: 'bold' }}>{this.state.InvoiceMoney}</span></Col>
              <Col span={3}>发票日期：<span style={{ fontWeight: 'bold' }}>{this.state.InvoiceDate}</span></Col>
              <Col span={8}>备注: <Input style={{ width: 360 }} onBlur={this.addRemarks}/></Col>
            </Row>
            <Table
              bordered
              loading={isLoading}
              dataSource={this.state.editList}
              columns={column}
              pagination={false}
              rowSelection={rowSelection}
              rowKey={record => record.id}
            />
            <Row style={{ marginTop: 20 }}>
              <Col span={2} offset={17}>金额合计：<span style={{color :"red", fontWeight : "bold"}}>{this.state.amountSum}</span></Col>
              <Col span={2}>税额合计：<span style={{color :"red", fontWeight : "bold"}}>{this.state.taxSum}</span></Col>
              <Col span={3}>所选商品价税合计总额：<span style={{color :"red", fontWeight : "bold"}}>{this.state.sum}</span></Col>
            </Row>
            <Row style={{ marginTop: 20 }} >
              <Col span={22} push={20} ><Button style={{ width: 100 }} onClick={this.notCheckRowMX} >取消</Button></Col>
              <Col span={2}><Button type="primary" style={{ width: 100, marginLeft: 30 }} onClick={this.getCheckRowMX.bind(this, 'y')}>确定</Button></Col>
            </Row>
          </Modal>

          <Modal
            visible={iseditGoodsMask}
            title={<div className={styles.editGoodsName}><span>编辑发票商品名称</span> </div>}
            // <Button onClick={this.hideEditGoodsDelete}  >删除选中</Button> 
            width={600}
            wrapClassName="test"
            closable={false}
              //  onOk={this.handleOk}
              //  onCancel={this.handleCancel}
            onOk={this.hideEditGoodsOk}
            onCancel={this.hideEditGoodsCanCel}
            okText="确认"
            cancelText="取消"
          >
            <RadioGroup onChange={this.radioGroupValue} value={this.state.radioGroupValue}>
              {invNameList && invNameList.map(item => (
                <Row style={{ margin: 10 }}>
                  <Radio value={item.id}>{item.name}</Radio>
                </Row>
                ))}
            </RadioGroup>
            <Row>
              <Input style={{ width: 360, marginLeft: 10 }} onChange={this.editGoods} /> <Button onClick={this.editGoodsOk}>添加</Button>
            </Row>
          </Modal>


          <Modal
            visible={notSuitDetailMask}
            title="不对应明细来票"
            width={1800}
            closable={false}
           //  onOk={this.handleOk}
           //  onCancel={this.handleCancel}
            footer={null}
          >
            <Row style={{ margin: 10 }}>
              <Col span={3} style={{ paddingBottom: 4 }}>发票号：
                <Select placeholder="请选择发票号" style={{ width: 120 }} onChange={this.handleChangeInvoice}>
                  {awaitInvoiceBillSn && awaitInvoiceBillSn.map(item => (
                    <Option value={item.id}>{item.invSn}</Option>
                        ))
                        }
                </Select>
              </Col>
              <Col span={3}>发票金额：<span style={{ color: 'red', fontWeight: 'bold' }}>{this.state.InvoiceMoney}</span></Col>
              <Col span={3}>发票日期：<span style={{ fontWeight: 'bold' }}>{this.state.InvoiceDate}</span></Col>
              <Col span={8}>备注: <Input style={{ width: 360 }} onBlur={this.addRemarks}/></Col>
            </Row>
            <Table
              bordered
              loading={isLoading}
              dataSource={nSuitDetailList.concat({ id: '更多', isExtraRow: true })}
              columns={nSuitDetailListColumn}
              pagination={false}
              rowKey={record => record.id}
            />
            <Row className={styles.btn} >
              <p> 金额合计：<span style={{ color: 'red', fontWeight: 'bold' }}>{this.state.nMXAmount}</span></p>
              <p> 税额合计：<span style={{ color: 'red', fontWeight: 'bold' }}>{this.state.nMXTax}</span></p>
              <p> 所选商品价税合计总额：<span style={{ color: 'red', fontWeight: 'bold' }}>{this.state.nMXSum}</span></p>
            </Row>
            <Row className={styles.btn}>
              <Button onClick={this.nNotCheckRowMX} >取消</Button>  <Button onClick={this.getCheckRowMX.bind(this, 'n')}>确定</Button>
            </Row>
          </Modal>
          <Modal
            closable={false}
            maskClosable={false}
            width={1200}
            visible={isShowInvGoodsNameModal}
            onOk={this.nSuitCheckOk}
            onCancel={this.nSuitCheckCancel}
          >
            <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginTop: 10, marginBottom: 25 }}>
              <Col md={12} style={{ height: 26, lineHeight: '26px' }}>
                <div>
                  <Search
                    style={{ width: 320, marginLeft: 20 }}
                    enterButton="搜索"
                    value={goodsKeywords}
                    placeholder="请输入商品名称/条码/发票商品名称"
                    onChange={this.getGoodsKeyWords}
                    onSearch={this.handleChangeSiftItem.bind(this, 'goodsKeyWords')}
                  />
                </div>
              </Col>
              <Col md={2} offset={9} style={{ height: 26, lineHeight: '26px' }}>
                <Button type="primary" onClick={this.showAddInvoiceGoodsNameModal}>新建</Button>
              </Col>
            </Row>
            <Table
              bordered
              loading={isInvGoodsNameLoading}
              rowKey={record => record.id}
              rowSelection={{
                selectedRowKeys: selectedIds,
                onChange: this.handleCheckGoods.bind(this),
                // getCheckboxProps: record => ({
                //   disabled: nSuitDetailList.some((goodsInfo) => {
                //     return record.id === goodsInfo.id;
                //   }),
                // }),
              }}
              dataSource={invoiceGoodsObj.invoiceGoodsList}
              columns={invoiceGoodsListColumns}
              pagination={{
                current: currentPage,
                pageSize,
                onChange: this.handleChangeSiftItem.bind(this, 'currentPage'),
                onShowSizeChange: this.handleChangeSiftItem.bind(this, 'pageSize'),
                showSizeChanger: true,
                showQuickJumper: false,
               total: +invoiceGoodsObj.total,
              }}
            />
          </Modal>
          <Modal
            closable={false}
            maskClosable={false}
            width={1200}
            visible={isShowAddInvoiceGoodsNameModal}
            onOk={this.handleAddInvoiceGoodsNameModalOk.bind(this)}
            onCancel={this.handleAddInvoiceGoodsNameModalCancel.bind(this)}
          >
            <Table
              bordered
              rowKey={record => record.id}
              dataSource={addInvoiceGoodsNameList}
              columns={invoiceGoodsListColumns}
              pagination={false}
            />
          </Modal>
          <Modal
            visible={isMoneyMask}
            width={260}
            zIndex={3000}
            closable={false}
            onOk={this.hideMoneytoolTipOk}
            onCancel={this.hideMoneytoolTipCanCel}
            okText="确认"
            cancelText="取消"
          >
            <p>所选商品价税合计与发票金额不符!请确认是否生成发票</p>
          </Modal>


          <Modal
            title="操作"
            visible={actionListOperationMask}
            width={360}
            closable={false}
            onOk={this.hideActionListMaskOk}
            onCancel={this.hideActionListMaskCanCel}
            okText="确认"
            cancelText="取消"
          >
            {!this.state.actionOperationType ?
              <div>
                <Row> <Input placeholder="请输入备注" onBlur={this.actionListOperationRemark} /></Row>
                <Row><p style={{ textAlign: 'center' }}>请确认是否{this.state.actionOperationName}?</p></Row>
              </div>
            : <p style={{ textAlign: 'center' }}>请确认是否{this.state.actionOperationName}?</p> }
          </Modal>

        </div>
      </Card>
    </PageHeaderLayout>
  );
}
}
