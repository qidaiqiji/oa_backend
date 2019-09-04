import React, { PureComponent } from 'react';
import globalStyles from '../../assets/style/global.less';
import { connect } from 'dva';
// import moment from 'moment';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import img from '../../assets/u2741.png';
import ClearIcon from '../../components/ClearIcon';
import {
    Card,
    Row,
    Col,
    Select,
    Input,
    Table,
    Button,
    DatePicker,
    message,
    Icon,
    AutoComplete,
    Tooltip,
} from 'antd';
import styles from './SmartPurchaseList.less';
import Debounce from 'lodash-decorators/debounce';
const Search = Input.Search;
@connect(state => ({
    purchasePriceManagement: state.purchasePriceManagement,
}))
export default class PurchasePriceManagement extends PureComponent {
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'purchasePriceManagement/getList',
        });
        dispatch({
            type: 'purchasePriceManagement/getConfig',
        });
    }
    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'purchasePriceManagement/unmountReducer',
        });
    }
    /**------搜索框的值发生改变时--------------- */
    handleChangeSearchKeyworlds(type, e) {
        const { dispatch } = this.props;
        switch (type) {
            case "goodsKeywords":
            case "goodsSn":
                dispatch({
                    type: 'purchasePriceManagement/updatePageReducer',
                    payload: {
                        [type]: e.target.value,
                    },
                });
                break;
        }
    }
    /**-----------搜索公用一个方法---------- */
    handleSearchMethods(type, e, dataStrings) {
        const { dispatch, purchasePriceManagement } = this.props;
        const { goodsKeywords, goodsSn } = purchasePriceManagement;
        switch (type) {
            case "goodsKeywords":
            case "goodsSn":
                dispatch({
                    type: 'purchasePriceManagement/getList',
                    payload: {
                        goodsKeywords,
                        goodsSn,
                        currentPage: 1,
                    },
                });
                break;
            case "supplierId":
            case "purchaser":
            case "property":
            case "status":
            case "payMethod":
                dispatch({
                    type: 'purchasePriceManagement/getList',
                    payload: {
                        [type]: e,
                        currentPage: 1,
                    },
                });
                break;
            case "contractExpireDate":
                dispatch({
                    type: 'purchasePriceManagement/getList',
                    payload: {
                        contractExpireDateStart: dataStrings[0],
                        contractExpireDateEnd: dataStrings[1],
                        currentPage: 1,
                    },
                });
                break;
            case "authorizationExpireDate":
                dispatch({
                    type: 'purchasePriceManagement/getList',
                    payload: {
                        authorizationExpireDateStart: dataStrings[0],
                        authorizationExpireDateEnd: dataStrings[1],
                        currentPage: 1,
                    },
                });
                break;
        }

    }

    handleCheckSupplyGoods(selectId, selectedRows) {
        const { dispatch } = this.props;
        const goodsIdLists = [];
        selectedRows.map((item => {
            goodsIdLists.push(item.id)
        }))
        dispatch({
            type: 'purchasePriceManagement/changeSupplyGoodsCheckboxIds',
            payload: {
                supplyGoodsCheckboxIds: selectId,
                selectedRows,
                goodsIdLists,
            }
        });
    }
    // 选择采购员
    handleChangePurchaser(value) {
        const { dispatch } = this.props;
        dispatch({
            type: 'purchasePriceManagement/updateEidtPurchaser',
            payload: {
                purchaserId: value,

            },
        });
    }
    // 分配采购员
    handelAssignPurchaserOrder() {
        const { dispatch, purchasePriceManagement } = this.props;
        const { purchaserId, selectedRows, orderIds } = purchasePriceManagement;
        const goodsMsg = selectedRows.map(item => {
            return (({ purchaser, id }) => ({ purchaser, id }))(item)

        })
        const goodsInfos = [];
        goodsMsg.forEach((item) => {
            let newObj = {};
            newObj["purchaserId"] = item.purchaser;
            newObj["goodsId"] = item.id;
            goodsInfos.push(newObj)
            return goodsInfos
        })
        if (!purchaserId) {
            message.warning('请选择要分配的采购员');
            return;
        }
        dispatch({
            type: 'purchasePriceManagement/assignPurchaserOrder',
            payload: {
                goodsInfos,
            },
        });

        dispatch({
            type: 'purchasePriceManagement/updatePageReducer',
            payload: {
                selectedRows: [],
                orderIds: [],
            },
        });


    }

    // 单行分配采购员
    changePurchaser = (goodsId, value) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'purchasePriceManagement/assignPurchaser',
            payload: {
                goodsId,
                purchaserId: value
            },
        });
    }

    // 换页回调
    handleChangePage = (value) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'purchasePriceManagement/getList',
            payload: {
                currentPage: value
            },
        });

    }
    handleChangePageSize = (_, pageSize) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'purchasePriceManagement/getList',
            payload: {
                pageSize,
                currentPage: 1,
            },
        });

    }
    // 选择供应商
    handleSelectSupplier(supplierId, option) {
        const { dispatch } = this.props;
        const { children } = option.props;
        dispatch({
            type: 'purchasePriceManagement/getList',
            payload: {
                curPage: 1,
                supplierId,
                supplierSearchText: children,
            },
        });
    }
    // 搜索供应商
    @Debounce(200)
    handleChangeSupplier(text) {
        const { dispatch } = this.props;
        dispatch({
            type: 'purchasePriceManagement/changeSupplier',
            payload: {
                supplierSearchText: text,
            },
        });
    }
    handleClear = (type) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'purchasePriceManagement/getList',
            payload: {
                [type]: "",
            },
        });
    }
    render() {
        const {
            purchasePriceManagement: {
                goodsList,
                orderIds,
                purchaserMap,
                payTypeMap,
                propertyMap,
                saleMap,
                status,
                payMethod,
                property,
                purchaser,
                currentPage,
                pageSize,
                total,
                isTableLoading,
                supplierSuggest,
                supplierSearchText,
                goodsSn,
                goodsKeywords,
                supplierGoodsPayMethodMap,
                actionList
            }
        } = this.props;


        const columns = [
            {
                title: '条形码',
                dataIndex: 'goodsSn',
                key: 'goodsSn',
                width: 200,
                render: (goodsSn) => {
                    return <Link to={`/purchase/supplier-management/purchase-price-management/price-detail/${goodsSn}`}>{goodsSn}</Link>
                }
            },
            {
                title: '商品名称',
                dataIndex: 'goodsName',
                key: 'goodsName',
                width: 300,
                render: (goodsName) => {
                    return <p style={{ width: 270, margin: 0 }} className={globalStyles.twoLine}>
                        <Tooltip title={goodsName}>
                            {goodsName}
                        </Tooltip>
                    </p>
                }
            },
            {
                title: '品牌名称',
                dataIndex: 'brandName',
                key: 'brandName',
                width: 170,
                render: (brandName) => {
                    return <p style={{ margin: 0, width: 170, overflow: 'hidden' }}>{brandName}</p>
                }
            },
            {
                title: '零售价',
                key: 'marketPrice',
                dataIndex: 'marketPrice',
            },
            {
                title: '平台价',
                key: 'shopPrice',
                dataIndex: 'shopPrice',
            },
            {
                title: '采购员',
                key: 'purchaser',
                dataIndex: 'purchaser',
                render: (purchaser) => {
                    return <p>{purchaserMap[purchaser]}</p>
                }

            },
            {
                title: '平台状态',
                key: 'status',
                dataIndex: 'status',
            },

        ];
        const expandTable = (order) => {
            const goodsColumns = [
                {
                    title: '供应商',
                    dataIndex: 'supplier',
                    key: 'supplier',
                    render: (supplier, record) => {
                        return <Link to={`/purchase/supplier-management/supplier-check-list/supplier-check-detail/${record.supplierId}`}>{supplier}</Link>
                    }
                },
                {
                    title: '指定等级',
                    dataIndex: 'supplierLevel',
                    key: 'supplierLevel',
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
                    key: 'purchasePrice',
                    dataIndex: 'purchasePrice',
                },
                {
                    title: '未税折扣',
                    key: 'purchaseDiscount',
                    dataIndex: 'purchaseDiscount',
                },
                {
                    title: '含税返利后进价',
                    key: 'taxRebatePurchasePrice',
                    dataIndex: 'taxRebatePurchasePrice',
                },
                {
                    title: '不含税返利后进价',
                    key: 'rebatePurchasePrice',
                    dataIndex: 'rebatePurchasePrice',
                },
                {
                    title: '结算方式',
                    key: 'payMethod',
                    dataIndex: 'payMethod',
                },
                {
                    title: '控价要求',
                    key: 'requestPrice',
                    dataIndex: 'requestPrice',
                    width: 100,
                },
                {
                    title: '条码政策',
                    key: 'snPolicy',
                    dataIndex: 'snPolicy',
                    render: (snPolicy) => {
                        return <Tooltip title={snPolicy}>
                            {
                                snPolicy ? (<img
                                    style={{ width: 40, height: 40 }}
                                    src={img} alt="条码政策"></img>) : null
                            }
                        </Tooltip>
                    },

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

            ];
            return (
                <Table
                    columns={goodsColumns}
                    dataSource={order.supplierGoodsInfo}
                    rowKey={record => record.id}
                    bordered
                    pagination={false}
                    className={globalStyles.tablestyle}
                />
            );
        }

        return (
            <PageHeaderLayout title="商品采购价管理">
                <Card>
                    <Row style={{ display: orderIds.length > 0 ? 'none' : 'block' }}>
                        <Col span={20}>
                            <Search
                                placeholder="商品名称/品牌名称"
                                className={globalStyles['input-sift']}
                                onChange={this.handleChangeSearchKeyworlds.bind(this, 'goodsKeywords')}
                                onSearch={this.handleSearchMethods.bind(this, 'goodsKeywords')}
                                value={goodsKeywords}
                                suffix={goodsKeywords ? <ClearIcon
                                    handleClear={this.handleClear.bind(this, "goodsKeywords")}
                                /> : ""}
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
                            >
                                <Search
                                    placeholder="请输入供应商"
                                    value={supplierSearchText}
                                />
                            </AutoComplete>
                            <Search
                                placeholder="请输入条码"
                                className={globalStyles['input-sift']}
                                onChange={this.handleChangeSearchKeyworlds.bind(this, 'goodsSn')}
                                onSearch={this.handleSearchMethods.bind(this, 'goodsSn')}
                                value={goodsSn}
                                suffix={goodsSn ? <ClearIcon
                                    handleClear={this.handleClear.bind(this, "goodsSn")}
                                /> : ""}
                            />
                            <Select
                                placeholder="采购员"
                                // value={purchaserMap[purchaser]}
                                className={globalStyles['select-sift']}
                                onChange={this.handleSearchMethods.bind(this, 'purchaser')}
                                style={{ width: 200 }}
                                allowClear
                                dropdownMatchSelectWidth={false}
                            >
                                <Select.Option value="-1">{"全部"}</Select.Option>
                                {
                                    Object.keys(purchaserMap).map(key => (
                                        <Select.Option value={key}>
                                            {purchaserMap[key]}
                                        </Select.Option>
                                    ))
                                }
                            </Select>

                            <Select
                                placeholder="平台状态"
                                // value={saleMap[status]}
                                className={globalStyles['select-sift']}
                                onChange={this.handleSearchMethods.bind(this, 'status')}
                                allowClear
                                dropdownMatchSelectWidth={false}
                            >
                                <Select.Option value="">{"全部"}</Select.Option>
                                {
                                    Object.keys(saleMap).map(key => (
                                        <Select.Option value={key}>{saleMap[key]}</Select.Option>
                                    ))
                                }
                            </Select>
                            <Select
                                placeholder="结算方式"
                                // value={payTypeMap[payMethod]}
                                className={globalStyles['select-sift']}
                                onChange={this.handleSearchMethods.bind(this, 'payMethod')}
                                allowClear
                                dropdownMatchSelectWidth={false}
                            >
                                <Select.Option value="">{"全部"}</Select.Option>
                                {
                                    Object.keys(supplierGoodsPayMethodMap).map(key => (
                                        <Select.Option value={key}>{supplierGoodsPayMethodMap[key]}</Select.Option>
                                    ))
                                }
                            </Select>
                        </Col>
                        <Col span={3}>
                            {
                                actionList.map(item=>(
                                    <Button type="primary" href={item.url} target="_blank">{item.name}</Button>
                                ))
                            }
                        </Col>
                    </Row>
                    <Row
                        style={{
                            marginBottom: '10px',
                            display: orderIds.length > 0 ? 'block' : 'none',
                        }}
                    >
                        <span style={{ marginLeft: 20, marginRight: 20 }}>
                            <Icon
                                type="close"
                                style={{
                                    fontSize: 16,
                                    color: '#C9C9C9',
                                    marginRight: '10px',
                                }}
                            />已选择{orderIds.length}项
                    </span>
                        <Select
                            style={{ width: 200, marginRight: 10 }}
                            placeholder="分配采购员"
                            onChange={this.handleChangePurchaser.bind(this)}
                            dropdownMatchSelectWidth={false}
                        >
                            {
                                Object.keys(purchaserMap).map(key => (
                                    <Select.Option value={key}>{purchaserMap[key]}</Select.Option>
                                ))
                            }
                        </Select>
                        <Button type="primary" onClick={this.handelAssignPurchaserOrder.bind(this)}>
                            确定分配
                    </Button>
                    </Row>
                    <Table
                        bordered
                        columns={columns}
                        rowKey={record => record.id}
                        dataSource={goodsList}
                        className={globalStyles.tablestyle}
                        // rowSelection={{ 
                        //     selectedRowKeys: orderIds,
                        //     onChange:this.handleCheckSupplyGoods.bind(this)
                        // }}
                        loading={isTableLoading}
                        expandedRowRender={expandTable}
                        pagination={{
                            current: currentPage,
                            pageSize,
                            onChange: this.handleChangePage.bind(this),
                            onShowSizeChange: this.handleChangePageSize.bind(this),
                            showSizeChanger: true,
                            showQuickJumper: false,
                            total,
                            showTotal: total => `共 ${total} 个结果`,
                        }}
                    />
                </Card>
            </PageHeaderLayout>
        )
    }

}
