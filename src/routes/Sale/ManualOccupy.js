import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Button, Modal, Table, Icon, Tooltip, DatePicker, Popconfirm, AutoComplete } from 'antd';
import { Link } from 'dva/router';
// import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './AwaitOutStoreList.less';
import globalStyles from '../../assets/style/global.less';
import ClearIcon from '../../components/ClearIcon';
import Debounce from 'lodash-decorators/debounce';
const { RangePicker } = DatePicker;
const Option = Select.Option;

@connect(state => ({
    manualOccupy: state.manualOccupy,
}))
export default class ManualOccupy extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'manualOccupy/getList',
    });
    dispatch({
      type: 'manualOccupy/getConfig',
    });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'manualOccupy/unmountReducer',
    });
  }
  handleChangeItem=(type,e)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'manualOccupy/updatePageReducer',
      payload:{
          [type]:e.target.value
      }
    });
  }
  handleSearchItem=()=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'manualOccupy/getList',
      currentPage:1,
    });
  }
  handleClear=(type)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'manualOccupy/getList',
      payload: {
        [type]:"",
        currentPage:1,
      },
    });
  }
  handleChangeDate=(type,date,dateString)=>{
    const { dispatch } = this.props;
    switch(type) {
        case 'stockReturnTime':
            dispatch({
                type: 'manualOccupy/getList',
                payload:{
                    stockReturnTimeStart:dateString[0],
                    stockReturnTimeEnd:dateString[1],
                    currentPage:1,
                }
            });
        break;
        case 'createTime':
            dispatch({
                type: 'manualOccupy/getList',
                payload:{
                    createTimeStart:dateString[0],
                    createTimeEnd:dateString[1],
                    currentPage:1,
                }
            });
        break;
    }
  }
    handleChangePage=(currentPage)=>{
        const { dispatch } = this.props;
        dispatch({
            type:'manualOccupy/getList',
            payload:{
                currentPage,
            }
        })
    }
    handleChangePageSize(_, pageSize) {
        const { dispatch } = this.props;
        dispatch({
          type: 'manualOccupy/getList',
          payload: {
            pageSize,
            curPage: 1,
          },
        });
    }
    handleReleaseStock=(currentId)=>{
        const { dispatch } = this.props;
        dispatch({
          type: 'manualOccupy/updatePageReducer',
          payload: {
            currentId,
            showModal:true,
          },
        });
    }
    handleCloseModal=()=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'manualOccupy/updatePageReducer',
            payload: {
                showModal:false
            },
        });
    }
    handleConfrimRelease=()=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'manualOccupy/confirmRelease',
            payload: {
                buttonLoading:true
            },
        });
    }
    handleChangeRemark=(editId,e)=>{
        const { dispatch, manualOccupy } = this.props;
        const { goodsDepotList } = manualOccupy;
        goodsDepotList.map(item=>{
            if(editId == item.goodsId) {
                item.remark = e.target.value
            }
        })
        dispatch({
            type: 'manualOccupy/updatePageReducer',
            payload: {
                goodsDepotList,
                editId
            },
        });
    }
    handleSaveRemark=(editId)=>{
        const { dispatch, manualOccupy } = this.props;
        dispatch({
            type: 'manualOccupy/saveRemark',
            payload:{
                editId
            }
        });
    }
    @Debounce(200)
    handleSearchKeyWords=(type,keyWords)=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'manualOccupy/searchKeywords',
            payload: {
                type,
                keyWords,
            }
        });
    }
    handleSelectKeyWors=(type,e)=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'manualOccupy/getList',
            payload: {
                [type]:e,
                currentPage:1,
            }
        });
    }
  render() {
    const {
        manualOccupy: {
            isTableLoading,
            goodsDepotList,
            actionList,
            total,   
            currentPage,
            pageSize,     
            keywords,
            controlPerson,
            followPerson,
            showModal,
            userList
        },
    } = this.props;

    // table 的列头数据
    const columns = [
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width:100,
        },
        {
            title: '商品ID',
            dataIndex: 'goodsId',
            key: 'goodsId',
        },
        {
            title: '商品名称',
            dataIndex: 'goodsName',
            key: 'goodsName',
            width:200,
            render:(goodsName)=>{
                return <Tooltip title={goodsName}>
                    <div className={globalStyles.twoLine}>{goodsName}</div>
                </Tooltip>
            }
        },
        {
            title: '条码',
            dataIndex: 'goodsSn',
            key: 'goodsSn',
        },
        {
            title: '即时库存',
            dataIndex: 'immStock',
            key: 'immStock',
        },
        {
            title: '可用库存',
            dataIndex: 'canUseStock',
            key: 'canUseStock',
        },
        {
            title: '在途库存',
            dataIndex: 'receivingStock',
            key: 'receivingStock',
        },
        {
            title: '残损库存',
            dataIndex: 'brokenStock',
            key: 'brokenStock',
        },
        {
            title: '占用数量',
            dataIndex: 'occupyNumber',
            key: 'occupyNumber',
        },
        {
            title: '库存恢复时间',
            dataIndex: 'stockReturnTime',
            key: 'stockReturnTime',
            width:100,
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
            width:220,
            render:(remark,record)=>{
                return <Input 
                style={{width:200}}
                value={remark}
                onChange={this.handleChangeRemark.bind(this,record.goodsId)}
                onBlur={this.handleSaveRemark.bind(this,record.goodsId)}
                ></Input>
            }
        },
        {
            title: '操作',
            dataIndex: '',
            key: '',
            render:(_,record)=>{
                return <Button type="primary" onClick={this.handleReleaseStock.bind(this,record.id)}>释放库存</Button>
            }
        },
    ]
    
    return (
      <PageHeaderLayout title="人工占用库存列表">
        <Card bordered={false}>
            <Row>
                <Col span={20}>
                    <Input.Search
                        placeholder="请输入产品名称/条码"
                        className={globalStyles['input-sift']}
                        onChange={this.handleChangeItem.bind(this,'keywords')}
                        onSearch={this.handleSearchItem}
                        value={keywords} 
                        suffix={keywords?<ClearIcon 
                            handleClear={this.handleClear.bind(this,"keywords")}
                        />:""}    
                    />
                    <AutoComplete
                    dataSource={Object.keys(userList).map((item) => {
                        return (
                        <Select.Option value={item}>{userList[item]}</Select.Option>
                        );
                    })}
                    placeholder="请输入跟进人姓名"
                    style={{ width: 200,marginRight:10 }}
                    onSearch={this.handleSearchKeyWords.bind(this,'followPerson')}
                    onSelect={this.handleSelectKeyWors.bind(this,'followPerson')}
                    allowClear
                    dropdownMatchSelectWidth={false}
                    />
                    <AutoComplete
                    dataSource={Object.keys(userList).map((item) => {
                        return (
                        <Select.Option value={item}>{userList[item]}</Select.Option>
                        );
                    })}
                    style={{ width: 200,marginRight:10 }}
                    onSearch={this.handleSearchKeyWords.bind(this,'controlPerson')}
                    onSelect={this.handleSelectKeyWors.bind(this,'controlPerson')}
                    placeholder="请输入支配人姓名"
                    allowClear
                    dropdownMatchSelectWidth={false}
                    />
                    库存恢复时间：
                    <RangePicker
                        // value={[startDate ? moment(startDate, 'YYYY-MM-DD HH:mm') : '', endDate ? moment(endDate, 'YYYY-MM-DD HH:mm') : '']}
                        format="YYYY-MM-DD"
                        className={globalStyles['rangePicker-sift']}
                        onChange={this.handleChangeDate.bind(this,'stockReturnTime')}
                    />
                    创建时间：
                    <RangePicker
                        // value={[startDate ? moment(startDate, 'YYYY-MM-DD HH:mm') : '', endDate ? moment(endDate, 'YYYY-MM-DD HH:mm') : '']}
                        format="YYYY-MM-DD"
                        className={globalStyles['rangePicker-sift']}
                        onChange={this.handleChangeDate.bind(this,'createTime')}
                    />
                </Col>
                <Col span={4}>
                    <Link to="/sale/sale-order/sale-order-list/sale-order-add"><Button type="primary">新建销售订单</Button></Link>
                </Col>
            </Row>
            <Table
              bordered
              className={globalStyles.tablestyle}
              loading={isTableLoading}
              rowKey={record => record.goodsId}
              dataSource={goodsDepotList}
              columns={columns}
              pagination={{
                showTotal:total => `共 ${total} 个结果`,
                current: currentPage,
                pageSize: pageSize,
                pageSizeOptions:["20","30","40","50","100"],
                onChange: this.handleChangePage,
                onShowSizeChange: this.handleChangePageSize,
                showSizeChanger: true,
                showQuickJumper: false,
                total,
              }}
            />
        </Card>
        <Modal
        title="提示"
        okText="确定释放"
        visible={showModal}
        onOk={this.handleConfrimRelease}
        onCancel={this.handleCloseModal}
        maskClosable={false}
        >
            确定要释放该商品的占用库存吗？
        </Modal>
      </PageHeaderLayout>
    );
  }
}
