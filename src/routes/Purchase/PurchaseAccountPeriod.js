import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import {
  Card,
  Select,
  DatePicker,
  Input,
  Table,
  Tabs,
  Tooltip,
  Row,
  Col,
  Button,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import globalStyles from '../../assets/style/global.less';
@connect(state => ({
  purchaseAccountPeriod: state.purchaseAccountPeriod,
}))
export default class PurchaseAccountPeriod extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseAccountPeriod/getList',
    });
    dispatch({
      type: 'purchaseAccountPeriod/getSelectList',
    });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseAccountPeriod/unmount',
    });
  }
  //   切换每页条数回调
  handleChangePageSize(_, pageSize) {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseAccountPeriod/getList',
      payload:{
        size: pageSize,
        curPage:1,
      }
    });
  }
  // 换页回调
  handleChangePage(curPage) {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseAccountPeriod/getList',
      payload:{
        curPage,
      }
    });
  }
  handleInputTextChanged(type, e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseAccountPeriod/getListResolved',
      payload: {
        [type]: e.target.value,
        curPage: 1,
      },
    });
  }
  handleInputTextSearch(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseAccountPeriod/getList',
      payload: {
        curPage: 1,
      },
    });
  }
  handleSelected(type, e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'purchaseAccountPeriod/getList',
      payload: {
        [type]: e,
        curPage: 1,
      },
    });
  }
  handleOnTableChange=(pagination,filters,sorter)=>{
    const { dispatch } = this.props;
    if(sorter.order === "ascend") {
        dispatch({
            type: 'purchaseAccountPeriod/getList',
            payload: {
                orderBy:sorter.field,
                sort:1,
            }
        });
    }else if(sorter.order === "descend") {
        dispatch({
            type: 'purchaseAccountPeriod/getList',
            payload: {
                orderBy:sorter.field,
                sort:2,
            }
        });
    }
}
  render() {
    const {
      purchaseAccountPeriod: {
        appliedNotPayTotalMoney,
        expiredTotalMoney,
        shouldPayTotalMoney,
        supplierList,
        // orderId,
        size,
        curPage,
        // creditSupplierStatus,
        total,
        isTableLoadingOrd,
        supplierPayMap,
        actionList,
        purchaserMap,
        brandListMap,
      },
    } = this.props;
    const columns = [
      {
        title: '供应商ID', dataIndex: 'id', key: 'id',
      },
      {
        title: '供应商名称',
        dataIndex: 'supplierName',
        key: 'supplierName',
        width:300,
        render: (supplierName, record) => {
          return <Link to={`/purchase/purchase-account-period/deal-account-list/${record.id}`}>{supplierName}</Link>;
        },
      },
      {
        title: '代理品牌',
        dataIndex: 'brandListInfo',
        key: 'brandListInfo',
        width:300,
        render:(brandListInfo)=>{
          return <Tooltip title={brandListInfo}>
            <span className={globalStyles.twoLine} style={{width:280}}>{brandListInfo}</span>
          </Tooltip>
        }
      },
      { title: '已申请未付款金额', dataIndex: 'appliedNotPayMoney', key: 'appliedNotPayMoney',sorter:true },
      { title: '到期总额',
        dataIndex: 'expiredMoney',
        key: 'expiredMoney',
        sorter:true,
        render: (appliedNotPayMoney) => {
          return <span style={{ color: 'green' }}>{appliedNotPayMoney}</span>;
        },
      },
      {
        title: '待结算总额',
        dataIndex: 'awaitPayMoney',
        key: 'awaitPayMoney',
        sorter:true,
        render: (awaitPayMoney) => {
          return <span style={{ color: 'red' }}>{awaitPayMoney}</span>;
        },

      },
    ];

    return (
      <PageHeaderLayout title="采购账期对账总表">
        <Card bordered={false}>
          <Input.Search
            style={{width:300,marginRight:10}}
            placeholder="请输入供应商ID/手机号/联系人"
            onSearch={this.handleInputTextSearch.bind(this)}
            onChange={this.handleInputTextChanged.bind(this, 'supplierKeyWords')}
          />
          <Input.Search
            className={globalStyles['input-sift']}
            placeholder="请输入采购单号/子单号"
            onSearch={this.handleInputTextSearch.bind(this)}
            onChange={this.handleInputTextChanged.bind(this, 'orderId')}

          />
          <Input.Search
            className={globalStyles['input-sift']}
            placeholder="请输入供应商名称"
            onSearch={this.handleInputTextSearch.bind(this)}
            onChange={this.handleInputTextChanged.bind(this, 'supplierName')}

          />
          <Select
            placeholder="待结算供应商"
            className={globalStyles['select-sift']}
            onSelect={this.handleSelected.bind(this, 'creditSupplierStatus')}
            allowClear
            dropdownMatchSelectWidth={false}
          >
            {Object.keys(supplierPayMap).map(key => (
              <Select.Option value={key} key={key}>{supplierPayMap[key]}</Select.Option>
            ))}

          </Select>
          <Select
            placeholder="待选择代理品牌"
            className={globalStyles['input-sift']}
            onSelect={this.handleSelected.bind(this, 'brandId')}
            allowClear
            showSearch
            dropdownMatchSelectWidth={false}
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {Object.keys(brandListMap).map(key => (
              <Select.Option value={key} key={key}>{brandListMap[key]}</Select.Option>
            ))}

          </Select>
         
          <Input.Search
            className={globalStyles['input-sift']}
            placeholder="请输入商品名称/条码"
            onSearch={this.handleInputTextSearch.bind(this)}
            onChange={this.handleInputTextChanged.bind(this, 'goodsKeyWords')}

          />
          <Select
            placeholder="采购员"
            className={globalStyles['select-sift']}
            onSelect={this.handleSelected.bind(this, 'purchaser')}
            allowClear
            dropdownMatchSelectWidth={false}
          >
            <Select.Option value="">全部</Select.Option>
            {Object.keys(purchaserMap).map(key => (
              <Select.Option value={key} key={key}>{purchaserMap[key]}</Select.Option>
            ))}

          </Select>
          <Row>
            <Col span={20}>
              <span style={{ marginRight: '30px' }}>账期应付总额:<b style={{ paddingLeft: '5px', color: 'red', fontSize: '20px' }}>{shouldPayTotalMoney}</b></span>
              <span style={{ marginRight: '30px' }}>账期到期总额:<b style={{ paddingLeft: '5px', color: 'green', fontSize: '20px' }}>{expiredTotalMoney}</b></span>
              <span style={{ marginRight: '30px' }}>已申请未付款总额:<b style={{ paddingLeft: '5px', color: '#000', fontSize: '20px' }}>{appliedNotPayTotalMoney}</b></span>
            </Col>
            <Col span={4}>
              {
                actionList.map((item,index)=>{
                  return <Button href={item.url} type="primary" target="_blank" key={index}>{item.name}</Button>
                })
              }
            </Col>
          </Row>
          <Table
            style={{ marginTop: '20px' }}
            bordered
            columns={columns}
            loading={isTableLoadingOrd}
            onChange={this.handleOnTableChange}
            rowKey={order => order.id}
            dataSource={supplierList}
            pagination={{
              current: curPage,
              size,
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
