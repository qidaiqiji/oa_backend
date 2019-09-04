import React, { PureComponent } from 'react';
import globalStyles from '../../assets/style/global.less';
import styles from './SupplierManagementList.less';
import { connect } from 'dva';
import { Link } from 'dva/router';
import moment from 'moment';
import ClearIcon from '../../components/ClearIcon';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {
  Card,
  Row,
  Col,
  Select,
  Input,
  Table,
  Button,
  DatePicker,
  Tooltip,
  Icon,
} from 'antd';

@connect(state => ({
    supplierManagementList: state.supplierManagementList,
}))
export default class SupplierManagementList extends PureComponent{
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
           type: 'supplierManagementList/getList',
        }); 
        dispatch({
            type: 'supplierManagementList/getConfig',
        });      
    }
    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch({
          type: 'supplierManagementList/unmount',
        });
    }
    /**-----------搜索框的值发生改变-----------*/
    handleChangeSearchKeywords(type,e) {
        const { dispatch } = this.props;
        dispatch({
            type: 'supplierManagementList/updatePageReducer',
            payload: {
                [type]: e.target.value,
            },
        })
    }
    /**----------------------搜索共用一个方法-------------------- */
    handleSearchMethods(type,e,dataStrings) {
        const { dispatch,supplierManagementList } = this.props;
        switch (type) {
            case "contractExpireDate":
            dispatch({
                type: 'supplierManagementList/getList',
                payload: {
                  contractExpireDateStart: dataStrings[0],
                  contractExpireDateEnd: dataStrings[1],
                  curPage:1,
                },
              });
            break;
            default:
            dispatch({
                type: 'supplierManagementList/getList',
                payload: {
                  [type]:e,
                  curPage:1,
                },
              });
            break;
        }   
    }
    /**---------------换页回调-------------- */
    handleChangePage=(curPage)=>{
        const { dispatch  } = this.props;
        dispatch({
            type: 'supplierManagementList/getList',
            payload: {
                curPage,
            },
        });

    }
    handleChangePageSize=(_,size)=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'supplierManagementList/getList',
            payload: {
                curPage:1,
                size,
            },
        });
    }
    handleClear=type=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'supplierManagementList/getList',
            payload: {
                [type]:"",
            },
        });
    }
    render() {
        const {
            supplierManagementList:{
                actionList,
                suppliers,
                contractExpireDateStart,
                contractExpireDateEnd,
                isTableLoading,
                total,
                statusMap,
                supplierPropertyMap,
                curPage,
                size,
                propertyMap,
                payMethodMap,
                supplierStatusMap,
                brandStatusMap,
                purchaserMap,
                brandListMap,
                supplierKeyWords,
                contact,
                goodsKeyWords,
                identifierKeyWords,
                supplierLevelMap,
                supplierGoodsPayMethodMap,

            },
           
        } = this.props;  
       
        /*---------------------------第一层表格的数据------------------------------ */
        const columns = [
            {
                title: '编码ID',
                dataIndex: 'id',
                key: 'id',
                render: (id) => {
                    return (
                      <Link
                        to={`/purchase/supplier-management/supplier-check-list/supplier-check-detail/${id}`}
                      >
                        <span>{id}</span>
                      </Link>
                    );
                },
            },
            {
                title: '供应商审核状态',
                dataIndex: 'status',
                key: 'status',
                render:(status,record)=>{
                    return <div>
                        <span style={{color:status.color}}>{supplierStatusMap[status.status]}</span>
                        <p style={{margin:0}}>
                        {
                            record.supplierTag.map(item=>{
                                return <Tooltip title={item.remark}><span className={styles.tag} style={{background:item.color}}>{item.name}</span></Tooltip>
                            })
                        }
                        </p>
                        
                    </div>
                }
            },
            {
                title: '代理品牌审核状态',
                dataIndex: 'brandStatus',
                key: 'brandStatus',
                render:(brandStatus, record)=>{
                    return <div>
                        <span style={{color:brandStatus.color}}>{brandStatusMap[brandStatus.status]}</span>
                        <p style={{margin:0}}>
                        {
                            record.brandTag.map(item=>{
                                return <Tooltip title={item.brandRemark}><span className={styles.tag} style={{background:item.color}}>{item.name}</span></Tooltip>
                            })
                        }
                        </p>
                    </div>
                }
            },
            {
                title: '供应商名称',
                dataIndex: 'name',
                key: 'name',
                width:200,
                render: (name, record) => {
                    return (
                      <Link
                        to={`/purchase/supplier-management/supplier-check-list/supplier-check-detail/${record.id}`}
                      >
                        <span>{name}</span>
                      </Link>
                    );
                },
            },
            {
                title: '联系人',
                dataIndex: 'contact',
                key: 'contact',
            }, 
            {
                title: '联系方式',
                key: 'mobile',
                dataIndex: 'mobile',
                width:150,
            }, 
            {
                title: '供应商性质',
                key: 'supplierProperty',
                dataIndex: 'supplierProperty',
                width:200,
            },
            {
                title: '常规合同编号',
                key: 'contractNo',
                dataIndex: 'contractNo',
                width:300,
                render:(contractNo)=>{
                    return <p style={{width:270,margin:0}} className={globalStyles.twoLine}>
                            {contractNo}
                         </p>
                   
                }
            },
            {
                title: '合同到期时间',
                key: 'contractExpireDate',
                dataIndex: 'contractExpireDate',    
                render:(_,record)=>{
                    return <span>{record.contractExpireDateEnd}</span>
                }
            },
           
            {
                title: '供应商备注',
                key: 'remark',
                dataIndex: 'remark',
                width:120,
                render:(remark)=>{
                    return <Tooltip title={remark} placement={"topLeft"}>
                    <p style={{width:120,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",margin:0}}>{remark}</p>
                    </Tooltip>
                }
            },

        ];
        /*------------------------第二层表格的数据----------------------- */
        const expandTable = (record) =>{
            const goodsColumns = [
                {
                    title: '品牌名称',
                    dataIndex: 'brandName',
                    key: 'brandName',
                }, 
                {
                    title: '主辅等级',
                    dataIndex: 'supplierLevel',
                    key: 'supplierLevel',
                    render:(supplierLevel)=>{
                        return <span>{supplierLevelMap[supplierLevel]}</span>
                    }
                }, 
                
                {
                    title: '入驻缴纳金额',
                    key: 'payMoney',
                    dataIndex: 'payMoney',
                    
                }, 
                {
                    title: '品牌返利政策',
                    key: 'brandPolicy',
                    dataIndex: 'brandPolicy',
                    width:300,
                    render:(brandPolicy)=>{
                        return <Tooltip title={brandPolicy}>
                            <p style={{width:300,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',margin:0}}>{brandPolicy}</p>
                        </Tooltip>

                    }
                
                },
                {
                    title: '采购员',
                    key: 'purchaser',
                    dataIndex: 'purchaser',
                    render:(purchaser)=>{
                        return <span>{purchaserMap[purchaser]}</span>
                    }
                
                },
                {
                    title: '品牌备注',
                    key: 'remark',
                    dataIndex: 'remark',
                    width:120,
                    render:(remark)=>{
                        return <Tooltip title={remark} placement={"topLeft"}>
                        <p style={{width:120,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",margin:0}}>{remark}</p>
                        </Tooltip>
                    }
                
                }
                ];
            return (
                <Table
                  columns={goodsColumns}
                  dataSource={record.brandList}
                  expandedRowRender={expandTable2}
                  rowKey={record => record.id}
                  className={globalStyles.tablestyle}
                  bordered
                  pagination={false}
                />
              ); 
          }
        /*---------------------------第三层表格的数据-------------------------------- */
          const expandTable2 = (record) =>{
            const goodsColumns2 = [
                {
                    title: '主图',
                    dataIndex: 'img',
                    key: 'img',
                    render: (img) => {
                        return <img  src={img} style={{width:50}}/>
                    },
                }, 
                {
                    title: '商品名称',
                    dataIndex: 'goodsName',
                    key: 'goodsName',
                }, 
                {
                    title: '商品条码',
                    dataIndex: 'goodsSn',
                    key: 'goodsSn',
                }, 
                
                {
                    title: '零售价',
                    key: 'marketPrice',
                    dataIndex: 'marketPrice',
                    width:80,
                    
                }, 
                {
                    title: '平台售价',
                    key: 'shopPrice',
                    dataIndex: 'shopPrice',
                    width:80,
                
                },
                {
                    title: '含税进价',
                    dataIndex: 'purchaseTaxPrice',
                    key: 'purchaseTaxPrice',
                }, 
                {
                    title: '含税折扣',
                    dataIndex: 'purchaseTaxDiscount',
                    key: 'purchaseTaxDiscount',
                }, 
                {
                    title: '未税进价',
                    dataIndex: 'purchasePrice',
                    key: 'purchasePrice',
                }, 
                {
                    title: '未税折扣',
                    key: 'purchaseDiscount',
                    dataIndex: 'purchaseDiscount',
                    
                }, 
                {
                    title: '返利后进价',
                    dataIndex: 'rebatePurchasePrice',
                    key: 'rebatePurchasePrice',
                }, 
                {
                    title: '结算方式',
                    key: 'payMethod',
                    dataIndex: 'payMethod',
                    render:(payMethod)=>{
                        return <span>{supplierGoodsPayMethodMap[payMethod]}</span>
                    }
                
                },
                
                {
                    title: '控价要求',
                    dataIndex: 'requestPrice',
                    key: 'requestPrice',
                }, 
                
                {
                    title: '运费政策',
                    key: 'shippingPolicy',
                    dataIndex: 'shippingPolicy',
                
                },
                {
                    title: '发货地',
                    key: 'shippingPlace',
                    dataIndex: 'shippingPlace',
                    
                }, 
                {
                    title: '条码备注',
                    key: 'goodsRemark',
                    dataIndex: 'goodsRemark',
                    width:120,
                    render:(goodsRemark)=>{
                        return <Tooltip title={goodsRemark} placement={"topLeft"}>
                        <p style={{width:120,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",margin:0}}>{goodsRemark}</p>
                        </Tooltip>
                    }
                
                },
                ];
            return (
                <Table
                  columns={goodsColumns2}
                  dataSource={record.goodsList}
                  rowKey={record => record.id}
                  bordered
                  pagination={false}
                />
              ); 
          }
        return(
            <PageHeaderLayout title="供应商管理列表">
                <Card>
                <Row>
                    <Col span={20}>
                        <Input.Search 
                        placeholder="请输入供应商名称/编码ID"
                        style={{width:250,marginRight:10}}
                        onChange={this.handleChangeSearchKeywords.bind(this,'supplierKeyWords')}     
                        onSearch={this.handleSearchMethods.bind(this,'supplierKeyWords')}     
                        value={supplierKeyWords} 
                        suffix={supplierKeyWords?<ClearIcon 
                                handleClear={this.handleClear.bind(this,"supplierKeyWords")}
                        />:""}
                        />
                        <Input.Search 
                        placeholder="请输入联系人/联系方式"
                        className={globalStyles['input-sift']}     
                        onChange={this.handleChangeSearchKeywords.bind(this,'contact')}    
                        onSearch={this.handleSearchMethods.bind(this,'contact')} 
                        value={contact} 
                        suffix={contact?<ClearIcon 
                            handleClear={this.handleClear.bind(this,"contact")}
                        />:""}                  
                        />
                        <Input.Search 
                        placeholder="请输入商品名称/条码"
                        className={globalStyles['input-sift']}     
                        onChange={this.handleChangeSearchKeywords.bind(this,'goodsKeyWords')}    
                        onSearch={this.handleSearchMethods.bind(this,'goodsKeyWords')}  
                        value={goodsKeyWords} 
                        suffix={goodsKeyWords?<ClearIcon 
                            handleClear={this.handleClear.bind(this,"goodsKeyWords")}
                        />:""}                    
                        />
                        <Select
                        placeholder="请选择品牌名"
                        style={{width:300,marginRight:10}}
                        onChange={this.handleSearchMethods.bind(this,'brandName')}          
                        showSearch
                        allowClear
                        optionFilterProp="children"
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        dropdownMatchSelectWidth={false}
                        >
                        <Select.Option value={""}>全部</Select.Option>
                        {
                            Object.keys(brandListMap).map(key => (
                            <Select.Option value={key}>{brandListMap[key]}</Select.Option>
                            ))
                        }
                        </Select>
                        <Input.Search 
                        placeholder="常规合同编号/授权编号"
                        className={globalStyles['input-sift']}    
                        onChange={this.handleChangeSearchKeywords.bind(this,'identifierKeyWords')}   
                        onSearch={this.handleSearchMethods.bind(this,'identifierKeyWords')}    
                        value={identifierKeyWords} 
                        suffix={identifierKeyWords?<ClearIcon 
                            handleClear={this.handleClear.bind(this,"identifierKeyWords")}
                        />:""}                   
                        />
                    </Col>
                    <Col span={4}>
                        {
                            actionList?
                            actionList.map(actionInfo=>{
                                switch (actionInfo.type) {
                                    case 1:
                                    return (
                                        <Link to={actionInfo.url}>
                                            <Button style={{ marginLeft: 10 }}>{actionInfo.name}</Button>
                                        </Link>
                                    );
                                    case 2:
                                    return (
                                        <a
                                            href={actionInfo.url}
                                            target="_blank"
                                        >
                                            <Button type="primary" style={{ marginLeft: 10 }}>{actionInfo.name}</Button>
                                        </a>
                                    );
                                    case 3:
                                    return (
                                        <a
                                            href={actionInfo.url}
                                            target="_blank"
                                        >
                                            <Button type="primary" style={{ marginLeft: 10 }}>{actionInfo.name}</Button>
                                        </a>
                                    );
                                }
                            }):null
                        }
                    </Col>
                    {/* <Col span={2}> */}
                        <Link to="/purchase/supplier-management/supplier-management-list/supplier-add">
                            <Button icon="plus" type="primary" style={{marginLeft: 10}}>
                            新增
                            </Button>
                        </Link>
                    {/* </Col> */}
                    </Row>
                    <Row style={{marginBottom:10}}>                    
                        {/* <Col span={6}> */}
                        合同到期时间：
                        <DatePicker.RangePicker   
                        style={{width:250,marginRight:10}}
                        value={[contractExpireDateStart ? moment(contractExpireDateStart, 'YYYY-MM-DD') : '',contractExpireDateEnd ? moment(contractExpireDateEnd, 'YYYY-MM-DD') : '']}
                        onChange={this.handleSearchMethods.bind(this,'contractExpireDate')}                  
                        />
                        {/* </Col> */}
                        <Select
                        placeholder="供应商性质"
                        style={{width:200,marginRight:10}} 
                        onChange={this.handleSearchMethods.bind(this,'supplierProperty')}
                        allowClear
                        >
                            <Select.Option value="">{"全部"}</Select.Option>
                            {
                                Object.keys(supplierPropertyMap).map(key => (
                                    <Select.Option value={key}>{supplierPropertyMap[key]}</Select.Option>
                                ))
                            }
                        </Select>
                        <Select
                        placeholder="按采购员筛选"
                        style={{width:200,marginRight:10}} 
                        onChange={this.handleSearchMethods.bind(this,'purchaser')}
                        dropdownMatchSelectWidth={false}
                        allowClear
                        >
                            <Select.Option value="">{"全部"}</Select.Option>
                            {
                                Object.keys(purchaserMap).map(key => (
                                    <Select.Option value={key}>{purchaserMap[key]}</Select.Option>
                                ))
                            }
                        </Select>
                        <Select
                        placeholder="供应商审核状态"
                        style={{width:200,marginRight:10}} 
                        onChange={this.handleSearchMethods.bind(this,'status')}
                        allowClear
                        >
                            <Select.Option value="">{"全部"}</Select.Option>
                            {
                                Object.keys(supplierStatusMap).map(key => (
                                    <Select.Option value={key}>{supplierStatusMap[key]}</Select.Option>
                                ))
                            }
                        </Select>
                        <Select
                        placeholder="代理品牌审核状态"
                        style={{width:200,marginRight:10}} 
                        onChange={this.handleSearchMethods.bind(this,'brandStatus')}
                        allowClear
                        >
                            <Select.Option value="">{"全部"}</Select.Option>
                            {
                                Object.keys(brandStatusMap).map(key => (
                                    <Select.Option value={key}>{brandStatusMap[key]}</Select.Option>
                                ))
                            }
                        </Select>
                    </Row>
                    <Table
                    columns={columns}
                    dataSource={suppliers}
                    expandedRowRender={expandTable}
                    rowKey={record => record.id}
                    onExpand={this.onExpand}
                    bordered
                    loading={isTableLoading}
                    className={globalStyles.tablestyle}
                    pagination={{
                        current: curPage,
                        pageSize:size,
                        onChange: this.handleChangePage.bind(this),
                        onShowSizeChange: this.handleChangePageSize.bind(this),
                        showSizeChanger: true,
                        showQuickJumper: false,
                        total,
                        showTotal:total => `共 ${total} 个结果`,
                      }}
                    />
                </Card>
            </PageHeaderLayout>
        )
    }

}
