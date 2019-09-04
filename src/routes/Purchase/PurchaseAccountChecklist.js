import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import moment from 'moment';
import {
  Card, 
  Select,
  DatePicker,
  Input,
  Table,
  Row,
} from 'antd';
const { Search } = Input;
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import globalStyles from '../../assets/style/global.less';
@connect(state => ({
    purchaseAccountChecklist: state.purchaseAccountChecklist,
}))
export default class purchaseAccountChecklist extends PureComponent {
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'purchaseAccountChecklist/getConfig',
        });
        dispatch({
            type: 'purchaseAccountChecklist/getList',
        });        
    }
    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'purchaseAccountChecklist/unmount',
        });
    }
    /**------筛选项----- */
    handleChangeSearchKeyworlds=(type,e)=>{
        const { dispatch } = this.props;
        dispatch({
            type:"purchaseAccountChecklist/updatePageReducer",
            payload:{
                [type]:e.target.value,
            }
        })
    }
    handleSearchMethods=(type,e)=>{
        const { dispatch } = this.props;
        dispatch({
            type:"purchaseAccountChecklist/getList",
            payload:{
                [type]:e,
                currentPage:1,
            }
        })
    }
    handleSearchByDate=(_,dataString)=>{
        const { dispatch } = this.props;
        dispatch({
            type:"purchaseAccountChecklist/getList",
            payload:{
                createTimeStart:dataString[0],
                createTimeEnd:dataString[1],
                currentPage:1,
            }
        })
    }
    /**---------换页回调--------- */
    handleChangePage=(value)=>{
        const { dispatch } = this.props;
        dispatch({
            type:"purchaseAccountChecklist/getList",
            payload:{
                currentPage:value,
            }
        })
    }
    handleChangePageSize=(_,value)=>{
        const { dispatch } = this.props;
        dispatch({
            type:"purchaseAccountChecklist/getList",
            payload:{
                pageSize:value,
                currentPage:1,
            }
        })
    }

 
render() {
    const {
        purchaseAccountChecklist: {
            purchaseOrderList,
            createTimeStart,
            createTimeEnd,
            currentPage,
            pageSize,
            isTableLoading,
            purchaserMap,
            total,
      },
    } = this.props;
    const columns = [
        {
            title: '采购单状态',
            key: 'status',
            dataIndex: 'status',        
        },
        {
            title: '采购单号',
            key: 'orderId',
            dataIndex: 'orderId',
            render:(orderId,record) =>{
                const url = record.isSale?`/purchase/purchase-order-management/sale-purchase/sale-purchase-order-list/sale-purchase-order-detail/${record.orderId}`:`/purchase/purchase-order-management/common-purchase-list/common-purchase-detail/${record.orderId}`;
                return [
                    <Link to={url}>{orderId}</Link>,
                    // record.isCredit ?(<span style={{ color: '#fff', marginLeft: 5, padding: '2px 5px', backgroundColor: 'pink', fontSize: 12 }}>账期</span>):null,                    
                    <div>
                        {
                            record.tag.map(item=>{
                                return <span style={{display:'inline-block',padding:'0 4px', background:item.color,borderRadius:4,marginRight:4, color:"#fff"}}>{item.name}</span>
                            })
                        }
                    </div>
                ]
            }        
        },
        {
            title: '预计付款时间',
            key: 'expectPayTime',
            dataIndex: 'expectPayTime',        
        },
        {
            title: '采购应付总额',
            key: 'purchaseAmount',
            dataIndex: 'purchaseAmount',        
        },
        {
            title: '制单人',
            key: 'purchaser',
            dataIndex: 'purchaser',        
        },
        {
            title: '创建时间',
            key: 'createTime',
            dataIndex: 'createTime',        
        },
        {
            title: '供应商',
            key: 'supplier',
            dataIndex: 'supplier',        
        },
        {
            title: '采购单类型',
            key: 'isSale',
            dataIndex: 'isSale',
            render:(isSale)=>{
                return <span>{isSale?"代发采购":"库存采购"}</span>
            }
        
        },
    ];
    const expandTable = (order) =>{
        const goodsThumb = {
            title: '商品图',
            dataIndex: 'goodsThumb',
            key: 'goodsThumb',
            width:100,
            render:(goodsThumb)=>{
                return <img style={{ width: 50, heihgt: 50 }} src={goodsThumb} alt="商品缩略图" />;
            }
        };
        const goodsName = {
            title: '商品名',
            dataIndex: 'goodsName',
            key: 'goodsName',
            width:200,
        };
        const goodsSn = {
            title: '商品条码',
            dataIndex: 'goodsSn',
            key: 'goodsSn',
        };
        const number = {
            title: '采购数量',
            dataIndex: 'number',
            key: 'number',
        };
        const marketPrice = 
        {
            title: '零售价/单价/折扣',
            dataIndex: 'marketPrice',
            key: 'marketPrice',
            render: (marketPrice, record) => {
                return (
                <p>
                    <span>{marketPrice}</span>
                    <span>/</span>
                    <span>{record.shopPrice}</span>
                    <span>/</span>
                    <span>{record.saleDiscount}</span>
                </p>
                );
            },
        };
        const purchasePrice = {
            title: '采购单价/折扣',
            dataIndex: 'purchasePrice',
            key: 'purchasePrice',
            render: (purchasePrice, record) => {
                return (
                <p>
                    <span>{purchasePrice}</span>
                    <span>/</span>
                    <span>{record.purchaseDiscount}</span>
                </p>
                );
            },
        };
        const purchaseIsTax = {
            title: '采购含税',
            key: 'isTax',
            dataIndex: 'isTax',
            render:(isTax)=>{
                return <span>{isTax?"是":"否"}</span>
            }                   
        };
        const salePrice = {
            title: '销售价',
            dataIndex: 'salePrice',
            key: 'salePrice',
        };

        const saleIsTax = {
            title: '销售含税',
            dataIndex: 'saleIsTax',
            key: 'saleIsTax',
            render:(saleIsTax)=>{
                return <span>{saleIsTax?"是":"否"}</span>
            }  
        };

        const commonGoodsColumns = [
            goodsThumb,
            goodsName,
            goodsSn,
            number,
            marketPrice,
            purchasePrice,
            purchaseIsTax,                    
        ];
        const purchaseGoodsColumns = [
            goodsThumb,
            goodsName,
            goodsSn,
            number,
            salePrice,
            marketPrice,
            purchasePrice,
            purchaseIsTax,   
            saleIsTax,                 
        ];
        return (
            <Table
              columns={order.isSale?purchaseGoodsColumns:commonGoodsColumns}
              dataSource={order.goodsList}
              bordered
              pagination={false}
              rowKey={record => record.id}
            />
        ); 
    }
   
    return (
      <PageHeaderLayout title="采购账期审核">
        <Card bordered={false}>
            <Row>
                {/* <Select
                placeholder="请选择订单状态"
                className={globalStyles['select-sift']}
                onSelect={this.handleSearchMethods.bind(this,'status')}
                >
                    <Select.Option value="18">{"待财务审核"}</Select.Option>
                </Select> */}
                <Search 
                placeholder="请输入采购单号"
                className={globalStyles['input-sift']}
                onChange={this.handleChangeSearchKeyworlds.bind(this,'orderId')}
                onSearch={this.handleSearchMethods.bind(this,'orderId')}
                />
                <Search 
                placeholder="供应商"
                className={globalStyles['input-sift']}
                onChange={this.handleChangeSearchKeyworlds.bind(this,'supplierName')}
                onSearch={this.handleSearchMethods.bind(this,'supplierName')}
                />
                 <Select
                placeholder="请选择制单人"
                className={globalStyles['select-sift']}
                onSelect={this.handleSearchMethods.bind(this,'purchaser')}
                >
                    <Select.Option value="">{"全部"}</Select.Option>
                    {
                        purchaserMap&&Object.keys(purchaserMap).map(key => (
                            <Select.Option value={key}>{purchaserMap[key]}</Select.Option>
                        ))
                    }
                </Select>
                <DatePicker.RangePicker     
                onChange={this.handleSearchByDate.bind(this)}    
                value={[createTimeStart ? moment(createTimeStart, 'YYYY-MM-DD') : '', createTimeEnd ? moment(createTimeEnd, 'YYYY-MM-DD') : '']}                
                />
            </Row>
            <Table
            bordered
            loading={isTableLoading}
            columns={columns}
            rowKey={record => record.orderId}
            dataSource={purchaseOrderList}
            expandedRowRender={expandTable}
            pagination={{
                pageSize,
                total,
                current: currentPage,
                showSizeChanger: true,
                onChange: this.handleChangePage.bind(this),
                onShowSizeChange: this.handleChangePageSize.bind(this),
                showTotal:total => `共 ${total} 个结果`,
            }}
            />
        </Card>
      </PageHeaderLayout>
    );
  }
}

