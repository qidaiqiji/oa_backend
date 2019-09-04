import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Input, DatePicker, Select, Table, Dropdown, Menu, Row, Icon, Tooltip, message, Divider, Button, Col, Modal, InputNumber, notification } from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './SalesInvoiceForm.less';
import globalStyles from '../../assets/style/global.less';
import Search from '../../../node_modules/antd/lib/input/Search';
import { join } from 'path';
import Item from 'antd/lib/list/Item';
import NP from 'number-precision';
import { accessSync } from 'fs';

const { RangePicker } = DatePicker;
const { TextArea } = Input;
@connect(state => ({
  salesInvoiceFormList: state.salesInvoiceFormList,
}))
export default class SalesInvoiceForm extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'salesInvoiceFormList/mount',
    });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'salesInvoiceFormList/unmount',
    });
  }
  // 事件
  // 提交审核
  submissionOfAudit() {
    const { dispatch } = this.props;
    const { correspondingSchedule, wrongSchedule, sellerRemark, invoiceId, invNum, invType, invInfoId, invTypeId } = this.props.salesInvoiceFormList;
    const corres = correspondingSchedule.map((item) => {
      item.num = item.saleNum;
      return (({ id, num }) => ({ id, num }))(item);
    });

    const wrong = wrongSchedule.map((item) => {
      item.num = item.incorrectQuantity;
      item.price = item.salePrice;
      item.invItemId = item.invGoodsNameId;
      item.invNum = item.saleNum;
      return (({ id, num, invItemId, price, invNum }) => ({ id, num, invItemId, price, invNum }))(item);
    });
    dispatch({
      
      type: 'salesInvoiceFormList/updatePageReducer',
      payload: {
        suitGoodsList: corres,
        noSuitGoodsList: wrong,
        sellerRemark,
        confirmCheck: 1,
        invInfoId: invoiceId,
        visible: false,
        invType,
        isinvData: true,
      },
    });
    // 如果invtype是初始值的话，就将列表里的发票ID值给他
    if (+invType === 0) {
      dispatch({
        type: 'salesInvoiceFormList/updatePageReducer',
        payload: {
          invType: invTypeId,
        },
      });
    }
    dispatch({
      type: 'salesInvoiceFormList/preservation',
    });
    dispatch({
      type: 'salesInvoiceFormList/updatePageReducer',
      payload: {
        suitGoodsList: [],
        noSuitGoodsList: [],
        correspondingSchedule: [],
        wrongSchedule: [],
        selectedRows: [],
        selectOrderIds: [],
      },
    });
  }
  // 销售备注
  remarks(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'salesInvoiceFormList/updatePageReducer',
      payload: {
        sellerRemark: e.target.value,
      },
    });
  }
  // 保存
  preservation() {
    const { dispatch } = this.props;
    const { correspondingSchedule, wrongSchedule, sellerRemark, invoiceId, invNum, invType, invInfoId, invTypeId } = this.props.salesInvoiceFormList;
    const corres = correspondingSchedule.map((item) => {
      item.num = item.saleNum;
      item.price = item.salePrice;
      return (({ id, num }) => ({ id, num }))(item);
    });
    const wrong = wrongSchedule.map((item) => {
      item.num = item.incorrectQuantity;
      item.price = item.salePrice;
      item.invItemId = item.invGoodsNameId;
      item.invNum = item.saleNum;
      return (({ id, num, invItemId, price, invNum }) => ({ id, num, invItemId, price, invNum }))(item);
    });
    dispatch({
      type: 'salesInvoiceFormList/updatePageReducer',
      payload: {
        suitGoodsList: corres,
        noSuitGoodsList: wrong,
        sellerRemark,
        confirmCheck: 0,
        invInfoId: invoiceId,
        visible: false,
        invType,
        isinvData: true,
      },
    });
    // 如果invtype是初始值的话，就将列表里的发票ID值给他
    if (+invType === 0) {
      dispatch({
        type: 'salesInvoiceFormList/updatePageReducer',
        payload: {
          invType: invTypeId,
        },
      });
    }
    dispatch({
      type: 'salesInvoiceFormList/preservation',
    });
    dispatch({
      type: 'salesInvoiceFormList/updatePageReducer',
      payload: {
        suitGoodsList: [],
        noSuitGoodsList: [],
        correspondingSchedule: [],
        wrongSchedule: [],
        selectedRows: [],
        selectOrderIds: [],
      },
    });
  }
  // 销售备注
  remarks(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'salesInvoiceFormList/updatePageReducer',
      payload: {
        sellerRemark: e.target.value,
      },
    });

  }
  // 修改明细表销售数量
  onChangew(id, record, e) {
    const { dispatch } = this.props;
    const { correspondingSchedule, list, wrongSchedule, totalInvoicePayable } = this.props.salesInvoiceFormList;
    let num;
    let index;
    let obj;
    let corres;
    let money = 0;
    let noMoney = 0;

    corres = correspondingSchedule.findIndex(value => (+value.id === +record.id));
    if (corres != -1) {
      correspondingSchedule[corres].saleNum = e;
      correspondingSchedule[corres].saleAmount = NP.times(correspondingSchedule[corres].salePrice, e);
    }
    list.map((item) => {
      if (item.id === id) {
        num = item.saleNum - e;
        if (num > 0) {
          index = wrongSchedule.findIndex(item => (+item.id === +record.id));
          if (index === -1) {
            obj = Object.assign({}, record);
            obj.saleNum = num;
            obj.incorrectQuantity = num;
            obj.saleAmount = num * obj.salePrice;
            obj.incorrectHangingWindowDetailed = false;
            wrongSchedule.push(obj);
          } else {
            // wrongSchedule[index].saleAmount = NP.divide(wrongSchedule[index].salePrice, num);
            wrongSchedule[index].saleAmount = wrongSchedule[index].salePrice * num;
            wrongSchedule[index].saleNum = num;
            wrongSchedule[index].incorrectQuantity = num;
            wrongSchedule.incorrectHangingWindowDetailed = false;
          }
        }
      }
    });
    dispatch({
      type: 'salesInvoiceFormList/updatePageReducer',
      payload: {
        correspondingSchedule,
        wrongSchedule,
      },
    });
    correspondingSchedule.map((item) => {
      money = +item.saleAmount + +money;
    });
    wrongSchedule.map((item) => {
      noMoney = +item.saleAmount + +noMoney;
    });
    money = +money + +noMoney;
    dispatch({
      type: 'salesInvoiceFormList/updatePageReducer',
      payload: {
        totalInvoicePayable: money.toFixed(2),
      },
    });
  }
  // 修改不对应明细表销售数量
  noSaleNum(id, record, e) {
    const { dispatch } = this.props;
    const { wrongSchedule, correspondingSchedule, totalInvoicePayable } = this.props.salesInvoiceFormList;
    let index;
    let money = 0;
    let noMoney = 0;
    console.log(wrongSchedule);
    index = wrongSchedule.findIndex(item => (+item.id === +record.id));
    if (index != -1) {
      wrongSchedule[index].saleNum = e;
      wrongSchedule[index].salePrice = NP.divide(wrongSchedule[index].saleAmount, e).toFixed(9);

    }
    dispatch({
      type: 'salesInvoiceFormList/updatePageReducer',
      payload: {
        wrongSchedule,
        correspondingSchedule,
        invNum: e,
      },
    });
    correspondingSchedule.map((item) => {
      money = +item.saleAmount + +money;
    });
    wrongSchedule.map((item) => {
      noMoney = +noMoney + +item.saleAmount;
    });
    money = +money + +noMoney;
    dispatch({
      type: 'salesInvoiceFormList/updatePageReducer',
      payload: {
        totalInvoicePayable: money.toFixed(2),
      },
    });

  }
  // 单元格编辑态
  toggleEditing(type) {
    const { dispatch } = this.props;
    switch (type) {
      case 'sizeEdit':
        dispatch({
          type: 'salesInvoiceFormList/updateState',
          payload: {
            sizeEdit: true,
            unitEdit: false,
            numEdit: false,
            priceEdit: false,
            amountEdit: false,
            taxAmountEdit: false,
            totalAmountEdit: false,
          },
        });
        break;
      case 'unitEdit':
        dispatch({
          type: 'salesInvoiceFormList/updateState',
          payload: {
            sizeEdit: false,
            unitEdit: true,
            numEdit: false,
            priceEdit: false,
            amountEdit: false,
            taxAmountEdit: false,
            totalAmountEdit: false,
          },
        });
        break;
      case 'numEdit':
        dispatch({
          type: 'salesInvoiceFormList/updateState',
          payload: {
            sizeEdit: false,
            unitEdit: false,
            numEdit: true,
            priceEdit: false,
            amountEdit: false,
            taxAmountEdit: false,
            totalAmountEdit: false,
          },
        });
        break;
      case 'priceEdit':
        dispatch({
          type: 'salesInvoiceFormList/updateState',
          payload: {
            sizeEdit: false,
            unitEdit: false,
            numEdit: false,
            priceEdit: true,
            amountEdit: false,
            taxAmountEdit: false,
            totalAmountEdit: false,
          },
        });
        break;
      case 'amountEdit':
        dispatch({
          type: 'salesInvoiceFormList/updateState',
          payload: {
            sizeEdit: false,
            unitEdit: false,
            numEdit: false,
            priceEdit: false,
            amountEdit: true,
            taxAmountEdit: false,
            totalAmountEdit: false,
          },
        });
        break;
      case 'taxAmountEdit':
        dispatch({
          type: 'salesInvoiceFormList/updateState',
          payload: {
            sizeEdit: false,
            unitEdit: false,
            numEdit: false,
            priceEdit: false,
            amountEdit: false,
            taxAmountEdit: true,
            totalAmountEdit: false,
          },
        });
        break;
      case 'totalAmountEdit':
        dispatch({
          type: 'salesInvoiceFormList/updateState',
          payload: {
            sizeEdit: false,
            unitEdit: false,
            numEdit: false,
            priceEdit: false,
            amountEdit: false,
            taxAmountEdit: false,
            totalAmountEdit: true,
          },
        });
        break;
      case 'edit':
        dispatch({
          type: 'salesInvoiceFormList/updateState',
          payload: {
            edit: true,
          },
        });
        break;
      default:
        break;
    }
  }

  handleChangeSiftItem(type, e, dataStrings) {
    const { dispatch } = this.props;
    switch (type) {
      case 'createDate':
        dispatch({
          type: 'salesInvoiceFormList/updatePageReducer',
          payload: {
            createDateStart: dataStrings[0],
            createDateEnd: dataStrings[1],
          },
        });
        dispatch({
          type: 'salesInvoiceFormList/getList',
        });
        break;

      case 'payDate':
        dispatch({
          type: 'salesInvoiceFormList/updatePageReducer',
          payload: {
            payDateStart: dataStrings[0],
            payDateEnd: dataStrings[1],
          },
        });
        dispatch({
          type: 'salesInvoiceFormList/getList',
        });
        break;

      case 'orderSn':
      case 'goodsKeywords':
      case 'customerKeywords':
      case 'invInfoKeywords':
        dispatch({
          type: 'salesInvoiceFormList/updatePageReducer',
          payload: {
            [type]: e.target.value,
          },
        });
        break;
      case 'userId':
      case 'invType':
      case 'sellerId':
        dispatch({
          type: 'salesInvoiceFormList/updatePageReducer',
          payload: {
            [type]: e,
          },
        });
        dispatch({
          type: 'salesInvoiceFormList/getList',
        });
        break;
      case 'pageSize':
        // console.log(`type = ${type}, e = ${e}, dataStrings = ${dataStrings}`);
        dispatch({
          type: 'salesInvoiceFormList/updatePageReducer',
          payload: {
            [type]: dataStrings,
          },
        });
        dispatch({
          type: 'salesInvoiceFormList/getList',
        });
        break;
      case 'currentPage':
        dispatch({
          type: 'salesInvoiceFormList/updatePageReducer',
          payload: {
            [type]: e,
          },
        });
        dispatch({
          type: 'salesInvoiceFormList/getList',
        });
        break;

      default:
        break;
    }
  }
  // 各种输入数据改变
  handleChangeInputValue(type, e, dataStrings) {
    const { dispatch } = this.props;
    switch (type) {
      // case 'relativeInvSn':
      // case 'invSn':
      // case 'goodsKeywords':
      //   dispatch({
      //     type: 'salesInvoiceFormList/updateState',
      //     payload: {
      //       [type]: e.target.value,
      //     },
      //   });
      //   break;
      // case 'invDate':
      //   dispatch({
      //     type: 'salesInvoiceFormList/updateState',
      //     payload: {
      //       invDate: dataStrings,
      //     },
      //   });
      //   break;
      case 'currentPage':
        dispatch({
          type: 'salesInvoiceFormList/updateState',
          payload: {
            [type]: e,
          },
        });
        dispatch({
          type: 'salesInvoiceFormList/getInvGoodsNameListData',
          payload: {
            [type]: e,
          },
        });
        break;
      case 'pageSize':
        dispatch({
          type: 'salesInvoiceFormList/updateState',
          payload: {
            pageSize: dataStrings,
            currentPage: 1,
          },
        });
        // dispatch({
        //   type: 'salesInvoiceFormList/getInvGoodsNameListData',
        //   payload: {
        //     pageSize: dataStrings,
        //     currentPage: 1,
        //   },
        // });
        break;
      default:
        break;
    }
  }
  handleGetOrderList() {
    const { dispatch } = this.props;
    dispatch({
      type: 'salesInvoiceFormList/getList',
    });
  }
  state = { visible: false }
  showModal() {
    const { dispatch } = this.props;
    const { correspondingSchedule, openTicketWindow, totalInvoicePayable } = this.props.salesInvoiceFormList;
    for (let i = 0; i < openTicketWindow.length; i++) {
      if (openTicketWindow[0].userId != openTicketWindow[i].userId) {
        notification.open({
          description: '只能选择同一客户！',
        });
        return;
      }

    }
    // 重点掌握 先将对象转换成JSON字符串 再换成JSON对象
    const text = JSON.parse(JSON.stringify(openTicketWindow));
    let money = 0;

    openTicketWindow.map((item) => {
      money = +item.saleAmount + money;
    });
    dispatch({
      type: 'salesInvoiceFormList/updatePageReducer',
      payload: {
        visible: true,
        correspondingSchedule: text,
        totalInvoicePayable: money.toFixed(2),
        isinvData: false,
      },
    });
    dispatch({
      type: 'salesInvoiceFormList/getUserId',
      payload: {
        // userId: selectedRows.userId,
      },
    });
  }
  handleCancel() {
    const { dispatch } = this.props;
    dispatch({
      type: 'salesInvoiceFormList/updatePageReducer',
      payload: {
        visible: false,
        correspondingSchedule: [],
        wrongSchedule: [],

      },
    });
  }

  // 改变发票样式
  showinvoiceInfo() {
    const { dispatch } = this.props;
    dispatch({
      type: 'salesInvoiceFormList/updatePageReducer',
      payload: {
        isinvData: true,
      },
    });
  }
  // 弹窗二
  handleChangeInvoiceInfo(value) {
    const { dispatch, invType } = this.props;
    const num = +value;
    dispatch({
      type: 'salesInvoiceFormList/updatePageReducer',
      payload: {
        visibletwo: true,
        invType: num,
      },
    });
  }
  changeOfInvoiceType() {
    const { dispatch } = this.props;
    dispatch({
      type: 'salesInvoiceFormList/updatePageReducer',
      payload: {
        visibletwo: false,
      },
    });
    dispatch({
      type: 'salesInvoiceFormList/getUserId',
      payload: {

      },
    });
  }
  handleCheckInvoiceRadio(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'salesInvoiceFormList/updatePageReducer',
      payload: {
        checkinvoiceinformation: e,
        invoiceKey: e.invoiceKey,
        invoiceId: e.invoiceId,
      },
    });
  }
  // 新建发票弹框
  handleClickAddInvoiceBtn() {
    const { dispatch } = this.props;
    dispatch({
      type: 'salesInvoiceFormList/updatePageReducer',
      payload: {
        isnewinvoice: true,
      },
    });
  }
  changeleClickAddInvoiceBtn() {
    const { dispatch } = this.props;
    dispatch({
      type: 'salesInvoiceFormList/updatePageReducer',
      payload: {
        isnewinvoice: false,
      },
    });
  }
  okleClickAddInvoiceBtn() {
    const { dispatch } = this.props;
    dispatch({
      type: 'salesInvoiceFormList/getreqUpdateInvoice',
    });
  }
  onChangewbank(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'salesInvoiceFormList/updatePageReducer',
      payload: {
        bank: e.target.value,
      },
    });
  }
  onChangewbankAccount(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'salesInvoiceFormList/updatePageReducer',
      payload: {
        bankAccount: e.target.value,
      },
    });
  }
  onChangewphoneNumber(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'salesInvoiceFormList/updatePageReducer',
      payload: {
        phoneNumber: e.target.value,
      },
    });
  }
  onChangewaddress(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'salesInvoiceFormList/updatePageReducer',
      payload: {
        address: e.target.value,
      },
    });
  }
  onChangewcompanyTaxID(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'salesInvoiceFormList/updatePageReducer',
      payload: {
        companyTaxID: e.target.value,
      },
    });
  }

  onChangewcompanyName(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'salesInvoiceFormList/updatePageReducer',
      payload: {
        companyName: e.target.value,
      },
    });
  }
  okclickadd() {
    const { dispatch } = this.props;
    dispatch({
      type: 'salesInvoiceFormList/getinvoicecreate',
    });
  }
  // 修改发票
  modifytheinvoice(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'salesInvoiceFormList/updatePageReducer',
      payload: {
        ismodifytheinvoice: true,
        companyName: e.companyName,
        address: e.address,
        phoneNumber: e.phoneNumber,
        companyTaxID: e.companyTaxID,
        bank: e.bank,
        bankAccount: e.bankAccount,
        invoiceId: e.invoiceId,
      },
    });
  }
  hiddenmodifytheinvoice() {
    const { dispatch } = this.props;
    dispatch({
      type: 'salesInvoiceFormList/updatePageReducer',
      payload: {
        ismodifytheinvoice: false,
      },
    });
  }
  // 删除发票信息
  deletetheinvoice(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'salesInvoiceFormList/updatePageReducer',
      payload: {
        invoiceId: e.invoiceId,
        companyName: e.companyName,
        address: e.address,
        phoneNumber: e.phoneNumber,
        companyTaxID: e.companyTaxID,
        bankAccount: e.bankAccount,
        bank: e.bank,
      },
    });
    dispatch({
      type: 'salesInvoiceFormList/getreqDeleteInvoice',
    });
  }
  // 搜索发票商品
  handleSearchInvGoodsName(id, goodsKeywords) {
    console.log(goodsKeywords);
    const { dispatch } = this.props;
    const { wrongSchedule, MoreId } = this.props.salesInvoiceFormList;
    const index = wrongSchedule.findIndex(value => (+value.id === +id));
    dispatch({
      type: 'salesInvoiceFormList/updatePageReducer',
      payload: {
        goodsKeywords,
        isShowInvGoodsNameModal: true,
        wrongScheduleIndex: index,
        MoreId: id,
      },
    });
    dispatch({
      type: 'salesInvoiceFormList/getInvGoodsNameListData',
      payload: {
        goodsKeywords,
        currentPage: 1,
      },
    });
  }
  // 修改发票商品
  modifyInvoiceCommodity(id) {
    const { dispatch } = this.props;
    const { wrongSchedule, MoreId } = this.props.salesInvoiceFormList;
    const index = wrongSchedule.findIndex(value => (+value.id === +id));
    dispatch({
      type: 'salesInvoiceFormList/updatePageReducer',
      payload: {
        isShowInvGoodsNameModal: true,
        wrongScheduleIndex: index,
        MoreId: id,
      },
    });
    dispatch({
      type: 'salesInvoiceFormList/getInvGoodsNameListData',
      payload: {
        currentPage: 1,
      },
    });
  }
  handleSearchInvGoodsNamess(goodsKeywords) {
    const { dispatch } = this.props;
    const { wrongSchedule, MoreId, id } = this.props.salesInvoiceFormList;
    const index = wrongSchedule.findIndex(value => (+value.id === +MoreId));
    const wIndex = wrongSchedule.findIndex(value => (+value.id === +id));
    dispatch({
      type: 'salesInvoiceFormList/updatePageReducer',
      payload: {
        goodsKeywords,
        isShowInvGoodsNameModal: true,
        wrongScheduleIndex: index,
      },
    });
    dispatch({
      type: 'salesInvoiceFormList/getInvGoodsNameListData',
      payload: {
        goodsKeywords,
        currentPage: 1,
      },
    });
  }
  // 确定选择的发票商品
  handleInvGoodsNameModalOk() {
    const { dispatch } = this.props;
    const { selectedRowstwo, wrongSchedule, wrongScheduleIndex, invGoodsNameId, selectedRows, MoreId, id, availableStock, openTicketPrice} = this.props.salesInvoiceFormList;
    console.log(1,selectedRowstwo)
    wrongSchedule[wrongScheduleIndex].invGoodsName = selectedRowstwo && selectedRowstwo.goodsName;
    wrongSchedule[wrongScheduleIndex].invGoodsNameId = id;
    wrongSchedule[wrongScheduleIndex].invCanUseNum = availableStock;
    wrongSchedule[wrongScheduleIndex].invPrice = openTicketPrice;
    wrongSchedule[wrongScheduleIndex].incorrectHangingWindowDetailed = true;
    console.log(2);
    if (selectedRowstwo.invCanUseNum < wrongSchedule[wrongScheduleIndex].saleNum) {
      console.log(3);
      dispatch({
        type: 'salesInvoiceFormList/updatePageReducer',
        payload: {
          numWarning: true,
          wrongSchedule,
          isdisabled: true,
        },
      });
    }
    console.log(4);
    dispatch({
      type: 'salesInvoiceFormList/updatePageReducer',
      payload: {
        isShowInvGoodsNameModal: false,
      },
    });
    console.log(5);
  }
  // 取消发票商品列表弹窗
  handleInvGoodsNameModalCancel() {
    const { dispatch } = this.props;
    dispatch({
      type: 'salesInvoiceFormList/updatePageReducer',
      payload: {
        isShowInvGoodsNameModal: false,
        selectedIds: [],
        selectedRowstwo: {},
      },
    });
  }
  // 显示新建发票商品弹层
  showAddInvoiceGoodsNameModal() {
    const { dispatch } = this.props;
    dispatch({
      type: 'salesInvoiceFormList/updatePageReducer',
      payload: {
        isShowAddInvoiceGoodsNameModal: true,
      },
    });
  }
  // 选择发票商品
  handleCheckGoods(selectedIds, selectedRows) {
    const { dispatch } = this.props;
    const { id } = this.props.salesInvoiceFormList;
    const index = selectedRows[selectedRows.length - 1];
    dispatch({
      type: 'salesInvoiceFormList/updateState',
      payload: {
        selectedIds,
        selectedRowstwo: index,
        id: selectedRows[0].id,
        openTicketPrice: selectedRows[0].price,
        availableStock: selectedRows[0].invCanUseNum,
      },
    });
    if (selectedRows.length > 1) {
      dispatch({
        type: 'salesInvoiceFormList/updateState',
        payload: {
          isdisabled: false,
        },
      });
    }
  }
  // 保存新建数据
  saveAdd(type, e) {
    const { dispatch } = this.props;
    const { addInvoiceGoodsNameList } = this.props.salesInvoiceFormList;
    let edit = false;
    addInvoiceGoodsNameList[0][type] = e.target.value;
    Object.keys(addInvoiceGoodsNameList[0]).forEach((item) => {
      if (addInvoiceGoodsNameList[0][item] === '') {
        edit = true;
      }
    });
    dispatch({
      type: 'salesInvoiceFormList/updatePageReducer',
      payload: {
        edit,
        addInvoiceGoodsNameList,
      },
    });
  }
  handleAddInvoiceGoodsNameModalCancel() {
    const { dispatch } = this.props;
    dispatch({
      type: 'salesInvoiceFormList/updatePageReducer',
      payload: {
        isShowAddInvoiceGoodsNameModal: false,
      },
    });
  }
  // 处理新增发票商品弹窗事件
  handleAddInvoiceGoodsNameModalOk() {
    const { dispatch } = this.props;
    const { addInvoiceGoodsNameList } = this.props.salesInvoiceFormList;
    let canSubmit = true;
    Object.keys(addInvoiceGoodsNameList[0]).forEach((item) => {
      if (addInvoiceGoodsNameList[0][item] === '') {
        message.error('不能存在未填项');
        canSubmit = false;
      }
    });
    if (canSubmit) {
      dispatch({
        type: 'salesInvoiceFormList/createInvoiceGoodsName',
        payload: {
          goodsName: addInvoiceGoodsNameList[0].goodsName,
          goodsSn: addInvoiceGoodsNameList[0].goodsSn,
          invGoodsName: addInvoiceGoodsNameList[0].invGoodsName,
          size: addInvoiceGoodsNameList[0].size,
          unit: addInvoiceGoodsNameList[0].unit,
        },
      });
      addInvoiceGoodsNameList[0].goodsName = '',
      addInvoiceGoodsNameList[0].goodsSn = '',
      addInvoiceGoodsNameList[0].invGoodsName = '',
      addInvoiceGoodsNameList[0].size = '',
      addInvoiceGoodsNameList[0].unit = '',
      dispatch({
        type: 'salesInvoiceFormList/updatePageReducer',
        payload: {
          isShowAddInvoiceGoodsNameModal: false,
          addInvoiceGoodsNameList,
        },
      });
    } else {

    }
  }
  handleChangeSelectOrderIds(selectOrderIds, selectedRows) {
    const { dispatch } = this.props;
    const { actionlist, isinvData, openTicketWindow, openTicketWindowId, list } = this.props.salesInvoiceFormList;

    const text = [];
    const arr = [];
    // console.log(`${actionlist[1].url}&ids=${selectOrderIds}`);
    list.map((item) => {
      selectOrderIds.map((value) => {
        if (item.id === value) {
          text.push(item);
        }
      });
    });
    const test = JSON.parse(JSON.stringify(text));
    selectedRows.map((value) => {
      dispatch({
        type: 'salesInvoiceFormList/updatePageReducer',
        payload: {
          invoiceId: value.invData.invoiceId,
          invTypeId: value.invTypeId,
          userId: value.userId,
          invData: value.invData,
          openTicketWindow: JSON.parse(JSON.stringify(test)),
        },
      });
    });
    dispatch({
      type: 'salesInvoiceFormList/updatePageReducer',
      payload: {
        selectedRows,
        selectOrderIds,
      },
    });
  }
  // 待开票删除点击的行
  deleteTarget(record, e) {
    const { dispatch } = this.props;
    const { correspondingSchedule, totalInvoicePayable, wrongSchedule } = this.props.salesInvoiceFormList;
    let index;
    let money = 0;
    let noMoney = 0;
    let is = false;
    index = correspondingSchedule.findIndex(item => (item.id === record.id));
    correspondingSchedule.splice(index, 1);
    dispatch({
      type: 'salesInvoiceFormList/updatePageReducer',
      payload: {
        correspondingSchedule,
      },
    });
    correspondingSchedule.map((item) => {
      money = +money + +item.saleAmount;
    });
    wrongSchedule.map((item) => {
      noMoney = +noMoney + +item.saleAmount;
    });
    money += noMoney;
    is = true;
    if (is) {
      dispatch({
        type: 'salesInvoiceFormList/updatePageReducer',
        payload: {
          totalInvoicePayable: money.toFixed(2),
        },
      });
    }
  }
  // 待开票删除点击的行
  deleteTargetno(record, e) {
    const { dispatch } = this.props;
    const { correspondingSchedule, totalInvoicePayable, wrongSchedule } = this.props.salesInvoiceFormList;
    let index;
    let money = 0;
    let noMoney = 0;
    let is = false;
    index = wrongSchedule.findIndex(item => (item.id === record.id));
    wrongSchedule.splice(index, 1);
    dispatch({
      type: 'salesInvoiceFormList/updatePageReducer',
      payload: {
        wrongSchedule,
      },
    });
    correspondingSchedule.map((item) => {
      money = +money + +item.saleAmount;
    });
    wrongSchedule.map((item) => {
      noMoney = +noMoney + +item.saleAmount;
    });
    money += noMoney;
    is = true;
    if (is) {
      dispatch({
        type: 'salesInvoiceFormList/updatePageReducer',
        payload: {
          totalInvoicePayable: money.toFixed(2),
        },
      });
    }

  }
  render() {
    const {
      salesInvoiceFormList: {
        invoiceInfo,
        total,
        id,
        userId,
        groupSn,
        createTime,
        customerName,
        invInfo,
        goodsName,
        goodsSn,
        tag,
        saleNum,
        salePrice,
        saleAmount,
        payTime,
        seller,
        orderSn,
        numColor,
        amountColor,
        numRemark,
        amountRemark,
        priceWarning,
        pageSize,
        currentPage,
        list,
        loading,
        sellermap,
        sellerId,
        invType,
        goodsKeywords,
        customerKeywords,
        createDateStart,
        createDateEnd,
        payDateStart,
        payDateEnd,
        actionlist,
        openTicketWindow,
        invInfoType,
        showinv,
        visibletwo,
        isnewinvoice,
        // 发票信息列表
        Invoiceform,
        invoiceKey,
        isDefault,
        companyName,
        address,
        phoneNumber,
        companyTaxID,
        bank,
        bankAccount,
        checkinvoiceinformation,
        invGoodsList,
        invGoodsName,
        invCanUseNum,
        invPrice,

        ismodifytheinvoice,
        // 修改发票信息列表
        isShowInvGoodsNameModal,
        isInvGoodsNameLoading,
        selectedIds,
        invGoodsNameListData,
        invGoodsNameListData: {
          invoiceGoodsList,
        },
        relativeInvSn,
        invSn,
        invDate,
        isLoading,
        isShowAddInvoiceGoodsNameModal,
        addInvoiceGoodsNameList,
        edit,
        selectedRowstwo,
        isdisabled,
        correspondingSchedule,
        visible,
        wrongSchedule,
        invInfoId, // 发票信息ID
        suitGoodsList, // 对应明细开票列表
        noSuitGoodsList, // 不对应明细列表
        sellerRemark, // 销售备注
        confirmCheck, // 0 保存   1提交
        invGoodsNameId, // 发票商品id
        totalInvoicePayable, // 应开票总额
        wrongScheduleIndex,
        invoiceId,
        invNum,
        MoreId,
        selectOrderIds,
        invData,
        isinvData,
        openTicketPrice,
        availableStock,
        invTypeId,
        numWarning,
        openTicketWindowId,
        invInfoKeywords,
      },
      dispatch,
    } = this.props;
    const invoiceIds = Invoiceform.map(item => item.invoiceId);
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        align: 'center',
        width:76,
      },
      {
        title: '总单号',
        dataIndex: 'groupSn',
        key: 'groupSn',
        align: 'center',
        className: 'tab',
        render: (value, record) => {
          return (
            <div>
              {<Link to={`/sale/sale-order/sale-order-list/sale-order-detail/${record.orderId}`}>{value}</Link>}
            </div>
          );
        },
      },
      {
        title: '下单时间',
        dataIndex: 'createTime',
        key: 'createTime',
        align: 'center',
      },
      {
        title: '客户名',
        dataIndex: 'customerName',
        key: 'customerName',
        align: 'center',
      },
      {
        title: '门店名称',
        dataIndex: 'companyName',
        key: 'companyName',
        align: 'center',
      },
      {
        title: '发票类型',
        dataIndex: 'invType',
        key: 'invType',
        align: 'center',
      },
      {
        title: '商品名称',
        dataIndex: 'goodsName',
        key: 'goodsName',
        align: 'center',
        width:200,
        render: (value, record) => {
          return (
            <div className="goodsName">
              {record.tag.map(item => (<span className="goodsNamespan" style={{ background: item.color, color: '#fff', fontSize: 12, marginLeft: 5, paddingLeft: 3, paddingRight: 3 }}>{item.name}</span>))}
              <span>{value}</span>
            </div>
          );
        },
      },
      {
        title: '条码',
        dataIndex: 'goodsSn',
        key: 'goodsSn',
        align: 'center',
      },
      {
        title: '销售数量',
        dataIndex: 'saleNum',
        key: 'saleNum',
        align: 'center',
        render: (value, record) => {
          return (
            <Tooltip
              placement="topLeft"
              title={<div>{record.numRemark.map(item => (<div>{item}</div>))}</div>}
              arrowPointAtCenter
            >
              <div>
                <span style={{ color: record.numColor }}>{value}</span>
              </div>
            </Tooltip>
          );
        },
      },
      {
        title: '销售价',
        dataIndex: 'salePrice',
        key: 'salePrice',
      },
      {
        title: '销售合计',
        dataIndex: 'saleAmount',
        key: 'saleAmount',
        align: 'center',
        render: (value, record) => {
          return (
            <Tooltip
              placement="topLeft"
              title={<div>{record.amountRemark.map(item => (<div>{item}</div>))}</div>}
              arrowPointAtCenter
            >
              <div>
                <span style={{ color: record.amountColor }}>
                  {Number(value).toFixed(2)}
                </span>
              </div>
            </Tooltip>
          );
        },
      },
      {
        title: '收款时间',
        dataIndex: 'payTime',
        key: 'payTime',
        align: 'center',
      },
      {
        title: '业务员',
        dataIndex: 'seller',
        key: 'seller',
        align: 'center',
      },
      {
        title: '子单号',
        dataIndex: 'orderSn',
        key: 'orderSn',
        align: 'center',
      },
      {
        title: '发票信息',
        dataIndex: 'invInfo',
        key: 'invInfo',
        align: 'center',
        render: (value) => {
          return (
            <Tooltip placement="topLeft" title={value} arrowPointAtCenter>
              <div className={styles.groupSn}>
                <span>{value}</span>
              </div>
            </Tooltip>
          );
        },
      },
    ];

    // 弹出框对应明细表
    const columnstwo = [
      {
        title: '',
        dataIndex: 'id',
        key: 'id',
        align: 'center',
        render: (value, record) => {
          return (
            <Icon
              type="minus-square"
              style={{ color: 'grey' }}
              onClick={this.deleteTarget.bind(this, record)}
            />
          );
        },
      },
      {
        title: '总单号',
        dataIndex: 'groupSn',
        key: 'groupSn',
        align: 'center',
        className: 'tab',
        render: (value, record) => {
          return (
            <div>
              {<Link to={`/sale/sale-order/sale-order-list/sale-order-detail/${record.orderId}`}>{value}</Link>}
            </div>
          );
        },
      },
      {
        title: '下单时间',
        dataIndex: 'createTime',
        key: 'createTime',
        align: 'center',
      },
      {
        title: '客户名',
        dataIndex: 'customerName',
        key: 'customerName',
        align: 'center',
      },
      {
        title: '门店名称',
        dataIndex: 'companyName',
        key: 'companyName',
        align: 'center',
      },
      {
        title: '商品名称',
        dataIndex: 'goodsName',
        key: 'goodsName',
        align: 'center',
        render: (value, record) => {
          return (
            <div className={styles.xianshi}>
              <div>{value}</div>
              <div className={styles.box}>
                <div className={styles.text}>
                  <div style={{ marginRight: 54, float: 'lfet', width: 300 }}><span>发票商品名称</span></div>
                  <div style={{ marginRight: 40, float: 'lfet' }}><span>可用库存</span></div>
                  <div style={{ marginRight: 30, float: 'lfet' }}><span>可开票价</span></div>
                </div>
                {
                  record.invGoodsList.map((inGood) => {
                      if (+record.saleNum > +record.invCanUseNum && +record.salePrice < +inGood.invPrice) {
                        return (
                          <div className={styles.text}>
                            <div style={{ marginRight: 70, float: 'lfet', width: 300 }}><span>{inGood.invGoodsName}</span></div>
                            <div style={{ marginRight: 70, float: 'lfet', color: 'yellow' }}><span>{inGood.invCanUseNum}</span></div>
                            <div style={{ marginRight: 30, float: 'lfet', color: '#4169E1' }}><span>{inGood.invPrice}</span></div>
                          </div>
                        );
                    } else if (+record.salePrice < +inGood.invPrice) {
                      return (
                        <div className={styles.text}>
                          <div style={{ marginRight: 70, float: 'lfet', width: 300 }}><span>{inGood.invGoodsName}</span></div>
                          <div style={{ marginRight: 70, float: 'lfet', color: '#fff' }}><span>{inGood.invCanUseNum}</span></div>
                          <div style={{ marginRight: 30, float: 'lfet', color: '#4169E1' }}><span>{inGood.invPrice}</span></div>
                        </div>
                      );
                    } else if (+record.saleNum > +record.invCanUseNum) {
                      return (
                        <div className={styles.text}>
                          <div style={{ marginRight: 70, float: 'lfet', width: 300 }}><span>{inGood.invGoodsName}</span></div>
                          <div style={{ marginRight: 70, float: 'lfet', color: 'yellow' }}><span>{inGood.invCanUseNum}</span></div>
                          <div style={{ marginRight: 30, float: 'lfet', color: '#fff' }}><span>{inGood.invPrice}</span></div>
                        </div>
                      );
                    } else {
                      return (
                        <div className={styles.text}>
                          <div style={{ marginRight: 70, float: 'lfet', width: 300 }}><span>{inGood.invGoodsName}</span></div>
                          <div style={{ marginRight: 70, float: 'lfet', color: '#fff' }}><span>{inGood.invCanUseNum}</span></div>
                          <div style={{ marginRight: 30, float: 'lfet', color: '#fff' }}><span>{inGood.invPrice}</span></div>
                        </div>
                      );
                    }
                  })
                }
              </div>
            </div>
          );
        },
      },
      {
        title: '条码',
        dataIndex: 'goodsSn',
        key: 'goodsSn',
        align: 'center',
      },
      {
        title: '可用库存',
        dataIndex: 'invCanUseNum',
        key: 'invCanUseNum',
        align: 'center',
      },
      {
        title: '销售数量',
        dataIndex: 'saleNum',
        key: 'saleNum',
        align: 'center',
        render: (value, record) => {
          return (
            <div style={{ display: 'inline-block' }}>
              {
                record.saleNum > record.invCanUseNum ?
                  <Icon type="warning" style={{ color: '#F4A460' }} />
                  : ''
              }
              <InputNumber onChange={this.onChangew.bind(this, record.id, record)} value={record.saleNum} min={0} max={1000000} />

            </div>
          );
        },
      },
      {
        title: '销售价',
        dataIndex: 'salePrice',
        key: 'salePrice',
        align: 'center',
        render: (value, record) => {
          // console.log(record.invGoodsList.filter(item => Number(item.invPrice) > Number(value)))
          return (
            <div>
              {
              record.invGoodsList.filter((item) => {
              })
            }
              <span>{Number(value).toFixed(2)}</span>
            </div>
          );
        },
      },
      {
        title: '销售合计',
        dataIndex: 'saleAmount',
        key: 'saleAmount',
        align: 'center',
        render: (value, record) => {
          return (
            <div>
              <span style={{ color: 'red' }}>{Number(value).toFixed(2)}
              </span>
            </div>
          );
        },
      },
      {
        title: '业务员',
        dataIndex: 'seller',
        key: 'seller',
        align: 'center',
      },
      {
        title: '子单号',
        dataIndex: 'orderSn',
        key: 'orderSn',
        align: 'center',
      },
    ];

    // 不对应明细表
    const columnsthree = [
      {
        title: '',
        dataIndex: 'id',
        key: 'id',
        align: 'center',
        render: (value, record) => {
          return (
            <Icon
              type="minus-square"
              style={{ color: 'grey' }}
              onClick={this.deleteTargetno.bind(this, record)}
            />
          );
        },
      },
      {
        title: '总单号',
        dataIndex: 'groupSn',
        key: 'groupSn',
        align: 'center',
        className: 'tab',
        render: (value, record) => {
          return (
            <div>
              {<Link to={`/sale/sale-invoice/credit-list/bill-detail/${record.id}`}>{value}</Link>}
            </div>
          );
        },
      },
      {
        title: '商品名称',
        dataIndex: 'goodsName',
        key: 'goodsName',
        align: 'center',
        render: (value, record) => {
          console.log("aaaaa",record);
          return (
            <div className={styles.xianshi}>
              <div>{value}</div>
              <div className={styles.box}>
                <div className={styles.text}>
                  <div style={{ marginRight: 54, float: 'lfet', width: 300 }}><span>发票商品名称</span></div>
                  <div style={{ marginRight: 50, float: 'lfet' }}><span>可用库存</span></div>
                  <div style={{ marginRight: 30, float: 'lfet' }}><span>可开票价</span></div>
                </div>
                <div className={styles.text}>
                  { record.incorrectHangingWindowDetailed ?
                      +record.salePrice >= record.invPrice && +record.saleNum <= +record.invCanUseNum ?
                        <div>
                          <div style={{ marginRight: 70, float: 'lfet', width: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}><span>{record.invGoodsName}</span></div>
                          <div style={{ marginRight: 70, float: 'lfet', color: '#fff' }}><span>{record.invCanUseNum}</span></div>
                          <div style={{ marginRight: 30, float: 'lfet', color: '#fff' }}><span>{record.invPrice}</span></div>
                        </div>
                      :
                      +record.salePrice < +record.invPrice && +record.saleNum > +record.invCanUseNum ?
                        <div>
                          <div style={{ marginRight: 70, float: 'lfet', width: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}><span>{record.invGoodsName}</span></div>
                          <div style={{ marginRight: 70, float: 'lfet', color: 'yellow' }}><span>{record.invCanUseNum}</span></div>
                          <div style={{ marginRight: 30, float: 'lfet', color: '#4169E1' }}><span>{record.invPrice}</span></div>
                        </div>
                    :
                    +record.saleNum > +record.invCanUseNum ?
                      <div>
                        <div style={{ marginRight: 70, float: 'lfet', width: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}><span>{record.invGoodsName}</span></div>
                        <div style={{ marginRight: 70, float: 'lfet', color: 'yellow' }}><span>{record.invCanUseNum}</span></div>
                        <div style={{ marginRight: 30, float: 'lfet', color: '#fff' }}><span>{record.invPrice}</span></div>
                      </div>
                    :
                    +record.salePrice < +record.invPrice ?
                      <div>
                        <div style={{ marginRight: 70, float: 'lfet', width: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}><span>{record.invGoodsName}</span></div>
                        <div style={{ marginRight: 70, float: 'lfet', color: '#fff' }}><span>{record.invCanUseNum}</span></div>
                        <div style={{ marginRight: 30, float: 'lfet', color: '#4169E1' }}><span>{record.invPrice}</span></div>
                      </div>
                  : ''
                  : ''
                    }
                </div>
              </div>
            </div>
          );
        },
      },
      {
        title: '条码',
        dataIndex: 'goodsSn',
        key: 'goodsSn',
        align: 'center',
      },
      {
        title: '发票商品名称',
        dataIndex: 'invGoodsName',
        key: 'invGoodsName',
        align: 'center',
        render: (value, record) => {
          return (
            value ? <div>
              <span>{value}</span>
              {/* <Search
                      style={{ width: 200,marginLeft: 20 }}
                      enterButton="修改"
                      placeholder="发票商品名称/商品名称"
                      onSearch={this.handleSearchInvGoodsName.bind(this,record.id)}
                    /> */}
              <Button style={{ marginLeft: 20 }} type="primary" onClick={this.modifyInvoiceCommodity.bind(this, record.id)}>修改</Button>
            </div>

              : <div>
                <Search
                  style={{ width: 250, marginLeft: 20 }}
                  enterButton="更多"
                  placeholder="发票商品名称/商品名称"
                  onSearch={this.handleSearchInvGoodsName.bind(this, record.id)}
                />
              </div>
          );
        },
      },
      {
        title: '可用库存',
        dataIndex: 'invCanUseNum',
        key: 'invCanUseNum',
        align: 'center',
      },
      {
        title: '销售数量',
        dataIndex: 'saleNum',
        key: 'saleNum',
        align: 'center',
        render: (value, record) => {
          return (
            <div>
              {
                record.saleNum > record.invCanUseNum ?
                  <div>
                    <Icon
                      type="warning"
                      style={{ color: '#F4A460' }}
                    />
                    <InputNumber onChange={this.noSaleNum.bind(this, record.id, record)} value={record.saleNum} min={1} max={1000000} />
                  </div>
                : <InputNumber onChange={this.noSaleNum.bind(this, record.id, record)} value={record.saleNum} min={1} max={1000000} />
              }

            </div>
          );
        },
      },
      {
        title: '销售价',
        dataIndex: 'salePrice',
        key: 'salePrice',
        align: 'center',
        render: (value, record) => {
          return (
            <div>
              {
                  +record.salePrice < +record.invPrice ?
                    <Icon type="warning" style={{ color: '#F4A460' }} />
                 :
                 ''
              }
              <span>{Number(value).toFixed(2)}</span>
            </div>
          );
        },
      },
      {
        title: '销售合计',
        dataIndex: 'saleAmount',
        key: 'saleAmount',
        align: 'center',
        render: (value, record) => {
          return (
            <div>
              <span style={{ color: 'red' }}>{Number(value).toFixed(2)}</span>
            </div>
          );
        },
      },
      {
        title: '子单号',
        dataIndex: 'orderSn',
        key: 'orderSn',
        align: 'center',
      },
    ];
    const Invoiceformlist = [
      {
        title: '',
        dataIndex: 'companyName',
        key: 'companyName',
        align: 'center',
      },
      {
        title: '',
        dataIndex: 'address',
        key: 'address',
        align: 'center',
      },
      {
        title: '',
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
        align: 'center',
      },
      {
        title: '',
        dataIndex: 'companyTaxID',
        key: 'companyTaxID',
        align: 'center',
      },
      {
        title: '',
        dataIndex: 'bank',
        key: 'bank',
        align: 'center',
      },
      {
        title: '',
        dataIndex: 'bankAccount',
        key: 'bankAccount',
        align: 'center',
      },
      {
        title: '',
        dataIndex: 'userId',
        key: 'userId',
        align: 'center',
        render: (value, record) => {
          return (
            <span className={styles.addBtn} onClick={this.modifytheinvoice.bind(this, record)}>修改</span>
          );
        },
      },
      {
        title: '',
        dataIndex: 'delete',
        key: 'delete',
        align: 'center',
        render: (value, record) => {
          return (
            <span className={styles.addBtn} onClick={this.deletetheinvoice.bind(this, record)}>删除</span>
          );
        },
      },
    ];


    // 发票商品名称列表
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
              edit ?
                <Input
                  onPressEnter={this.saveAdd.bind(this, 'goodsName')}
                  onBlur={this.saveAdd.bind(this, 'goodsName')}
                  defaultValue={value}
                /> :
                (<div onClick={this.toggleEditing.bind(this, 'edit')} style={{ minHeight: '30px' }} >{value}</div>)
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
              edit ?
                <Input
                  onPressEnter={this.saveAdd.bind(this, 'goodsSn')}
                  onBlur={this.saveAdd.bind(this, 'goodsSn')}
                  defaultValue={value}
                /> :
                (<div onClick={this.toggleEditing.bind(this, 'edit')} style={{ minHeight: '30px' }} >{value}</div>)
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
              edit ?
                <Input
                  onPressEnter={this.saveAdd.bind(this, 'invGoodsName')}
                  onBlur={this.saveAdd.bind(this, 'invGoodsName')}
                  defaultValue={value}
                /> :
                (<div onClick={this.toggleEditing.bind(this, 'edit')} style={{ minHeight: '30px' }} >{value}</div>)
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
              edit ?
                <Input
                  onPressEnter={this.saveAdd.bind(this, 'size')}
                  onBlur={this.saveAdd.bind(this, 'size')}
                  defaultValue={value}
                /> :
                (<div onClick={this.toggleEditing.bind(this, 'edit')} style={{ minHeight: '30px' }} >{value}</div>)
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
              edit ?
                <Input
                  onPressEnter={this.saveAdd.bind(this, 'unit')}
                  onBlur={this.saveAdd.bind(this, 'unit')}
                  defaultValue={value}
                /> :
                (<div onClick={this.toggleEditing.bind(this, 'edit')} style={{ minHeight: '30px' }} >{value}</div>)
            ) : <div>{value}</div>
        ),
      },
      {
        title: '可开票价',
        dataIndex: 'price',
        key: 'price',
        width: '150px',
        align: 'center',
      },
      {
        title: '即时库存',
        dataIndex: 'immNum',
        key: 'immNum',
        width: '150px',
        align: 'center',
      },
      {
        title: '可用库存',
        dataIndex: 'invCanUseNum',
        key: 'invCanUseNum',
        width: '150px',
        align: 'center',
        render: (value, record) => {
          return (
            <div style={{ color: 'red' }}>
              {value}
            </div>
          );
        },
      },
      {
        title: '占用库存',
        dataIndex: 'occNum',
        key: 'occNum',
        width: '150px',
        align: 'center',
      },
    ];
    // 多项xuanze
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows, ) => {
        selectedRows.map((value) => {
          dispatch({
            type: 'salesInvoiceFormList/updatePageReducer',
            payload: {
              userId: value.userId,
              selectedRowKeys,
              selectedRows,
            },
          });
        });
        dispatch({
          type: 'salesInvoiceFormList/changerowselection',
          payload: {
            selectedRowKeys,
            selectedRows,
          },
        });

      },
    };

    return (
      <PageHeaderLayout title="销售待申请开票表">
        <Card bordered={false}>
          <Row>
            <Search
              value={orderSn}
              placeholder="总单号/子单号"
              className={globalStyles['select-sift']}
              style={{ width: 200, marginRight: 30 }}
              onChange={this.handleChangeSiftItem.bind(this, 'orderSn')}
              onSearch={this.handleGetOrderList.bind(this)}
            />

            <Search
              value={goodsKeywords}
              placeholder="商品名称/条码"
              className={globalStyles['select-sift']}
              style={{ width: 200, marginRight: 30 }}
              onChange={this.handleChangeSiftItem.bind(this, 'goodsKeywords')}
              onSearch={this.handleGetOrderList.bind(this)}
            />

            <Search
              value={customerKeywords}
              placeholder="客户名/手机号/门店名称/收件人/收件人手机号"
              className={globalStyles['select-sift']}
              style={{ width: 350, marginRight: 30 }}
              onChange={this.handleChangeSiftItem.bind(this, 'customerKeywords')}
              onSearch={this.handleGetOrderList.bind(this)}
            />
            <Search
              value={invInfoKeywords}
              placeholder="发票信息"
              className={globalStyles['input-sift']}
              onChange={this.handleChangeSiftItem.bind(this, 'invInfoKeywords')}
              onSearch={this.handleGetOrderList.bind(this)}
            />

            <Select
              value={sellermap[sellerId]}
              className={globalStyles['select-sift']}
              placeholder="请选择业务员"
              style={{ marginRight: 30, width: 150 }}
              onChange={this.handleChangeSiftItem.bind(this, 'sellerId')}
            >
              <Option value={0}>选择业务员</Option>
              {
                  Object.keys(sellermap).map((sellerId) => {
                    return (
                      <Option value={sellerId}>{sellermap[sellerId]}</Option>
                    );
                  })
                }
            </Select>

            <Select
              value={invInfoType[invType]}
              className={globalStyles['select-sift']}
              placeholder="发票类型"
              style={{ marginRight: 30, width: 120 }}
              onChange={this.handleChangeSiftItem.bind(this, 'invType')}
            >
              {
                  Object.keys(invInfoType).map((invType) => {
                    return (
                      <Option value={invType}>{invInfoType[invType]}</Option>
                    );
                  })
                }
            </Select>
          </Row>

          <Row style={{ margin: 20, fontSize: 16 }}>
            下单时间：  <RangePicker
              value={[createDateStart ? moment(createDateStart, 'YYYY-MM-DD') : '', createDateEnd ? moment(createDateEnd, 'YYYY-MM-DD') : '']}
              className={styles.time}
              onChange={this.handleChangeSiftItem.bind(this, 'createDate')}
            />
            收款时间：  <RangePicker
              value={[payDateStart ? moment(payDateStart, 'YYYY-MM-DD') : '', payDateEnd ? moment(payDateEnd, 'YYYY-MM-DD') : '']}
              className={styles.time}
              onChange={this.handleChangeSiftItem.bind(this, 'payDate')}
            />
            {
                actionlist.map((actionInfo) => {
                  switch (Number(actionInfo.type)) {
                    case 2:
                      return (
                        <a
                          href={actionInfo.url}
                          target="_blank"
                        >
                          <Button type="primary" className={styles.button}>{actionInfo.name}</Button>
                        </a>
                      );
                      case 3:
                      return (
                        <a
                          href={`${actionInfo.url}&ids=${selectOrderIds}`}
                          target="_blank"

                      >
                          <Button type="primary" className={styles.button}>{actionInfo.name}</Button>
                        </a>
                      );
                      default:
                      break;
                  }
                })
              }


            {/* 弹窗层 */}
            <Button type="primary" onClick={this.showModal.bind(this)} className={styles.button} >申请开票</Button>
            <Modal
              visible={visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel.bind(this)}
              width="100%"
              footer={null}
            >
              <Row style={{ marginLeft: 30 }}>
                <Col style={{ marginTop: 20 }}>
                  <div className={styles.detailedlist}>对应明细表</div>
                </Col>
              </Row>
              <Row>
                <Table
                  columns={columnstwo}
                  dataSource={correspondingSchedule}
                  size="middle"
                  bordered
                  style={{ overflow: 'visible' }}
                  loading={loading}
                  rowKey={record => record.id}
                  pagination={false}
                  loading={loading}
                />
              </Row>
              <Row style={{ marginLeft: 30 }}>
                <Col>
                  <div className={styles.detailedlisttwo}>不对应明细表</div>
                </Col>
                <Row>
                  <Table
                    columns={columnsthree}
                    dataSource={wrongSchedule}
                    size="middle"
                    bordered
                    pagination={false}
                    loading={loading}
                  />
                </Row>
              </Row>
              <Row style={{ marginTop: 30, marginLeft: 30 }}>
                {
                  isinvData ?
                    <div>
                      <div>
                        <span style={{ verticalAlign: 'top', fontSize: '16px', fontWeight: 600 }}>发票类型：</span>
                        <Select
                          size="small"
                          style={{ width: 200, display: 'inline-block' }}
                          value={invInfoType[invType]}
                          onChange={this.handleChangeInvoiceInfo.bind(this)}
                    >
                          {
                                    (Object.entries(invInfoType).map((value) => {
                                      return <Option key={value[0]}>{value[1]}</Option>;
                                    }))
                                  }
                        </Select>
                        <Icon
                          type="edit"

                  />
                      </div>
                      <div style={{ float: 'left' }}>
                        <div style={{ verticalAlign: 'top', fontSize: '16px', fontWeight: 600 }}><span>开票公司名称：</span>{checkinvoiceinformation.companyName}</div>
                        <div style={{ verticalAlign: 'top', fontSize: '16px', fontWeight: 600 }}><span>企业税号：</span>{checkinvoiceinformation.companyTaxID}</div>
                        <div style={{ verticalAlign: 'top', fontSize: '16px', fontWeight: 600 }}><span>地址：</span>{checkinvoiceinformation.address}</div>
                        <div style={{ verticalAlign: 'top', fontSize: '16px', fontWeight: 600 }}><span>电话：</span>{checkinvoiceinformation.phoneNumber}</div>
                        <div style={{ verticalAlign: 'top', fontSize: '16px', fontWeight: 600 }}><span>开户行：</span>{checkinvoiceinformation.bank}</div>
                        <div style={{ verticalAlign: 'top', fontSize: '16px', fontWeight: 600 }}><span>账号：</span>{checkinvoiceinformation.bankAccount}</div>
                        <div style={{ verticalAlign: 'top', fontSize: '16px', fontWeight: 600 }}>
                销售备注：<TextArea
                  rows={4}
                  placeholder="请输入销售备注，流转至财务可见"
                  className={styles.beizhu}
                  autosize="false"
                  onChange={this.remarks.bind(this)}
                />
                        </div>
                      </div>
                    </div>
                :
                    <div>
                      <div>
                        <span style={{ verticalAlign: 'top', fontSize: '16px', fontWeight: 600 }}>发票类型：{invInfoType[invTypeId]}</span>
                        <Icon
                          type="edit"
                          onClick={this.showinvoiceInfo.bind(this)}
                />
                      </div>
                      <div style={{ float: 'left' }}>
                        <div style={{ verticalAlign: 'top', fontSize: '16px', fontWeight: 600 }}><span>开票公司名称：</span>{invData.companyName}</div>
                        <div style={{ verticalAlign: 'top', fontSize: '16px', fontWeight: 600 }}><span>企业税号：</span>{invData.companyTaxID}</div>
                        <div style={{ verticalAlign: 'top', fontSize: '16px', fontWeight: 600 }}><span>地址：</span>{invData.address}</div>
                        <div style={{ verticalAlign: 'top', fontSize: '16px', fontWeight: 600 }}><span>电话：</span>{invData.phoneNumber}</div>
                        <div style={{ verticalAlign: 'top', fontSize: '16px', fontWeight: 600 }}><span>开户行：</span>{invData.bank}</div>
                        <div style={{ verticalAlign: 'top', fontSize: '16px', fontWeight: 600 }}><span>账号：</span>{invData.bankAccount}</div>
                        <div style={{ verticalAlign: 'top', fontSize: '16px', fontWeight: 600 }}>
              销售备注：<TextArea
                rows={4}
                placeholder="请输入销售备注，流转至财务可见"
                className={styles.beizhu}
                autosize="false"
                onChange={this.remarks.bind(this)}
              />
                        </div>
                      </div>
                    </div>
                }
                <div style={{ float: 'right', marginTop: 80, marginRight: 40 }}>
                  <Row style={{ marginBottom: 20 }}>应开票金额：<span style={{ fontWeight: '600', color: 'red', fontSize: 20 }}>{totalInvoicePayable}</span></Row>
                  <Button style={{ marginRight: 10 }} onClick={this.handleCancel.bind(this)}>取消</Button>
                  <Button type="primary" style={{ marginRight: 10 }} onClick={this.preservation.bind(this)}>保存</Button>
                  <Button type="primary" style={{ marginRight: 10 }} onClick={this.submissionOfAudit.bind(this)}>提交总监审核</Button>
                </div>
              </Row>
            </Modal>
          </Row>
          {/* 弹窗二 */}
          <Modal
            visible={visibletwo}
            onCancel={this.changeOfInvoiceType.bind(this)}
            width="70%"
            onOk={this.changeOfInvoiceType.bind(this)}
          >
            <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginTop: 10, marginBottom: 25 }}>
              <Col md={12} style={{ height: 26, lineHeight: '26px' }}>
                <span style={{ fontSize: '18px', color: '#AEAEAE', fontFamily: 'Arial Negreta', fontWeight: '700' }}>发票信息 </span>
                <span className={styles.addBtn} onClick={this.handleClickAddInvoiceBtn.bind(this)}>新建发票</span>
              </Col>
            </Row>
            <Table
              columns={Invoiceformlist}
              dataSource={Invoiceform}
              size="middle"
              rowKey={record => record.invoiceId}
              bordered
              loading={loading}
              rowSelection={{
                type: 'radio',
                // selectedRowKeys: invoiceIds,
                onSelect: (invoiceKey) => {
                  this.handleCheckInvoiceRadio(invoiceKey);
                },
                onChange: (selectedRowKey, selectedRow) => {
                    console.log(selectedRowKey);
                },
              }}
            />
          </Modal>
          {/* 弹窗三：新建发票 */}
          <Modal
            visible={isnewinvoice}
            onCancel={this.changeleClickAddInvoiceBtn.bind(this)}
            onOk={this.okclickadd.bind(this)}
            width="70%"
          >
            <Row>
              <Col md={12} style={{ height: 26, lineHeight: '26px' }}>
                <span style={{ fontSize: '18px', color: '#AEAEAE', fontFamily: 'Arial Negreta', fontWeight: '700' }}>发票信息 </span>
                <span style={{ fontSize: '14px', color: '#AEAEAE', fontFamily: 'Arial Negreta' }}>{invInfoType[invType]}</span>
              </Col>
            </Row>
            <Row style={{ width: 1100, marginTop: 10, marginLeft: 30 }}>
              <Col md={8} style={{ height: 26, lineHeight: '26px' }}>
                <span style={{ display: 'inlineBlock', fontSize: '16px', fontWeight: 600 }}>发票抬头：
                  <Input
                    size="small"
                    style={{ width: 200 }}
                    value={companyName}
                    onChange={this.onChangewcompanyName.bind(this)}
                  />
                </span>
              </Col>
              <Col md={8} style={{ height: 26, lineHeight: '26px' }}>
                <span style={{ display: 'inlineBlock', fontSize: '16px', fontWeight: 600 }}>企业税号：
                  <Input
                    size="small"
                    style={{ width: 200 }}
                    value={companyTaxID}
                    onChange={this.onChangewcompanyTaxID.bind(this)}
                  />
                </span>
              </Col>
              <Col md={8} style={{ height: 26, lineHeight: '26px' }}>
                <span style={{ display: 'inlineBlock', fontSize: '16px', fontWeight: 600 }}>单位地址：
                  <Input
                    size="small"
                    style={{ width: 200 }}
                    value={address}
                    onChange={this.onChangewaddress.bind(this)}
                  />
                </span>
              </Col>
              <Col md={8} style={{ height: 26, lineHeight: '26px', marginTop: 10 }}>
                <span style={{ display: 'inlineBlock', fontSize: '16px', fontWeight: 600 }}>联系电话：
                  <Input
                    size="small"
                    style={{ width: 200 }}
                    value={phoneNumber}
                    onChange={this.onChangewphoneNumber.bind(this)}
                  />
                </span>
              </Col>
              <Col md={8} style={{ height: 26, lineHeight: '26px', marginTop: 10 }}>
                <span style={{ display: 'inlineBlock', fontSize: '16px', fontWeight: 600 }}>开户银行：
                  <Input
                    size="small"
                    style={{ width: 200 }}
                    value={bank}
                    onChange={this.onChangewbank.bind(this)}
                  />
                </span>
              </Col>
              <Col md={8} style={{ height: 26, lineHeight: '26px', marginTop: 10 }}>
                <span style={{ display: 'inlineBlock', fontSize: '16px', fontWeight: 600 }}>银行账户：
                  <Input
                    size="small"
                    style={{ width: 200 }}
                    value={bankAccount}
                    onChange={this.onChangewbankAccount.bind(this)}
                  />
                </span>
              </Col>
            </Row>
          </Modal>
          {/* 弹窗四：修改弹窗 */}
          <Modal
            visible={ismodifytheinvoice}
            onCancel={this.hiddenmodifytheinvoice.bind(this)}
            width="70%"
            onOk={this.okleClickAddInvoiceBtn.bind(this)}
          >
            <Row>
              <Col md={12} style={{ height: 26, lineHeight: '26px' }}>
                <span style={{ fontSize: '18px', color: '#AEAEAE', fontFamily: 'Arial Negreta', fontWeight: '700' }}>发票信息 </span>
                <span style={{ fontSize: '14px', color: '#AEAEAE', fontFamily: 'Arial Negreta' }}>{invInfoType[invType]}</span>
              </Col>
            </Row>
            <Row style={{ width: 1100, marginTop: 10, marginLeft: 30 }}>
              <Col md={8} style={{ height: 26, lineHeight: '26px' }}>
                <span style={{ display: 'inlineBlock', fontSize: '16px', fontWeight: 600 }}>发票抬头：
                  <Input
                    size="small"
                    style={{ width: 200 }}
                    value={companyName}
                    onChange={this.onChangewcompanyName.bind(this)}
                  />
                </span>
              </Col>
              <Col md={8} style={{ height: 26, lineHeight: '26px' }}>
                <span style={{ display: 'inlineBlock', fontSize: '16px', fontWeight: 600 }}>企业税号：
                  <Input
                    size="small"
                    style={{ width: 200 }}
                    value={companyTaxID}
                    onChange={this.onChangewcompanyTaxID.bind(this)}
                  />
                </span>
              </Col>
              <Col md={8} style={{ height: 26, lineHeight: '26px' }}>
                <span style={{ display: 'inlineBlock', fontSize: '16px', fontWeight: 600 }}>单位地址：
                  <Input
                    size="small"
                    style={{ width: 200 }}
                    value={address}
                    onChange={this.onChangewaddress.bind(this)}
                  />
                </span>
              </Col>
              <Col md={8} style={{ height: 26, lineHeight: '26px', marginTop: 10 }}>
                <span style={{ display: 'inlineBlock', fontSize: '16px', fontWeight: 600 }}>联系电话：
                  <Input
                    size="small"
                    style={{ width: 200 }}
                    value={phoneNumber}
                    onChange={this.onChangewphoneNumber.bind(this)}
                  />
                </span>
              </Col>
              <Col md={8} style={{ height: 26, lineHeight: '26px', marginTop: 10 }}>
                <span style={{ display: 'inlineBlock', fontSize: '16px', fontWeight: 600 }}>开户银行：
                  <Input
                    size="small"
                    style={{ width: 200 }}
                    value={bank}
                    onChange={this.onChangewbank.bind(this)}
                  />
                </span>
              </Col>
              <Col md={8} style={{ height: 26, lineHeight: '26px', marginTop: 10 }}>
                <span style={{ display: 'inlineBlock', fontSize: '16px', fontWeight: 600 }}>银行账户：
                  <Input
                    size="small"
                    style={{ width: 200 }}
                    value={bankAccount}
                    onChange={this.onChangewbankAccount.bind(this)}
                  />
                </span>
              </Col>
            </Row>
          </Modal>
          {/* 弹窗五：更多商品弹窗 */}
          <Modal
            closable={false}
            maskClosable={false}
            width={1800}
            visible={isShowInvGoodsNameModal}
            onOk={this.handleInvGoodsNameModalOk.bind(this)}
            onCancel={this.handleInvGoodsNameModalCancel.bind(this)}
          >
            <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginTop: 10, marginBottom: 25 }}>
              <Col md={12} style={{ height: 26, lineHeight: '26px' }}>
                <div>
                  <Search
                    style={{ width: 320, marginLeft: 20 }}
                    enterButton="搜索"
                    placeholder="请输入商品名称/条码/发票商品名称"
                    onSearch={this.handleSearchInvGoodsNamess.bind(this)}
                  />
                </div>
              </Col>
              <Col md={2} offset={9} style={{ height: 26, lineHeight: '26px' }}>
                <Button type="primary" onClick={this.showAddInvoiceGoodsNameModal.bind(this)}>新建</Button>
              </Col>
            </Row>
            <Table
              bordered
              loading={isInvGoodsNameLoading}
              rowKey={record => record.id}
              disabled={isdisabled}
              rowSelection={{
                type: 'radio',
                selectedRowKeys: selectedIds,
                onChange: this.handleCheckGoods.bind(this),
              }}
              dataSource={invoiceGoodsList}
              columns={invoiceGoodsListColumns}
              pagination={{
                current: currentPage,
                pageSize,
                onShowSizeChange: this.handleChangeInputValue.bind(this, 'pageSize'),
                onChange: this.handleChangeInputValue.bind(this, 'currentPage'),
                showSizeChanger: true,
                total: invGoodsNameListData.total,
              }}
            />
          </Modal>
          {/* 新建发票商品弹窗 */}
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
              loading={loading}
            />
          </Modal>


          <Row>
            <Table
              columns={columns}
              dataSource={list}
              size="middle"
              bordered
              loading={loading}
              rowKey={record => record.id}
              rowSelection={{
                selectedRowKeys: selectOrderIds,
                // rowSelection,
                onChange: this.handleChangeSelectOrderIds.bind(this),
              }
              }
              pagination={{
                  total,
                  current: currentPage,
                  pageSize,
                  pageSizeOptions: [100, 200, 300],
                  // defaultPageSize:100,
                  showSizeChanger: true,
                  onShowSizeChange: this.handleChangeSiftItem.bind(this, 'pageSize'),
                  onChange: this.handleChangeSiftItem.bind(this, 'currentPage'),
                  showTotal:total => `共 ${total} 个结果`,
                }}
            />
          </Row>
        </Card>
      </PageHeaderLayout>
    );
  }
}
