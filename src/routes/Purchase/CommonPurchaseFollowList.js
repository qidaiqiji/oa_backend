import React, { PureComponent } from 'react';
import globalStyles from '../../assets/style/global.less';
import { connect } from 'dva';
import uniqBy from 'lodash/uniqBy';
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {
  Modal,
  Card,
  Row,
  Col,
  Select,
  Input,
  Table,
  Button,
  Tabs,
  DatePicker,
  Popover,
  Popconfirm,
  AutoComplete,
  Tooltip,
  Icon
} from 'antd';
import { Link } from 'dva/router';
import styles from './CommonPurchaseFollowList.less';
const TabPane = Tabs.TabPane;
const Search = Input.Search;
import Debounce from 'lodash-decorators/debounce';
import ClearIcon from '../../components/ClearIcon';
const { RangePicker } = DatePicker;
const { Option } = Select;
const confirm = Modal.confirm;

@connect(state => ({
    commonPurchaseFollowList: state.commonPurchaseFollowList,
}))
export default class commonPurchaseFollowList extends PureComponent{
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
          type: 'commonPurchaseFollowList/getCommonList',
        });       
        dispatch({
            type: 'commonPurchaseFollowList/getPurchaseList',
        });
        dispatch({
            type: 'commonPurchaseFollowList/getConfig',
        });
    }
    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch({
          type: 'commonPurchaseFollowList/unmount',
        });
    }
/**-------------------切换选中的tab页-------------------- */ 
    changeSelectedTabs=(Value)=>{
        const { dispatch } = this.props;
        dispatch({
            type:'commonPurchaseFollowList/updatePageReducer',
            payload: {
                selectedTab: Value,
            }
        })
    }  
    handleChangeSearchItem=(type,e)=>{
        const { dispatch } = this.props;
        dispatch({
            type:'commonPurchaseFollowList/changeSearchItem',
            payload: {
                [type]:e.target.value,
            }
        })
    }
/**----------------------搜索共用一个方法-------------------- */
    handleSearchMethods(type,e,dataStrings) {
        const { dispatch,commonPurchaseFollowList  } = this.props;
        const { selectedTab } = commonPurchaseFollowList;
        switch (type) {
            case "followStatus":
            case "purchaser":
            case "keywords":
            case "purchaseOrderId":
            case "supplierId":
            case "sellerId":
            case "consignee":
            case "daifaFollowStatus":
            dispatch({
                type: 'commonPurchaseFollowList/handleSearchResult',
                payload: {
                  [type]: e,
                  selectedTab,
                  curPage:1,
                },
              });
            break;
            case "purchaseDate":
            dispatch({
                type: 'commonPurchaseFollowList/handleSearchResult',
                payload: {
                  expectShippingDateStart: dataStrings[0],
                  expectShippingDateEnd: dataStrings[1],
                  selectedTab,
                  curPage:1,
                },
              });
            break;
            case "arriveDate":
            dispatch({
                type: 'commonPurchaseFollowList/handleSearchResult',
                payload: {
                    expectReceivedDateStart: dataStrings[0],
                    expectReceivedDateEnd: dataStrings[1],
                    selectedTab,
                    curPage:1,
                },
              });
            break;
            case "createTime":
            dispatch({
                type: 'commonPurchaseFollowList/handleSearchResult',
                payload: {
                    createTimeStart: dataStrings[0],
                    createTimeEnd: dataStrings[1],
                    selectedTab,
                    curPage:1,
                },
              });
            break;
        }       

    }
/**---------------换页回调-------------- */
    handleChangePage=(curPage)=>{
        const { dispatch,commonPurchaseFollowList  } = this.props;
        const { selectedTab } = commonPurchaseFollowList;
        dispatch({
            type: 'commonPurchaseFollowList/handleSearchResult',
            payload: {
                curPage,
                selectedTab,
            },
        });

    }
    handleChangePageSize=(_,pageSize)=>{
        const { dispatch,commonPurchaseFollowList  } = this.props;
        const { selectedTab } = commonPurchaseFollowList;
        dispatch({
            type: 'commonPurchaseFollowList/handleSearchResult',
            payload: {
                curPage:1,
                selectedTab,
                pageSize,
            },
        });

    }
/**-------------------点击保存提交物流跟进信息--------------- */
    handleSubmitLogisticsInfo=()=>{
        const { dispatch, commonPurchaseFollowList } = this.props;
        const { selectedPurchaseOrder } = commonPurchaseFollowList;
        const { id } = selectedPurchaseOrder;
        dispatch({
            type:'commonPurchaseFollowList/saveLogisticsInfo',
            payload: {
                purchaseOrderId: id,
            }
        })
    }
/**-------------onChange的时候把填写的信息保存起来-------------- */
    handleSaveLogisticsInfo(type,e,dateString) {
        const { dispatch } = this.props;
        switch (type) {
            case "shippingNo":
            case "shippingCompany":
            case "shippingPlace":
            case "followRemark":
            dispatch({
                type: 'commonPurchaseFollowList/updatePageReducer',
                payload: {
                  [type]: e.target.value,
                },
              });
            break;
            case "shippingDate":
            dispatch({
                type: 'commonPurchaseFollowList/updatePageReducer',
                payload: {
                    [type]: dateString
                },
              });
            break;
            case "expectArrivingDate":
            dispatch({
                type: 'commonPurchaseFollowList/updatePageReducer',
                payload: {
                    [type]: dateString
                },
              });
            break;
            default:
            dispatch({
                type: 'commonPurchaseFollowList/updatePageReducer',
                    payload: {
                        [type]: e
                    },
                });
            break;
        }   
        
    }
/**--------------------更新物流跟进信息--------------------- */
    handleSaveEditLogisticsInfo=(purchaseShippingId)=>{
        const { dispatch, commonPurchaseFollowList } = this.props;
        const {  followInfoDetail } = commonPurchaseFollowList;
        followInfoDetail.map(item=>{
            if(+item.purchaseShippingId === +purchaseShippingId) {
                if(!item.isSaved) {
                    item.isSaved = !item.isSaved;
                    dispatch({
                        type:'commonPurchaseFollowList/updatePageReducer',
                        payload: {
                            followInfoDetail,
                        }
                    })
                }else{
                    item.isSaved = !item.isSaved;
                    dispatch({
                        type:'commonPurchaseFollowList/editLogisticsInfo',
                        payload: {
                            editItem:item,
                            followInfoDetail,
                        }
                    })
                }
                
            }
        })
    }
    /**--------------更新每一项的物流信息的操作--------------- */
    handleChangeLogisticsInfo(type,id,e,dateString) {
         const { dispatch } = this.props;
            switch(type) {
                    case "shippingNo":
                    case "shippingCompany":
                    case "shippingPlace":
                    case "followRemark":
                    dispatch({
                    type: 'commonPurchaseFollowList/changeLogisticsInfo',
                    payload: {
                        [type]: e.target.value,
                        id,
                    },
                    }); 
                break;
                case "shippingDate":
                dispatch({
                    type: 'commonPurchaseFollowList/changeLogisticsInfo',
                    payload: {
                        [type]: dateString,
                        id,
                    },
                }); 
                break;
                case "expectArrivingDate":
                dispatch({
                    type: 'commonPurchaseFollowList/changeLogisticsInfo',
                    payload: {
                        [type]: dateString,
                        id,
                    },
                }); 
                break;
                default:
                dispatch({
                    type: 'commonPurchaseFollowList/changeLogisticsInfo',
                    payload: {
                        [type]: e,
                        id,
                    },
                }); 
                break;
            }   
    }

/**-----------------点击跟进物流的操作--------------------- */ 
    handleFollowLogisticsBtn=(selectedPurchaseOrder)=> {
        const { dispatch, commonPurchaseFollowList } = this.props;
        const { followInfoDetail, purchaseOrderId } = selectedPurchaseOrder;
        const { selectedTab } = commonPurchaseFollowList;
        let orderSnMap = [];
        if(selectedTab == "2") {
            selectedPurchaseOrder.goodsList.map(item=>{
                orderSnMap.push({consignee:item.consignee,orderId:item.orderId,orderSn:item.orderSn})
            })
        }
        orderSnMap = uniqBy(orderSnMap,'orderId')
        dispatch({
            type:'commonPurchaseFollowList/FollowLogistic',
            payload: {
                isShowLogisticsModal: true,
                followInfoDetail:selectedPurchaseOrder.followInfoDetail,
                selectedTab,
                selectedPurchaseOrder,
                purchaseOrderId,
                orderSnMap,
                // orderId:''
            }
        })
    }
/**-------------点击弹窗的取消按钮弹窗关闭------------------ */ 
    handleCloseModal=()=>{
        const { dispatch, commonPurchaseFollowList } = this.props;
        const { selectedTab } = commonPurchaseFollowList;
        if(+selectedTab === 1) {
            dispatch({
                type:'commonPurchaseFollowList/getCommonList',
                payload: {
                    isShowLogisticsModal: false,
                    shippingCompany:'',
                    shippingPlace: '',
                    shippingDate:'',
                    expectArrivingDate:'',
                    orderId:''
                }
            })
        }else{
            dispatch({
                type:'commonPurchaseFollowList/getPurchaseList',
                payload: {
                    isShowLogisticsModal: false,
                    shippingCompany:'',
                    shippingPlace: '',
                    shippingDate:'',
                    expectArrivingDate:'',
                }
            })
        }
       
    }
    
/**----------------点击签收的时候更改签收状态-----------------*/ 
    handleLogisticsSign=(purchaseShippingId)=>{
        const { dispatch, commonPurchaseFollowList } = this.props;
        const { followInfoDetail } = commonPurchaseFollowList;
        followInfoDetail.map(item=>{
            if(+item.purchaseShippingId === +purchaseShippingId) {
                if(!+item.status) {
                    dispatch({
                        type:'commonPurchaseFollowList/handleSign',
                        payload: {
                            purchaseShippingId,
                        }
                    }) 
                }else{
                    dispatch({
                        type:'commonPurchaseFollowList/cancelSign',
                        payload: {
                            purchaseShippingId,
                        }
                    })
        
                }  
            }
        }) 
    }
/* ----------------点击删除的时候删除相应的物流信息-------------*/
    handleDeleteLogisticInfo=(purchaseShippingId)=>{
        const { dispatch } = this.props;
        dispatch({
            type:'commonPurchaseFollowList/handleDelete',
            payload: {
                purchaseShippingId,
            }
        }) 
    }
/**--------------点击全部签收的时候弹出modal------------- */
    handleShowAllSignModal=(purchaseOrderId)=>{
        const { dispatch } = this.props;
        dispatch({
            type:'commonPurchaseFollowList/updatePageReducer',
            payload: {
                isShowAllSignModal: true,
                purchaseOrderId,
            }
        }) 
    }
/**-------------确认全部签收----------- */
    handleConfirmAllSign=()=>{
        const { dispatch, commonPurchaseFollowList } = this.props;
        const { purchaseOrderId } = commonPurchaseFollowList;
        dispatch({
            type:'commonPurchaseFollowList/confirmAllSign',
            payload: {
                isShowAllSignModal: false,
                purchaseOrderId,
            }
        }) 
    }
/**---------------取消全部签收------------ */
    handleCancelAllSign=()=>{
        const { dispatch } = this.props;
        dispatch({
            type:'commonPurchaseFollowList/updatePageReducer',
            payload: {
                isShowAllSignModal: false,
            }
        })
    }
    // 选择供应商
    handleSelectSupplier(supplierId, option) {
        const { dispatch ,commonPurchaseFollowList} = this.props;
        const { children } = option.props;
        const { selectedTab } = commonPurchaseFollowList;
        dispatch({
        type: 'commonPurchaseFollowList/handleSearchResult',
        payload: {
            curPage: 1,
            supplierId,
            supplierSearchText: children,
            selectedTab,
        },
        });
    }
  // 搜索供应商
  @Debounce(200)
    handleChangeSupplier(text) {
        const { dispatch } = this.props;
        dispatch({
            type: 'commonPurchaseFollowList/changeSupplier',
            payload: {
                supplierSearchText: text,
            },
        });
    }
// ------修改备注---
    changePurchaseReamrk(id,e) {
        const { dispatch, commonPurchaseFollowList } = this.props; 
        const { selectedTab } = commonPurchaseFollowList;
        dispatch({
            type: 'commonPurchaseFollowList/changeReamrk',
            payload: {
                id,
                remark:e.target.value,
                selectedTab,
            },
        });
    }
// ------提交备注-----
submitPurchaseReamrk(id) {
        const { dispatch, commonPurchaseFollowList } = this.props; 
        const {selectedTab,purchaseOrderList,purchaseOrderList2} = commonPurchaseFollowList;
        let remark = "";
        if(+selectedTab === 1) {
            purchaseOrderList.map(item=>{
                item.goodsList.map(item2=>{
                    if(+item2.id === id) {
                        remark = item2.remark;
                    }
                })
            })
            
        }else if(+selectedTab === 2) {
            purchaseOrderList2.map(item=>{
                item.goodsList.map(item2=>{
                    if(+item2.id === id) {
                        remark = item2.remark;
                    }
                })
            })
        }
        dispatch({
            type: 'commonPurchaseFollowList/submitPurchaseReamrk',
            payload: {
                id,
                remark,
            },
        });
    }
    handleClear=(type)=>{
        const { dispatch } = this.props; 
        dispatch({
            type: 'commonPurchaseFollowList/handleSearchResult',
            payload: {
               [type]:""
            },
        });
    }
    render() {
        const {
            commonPurchaseFollowList:{
                isShowLogisticsModal,
                actionList,
                actionList2,
                purchaseOrderList,
                purchaseOrderList2,
                reqKeyList,
                followInfoDetail,
                shippingNo,
                shippingCompany,
                shippingPlace,
                shippingDate,
                followRemark,
                isShowAllSignModal,
                total,
                purchaserMap,
                sellerMap,
                total2,
                isTableLoading,
                supplierSuggest,
                supplierSearchText,
                expectArrivingDate,
                stockFollowPurchaseOrderMap,
                daifaFollowPurchaseOrderMap,
                selectedTab,
                orderSnMap,
                orderId
            }            
        } = this.props; 
/*-----------------------------------------常规采购列表数据--------------------------------------------------- */
        // 外层表格数据
        const columns = [
            {
                title: '跟进状态',
                key: 'followStatus',
                dataIndex: 'followStatus',
                render:(followStatus,record)=>{
                    return <span>
                        {
                            stockFollowPurchaseOrderMap[followStatus]
                        }
                    </span>
                }
            
            },
            {
                title: '采购单号',
                dataIndex: 'id',
                key: 'id',
                render:(id)=>{
                    return <Link to={`/purchase/purchase-order-management/common-purchase-list/common-purchase-detail/${id}`}>{id}</Link>
                }
            }, 
            {
                title: '采购时间',
                dataIndex: 'createTime',
                key: 'createTime',
                width:200,
            },
                        
            {
                title: '采购数量',
                dataIndex: 'purchaseNum',
                key: 'purchaseNum',
            }, 
            {
                title: '预计发货时间',
                key: 'expectShippingDate',
                dataIndex: 'expectShippingDate',
                
            }, 
            {
                title: '供应商',
                key: 'supplier',
                dataIndex: 'supplier',
            
            },
            
            {
                title: '采购员',
                key: 'purchaser',
                dataIndex: 'purchaser',
                width:200,            
            },
            
            {
                title: '跟进信息',
                key: 'followInfo',
                dataIndex: 'followInfo',
                width:300,
                render:(_,record)=>{
                    return (
                        <Popover 
                            overlayStyle={{width:800}}
                            placement="left"
                            content={
                                record.followInfoDetail.map(followInfos=>{
                                    return <div style={{marginTop:10}} key={followInfos.purchaseShippingId} className={styles.followInfo}>
                                        <p><span>操作时间:</span>{followInfos.operateTime}</p>
                                        <p><span>物流单号:</span>{followInfos.shippingNo}</p>
                                        <p><span>物流公司:</span>{followInfos.shippingCompany}</p>
                                        <p><span>发货时间:</span>{followInfos.shippingDate}</p>
                                        <p><span>预计到货时间:</span>{followInfos.expectArrivingDate}</p>
                                        <p><span>发货地:</span>{followInfos.shippingPlace}</p>
                                        <p style={{marginBottom:10}}><span>跟进备注:</span>{followInfos.followRemark}</p>
                                        <hr />
                                    </div>
                                })
                            } 
                            title="跟进物流信息"
                            >
                            {
                                record.followInfoDetail&&record.followInfoDetail.map(item=>{
                                    return <p style={{margin:0}} key={item.purchaseShippingId}>
                                        <span style={{display:"inlineBlock",marginRight:20}}>{item.shippingNo}</span>
                                        <span>{item.shippingCompany}</span>
                                        </p>
                                })
                            }
                        </Popover>
                    );
                }
            
            },
            {
                title: '操作',
                render:(_,record)=> {
                    return (
                        +record.isAllSign===1?null:(<Button type="primary" onClick = {this.handleFollowLogisticsBtn.bind(this,record)}>跟进物流</Button>)
                    )
                }            
            }
        ];
            // 嵌套表格数据
          const expandTable = (order) =>{
            const goodsColumns = [
                {
                    title: '条码',
                    dataIndex: 'goodsSn',
                    key: 'goodsSn',
                }, 
                {
                    title: '商品名称',
                    dataIndex: 'goodsName',
                    key: 'goodsName',
                }, 
                {
                    title: '采购数量',
                    dataIndex: 'number',
                    key: 'number',
                }, 
                {
                    title: '已入库数量',
                    dataIndex: 'storeNum',
                    key: 'storeNum',
                },
                {
                    title: '待入库数量',
                    dataIndex: 'waitStoreNum',
                    key: 'waitStoreNum',
                },
                {
                    title: '入库前售后数量',
                    dataIndex: 'waitBackNum',
                    key: 'waitBackNum',
                },
                {
                    title: '入库后售后数量',
                    dataIndex: 'storeBackNum',
                    key: 'storeBackNum',
                },
                {
                    title: '供应商运费政策',
                    key: 'shippingPolicy',
                    dataIndex: 'shippingPolicy',
                
                },
                {
                    title: '备注',
                    key: 'remark',
                    dataIndex: 'remark',
                    render:(remark,record)=>{
                        return <Input.TextArea 
                            value={remark}
                            onChange={this.changePurchaseReamrk.bind(this,record.id)}
                            onBlur={this.submitPurchaseReamrk.bind(this,record.id)}
                            />
                    }
                
                }
                ];
            return (
                <Table
                  columns={goodsColumns}
                  dataSource={order.goodsList}
                  bordered
                  pagination={false}
                  rowKey={record=>record.id}
                />
              ); 
          }
/*-----------------------------------------销售采购列表数据--------------------------------------------------- */
        // 外层表格数据
        const columns2 = [
            {
                title: '跟进状态',
                key: 'daifaFollowStatus',
                dataIndex: 'daifaFollowStatus',
                width:150,
                render:(daifaFollowStatus,record)=>{
                    return <span>
                    {
                        daifaFollowPurchaseOrderMap[daifaFollowStatus]
                    }
                    </span>
                }
            
            },
            {
                title: '采购单号',
                dataIndex: 'id',
                key: 'id',
                width:100,
                render:(id)=>{
                    return <Link to={`/purchase/purchase-order-management/sale-purchase/sale-purchase-order-list/sale-purchase-order-detail/${id}`}>{id}</Link>;
                }
            }, 
            {
                title: '下单时间',
                dataIndex: 'createTime',
                key: 'createTime',
                width:110,
            },
            {
                title: '收货人信息',
                dataIndex: 'consignee',
                key: 'consignee',
                width:100,
                render:(consignee,record)=>{
                    return (
                        consignee.map((item)=>{
                          return <Tooltip title={record.consigneeAddress.map((consignee,index)=>(
                              <p style={{margin: 0}} key={index}>{consignee}</p>
                          ))}>
                            <p style={{margin: 0, width:100, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>{item}</p>
                          </Tooltip> 
                        })
                    );
                }
            },
            {
                title: '采购数量',
                dataIndex: 'purchaseNum',
                key: 'purchaseNum',
            }, 
            {
                title: '预计发货时间',
                key: 'expectShippingDate',
                dataIndex: 'expectShippingDate',  
                width:110              
            }, 
            {
                title: '供应商',
                key: 'supplier',
                dataIndex: 'supplier',
            
            },
            {
                title: '采购员',
                key: 'purchaser',
                dataIndex: 'purchaser',
                width:200,
            
            },
            {
                title: '销售员',
                key: 'seller',
                dataIndex: 'seller',
                width:120,
                render:(_,record)=>{
                    return (
                        record.seller.map((item)=>{
                          return <p style={{margin: 0}} key={item}>{item}</p>
                        })
                    );
                }            
            },
            {
                title: '跟进信息',
                key: 'followInfo',
                dataIndex: 'followInfo',
                width:260,
                render:(_,record)=>{
                    return (
                        <Popover 
                        overlayStyle={{width:800}}
                        placement="left"
                        content={
                            record.followInfoDetail.map(followInfos=>{
                                return <div style={{marginTop:10}} key={followInfos.purchaseShippingId} className={styles.followInfo}>
                                    <p><span>操作时间:</span>{followInfos.operateTime}</p>
                                    <p><span>物流单号:</span>{followInfos.shippingNo}</p>
                                    <p><span>物流公司:</span>{followInfos.shippingCompany}</p>
                                    <p><span>发货时间:</span>{followInfos.shippingDate}</p>
                                    <p><span>预计到货时间:</span>{followInfos.expectArrivingDate}</p>
                                    <p><span>发货地:</span>{followInfos.shippingPlace}</p>
                                    <p style={{marginBottom:10}}><span>跟进备注:</span>{followInfos.followRemark}</p>
                                    <hr />
                                </div>
                            })
                        } 
                        title="跟进物流信息"
                        >
                        {
                            record.followInfoDetail&&record.followInfoDetail.map(item=>{
                                return <p style={{margin: 0, width:200, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}} key={item.purchaseShippingId}>
                                <span style={{display:"inlineBlock",marginRight:10}}>
                                    {item.shippingNo}
                                </span>
                                <span>{item.shippingCompany}</span>
                                </p>
                            })
                        }
                        </Popover>
                    );
                }
            
            },
            {
                title: '操作',
                render:(_,record)=> {
                    return (
                        <div style={{display:+record.isAllSign===1?"none":"block"}}>
                            <p>
                                <Button type="primary" onClick = {this.handleFollowLogisticsBtn.bind(this,record)}>跟进物流</Button>                            
                            </p>
                            {
                                record.followInfoDetail.length>0?(<p>
                                    <Button type="primary" onClick = {this.handleShowAllSignModal.bind(this,record.id)} >全部签收</Button>
                                </p>):null
                            }
                            
                        </div>
                    )
                }            
            }
        ];
            // 嵌套表格数据
        const expandTable2 = (order) =>{
            const goodsColumns2 = [
                {
                    title: '订单号',
                    dataIndex: 'orderSn',
                    key: 'orderSn',
                }, 
                {
                    title: '条码',
                    dataIndex: 'goodsSn',
                    key: 'goodsSn',
                }, 
                {
                    title: '商品名称',
                    dataIndex: 'goodsName',
                    key: 'goodsName',
                }, 
                {
                    title: '采购数量',
                    dataIndex: 'number',
                    key: 'number',
                }, 
                {
                    title: '装箱数',
                    key: 'numberPerBox',
                    dataIndex: 'numberPerBox',
                    
                },
                {
                    title: '待发数量',
                    dataIndex: 'waitSendNum',
                    key: 'waitSendNum',
                },
                {
                    title: '已发数量',
                    dataIndex: 'sendNum',
                    key: 'sendNum',
                },
                {
                    title: '待发前售后数',
                    dataIndex: 'waitSendBackNum',
                    key: 'waitSendBackNum',
                },
                {
                    title: '已发后售后数',
                    dataIndex: 'sendBackNum',
                    key: 'sendBackNum',
                },
                {
                    title: '平台运费政策',
                    key: 'platFormShippingPolicy',
                    dataIndex: 'platFormShippingPolicy',
                
                }, 
                {
                    title: '供应商运费政策',
                    key: 'shippingPolicy',
                    dataIndex: 'shippingPolicy',
                
                },
                {
                    title: '备注',
                    key: 'remark',
                    dataIndex: 'remark',
                    render:(remark,record)=>{
                        return<Input.TextArea 
                            value={remark}
                            onChange={this.changePurchaseReamrk.bind(this,record.id)}
                            onBlur={this.submitPurchaseReamrk.bind(this,record.id)}
                            />
                    }
                
                }
                ];
            return (
                <Table
                columns={goodsColumns2}
                dataSource={order.goodsList}
                bordered
                pagination={false}
                rowKey={record=>record.id}
                />
            ); 
        }
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 15 },
            },
        };
        return(
            <PageHeaderLayout 
            title="采购跟单表"
            iconType="question-circle"
            tips={
            <div>
                <p>付款后的采购单都流转至此</p>
                <p>账期单财务审核通过后的单流转至此</p>
            </div>}
            >
                <Card bordered={false}>                   
                    <Tabs
                    onChange={this.changeSelectedTabs}
                    defaultActiveKey="1"             
                    >
                       
                        <TabPane tab="库存采购" key="1">
                            <Row>
                                <Select
                                placeholder="请选择跟进状态"
                                // value={stockFollowPurchaseOrderMap[reqKeyList[0].followStatus]?stockFollowPurchaseOrderMap[reqKeyList[0].followStatus]:"全部"}
                                style={{width:200}}
                                onChange={this.handleSearchMethods.bind(this,'followStatus')}
                                dropdownMatchSelectWidth={false}
                                allowClear
                                >
                                    <Select.Option value="">全部</Select.Option>
                                    {
                                        Object.keys(stockFollowPurchaseOrderMap).map(key => (
                                            <Select.Option value={key} key={key}>{stockFollowPurchaseOrderMap[key]}</Select.Option>
                                        ))
                                    }
                                </Select>
                                <Tooltip title={<div>
                                    <p>说明</p>
                                    <p>跟进状态改为：</p>
                                    <p>1.未发货：财务审核通过，但未填写物流跟进信息的</p>
                                    <p>2.已发货：已经填写物流信息的</p>
                                    <p>3.部分入库：部分签收的（采购单列表部分入库的状态</p>
                                    <p>4.全部入库：全部已签收的</p>
                                </div>}>
                                    <Icon type="question-circle" style={{marginRight:10}}/>
                                </Tooltip>
                                <Select
                                placeholder="请选择采购员"
                                className={globalStyles['select-sift']}
                                onChange={this.handleSearchMethods.bind(this,'purchaser')}
                                dropdownMatchSelectWidth={false}
                                allowClear
                                >
                                    <Select.Option value="">全部</Select.Option>
                                    {
                                        Object.keys(purchaserMap).map(key => (
                                            <Select.Option value={key} key={key}>
                                                    {purchaserMap[key]}
                                            </Select.Option>
                                        ))
                                    }
                                </Select>
                                <Search 
                                placeholder="商品名称/条码"
                                className={globalStyles['input-sift']}
                                onChange={this.handleChangeSearchItem.bind(this,'keywords')}
                                onSearch={this.handleSearchMethods.bind(this,'keywords')}
                                value={reqKeyList[0].keywords} 
                                suffix={reqKeyList[0].keywords?<ClearIcon 
                                    handleClear={this.handleClear.bind(this,"keywords")}
                                />:""}
                                />
                                <Search 
                                placeholder="采购单号"
                                className={globalStyles['input-sift']}
                                onChange={this.handleChangeSearchItem.bind(this,'purchaseOrderId')}
                                onSearch={this.handleSearchMethods.bind(this,'purchaseOrderId')}
                                value={reqKeyList[0]["purchaseOrderId"]} 
                                suffix={reqKeyList[0]["purchaseOrderId"]?<ClearIcon 
                                        handleClear={this.handleClear.bind(this,"purchaseOrderId")}
                                />:""}
                                />
                                <AutoComplete
                                    dataSource={supplierSuggest && supplierSuggest.map((suggest) => {
                                        return (
                                        <Select.Option value={suggest.id.toString()} key={suggest.id.toString()}>{suggest.name}</Select.Option>
                                        );
                                    })}
                                    onSelect={this.handleSelectSupplier.bind(this)}
                                    onSearch={this.handleChangeSupplier.bind(this)}
                                    className={globalStyles['input-sift']}
                                    allowClear
                                    dropdownMatchSelectWidth={false}
                                    >
                                    <Input.Search
                                        placeholder="请输入供应商"
                                        value={supplierSearchText}
                                    />
                                </AutoComplete>
                                <span>预计发货时间：</span>
                                <RangePicker 
                                style={{width:200}}
                                onChange={this.handleSearchMethods.bind(this,'purchaseDate')}
                                value={[reqKeyList[0].expectShippingDateStart ? moment(reqKeyList[0].expectShippingDateStart, 'YYYY-MM-DD') : '', reqKeyList[0].expectShippingDateEnd ? moment(reqKeyList[0].expectShippingDateEnd, 'YYYY-MM-DD') : '']}                               
                                />
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
                                        }
                                    }):null
                                }
                            </Row>
                            <Row style={{marginBottom:10}}>
                                <span style={{display:"inline-block",marginLeft:20}}>预计到货时间：</span>
                                <RangePicker 
                                style={{width:200}}
                                onChange={this.handleSearchMethods.bind(this,'arriveDate')}
                                value={[reqKeyList[0].expectReceivedDateStart ? moment(reqKeyList[0].expectReceivedDateStart, 'YYYY-MM-DD') : '', reqKeyList[0].expectReceivedDateEnd ? moment(reqKeyList[0].expectReceivedDateEnd, 'YYYY-MM-DD') : '']}                               
                                />
                                <span style={{display:"inline-block",marginLeft:20}}>采购时间：</span>
                                <RangePicker 
                                style={{width:200}}
                                onChange={this.handleSearchMethods.bind(this,'createTime')}
                                value={[reqKeyList[0].createTimeStart ? moment(reqKeyList[0].createTimeStart, 'YYYY-MM-DD') : '', reqKeyList[0].createTimeEnd ? moment(reqKeyList[0].createTimeEnd, 'YYYY-MM-DD') : '']}                               
                                />
                            </Row>
                            <Table
                            columns={columns}
                            dataSource={purchaseOrderList}
                            expandedRowRender={expandTable}
                            rowKey={record=>record.id}
                            bordered
                            loading={isTableLoading}
                            pagination={{
                                current: reqKeyList[0].curPage,
                                pageSize:reqKeyList[0].pageSize,
                                onChange: this.handleChangePage.bind(this),
                                onShowSizeChange: this.handleChangePageSize.bind(this),
                                showSizeChanger: true,
                                showQuickJumper: false,
                                total,
                                showTotal:total => `共 ${total} 个结果`,
                              }}
                            />
                        </TabPane>
                        <TabPane tab="代发采购" key="2">
                            <Row style={{marginBottom:10}}>
                                <Col span={20}>
                                    <Select
                                    placeholder="请选择跟进状态"
                                    // value={daifaFollowPurchaseOrderMap[reqKeyList[1].followStatus]?daifaFollowPurchaseOrderMap[reqKeyList[1].followStatus]:"全部"}
                                    style={{width:200}}
                                    onChange={this.handleSearchMethods.bind(this,'daifaFollowStatus')}
                                    dropdownMatchSelectWidth={false}
                                    allowClear
                                    >
                                        <Select.Option value="">全部</Select.Option>
                                        {
                                            Object.keys(daifaFollowPurchaseOrderMap).map(key => (
                                                <Select.Option value={key} key={key}>{daifaFollowPurchaseOrderMap[key]}</Select.Option>
                                            ))
                                        }
                                    </Select>
                                    <Tooltip title={<div>
                                            <p>说明</p>
                                            <p>跟进状态改为：</p>
                                            <p>1.未发货：财务审核通过，但未填写物流跟进信息的</p>
                                            <p>2.已发货：已经填写物流信息的</p>
                                            <p>3.部分入库：部分签收的（采购单列表部分入库的状态</p>
                                            <p>4.全部入库：全部已签收的</p>
                                        </div>}>
                                        <Icon type="question-circle" style={{marginRight:10}}/>
                                    </Tooltip>
                                    <Select
                                    placeholder="请选择采购员"
                                    className={globalStyles['select-sift']}
                                    onChange={this.handleSearchMethods.bind(this,'purchaser')}
                                    dropdownMatchSelectWidth={false}
                                    allowClear
                                    >
                                        <Select.Option value="">全部</Select.Option>
                                        {
                                            Object.keys(purchaserMap).map(key => (
                                                <Select.Option value={key} key={key}>{purchaserMap[key]}</Select.Option>
                                            ))
                                        }
                                    </Select>
                                    <Select
                                    placeholder="请选择销售员"
                                    className={globalStyles['select-sift']}
                                    onChange={this.handleSearchMethods.bind(this,'sellerId')}
                                    dropdownMatchSelectWidth={false}
                                    allowClear
                                    >
                                        <Select.Option value="">全部</Select.Option>
                                        {
                                            Object.keys(sellerMap).map(key => (
                                                <Select.Option value={key} key={key}>{sellerMap[key]}</Select.Option>
                                            ))
                                        }
                                    </Select>
                                    <Search 
                                    placeholder="商品名称/条码"
                                    className={globalStyles['input-sift']}
                                    onChange={this.handleChangeSearchItem.bind(this,'keywords')}
                                    onSearch={this.handleSearchMethods.bind(this,'keywords')}
                                    value={reqKeyList[1]["keywords"]} 
                                    suffix={reqKeyList[1]["keywords"]?<ClearIcon 
                                            handleClear={this.handleClear.bind(this,"keywords")}
                                    />:""}
                                    />
                                    <Search 
                                    placeholder="采购单号"
                                    className={globalStyles['input-sift']}
                                    onChange={this.handleChangeSearchItem.bind(this,'purchaseOrderId')}
                                    onSearch={this.handleSearchMethods.bind(this,'purchaseOrderId')}
                                    value={reqKeyList[1]["purchaseOrderId"]} 
                                    suffix={reqKeyList[1]["purchaseOrderId"]?<ClearIcon 
                                            handleClear={this.handleClear.bind(this,"purchaseOrderId")}
                                    />:""}
                                    />
                                    <Search 
                                    placeholder="收货人"
                                    className={globalStyles['input-sift']}
                                    onChange={this.handleChangeSearchItem.bind(this,'consignee')}
                                    onSearch={this.handleSearchMethods.bind(this,'consignee')}
                                    value={reqKeyList[1]["consignee"]} 
                                    suffix={reqKeyList[1]["consignee"]?<ClearIcon 
                                            handleClear={this.handleClear.bind(this,"consignee")}
                                    />:""}
                                    />
                                    <AutoComplete
                                        dataSource={supplierSuggest && supplierSuggest.map((suggest) => {
                                            return (
                                            <Select.Option value={suggest.id.toString()} key={suggest.id.toString()}>{suggest.name}</Select.Option>
                                            );
                                        })}
                                        onSelect={this.handleSelectSupplier.bind(this)}
                                        onSearch={this.handleChangeSupplier.bind(this)}
                                        className={globalStyles['input-sift']}
                                        allowClear
                                        dropdownMatchSelectWidth={false}
                                        >
                                        <Input.Search
                                            placeholder="请输入供应商"
                                            value={supplierSearchText}
                                        />
                                    </AutoComplete>
                                </Col>
                                <Col span={3} offset={20}>
                                    {
                                        actionList2?
                                        actionList2.map(actionInfo=>{
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
                                            }
                                        }):null
                                    }
                                </Col>
                                
                            </Row>
                            <Row style={{marginBottom:10}}>
                                <span>预计发货时间：</span>
                                <RangePicker 
                                style={{width:200}}
                                onChange={this.handleSearchMethods.bind(this,'purchaseDate')}
                                value={[reqKeyList[1].expectShippingDateStart ? moment(reqKeyList[1].expectShippingDateStart, 'YYYY-MM-DD') : '', reqKeyList[1].expectShippingDateEnd ? moment(reqKeyList[1].expectShippingDateEnd, 'YYYY-MM-DD') : '']}
                                />
                                <span style={{display:"inline-block",marginLeft:20}}>下单时间：</span>
                                <RangePicker 
                                style={{width:200}}
                                onChange={this.handleSearchMethods.bind(this,'createTime')}
                                value={[reqKeyList[1].createTimeStart ? moment(reqKeyList[1].createTimeStart, 'YYYY-MM-DD') : '', reqKeyList[1].createTimeEnd? moment(reqKeyList[1].createTimeEnd, 'YYYY-MM-DD') : '']}                               
                                />
                                <span style={{display:"inline-block",marginLeft:20}}>预计到货时间：</span>
                                <RangePicker 
                                style={{width:200}}
                                onChange={this.handleSearchMethods.bind(this,'arriveDate')}
                                value={[reqKeyList[1].expectReceivedDateStart ? moment(reqKeyList[1].expectReceivedDateStart, 'YYYY-MM-DD') : '', reqKeyList[1].expectReceivedDateEnd ? moment(reqKeyList[1].expectReceivedDateEnd, 'YYYY-MM-DD') : '']}                               
                                />
                            </Row>
                            <Table
                            columns={columns2}
                            dataSource={purchaseOrderList2}
                            expandedRowRender={expandTable2}
                            rowKey={record=>record.id}
                            bordered
                            loading={isTableLoading}
                            pagination={{
                                current: reqKeyList[1].curPage,
                                pageSize:reqKeyList[1].pageSize,
                                onChange: this.handleChangePage.bind(this),
                                onShowSizeChange: this.handleChangePageSize.bind(this),
                                showSizeChanger: true,
                                showQuickJumper: false,
                                total:total2,
                              }}
                            />
                        </TabPane>
                                          
                    </Tabs> 
                    <Modal 
                    visible={isShowAllSignModal} 
                    title="签收"
                    onOk={this.handleConfirmAllSign}
                    onCancel={this.handleCancelAllSign}
                    > 
                        <p style={{paddingLeft:100}}>{"请确认此采购单是否全部签收？"}</p>
                    </Modal>                  
                    <Modal
                    visible={isShowLogisticsModal} 
                    title="物流跟进信息"
                    maskClosable={false}
                    onCancel={this.handleCloseModal}
                    footer={null}
                    style={{height:600,overflow:'auto',paddingBottom:0}}
                    >
                    {
                        followInfoDetail&&followInfoDetail.map(info=>{
                            return (                                       
                                <div className={styles['logistic-info']} key={info.purchaseShippingId}>                        
                                    <Row>
                                        <Col span={10}><h6 style={{fontSize:'16px'}}>跟进物流</h6></Col>
                                        <Col span={10} offset={4} align="right">
                                        <Popconfirm
                                        title="请确认是否删除已填写的物流相关信息？"
                                        onConfirm={this.handleDeleteLogisticInfo.bind(this,info.purchaseShippingId)}
                                        >
                                            <Button size="small">删除</Button>
                                        </Popconfirm>                                            
                                            <Button
                                            type="primary" size="small" style={{margin:'0 10px'}} onClick={this.handleLogisticsSign.bind(this,info.purchaseShippingId)}>{+info.status?"取消签收":"签收"}</Button>
                                            {
                                                +info.status?null:(<Button type="primary" size="small" 
                                                onClick={this.handleSaveEditLogisticsInfo.bind(this,info.purchaseShippingId)} >{info.isSaved?"保存":"修改"}</Button>)                                                
                                            }
                                        </Col>
                                    </Row>
                                    {
                                        selectedTab=="2"&&<Row style={{marginTop:10}}>
                                            <Col span={5}>关联子单号:</Col>
                                            <Col span={15}>
                                            {
                                                info.isSaved===false?<span>{info.orderSn}</span>: <Select 
                                                style={{width:250}}
                                                value = {info.orderId}
                                                onChange = {this.handleChangeLogisticsInfo.bind(this,'orderId',info.purchaseShippingId)}
                                                >
                                                    {
                                                        orderSnMap.map(item=>(
                                                            <Select.Option value={item.orderId}>
                                                                {`${item.orderSn}/${item.consignee}`}
                                                            </Select.Option>
                                                        ))
                                                    }
                                                </Select> 
                                            }    
                                            </Col>
                                        </Row>
                                    }
                                    <Row style={{marginTop:10}}>
                                        <Col span={5}>物流单号:</Col>
                                        <Col span={15}>
                                        {
                                            info.isSaved===false?<span>{info.shippingNo}</span>: <Input
                                            value={info.shippingNo}
                                            onChange={this.handleSaveLogisticsInfo.bind(this,'shippingNo',info.purchaseShippingId)}/>
                                        }   
                                        </Col>
                                    </Row>
                                    <Row style={{marginTop:10}}>
                                        <Col span={5}>物流公司:</Col>
                                        <Col span={15}>
                                        {
                                            info.isSaved===false?<span>{info.shippingCompany}</span>:<Input 
                                            value = {info.shippingCompany}
                                            onChange = {this.handleChangeLogisticsInfo.bind(this,'shippingCompany',info.purchaseShippingId)}
                                            />
                                        }
                                        </Col>
                                    </Row>
                                    <Row style={{marginTop:10}}>
                                        <Col span={5}>发货地:</Col>
                                        <Col span={15}>
                                        {
                                            info.isSaved===false?<span>{info.shippingPlace}</span>:<Input
                                            value = {info.shippingPlace}
                                            onChange = {this.handleChangeLogisticsInfo.bind(this,'shippingPlace',info.purchaseShippingId)}
                                            />
                                        }
                                        </Col>
                                    </Row>
                                    <Row style={{marginTop:10}}>
                                        <Col span={5}>发货时间:</Col>
                                        <Col span={15}>
                                        {
                                            info.isSaved===false?<span>{info.shippingDate}</span>:
                                            <DatePicker 
                                            defaultValue={moment(info.shippingDate)}
                                            onChange={this.handleChangeLogisticsInfo.bind(this,'shippingDate',info.purchaseShippingId)}
                                            />
                                        } 
                                        </Col>
                                    </Row>
                                    {
                                        selectedTab=="1"&&<Row style={{marginTop:10}}>
                                            <Col span={5}>预计到货时间:</Col>
                                            <Col span={15}>
                                            {
                                                info.isSaved===false?<span>{info.expectArrivingDate}</span>:
                                                <DatePicker 
                                                defaultValue={moment(info.expectArrivingDate)}
                                                onChange={this.handleChangeLogisticsInfo.bind(this,'expectArrivingDate',info.purchaseShippingId)}
                                                style={{width:200}}
                                                />
                                            } 
                                            </Col>
                                        </Row>
                                    }
                                    <Row style={{marginTop:10}}>
                                        <Col span={5}>跟进备注:</Col>
                                        <Col span={15}>
                                        {
                                            info.isSaved===false?<span>{info.followRemark}</span>:<Input.TextArea
                                            value={info.followRemark}
                                            onChange = {this.handleChangeLogisticsInfo.bind(this,'followRemark',info.purchaseShippingId)}
                                            />
                                        }
                                        </Col>
                                    </Row>                                            
                                </div>
                            )
                        })
                         
                    }
                        <Row>
                            <Col span={10}><h6 style={{fontSize:'16px'}}>跟进物流</h6></Col>
                            <Col span={10} offset={4} align="right">      
                                <Button type="primary" size="small" onClick={this.handleSubmitLogisticsInfo} >{"保存"}</Button>
                            </Col>
                        </Row>
                        {
                            selectedTab=="2"&&<Row style={{marginTop:10}}>
                                <Col span={5}>关联子单号:</Col>
                                <Col span={15}>
                                    <Select 
                                    style={{width:250}}
                                    value={orderId}
                                    onChange = {this.handleSaveLogisticsInfo.bind(this,'orderId')}
                                    >
                                        {
                                            orderSnMap.map(item=>(
                                                <Select.Option value={item.orderId}>
                                                    {`${item.orderSn}/${item.consignee}`}
                                                </Select.Option>
                                            ))
                                        }
                                    </Select> 
                                </Col>
                            </Row>
                        }
                        <Row style={{marginTop:10}}>
                            <Col span={5}>物流单号:</Col>
                            <Col span={15}>
                                <Input
                                value={shippingNo}
                                onChange={this.handleSaveLogisticsInfo.bind(this,'shippingNo')}/>
                            </Col>
                        </Row>
                        <Row style={{marginTop:10}}>
                            <Col span={5}>物流公司:</Col>
                            <Col span={15}>
                            <Input
                            value={shippingCompany}
                            onChange={this.handleSaveLogisticsInfo.bind(this,'shippingCompany')}/></Col>
                        </Row>
                        <Row style={{marginTop:10}}>
                            <Col span={5}>发货地:</Col>
                            <Col span={15}>
                            <Input 
                            value={shippingPlace}
                            onChange={this.handleSaveLogisticsInfo.bind(this,'shippingPlace')}/></Col>
                        </Row>
                        <Row style={{marginTop:10}}>
                            <Col span={5}>发货时间:</Col>
                            <Col span={15}>
                            <DatePicker
                            value={
                                shippingDate ? moment(shippingDate, 'YYYY-MM-DD') : ''
                            }
                            onChange={this.handleSaveLogisticsInfo.bind(this,'shippingDate')}/></Col>
                        </Row>
                        {
                            selectedTab=="1"&&<Row style={{marginTop:10}}>
                                <Col span={5}>预计到货时间:</Col>
                                <Col span={15}>
                                <DatePicker
                                style={{width:200}}
                                value={
                                    expectArrivingDate ? moment(expectArrivingDate, 'YYYY-MM-DD') : ''
                                }
                                onChange={this.handleSaveLogisticsInfo.bind(this,'expectArrivingDate')}/></Col>
                            </Row>
                        }
                        <Row style={{marginTop:10}}>
                            <Col span={5}>跟进备注:</Col>
                            <Col span={15}>
                            <Input.TextArea 
                            value={followRemark}
                            onChange={this.handleSaveLogisticsInfo.bind(this,'followRemark')}/></Col>
                        </Row> 
                                                                 
                    </Modal>
                </Card>
            </PageHeaderLayout>            
        )
    }

}
