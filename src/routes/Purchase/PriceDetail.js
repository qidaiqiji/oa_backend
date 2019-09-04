import React, { PureComponent } from 'react';
import { stringify } from 'qs';
import Debounce from 'lodash-decorators/debounce';
import { connect } from 'dva';
import {
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
import styles from './PriceDetail.less';
import globalStyles from '../../assets/style/global.less';

const { Option } = Select;

@connect(state => ({
    priceDetail: state.priceDetail,
}))
export default class PriceDetail extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    const {id} = this.props.match.params;
    dispatch({
      type: 'priceDetail/getConfig',
    });
    dispatch({
      type: 'priceDetail/getList',
      payload:{
        goodsSn:id,
      }
    });
    dispatch({
      type: 'priceDetail/getSupplierMap',      
    });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'priceDetail/unmount',
    });
  }
  handleChangeSearchKeywords=(e)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'priceDetail/updatePage',
      payload:{
        
      }
    });
  }
  handleSearch=(type,...res)=>{
    const { dispatch } = this.props;
    switch(type) {
      case 'changeTime':
      dispatch({
        type: 'priceDetail/getList',
        payload:{
          changeTimeStart:res[1][0],
          changeTimeEnd:res[1][1],
          currentPage: 1,
        }
      });
      break;
      default:
      dispatch({
        type: 'priceDetail/getList',
        payload:{
          [type]:res[0],
          currentPage: 1,
        }
      });
      break;
    }
    
  }
  // 换页
  handleChangeCurPage=(currentPage)=> {
    const { dispatch } = this.props;
    dispatch({
      type: 'priceDetail/getList',
      payload: {
        currentPage,
      },
    });
  }
  // 切换每页行数
  handleChangePageSize(_, pageSize) {
    const { dispatch } = this.props;
    dispatch({
      type: 'priceDetail/getList',
      payload: {
        currentPage:1,
        pageSize,
      },
    });
  }
 
  render() {
    const {
      priceDetail: {
        isTableLoading,
        currentPage,
        pageSize,
        total,
        goodsChangeTypeMap,
        purchaserMap,
        recordList,
        suppliers,
        brandName,
        goodsName,
        goodsSn,
      },
    } = this.props;
    const columns = [
      {
        title: '变更时间',
        dataIndex: 'changeTime',
        key: 'changeTime',
      },
      {
        title: '供应商',
        dataIndex: 'purchaseSupplierName',
        key: 'purchaseSupplierName',
      },
      {
        title: '变更字段',
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
        render:(changeAfterValue)=>{
          return <span style={{color:'red'}}>{changeAfterValue}</span>
        }
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
        dataIndex: 'checkBy	',
        key: 'checkBy	',
        render:(checkBy)=>{
          return <span>{purchaserMap[checkBy]}</span>
        }
      },
      
    ];
    return (
      <PageHeaderLayout title="商品价格变动明细">
        <Card bordered={false}>
          <Row>
           
          <Select
            showSearch
            style={{ width: 300,marginRight:10 }}
            placeholder="选择供应商"
            optionFilterProp="children"
            onChange={this.handleSearch.bind(this,'supplierId')}
            allowClear
            dropdownMatchSelectWidth={false}
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {
                suppliers.map(supplier => (
                    <Select.Option value={supplier.id}>{supplier.name}</Select.Option>
                ))
            }
          </Select>
            变更时间：
            <DatePicker.RangePicker 
            style={{width:250,marginRight:10}}  
            onChange={this.handleSearch.bind(this,'changeTime')}                  
            />
            <Select
            placeholder="请选择变更类型"
            className={globalStyles['input-sift']}   
            style={{width:250}}
            onChange={this.handleSearch.bind(this,'changeType')}
            allowClear
            dropdownMatchSelectWidth={false}
            >
                <Select.Option value="">{"全部"}</Select.Option>
                {
                    Object.keys(goodsChangeTypeMap).map(key => (
                        <Select.Option value={key}>{goodsChangeTypeMap[key]}</Select.Option>
                    ))
                }
            </Select>
            <Select
            placeholder="请选择操作人"
            className={globalStyles['input-sift']}   
            style={{width:250}}
            onChange={this.handleSearch.bind(this,'createBy')}
            allowClear
            dropdownMatchSelectWidth={false}
            >
                <Select.Option value="">{"全部"}</Select.Option>
                {
                    Object.keys(purchaserMap).map(key => (
                        <Select.Option value={key}>{purchaserMap[key]}</Select.Option>
                    ))
                }
            </Select>
            <Select
            placeholder="请选择审核人"
            className={globalStyles['input-sift']}   
            style={{width:250}}
            onChange={this.handleSearch.bind(this,'checkBy')}
            allowClear
            dropdownMatchSelectWidth={false}
            >
                <Select.Option value="">{"全部"}</Select.Option>
                {
                    Object.keys(purchaserMap).map(key => (
                        <Select.Option value={key}>{purchaserMap[key]}</Select.Option>
                    ))
                }
            </Select>
          </Row>
          <Row className={styles.detail}>
              <div>商品条码：<span>{goodsSn}</span></div>
              <div>商品名称：<span>{goodsName}</span></div>
              <div>品牌：<span>{brandName}</span></div>
          </Row>
          <Table
            bordered
            loading={isTableLoading}
            style={{ marginTop: 20 }}
            dataSource={recordList}
            columns={columns}
            rowKey={record => record.id}
            pagination={{
              current: currentPage,
              pageSizeOptions:["20","30","40","50","100"],
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
