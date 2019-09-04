import React, { PureComponent } from 'react';
import moment from 'moment';
import NP from 'number-precision';
import { connect } from 'dva';
import { Card, Input, DatePicker, Icon, Table, Row, Select, Button, Col, Radio, Modal, message } from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './afterSaleAdd.less';
import globalStyles from '../../assets/style/global.less';

const { Search } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;

@connect(state => ({
    afterSaleAdd: state.afterSaleAdd,
}))
export default class afterSaleAdd extends PureComponent {
    componentDidMount() {
        const { dispatch } = this.props;
        const id = this.props.match.params.id;
        if(id) {
            dispatch({
                type: 'afterSaleAdd/getList',
                payload:{
                    id,
                    isTableLoading:true,
                }
            });
        }
    }
    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'afterSaleAdd/unmountReducer',
        });
    }
    handleChangeInvItem=(type,e)=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'afterSaleAdd/updatePageReducer',
            payload:{
                [type]:e.target.value,
            }
        });
    }
    handleSearchByInvItem=(type,value)=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'afterSaleAdd/searchForGoodsInfo',
            payload:{
                [type]:value,
                isTableLoading:true,
            }
        });
    }
    handleChangeBackNum=(itemId,e)=>{
        const { dispatch, afterSaleAdd } = this.props;
        const { invGoodsList } = afterSaleAdd;
        const backNum = e.target.value;
        invGoodsList.map(item=>{
            if(+item.id === +itemId ){ 
                item.backNum = backNum;
            }
        })
        dispatch({
            type: 'afterSaleAdd/updatePageReducer',
            payload:{
                invGoodsList, 
            }
        });
    }
    handleSaveEdit=(type)=>{
        const { dispatch,afterSaleAdd } = this.props;
        const { invGoodsList, invSn, remark,id  } = afterSaleAdd;
        let isConfirm = "";
        if(type === "save"){
            isConfirm = 0;
        }else{
            isConfirm = 1;
        }
        if(!id&&!invSn) {
            message.error("请输入发票号");
            return;
        }
        if(!id&&!remark) {
            message.error("请填写备注");
            return;
        }
        const isAllZero = invGoodsList.every(item=>{
            return item.backNum == false;
        })
        if(!id&&isAllZero) {
            message.warning('售后数量不能全部为空');
            return;
        }
        dispatch({
            type: 'afterSaleAdd/createNewAfterOrder',
            payload:{
                isConfirm, 
            }
        });
    }
    handleAddRemark=(e)=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'afterSaleAdd/updatePageReducer',
            payload:{
                remark:e.target.value, 
            }
        });
    }
    // 删除行
    handleDeleteColumn(id) {
        const { dispatch, afterSaleAdd } = this.props;
        const { invGoodsList } = afterSaleAdd;
        const index = invGoodsList.findIndex(element => element.id === id);
        invGoodsList.splice(index, 1);
        dispatch({
            type: 'afterSaleAdd/updatePageReducer',
            payload: {
                invGoodsList,
            },
        });
    }
    // 点击作废
    handleCancel=()=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'afterSaleAdd/updatePageReducer',
            payload:{
                confirmIsDelete: true,
            }
        });
    }
    // 确认作废
    handConfirmDelete=()=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'afterSaleAdd/removeGoodsList',
            payload:{
                confirmIsDelete: false,
            }
        });
    }
    handCancelDelete=()=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'afterSaleAdd/updatePageReducer',
            payload:{
                confirmIsDelete: false,
            }
        });
    }
    render() {
        const {
            afterSaleAdd: {
                invSn,
                invCompany,
                invDate,
                invSourceType,
                invGoodsList,  
                id,    
                remark, 
                isTableLoading, 
                confirmIsDelete,
                invoiceList,
                itemId,
            }
        } = this.props;
        const columns = [
            {
                dataIndex: 'operation',
                key: 'operation',
                width: 80,
                align: 'center',
                render: (_, record) => {
                    return id?null:<Icon type="minus" style={{ cursor: 'pointer', fontSize: '17px', fontWeight: 'bold', border: '1px solid #ccc', borderRadius: '4px', color: '#ccc' }} 
                    onClick={this.handleDeleteColumn.bind(this, record.id)} />
                }
            },
            {
                title: '商品名称',
                dataIndex: 'goodsName',
                key: 'goodsName',
                align: 'center',
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
           
            },
            {
                title: '规格',
                dataIndex: 'size',
                key: 'size',
                width: '150px',
            
            },
            {
                title: '单位',
                dataIndex: 'unit',
                key: 'unit',
                width: '150px',
            
            },
            {
                title: '单价',
                dataIndex: 'price',
                key: 'price',
                width: '150px',
            
            },
            {
                title: '剩余可售后数量',
                dataIndex: 'canBackNum',
                key: 'canBackNum',
                width: '150px',
            
            },
            {
                title: '售后数量',
                dataIndex: 'backNum',
                key: 'backNum',
                width: '150px',
                render:(backNum,record)=>{
                    return id?<span>{backNum}</span>:<Input onChange={this.handleChangeBackNum.bind(this,record.id)}/>
                }
            },
    ];
    return (
      <PageHeaderLayout title={id?"售后单详情":"新建售后"}>
        <Card bordered={false}>
            <Row style={{marginBottom:20}}>
                <Col span={5}>
                    <span style={{verticalAlign:'middle'}}>关联发票号：</span>
                    <Search
                    disabled={id}
                    value={invSn}
                    placeholder="发票号"
                    className={globalStyles['input-sift']}
                    onChange={this.handleChangeInvItem.bind(this,"invSn")}
                    onSearch={this.handleSearchByInvItem.bind(this,"invSn")}
                    />
                </Col>
                <Col span={5}>
                    <span style={{verticalAlign:'middle'}}>发票ID：</span>
                    <Search
                    disabled={id}
                    value={itemId}
                    placeholder="请输入发票ID"
                    className={globalStyles['input-sift']}
                    onChange={this.handleChangeInvItem.bind(this,"itemId")}
                    onSearch={this.handleSearchByInvItem.bind(this,"itemId")}
                    />
                </Col>
                {
                  invCompany?<Col span={14}>
                  <span style={{display:"inline-block",marginRight:10,verticalAlign:'middle'}}>发票类型：<span style={{fontWeight:"bold"}}>{invSourceType}</span></span>
                  <span style={{display:"inline-block",marginRight:10,verticalAlign:'middle'}}>开票日期：<span style={{fontWeight:"bold"}}>{invDate}</span></span>
                  <span style={{display:"inline-block",marginRight:10,verticalAlign:'middle'}}>开票公司名称：<span style={{fontWeight:"bold"}}>{invCompany}</span></span>
                </Col>:null
                }
            </Row>
          <Table
            dataSource={id?invoiceList:invGoodsList}
            columns={columns}
            pagination={false}
            bordered    
            loading={isTableLoading}        
          />
            <Row style={{marginTop:10}}>
                <span style={{color:'red'}}>*</span>备注：{id?<span>{remark}</span>:<Input style={{width:300}} onChange = {this.handleAddRemark}/>}
            </Row>
            <Row>
                <Col span={22} align="end">
                    <Button><Link to= "/finance/finance-invoice/invoice-after-sale-list">取消</Link></Button>
                    {
                        id?<Button type="primary" style={{margin:"0 12px"}} onClick={this.handleCancel.bind(this)}>作废</Button>
                        :<Button type="primary" style={{margin:"0 12px"}} onClick={this.handleSaveEdit.bind(this,'save')}>保存</Button>
                    }
                    
                    <Button type="primary" onClick={this.handleSaveEdit.bind(this,'confirm')}>确认</Button>
                </Col>
            </Row>
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
