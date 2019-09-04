import React, { PureComponent } from 'react';
import NP from 'number-precision';
import { connect } from 'dva';
import moment from 'moment';
import Debounce from 'lodash-decorators/debounce';
import { getUrl } from '../../utils/request';
import { Row, Col, Card, Input, Select, Modal, Table, Button, Form, DatePicker, message, Popconfirm, Icon, Tabs, Checkbox, Tooltip, InputNumber, Upload, Carousel } from 'antd';
import { Link, routerRedux } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './AddInvoice.less';
import globalStyles from '../../assets/style/global.less';
import Item from 'antd/lib/list/Item';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
@connect(state => ({
  addInvoice: state.addInvoice,
}))
export default class addInvoice extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'addInvoice/mount',
    });
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'addInvoice/unmount',
    });
  }
  // 处理新增发票商品弹窗事件
  handleAddInvoiceGoodsNameModalOk() {
    const { dispatch } = this.props;
    const { addInvoiceGoodsNameList } = this.props.addInvoice;
    let canSubmit = true;
    Object.keys(addInvoiceGoodsNameList[0]).forEach((item) => {
      if (addInvoiceGoodsNameList[0][item] === '') {
        message.error('不能存在未填项');
        canSubmit = false;
      }
    });
    if (canSubmit) {
      dispatch({
        type: 'addInvoice/createInvoiceGoodsName',
        payload: {
          goodsName: addInvoiceGoodsNameList[0].goodsName,
          goodsSn: addInvoiceGoodsNameList[0].goodsSn,
          invGoodsName: addInvoiceGoodsNameList[0].invGoodsName,
          size: addInvoiceGoodsNameList[0].size,
          unit: addInvoiceGoodsNameList[0].unit,
        },
      }).then(() => {
        dispatch({
          type: 'addInvoice/getInvGoodsNameListData',
          payload: {
            goodsKeywords: '',
            currentPage: 1,
          },
        });
      });
    } else {
      return;
    }
    dispatch({
      type: 'addInvoice/updateState',
      payload: {
        isShowAddInvoiceGoodsNameModal: false,
        addInvoiceGoodsNameList: [{
          goodsName: '',
          goodsSn: '',
          invGoodsName: '',
          size: '',
          unit: '',
          id: '新增发票名称',
          isAdd: true,
        }],
      },
    });
  }
  handleAddInvoiceGoodsNameModalCancel() {
    const { dispatch } = this.props;
    dispatch({
      type: 'addInvoice/updateState',
      payload: {
        isShowAddInvoiceGoodsNameModal: false,
      },
    });
  }
  // 显示新建发票商品弹层
  showAddInvoiceGoodsNameModal() {
    const { dispatch } = this.props;
    dispatch({
      type: 'addInvoice/updateState',
      payload: {
        isShowAddInvoiceGoodsNameModal: true,
      },
    });
  }
  // 保存当前发票
  commitInvoiceInfo(type) {
    const { dispatch } = this.props;
    const { invGoodsList, invSourceType, relativeInvSn, invSn, invDate } = this.props.addInvoice;
    if (type === 'cancel') {
      dispatch(routerRedux.push('/finance/finance-invoice/invoice-store-list'));
      return;
    }
    const commitInvGoodsList = [];
    let flag = true;
    if (!invSourceType) {
      message.error('未选择发票类型');
      return;
    } else if ((+invSourceType === 2 || +invSourceType === 4) && !relativeInvSn) {
      message.error('关联红冲发票号不能为空');
      return;
    }
    if (!invSn) {
      message.error('发票号不能为空');
      return;
    }
    if (!invDate) {
      message.error('发票日期不能为空');
      return;
    }
    invGoodsList.map((item) => {
      if (!item.size || !item.size || !item.num || !item.price || !item.amount || !item.taxAmount || !item.totalAmount) {
        message.error('列表不能存在未填项');
        flag = false;
        return;
      }
      const obj = {
        // id: item.id,
        invGoodsNameId: item.id,
        size: item.size,
        unit: item.unit,
        num: item.num,
        price: item.price,
        amount: item.amount,
        taxAmount: item.taxAmount,
        totalAmount: item.totalAmount,
      };
      commitInvGoodsList.push(obj);
    });
    if (flag) {
      dispatch({
        type: 'addInvoice/createInvoiceDetail',
        payload: {
          invSourceType,
          relativeInvSn,
          invSn,
          invDate,
          invGoodsList: commitInvGoodsList,
        },
      }).then(() => {
        if (type === 'toList') {
          dispatch(routerRedux.push('/finance/finance-invoice/invoice-store-list'));
        } else if (type === 'continueAdd') {
          dispatch({
            type: 'addInvoice/updateState',
            payload: {
              invSourceType: '',
              invDate: '',
              relativeInvSn: '',
              invSn: '',
              invGoodsList: [],
              selectedIds: [],
              selectedRows: [],
            },
          });
        }
      });
    }
  }
  // 删除行
  handleDeleteColumn(id) {
    const { dispatch } = this.props;
    const { invGoodsList } = this.props.addInvoice;
    const index = invGoodsList.findIndex(element => element.id === id);
    invGoodsList.splice(index, 1);
    console.log(invGoodsList);
    dispatch({
      type: 'addInvoice/updateState',
      payload: {
        invGoodsList,
      },
    });
  }
  // 确定选择的发票商品
  handleInvGoodsNameModalOk() {
    const { dispatch } = this.props;
    const { invGoodsList, selectedRows } = this.props.addInvoice;
    const listArray = [];
    if (selectedRows.length > 0) {
      for (let i = 0; i < selectedRows.length; i += 1) {
        const { goodsName, id, goodsSn, invGoodsId, invGoodsName, price, size, unit } = selectedRows[i];
        const listObj = {
          id,
          goodsName,
          goodsSn,
          size,
          unit,
          price,
          invGoodsId,
          invGoodsName,
        };
        listArray.push(listObj);
      }
    }
    dispatch({
      type: 'addInvoice/updateState',
      payload: {
        isShowInvGoodsNameModal: false,
        invGoodsList: invGoodsList.concat(listArray),
        selectedIds: [],
        selectedRows: [],
      },
    });
  }
  // 取消发票商品列表弹窗
  handleInvGoodsNameModalCancel() {
    const { dispatch } = this.props;
    dispatch({
      type: 'addInvoice/updateState',
      payload: {
        isShowInvGoodsNameModal: false,
        selectedIds: [],
        selectedRows: [],
      },
    });
  }
  // 搜索发票商品
  handleSearchInvGoodsName(goodsKeywords) {
    const { dispatch } = this.props;
    dispatch({
      type: 'addInvoice/updateState',
      payload: {
        goodsKeywords,
        isShowInvGoodsNameModal: true,
      },
    });
    dispatch({
      type: 'addInvoice/getInvGoodsNameListData',
      payload: {
        goodsKeywords,
        currentPage: 1,
      },
    });
  }
  // 选择发票商品
  handleCheckGoods(selectedIds, selectedRows) {
    const { dispatch } = this.props;
    dispatch({
      type: 'addInvoice/updateState',
      payload: {
        selectedIds,
        selectedRows,
      },
    });
  }
  // 单元格编辑态
  toggleEditing(type) {
    const { dispatch } = this.props;
    switch (type) {
      case 'sizeEdit':
        dispatch({
          type: 'addInvoice/updateState',
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
          type: 'addInvoice/updateState',
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
          type: 'addInvoice/updateState',
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
          type: 'addInvoice/updateState',
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
          type: 'addInvoice/updateState',
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
          type: 'addInvoice/updateState',
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
          type: 'addInvoice/updateState',
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
          type: 'addInvoice/updateState',
          payload: {
            edit: true,
          },
        });
        break;
      default:
        break;
    }
  }
  // 保存修改发票明细数据
  saveEdit(type, record, e) {
    const { dispatch } = this.props;
    const { invGoodsList, taxRate } = this.props.addInvoice;
    const index = invGoodsList.findIndex(element => element.id === record.id);
    const editing = `${type}Edit`;
    switch (type) {
      case 'num':
        if (e.target.value.search(/^\d+$/) === -1) {
          message.error('必须为整数！');
        } else {
          invGoodsList[index].num = e.target.value;
          invGoodsList[index].amount = NP.times(+invGoodsList[index].num, +invGoodsList[index].price);
          invGoodsList[index].taxAmount = NP.times(+e.target.value, +invGoodsList[index].price, +taxRate);
          invGoodsList[index].totalAmount = NP.plus(invGoodsList[index].amount, invGoodsList[index].taxAmount);
        }
        break;
      case 'price':
        if (e.target.value.search(/^\d+.?\d*$/) === -1) {
          message.error('必须为合法数字！');
        } else {
          invGoodsList[index].price = e.target.value;
          invGoodsList[index].amount = NP.times(+invGoodsList[index].num, +invGoodsList[index].price);
          invGoodsList[index].taxAmount = NP.times(+invGoodsList[index].num, +invGoodsList[index].price, +taxRate);
          invGoodsList[index].totalAmount = NP.plus(invGoodsList[index].amount, invGoodsList[index].taxAmount);
        }
        break;
      case 'amount':
      case 'taxAmount':
      case 'totalAmount':
        if (e.target.value.search(/^\d+.?\d*$/) === -1) {
          message.error('必须为合法数字！');
        } else {
          invGoodsList[index][type] = e.target.value;
        }
        break;
      default:
        invGoodsList[index][type] = e.target.value;
        break;
    }
    dispatch({
      type: 'addInvoice/updateState',
      payload: {
        [editing]: false,
        invGoodsList,
      },
    });
  }
  // 保存新建数据
  saveAdd(type, e) {
    const { dispatch } = this.props;
    const { addInvoiceGoodsNameList } = this.props.addInvoice;
    let edit = false;
    addInvoiceGoodsNameList[0][type] = e.target.value;
    Object.keys(addInvoiceGoodsNameList[0]).forEach((item) => {
      if (addInvoiceGoodsNameList[0][item] === '') {
        edit = true;
      }
    });
    dispatch({
      type: 'addInvoice/updateState',
      payload: {
        edit,
        addInvoiceGoodsNameList,
      },
    });
  }
  // 各种输入数据改变
  handleChangeInputValue(type, e, dataStrings) {
    const { dispatch } = this.props;
    switch (type) {
      case 'relativeInvSn':
      case 'invSn':
      case 'goodsKeywords':
        dispatch({
          type: 'addInvoice/updateState',
          payload: {
            [type]: e.target.value,
          },
        });
        break;
      case 'invDate':
        dispatch({
          type: 'addInvoice/updateState',
          payload: {
            invDate: dataStrings,
          },
        });
        break;
      case 'invSourceType':
        dispatch({
          type: 'addInvoice/updateState',
          payload: {
            [type]: e,
          },
        });
        break;
      case 'currentPage':
        dispatch({
          type: 'addInvoice/updateState',
          payload: {
            [type]: e,
          },
        });
        dispatch({
          type: 'addInvoice/getInvGoodsNameListData',
          payload: {
            [type]: e,
          },
        });
        break;
      case 'pageSize':
        dispatch({
          type: 'addInvoice/updateState',
          payload: {
            pageSize: dataStrings,
            currentPage: 1,
          },
        });
        dispatch({
          type: 'addInvoice/getInvGoodsNameListData',
          payload: {
            pageSize: dataStrings,
            currentPage: 1,
          },
        });
        break;
      default:
        break;
    }
  }
  render() {
    const {
      // 数据
      configData,
      invGoodsNameListData,
      invGoodsNameListData: {
        invoiceGoodsList,
      },

      // 参数
      invSourceType,
      invDate,
      relativeInvSn,
      invSn,
      invGoodsList,
      selectedIds,
      selectedRows,
      currentPage,
      pageSize,
      // 控制样式
      isShowInvGoodsNameModal,
      isShowAddInvoiceGoodsNameModal,
      isInvGoodsNameLoading,
      addInvoiceGoodsNameList,
      edit,
      sizeEdit,
      unitEdit,
      numEdit,
      priceEdit,
      amountEdit,
      taxAmountEdit,
      totalAmountEdit,
    } = this.props.addInvoice;
    const allTotal = invGoodsList.reduce((pre, next) => {
      if (next.totalAmount) {
        return NP.plus(pre, +next.totalAmount);
      } else {
        return NP.plus(pre, 0);
      }
    }, 0);
    // 新增明细列表
    const invGoodsListColumn = [
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
        render: (value, record) => {
          if (record.isExtraRow) {
            return {
              children: (
                <div>
                  <Search
                    style={{ width: 250, marginLeft: 20 }}
                    enterButton="更多"
                    placeholder="发票商品名称/商品名称"
                    onSearch={this.handleSearchInvGoodsName.bind(this)}
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
        render: (value, record) => (
          record.isExtraRow ? null :
          <span>{value}</span>
        ),
      },
      {
        title: '规格',
        dataIndex: 'size',
        key: 'size',
        width: '80px',
        render: (value, record) => (
          record.isExtraRow ? null :
            sizeEdit ?
              <Input
                onPressEnter={this.saveEdit.bind(this, 'size', record)}
                onBlur={this.saveEdit.bind(this, 'size', record)}
                defaultValue={value}
              /> :
              (<div onClick={this.toggleEditing.bind(this, 'sizeEdit')} style={{ minHeight: '30px' }}>{value}</div>)
        ),
      },
      {
        title: '单位',
        dataIndex: 'unit',
        key: 'unit',
        width: '80px',
        render: (value, record) => (
          record.isExtraRow ? null :
            unitEdit ?
              <Input
                onPressEnter={this.saveEdit.bind(this, 'unit', record)}
                onBlur={this.saveEdit.bind(this, 'unit', record)}
                defaultValue={value}
              /> :
              (<div onClick={this.toggleEditing.bind(this, 'unitEdit')} style={{ minHeight: '30px' }} >{value}</div>)
        ),
      },
      {
        title: '数量',
        dataIndex: 'num',
        key: 'num',
        render: (value, record) => (
          record.isExtraRow ? null :
            numEdit ?
              <Input
                onPressEnter={this.saveEdit.bind(this, 'num', record)}
                onBlur={this.saveEdit.bind(this, 'num', record)}
                defaultValue={value}
              /> :
              (<div onClick={this.toggleEditing.bind(this, 'numEdit')} style={{ minHeight: '30px' }}>{value}</div>)
        ),
      },
      {
        title: '单价',
        dataIndex: 'price',
        key: 'price',
        render: (value, record) => (
          record.isExtraRow ? null :
            priceEdit ?
              <Input
                onPressEnter={this.saveEdit.bind(this, 'price', record)}
                onBlur={this.saveEdit.bind(this, 'price', record)}
                defaultValue={value}
              /> :
              (<div onClick={this.toggleEditing.bind(this, 'priceEdit')} style={{ minHeight: '30px' }} >{value ? Number(value).toFixed(9) : ''}</div>)
        ),
      },
      {
        title: '金额',
        dataIndex: 'amount',
        key: 'amount',
        render: (value, record) => (
          record.isExtraRow ? null :
            amountEdit ?
              <Input
                onPressEnter={this.saveEdit.bind(this, 'amount', record)}
                onBlur={this.saveEdit.bind(this, 'amount', record)}
                defaultValue={value}
              /> :
              (<div onClick={this.toggleEditing.bind(this, 'amountEdit')} style={{ minHeight: '30px' }} >{value ? Number(value).toFixed(2) : ''}</div>)
        ),
      },
      {
        title: '税额',
        dataIndex: 'taxAmount',
        key: 'taxAmount',
        render: (value, record) => (
          record.isExtraRow ? null :
            taxAmountEdit ?
              <Input
                onPressEnter={this.saveEdit.bind(this, 'taxAmount', record)}
                onBlur={this.saveEdit.bind(this, 'taxAmount', record)}
                defaultValue={value}
              /> :
              (<div onClick={this.toggleEditing.bind(this, 'taxAmountEdit')} style={{ minHeight: '30px' }} >{value ? Number(value).toFixed(2) : ''}</div>)
        ),
      },
      {
        title: '价税合计',
        dataIndex: 'totalAmount',
        key: 'totalAmount',
        render: (value, record) => (
          record.isExtraRow ? null :
            totalAmountEdit ?
              <Input
                onPressEnter={this.saveEdit.bind(this, 'totalAmount', record)}
                onBlur={this.saveEdit.bind(this, 'totalAmount', record)}
                defaultValue={value}
              /> :
              (<div onClick={this.toggleEditing.bind(this, 'totalAmountEdit')} style={{ minHeight: '30px', color: 'red' }} >{value ? Number(value).toFixed(2) : ''}</div>)
        ),
      },
    ];
    // 发票商品名称列表
    const invoiceGoodsListColumns = [
      {
        title: '商品名称',
        dataIndex: 'goodsName',
        key: 'goodsName',
        align: 'center',
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
      },
      {
        title: '规格',
        dataIndex: 'size',
        key: 'size',
        align: 'center',
      },
      {
        title: '单位',
        dataIndex: 'unit',
        key: 'unit',
        align: 'center',
      },
      {
        title: '可开票价',
        dataIndex: 'price',
        key: 'price',
        align: 'center',
      },
      {
        title: '即时库存',
        dataIndex: 'immNum',
        key: 'immNum',
        align: 'center',
      },
      {
        title: '可用库存',
        dataIndex: 'invCanUseNum',
        key: 'invCanUseNum',
        align: 'center',
      },
      {
        title: '占用库存',
        dataIndex: 'occNum',
        key: 'occNum',
        align: 'center',
      },
    ];
    // 新增发票商品名称列表
    const addInvoiceGoodsListColumns = [
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
    ];
    return (
      <PageHeaderLayout title="新增发票明细">
        <Card bordered={false} >
          <Row gutter={16} style={{ margin: '20px 0' }}>
            <Col span={3} >
              <span style={{ verticalAlign: 'middle', marginRight: '10px' }}>发票类型</span>
              <Select
                placeholder="发票类型"
                style={{ width: 110 }}
                onChange={this.handleChangeInputValue.bind(this, 'invSourceType')}
                value={(invSourceType !== '') ? invSourceType : undefined}
              >
                {configData.invSourceTypeMap ? (
                  Object.keys(configData.invSourceTypeMap).map(
                    item => (
                      <Option
                        key={item}
                        value={item}
                      >
                        {configData.invSourceTypeMap[item]}
                      </Option>
                      )
                    )) : ''
                  }
              </Select>
            </Col>
            {
              (+invSourceType === 2 || +invSourceType === 4) ?
                <Col span={5}>
                  <span style={{ marginRight: '10px' }}>关联红冲发票号</span>
                  <Input
                    style={{ width: '200px' }}
                    onChange={this.handleChangeInputValue.bind(this, 'relativeInvSn')}
                    value={relativeInvSn}
                  />
                </Col> : ''
            }
            <Col span={5}>
              <span style={{ marginRight: '10px' }}>发票号</span>
              <Input
                onChange={this.handleChangeInputValue.bind(this, 'invSn')}
                value={invSn}
                style={{ width: '200px' }}
              />
            </Col>
            <Col span={5} >
              <span style={{ marginRight: '10px' }}>发票日期</span>
              <DatePicker
                format="YYYY-MM-DD"
                onChange={this.handleChangeInputValue.bind(this, 'invDate')}
                value={invDate ? moment(invDate, 'YYYY-MM-DD') : null}
              />
            </Col>
          </Row>
          <Table
            bordered
            dataSource={invGoodsList.concat({ id: '更多', isExtraRow: true })}
            columns={invGoodsListColumn}
            size="small"
            rowKey={record => record.id}
            pagination={false}
          />
          <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginTop: 10, marginBottom: 25 }}>
            <Col md={4} offset={20} style={{ height: 26, lineHeight: '26px' }}>
              价税总合计：<span style={{ color: 'red', fontSize: '18px', fontWeight: 'bold' }}>{allTotal.toFixed(2)}</span>
            </Col>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginTop: 10, marginBottom: 25 }}>
            <Col md={6} offset={18} style={{ height: 26, lineHeight: '26px' }}>
              <Link to="#">
                <Button type="" style={{ marginRight: '10px' }} onClick={this.commitInvoiceInfo.bind(this, 'cancel')}>取消</Button>
              </Link>
              <Button type="primary" style={{ marginRight: '10px' }} onClick={this.commitInvoiceInfo.bind(this, 'toList')}>保存回到列表</Button>
              <Button type="primary" style={{ marginRight: '10px' }} onClick={this.commitInvoiceInfo.bind(this, 'continueAdd')}>保存并继续新增</Button>
            </Col>
          </Row>
          <Modal
            closable={false}
            maskClosable={false}
            width={1200}
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
                    onSearch={this.handleSearchInvGoodsName.bind(this)}
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
              rowSelection={{
                selectedRowKeys: selectedIds,
                onChange: this.handleCheckGoods.bind(this),
                getCheckboxProps: record => ({
                  disabled: invGoodsList.some((goodsInfo) => {
                    return record.id === goodsInfo.id;
                  }),
                }),
              }}
              dataSource={invoiceGoodsList}
              columns={invoiceGoodsListColumns}
              pagination={{
                current: currentPage,
                pageSize,
                onShowSizeChange: this.handleChangeInputValue.bind(this, 'pageSize'),
                onChange: this.handleChangeInputValue.bind(this, 'currentPage'),
                showSizeChanger: true,
                pageSizeOptions: ['30', '50', '60', '80', '100', '120', '150', '200', '300'],
                total: invGoodsNameListData.total,
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
              columns={addInvoiceGoodsListColumns}
              pagination={false}
            />
          </Modal>
        </Card>
      </PageHeaderLayout>
    );
  }
}
