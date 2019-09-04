import React, { PureComponent } from 'react';
import globalStyles from '../../assets/style/global.less';
import { connect } from 'dva';
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import ClearIcon from '../../components/ClearIcon';
import Debounce from 'lodash-decorators/debounce';
import { Link } from 'dva/router';
import {
  Card,
  Row,
  Select,
  Input,
  Table,
  Button,
  DatePicker,
  Col,
  AutoComplete,
  Tooltip,
} from 'antd';
const Search = Input.Search;
@connect(state => ({
    rebatePolicy: state.rebatePolicy,
}))
export default class RebatePolicy extends PureComponent{
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'rebatePolicy/getList',
        });
        dispatch({
            type: 'rebatePolicy/getConfig',
        });
    }
    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch({
          type: 'rebatePolicy/unmountReducer',
        });
    }
    handleChangeItems=(type,e)=>{
        const { dispatch } = this.props;
        dispatch({
          type: 'rebatePolicy/updatePageReducer',
          payload:{
              [type]:e.target.value,
          }
        });
    }
    handleSearchItems=(type,e)=>{
        const { dispatch } = this.props;
        dispatch({
          type: 'rebatePolicy/getList',
          payload:{
                [type]:e,
                currentPage:1,
          }
        });
    }
    handleChangeDate=(date,dateString)=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'rebatePolicy/getList',
            payload:{
                checkTimeStart:dateString[0],
                checkTimeEnd:dateString[1],
                currentPage:1,
            }
        });
    }
    @Debounce(200)
    handleChangeSupplier=(text)=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'rebatePolicy/changeSupplier',
            payload: {
                keywords: text,
            },
        });
    }
    handleSelectSupplier=(supplierId)=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'rebatePolicy/getList',
            payload: {
                supplierId,
                currentPage:1,
            },
        });
    }
    handleClear=(type)=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'rebatePolicy/getList',
            payload: {
                [type]:'',
                currentPage:1,
            },
        });
    }
    handleChangePage=(currentPage)=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'rebatePolicy/getList',
            payload: {
                currentPage,
            },
        });
    }
    handleChangePageSize=(current,pageSize)=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'rebatePolicy/getList',
            payload: {
                pageSize,
                currentPage:1,
            },
        });
    }
    render() {
        const {
            rebatePolicy:{
                isTableLoading,
                brandPolicyList,
                purchaserMap,
                supplierSuggest,
                goodsKeywords,
                goodsSn,
                total,
                currentPage,
                pageSize,
               
            }            
        } = this.props; 
        const columns = [
            {
                title: '供应商名称',
                dataIndex: 'supplierName',
                key: 'supplierName',
                width:200,
                render:(supplierName,record)=>{
                    return <Link to={`/purchase/supplier-management/supplier-check-list/supplier-check-detail/${record.supplierId}`}>{supplierName}</Link>
                }
            },
            {
                title: '品牌',
                dataIndex: 'brandName',
                key: 'brandName',
                width:200,
            },
            {
                title: '商品条码',
                dataIndex: 'goodsSn',
                key: 'goodsSn',
                width:150,
            },
            {
                title: '商品名称',
                dataIndex: 'goodsName',
                key: 'goodsName',
                width:250,
                render:(goodsName)=>{
                    return <Tooltip title={goodsName}>
                        <p style={{width:230,margin:0}} className={globalStyles.twoLine}>{goodsName}</p>
                    </Tooltip>
                }
            },
            {
                title: '采购员',
                dataIndex: 'purchaser',
                key: 'purchaser',
                width:170,
                render:(purchaser)=>{
                    return<span>{purchaserMap[purchaser]}</span>
                }
            },
            {
                title: '返利政策',
                dataIndex: 'brandPolicy',
                key: 'brandPolicy',
                width:360,
                render:(brandPolicy)=>{
                    return <Tooltip title={brandPolicy}>
                        <p style={{width:340,margin:0}} className={globalStyles.twoLine}>{brandPolicy}</p>
                    </Tooltip>

                }
            },
            {
                title: '审核时间',
                dataIndex: 'checkTime',
                key: 'checkTime',
                width:100,
            },
            {
                title: '采购备注',
                dataIndex: 'remark',
                key: 'remark',
                width:150,
                render:(remark)=>{
                    return<Tooltip title={remark}>
                        <p style={{width:130,margin:0}} className={globalStyles.twoLine}>{remark}</p>
                    </Tooltip>
                }
            },
            
        ]
        
       return (
        <PageHeaderLayout title="返利政策">
            <Card>
                <Row style={{marginBottom:10}}>
                    <Input.Search 
                        placeholder="商品条码"
                        style={{width:250,marginRight:10}}
                        onChange={this.handleChangeItems.bind(this,'goodsSn')}     
                        onSearch={this.handleSearchItems.bind(this,'goodsSn')}     
                        value={goodsSn} 
                        suffix={goodsSn?<ClearIcon 
                                handleClear={this.handleClear.bind(this,"goodsSn")}
                        />:""}
                    />
                    <Input.Search 
                        placeholder="商品名称/品牌名称"
                        style={{width:250,marginRight:10}}
                        onChange={this.handleChangeItems.bind(this,'goodsKeywords')}     
                        onSearch={this.handleSearchItems.bind(this,'goodsKeywords')}     
                        value={goodsKeywords} 
                        suffix={goodsKeywords?<ClearIcon 
                                handleClear={this.handleClear.bind(this,"goodsKeywords")}
                        />:""}
                    />
                    <AutoComplete
                        dataSource={supplierSuggest && supplierSuggest.map((suggest) => {
                            return (
                            <Select.Option value={suggest.id.toString()}>{suggest.name}</Select.Option>
                            );
                        })}
                        onSelect={this.handleSelectSupplier.bind(this)}
                        onSearch={this.handleChangeSupplier.bind(this)}
                        className={globalStyles['input-sift']}
                        allowClear
                        dropdownMatchSelectWidth={false}
                        placeholder="请输入供应商"
                        >
                    </AutoComplete>
                    <Select
                        placeholder="采购员"
                        style={{width:200,marginRight:10}}
                        onChange={this.handleSearchItems.bind(this,'purchaser')}    
                        allowClear
                        dropdownMatchSelectWidth={false}
                        >
                        <Select.Option value={""}>全部</Select.Option>
                        {
                            Object.keys(purchaserMap).map(key => (
                            <Select.Option value={key}>{purchaserMap[key]}</Select.Option>
                            ))
                        }
                    </Select>
                    审核时间：
                    <DatePicker.RangePicker   
                        style={{width:250,marginRight:10}}
                        onChange={this.handleChangeDate}                  
                    />
                </Row>
                <Table
                bordered
                loading={isTableLoading}
                dataSource={brandPolicyList}
                columns={columns}
                rowKey={record => record.id}
                className={globalStyles.tablestyle}
                pagination={{
                    total,
                    showTotal:total => `共 ${total} 个结果`,
                    pageSizeOptions:["20","30","40","50","100"],
                    current:currentPage,
                    pageSize,
                    onChange: this.handleChangePage.bind(this),
                    onShowSizeChange: this.handleChangePageSize.bind(this),
                    showSizeChanger: true,
                    showQuickJumper: false,
                }}
                />
            </Card>
        </PageHeaderLayout>
       )
   }

}
