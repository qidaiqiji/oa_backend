import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Debounce from 'lodash-decorators/debounce';
import { Row, Col, Form, Card, Table, Input, Button, Tooltip, Select } from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './SupplierFundsList.less';
@connect(state => ({
  supplierFundsList: state.supplierFundsList,
  user: state.user,
}))
@Form.create()
export default class Tablist extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    // dispatch({
    //   type: 'supplierFundsList/getFunds',
    // });
    dispatch({
      type: 'supplierFundsList/getConfig',
    });
    dispatch({
      type: 'supplierFundsList/searchsupplierList',
      payload: {
        keywords: '',
      },
    });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierFundsList/unmount',
    });
  }

  @Debounce(200)
  // 搜索客户
  handleSearchsupplier(value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierFundsList/searchsupplierList',
      payload: {
        keywords: value,
      },
    });
  }
  handleResetSupplier(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierFundsList/resetSupplier',
      payload:{
        purchaser:''
      }
    });
    dispatch({
      type: 'supplierFundsList/searchsupplierList',
      payload: {
        keywords: '',
        purchaser:''
      },
    });
  }
  handleChange(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierFundsList/inputChange',
      payload: {
        keywords: e.target.value,
      },
    });
  }
  handleChangeRemark=(recordId,e)=>{
    const { dispatch,supplierFundsList } = this.props;
    const { accountLists } = supplierFundsList;
    accountLists.map(item=>{
      if(+item.id === +recordId) {
        item.remark = e.target.value
      }
    })
    dispatch({
      type: 'supplierFundsList/inputChangeReducer',
      payload: {
        accountLists,
        recordId,
      },
    });
  }
  handleConfirmEditRemark=(e)=>{
    const { dispatch, supplierFundsList } = this.props;
    const { recordId } = supplierFundsList;
    if(recordId) {
      dispatch({
        type: 'supplierFundsList/editRemark',
        payload: {
          remark:e.target.value,
        },
      });
    }
  }
  //   升降序排列
  onTableChange=(pagination,filters,sorter)=>{
    const { dispatch } = this.props;
    if(sorter.order === "ascend") {
        dispatch({
            type: 'supplierFundsList/sortGoodsList',
            payload: {
                sort:2,
                orderBy:sorter.field,
            }
        });
    }else if(sorter.order === "descend") {
        dispatch({
            type: 'supplierFundsList/sortGoodsList',
            payload: {
                sort:1,
                orderBy:sorter.field,
            }
        });
    }
}
handleSelect=(e)=>{
  const { dispatch } = this.props;
  dispatch({
    type:'supplierFundsList/searchsupplierList',
    payload:{
      purchaser:e
    }
  })
}
  render() {
    const {
      supplierFundsList: {
        accountLists,
        isLoading,
        keywords,
        remark,
        purchaserMap,
        purchaser,
        actionList,
        balanceInfoCount,
        balanceTotalAmount,
        creditInfoCount,
        creditTotalAmount,
      },
    } = this.props;

    const columns = [
      {
        title: '供应商公司名称',
        dataIndex: 'supplier',
        key: 'supplier',
        render: (supplier, record) => {
          return <Link to={`/finance/funds-management/supplier-funds-list/supplier-funds-detail/${record.id}`}>{supplier}</Link>;
        },
      }, {
        title: '联系人',
        dataIndex: 'contacts',
        key: 'contacts',
      }, {
        title: '账期应付',
        dataIndex: 'creditPay',
        key: 'creditPay',
        sorter:true,
        render: (value) => {
          return <span style={{ color: 'red' }}>{value}</span>;
        },
      }, {
        title: '挂账应收',
        dataIndex: 'balanceReceive',
        key: 'balanceReceive',
        sorter:true,
        render: (value) => {
          return <span style={{ color: 'green' }}>{value}</span>;
        },
      }, 
      {
        title: '应收金额',
        dataIndex: 'receiveAmount',
        key: 'receiveAmount',
        sorter:true,
        render: (total) => {
          if (+total > 0) {
            return <span style={{ color: 'green', marginLeft: 10 }}>{total}</span>;
          } else if (+total < 0) {
            return <span style={{ color: 'red', marginLeft: 10 }}>{total}</span>;
          } else {
            return <span style={{ color: 'orange', marginLeft: 10 }}>{total}</span>;
          }
        },
      }, 
      {
        title: '采购员',
        dataIndex: 'purchaser',
        key: 'purchaser',
      }, 
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        render: (remark,record) => (
          <Input
          value={remark}
          onChange={this.handleChangeRemark.bind(this,record.id)}
          onBlur = {this.handleConfirmEditRemark}
          />
        ),
      }];

    return (
      <PageHeaderLayout title="供应商资金管理" className={styles.addPageHeader}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col span={20}>
                  <div style={{ marginBottom: 24 }} >
                    <span>
                      <Input.Search
                        placeholder="供应商名称/简码"
                        style={{ display: 'inline-block', width: 200,marginRight:20 }}
                        value={keywords}
                        onSearch={this.handleSearchsupplier.bind(this)}
                        onChange={this.handleChange.bind(this)}
                      />
                      <Select
                        placeholder="采购员"
                        style={{width:200,marginRight:20}}
                        onChange={this.handleSelect.bind(this)}
                        dropdownMatchSelectWidth={false}
                        value={purchaser}
                      >
                        <Select.Option value=''>请选择采购员</Select.Option>
                        {
                          Object.keys(purchaserMap).map(item=>(
                            <Select.Option value={item}>
                              {purchaserMap[item]}
                            </Select.Option>
                          ))
                        }
                      </Select>
                      <Button type="primary" style={{ display: 'inline-block' }} onClick={this.handleResetSupplier.bind(this)}>重置</Button>
                    </span>

                  </div>
                </Col>
                <Col span={4}>
                  {
                    actionList.map(item=>(
                      <Button type="primary" href={item.url} target="_blank">{item.name}</Button>
                    ))
                  }
                </Col>
              </Row>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={12} sm={24} style={{ marginBottom: 24 }}>
                  <Card
                    style={{ width: '100%', backgroundColor: '#ffd6af', textAlign: 'center', borderRadius: '10px' }}
                    // hoverable
                  >
                    <div style={{ width: '50%', display: 'inline-block', textAlign: 'center' }}>
                      <p style={{ fontSize: '32px', fontWeight: 400, margin: 0 }}>{creditInfoCount}</p>
                      <p style={{ fontSize: '14px', margin: 0 }}>账期供应商数</p>
                    </div>
                    <div style={{ width: '50%', display: 'inline-block', textAlign: 'center' }}>
                      <p style={{ fontSize: '32px', fontWeight: 400, margin: 0 }}>{creditTotalAmount}</p>
                      <p style={{ fontSize: '14px', margin: 0 }}>账期应付总额</p>
                    </div>
                  </Card>
                </Col>
                <Col md={12} sm={24} style={{ marginBottom: 24 }}>
                  <Card
                    style={{ width: '100%', backgroundColor: '#66cccc', borderRadius: '10px' }}
                    // hoverable
                  >
                    <div style={{ width: '50%', display: 'inline-block', textAlign: 'center' }}>
                      <p style={{ fontSize: '32px', fontWeight: 400, margin: 0 }}>{balanceInfoCount}</p>
                      <p style={{ fontSize: '14px', margin: 0 }}>挂账供应商数</p>
                    </div>
                    <div style={{ width: '50%', display: 'inline-block', textAlign: 'center' }}>
                      <p style={{ fontSize: '32px', fontWeight: 400, margin: 0 }}>{balanceTotalAmount}</p>
                      <p style={{ fontSize: '14px', margin: 0 }}>挂账应收总额</p>
                    </div>
                  </Card>
                </Col>
              </Row>
            </div>

            <Table
              bordered
              loading={isLoading}
              rowKey={record => record.id}
              dataSource={accountLists}
              columns={columns}
              pagination={false}
              onChange={this.onTableChange}
            />

          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
