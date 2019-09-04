import React, { PureComponent } from 'react';
import moment from 'moment';
import NP from 'number-precision';
import { connect } from 'dva';
import { Card, Input, DatePicker, Icon, Table, Row, Select, Button, Col, Radio, Modal, message, Upload, notification } from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import globalStyles from '../../assets/style/global.less';
import { getUrl } from '../../utils/request';

const { Search } = Input;
const RadioGroup = Radio.Group;

@connect(state => ({
    manualInInvoice: state.manualInInvoice,
}))
export default class manualInInvoice extends PureComponent {
        
    componentDidMount() {
        const { dispatch } = this.props;
        const id = this.props.match.params.id;
        const invType = this.props.match.params.type;
        dispatch({
            type: 'manualInInvoice/getGoodsDetail',
            payload:{
                id,
                invType,
            }
        });
    }
    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'manualInInvoice/unmount',
        });
    }
    handleChangeSyncItem=(type,e)=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'manualInInvoice/updatePageReducer',
            payload: {
                [type]:e.target.value,
            }
        });
    }
    handleChangeDate=(data,dateString)=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'manualInInvoice/updatePageReducer',
            payload: {
                invDate:dateString,
            }
        });
    }
    handleChangeRadio=(e)=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'manualInInvoice/updatePageReducer',
            payload: {
                isSuitDetail:e.target.value,
            }
        });

    }
    handleSearchInvGoodsName=(goodsKeywords)=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'manualInInvoice/getGoodsList',
            payload: {
                goodsKeywords,
                currentPage: 1,
                isShowInvGoodsNameModal: true,
            }
        });
    }
    handleCloseInvGoodsNameModal=()=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'manualInInvoice/updatePageReducer',
            payload: {
                isShowInvGoodsNameModal:false,
                goodsKeywords:"",
            }
        });
    }
    // 选择发票商品
    handleCheckGoods(selectedIds, selectedRows) {
        const { dispatch } = this.props;
        dispatch({
            type: 'manualInInvoice/updatePageReducer',
            payload: {
                selectedIds,
                selectedRows,
            },
        });
    }
    // 弹窗选择商品点击确定
    handleInvGoodsNameModalOk=()=>{
        const { dispatch, manualInInvoice } = this.props;
        const { invGoodsList, selectedRows } = manualInInvoice;
        const listArray = [];
        if (selectedRows.length > 0) {
            for (let i = 0; i < selectedRows.length; i += 1) {
                const { goodsName, id, goodsSn, invGoodsId, invGoodsName, price, size, unit, invCanUseNum } = selectedRows[i];
                const listObj = {
                    id,
                    goodsName,
                    goodsSn,
                    size,
                    unit,
                    importPrice:price?price:0,
                    price,
                    invGoodsId,
                    invGoodsName,
                    invCanUseNum,
                };
                listArray.push(listObj);
            }
        }
        dispatch({
            type: 'manualInInvoice/updatePageReducer',
            payload: {
                isShowInvGoodsNameModal: false,
                invGoodsList: invGoodsList.concat(listArray),
                selectedIds: [],
                selectedRows: [],
            },
        });
    }
    // 删除行
    handleDeleteColumn(id) {
        const { dispatch } = this.props;
        const { invGoodsList } = this.props.manualInInvoice;
        const index = invGoodsList.findIndex(element => element.id === id);
        invGoodsList.splice(index, 1);
        dispatch({
            type: 'manualInInvoice/updatePageReducer',
            payload: {
                invGoodsList,
            },
        });
    }
    // 点击作废
    handleCancel=()=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'manualInInvoice/updatePageReducer',
            payload:{
                confirmIsDelete: true,
            }
        });
    }
    // 确认作废
    handConfirmDelete=()=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'manualInInvoice/removeGoodsList',
            payload:{
                confirmIsDelete: false,
            }
        });
    }
    handCancelDelete=()=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'manualInInvoice/updatePageReducer',
            payload:{
                confirmIsDelete: false,
            }
        });
    }
    // 点击保存
    handleSaveEdit=(type)=>{
        const { dispatch, manualInInvoice } = this.props;
        const  {invSn, invCompany, invDate, remark, invGoodsList,id }  = manualInInvoice;
        let isConfirm = "";
        if(type === "save"){
            isConfirm = 0;
        }else{
            isConfirm = 1;
        }
        if(isNaN(id)&&!invSn) {
            message.error("请输入发票号");
            return;
        }
        if(isNaN(id)&&!invDate) {
            message.error("请输入日期");
            return;
        }
        if(isNaN(id)&&!invCompany) {
            message.error("请输入开票公司名称");
            return;
        }
        if(isNaN(id)&&!remark) {
            message.error("请输入备注");
            return;
        }
        // invGoodsList&&invGoodsList.map(item=>{
        //     if(!item.num || !item.price || !item.amount || !item.taxAmount || !item.totalAmount) {
        //         message.error("列表不能存在未填项");
        //         return;
        //     }
        // })
        const isZero = invGoodsList&&invGoodsList.every(item=>{
            return +item.num === 0;
        })
        if(isZero) {
            message.warning('商品数量不能全部为空，为空的商品不能退单！');
            return;
        }
        dispatch({
            type: 'manualInInvoice/addNewInvoiceBill',
            payload:{
                isConfirm,
            }
        });
    }
    // 显示新建发票商品弹层
    showAddInvoiceGoodsNameModal() {
        const { dispatch } = this.props;
        dispatch({
            type: 'manualInInvoice/updatePageReducer',
            payload: {
                isShowAddInvoiceGoodsNameModal: true,
            },
        });
    }
    // 处理新增发票商品弹窗事件
    handleAddInvoiceGoodsNameModalOk() {
        const { dispatch } = this.props;
        const { addInvoiceGoodsNameList } = this.props.manualInInvoice;
        let canSubmit = true;
        Object.keys(addInvoiceGoodsNameList[0]).forEach((item) => {
            if (addInvoiceGoodsNameList[0][item] === '') {
                message.error('不能存在未填项');
                canSubmit = false;
            }
        });
        if (canSubmit) {
        dispatch({
            type: 'manualInInvoice/createInvoiceGoodsName',
            payload: {
                goodsName: addInvoiceGoodsNameList[0].goodsName,
                goodsSn: addInvoiceGoodsNameList[0].goodsSn,
                invGoodsName: addInvoiceGoodsNameList[0].invGoodsName,
                size: addInvoiceGoodsNameList[0].size,
                unit: addInvoiceGoodsNameList[0].unit,
            },
        }).then(() => {
            dispatch({
            type: 'manualInInvoice/getInvGoodsNameListData',
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
            type: 'manualInInvoice/updatePageReducer',
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
    toggleEditing=()=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'manualInInvoice/updatePageReducer',
            payload: {
              edit: true,
            },
        });
    }
    // 换页回调
    handleChangeCurPage(currentPage) {
        const { dispatch } = this.props;
        dispatch({
            type: 'manualInInvoice/getGoodsList',
            payload: {
                currentPage,
            },
        });
    }
    handleChangePageSize(curPage, pageSize) {
        const { dispatch } = this.props;
        dispatch({
            type: 'manualInInvoice/getGoodsList',
            payload: {
                currentPage: 1,
                pageSize,
            },
        });
    }
    //   批量导入
    handleChangeUpload(info) {
        const { dispatch } = this.props;
        if (info.file.status === 'uploading') {
          dispatch({
            type: 'manualInInvoice/updatePageReducer',
            payload:{
                isLoading:true,
            }
          });
        }
        if (info.file.status === 'error') {
          notification.error({
            message: '提示',
            description: '上传失败, 请稍后重试!',
          });
          dispatch({
            type: 'manualInInvoice/updatePageReducer',
            payload: {
                isLoading:false,
            },
          });
        }
        if (info.file.status === 'done') {
          dispatch({
            type: 'manualInInvoice/updatePageReducer',
            payload: {
                invGoodsList:info.file.response.data.invoiceGoodsList,
                isLoading:false,
            },
          });
        }
      }
    // 保存新建数据
    saveAdd(type, e) {
        const { dispatch } = this.props;
        const { addInvoiceGoodsNameList } = this.props.manualInInvoice;
        let edit = false;
        addInvoiceGoodsNameList[0][type] = e.target.value;
        Object.keys(addInvoiceGoodsNameList[0]).forEach((item) => {
            if (addInvoiceGoodsNameList[0][item] === '') {
                edit = true;
            }
        });
        dispatch({
        type: 'manualInInvoice/updatePageReducer',
            payload: {
                edit,
                addInvoiceGoodsNameList,
            },
        });
    }
    handleAddInvoiceGoodsNameModalCancel() {
        const { dispatch } = this.props;
        dispatch({
          type: 'manualInInvoice/updatePageReducer',
          payload: {
            isShowAddInvoiceGoodsNameModal: false,
          },
        });
    }
    //修改列表数据
    handleChangeEdit(type,record,e) {
        e.persist()
        const { dispatch, manualInInvoice } = this.props;
        const { invGoodsList, taxRate } = manualInInvoice;
        const index = invGoodsList.findIndex(element => +element.id === +record.id);
        switch (type) {
            case "num":
                invGoodsList[index].num = e.target.value;
                invGoodsList[index].amount = NP.times(+invGoodsList[index].num, +invGoodsList[index].importPrice).toFixed(2);
                invGoodsList[index].taxAmount = NP.times(+e.target.value, +invGoodsList[index].importPrice, +taxRate).toFixed(2);
                invGoodsList[index].totalAmount = NP.plus(invGoodsList[index].amount, invGoodsList[index].taxAmount).toFixed(2);
            break;
            case 'importPrice':
                invGoodsList[index].importPrice = e.target.value;
            break;
            case 'amount':
                invGoodsList[index].amount = e.target.value;
                invGoodsList[index].importPrice = NP.round(NP.divide(+invGoodsList[index].amount, +invGoodsList[index].num),9); ;
                invGoodsList[index].taxAmount = NP.times(+invGoodsList[index].amount, +taxRate).toFixed(2);
                invGoodsList[index].totalAmount = NP.plus(invGoodsList[index].amount, invGoodsList[index].taxAmount).toFixed(2);
            break;
            case 'taxAmount':
                invGoodsList[index].taxAmount = e.target.value;
                invGoodsList[index].totalAmount = NP.plus(invGoodsList[index].amount, invGoodsList[index].taxAmount).toFixed(2);
            break;
            case 'totalAmount':
                invGoodsList[index][type] = e.target.value;
            break;
            default:
                invGoodsList[index][type] = e.target.value;
            break;
        }
        dispatch({
            type: 'manualInInvoice/updatePageReducer',
            payload: {
              invGoodsList,
            },
        });
    }
    render() {
        const {
            manualInInvoice: {
                invoiceGoodsList,
                isShowInvGoodsNameModal,
                selectedIds,
                invGoodsList,
                isSuitDetail,
                isShowAddInvoiceGoodsNameModal,
                addInvoiceGoodsNameList,
                edit,
                isTableLoading,
                invCompany,
                invDate,
                invSn,
                remark,
                confirmIsDelete,
                currentPage,
                pageSize,
                total,
                invoiceBillSn,
                isLoading,
            }
        } = this.props;
        const id = this.props.match.params.id; 
        const invType = this.props.match.params.invType; 
        const totalNum = invGoodsList.reduce((pre,next)=>{
            if(next.num) {
                return NP.plus(pre, +next.num);
            }else{
                return NP.plus(pre, 0);
            }
        },0)
        const amount = invGoodsList.reduce((pre, next) => {
            if(next.amount) {
                return NP.plus(pre, +next.amount);
            }else{
                return NP.plus(pre, 0);
            }
            
        }, 0);
        const taxAmount = invGoodsList.reduce((pre, next) => {
            if(next.taxAmount) {
                return NP.plus(pre, +next.taxAmount);
            }else{
                return NP.plus(pre, 0);
            }
            
        }, 0);
        const allTotal = invGoodsList.reduce((pre, next) => {
            if (next.totalAmount) {
              return NP.plus(pre, +next.totalAmount);
            } else {
              return NP.plus(pre, 0);
            }
          }, 0);
        
        const operation = {
            dataIndex: 'operation',
            key: 'operation',
            width: 80,
            align: 'center',
            render: (_, record) => (
                record.isExtraRow || !isNaN(id)? null :
                <Icon type="minus" 
                style={{ cursor: 'pointer', fontSize: '17px', fontWeight: 'bold', border: '1px solid #ccc', borderRadius: '4px', color: '#ccc' }} 
                onClick={this.handleDeleteColumn.bind(this, record.id)} />
            ),
        };
        const goodsName = {
            title: '商品名称',
            dataIndex: 'goodsName',
            key: 'goodsName',
            width:230,
            render: (value, record) => {
                if (record.isExtraRow && isNaN(id)) {
                    return <div>
                    <Search
                    style={{ width: 230 }}
                    enterButton="更多"
                    placeholder="发票商品名称/商品名称"
                    onSearch={this.handleSearchInvGoodsName.bind(this)}
                    />
                </div> 
                } else {
                    return {
                        children: <span>{value}</span>,
                    };
                }
              },
        };
        const goodsSn = {
            title: '条码',
            dataIndex: 'goodsSn',
            key: 'goodsSn',
            width:150,
        };
        const invGoodsName = {
            title: '发票商品名称',
            dataIndex: 'invGoodsName',
            key: 'invGoodsName',
            width:200,
        };
        const size = {
            title: '规格',
            dataIndex: 'size',
            key: 'size',
            width:100,
            render:(size,record)=>{
                return record.isExtraRow?null:(isNaN(id)&&id=="in"?<Input 
                value={size}
                onChange={this.handleChangeEdit.bind(this,'size',record)}
                />:<span>{size}</span>)
            }
        };
        const unit = {
            title: '单位',
            dataIndex: 'unit',
            key: 'unit',
            width:90,
            render:(unit,record)=>{
                return record.isExtraRow?null:(isNaN(id)&&id=="in"?<Input 
                value={unit}
                onChange={this.handleChangeEdit.bind(this,'unit',record)}
                />:<span>{unit}</span>)
            }
        };
        const num = {
            title: '数量',
            dataIndex: 'num',
            key: 'num',
            width:100,
            render:(num,record)=>{
                return record.isExtraRow?null:(isNaN(id)?<Input 
                onChange={this.handleChangeEdit.bind(this,'num',record)}
                value={num}
                />:<span>{num}</span>)
            }
        };
        const unitPrice = {
            title: '单价',
            dataIndex: 'importPrice',
            key: 'importPrice',
            width:120,
            render:(importPrice,record)=>{
                return record.isExtraRow?null:(isNaN(id)?<Input 
                onChange={this.handleChangeEdit.bind(this,'importPrice',record)}
                value={importPrice}
                />:<span>{record.price}</span>)
            }
        };
        const amountColums = {
            title: '金额',
            dataIndex: 'amount',
            key: 'amount',
            width:120,
            render:(amount,record)=>{
                return record.isExtraRow?null:(isNaN(id)?<Input 
                onChange={this.handleChangeEdit.bind(this,'amount',record)}
                value={amount}
                />:<span>{amount}</span>)
            }
        };
        const taxAmountColumn = {
            title: '税额',
            dataIndex: 'taxAmount',
            key: 'taxAmount',
            width:120,
            render:(taxAmount,record)=>{
                return record.isExtraRow?null:(isNaN(id)?<Input 
                onChange={this.handleChangeEdit.bind(this,'taxAmount',record)}
                value={taxAmount}
                />:<span>{taxAmount}</span>)
            }
        };
        const totalAmountColumn = {
            title: '价税合计',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            width:100,
            render:(totalAmount,record)=>{
                return record.isExtraRow?null:(isNaN(id)?<Input 
                onChange={this.handleChangeEdit.bind(this,'totalAmount',record)}
                value={totalAmount}
                />:<span>{totalAmount}</span>)
            }
        };
        const invCanUseNum = {
            title: '可用库存',
            dataIndex: 'invCanUseNum',
            key: 'invCanUseNum',
            width:100,
        };
        
        const price = {
            title: '可开票价',
            dataIndex:'price',
            key: 'price',
            width:100,
        };

        const inColumns = [
            operation,
            goodsName,
            goodsSn,
            invGoodsName,
            size,
            unit,
            num,
            unitPrice,
            amountColums,
            taxAmountColumn,
            totalAmountColumn,
        ];
        const outColumns= [
            operation,
            goodsName,
            goodsSn,
            invGoodsName,
            invCanUseNum,
            price,
            size,
            unit,
            num,
            unitPrice,
            amountColums,
            taxAmountColumn,
            totalAmountColumn,
        ];
        
        const extraColumns = [
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
        const invoiceGoodsListColumns = [
            {
              title: '商品名称',
              dataIndex: 'goodsName',
              key: 'goodsName',
              align: 'center',
              width:300,
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
              width:200,
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
                    (<div onClick={this.toggleEditing.bind(this)} style={{ minHeight: '30px' }} >{value}</div>)
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
                    (<div onClick={this.toggleEditing.bind(this)} style={{ minHeight: '30px' }} >{value}</div>)
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
                    (<div onClick={this.toggleEditing.bind(this)} style={{ minHeight: '30px' }} >{value}</div>)
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
                    (<div onClick={this.toggleEditing.bind(this)} style={{ minHeight: '30px' }} >{value}</div>)
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
                    (<div onClick={this.toggleEditing.bind(this)} style={{ minHeight: '30px' }} >{value}</div>)
                ) : <div>{value}</div>
            ),
            },
        ];
        let title = "";
        if(isNaN(id) && id == "out") {
            title="手动开票";
        }else if(id && !isNaN(id) && invType == 2){
            title="手动开票详情";
        }
        if(isNaN(id) && id == "in") {
            title="手动来票";
        }else if(id && !isNaN(id) && invType == 1){
            title="手动来票详情";
        }
      
        


    return (
      <PageHeaderLayout title={title}>
        <Card bordered={false}>
            <Row style={{marginBottom:20}}>
                <Col span={20}>
                    <span style={{ verticalAlign: 'middle', marginRight: '10px' }}>发票号：</span>
                    {
                        !isNaN(id)?<span style={{ verticalAlign: 'middle', marginRight: '20px' }}>{invoiceBillSn}</span>:<Input
                        placeholder="发票号"
                        className={globalStyles['input-sift']}
                        onBlur={this.handleChangeSyncItem.bind(this, 'invSn')}
                    />
                    }
                    {
                        !isNaN(id)?<span style={{ verticalAlign: 'middle', marginRight: '20px' }}>开票日期：{invDate}</span>:<DatePicker
                        className={globalStyles['rangePicker-sift']}
                          onChange={this.handleChangeDate.bind(this)}
                        />
                    }
                    <span style={{ verticalAlign: 'middle', marginRight: '10px' }}>开票公司名称：</span>
                    {
                        !isNaN(id)?<span style={{ verticalAlign: 'middle', marginRight: '20px' }}>{invCompany}</span>:<Input
                        className={globalStyles['input-sift']}
                        onBlur={this.handleChangeSyncItem.bind(this, 'invCompany')}
                        /> 
                    }
                    <span style={{ verticalAlign: 'middle', marginRight: '10px' }}>是否对应明细：</span>
                    <RadioGroup 
                    onChange={this.handleChangeRadio} 
                    value={isSuitDetail}
                    disabled={!isNaN(id)?true:false}
                    >
                        <Radio value={1}>是</Radio>
                        <Radio value={2}>否</Radio>
                    </RadioGroup>
                </Col>
                <Col span={4}>
                    <Upload
                    name="inventoryList"
                    action={`${getUrl(API_ENV)}/finance/invoice-bill/import`}
                    onChange={this.handleChangeUpload.bind(this)}
                    headers={{
                      authorization: `Basic ${window.btoa(`${localStorage.getItem('token')}:`)}`,
                    }}
                  >
                        {
                            isNaN(id)?<Button type="primary">批量导入</Button>:''
                        }
                        
                  </Upload>
                </Col>
            </Row>
          <Table
            dataSource={invGoodsList.concat({ id: '更多', isExtraRow: true })}
            columns={(invType==false||id=="out")?outColumns:inColumns}
            pagination={false}
            bordered    
            loading={isLoading}        
          />
            <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginTop: 20, marginBottom: 25 }}>
                <Col span={11}>
                    <span style={{color:'red'}}>*</span>备注：{!isNaN(id)?<span>{remark}</span>:<Input style={{width:300}} onBlur={this.handleChangeSyncItem.bind(this, 'remark')}/>}
                </Col>
                <Col span={3} style={{ height: 26, lineHeight: '26px' }}>
                    总数量：<span style={{ color: 'red', fontSize: '18px', fontWeight: 'bold' }}>{totalNum}</span>
                </Col>
                <Col span={3} style={{ height: 26, lineHeight: '26px' }}>
                    金额：<span style={{ color: 'red', fontSize: '18px', fontWeight: 'bold' }}>{amount.toFixed(2)}</span>
                </Col>
                <Col span={3} style={{ height: 26, lineHeight: '26px' }}>
                    税额：<span style={{ color: 'red', fontSize: '18px', fontWeight: 'bold' }}>{taxAmount.toFixed(2)}</span>
                </Col>

                <Col span={4} style={{ height: 26, lineHeight: '26px' }}>
                    价税总合计：<span style={{ color: 'red', fontSize: '18px', fontWeight: 'bold' }}>{allTotal.toFixed(2)}</span>
                </Col>
            </Row>
            <Row>
                <Col span={22} align="end">
                    <Button><Link to= "/finance/finance-invoice/invoice-after-sale-list">取消</Link></Button>
                    {
                        isNaN(id)?<Button type="primary" style={{margin:"0 12px"}} onClick={this.handleSaveEdit.bind(this,'save')}>保存</Button>
                        :<Button type="primary" style={{margin:"0 12px"}} onClick={this.handleCancel.bind(this)}>作废</Button>
                    }
                    <Button type="primary" onClick={this.handleSaveEdit.bind(this,'confirm')}>确认</Button>
                </Col>
            </Row>
          <Modal
          visible={isShowInvGoodsNameModal}
          width={1400}
          closable={false}
          maskClosable={false}
          footer={null}
          >
            <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginTop: 10, marginBottom: 25 }}>
                <Col span={18} style={{ height: 26, lineHeight: '26px' }}>
                    <div>
                    <Search
                        style={{ width: 320, marginLeft: 20 }}
                        enterButton="搜索"
                        placeholder="请输入商品名称/条码/发票商品名称"
                        onSearch={this.handleSearchInvGoodsName.bind(this)}
                    />
                    </div>
                </Col>
                <Col style={{ height: 26, lineHeight: '26px' }}>
                    <Button type="primary" onClick={this.handleInvGoodsNameModalOk}>确定</Button>
                    <Button onClick={this.handleCloseInvGoodsNameModal} style={{margin:"0 10px"}}>取消</Button>
                    {
                        isNaN(id)&&id=="in"?<Button type="primary" onClick={this.showAddInvoiceGoodsNameModal.bind(this)}>新建</Button>:null
                    }                    
                </Col>
            </Row>
            <Table 
            bordered
            dataSource={invoiceGoodsList}
            columns={isNaN(id)&&id=="out"?[...invoiceGoodsListColumns,...extraColumns]:invoiceGoodsListColumns}
            rowKey={record => record.id}
            loading={isTableLoading}
            pagination={{
                current: currentPage,
                pageSize,
                total,
                onShowSizeChange: this.handleChangePageSize.bind(this),
                onChange: this.handleChangeCurPage.bind(this),
                showTotal:total => `共 ${total} 个结果`,
            }}
            rowSelection={{
                selectedRowKeys: selectedIds,
                onChange: this.handleCheckGoods.bind(this),
                getCheckboxProps: record => ({
                    disabled: invGoodsList.some((goodsInfo) => {
                        return record.id === goodsInfo.id;
                    }),
                }),
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
            <Modal
            visible={confirmIsDelete}
            title="作废"
            onOk = {this.handConfirmDelete}
            onCancel = {this.handCancelDelete}
            >
                <Row type="flex" justify="center">请确认是否作废？</Row>
            </Modal>
        </Card>
      </PageHeaderLayout>
    );
  }
}
