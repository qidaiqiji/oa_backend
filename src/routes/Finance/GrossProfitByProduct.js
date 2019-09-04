import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Input, Select,Table, DatePicker, Radio, Tooltip, Button, Icon } from 'antd';
import { Link, routerRedux } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import globalStyles from '../../assets/style/global.less';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
@connect(state => ({
    grossProfitByProduct: state.grossProfitByProduct,
}))
export default class GrossProfitByProduct extends PureComponent {
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'grossProfitByProduct/getConfig',
        });
        dispatch({
            type: 'grossProfitByProduct/getList',
        });
        
    }
    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'grossProfitByProduct/unmountReducer',
        });
    }
    handleChangeMenu=(e)=>{
        const { dispatch } = this.props;
        const menuId = e;
        dispatch(routerRedux.push(menuId));
    }
    handleChangeSearchKeyWords=(type,e)=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'grossProfitByProduct/updatePageReducer',
            payload:{
                [type]:e.target.value
            }
        });
    }
    handleSearchItems=(type,e)=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'grossProfitByProduct/getList',
            payload:{
                [type]:e,
                currentPage:1,
            }
        });
    }
    handleChangeDate=(data,dataString)=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'grossProfitByProduct/getList',
            payload:{
                startDate: dataString[0],
                endDate: dataString[1],
                currentPage:1,
            }
        });
    }
    handleChangeRadio=(type,e)=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'grossProfitByProduct/getList',
            payload:{
                [type]:e.target.value,
                currentPage:1,
            }
        });
    }
    handleOnTableChange=(pagination,filters,sorter)=>{
        const { dispatch } = this.props;
        if(sorter.order === "ascend") {
            dispatch({
                type: 'grossProfitByProduct/getList',
                payload: {
                    sort:4,
                    order:sorter.field,
                }
            });
        }else if(sorter.order === "descend") {
            dispatch({
                type: 'grossProfitByProduct/getList',
                payload: {
                    sort:3,
                    order:sorter.field,
                }
            });
        }
    }
    // 换页回调
    handleChangeCurPage=(currentPage)=> {
        const { dispatch } = this.props;
        dispatch({
            type: 'grossProfitByProduct/getList',
            payload: {
                currentPage,
            },
        });
    }
    handleChangePageSize=(curPage, pageSize)=> {
        const { dispatch } = this.props;
        dispatch({
            type: 'grossProfitByProduct/getList',
            payload: {
                currentPage: 1,
                pageSize,
            },
        });
    }
  
  render() {
    const {
        isTableLoading,
        actionList,
        orderGoodsList,
        profitRate,
        profitTotalAmount,
        purchaseTotalCost,
        totalAmount,
        totalGoodsNum,
        menuId,
        endDate,
        startDate,
        orderSource,
        orderType,
        isCardLoading,
        orderGoodsTypeMap,
        orderGroupTypeMap,
        total,
        currentPage,
        pageSize,
    } = this.props.grossProfitByProduct;
    function fmoney(s, n) {
        n = n > 0 && n <= 20 ? n : 2;
        s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
        let l = s.split(".")[0].split("").reverse(), r = s.split(".")[1];
        let t = "";
        for (let i = 0; i < l.length; i++) {
            t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
        }
        return t.split("").reverse().join("") + "." + r;
    }
    const menuMap = {
        "/finance/gross-profit/gross-profit-by-product":"按商品统计毛利",
        "/finance/gross-profit/gross-profit-by-sort":"按品类统计毛利",
        "/finance/gross-profit/gross-profit-by-customer":"按客户统计毛利",
        "/finance/gross-profit/gross-profit-by-saler":"按销售员统计毛利",
    }
    const columns = [
      {
        title: '关联订单',
        dataIndex: 'orderSn',
        key: 'orderSn',
        align: 'center',
        render:(orderSn,record)=>{
            return <div>
               <p style={{margin:0}}><Link to={`/sale/sale-order/sale-order-list/sale-order-detail/${record.orderGroupId}`}>{orderSn}</Link></p>
                {
                    record.tag.map(item=>{
                        return <span style={{background:item.color}} className={globalStyles.tag} key={item}>{item.name}</span>
                    })
                }
            </div>
        }
      },
      {
        title: '商品名称',
        dataIndex: 'goodsName',
        key: 'goodsSgoodsNamen',
        align: 'center',
        width:200,
      },
      {
        title: '商品条码',
        dataIndex: 'goodsSn',
        key: 'goodsSn',
        align: 'center',
      },
      {
        title: '销售价',
        dataIndex: 'salePrice',
        key: 'salePrice',
        align: 'center',
        render:(salePrice,record)=>{
            return <div>
                <p style={{margin:0}}>{salePrice}</p>
                {
                    salePrice == record.shopPrice?'':<span style={{color:"#a09f9f"}}>
                        <span style={{display:'inline-block',width:6,height:6,borderRadius:3,marginRight:4,background:salePrice-record.shopPrice>0?'green':'red'}}></span>
                        {
                            salePrice-record.shopPrice>0?`高${(salePrice-record.shopPrice).toFixed(2)}`:`低${Math.abs(salePrice-record.shopPrice).toFixed(2)}`
                        }
                    </span>
                }
            </div>
        }
      },
      {
        title: '销售数量',
        dataIndex: 'saleNum',
        key: 'saleNum',
        align: 'center',
        render:(saleNum,record)=>{
            return <div>
                <p style={{width:100,textAlign:'center',margin:0,display:'inline-block'}}>{saleNum}</p>
                {
                    <Tooltip title={<div>
                        <div>
                            {
                                +record.saleNumRemark.realSaleNum?`实际数量：${record.saleNumRemark.realSaleNum}`:""
                            }
                        </div>
                        <div>
                            {
                                +record.saleNumRemark.backNum?`售后数量：${record.saleNumRemark.backNum}`:""
                            }
                        </div>
                    </div>}>
                    {
                        +record.saleNumRemark.backNum?<Icon type="exclamation-circle" style={{ color: '#fbad14' }}/>:""
                    }
                    </Tooltip>
                }
            </div>
        }
      },
      {
        title: '销售收入',
        dataIndex: 'saleAmount',
        key: 'saleAmount',
        align: 'center',
        render:(saleAmount,record)=>{
            return <div>
                <p style={{width:100,textAlign:'center',margin:0,display:'inline-block'}}>{saleAmount}</p>
                {
                    <Tooltip title={<div>
                        {
                            record.saleAmountRemark.map(item=>{
                                return <div>
                                    <div>
                                        {
                                            +item.saleTotalAmount?`销售金额：${item.saleTotalAmount}`:""
                                        }
                                    </div>
                                    <div>
                                        {
                                            +item.backAmount?`售后金额：${item.backAmount}`:""
                                        }
                                    </div>
                                    <div>
                                        {
                                            +item.discountAmount?`打折金额：${item.discountAmount}`:""
                                        }
                                    </div>
                                    <div>
                                        {
                                            +item.discountNum?`打折数量：${item.discountNum}`:""
                                        }
                                    </div>
                                </div>
                            })
                        }
                    </div>}>
                    {
                        record.tag.some(item=>item.name == "售后")?<Icon type="exclamation-circle" style={{ color: '#fbad14' }}/>:null
                    }
                    </Tooltip>
                }
            </div>
        }
      },
      {
        title: '采购价',
        dataIndex: 'purchasePrice',
        key: 'purchasePrice',
        align: 'center',
      },
      {
        title: '采购成本',
        dataIndex: 'purchaseCostAmount',
        key: 'purchaseCostAmount',
        align: 'center',
      },
      {
        title: '毛利单价',
        dataIndex: 'profitPrice',
        key: 'profitPrice',
        align: 'center',
        sorter:true,
      },
      {
        title: '毛利总额',
        dataIndex: 'profitAmount',
        key: 'profitAmount',
        align: 'center',
        sorter:true,
      },
      {
        title: '毛利率',
        dataIndex: 'profitRate',
        key: 'profitRate',
        align: 'center',
        sorter:true,
        render:(profitRate)=>{
            return <span>{(profitRate*100).toFixed(2)}%</span>
        }
      },
    ];
    return (
      <PageHeaderLayout 
      title="毛利管理"
      iconType="question-circle"
      tips={
        <div>
            <p>销售价=实际销售卖出的销售价</p>
            <p>销售数量=实际销售卖出数量-售后数量（实际已发货的数量）</p>
            <p>售后数量针对退款退货，退款不退货（未发货,打折退款不计算扣减售后数量</p>
            <p>销售收入=（销售价*实际销售卖出数量（发货数量））-售后金额</p>
            <p>售后金额=退货售后数量*售后金额+打折退款售后金额</p>
            <p>采购价使用移动加权平均，每次采购入库的采购价’移动加权平均法‘算商品成本。</p>
            <p>采购成本=销售数量*采购价</p>
            <p>毛利单价=毛利总额/销售数量</p>
            <p>毛利总额=销售收入-采购成本</p>
            <p>利润率=毛利总额/销售收入</p>
            <p>毛利额贡献度=对应对象的毛利/所有对象的总毛利*100%</p>
        </div>
        }
      >
        <Card bordered={false} >
            <Row gutter={16} style={{ margin: '10px 0' }}>
                <Col span={20}>
                    <Select
                        value={menuId}
                        style={{width:200,marginRight:10}}
                        onChange={this.handleChangeMenu}
                    >
                        {
                            Object.keys(menuMap).map(menuId=>{
                                return <Option key={menuId}>{menuMap[menuId]}</Option>
                            })
                        }
                    </Select>
                    <Search
                        placeholder="请输入商品名称/商品条码"
                        style={{width:240,marginRight:10}}
                        onChange={this.handleChangeSearchKeyWords.bind(this,'goodsKeywords')}
                        onSearch={this.handleSearchItems}
                    />
                    <Search
                        placeholder="请输入订单号"
                        className={globalStyles['input-sift']}
                        onChange={this.handleChangeSearchKeyWords.bind(this,'saleOrderSn')}
                        onSearch={this.handleSearchItems}
                    />
                    <RangePicker
                        className={globalStyles['rangePicker-sift']}
                        format="YYYY-MM-DD"
                        onChange={this.handleChangeDate}
                        value={[startDate ? moment(startDate, 'YYYY-MM-DD') : null, endDate ? moment(endDate, 'YYYY-MM-DD') : null]}
                    />
                </Col>
                <Col span={4} align="end">
                    {
                        actionList.map(item=>{
                            return <a href={item.url} target="_blank"><Button type="primary">{item.name}</Button></a>
                        })
                    }
                </Col>
            </Row>
            <Row gutter={16}>
                <RadioGroup onChange={this.handleChangeRadio.bind(this,'orderType')} defaultValue={orderSource}>
                    <RadioButton value="-1">全部</RadioButton>
                    {
                        Object.keys(orderGoodsTypeMap).map(item=>{
                            return <RadioButton value={item}>{orderGoodsTypeMap[item]}</RadioButton>
                        })
                    }
                </RadioGroup>
                <RadioGroup onChange={this.handleChangeRadio.bind(this,'orderSource')} defaultValue={orderType}>
                    <RadioButton value="-1">全部</RadioButton>
                    {
                        Object.keys(orderGroupTypeMap).map(item=>{
                            return <RadioButton value={item}>{orderGroupTypeMap[item]}</RadioButton>
                        })
                    }
                </RadioGroup>
            </Row>
            <Card
            bordered={false}
            loading={isCardLoading}
            className={globalStyles.globalCard}
            >
                <Row style={{border:'1px solid #f2f2f2',height:120}}>
                    <Col span={8} style={{height:120,padding:'20px 0'}} type="flex" align="middle">
                        <div style={{height:'100%',borderRight:'1px solid #f2f2f2'}}>
                            <p style={{margin:0,fontSize:14,paddingTop:20}}>销售数量 / 销售收入</p>
                            <p style={{margin:0,fontSize:22,fontWeight:'bold'}}>{`${fmoney(totalGoodsNum,2)}/${fmoney(totalAmount,2)}`}</p>
                        </div>
                    </Col>
                    <Col span={8} style={{height:120,padding:'20px 0'}} type="flex" align="middle">
                        <div style={{borderRight:'1px solid #f2f2f2'}}>
                            <p style={{margin:0,fontSize:14,paddingTop:20}}>采购成本</p>
                            <p style={{margin:0,fontSize:22,fontWeight:'bold'}}>{fmoney(purchaseTotalCost,2)}</p>
                        </div>
                    </Col>
                    <Col span={8} style={{height:120,padding:'20px 0'}} type="flex" align="middle">
                        <div style={{borderRight:'1px solid #f2f2f2'}}>
                            <p style={{margin:0,fontSize:14,paddingTop:20}}>毛利总额 / 毛利率</p>
                            <p style={{margin:0,fontSize:22,fontWeight:'bold'}}>{`${fmoney(profitTotalAmount,2)}/${(profitRate*100).toFixed(2)}%`}</p>
                        </div>
                    </Col>
                </Row>
            </Card>
            <Table
              bordered
              loading={isTableLoading}
              dataSource={orderGoodsList}
              columns={columns}
              onChange={this.handleOnTableChange}
              pagination={{
                current: currentPage,
                pageSize,
                onShowSizeChange: this.handleChangePageSize,
                onChange: this.handleChangeCurPage,
                showSizeChanger: true,
                pageSizeOptions: ['40', '50', '60', '80', '100', '120', '150', '200', '300'],
                total,
                showTotal:total => `共 ${total} 个结果`,
              }}
            />
        </Card>
      </PageHeaderLayout>
    );
  }
}
