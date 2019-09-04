import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Card,
  Row,
  Col,
  DatePicker,
  Input,
  Select,
  Button,
  Radio,
  Icon,
  Tabs,
  Modal,
  Table,
  Affix,
  Tooltip,
  Alert,
} from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './SupplierCheckDetail.less';
import img from '../../assets/u2741.png';
import globalStyles from '../../assets/style/global.less';
import TextArea from 'antd/lib/input/TextArea';
const TabPane = Tabs.TabPane;
const { RangePicker } = DatePicker;
@connect(state => ({
  supplierCheckDetail: state.supplierCheckDetail,
}))
export default class SupplierCheckDetail extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    const { id } = this.props.match.params;
    dispatch({
      type: 'supplierCheckDetail/getSupplierInfo',
      payload: {
        id,
      },
    });
    dispatch({
      type: 'supplierCheckDetail/getBrandInfoList',
    });
    dispatch({
      type: 'supplierCheckDetail/getRecordList',
    });
    dispatch({
      type: 'supplierCheckDetail/getConfig',
    });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierCheckDetail/unmount',
    });
  }
  // 换页
  handleChangePage(type,page) {
    const { dispatch } = this.props;
    switch(type) {
      case 'recordCurPage':
      dispatch({
        type: 'supplierCheckDetail/updatePageReducer',
        payload: {
          [type]: page,
        },
      });
      break;
      case 'currentPage':
      dispatch({
        type: 'supplierCheckDetail/getBrandInfoList',
        payload: {
          [type]: page,
        },
      });
      break;
    }
    
  }
  handleChangePageSize=(type,_,pageSize)=>{
      const { dispatch } = this.props;
      switch(type) {
        case 'recordPageSize':
        dispatch({
          type: 'supplierCheckDetail/updatePageReducer',
          payload: {
            recordPageSize: pageSize,
            recordCurPage:1,
          },
        });
        break;
        case 'pageSize':
        dispatch({
          type: 'supplierCheckDetail/getBrandInfoList',
          payload: {
            [type]: pageSize,
            currentPage:1,
          },
        });
        break;
      }
      
  }
  handleChangeDate=(data,dataString)=>{
    const { dispatch } = this.props;
    dispatch({
      type:'supplierCheckDetail/getBrandInfoList',
      payload:{
        changeTimeStart: dataString[0],
        changeTimeEnd: dataString[1],
        currentPage:1,
      }
    })
  }
  handlePreviewAttachment=(previewUrl)=>{
    const { dispatch } = this.props;
    dispatch({
      type:'supplierCheckDetail/updatePageReducer',
      payload:{
        previewModal:true,
        previewUrl,
      }
    })
  }
  handleCloseModal=(type)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierCheckDetail/updatePageReducer',
      payload: {
        [type]:false,
      },
    });
  }
  handleOperation=(actionType,actionUrl)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierCheckDetail/updatePageReducer',
      payload: {
        actionType,
        actionUrl,
        isShowConfirmModal:true,
      },
    });
  }
  handleChangeKeyWords=(type,e)=>{
    const { dispatch } = this.props;
    switch(type){
      case 'rejectRemark':
        dispatch({
          type:'supplierCheckDetail/updatePageReducer',
          payload:{
            [type]:e.target.value,
          }
        })
      break;
      default:
        dispatch({
          type:'supplierCheckDetail/getBrandInfoList',
          payload:{
            [type]:e,
            currentPage:1,
          }
        })
      break;
    }
    
  }
  // 确认审核通过/驳回
  handleConfirmOperation=()=>{
    const { dispatch } = this.props;
    dispatch({
      type:'supplierCheckDetail/confirmOperation',
    })
  }

  // ------------品牌商品日志---------------
  handleSearchByBrndId=(e)=>{
    const { dispatch } = this.props;
    dispatch({
      type:'supplierCheckDetail/searchByBrndId',
      payload:{
        brandId:e,
        purchaseSupplierGoodsId: "",
      }
    })
    dispatch({
      type:'supplierCheckDetail/getBrandInfoList',
      payload:{
        currentPage:1,
      }
    })

  }
  
    render() {
      const {
        supplierCheckDetail: {
          supplierName,
          mobile,
          supplierProperty,
          contractExpireDateStart,
          contractExpireDateEnd,
          contact,
          supplierLevel,
          isSign,
          remark,
          brandList,
          payMethod,
          supplierNameIsChange,
          mobileIsChange,
          contractExpireDateEndIsChange,
          contractExpireDateStartIsChange,
          supplierPropertyIsChange,
          contractListIsChange,
          payInfoListIsChange,
          purchaseGoodsList,
          payInfoList,
          recordCurPage,
          recordPageSize,
          currentPage,
          pageSize,
          id,
          payMethodMap,
          supplierPropertyMap,
          contractList,
          previewModal,
          previewUrl,
          recordList,
          supplierLevelMap,
          purchaserMap,
          contactIsChange,
          status,
          brandStatus,   
          recordTotal,  
          actionList,
          brandActionList,     
          isShowConfirmModal,
          actionType,
          actionUrl,
          goodsChangeTypeMap,
          brandListMap,
          goodsSnMap,
          purchaseSupplierGoodsId,
          total,
          supplierGoodsAllPayMethodMap,
        },
      } = this.props;
      let startIndex = (recordCurPage-1)*recordPageSize;
      let endIndex = recordCurPage*recordPageSize>=recordTotal?recordTotal:recordCurPage*recordPageSize;
      let currentRecordList = recordList&&recordList.slice(startIndex,endIndex);
      // if(+brandStatus === 3) {
      //   brandList.map(item=>{
      //     item.goodsList.map((goods,index)=>{
      //       if(+goods.isDelete) {
      //         item.goodsList.splice(index,1)
      //       }
      //     })
      //   })
      // }
      if(+status === 2) {
        contractList.map((item,index)=>{
          if(+item.isDelete) {
            contractList.splice(index,1)
          }
        })
      }
      const recordColumns = [
        {
          title: '变更时间',
          dataIndex: 'changeTime',
          key: 'changeTime',
          width:200,
        },
        {
          title: '变更内容',
          dataIndex: 'changeContent',
          key: 'changeContent',
          width:700,
        },
        {
          title: '操作人',
          dataIndex: 'createBy',
          key: 'createBy',
          render:(createBy)=>{
            return <span>{purchaserMap[createBy]}</span>
          }
        },
        {
          title: '审核人',
          dataIndex: 'checkBy',
          key: 'checkBy',
          render:(checkBy)=>{
            return <span>{purchaserMap[checkBy]}</span>
          }
        },
        
      ];
      const brandColumns = [
        {
          title: '变更时间',
          dataIndex: 'changeTime',
          key: 'changeTime',
          width:100,
        },
        {
          title: '品牌',
          dataIndex: 'brandId',
          key: 'brandId',
          render:(brandId)=>{
              return <span>{brandListMap[brandId]}</span>
          }
        },
        {
          title: '条码',
          dataIndex: 'goodsSn',
          key: 'goodsSn',
          width:150,
        },
        {
          title: '商品名称',
          dataIndex: 'goodsName',
          key: 'goodsName',
          width:400,
          // render:(goodsName)=>{
          //   return <Tooltip title={goodsName}><p className={globalStyles.twoLine} style={{width:280}}>{goodsName}</p></Tooltip>
          // }
        },
        {
          title: '变更类型',
          dataIndex: 'changeType',
          key: 'changeType',
          render:(changeType)=>{
              return <span>{goodsChangeTypeMap[changeType]}</span>
          }
        },
        {
          title: '变更前',
          dataIndex: 'changeBeforeValue',
          key: 'changeBeforeValue',
        },
        {
          title: '变更后',
          dataIndex: 'changeAfterValue',
          key: 'changeAfterValue',
        },
        {
          title: '操作人',
          dataIndex: 'createBy',
          key: 'createBy',
          render:(createBy)=>{
            return <span>{purchaserMap[createBy]}</span>
          }
        },
        {
          title: '审核人',
          dataIndex: 'checkBy',
          key: 'checkBy',
          render:(checkBy)=>{
            return <span>{purchaserMap[checkBy]}</span>
          }
        },
        
      ];
      const showDeleteColumns = [
        {
          title: '商品图片',
          dataIndex: 'img',
          key: 'img',
          render: (img,record) => {
            return <div style={{textAlign:'center'}}>
              {
                +brandStatus===3?"":+record.isNew?<span className={styles.newLine}>new!</span>:""
              }
              {
               +brandStatus===3?"":+record.isDelete?<span style={{color:"red",display:'block',fontSize:12}}>即将删除</span>:""
              }
              <img src={img} style={{ width: 50, height: 50 }} />
            </div>
          },
        },
      ];
      const unShowDeleteColumns = [
        {
          title: '商品图片',
          dataIndex: 'img',
          key: 'img',
          render: (img,record) => {
            return <div style={{textAlign:'center'}}>
              <img src={img} style={{ width: 50, height: 50 }} />
            </div>
          },
        },
      ];
      const columns = [
        {
          title: '商品名称',
          dataIndex: 'goodsName',
          key: 'goodsName',
          width: 150,
          render:(goodsName)=>{
            return <Tooltip title={goodsName}><p className={globalStyles.twoLine} style={{width:130}}>{goodsName}</p></Tooltip>
          }
        },
        {
          title: '条码',
          dataIndex: 'goodsSn',
          key: 'goodsSn',
          width: 80,
        },
        {
          title: '零售价',
          dataIndex: 'marketPrice',
          key: 'marketPrice',
          width: 80,
          render:(marketPrice,record)=>{
            return <div className={styles.line}>
              <span>{parseFloat(marketPrice)}</span>
              {
                +brandStatus===3?"":+record.changeBeforeMarketPrice?<Tooltip title={`变更前：${record.changeBeforeMarketPrice}`}>
                    <Icon type="warning" style={{color:'#f60'}}/>
                </Tooltip>:""
              }
            </div>
          }
        },
        {
          title: '平台售价',
          dataIndex: 'shopPrice',
          key: 'shopPrice',
          width: 80,
          render:(shopPrice,record)=>{
            return <div className={styles.line}>
              <span>{parseFloat(shopPrice)}</span>
              {
                +brandStatus===3?"":+record.changeBeforeShopPrice?<Tooltip title={`变更前：${record.changeBeforeShopPrice}`}>
                    <Icon type="warning" style={{color:'#f60'}}/>
                </Tooltip>:""
              }
            </div>
          }
        },
        {
          title: '含税进价',
          dataIndex: 'purchaseTaxPrice',
          key: 'purchaseTaxPrice',
          width: 90,
          render:(purchaseTaxPrice,record)=>{
            return <div className={styles.line}>
              <span>{parseFloat(purchaseTaxPrice)}</span>
              {
                +brandStatus===3?"":+record.changeBeforePurchaseTaxPrice?<Tooltip title={`变更前：${record.changeBeforePurchaseTaxPrice}`}>
                    <Icon type="warning" style={{color:'#f60'}}/>
                </Tooltip>:""
              }
            </div>
          }
        },
        {
          title: '未税进价',
          dataIndex: 'purchasePrice',
          key: 'purchasePrice',
          width: 90,
          render:(purchasePrice,record)=>{
            return <div className={styles.line}>
              <span>{parseFloat(purchasePrice)}</span>
              {
                +brandStatus===3?"":+record.changeBeforePurchasePrice?<Tooltip title={`变更前：${record.changeBeforePurchasePrice}`}>
                    <Icon type="warning" style={{color:'#f60'}}/>
                </Tooltip>:""
              }
            </div>
          }
        },
        {
          title: '含税返利后进价',
          dataIndex: 'taxRebatePurchasePrice',
          key: 'taxRebatePurchasePrice',
          width: 90,
          render:(taxRebatePurchasePrice,record)=>{
            return <div className={styles.line}>
              <span>{taxRebatePurchasePrice}</span>
              {
                +brandStatus===3?"":+record.changeBeforeTaxRebatePurchasePrice?<Tooltip title={`变更前：${record.changeBeforeTaxRebatePurchasePrice}`}>
                <Icon type="warning" style={{color:'#f60'}}/>
              </Tooltip>:""
              }
            </div>
          }
        },
        {
          title: '不含税返利后进价',
          dataIndex: 'rebatePurchasePrice',
          key: 'rebatePurchasePrice',
          width: 90,
          render:(rebatePurchasePrice,record)=>{
            return <div className={styles.line}>
              <span>{rebatePurchasePrice}</span>
              {
                +brandStatus===3?"":+record.changeBeforeRebatePurchasePrice?<Tooltip title={`变更前：${record.changeBeforeRebatePurchasePrice}`}>
                <Icon type="warning" style={{color:'#f60'}}/>
              </Tooltip>:""
              }
            </div>
          }
        },
        {
          title: '结算方式',
          dataIndex: 'payMethod',
          key: 'payMethod',
          width:170,
          render:(payMethod,record)=>{
            return <div className={styles.line} style={{width:150}}>
              <span>{supplierGoodsAllPayMethodMap[payMethod]}</span>
              {
                +brandStatus===3?"":+record.changeBeforePayMethod?<Tooltip title={`变更前：${supplierGoodsAllPayMethodMap[record.changeBeforePayMethod]}`}>
                    <Icon type="warning" style={{color:'#f60'}}/>
                </Tooltip>:""
              }
            </div>
          }
        },
        {
          title: '条码政策',
          dataIndex: 'snPolicy',
          key: 'snPolicy',
          width:100,
          render:(snPolicy,record)=>{
            return <div className={styles.line} style={{width:100}}>
                <Tooltip title={snPolicy}>
                  {
                      snPolicy?(<img 
                      className={styles.logo}
                      src={img} alt="条码政策"></img>):null
                  }    
              </Tooltip>
              {
                +brandStatus===3?"":record.changeBeforeSnPolicy?<Tooltip title={`变更前：${record.changeBeforeSnPolicy}`}>
                    <Icon type="warning" style={{color:'#f60'}}/>
                </Tooltip>:""
              }
            </div>
          }
        },
        {
          title: '控价要求',
          dataIndex: 'requestPrice',
          key: 'requestPrice',
          render:(requestPrice,record)=>{
            return <div className={styles.line}>
              <span>{parseFloat(requestPrice)}</span>
              {
                +brandStatus===3?"":+record.changeBeforeRequestPrice?<Tooltip title={`变更前：${record.changeBeforeRequestPrice}`}>
                    <Icon type="warning" style={{color:'#f60'}}/>
                </Tooltip>:""
              }
            </div>
          }
        },
        
        {
          title: '采购运费政策',
          dataIndex: 'shippingPolicy',
          key: 'shippingPolicy',
          render:(shippingPolicy,record)=>{
            return <div className={styles.line}>
              <span>{shippingPolicy}</span>
              {
                +brandStatus===3?"":record.changeBeforeShippingPolicy?<Tooltip title={`变更前：${record.changeBeforeShippingPolicy}`}>
                    <Icon type="warning" style={{color:'#f60'}}/>
                </Tooltip>:""
              }
            </div>
          }
        },
        {
          title: '发货地',
          dataIndex: 'shippingPlace',
          key: 'shippingPlace',
          render:(shippingPlace,record)=>{
            return <div className={styles.line}>
              <span>{shippingPlace}</span>
              {
                +brandStatus===3?"":record.changeBeforeShippingPlace?<Tooltip title={`变更前：${record.changeBeforeShippingPlace}`}>
                    <Icon type="warning" style={{color:'#f60'}}/>
                </Tooltip>:""
              }
            </div>
          }
        },
        {
          title: '条码备注',
          dataIndex: 'goodsRemark',
          key: 'goodsRemark',
        },
      ];
      return (
        <PageHeaderLayout
          title={"供应商详情页"}
      >
          <Card bordered={false}>
            <Tabs
        >
            <TabPane tab="供应商信息" key="1">
              <Row type="flex" justify="end" style={{ paddingRight: 100 }}>
            </Row>
              <Card title="基础信息" style={{ marginTop: 20 }}>
              <Row gutter={{ md: 24 }} style={{ marginBottom: 10}}>
                <Col md={10}>
                    <Row style={{ marginTop: 10 }} align="middle" type="flex">
                        <Col span={5} align="right">
                            <span style={{ color: 'red' }}>*</span>供应商名称:
                          </Col>
                        <Col span={19} align="left">
                         <span className={styles.value}>{supplierName}</span>
                          {
                            +status === 2?"":+supplierNameIsChange?<div style={{marginLeft:10,display:'inline-block'}}>
                              <Icon type="warning" style={{color:'#f60'}}/>
                              <span className={styles.warnings}>供应商名称发生了变更</span>
                            </div>:null
                          }
                          </Col>
                          
                      </Row>
                      <Row style={{ marginTop: 20}} type="flex" align="middle">
                        <Col span={5} align="right">
                            <span style={{ color: 'red' }}>*</span><span>手机号:</span>
                          </Col>
                        <Col span={19} align="left">
                          <span className={styles.value}>{mobile}</span>
                          {
                            +status === 2?"":+mobileIsChange?<div style={{marginLeft:10,display:'inline-block'}}>
                              <Icon type="warning" style={{color:'#f60'}}/>
                              <span className={styles.warnings}>手机号发生了变更</span>
                            </div>:null
                          }
                            
                          </Col>
                      </Row>
                   
                      <Row style={{ marginTop: 20}} type="flex" align="middle">
                        <Col span={5} align="right">
                          <span style={{ color: 'red' }}>*</span><span>合同是否签订:</span>
                        </Col>
                        <Col span={19}><span className={styles.value}>{isSign?"是":"否"}</span></Col>
                      </Row>
                      <Row style={{ marginTop: 20}} type="flex" align="middle">
                        <Col span={5} align="right"><span style={{ color: 'red' }}>*</span>合同信息:</Col>
                        {
                         +status === 2?"":+contractListIsChange?<div style={{marginLeft:10,display:'inline-block'}}>
                            <Icon type="warning" style={{color:'#f60'}}/>
                            <span className={styles.warnings}>合同信息发生了变更</span>
                          </div>:null
                        }
                      </Row>
                  </Col>
                <Col md={10} offset={1}>
                  <Row style={{ marginTop: 20}} type="flex" align="middle">
                        <Col span={6} align="right">
                          <span style={{ color: 'red' }}>*</span><span>联系人:</span>
                          </Col>
                        <Col span={18} align="left">
                          <span className={styles.value}>{contact}</span>
                          {
                            +status === 2?"":+contactIsChange?<div style={{marginLeft:10,display:'inline-block'}}>
                            <Icon type="warning" style={{color:'#f60'}}/>
                            <span className={styles.warnings}>联系人发生了变更</span>
                          </div>:null
                          }
                          </Col>
                      </Row>
                      <Row style={{ marginTop: 20}} type="flex" align="middle">
                        <Col span={6} align="right">
                            <span style={{ color: 'red' }}>*</span><span>供应商性质:</span>
                          </Col>
                        <Col span={18} align="left">
                          <span className={styles.value}>{supplierPropertyMap[supplierProperty]}</span>
                          {
                           +status === 2?"":+supplierPropertyIsChange?<div style={{marginLeft:10,display:'inline-block'}}>
                            <Icon type="warning" style={{color:'#f60'}}/>
                            <span className={styles.warnings}>供应商性质发生了变更</span>
                          </div>:null
                          }
                            
                          </Col>
                      </Row>
                      <Row style={{ marginTop: 20}} type="flex" align="middle">
                        <Col span={6} align="right">
                          <span style={{ color: 'red' }}>*</span><span>合同到期时间:</span>
                          </Col>
                        <Col span={18} align="left">
                          <span className={styles.value}>{`${contractExpireDateStart}/${contractExpireDateEnd}`}</span>
                          {
                            +status === 2?"":+contractExpireDateEndIsChange||+contractExpireDateStartIsChange?<div style={{marginLeft:10,display:'inline-block'}}>
                            <Icon type="warning" style={{color:'#f60'}}/>
                            <span className={styles.warnings}>到期时间发生了变更</span>
                          </div>:null
                          }
                          </Col>
                      </Row>
                  </Col>
              </Row>
              <Row>
              {
                contractList.map((item)=>{
                  return <Row className={styles.attachment} key={item.id}>
                      {
                        item.attachementList.map(attachementUrl=>{
                            return <div className={styles.imgBox} key={attachementUrl.id}>
                              <img src={attachementUrl.url}/>
                              <div className={styles.cover}>
                                <Icon type="eye" style={{fontSize:24,color:"#fff"}} onClick={this.handlePreviewAttachment.bind(this,attachementUrl.url)}/>
                              </div>
                            </div>
                        })
                      }
                      <span>上传时间：{item.createTime}</span>
                      <span>合同编号：{item.contractNo}</span>
                      {
                        +item.isDelete?<span style={{color:"red"}}>即将被删除!</span>:""
                      }
                  </Row>
                })
              }
              </Row>
              <Row>
                
              </Row>
            </Card>
              <Card title={<div><span style={{ color: 'red' }}>*</span>付款信息<span style={{color:'#666',fontSize:12}}>(对公/对私必填一项）</span>
                
                  {
                    +status === 2?"":+payInfoListIsChange?<div style={{marginLeft:10,display:'inline-block'}}>
                      <Icon type="warning" style={{color:'#f60'}}/>
                      <span className={styles.warnings}>付款信息发生了变更</span>
                    </div>:null
                  }
              </div>
              } 
              style={{ marginTop: 20 }}>
                <Row style={{marginBottom:10}}>
                  <Alert
                  icon={<Icon type="warning" theme="filled" />}
                  showIcon={true}
                  type="warning"
                  message="某个付款账户信息发生修改且审核通过后，未完结的采购单付款信息也会随着更新"
                  ></Alert>
                </Row>
              {
                payInfoList.map(item=>{
                  return <Row className={styles.payInfo} key={item.id}>
                      {
                        +item.type === 1?<Row style={{ marginBottom: 20, width:'100%' }}>
                          <Col span={2}>对公账户</Col>
                          开户名称：<span>{item.bankName}</span>
                          开户行: <span>{item.bankInfo}</span>
                          银行账户: <span>{item.bankAccount}</span>
                          {
                            +item.isDelete?<span style={{color:"red"}}>即将被删除!</span>:""
                          }
                        </Row>:+status === 2&&item.isDelete?null:<Row style={{ marginBottom: 20, width:'100%'  }}>
                          <Col span={2}>对私账户</Col>
                          开户名称：<span>{item.bankName}</span>
                          开户行: <span>{item.bankInfo}</span>
                          银行账户: <span>{item.bankAccount}</span>
                          {
                            +item.isDelete?<span style={{color:"red"}}>即将被删除!</span>:""
                          }
                      </Row>
                      }
                  </Row>
                })
              }
            </Card>
              <Card title="结算模式" style={{ marginTop: 20 }}>
              <Row>
                <Col span={10}>
                    <Row style={{ marginTop: 10 }}>
                        <Col span={5} align="right">
                          <span style={{ color: 'red' }}>*</span><span>结算模式:</span>
                          </Col>
                        <Col span={19} align="left">
                          <span className={styles.value}>{payMethodMap[payMethod]}</span>
                          </Col>
                      </Row>
                  </Col>
              </Row>
            </Card>
            <Card title="其他信息" style={{ marginTop: 20 }}>
              <Row>
                <Col span={2}>供应商备注:</Col>
                <Col span={22}>
                  <pre>{remark}</pre>
                </Col>
              </Row>
            </Card>
            <Card title="供应商变更日志" style={{ marginTop: 20 }}>
                <Table
                bordered
                dataSource={currentRecordList}
                columns={recordColumns}
                rowKey={record => record.id}
                className={globalStyles.tablestyle}
                pagination={{
                  showTotal:total => `共 ${total} 个结果`,
                  current: recordCurPage,
                  pageSize:recordPageSize,
                  pageSizeOptions:["20","30","40","50","100"],
                  onChange: this.handleChangePage.bind(this,'recordCurPage'),
                  onShowSizeChange: this.handleChangePageSize.bind(this,'recordPageSize'),
                  total:recordTotal,
                  showSizeChanger: true,
                }}
                >
                </Table>
            </Card>
            <Affix offsetBottom={10}>
              
              <Row style={{borderTop:'1px solid #d9d9d9',padding:'20px 0',background:"#fff"}}>
                {
                  actionList.map((item,index)=>{
                      switch(item.type) {
                        case 1:
                          return <Link to={`${item.url}/1`} key={index}><Button type="dashed" style={{ marginRight: 10}}>{item.name}</Button></Link>
                        break;
                        default:
                          return <Button key={index} type="primary" style={{ marginRight: 10}} onClick={this.handleOperation.bind(this,item.type,item.url)}>{item.name}</Button>
                        break;
                      }
                  })
                }
              </Row>
            </Affix>
            </TabPane>
              <TabPane tab="代理品牌" key="2">
                  {
                    brandList.length==0&&<Row style={{minHeight:300,textAlign:"center",marginTop:200}}>暂无数据</Row>
                  }
                  {
                    brandList && brandList.map((brand) => {
                       return (
                         <div key={brand.id}>
                           {
                             +brandStatus === 3&&+brand.isDelete?null:<Card
                             title={<div>品牌信息
                               {
                                 +brandStatus===3?"":+brand.isNew?<span className={styles.new} style={{marginLeft:10}}>new!</span>:""
                               }
                               {
                                 +brand.isDelete?<span style={{marginLeft:10, color:'red',fontSize:12}}>整个品牌即将被删除!</span>:""
                               }
                             </div>}
                             style={{ marginBottom: 20 }}
                             >
                             <Row style={{marginBottom:20}}>
                               <Col md={8}>
                                 <Row style={{ marginTop: 10 }} align="middle" type="flex">
                                     <Col span={4} align="right">
                                               品牌名称:
                                       </Col>
                                     <Col span={20} align="left">
                                         <span style={{ display: 'inline-block', maxWidth: 200, paddingLeft: 20 }}>{brand.brandName}</span>
                                       </Col>
                                   </Row>
                                 <Row style={{ marginTop: 20 }} align="middle" type="flex">
                                     <Col span={4} align="right">
                                          返利政策:
                                         </Col>
                                       <Col span={20} align="left" className={styles.cols}>
                                           <span style={{ display: 'inline-block', maxWidth: 200, paddingLeft: 20 }}>{brand.brandPolicy}</span>
                                           {
                                              +brandStatus === 3?"":brand.changeBeforeBrandPolicy?<div className={styles.cols} style={{marginLeft:10}}>
                                              <Icon type="warning" style={{color:'#f60'}}/>
                                                <span className={styles.warnings}>{`变更前：${brand.changeBeforeBrandPolicy}`}</span>
                                              </div>:null
                                            }
                                         </Col>
                                     </Row>
                               </Col>
                               <Col md={8}>
                                 <Row style={{ marginTop: 10 }} align="middle" type="flex">
                                       <Col span={4} align="right">
                                           指定等级:
                                         </Col>
                                       <Col span={20} align="left" className={styles.cols}>
                                           <span style={{ display: 'inline-block', maxWidth: 200, paddingLeft: 20 }}>{supplierLevelMap[brand.supplierLevel]}</span>
                                           {
                                             +brandStatus === 3?"":+brand.changeBeforeSupplierLevel?<div className={styles.cols} style={{marginLeft:10}}>
                                             <Icon type="warning" style={{color:'#f60'}}/>
                                             <span className={styles.warnings}>{`变更前：${supplierLevelMap[brand.changeBeforeSupplierLevel]}`}</span>
                                           </div>:null
                                           }
                                         </Col>
                                         
                                     </Row>
                                     <Row style={{ marginTop: 20 }} align="middle" type="flex">
                                       <Col span={4} align="right">
                                             品牌备注:
                                         </Col>
                                       <Col span={20} align="left" className={styles.cols}>
                                         <span style={{ display: 'inline-block', maxWidth: 200, paddingLeft: 20 }}>{brand.remark}</span>
                                         {
                                            +brandStatus === 3?"":brand.changeBeforeRemark?<div className={styles.cols} style={{marginLeft:10}}>
                                            <Icon type="warning" style={{color:'#f60'}}/>
                                            <span className={styles.warnings}>{`变更前：${brand.changeBeforeRemark}`}</span>
                                          </div>:null
                                          }
                                         </Col>
                                     </Row>
                               </Col>
                               <Col md={8}>
                                 <Row style={{ marginTop: 10 }} align="middle" type="flex">
                                       <Col span={4} align="right">
                                           入驻费用:
                                         </Col>
                                       <Col span={20} align="left" className={styles.cols}>
                                           <span style={{ display: 'inline-block', maxWidth: 200, paddingLeft: 20 }}>{brand.payMoney}</span>
                                           {
                                             +brandStatus === 3?"":+brand.changeBeforePayMoney?<div className={styles.cols} style={{marginLeft:10}}>
                                               <Icon type="warning" style={{color:'#f60'}}/>
                                               <span className={styles.warnings}>{`变更前：${brand.changeBeforePayMoney}`}</span>
                                             </div>:null
                                           }
                                         </Col>
                                     </Row>
                                     <Row style={{ marginTop: 20 }} align="middle" type="flex">
                                       <Col span={4} align="right">
                                           采购员:
                                         </Col>
                                       <Col span={20} align="left" className={styles.cols}>
                                           <span style={{ display: 'inline-block', maxWidth: 200, paddingLeft: 20 }}>{purchaserMap[brand.purchaser]}</span>
                                           {
                                             +brandStatus === 3?"":+brand.changeBeforePurchaser?<div className={styles.cols} style={{marginLeft:10}}>
                                               <Icon type="warning" style={{color:'#f60'}}/>
                                               <span className={styles.warnings}>{`变更前：${purchaserMap[brand.changeBeforePurchaser]}`}</span>
                                             </div>:null
                                           }
                                       </Col>
                                     </Row>
                               </Col>
                             </Row>
                             {
                                 brand.goodsList.length > 0 ? (<Table
                                   dataSource={brand.goodsList}
                                   bordered
                                   className={globalStyles.tablestyle}
                                   columns={+brand.isDelete?[...unShowDeleteColumns,...columns]:[...showDeleteColumns,...columns]}
                                   rowKey={record => record.id}
                                   pagination={false}
                                  />) : null
                             }
                           </Card>
                           }
                         </div>
                       );
                    })
                  }
                  <Affix offsetBottom={0}>
                    <Row style={{borderTop:'1px solid #d9d9d9',padding:'20px 0',background:"#fff"}}>
                    {
                      brandActionList.map(item=>{
                          switch(item.type) {
                            case 1:
                              return <Link to={`${item.url}/2`}><Button type="dashed" style={{ marginRight: 10}}>{item.name}</Button></Link>
                            break;
                            default:
                              return <Button type="primary" style={{ marginRight: 10}} onClick={this.handleOperation.bind(this,item.type,item.url)}>{item.name}</Button>
                            break;
                          }
                      })
                    }
                    </Row>
                  </Affix>
              </TabPane>
              <TabPane tab="品牌商品日志" key="3">
                  <Row style={{margin:'10px 0'}}>
                    变更时间
                    <RangePicker
                    // value={[contractExpireDateStart ? moment(contractExpireDateStart, 'YYYY-MM-DD') : null, contractExpireDateEnd ? moment(contractExpireDateEnd, 'YYYY-MM-DD') : null]}
                    style={{ width: 200, margin: "0 10px" }}
                    onChange={this.handleChangeDate.bind(this)}
                    />
                    <Select
                    placeholder="请选择品牌名"
                    style={{width:300,marginRight:10}}
                    onChange={this.handleSearchByBrndId}
                    showSearch
                    allowClear
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                    <Select.Option value={""}>全部</Select.Option>
                      {
                        Object.keys(brandListMap).map(key => (
                          <Select.Option value={key}>{brandListMap[key]}</Select.Option>
                        ))
                      }
                    </Select>
                    <Select
                    placeholder="请选择条码"
                    allowClear
                    className={globalStyles['input-sift']}
                    onChange={this.handleChangeKeyWords.bind(this, 'purchaseSupplierGoodsId')}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                    {/* <Select.Option value={""}>全部</Select.Option> */}
                      {
                        Object.keys(goodsSnMap).map(key => (
                          <Select.Option value={key}>{goodsSnMap[key]}</Select.Option>
                        ))
                      }
                    </Select>
                    <Select
                    placeholder="请选择变更类型"
                    allowClear
                    className={globalStyles['input-sift']}
                    onChange={this.handleChangeKeyWords.bind(this, 'changeType')}
                    dropdownMatchSelectWidth={false}
                    >
                      <Select.Option value={""}>全部</Select.Option>
                      {
                        Object.keys(goodsChangeTypeMap).map(key => (
                          <Select.Option value={key}>{goodsChangeTypeMap[key]}</Select.Option>
                        ))
                      }
                    </Select>
                    <Select
                    placeholder="请选择操作人"
                    allowClear
                    className={globalStyles['input-sift']}
                    onChange={this.handleChangeKeyWords.bind(this, 'createBy')}
                    dropdownMatchSelectWidth={false}
                    >
                    <Select.Option value={""}>全部</Select.Option>
                      {
                        Object.keys(purchaserMap).map(key => (
                          <Select.Option value={key}>{purchaserMap[key]}</Select.Option>
                        ))
                      }
                    </Select>
                    <Select
                    placeholder="请选择审核人"
                    allowClear
                    className={globalStyles['input-sift']}
                    onChange={this.handleChangeKeyWords.bind(this, 'checkBy')}
                    dropdownMatchSelectWidth={false}
                    >
                    <Select.Option value={""}>全部</Select.Option>
                      {
                        Object.keys(purchaserMap).map(key => (
                          <Select.Option value={key}>{purchaserMap[key]}</Select.Option>
                        ))
                      }

                    </Select>
                  </Row>
                  <Table
                  dataSource={purchaseGoodsList}
                  columns={brandColumns}
                  rowKey={(record,index) => index}
                  className={globalStyles.tablestyle}
                  bordered
                  pagination={{
                    current: currentPage,
                    pageSize:pageSize,
                    pageSizeOptions:["20","30","40","50","100"],
                    onChange: this.handleChangePage.bind(this,'currentPage'),
                    onShowSizeChange: this.handleChangePageSize.bind(this,'pageSize'),
                    total,
                    showSizeChanger: true,
                    showTotal:total => `共 ${total} 个结果`,
                  }}
                  >

                  </Table>
              </TabPane>
          </Tabs>
          </Card>
          <Modal
          visible={previewModal}
          footer={null}
          onCancel={this.handleCloseModal.bind(this,'previewModal')}
          >
            <img alt="头像" style={{ width: '100%' }} src={previewUrl} />
          </Modal>
          <Modal
          visible={isShowConfirmModal}
          title={actionType?"请确认是否驳回":"确认"}
          onOk={this.handleConfirmOperation}
          onCancel={this.handleCloseModal.bind(this,'isShowConfirmModal')}
          >
          {
            actionType?<TextArea
            onChange={this.handleChangeKeyWords.bind(this,'rejectRemark')}
            rows={4}
            placeholder="请填写驳回意见"
             />:<p>请确认是否审核通过</p>
          }
          </Modal>

        </PageHeaderLayout>
      );
    }
}
