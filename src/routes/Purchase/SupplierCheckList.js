import React, { PureComponent } from 'react';
import { stringify } from 'qs';
import Debounce from 'lodash-decorators/debounce';
import { connect } from 'dva';
import {
  Modal,
  Card,
  Row,
  Col,
  Select,
  Input,
  Table,
  Button,
  DatePicker,
} from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
// import styles from './supplierCheckList.less';
import globalStyles from '../../assets/style/global.less';
import ClearIcon from '../../components/ClearIcon';
const { Option } = Select;
const Search = Input.Search;
@connect(state => ({
  supplierCheckList: state.supplierCheckList,
}))
export default class SupplierCheckList extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierCheckList/getList',
    });
    dispatch({
      type: 'supplierCheckList/getConfig',
    });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierCheckList/unmount',
    });
  }
  handleChangeSearchKeywords=(e)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierCheckList/updatePage',
      payload:{
        purchaseSupplierId:e.target.value,
      }
    });
  }
  handleSearch=(type,...res)=>{
    const { dispatch } = this.props;
    switch(type) {
      // case 'purchaseSupplierId':
      // dispatch({
      //   type: 'supplierCheckList/getList',
      //   payload:{
      //     [type] : res[0],
      //     currentPage:1
      //   }
      // });
      // break;
      case 'checkTime':
      dispatch({
        type: 'supplierCheckList/getList',
        payload:{
          checkTimeStart : res[1][0],
          checkTimeEnd: res[1][1],
          currentPage:1
        }
      });
      break;
      default:
        dispatch({
          type: 'supplierCheckList/getList',
          payload:{
            [type] : res[0],
            currentPage:1
          }
        });
      break;
    }
    
  }
  // 换页
  handleChangeCurPage=(currentPage)=> {
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierCheckList/getList',
      payload: {
        currentPage,
      },
    });
  }
  // 切换每页行数
  handleChangePageSize(_, pageSize) {
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierCheckList/getList',
      payload: {
        currentPage:1,
        pageSize,
      },
    });
  }
  handleClear=(type)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierCheckList/getList',
      payload: {
        [type]:""
      },
    });
  }
 
  render() {
    const {
      supplierCheckList: {
        isTableLoading,
        currentPage,
        pageSize,
        supplierInfoList,
        total,
        supplierChangeType,
        purchaserMap,
        purchaseSupplierId,
      },
    } = this.props;
    const columns = [
      {
        title: '提审类型',
        dataIndex: 'changeType',
        key: 'changeType',
        render:(changeType)=>{
          return <span>{supplierChangeType[changeType]}</span>
        }
      },
      {
        title: '供应商',
        dataIndex: 'supplierName',
        key: 'supplierName',
      },
      {
        title: '提审时间',
        dataIndex: 'checkTime',
        key: 'checkTime',
      },

      {
        title: '提审采购员',
        dataIndex: 'purchaser',
        key: 'purchaser',
        render:(purchaser)=>{
          return <span>{purchaserMap[purchaser]}</span>
        }
      },
      {
        title: '操作',
        dataIndex: 'id',
        key: 'id',
        render:(_,record)=>{
            return <Button ghost type="primary" href={`/purchase/supplier-management/supplier-check-list/supplier-check-detail/${record.supplierInfoId}`}>详情</Button>
        }
      },
    ];
    return (
      <PageHeaderLayout title="供应商审核列表">
        <Card bordered={false}>
          <Row>
            <Input.Search 
            placeholder="请输入供应商名称/编码ID"
            className={globalStyles['input-sift']}     
            style={{width:300}}
            onChange={this.handleChangeSearchKeywords.bind(this)}     
            onSearch={this.handleSearch.bind(this,'purchaseSupplierId')}      
            value={purchaseSupplierId} 
            suffix={purchaseSupplierId?<ClearIcon 
                    handleClear={this.handleClear.bind(this,"purchaseSupplierId")}
            />:""}             
            />
            提审时间：
            <DatePicker.RangePicker  
            style={{width:250,marginRight:10}} 
            // value={[contractExpireDateStart ? moment(contractExpireDateStart, 'YYYY-MM-DD') : '',contractExpireDateEnd ? moment(contractExpireDateEnd, 'YYYY-MM-DD') : '']}
            onChange={this.handleSearch.bind(this,'checkTime')}                  
            />
            <Select
            placeholder="按采购员筛选"
            style={{width:250,marginRight:10}}
            onChange={this.handleSearch.bind(this,'purchaser')}
            allowClear
            dropdownMatchSelectWidth={false}
            >
              <Select.Option value="1">{"全部"}</Select.Option>
              {
                  Object.keys(purchaserMap).map(key => (
                      <Select.Option value={key}>{purchaserMap[key]}</Select.Option>
                  ))
              }
            </Select>
            <Select
            placeholder="按提审类型筛选"
            className={globalStyles['input-sift']}   
            onChange={this.handleSearch.bind(this,'changeType')}
            allowClear
            dropdownMatchSelectWidth={false}
            >
              <Select.Option value="">{"全部"}</Select.Option>
              {
                  Object.keys(supplierChangeType).map(key => (
                      <Select.Option value={key}>{supplierChangeType[key]}</Select.Option>
                  ))
              }
            </Select>
          </Row>
          <Table
            bordered
            loading={isTableLoading}
            style={{ marginTop: 20 }}
            dataSource={supplierInfoList}
            columns={columns}
            rowKey={record => record.id}
            pagination={{
              pageSizeOptions:["20","30","40","50","100"],
              current: currentPage,
              pageSize,
              total,
              showTotal:total => {
                return `共 ${total} 个结果`
              },
              showSizeChanger: true,
              onShowSizeChange: this.handleChangePageSize.bind(this),
              onChange: this.handleChangeCurPage.bind(this),
            }}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
