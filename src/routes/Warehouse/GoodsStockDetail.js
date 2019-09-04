import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Row, Input, Table, DatePicker,Col, Checkbox, Tooltip } from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import globalStyles from '../../assets/style/global.less';
import styles from './GoodsStockDetail.less';
import moment from 'moment';

const { RangePicker } = DatePicker;
const { Search } = Input;

@connect(state => ({
    goodsStockDetail: state.goodsStockDetail,
}))
export default class goodsStockDetail extends PureComponent {
    componentDidMount() {
        console.log("11",this.props.match.params.id)
        const { dispatch } = this.props;
        dispatch({
            type: 'goodsStockDetail/getList',
            payload: {
                id:this.props.match.params.id,
            }
        });
    }
    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'goodsStockDetail/unmount',
        });
    }
    
    handleSearchStockList=(type,e,dataStrings)=>{
        const { dispatch } = this.props;
        switch(type) {
            case "orderSn":
            case "stockType":
            dispatch({
                type: 'goodsStockDetail/getList',
                payload: {
                    [type]: e,
                    currentPage:1,
                }
              });
            break;
            case "createTime":
            dispatch({
                type: 'goodsStockDetail/getList',
                payload: {
                    createTimeStart:dataStrings[0],
                    createTimeEnd:dataStrings[1],
                    currentPage:1,
                }
              });
            break;
        }
    }
    // 换页回调
    handleChangePage=(value)=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'goodsStockDetail/getList',
            payload: {
                currentPage:value
            },
        });

    }
    handleChangePageSize=(_,pageSize)=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'goodsStockDetail/getList',
            payload: {
                pageSize,
                currentPage:1,
            },
        });

    }
 
  render() {
    const {
        goodsStockDetail: {
            stockRecordList,
            isTableLoading,
            goodsSn,
            goodsName,
            immNum,
            canUseNum,
            occupyNum,
            totalImportNum,
            totalExportNum,
            totalOrderOccupyNum,
            totalManMadeOccupyNum,
            createTimeStart,
            createTimeEnd,
            currentPage,
            pageSize,
            total,
      },
    } = this.props;
    const columns =[
        {
            title: '库存变动时间',
            dataIndex: 'createTime',
            key: 'createTime',
        },
        {
            title: '即时库存',
            dataIndex: 'immNum',
            key: 'immNum',
        },
        {
            title: '总占用库存',
            dataIndex: 'occNum',
            key: 'occNum',
        },
        {
            title: '入库数',
            dataIndex: 'importNum',
            key: 'importNum',
        },
        {
            title: '出库数',
            dataIndex: 'exportNum',
            key: 'exportNum',
        },
        {
            title: '订单占用数',
            dataIndex: 'orderOccupyNum',
            key: 'orderOccupyNum',
            width:130,
        },
        {
            title: '人工占用数',
            dataIndex: 'manMadeOccupyNum',
            key: 'manMadeOccupyNum',
            width:140,
        },
        {
            title: '关联子单号',
            dataIndex: 'orderSn',
            key: 'orderSn',
            width:150,
            render:(orderSn)=>{
                return <p style={{margin:0}}>{orderSn}</p>
            }
           
        },
        {
            title: '操作人',
            dataIndex: 'createBy',
            key: 'createBy',
            width:150,
        },
        {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
            width:200,
            render:(remark)=>{
                return <Tooltip title={remark}>
                    <p style={{width:150,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",margin:0}}>{remark}</p>
                </Tooltip>
            }
        },
    ];
     
   
    return (
      <PageHeaderLayout title="商品库存变更流水">
        <Card bordered={false}>
        <Row
         style={{marginBottom:10}}
          >
           <Col span={10}>
                <span style={{display:"inline-block",paddingTop:5,marginLeft:10}}>库存变动时间：</span>
                <RangePicker 
                    style={{width:240}}
                    format="YYYY-MM-DD"
                    className={globalStyles['rangePicker-sift']}
                    value={[createTimeStart? moment(createTimeStart, 'YYYY-MM-DD') : '', createTimeEnd? moment(createTimeEnd, 'YYYY-MM-DD') : '']}
                      onChange={this.handleSearchStockList.bind(this,"createTime")}
                />
                <Search
                    className={globalStyles['input-sift']}
                    placeholder="总单号/子单号"
                      onSearch={this.handleSearchStockList.bind(this,"orderSn")}
                    />
           </Col>
           <Col span={14}>
                <Row>
                    <Col span={2}>类型：</Col>
                    <Col span={20}>
                        <Checkbox.Group onChange={this.handleSearchStockList.bind(this,"stockType")} defaultValue={["1","2","3","4"]}>
                            <Checkbox value="1">入库</Checkbox>
                            <Checkbox value="2">出库</Checkbox>
                            <Checkbox value="3">订单占用</Checkbox>
                            <Checkbox value="4">人工占用</Checkbox>
                        </Checkbox.Group>
                    </Col>

                </Row>
               
           </Col>
          </Row>
          <Row style={{marginBottom:20}}>
              <Col span={3}>
              条码：<span style={{fontWeight:'bold'}}>{goodsSn}</span>
              </Col>
              <Col span={10}>
              商品名称：<span style={{fontWeight:'bold'}}>{goodsName}</span>
              </Col>
              <Col span={3}>
              即时库存：<span style={{fontWeight:'bold'}}>{immNum}</span>
              </Col>
              <Col span={3}>
              可用库存：<span style={{fontWeight:'bold'}}>{canUseNum}</span>
              </Col>
              <Col span={3}>
              占用库存：<span style={{fontWeight:'bold'}}>{occupyNum}</span>
              </Col>
          </Row>
          <Row style={{background:"#f2f2f2",height:120,marginBottom:20}}>
              <Col span={5} style={{height:120,borderRight:"1px solid #fff",paddingTop:30}} type="flex" align="middle">
                <p className={styles.colFont}>{totalImportNum}</p>
                <p>总入库数</p>
              </Col>
              <Col span={6} style={{height:120,borderRight:"1px solid #fff",paddingTop:30}} type="flex" align="middle">
                <p className={styles.colFont}>{totalExportNum}</p>
                <p>总出库数</p>
              </Col>
              <Col span={6} style={{height:120,borderRight:"1px solid #fff",paddingTop:30}} type="flex" align="middle">
                <p className={styles.colFont}>{totalOrderOccupyNum}</p>
                <p>总订单占用数</p>
              </Col>
              <Col span={6} style={{height:120,paddingTop:30}} type="flex" align="middle">
                <p className={styles.colFont}>{totalManMadeOccupyNum}</p>
                <p>总人工占用数</p>
              </Col>
          </Row>
          <Table 
            columns={columns}
            dataSource={stockRecordList}
            loading={isTableLoading}
            bordered
            pagination={{
                current: currentPage,
                pageSize,
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
    );
  }
}
