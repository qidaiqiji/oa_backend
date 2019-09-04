import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import Debounce from 'lodash-decorators/debounce';
import { Row, Col, Cascader, message, Card, Input, Select, Button, Modal, Table, DatePicker, Tooltip, Icon, Popconfirm, Radio } from 'antd';
import { Link } from 'dva/router';
// import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './SaleOrderAdd.less';

const { Option } = Select;
const { Search } = Input;
const RadioGroup = Radio.Group;

@connect(state => ({
  saleOrderAdd: state.saleOrderAdd,
  user: state.user,
}))
export default class TableList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      invoiceInfoMap: { 1: '不开票', 2: '普通发票', 3: '增值发票' },
      editable: false,
      isfareInfo: false,
      isReceivingInfo: false,
      isDeliveryDate: false,
      isPayInfo: false,
      ispayCondition: false,
      isInvoiceInfo: false,
      userRadioId: '',
      goodsCheckboxIds: [],
      invoiceInfoType: 1,
      addCompanyName: '',
      addAddress: '',
      addPhoneNumber: '',
      addCompanyTaxID: '',
      addBank: '',
      addBankAccount: '',
      invoiceId: '',
      invoiceInfos: null,
      receivingId: null,
      receivingCheckInfo: null,
      changeUserWarning: false,
      moreGoodsKeywords: '',
      moreUserKeywords: '',
      pageId: this.props.match.params.id ? this.props.match.params.id : '',
    };
  }
  componentDidMount() {
    const { dispatch } = this.props;
    const { id } = this.props.match.params;
    // 如果有 id 证明为修改订单, 否则为新增订单
    if (id) {
      dispatch({
        type: 'saleOrderAdd/getConfig',
        payload: {
          id,
          curPage: '-1',
        },
      });
    } else {
      dispatch({
        type: 'saleOrderAdd/getConfig',
        payload: {
          curPage: '-1',
        },
      });
    }
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'saleOrderAdd/unmount',
    });
  }
  // 更多客户换页回调
  handleChangePage = (page) => {
    const { dispatch } = this.props;
    const { moreUserKeywords } = this.state;
    dispatch({
      type: 'saleOrderAdd/getUsersPage',
      payload: {
        curPage: page,
        value: moreUserKeywords,
      },
    });
  }
  // 更所商品换页回调
  handleChangeMoreGoodsPage = (page) => {
    const { dispatch } = this.props;
    const { moreGoodsKeywords } = this.state;
    dispatch({
      type: 'saleOrderAdd/getGoodsPage',
      payload: {
        curPage: page,
        value: moreGoodsKeywords,
      },
    });
  }
  // 收货信息输入框改变------- 开始
  handleChangeReceivingAddressValue(value) {
    const { dispatch } = this.props;
    if (value.length > 2) {
      dispatch({
        type: 'saleOrderAdd/changeReceivingAddressValue',
        payload: {
          province: value[0],
          city: value[1],
          district: value[2],
        },
      });
    } else {
      dispatch({
        type: 'saleOrderAdd/changeReceivingAddressValue',
        payload: {
          province: value[0],
          city: value[1],
          district: null,
        },
      });
    }
  }
  handleChangeReceivingUserName(e) {
    const { value } = e.target;
    const { dispatch } = this.props;
    dispatch({
      type: 'saleOrderAdd/changeReceivingAddressValue',
      payload: {
        userName: value,
      },
    });
  }
  handleChangeReceivingPhoneNumber(e) {
    const { value } = e.target;
    const { dispatch } = this.props;
    dispatch({
      type: 'saleOrderAdd/changeReceivingAddressValue',
      payload: {
        mobilePhone: value,
      },
    });
  }
  handleChangeReceivingAddress(e) {
    const { value } = e.target;
    const { dispatch } = this.props;
    dispatch({
      type: 'saleOrderAdd/changeReceivingAddressValue',
      payload: {
        address: value,
      },
    });
  }
  // 收货信息输入框改变------- 结束
  // 发票输入框改变-------- 开始
  handleChangeAddCompanyName = (e) => {
    const { value } = e.target;
    this.setState({ addCompanyName: value });
  }
  handleChangeAddAddress = (e) => {
    const { value } = e.target;
    this.setState({ addAddress: value });
  }
  handleChangeAddPhoneNumber = (e) => {
    const { value } = e.target;
    this.setState({ addPhoneNumber: value });
  }
  handleChangeAddCompanyTaxID = (e) => {
    const { value } = e.target;
    this.setState({ addCompanyTaxID: value });
  }
  handleChangeAddBank = (e) => {
    const { value } = e.target;
    this.setState({ addBank: value });
  }
  handleChangeAddBankAccount = (e) => {
    const { value } = e.target;
    this.setState({ addBankAccount: value });
  }
  // 发票输入框改变-------- 结束
  // 选择特批价
  handleChangeSpecialPrice = (e) => {
    const { value } = e.target;
    const { dispatch } = this.props;
    dispatch({
      type: 'saleOrderAdd/changeSpecialPrice',
      payload: {
        value,
      },
    });
  }
  // 选择运费信息
  handleChangeFareInfo(value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'saleOrderAdd/changeFareInfo',
      payload: {
        value,
      },
    });
  }
  // 选择支付信息
  handleChangePayInfo(value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'saleOrderAdd/changePayInfo',
      payload: {
        value,
      },
    });
  }
  // 选择账期条件
  handDefaultPayInfoId(value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'saleOrderAdd/changePayInfoId',
      payload: {
        value,
      },
    });
  }
  // 下拉框选择发票信息
  handleChangeInvoiceInfo(value) {
    const { dispatch } = this.props;
    const { invoiceInfoMap } = this.state;
    this.setState({ invoiceInfoType: value });
    if (invoiceInfoMap[value] === '不开票') {
      this.setState({
        isInvoiceInfo: false,
        invoiceInfos: [''],
      });
    } else {
      dispatch({
        type: 'saleOrderAdd/changeInvoiceInfo',
        payload: {
          type: value,
        },
      });
    }
  }
  // 发票修改弹窗
  handleUpdateInvoiceInfo(record) {
    const { dispatch } = this.props;
    this.setState({
      invoiceId: record.invoiceId,
      addCompanyName: record.companyName,
      addAddress: record.address,
      addPhoneNumber: record.phoneNumber,
      addCompanyTaxID: record.companyTaxID,
      addBank: record.bank,
      addBankAccount: record.bankAccount,
    });
    dispatch({
      type: 'saleOrderAdd/changeUpdateInvoiceInfoConfirm',
    });
  }
  // 新建发票弹窗
  handleClickAddInvoiceBtn() {
    const { dispatch } = this.props;
    this.setState({
      addCompanyName: '',
      addAddress: '',
      addPhoneNumber: '',
      addCompanyTaxID: '',
      addBank: '',
      addBankAccount: '',
    });
    dispatch({
      type: 'saleOrderAdd/changeAddInvoiceInfoConfirm',
    });
  }
  // 查看更多客户
  handleMoreUserInfo() {
    const { dispatch } = this.props;
    dispatch({
      type: 'saleOrderAdd/showMoreUser',
      payload: {
        curPage: 1,
      },
    });
  }
  // 查看更多商品
  handleMoreGoodsInfo() {
    const { dispatch } = this.props;
    dispatch({
      type: 'saleOrderAdd/showMoreGoods',
      payload: {
        curPage: 1,
      },
    });
  }
  // 改变特批价状态
  check() {
    this.setState({ editable: !this.state.editable });
  }
  // 改变支付信息状态
  payInfo() {
    this.setState({ isPayInfo: true });
  }
  // 改变账期条件状态
  payCondition() {
    this.setState({ ispayCondition: true });
  }
  // 改变运费信息状态
  fareInfo() {
    this.setState({ isfareInfo: true });
  }
  // 改变发票信息状态
  invoiceInfo() {
    this.setState({ isInvoiceInfo: true });
  }
  // 打开收货信息列表弹窗
  receivingInfo() {
    this.setState({ isReceivingInfo: true });
    const { dispatch } = this.props;
    dispatch({
      type: 'saleOrderAdd/openReceivingInfoConfirm',
    });
  }

  // 打开新增地址弹窗
  handleClickUpdateReceivingBtn() {
    const { dispatch } = this.props;
    this.setState({ receivingId: null });
    dispatch({
      type: 'saleOrderAdd/clickAddReceivingInfoConfirm',
    });
  }

  // 确认删除收货信息
  handleDeleteReceiving(record) {
    const { dispatch, saleOrderAdd } = this.props;
    const { userInfos, orderDetail } = saleOrderAdd;
    const { pageId } = this.state;
    dispatch({
      type: 'saleOrderAdd/clickDeleteReceiving',
      payload: {
        userId: pageId ? orderDetail.userId : userInfos[0].userId,
        addressId: record.receivingId,
      },
    });
  }
  // 收货信息修改弹窗
  handleUpdateReceivingInfo(record) {
    const { dispatch } = this.props;
    this.setState({ receivingId: record.receivingId });
    dispatch({
      type: 'saleOrderAdd/clickAddReceivingInfoConfirm',
      payload: {
        userName: record.userName,
        mobilePhone: record.mobilePhone,
        province: JSON.stringify(record.province.id),
        city: JSON.stringify(record.city.id),
        district: JSON.stringify(record.district.id),
        address: record.address,
      },
    });
  }

  // 确认设置默认收货地址
  handleOkDefaultReceivingInfo(record) {
    const { dispatch, saleOrderAdd } = this.props;
    const { userInfos, orderDetail } = saleOrderAdd;
    const { pageId } = this.state;
    dispatch({
      type: 'saleOrderAdd/clickOkDefaultReceivingInfo',
      payload: {
        userId: pageId ? orderDetail.userId : userInfos[0].userId,
        addressId: record.receivingId,
      },
    });
  }
  // 确认设置默认发票
  handleOkDefaultInvoiceInfo(record) {
    const { dispatch, saleOrderAdd } = this.props;
    const { userInfos } = saleOrderAdd;
    dispatch({
      type: 'saleOrderAdd/clickOkDefaultInvoiceInfo',
      payload: {
        userId: userInfos[0].userId,
        invoiceId: record.invoiceId,
        isDefault: true,
      },
    });
  }
  // 确认删除发票
  handleDeleteInvoiceInfo(record) {
    const { dispatch, saleOrderAdd } = this.props;
    const { userInfos, orderDetail } = saleOrderAdd;
    const { pageId } = this.state;
    dispatch({
      type: 'saleOrderAdd/clickDeleteInvoice',
      payload: {
        userId: pageId ? orderDetail.userId : userInfos[0].userId,
        invoiceId: record.invoiceId,
      },
    });
  }

  // 选择商品
  handleSelectGoods(goodsId, option) {
    const { dispatch } = this.props;
    dispatch({
      type: 'saleOrderAdd/changeGoods',
      payload: {
        goodsId: option.props.goodsId,
      },
    });
  }
  // 选择客户
  handleSelectUsers(userId) {
    const { dispatch } = this.props;
    dispatch({
      type: 'saleOrderAdd/changeUser',
      payload: {
        userId,
      },
    });
    this.setState({
      isPayInfo: true,
      isfareInfo: true,
      changeUserWarning: false,
      ispayCondition: true,
    });
  }
  handleClickOkMoreUserInfoButtonbind() {
    const { dispatch } = this.props;
    const { userRadioId } = this.state;
    dispatch({
      type: 'saleOrderAdd/changeUser',
      payload: {
        userId: userRadioId,
      },
    });
    this.setState({
      isPayInfo: true,
      isfareInfo: true,
      changeUserWarning: false,
      ispayCondition: true,
    });
  }
  handleClickOkMoreGoodsInfoButtonbind() {
    const { dispatch } = this.props;
    const { goodsCheckboxIds } = this.state;
    dispatch({
      type: 'saleOrderAdd/changeGoods',
      payload: {
        goodsId: goodsCheckboxIds,
      },
    });
    this.setState({
      goodsCheckboxIds: [],
    });
  }
  // 确认删除, 修改订单时有效
  // 删除列表中的商品
  handleDeleteGoods(goodsId, rowId, index) {
    const { dispatch } = this.props;
    const isEdit = !!this.props.match.params.id;
    if (isEdit) {
      dispatch({
        type: 'saleOrderAdd/deleteGoods',
        payload: {
          goodsId,
          rowId,
          index,
        },
      });
    } else {
      dispatch({
        type: 'saleOrderAdd/deleteGoods',
        payload: {
          goodsId,
          index,
        },
      });
    }
  }
  // 确认改变收货信息弹窗
  handleClickOkChangeReceivingInfoButton() {
    const { dispatch, saleOrderAdd } = this.props;
    const { orderDetail, userInfos, userName, mobilePhone, province, city, district, address } = saleOrderAdd;
    const { receivingId, pageId } = this.state;
    this.setState({ receivingCheckInfo: null });
    if (receivingId) {
      dispatch({
        type: 'saleOrderAdd/changeReceivingInfoOk',
        payload: {
          userId: pageId ? orderDetail.userId : userInfos[0].userId,
          addressId: receivingId,
          userName,
          mobilePhone,
          province,
          city,
          district,
          address,
        },
      });
    } else {
      dispatch({
        type: 'saleOrderAdd/addReceivingInfoOk',
        payload: {
          userId: pageId ? orderDetail.userId : userInfos[0].userId,
          userName,
          mobilePhone,
          province,
          city,
          district,
          address,
        },
      });
    }
  }
  // 确认收货信息列表弹窗
  handleClickOkReceivingInfoButton() {
    const { receivingCheckInfo } = this.state;
    const { dispatch } = this.props;
    if (receivingCheckInfo) {
      dispatch({
        type: 'saleOrderAdd/clickReceivingInfoListOkBtn',
        payload: {
          receivingInfos: receivingCheckInfo,
        },
      });
    } else {
      dispatch({
        type: 'saleOrderAdd/clickReceivingInfoListOkBtn',
        payload: {
          receivingInfos: null,
        },
      });
    }
  }
  // 确认新建发票
  handleClickOkAddInvoiceInfoButton() {
    const { dispatch, saleOrderAdd } = this.props;
    const { userInfos, orderDetail } = saleOrderAdd;
    const { pageId } = this.state;
    const {
      addCompanyName,
      addAddress,
      addPhoneNumber,
      addCompanyTaxID,
      addBank,
      addBankAccount,
    } = this.state;
    dispatch({
      type: 'saleOrderAdd/addInvoiceInfo',
      payload: {
        userId: pageId ? orderDetail.userId : userInfos[0].userId,
        companyName: addCompanyName,
        address: addAddress,
        phoneNumber: addPhoneNumber,
        companyTaxID: addCompanyTaxID,
        bank: addBank,
        bankAccount: addBankAccount,
      },
    });
  }
  // 确认修改发票信息的弹窗
  handleClickOkUpdateInvoiceInfoButton() {
    const { dispatch, saleOrderAdd } = this.props;
    const { userInfos, orderDetail } = saleOrderAdd;
    const { pageId } = this.state;
    const {
      addCompanyName,
      addAddress,
      addPhoneNumber,
      addCompanyTaxID,
      addBank,
      addBankAccount,
      invoiceId,
    } = this.state;
    dispatch({
      type: 'saleOrderAdd/updateOkInvoiceInfo',
      payload: {
        userId: pageId ? orderDetail.userId : userInfos[0].userId,
        companyName: addCompanyName,
        address: addAddress,
        phoneNumber: addPhoneNumber,
        companyTaxID: addCompanyTaxID,
        bank: addBank,
        bankAccount: addBankAccount,
        invoiceId,
      },
    });
  }
  // 取消修改发票信息的弹窗
  handleClickCancelUpdateInvoiceInfoButton() {
    const { dispatch } = this.props;
    dispatch({
      type: 'saleOrderAdd/handleClickCancelUpdateInvoiceInfoButton',
    });
  }
  // 确认选中发票的信息
  handleClickOkInvoiceInfoButton() {
    const { dispatch, saleOrderAdd } = this.props;
    const { invoiceInfo } = saleOrderAdd;
    const { invoiceId } = this.state;
    for (let i = 0; i < invoiceInfo.length; i += 1) {
      if (invoiceId === invoiceInfo[i].invoiceId) {
        this.setState({
          invoiceInfos: [invoiceInfo[i]],
          isInvoiceInfo: false,
        });
      }
    }
    dispatch({
      type: 'saleOrderAdd/clickOkInvoiceInfoButton',
    });
  }
  // 取消发票信息列表的弹窗
  handleClickCancelInvoiceInfoButton() {
    const { dispatch } = this.props;
    dispatch({
      type: 'saleOrderAdd/clickCancelInvoiceInfoButton',
    });
  }
  // 取消新建发票信息
  handleClickCancelAddInvoiceInfoButton() {
    const { dispatch } = this.props;
    dispatch({
      type: 'saleOrderAdd/clickCancelAddInvoiceInfoButton',
    });
  }

  // 取消收货信息列表弹窗
  handleClickCancelReceivingInfoButton() {
    const { dispatch } = this.props;
    dispatch({
      type: 'saleOrderAdd/clickCancelReceivingInfoButton',
    });
  }

  // 取消新建或修改收货信息弹窗
  handleClickCancelChangeReceivingInfoButton() {
    const { dispatch } = this.props;
    this.setState({ receivingId: null });
    dispatch({
      type: 'saleOrderAdd/clickCancelChangeReceivingInfoButton',
    });
  }

  // 取消更多客户弹窗
  handleClickCancelMoreUserInfoButton() {
    const { dispatch } = this.props;
    dispatch({
      type: 'saleOrderAdd/clickCancelMoreUserInfoButton',
    });
  }
  // 取消更多商品弹窗
  handleClickCancelMoreGoodsInfoButton() {
    const { dispatch } = this.props;
    dispatch({
      type: 'saleOrderAdd/clickCancelMoreGoodsInfoButton',
    });
  }
  // 修改商品价格
  handleChangeSalePrice(goodsId, index, e) {
    const price = e.target.value;
    const { dispatch } = this.props;
    // const reg = new RegExp('^[0-9]*$');
    // if (!reg.test(price)) {
    //   return;
    // }
    dispatch({
      type: 'saleOrderAdd/changeSalePrice',
      payload: {
        price,
        goodsId,
        index,
      },
    });
  }
  // 修改是否含税状态
  handleChangeIsTax(goodsId, index, e) {
    const isTax = e.target.value;
    const { dispatch } = this.props;
    dispatch({
      type: 'saleOrderAdd/changeIsTax',
      payload: {
        isTax,
        goodsId,
        index,
      },
    });
  }
  // 修改商品的数量
  handleChangeSaleNum(goodsId, canUseNum, index, e) {
    let number = e.target.value;
    const { dispatch } = this.props;
    const reg = new RegExp('^[0-9]*$');
    if (!reg.test(number)) {
      return;
    }
    if (number > canUseNum) {
      message.error('销售数不可超过最大可用数, 已自动帮您设置为最大可用数!', 0.5);
      number = canUseNum;
    }
    dispatch({
      type: 'saleOrderAdd/changeSaleNum',
      payload: {
        number,
        goodsId,
        index,
      },
    });
  }
  handleChangeGoodsRemark(goodsId, index, e) {
    const remark = e.target.value;
    const { dispatch } = this.props;
    dispatch({
      type: 'saleOrderAdd/changeGoodsRemark',
      payload: {
        goodsRemark: remark,
        goodsId,
        index,
      },
    });
  }
  // 修改日期
  handleChangeDate(date) {
    const { dispatch } = this.props;
    dispatch({
      type: 'saleOrderAdd/changeDate',
      payload: {
        date: date.format('YYYY-MM-DD'),
      },
    });
  }
  handleChangeRemark(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'saleOrderAdd/changeRemark',
      payload: {
        remark: e.target.value,
      },
    });
  }
  // 提交审核
  handleClickSaveBtn() {
    
    const { dispatch, saleOrderAdd } = this.props;
    // const { invoiceInfoType, invoiceInfoMap } = this.state;
    const { orderDetail, userInfos, fareInfo, receivingInfos, defaultReceivingInfos, date, payInfo, defaultInvoiceInfos, goodsInfos, specialPrice, remark, payCondition, payConditionMap, invoiceInfo,invoiceInfoType, type } = saleOrderAdd;
    const { invoiceInfos, pageId } = this.state;
    const { id } = this.props.match.params;
    const goodsInfo = [];
    
    const tax = goodsInfos.some((item)=>{
      return item.isTax === 1;
    })
    if(tax){
      // 这段代码看不懂
      // if(invoiceInfoType === 1 || invoiceInfo.length == 0 || invoiceInfos==null){
      //   message.warning("请输入发票信息");
      //   return;
      // }
      if(invoiceInfoType === 1 || invoiceInfo.length == 0){
        message.warning("请输入发票信息");
        return;
      }
    } 
    if (goodsInfos.length > 0) {
      for (let i = 0; i < goodsInfos.length; i += 1) {
        const { goodsId, saleNum, goodsRemark, salePrice, isTax } = goodsInfos[i];
        if (+saleNum === 0) {
          message.error('有商品的数量为0,请修改后提交!', 0.5);
          return;
        }
        const obj = {
          salePrice,
          goodsId,
          saleNum,
          goodsRemark,
          isTax,
        };
        goodsInfo.push(obj);
      }
    }
    if (pageId) {

      dispatch ({

        type: 'saleOrderAdd/clickSaveModifyBtn',
        payload: {
          id,
          userId: orderDetail.userId,
          receiving: receivingInfos.length > 0 ? receivingInfos[0].receivingId : -1,
          invoiceType: invoiceInfoType || -1,
          date,
          payInfo: payInfo || -1,
          payCondition,
          payConditionMap,
          invoiceInfo: (invoiceInfos !== null && invoiceInfos.length > 0) ? invoiceInfos[0].invoiceId : -1,
          goodsInfos: goodsInfo,
          specialPrice,
          remark,
        },
      });
    } else {

      const receiving = [];
      const invoiceInfo = [];
      const invoiceTypeArr = [];
      if (receivingInfos.length > 0) {
        receiving.push(receivingInfos[0].receivingId);
      }
      if (receivingInfos.length === 0 && defaultReceivingInfos.length > 0) {
        receiving.push(defaultReceivingInfos[0].receivingId);
      }
      if (receivingInfos.length === 0 && defaultReceivingInfos.length === 0) {
        receiving.push('');
      }
      if (invoiceInfos !== null && invoiceInfos.length > 0) {
        invoiceInfo.push(invoiceInfos[0].invoiceId);
      }
      if ((invoiceInfos === null || invoiceInfos.length === 0) && defaultInvoiceInfos.length > 0) {
        invoiceInfo.push(defaultInvoiceInfos[0].invoiceId);
      }
      if ((invoiceInfos === null || invoiceInfos.length === 0) && defaultInvoiceInfos.length === 0) {
        invoiceInfo.push('');
      }
      if (invoiceInfoType) {
        invoiceTypeArr.push(invoiceInfoType);
      }

      dispatch({

        type: 'saleOrderAdd/clickSaveBtn',
        payload: {
          userId: userInfos[0].userId,
          fareInfo,
          payCondition,
          receiving: receiving[0],
          // invoiceType: +invoiceTypeArr[0],
          // invoiceType:orderDetail.invoiceType,
          invoiceType:type,
          date,
          payInfo,
          payCondition,
          invoiceInfo: invoiceInfo[0],
          goodsInfos: goodsInfo,
          specialPrice,
          remark,
        },
      });
    }
  }
  @Debounce(200)
  handleSearchGoods(value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'saleOrderAdd/searchGoods',
      payload: {
        // goods: this.props.saleOrderAdd.goods,
        value,
        curPage: this.props.saleOrderAdd.curPage,
      },
    });
  }
  handleMoreSearchGoods(value) {
    const { dispatch } = this.props;
    this.setState({ moreGoodsKeywords: value });
    dispatch({
      type: 'saleOrderAdd/moreSearchGoods',
      payload: {
        curPage: this.props.saleOrderAdd.curPage,
        value,
      },
    });
  }
  handleSearchUsersFocus() {
    this.setState({ changeUserWarning: true });
  }
  handleSearchUsersBlur() {
    this.setState({ changeUserWarning: false });
  }
  @Debounce(200)
  handleSearchUsers(value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'saleOrderAdd/searchUsers',
      payload: {
        // users: this.props.saleOrderAdd.users,
        value,
        curPage: this.props.saleOrderAdd.curPage,
      },
    });
  }
  handleMoreSearchUsers(value) {
    const { dispatch } = this.props;
    this.setState({ moreUserKeywords: value });
    dispatch({
      type: 'saleOrderAdd/moreSearchUsers',
      payload: {
        curPage: this.props.saleOrderAdd.curPage,
        value,
      },
    });
  }
  handleCheckReceivingRadio(record) {
    const { saleOrderAdd } = this.props;
    const { receiving } = saleOrderAdd;
    const receivingInfo = [];
    for (let i = 0; i < receiving.length; i += 1) {
      if (record.receivingId === receiving[i].receivingId) {
        receivingInfo.push(receiving[i]);
        this.setState({ receivingCheckInfo: receivingInfo });
      }
    }
  }
  handleCheckInvoiceRadio(invoiceId) {
    this.setState({ invoiceId });
  }
  handleCheckUserRadio(userId) {
    this.setState({ userRadioId: userId });
    const { dispatch } = this.props;
    dispatch({
      type:'changeFareInfoReducer',
      payload:{
        userId,
      }
    })
  }
  handleCheckGoods(goodsIds) {
    this.setState({ goodsCheckboxIds: goodsIds });
  }

  render() {
    const {
      editable,
      isfareInfo,
      isReceivingInfo,
      isDeliveryDate,
      isPayInfo,
      ispayCondition,
      isInvoiceInfo,
      invoiceInfoMap,
      invoiceInfoItems,
      userRadioId,
      receivingCheckInfo,
      invoiceInfoType,
      addCompanyName,
      addAddress,
      addPhoneNumber,
      addCompanyTaxID,
      addBank,
      addBankAccount,
      goodsCheckboxIds,
      invoiceId,
      invoiceInfos,
      receivingId,
      changeUserWarning,
      moreGoodsKeywords,
      pageId,
    } = this.state;
    const {
      saleOrderAdd: {
        // 修改订单的详细信息
        orderDetail,
        searchGoodsValue,
        addressOptions,
        // 详细地址
        userName,
        mobilePhone,
        province,
        city,
        district,
        address,
        isUserLoading,
        curPage,
        size,
        total,
        goods,
        users,
        receivingInfos,
        defaultReceivingInfos,
        goodsInfos,
        userInfos,
        // isSave,
        date,
        remark,
        author,
        orderNo,
        invoiceInfo,
        defaultInvoiceInfos,
        receiving,
        fareInfo,
        fareInfoMap,
        payInfo,
        payInfoMap,
        payConditionMap,
        payCondition,
        specialPrice,
        siftGoods,
        siftUsers,
        deleteRowId,
        deleteGoodsId,
        isShowDeleteConfirm,
        isDeleting,
        isLoading,
        // 新增修改收货地址弹窗
        isShowReceivingUpdateConfirm,
        isShowReceivingConfirm,
        isShowUpdateInvoiceConfirm,
        isUpdateInvoiceLoading,
        isShowAddInvoiceConfirm,
        isAddInvoiceLoading,
        isShowInvoiceConfirm,
        isInvoiceLoading,
        isInvoiceListLoading,
        isShowMoreUserConfirm,
        isMoreUserLoading,
        isShowMoreGoodsConfirm,
        isMoreGoodsLoading,
        isGoodsLoading,
        isInvoiceInformation,
      },
    } = this.props;
    const allSubtotal = goodsInfos.reduce((pre, next) => {
      return pre + (+next.saleNum * +next.salePrice);
    }, 0);
    const allSaleNum = goodsInfos.reduce((pre, next) => {
      return pre + +next.saleNum;
    }, 0);

    const rowSelection = {
      type: 'radio',
      onSelect: (record) => {
        this.handleCheckUserRadio(record.userId);
      },
    };


    // table 的列头数据
    const columns = [
      {
        dataIndex: 'no',
        key: 'no',
        width: 80,
        render: (no, record, index) => (
          <span>{ no || index + 1}</span>
        ),
      }, {
        // title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: 50,
        render: (op, record, index) => {
          if (record.no) {
            return null;
          }
          return (
            <div>
              {!record.isNotGoods && <Button icon="minus" onClick={this.handleDeleteGoods.bind(this, record.goodsId, record.id, index)} />}
            </div>);
        },
      }, {
        title: '主图',
        dataIndex: 'img',
        key: 'img',
        width: 60,
        render: (img, record) => {
          if (record.isNotGoods) {
            return null;
          }
          return <img className={styles.goodsImg} src={img}/>;
        },
      }, {
        title: '商品编码',
        dataIndex: 'goodsNo',
        key: 'goodsNo',
        width: 150,
        render: (goodsNo, record) => {
          if (record.no) {
            return null;
          }
          if (record.isNotGoods) {
            const options = siftGoods.slice(0, 49).map((oneSiftGoods) => {
              return <Option goodsId={oneSiftGoods.goodsId} /* disabled={goodsInfos.some((goodsInfo) => { return goodsInfo.goodsId === oneSiftGoods.goodsId; })} */value={oneSiftGoods.goodsName + oneSiftGoods.goodsNo}>{oneSiftGoods.goodsName}</Option>;
            });
            if (options.length === 0) options.push(<Option disabled key="no fount">没发现匹配项</Option>);

            return {
              children: (
                <div>
                  <Select
                    mode="combobox"
                    placeholder="请输入商品编码/商品名称"
                    filterOption={false}
                    style={{ width: 230 }}
                    // value={searchGoodsValue}
                    onSelect={this.handleSelectGoods.bind(this)}
                    onSearch={this.handleSearchGoods.bind(this)}
                    defaultActiveFirstOption
                    showArrow={false}
                    disabled={!((userInfos.length > 0 || pageId))}
                  >
                    {options}
                  </Select>
                  <Button type="primary" disabled={!((userInfos.length > 0 || pageId))} onClick={this.handleMoreGoodsInfo.bind(this)}>更多</Button>

                </div>
              ),
              props: {
                colSpan: 2,
              },
            };
          } else {
            return {
              children: <span>{goodsNo}</span>,
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
        width: 300,
        render: (goodsName, record) => {
          if (record.no) {
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
              children: <span>{goodsName}</span>,
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
        width: 50,
        render: (unit, record) => {
          if (record.isNotGoods) {
            return null;
          }
          return <span>{unit}</span>;
        },
      },
      {
        title: '单价',
        dataIndex: 'salePrice',
        key: 'salePrice',
        width: 120,
        render: (salePrice, record, index) => {
          if (record.isNotGoods) {
            return null;
          }
          return <Input onChange={this.handleChangeSalePrice.bind(this, record.goodsId, index)} value={salePrice} />;
        },
      }, {
        title: '数量',
        dataIndex: 'saleNum',
        key: 'saleNum',
        width: 150,
        render: (saleNum, record, index) => {
          if (record.no) {
            return record.saleNum;
          }
          if (record.isNotGoods) {
            return null;
          }
          return (
            <Tooltip
              title={
                <div>
                  <p>在途量: {record.inWayNum}</p>
                  <p>即时量: {record.imNum}</p>
                  <p>可用量: {record.canUseNum}</p>
                  <p>起订量: {record.setFromNum}</p>
                </div>
              }
            >
              <Input onChange={this.handleChangeSaleNum.bind(this, record.goodsId, record.canUseNum, index)} value={saleNum} />
            </Tooltip>
          );
        },
      },
      {
        title: '小计（元）',
        dataIndex: 'subtotal',
        key: 'subtotal',
        width: 120,
        render: (subtotal, record) => {
          if (record.no) {
            return subtotal;
          }
          if (record.isNotGoods) {
            return null;
          }
          return <span>{(+record.salePrice * +record.saleNum).toFixed(2)}</span>;
        },
      }, {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        width: 200,
        render: (remark, record, index) => {
          if (record.no) {
            return record.remark;
          }
          if (record.isNotGoods) {
            return null;
          }
          return (
            <Input onChange={this.handleChangeGoodsRemark.bind(this, record.goodsId, index)} value={remark} />
          );
        },
      }];
    const rowSelection2 = {
      columnWidth: '120px',
      onChange: (selectedRowKeys, selectedRow) => {
        const { dispatch } = this.props;
        dispatch({
          type: 'saleOrderAdd/changeIsTax',
          payload: {
            selectedRow,
          },
        });
        if (selectedRow.length === 0) {
          dispatch({
            type: 'saleOrderAdd/searchUsersReducer',
            payload: {
              isInvoiceInformation: false,
            },
          });
        } else {
          dispatch({
            type: 'saleOrderAdd/searchUsersReducer',
            payload: {
              isInvoiceInformation: true,
            },
          });
        }
      },
      getCheckboxProps: record => ({
        disabled: record.isNotGoods === true,
      }),
    };
    const invoiceColumns = [
      {
        dataIndex: 'companyName',
        key: 'companyName',
      }, {
        dataIndex: 'address',
        key: 'address',
      }, {
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
      }, {
        dataIndex: 'companyTaxID',
        key: 'companyTaxID',
      }, {
        dataIndex: 'bank',
        key: 'bank',
      }, {
        dataIndex: 'bankAccount',
        key: 'bankAccount',
      }, {
        dataIndex: 'isDefault',
        key: 'isDefault',
        render: (isDefault, record) => {
          if (isDefault) {
            return (
              <span >默认发票</span>
            );
          } else {
            return (
              <Popconfirm title="是否确定将此条设置为默认发票？" onConfirm={() => this.handleOkDefaultInvoiceInfo(record)} okText="确定" cancelText="取消">
                <span style={{ color: '#169bd5', cursor: 'pointer' }}>设置默认</span>
              </Popconfirm>
            );
          }
        },
      }, {
        dataIndex: 'operation',
        key: 'operation',
        render: (op, record) => (
          <span style={{ color: '#169bd5', cursor: 'pointer' }} onClick={() => this.handleUpdateInvoiceInfo(record)} >修改</span>
        ),
      }, {
        dataIndex: 'operationDelete',
        key: 'operationDelete',
        render: (op, record) => (
          <Popconfirm title="是否确定呢删除此条信息？" onConfirm={() => this.handleDeleteInvoiceInfo(record)} okText="确定" cancelText="取消">
            <span style={{ color: '#169bd5', cursor: 'pointer' }}>删除</span>
          </Popconfirm>
        ),
      }];

    const receivingColumns = [
      {
        dataIndex: 'userName',
        key: 'userName',
      }, {
        dataIndex: 'adressAll',
        key: 'adressAll',
        render: (type, record) => {
          return (
            <span>{`${record.province.name}${record.city.name}${record.district.name}${record.address}`}</span>
          );
        },
      }, {
        dataIndex: 'mobilePhone',
        key: 'mobilePhone',
      }, {
        dataIndex: 'type',
        key: 'type',
        render: (type, record) => {
          if (record.isDefault === 1) {
            return (
              <span >默认地址</span>
            );
          } else {
            return (
              <Popconfirm title="是否确定将此条设置为默认地址？" onConfirm={() => this.handleOkDefaultReceivingInfo(record)} okText="确定" cancelText="取消">
                <span style={{ color: '#169bd5', cursor: 'pointer' }}>设置默认</span>
              </Popconfirm>
            );
          }
        },
      }, {
        dataIndex: 'operation',
        key: 'operation',
        render: (op, record) => (
          <span style={{ color: '#169bd5', cursor: 'pointer' }} onClick={() => this.handleUpdateReceivingInfo(record)} >修改</span>
        ),
      }, {
        dataIndex: 'operationDelete',
        key: 'operationDelete',
        render: (op, record) => (
          <Popconfirm title="是否确定呢删除此条信息？" onConfirm={() => this.handleDeleteReceiving(record)} okText="确定" cancelText="取消">
            <span style={{ color: '#169bd5', cursor: 'pointer' }}>删除</span>
          </Popconfirm>
        ),
      }];

    // 更多客户列表
    const userColumns = [
      {
        title: 'ID编码',
        dataIndex: 'userNo',
        key: 'userNo',
      }, {
        title: '客户名称',
        dataIndex: 'userName',
        key: 'userName',
      }, {
        title: '手机号',
        dataIndex: 'mobilePhone',
        key: 'mobilePhone',
      }, {
        title: '地区',
        dataIndex: 'address',
        key: 'address',
      }, {
        title: '级别',
        dataIndex: 'level',
        key: 'level',
      }];

    const goodsColumns = [
      {
        title: '主图',
        dataIndex: 'img',
        key: 'img',
        width: 60,
        render: (img, record) => {
          return <img className={styles.goodsImg} src={img} />;
        },
      }, {
        title: '商品名称',
        dataIndex: 'goodsName',
        key: 'goodsName',
      }, {
        title: '商品条码',
        dataIndex: 'goodsNo',
        key: 'goodsNo',
      }, {
        title: '分类',
        dataIndex: 'category',
        key: 'category',
      }, {
        title: '单价',
        dataIndex: 'shopPrice',
        key: 'shopPrice',
      }, {
        title: '起批量',
        dataIndex: 'setFromNum',
        key: 'setFromNum',
      }, {
        title: '库存',
        dataIndex: 'canUseNum',
        key: 'canUseNum',
      }, {
        title: '单位',
        dataIndex: 'unit',
        key: 'unit',
      }, {
        title: '小计',
        key: 'subtotal',
      }];

    return (
      <PageHeaderLayout title={pageId ? '修改订单' : '新增订单'} className={styles.addPageHeader}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={12} sm={24} style={{ marginBottom: 24 }}>
                  {
                    pageId && orderDetail ?
                      <span>客户：{orderDetail.userName}</span>
                    :
                      <span>
                        <Select
                          showSearch
                          style={{ width: 200 }}
                          placeholder="添加客户"
                          optionFilterProp="children"
                          onSelect={this.handleSelectUsers.bind(this)}
                          onSearch={this.handleSearchUsers.bind(this)}
                          onFocus={this.handleSearchUsersFocus.bind(this)}
                          onBlur={this.handleSearchUsersBlur.bind(this)}
                          filterOption={false}
                          // filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                          value={(userInfos && userInfos.length > 0) ? userInfos[0].userName : null}
                        >
                          {siftUsers.map((user) => {
                            return <Option key={user.userId} value={user.userId}>{user.userName}</Option>;
                          })}
                        </Select>
                        <Button type="primary" onClick={() => { this.handleMoreUserInfo(); }}>更多</Button>

                        {/* 2018 */}
                        <span className={styles.customerPayType} disabled={!((userInfos.length > 0 || pageId))} >客户类型：<span>{userInfos[0] && userInfos[0].customerPayType}</span></span>


                        <span style={{ color: 'red', display: changeUserWarning ? 'inline-block' : 'none' }}>( 切换客户将清空本次修改 )</span>
                      </span>
                  }
                </Col>
              </Row>
            </div>
            <Row>
              <Col>
                <Table
                 bordered
                 rowSelection={rowSelection2}
                 loading={isLoading}
                 rowKey={record => record.goodsId}
                 dataSource={goodsInfos.concat([{ goodsId: goodsInfos.length * 10000000, id: '商品输入框', isNotGoods: true }])}
                 columns={columns}
                 pagination={false}
                 className={styles.checkWidth}
            />
             <span style={{ position: 'absolute', top: 30, left: 74 }}>含税</span>
           </Col>
           </Row>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginTop: 20 }}>
              <Col md={4} offset={20} style={{ height: '26px', lineHeight: '26px', marginTop: '10px', backgroundColor: '#f0f2f5' }}>
                <span>已选商品数量: </span>
                <span style={{ fontWeight: 'bold', color: '#f36' }}>{allSaleNum}</span>
              </Col>
              <Col md={4} offset={20} style={{ height: '26px', lineHeight: '26px', marginTop: '10px', backgroundColor: '#f0f2f5' }}>
                <span>实际总额: ￥</span>
                <span style={{ fontWeight: 'bold', color: '#f36' }}>{Number(allSubtotal).toFixed(2)}</span>
              </Col>
              <Col md={4} offset={20} style={{ height: '26px', lineHeight: '26px', marginTop: '10px', backgroundColor: '#f0f2f5' }}>
                <span>
                  订单特批价
                  <Icon
                    style={{
                      display: goodsInfos.length > 0 ? 'inline-block' : 'none',
                    }}
                    type={editable ? 'check' : 'edit'}
                    onClick={this.check.bind(this)}
                  />: ￥
                </span>
                {
                  editable ?
                    <span>
                      <Input
                        size="small"
                        style={{ width: 100 }}
                        value={(specialPrice === -1) ? '' : specialPrice}
                        onChange={this.handleChangeSpecialPrice.bind(this)}
                      />
                    </span>
                :
                    <span>
                      <div style={{ width: 100, margin: 0, display: 'inline-block', color: '#f36', fontWeight: 'bold' }}>
                        {specialPrice === -1 ? '' : specialPrice}
                      </div>
                    </span>
                }
              </Col>
              <Col md={4} offset={20} style={{ height: '40px', lineHeight: '40px', marginTop: '10px', backgroundColor: '#ffffcc', border: '1px solid' }}>
                <span>应付总额: ￥</span>
                <span style={{ fontWeight: 'bold', color: '#f36' }}>{specialPrice === -1 ? Number(allSubtotal).toFixed(2) : specialPrice}</span>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginTop: 20, background: 'rgb(240, 242, 245)' }}>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginTop: 20 }}>
                <Col md={24}>
                  <Row style={{ marginBottom: 14, display: pageId ? 'none' : 'block' }}>
                    <span style={{ display: 'inline-block', marginBottom: 5, verticalAlign: 'top', fontSize: '16px', fontWeight: 600 }}>
                    运费信息
                      {/* <Icon
                        style={{
                          marginLeft: 20,
                          display: (userInfos.length > 0) ? 'inline-block' : 'none',
                        }}
                        type="edit"
                        onClick={this.fareInfo.bind(this)}
                      /> */}
                    </span>
                    {
                      isfareInfo ?
                        <span style={{ marginLeft: 30 }}>
                          <Select
                            size="small"
                            style={{ width: 200, display: 'inline-block' }}
                            value={fareInfoMap[fareInfo] || ''}
                            onChange={this.handleChangeFareInfo.bind(this)}
                          >
                            {
                              (Object.entries(fareInfoMap).map((value) => {
                                return <Option key={value[0]}>{value[1]}</Option>;
                              }))
                            }
                          </Select>
                        </span>
                      :
                        <span style={{ marginLeft: 30 }}>
                          <div style={{ width: 200, margin: 0, display: 'inline-block', color: '#f36', fontWeight: 'bold' }}>
                            {
                              fareInfo in fareInfoMap ?
                              fareInfoMap[fareInfo]
                              :
                              ''
                            }
                          </div>
                        </span>
                    }
                  </Row>
                </Col>
              </Row>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={24}>
                  <Row style={{ marginBottom: 14 }}>
                    <span style={{ display: 'inline-block', marginBottom: 5, verticalAlign: 'top', fontSize: '16px', fontWeight: 600 }}>
                    收货信息 <Icon
                      style={{
                        display: ((userInfos && userInfos.length > 0) || pageId) ? 'inline-block' : 'none',
                      }}
                      type="edit"
                      onClick={this.receivingInfo.bind(this)}
                      // this.handleChangeInvoiceInfo.bind(this)
                    />
                    </span>
                    {
                      pageId && orderDetail && orderDetail.receiving ?
                        <span style={{ marginLeft: 30 }}>{orderDetail.receiving}</span>
                      :
                        receivingInfos.length > 0 ?
                          <span style={{ marginLeft: 30 }}>
                            <div style={{ width: 233, margin: 0, display: 'inline-block' }}>收货人 : {receivingInfos[0].userName}</div>
                            <div style={{ width: 233, margin: 0, display: 'inline-block' }}>手机号 : {receivingInfos[0].mobilePhone}</div>
                            <div style={{ width: 533, margin: 0, display: 'inline-block' }}>收货地址 : {`${receivingInfos[0].province.name}${receivingInfos[0].city.name}${receivingInfos[0].district.name}${receivingInfos[0].address}`}</div>
                          </span>
                        :
                          defaultReceivingInfos.length > 0 ?
                            <span style={{ marginLeft: 30 }}>
                              <div style={{ width: 233, margin: 0, display: 'inline-block' }}>收货人 : {defaultReceivingInfos[0].userName}</div>
                              <div style={{ width: 233, margin: 0, display: 'inline-block' }}>手机号 : {defaultReceivingInfos[0].mobilePhone}</div>
                              <div style={{ width: 533, margin: 0, display: 'inline-block' }}>收货地址 : {`${defaultReceivingInfos[0].province.name}${defaultReceivingInfos[0].city.name}${defaultReceivingInfos[0].district.name}${defaultReceivingInfos[0].address}`}</div>
                            </span>
                          :
                            ''
                    }
                  </Row>
                </Col>
              </Row>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={24}>
                    <Row style={{ marginTop: 5, marginBottom: 5 }}>
                      <span style={{ display: 'inline-block', marginBottom: 5, verticalAlign: 'top', fontSize: '16px', fontWeight: 600, marginTop: 20 }}>
                    支付类型：
                        <Icon
                          style={{
                          display: pageId ? 'inline-block' : 'none',
                        }}
                          type="edit"
                          onClick={this.payInfo.bind(this)}
                      />
                      </span>
                      {
                      isPayInfo ?
                        <span style={{ marginLeft: 15 }}>
                          <Select
                            size="small"
                            style={{ width: 200, display: 'inline-block', marginTop: 20 }}
                            value={payInfoMap[payInfo] || ''}
                            onChange={this.handleChangePayInfo.bind(this)}
                          >
                            {
                              (Object.entries(payInfoMap).map((value) => {
                                return <Option key={value[0]}>{value[1]}</Option>;
                              }))
                            }
                          </Select>
                        </span>
                      :
                        pageId && orderDetail ?
                          <span style={{ marginLeft: 30, display: 'inline-block', marginTop: 20 }}>{orderDetail.payInfo}</span>
                        :
                          <span style={{ marginLeft: 15, marginTop: 20, display: 'inline-block' }}>
                            支付类型：
                            <div style={{ width: 200, margin: 0, display: 'inline-block', color: '#f36', fontWeight: 'bold' }}>
                              {
                                payInfo in payInfoMap ?
                                payInfoMap[payInfo]
                                :
                                ''
                              }
                            </div>
                          </span>
                    }
                    </Row>
                  </Col>
                </Row>
                {/* 2018-08-07 */}
                {
                  (+payInfo === 2) ? (
                    <div>
                      <Col>
                        <Row>
                          <span className={styles.payment}>账期条件：</span>
                          <Icon
                            style={{
                            display: ((userInfos && userInfos.length > 0) || pageId) ? 'inline-block' : 'none',
                          }}
                            type="edit"
                            onClick={this.payCondition.bind(this)}
                          />
                          {
                                ispayCondition ? (
                                  <Select
                                    size="small"
                                    style={{ width: 200, display: 'inline-block', marginLeft: 15 }}
                                    value={payConditionMap[payCondition] || ''}
                                    onChange={this.handDefaultPayInfoId.bind(this)}
                                  >
                                    {
                                    (Object.entries(payConditionMap).map((value) => {
                                      return <Option key={value[0]}>{value[1]}</Option>;
                                    }))
                                  }
                                  </Select>
                                ) : pageId && orderDetail ? (
                                  <span style={{ marginLeft: 30, marginTop: 5, display: 'inline-block' }}>{orderDetail.payCondition}</span>
                                ) : (
                                  <span style={{ marginLeft: 15, marginTop: 5, display: 'inline-block' }}>
                                    账期条件：
                                    <div style={{ width: 200, margin: 0, display: 'inline-block', color: '#f36', fontWeight: 'bold' }}>
                                      {
                                        payCondition in payConditionMap ?
                                        payConditionMap[payCondition]
                                        :
                                        ''
                                      }
                                    </div>
                                  </span>
                                )
                          }
                        </Row>
                      </Col>
                      <Col md={24}>
                        <Row style={{ marginBottom: 5, marginTop: 5 }}>
                          <span style={{ display: 'inline-block', marginBottom: 5, verticalAlign: 'top', fontSize: '16px', fontWeight: 600 }}>
                          到期结款日期：
                          </span>
                          {
                            isDeliveryDate ?
                              <span style={{ marginLeft: 15 }}>
                                <div style={{ width: 200, margin: 0, display: 'inline-block', fontWeight: 'bold' }}>
                                  {date}
                                </div>
                              </span>
                            :
                              <span style={{ marginLeft: 15 }}>
                                {
                                  <DatePicker
                                    size="small"
                                    showTime
                                    format="YYYY-MM-DD"
                                    value={(date !== '0000-00-00') ? moment(date, 'YYYY-MM-DD') : ''}
                                    placeholder="请选择日期"
                                    onChange={this.handleChangeDate.bind(this)}
                                  />
                                }
                              </span>
                          }
                        </Row>
                      </Col>
                    </div>
                  ) : ''
                }
              </Row>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={24}>
                  <Row style={{ marginBottom: 14 }}>
                    {
                      isInvoiceInformation ?
                        <span style={{ display: 'inline-block', marginBottom: 5, verticalAlign: 'top', fontSize: '16px', fontWeight: 600 }}>
                    发票信息 <Icon
                      style={{
                        display: ((userInfos && userInfos.length > 0) || pageId) ? 'inline-block' : 'none',
                      }}
                      type="edit"
                      onClick={this.invoiceInfo.bind(this)}

                    />
                        </span>
                    : ''
                    }
                    {
                      isInvoiceInformation ?
                      (() => {
                        if (isInvoiceInfo) {
                          return (
                            <span style={{ marginLeft: 30 }}>
                              发票类别:
                              <Select
                                size="small"
                                style={{ width: 200, display: 'inline-block' }}
                                value={invoiceInfoMap[invoiceInfoType]}
                                onChange={this.handleChangeInvoiceInfo.bind(this)}
                              >
                                {
                                  (Object.entries(invoiceInfoMap).map((value) => {
                                    return <Option key={value[0]}>{value[1]}</Option>;
                                  }))
                                }
                              </Select>
                            </span>
                          );
                        } else if (pageId && orderDetail && orderDetail.invoiceInfo) {
                            return (
                              <span style={{ marginLeft: 30 }}>
                                发票类别:
                                <div style={{ width: 1100, margin: 0, display: 'inline-block' }}>{invoiceInfoMap[orderDetail.invoiceType]}</div>
                                <div style={{ width: 1100, marginLeft: '124px', display: 'inline-block' }}>{orderDetail.invoiceInfo}</div>
                              </span>
                            );
                          } else {
                            if (invoiceInfos && invoiceInfos[0] && invoiceInfoMap[invoiceInfoType] !== '不开票') {
                              return (
                                <span style={{ marginLeft: 30 }}>
                                  发票类别:
                                  <div style={{ width: 1100, margin: 0, display: 'inline-block' }}>{invoiceInfoMap[invoiceInfoType]}</div>
                                  <div style={{ width: 353, marginLeft: '124px', display: 'inline-block' }}>发票抬头 : {invoiceInfos[0].companyName}</div>
                                  <div style={{ width: 353, margin: 0, display: 'inline-block' }}>单位地址 : {invoiceInfos[0].address}</div>
                                  <div style={{ width: 353, margin: 0, display: 'inline-block' }}>联系电话 : {invoiceInfos[0].phoneNumber}</div>
                                  <div style={{ width: 353, marginLeft: '124px', display: 'inline-block' }}>企业税号 : {invoiceInfos[0].companyTaxID}</div>
                                  <div style={{ width: 353, margin: 0, display: 'inline-block' }}>开户银行 : {invoiceInfos[0].bank}</div>
                                  <div style={{ width: 353, margin: 0, display: 'inline-block' }}>银行账户 : {invoiceInfos[0].bankAccount}</div>
                                </span>
                              );
                            }
                            if (invoiceInfos === null && defaultInvoiceInfos.length > 0 && invoiceInfoMap[invoiceInfoType] !== '不开票') {
                              return (
                                <span style={{ marginLeft: 30 }}>
                                  发票类别:
                                  <div style={{ width: 1100, margin: 0, display: 'inline-block' }}>{invoiceInfoMap[invoiceInfoType]}</div>
                                  <div style={{ width: 353, marginLeft: '124px', display: 'inline-block' }}>发票抬头 : {defaultInvoiceInfos[0].companyName}</div>
                                  <div style={{ width: 353, margin: 0, display: 'inline-block' }}>单位地址 : {defaultInvoiceInfos[0].address}</div>
                                  <div style={{ width: 353, margin: 0, display: 'inline-block' }}>联系电话 : {defaultInvoiceInfos[0].phoneNumber}</div>
                                  <div style={{ width: 353, marginLeft: '124px', display: 'inline-block' }}>企业税号 : {defaultInvoiceInfos[0].companyTaxID}</div>
                                  <div style={{ width: 353, margin: 0, display: 'inline-block' }}>开户银行 : {defaultInvoiceInfos[0].bank}</div>
                                  <div style={{ width: 353, margin: 0, display: 'inline-block' }}>银行账户 : {defaultInvoiceInfos[0].bankAccount}</div>
                                </span>

                              );
                            }
                            return (
                              <span style={{ marginLeft: 30 }}>
                                发票类别:
                                <div style={{ width: 1100, margin: 0, display: 'inline-block' }}>{invoiceInfoMap[invoiceInfoType]}</div>
                              </span>
                            );
                          }
                      })()
                      : ''
                    }

                  </Row>
                </Col>
              </Row>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginTop: 20 }}>
                <Col md={24}>
                  <Row style={{ marginBottom: 14 }}>
                    <span style={{ display: 'inline-block', marginBottom: 5, verticalAlign: 'top', fontSize: '16px', fontWeight: 600 }}>
                    制单备注
                    </span>
                    <Input.TextArea
                      onChange={this.handleChangeRemark.bind(this)}
                      value={remark}
                      placeholder="客户需求背景，特价要求，支付类型，特殊申请信息，协商处理结果写到这里，方便主管对其审核相关业务事项。"
                      style={{ width: '100%', border: '2px dashed #BCBCBC' }}
                      autosize
                    />
                  </Row>
                </Col>
              </Row>
            </Row>
            <div className={styles.fixed}>
              <span className={styles.saveBtn} onClick={this.handleClickSaveBtn.bind(this)}>提交主管审核</span>
              <Link to="/sale/sale-order-list" className={styles.cancelBtn}>取消</Link>
            </div>
          </div>
          <Modal
            // title="新增修改地址"
            // width={1200}
            visible={isShowReceivingUpdateConfirm}
            onOk={() => { this.handleClickOkChangeReceivingInfoButton(); }}
            // confirmLoading={isInvoiceLoading}
            onCancel={this.handleClickCancelChangeReceivingInfoButton.bind(this)}
          >
            <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginTop: 10, marginBottom: 25 }}>
              <Col md={12} style={{ height: 26, lineHeight: '26px' }}>
                <span style={{ fontSize: '18px', color: '#AEAEAE', fontFamily: 'Arial Negreta', fontWeight: '700' }}>新增修改地址 </span>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={24}>
                <Row style={{ marginBottom: 14 }}>
                  <Col md={24} style={{ height: 26, lineHeight: '26px' }}>
                    <span style={{ fontSize: '18px', color: '#AEAEAE', fontFamily: 'Arial Negreta', fontWeight: '700' }}>收货人 : </span>
                    <span style={{ color: '#d7d7d7', marginLeft: '8px' }}>
                      <Input
                        size="small"
                        style={{ width: 200 }}
                        value={userName}
                        onChange={this.handleChangeReceivingUserName.bind(this)}
                      />
                    </span>
                  </Col>
                </Row>
                <Row style={{ marginBottom: 14 }}>
                  <Col md={24} style={{ height: 26, lineHeight: '26px' }}>
                    <span style={{ fontSize: '18px', color: '#AEAEAE', fontFamily: 'Arial Negreta', fontWeight: '700' }}>手机号 : </span>
                    <span style={{ color: '#d7d7d7', marginLeft: '8px' }}>
                      <Input
                        size="small"
                        style={{ width: 200 }}
                        value={mobilePhone}
                        onChange={this.handleChangeReceivingPhoneNumber.bind(this)}
                      />
                    </span>
                  </Col>
                </Row>
                <Row style={{ marginBottom: 14 }}>
                  <Col md={24} style={{ height: 26, lineHeight: '26px' }}>
                    <span style={{ fontSize: '18px', color: '#AEAEAE', fontFamily: 'Arial Negreta', fontWeight: '700' }}>收货地址 : </span>
                    <span style={{ color: '#d7d7d7', marginLeft: '8px' }}>
                      <Cascader
                        options={addressOptions}
                        size="small"
                        style={{ width: 300 }}
                        placeholder="请选择省份/城市/地区"
                        value={province ? [province, city, district] : null}
                        onChange={this.handleChangeReceivingAddressValue.bind(this)}
                      />
                    </span>
                  </Col>
                </Row>
                <Row style={{ marginBottom: 14 }}>
                  <Col md={24} style={{ height: 26, lineHeight: '26px' }}>
                    <span style={{ color: '#d7d7d7', marginLeft: '8px' }}>
                      <Input.TextArea
                        placeholder="请输入详细收货地址"
                        style={{ width: 300, marginLeft: 88 }}
                        value={address || null}
                        onChange={this.handleChangeReceivingAddress.bind(this)}
                        autosize
                      />
                    </span>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Modal>
          <Modal
            // title="收货信息"
            width={1200}
            visible={isShowReceivingConfirm}
            onOk={() => { this.handleClickOkReceivingInfoButton(); }}
            // confirmLoading={isInvoiceLoading}
            onCancel={this.handleClickCancelReceivingInfoButton.bind(this)}
          >
            <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginTop: 10, marginBottom: 25 }}>
              <Col md={12} style={{ height: 26, lineHeight: '26px' }}>
                <span style={{ fontSize: '18px', color: '#AEAEAE', fontFamily: 'Arial Negreta', fontWeight: '700' }}>收货信息 </span>
                <span className={styles.addBtn} onClick={this.handleClickUpdateReceivingBtn.bind(this)}>新增地址</span>
              </Col>
            </Row>
            <Table
              bordered
              // loading={isInvoiceListLoading}
              rowKey={record => record.receivingId}
              rowSelection={{
                type: 'radio',
                selectedRowKeys: (receivingInfos.length === 0 && defaultReceivingInfos.length > 0) ? (receivingCheckInfo ? [receivingCheckInfo[0].receivingId] : [defaultReceivingInfos[0].receivingId]) : (receivingCheckInfo ? [receivingCheckInfo[0].receivingId] : []),
                onSelect: this.handleCheckReceivingRadio.bind(this),
              }}
              dataSource={receiving}
              columns={receivingColumns}
              pagination={false}
            />
          </Modal>
          <Modal
            // title="发票信息"
            width={1200}
            visible={isShowInvoiceConfirm}
            onOk={() => { this.handleClickOkInvoiceInfoButton(); }}
            confirmLoading={isInvoiceLoading}
            onCancel={this.handleClickCancelInvoiceInfoButton.bind(this)}
          >
            <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginTop: 10, marginBottom: 25 }}>
              <Col md={12} style={{ height: 26, lineHeight: '26px' }}>
                <span style={{ fontSize: '18px', color: '#AEAEAE', fontFamily: 'Arial Negreta', fontWeight: '700' }}>发票信息 </span>
                <span className={styles.addBtn} onClick={this.handleClickAddInvoiceBtn.bind(this)}>新建发票</span>
              </Col>
            </Row>
            <Table
              // loading={isInvoiceListLoading}
              bordered
              rowKey={record => record.invoiceId}
              rowSelection={{
                type: 'radio',
                onSelect: (record) => {
                  this.handleCheckInvoiceRadio(record.invoiceId);
                },
              }}
              dataSource={invoiceInfo}
              columns={invoiceColumns}
              pagination={false}
            />
          </Modal>
          <Modal
            // title="修改发票信息"
            width={1200}
            visible={isShowUpdateInvoiceConfirm}
            onOk={() => { this.handleClickOkUpdateInvoiceInfoButton(); }}
            confirmLoading={isUpdateInvoiceLoading}
            zIndex={1001}
            mask={false}
            onCancel={this.handleClickCancelUpdateInvoiceInfoButton.bind(this)}
          >
            <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginTop: 10, marginBottom: 25 }}>
              <Col md={12} style={{ height: 26, lineHeight: '26px' }}>
                <span style={{ fontSize: '18px', color: '#AEAEAE', fontFamily: 'Arial Negreta', fontWeight: '700' }}>发票信息 </span>
                <span style={{ color: '#d7d7d7', marginLeft: '8px' }}>{invoiceInfoMap[invoiceInfoType]}</span>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={24}>
                <Row style={{ marginBottom: 14 }}>
                  <Col md={8} style={{ height: 26, lineHeight: '26px' }}>
                    <span style={{ fontSize: '18px', color: '#AEAEAE', fontFamily: 'Arial Negreta', fontWeight: '700' }}>发票抬头 : </span>
                    <span style={{ color: '#d7d7d7', marginLeft: '8px' }}>
                      <Input
                        size="small"
                        style={{ width: 200 }}
                        value={addCompanyName}
                        onChange={this.handleChangeAddCompanyName.bind(this)}
                      />
                    </span>
                  </Col>
                  <Col md={8} style={{ height: 26, lineHeight: '26px' }}>
                    <span style={{ fontSize: '18px', color: '#AEAEAE', fontFamily: 'Arial Negreta', fontWeight: '700' }}>单位地址 : </span>
                    <span style={{ color: '#d7d7d7', marginLeft: '8px' }}>
                      <Input
                        size="small"
                        style={{ width: 200 }}
                        value={addAddress}
                        onChange={this.handleChangeAddAddress.bind(this)}
                      />
                    </span>
                  </Col>
                  <Col md={8} style={{ height: 26, lineHeight: '26px' }}>
                    <span style={{ fontSize: '18px', color: '#AEAEAE', fontFamily: 'Arial Negreta', fontWeight: '700' }}>联系电话 : </span>
                    <span style={{ color: '#d7d7d7', marginLeft: '8px' }}>
                      <Input
                        size="small"
                        style={{ width: 200 }}
                        value={addPhoneNumber}
                        onChange={this.handleChangeAddPhoneNumber.bind(this)}
                      />
                    </span>
                  </Col>
                </Row>
                <Row style={{ marginBottom: 14 }}>
                  <Col md={8} style={{ height: 26, lineHeight: '26px' }}>
                    <span style={{ fontSize: '18px', color: '#AEAEAE', fontFamily: 'Arial Negreta', fontWeight: '700' }}>企业税号 : </span>
                    <span style={{ color: '#d7d7d7', marginLeft: '8px' }}>
                      <Input
                        size="small"
                        style={{ width: 200 }}
                        value={addCompanyTaxID}
                        onChange={this.handleChangeAddCompanyTaxID.bind(this)}
                      />
                    </span>
                  </Col>
                  <Col md={8} style={{ height: 26, lineHeight: '26px' }}>
                    <span style={{ fontSize: '18px', color: '#AEAEAE', fontFamily: 'Arial Negreta', fontWeight: '700' }}>开户银行 : </span>
                    <span style={{ color: '#d7d7d7', marginLeft: '8px' }}>
                      <Input
                        size="small"
                        style={{ width: 200 }}
                        value={addBank}
                        onChange={this.handleChangeAddBank.bind(this)}
                      />
                    </span>
                  </Col>
                  <Col md={8} style={{ height: 26, lineHeight: '26px' }}>
                    <span style={{ fontSize: '18px', color: '#AEAEAE', fontFamily: 'Arial Negreta', fontWeight: '700' }}>银行账户 : </span>
                    <span style={{ color: '#d7d7d7', marginLeft: '8px' }}>
                      <Input
                        size="small"
                        style={{ width: 200 }}
                        value={addBankAccount}
                        onChange={this.handleChangeAddBankAccount.bind(this)}
                      />
                    </span>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Modal>
          <Modal
            // title="新建发票信息"
            width={1200}
            visible={isShowAddInvoiceConfirm}
            onOk={() => { this.handleClickOkAddInvoiceInfoButton(); }}
            confirmLoading={isAddInvoiceLoading}
            zIndex={1001}
            mask={false}
            onCancel={this.handleClickCancelAddInvoiceInfoButton.bind(this)}
          >
            <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginTop: 10, marginBottom: 25 }}>
              <Col md={12} style={{ height: 26, lineHeight: '26px' }}>
                <span style={{ fontSize: '18px', color: '#AEAEAE', fontFamily: 'Arial Negreta', fontWeight: '700' }}>发票信息 </span>
                <span style={{ color: '#d7d7d7', marginLeft: '8px' }}>{invoiceInfoMap[invoiceInfoType]}</span>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={24}>
                <Row style={{ marginBottom: 14 }}>
                  <Col md={8} style={{ height: 26, lineHeight: '26px' }}>
                    <span style={{ fontSize: '18px', color: '#AEAEAE', fontFamily: 'Arial Negreta', fontWeight: '700' }}>发票抬头 : </span>
                    <span style={{ color: '#d7d7d7', marginLeft: '8px' }}>
                      <Input
                        size="small"
                        style={{ width: 200 }}
                        value={addCompanyName}
                        onChange={this.handleChangeAddCompanyName.bind(this)}
                      />
                    </span>
                  </Col>
                  <Col md={8} style={{ height: 26, lineHeight: '26px' }}>
                    <span style={{ fontSize: '18px', color: '#AEAEAE', fontFamily: 'Arial Negreta', fontWeight: '700' }}>单位地址 : </span>
                    <span style={{ color: '#d7d7d7', marginLeft: '8px' }}>
                      <Input
                        size="small"
                        style={{ width: 200 }}
                        value={addAddress}
                        onChange={this.handleChangeAddAddress.bind(this)}
                      />
                    </span>
                  </Col>
                  <Col md={8} style={{ height: 26, lineHeight: '26px' }}>
                    <span style={{ fontSize: '18px', color: '#AEAEAE', fontFamily: 'Arial Negreta', fontWeight: '700' }}>联系电话 : </span>
                    <span style={{ color: '#d7d7d7', marginLeft: '8px' }}>
                      <Input
                        size="small"
                        style={{ width: 200 }}
                        value={addPhoneNumber}
                        onChange={this.handleChangeAddPhoneNumber.bind(this)}
                      />
                    </span>
                  </Col>
                </Row>
                <Row style={{ marginBottom: 14 }}>
                  <Col md={8} style={{ height: 26, lineHeight: '26px' }}>
                    <span style={{ fontSize: '18px', color: '#AEAEAE', fontFamily: 'Arial Negreta', fontWeight: '700' }}>企业税号 : </span>
                    <span style={{ color: '#d7d7d7', marginLeft: '8px' }}>
                      <Input
                        size="small"
                        style={{ width: 200 }}
                        value={addCompanyTaxID}
                        onChange={this.handleChangeAddCompanyTaxID.bind(this)}
                      />
                    </span>
                  </Col>
                  <Col md={8} style={{ height: 26, lineHeight: '26px' }}>
                    <span style={{ fontSize: '18px', color: '#AEAEAE', fontFamily: 'Arial Negreta', fontWeight: '700' }}>开户银行 : </span>
                    <span style={{ color: '#d7d7d7', marginLeft: '8px' }}>
                      <Input
                        size="small"
                        style={{ width: 200 }}
                        value={addBank}
                        onChange={this.handleChangeAddBank.bind(this)}
                      />
                    </span>
                  </Col>
                  <Col md={8} style={{ height: 26, lineHeight: '26px' }}>
                    <span style={{ fontSize: '18px', color: '#AEAEAE', fontFamily: 'Arial Negreta', fontWeight: '700' }}>银行账户 : </span>
                    <span style={{ color: '#d7d7d7', marginLeft: '8px' }}>
                      <Input
                        size="small"
                        style={{ width: 200 }}
                        value={addBankAccount}
                        onChange={this.handleChangeAddBankAccount.bind(this)}
                      />
                    </span>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Modal>
          <Modal
            // title="选择客户"
            width={1200}
            visible={isShowMoreUserConfirm}
            onOk={this.handleClickOkMoreUserInfoButtonbind.bind(this)}
            confirmLoading={isMoreGoodsLoading}
            onCancel={this.handleClickCancelMoreUserInfoButton.bind(this)}
          >
            <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginTop: 10, marginBottom: 25 }}>
              <Col md={12} style={{ height: 26, lineHeight: '26px' }}>
                <span style={{ fontSize: '18px', color: '#AEAEAE', fontFamily: 'Arial Negreta', fontWeight: '700' }}>选择客户 </span>
                <span>
                  <Search
                    size="small"
                    style={{ width: 320, marginLeft: 20 }}
                    // // value={specialPrice}
                    enterButton="搜索"
                    placeholder="请输入客户名称/编码/手机号/进行搜索"
                    onSearch={this.handleMoreSearchUsers.bind(this)}
                  />
                </span>
              </Col>
            </Row>
            <Table
              bordered
              loading={isUserLoading}
              rowKey={record => record.userId}
              rowSelection={rowSelection}
              dataSource={siftUsers}
              columns={userColumns}
              pagination={{
                current: curPage,
                pageSize: size,
                onChange: this.handleChangePage,
                onShowSizeChange: this.handleChangePageSize,
                showSizeChanger: false,
                showQuickJumper: false,
                total,
                showTotal:total => `共 ${total} 个结果`,
              }}
            />
          </Modal>
          <Modal
            // title="选择商品"
            width={1200}
            visible={isShowMoreGoodsConfirm}
            onOk={this.handleClickOkMoreGoodsInfoButtonbind.bind(this)}
            confirmLoading={isMoreGoodsLoading}
            onCancel={this.handleClickCancelMoreGoodsInfoButton.bind(this)}
          >
            <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginTop: 10, marginBottom: 25 }}>
              <Col md={12} style={{ height: 26, lineHeight: '26px' }}>
                <span style={{ fontSize: '18px', color: '#AEAEAE', fontFamily: 'Arial Negreta', fontWeight: '700' }}>选择商品 </span>
                <span>
                  <Search
                    size="small"
                    style={{ width: 320, marginLeft: 20 }}
                    // // value={specialPrice}
                    enterButton="搜索"
                    placeholder="请输入商品名称/编码/进行搜索"
                    onSearch={this.handleMoreSearchGoods.bind(this)}
                  />
                </span>
              </Col>
            </Row>
            <Table
              bordered
              loading={isGoodsLoading}
              rowKey={record => record.goodsId}
              rowSelection={{
                selectedRowKeys: goodsCheckboxIds,
                onChange: this.handleCheckGoods.bind(this),
                getCheckboxProps: record => ({
                  disabled: goodsInfos.some((goodsInfo) => {
                    return record.goodsId === goodsInfo.goodsId;
                  }),
                }),
              }}
              dataSource={siftGoods}
              columns={goodsColumns}
              pagination={{
                current: curPage,
                pageSize: size,
                onChange: this.handleChangeMoreGoodsPage,
                onShowSizeChange: this.handleChangePageSize,
                showSizeChanger: false,
                showQuickJumper: false,
                total,
                showTotal:total => `共 ${total} 个结果`,
              }}
            />
          </Modal>
        </Card>
      </PageHeaderLayout>
    );
  }
}
