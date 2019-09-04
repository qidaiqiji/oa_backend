import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Row, Input, Table, Button, DatePicker, Icon, Col, Select, Modal, AutoComplete, Upload, notification,message, Tooltip } from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './GoodsStockFollowList.less';
import globalStyles from '../../assets/style/global.less';
import moment from 'moment';
import Debounce from 'lodash-decorators/debounce';
import { getUrl } from '../../utils/request';
const { RangePicker } = DatePicker;
const { Search } = Input;

@connect(state => ({
    goodsStockFollowList: state.goodsStockFollowList,
}))
export default class goodsStockFollowList extends PureComponent {
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'goodsStockFollowList/getList',
        });
        dispatch({
            type: 'goodsStockFollowList/getConfig',
        });
    }
    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch({
        type: 'goodsStockFollowList/unmount',
        });
    }
/**-----点击新增占用出现弹窗----- */
    handleShowAddNewStockModal=()=>{
        const { dispatch } = this.props;
        dispatch({
           type: 'goodsStockFollowList/updatePageReducer',
           payload: {
               isShowAddNewStockModal:true,
           }
        });
    }
    handleCancelAddStock=()=>{
        const { dispatch } = this.props;
        dispatch({
           type: 'goodsStockFollowList/updatePageReducer',
           payload: {
               isShowAddNewStockModal:false,
           }
        });
    }
    handleConfirmAddStock=()=>{
        const { dispatch, goodsStockFollowList } = this.props;
        const { goodsSn, occupyNum, expireDate, controlPerson, followPerson } = goodsStockFollowList;
        let array = [goodsSn, occupyNum, expireDate, controlPerson, followPerson];
        const isEmpty = array.some(item=>{
            return !item;
        })
        if(isEmpty) {
            message.error("必填项不能为空！");
            return;
        }
        dispatch({
            type: 'goodsStockFollowList/addNewStock',
            payload:{
                isShowAddNewStockModal:false,
               isTableLoading:true,
            }
         });
    }
/**------------点击箭头弹出解锁弹窗-- */
    handleShowUnlockModal=(goodsId)=> {
        const { dispatch } = this.props;
        dispatch({
           type: 'goodsStockFollowList/resolveGoodsList',
           payload: {
               isShowUnlockModal:true,
               goodsId,
            }
        });
    }
    handleCloseUnlockModal=()=>{
        const { dispatch } = this.props;
        dispatch({
           type: 'goodsStockFollowList/getList',
           payload: {
                isShowUnlockModal:false,
                isTableLoading:true,
           }
        });
    }
    // 点击解锁的时候发送请求
    handleUnlockGoods=(id)=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'goodsStockFollowList/updatePageReducer',
            payload: {
                 unlockLoading:true,
            }
         });
        dispatch({
           type: 'goodsStockFollowList/unlockGoods',
           payload: {
                id,
           }
        });
    }
/**-------新增占用---- */
    handleAddNewStockInfo=(type,e,dataStrings)=>{
        const { dispatch } = this.props;
        switch(type) {
            case "occupyNum":
            case "remark":
            case "goodsSn":
            dispatch({
             type: 'goodsStockFollowList/updatePageReducer',
             payload: {
                [type]: e.target.value,
             }
            });
            break;
            case "expireDate":
            dispatch({
                type: 'goodsStockFollowList/updatePageReducer',
                payload: {
                    [type]: dataStrings,
                }
              });
            break;
        }
    }
/**-----搜索公用一个方法---- */
    handleSearchStockList=(type,e,dataStrings)=>{
        const { dispatch } = this.props;
        switch(type) {
            case "occupyType":
            case "keywords":
            dispatch({
                type: 'goodsStockFollowList/getList',
                payload: {
                    [type]: e,
                    curPage:1,
                }
              });
            break;
            case "expireDate":
            dispatch({
                type: 'goodsStockFollowList/getList',
                payload: {
                    expireDateStart:dataStrings[0],
                    expireDateEnd:dataStrings[1],
                    curPage:1,
                }
              });
            break;
            case "createTime":
            dispatch({
                type: 'goodsStockFollowList/getList',
                payload: {
                    createTimeStart:dataStrings[0],
                    createTimeEnd:dataStrings[1],
                    curPage:1,
                }
            });
            break;
        }
    }
    // 换页回调
    handleChangePage=(value)=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'goodsStockFollowList/getList',
            payload: {
                curPage:value,
            },
        });
    }
    handleChangePageSize=(_,pageSize)=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'goodsStockFollowList/getList',
            payload: {
                pageSize,
                curPage:1,
            },
        });
    }
/**----升序降序排列------- */
    onTableChange=(pagination,filters,sorter)=>{
        const { dispatch } = this.props;
        if(sorter.order === "ascend") {
            dispatch({
                type: 'goodsStockFollowList/getList',
                payload: {
                    sort:2,
                    orderBy:sorter.field,
                    curPage:1,
                }
            });
        }else if(sorter.order === "descend") {
            dispatch({
                type: 'goodsStockFollowList/getList',
                payload: {
                    sort:1,
                    orderBy:sorter.field,
                    curPage:1,
                }
            });
        }
    }
/**----- 条码自动补全搜索----*/
    @Debounce(200)
    handleChangeGoodsNo=(text)=>{
        const { dispatch } = this.props;
        if(text === "") {
            dispatch({
                type: 'goodsStockFollowList/updatePageReducer',
                payload: {
                    goodsSn:"",
                    goodsNoSuggest:[],
                }
            });
        }else {
            dispatch({
                type: 'goodsStockFollowList/updatePageReducer',
                payload: {
                    goodsSn:text,
                }
            });
        }
        dispatch({
            type: 'goodsStockFollowList/searchGoodsNo',
            payload: {
                goodsSn:text,
            }
        });
        
    }
    handleSelectGoodsNo=(value,option)=>{
        const { dispatch } = this.props;
        const { children } = option.props;
        dispatch({
            type: 'goodsStockFollowList/updatePageReducer',
            payload: {
                goodsSn:children,
            }
        });
    }
    @Debounce(200)
    handleSearchKeyWords=(keyWords)=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'goodsStockFollowList/searchKeywords',
            payload: {
                keyWords,
            }
        });
    }
    handleSelectKeyWors=(type,e)=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'goodsStockFollowList/updatePageReducer',
            payload: {
                [type]:e,
            }
        });
    }
    handleChangeUpload(info) {
        const { dispatch } = this.props;
        if (info.file.status === 'uploading') {
        //   dispatch({
        //     type: 'manualInInvoice/updatePageReducer',
        //     payload:{
        //         isLoading:true,
        //     }
        //   });
        }
        if (info.file.status === 'error') {
          notification.error({
            message: '提示',
            description: '上传失败, 请稍后重试!',
          });
        //   dispatch({
        //     type: 'manualInInvoice/updatePageReducer',
        //     payload: {
        //         isLoading:false,
        //     },
        //   });
        }
        if (info.file.status === 'done') {
        //   dispatch({
        //     type: 'manualInInvoice/updatePageReducer',
        //     payload: {
        //         invGoodsList:info.file.response.data.invoiceGoodsList,
        //         isLoading:false,
        //     },
        //   });
        }
      }
  render() {
    const {
        goodsStockFollowList: {
            isShowAddNewStockModal,
            isShowUnlockModal,
            goodsList,
            stockRecordList,       
            unlockLoading,
            isTableLoading,
            occupyNum,
            remark,
            expireDate,
            occupyTypeMap,
            total,
            pageSize,
            curPage,
            goodsNoSuggest,
            goodsSn,
            userList,
            controlPerson,
            followPerson
      },
    } = this.props;
    const columns =[
        {
            title: '商品ID',
            dataIndex: 'goodsId',
            key: 'goodsId',
            width:100,
            render:(goodsId,record)=>{
                return <Link to={`/warehouse/goods-stock/goods-stock-follow-list/goods-stock-detail/${record.goodsId}`}>{goodsId}</Link>
            }
        },
        {
            title: '商品名称',
            dataIndex: 'goodsName',
            key: 'goodsName',
            width:300,
            render:(goodsName,record)=>{
                return <Link to={`/warehouse/goods-stock/goods-stock-follow-list/goods-stock-detail/${record.goodsId}`}>{goodsName}</Link>
            }
        },
        {
            title: '条码',
            dataIndex: 'goodsNo',
            key: 'goodsNo',
            width:200,
            render:(goodsNo,record)=>{
                return <Link to={`/warehouse/goods-stock/goods-stock-follow-list/goods-stock-detail/${record.goodsId}`}>{goodsNo}</Link>
            }
        },
        {
            title: '即时库存',
            dataIndex: 'imNum',
            key: 'imNum',
        },
        {
            title: '可用库存',
            dataIndex: 'canUseNum',
            key: 'canUseNum',
        },
        {
            title: '在途库存',
            dataIndex: 'inWayNum',
            key: 'inWayNum',
        },
        {
            title: '残损库存',
            dataIndex: 'brokenNum',
            key: 'brokenNum',
        },
        {
            title: '总占用库存',
            dataIndex: 'totalOccupyNum',
            key: 'totalOccupyNum',
            width:130,
            sorter:true,
        },
        {
            title: '订单占用库存',
            dataIndex: 'orderOccupyNum',
            key: 'orderOccupyNum',
            width:140,
            sorter:true,
        },
        {
            title: '人工占用库存',
            dataIndex: 'manMadeOccupyNum',
            key: 'manMadeOccupyNum',
            width:150,
            sorter:true,
            render:(manMadeOccupyNum,record)=>{
                return (                    
                    <p style={{margin:0}}>
                        <span style={{display:"inline-block",width:90}}>{record.manMadeOccupyNum}</span>
                        {
                            manMadeOccupyNum?(                        
                                <a><Icon onClick={this.handleShowUnlockModal.bind(this,record.goodsId)} type="right-circle" style={{marginLeft:4}}/></a>                    
                            ):null
                        }
                    </p>
                )
            }
        },
        {
            title: '预警次数（可用库存小于6的次数）',
            dataIndex: 'warningNum',
            key: 'warningNum',
            width:150,
        },
    ];
      const unlockColumns =[
        {
            title: '操作时间',
            dataIndex: 'createTime',
            key: 'createTime',
        },
        {
            title: '库存恢复时间',
            dataIndex: 'expireDate',
            key: 'expireDate',
        },
        {
            title: '占用数量',
            dataIndex: 'occupyNum',
            key: 'occupyNum',
        },
        {
            title: '支配人',
            dataIndex: 'controlPerson',
            key: 'controlPerson',
        },
        {
            title: '跟进人',
            dataIndex: 'followPerson',
            key: 'followPerson',
        },
        {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
        },
        {
            title: '操作',
            dataIndex: '',
            key: '',
            render:(_,record)=>{
                return <Button type="primary" onClick={this.handleUnlockGoods.bind(this,record.id)}>解锁</Button>
            }
        }
        
    ];
    return (
      <PageHeaderLayout title="占用库存跟踪">
        <Card bordered={false}>
        <Row
            style={{
              height: 60,
            }}
          >
           <Col span={19}>
            <Search
                className={globalStyles['input-sift']}
                placeholder="请输入商品名称/条码"
                  onSearch={this.handleSearchStockList.bind(this,"keywords")}
                />
                <Select
                placeholder="占用类型"
                className={globalStyles['select-sift']}
                  onChange={this.handleSearchStockList.bind(this,"occupyType")}
                >
                <Select.Option value="">全部</Select.Option>
                {
                    Object.keys(occupyTypeMap).map((key) => {
                        return (
                            <Select.Option value={key} key={key}>{occupyTypeMap[key]}</Select.Option>
                        );
                    })
                }
                </Select>
                <span style={{display:"inline-block",paddingTop:5,marginLeft:10}}>库存恢复时间：</span>
                <RangePicker style={{width:240}}
                    format="YYYY-MM-DD"
                      onChange={this.handleSearchStockList.bind(this,"expireDate")}
                />
                 <span style={{display:"inline-block",paddingTop:5,marginLeft:10}}>操作时间：</span>
                <RangePicker style={{width:240}}
                    format="YYYY-MM-DD"
                      onChange={this.handleSearchStockList.bind(this,"createTime")}
                />
           </Col>
            <Col span={2}>
                <Button type="primary" onClick={this.handleShowAddNewStockModal}>新增占用</Button>
            </Col>
            <Col span={3}>
                    <Upload
                    action={`${getUrl(API_ENV)}/sale/goods/import-stock-goods`}
                    onChange={this.handleChangeUpload.bind(this)}
                    headers={{
                      authorization: `Basic ${window.btoa(`${localStorage.getItem('token')}:`)}`,
                    }}
                  > 
                    <Button type="primary" style={{marginRight:10}}>导入</Button>
                    <Tooltip title="导入字段：条码、占用数量、支配人、跟进人、占用时长(以天为单位，锁定当日24点前算1天)">
                        <Icon type="question-circle" />
                    </Tooltip>
                  </Upload>
                  
            </Col>
          </Row>
          <Table 
            columns={columns}
            dataSource={goodsList}
            loading={isTableLoading}
            rowKey={record => record.goodsId}
            bordered
            onChange={this.onTableChange}
            pagination={{
                current: curPage,
                pageSize,
                onChange: this.handleChangePage.bind(this),
                onShowSizeChange: this.handleChangePageSize.bind(this),
                showSizeChanger: true,
                showQuickJumper: false,
                total,
                showTotal:total => `共 ${total} 个结果`,
            }}
          />
            <Modal 
            visible={isShowAddNewStockModal}
            title="新增占用"
            closable
            onOk={this.handleConfirmAddStock}
            onCancel={this.handleCancelAddStock}
            maskClosable={false}
            >
                <Row style={{marginTop:10}}>
                    <Col span={5}><span style={{color:"red"}}>* </span>条码:</Col>
                    <Col span={15}>
                        <AutoComplete
                            dataSource={goodsNoSuggest && goodsNoSuggest.map((suggest) => {
                                return (
                                <Select.Option value={suggest.goodsId.toString()}>{suggest.goodsNo}</Select.Option>
                                );
                            })}
                            onSelect={this.handleSelectGoodsNo.bind(this)}
                            onSearch={this.handleChangeGoodsNo.bind(this)}
                            className={globalStyles['input-sift']}
                            allowClear
                            value={goodsSn}
                            >
                        </AutoComplete>
                    </Col>
                </Row>
                <Row style={{marginTop:10}}>
                    <Col span={5}><span style={{color:"red"}}>* </span>占用数量:</Col>
                    <Col span={15}>
                        <Input 
                            value = {occupyNum}
                            onChange = {this.handleAddNewStockInfo.bind(this,'occupyNum')}
                            style={{width:200}}
                        />   
                    </Col>
                </Row>
                <Row style={{marginTop:10}}>
                    <Col span={5}><span style={{color:"red"}}>* </span>库存恢复时间:</Col>
                    <Col span={15}>
                        <DatePicker 
                            value={expireDate?moment(expireDate):""}
                            onChange={this.handleAddNewStockInfo.bind(this,'expireDate')}
                            style={{width:200}}
                        />
                    </Col>
                </Row>
                <Row style={{marginTop:10}}>
                    <Col span={5}><span style={{color:"red"}}>* </span>支配人:</Col>
                    <Col span={15}>
                    <AutoComplete
                        dataSource={Object.keys(userList).map((item) => {
                            return (
                            <Select.Option value={item}>{userList[item]}</Select.Option>
                            );
                        })}
                        style={{ width: 200 }}
                        onSearch={this.handleSearchKeyWords}
                        onSelect={this.handleSelectKeyWors.bind(this,'controlPerson')}
                        value={controlPerson}
                    />
                    </Col>
                </Row>
                <Row style={{marginTop:10}}>
                    <Col span={5}><span style={{color:"red"}}>* </span>跟进人:</Col>
                    <Col span={15}>
                        <AutoComplete
                        dataSource={Object.keys(userList).map((item) => {
                            return (
                            <Select.Option value={item}>{userList[item]}</Select.Option>
                            );
                        })}
                        style={{ width: 200 }}
                        onSearch={this.handleSearchKeyWords}
                        onSelect={this.handleSelectKeyWors.bind(this,'followPerson')}
                        value={followPerson}
                        />
                    </Col>
                </Row>
                <Row style={{marginTop:10}}>
                    <Col span={5}>备注:</Col>
                    <Col span={15}>
                        <Input 
                            value = {remark}
                            onChange = {this.handleAddNewStockInfo.bind(this,'remark')}
                            style={{width:220}}
                        />   
                    </Col>
                </Row>
          </Modal>
          <Modal
          visible={isShowUnlockModal}
          footer={null}
          width={1000}
          onCancel={this.handleCloseUnlockModal}
          >
          <Table 
          columns={unlockColumns}
          dataSource={stockRecordList}
          loading={unlockLoading}
          rowKey={record=>record.id}
          bordered
          pagination={false}
          />
          </Modal>
        </Card>
      </PageHeaderLayout>
    );
  }
}
