import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Card, Input, DatePicker, Icon, Table, Dropdown, Menu, Row, Select, Button, Col, Tooltip } from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
// import styles from './invoiceAfterSaleList.less';
import globalStyles from '../../assets/style/global.less';

const { Search } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;

@connect(state => ({
    invoiceAfterSaleList: state.invoiceAfterSaleList,
}))
export default class InvoiceAfterSaleList extends PureComponent {
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'invoiceAfterSaleList/getList',
        });
        dispatch({
            type: 'invoiceAfterSaleList/getConfig',
        });
    }
    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'invoiceAfterSaleList/unmount',
        });
    }

    // 搜索项
    handleChangeSyncItem=(type,e)=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'invoiceAfterSaleList/updatePageReducer',
            payload:{
                [type]:e.target.value,
            }
        });
    }
    handleSearchItem=(type,e)=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'invoiceAfterSaleList/getList',
            payload:{
                [type]:e,
            }
        });
    }
    handleChangeDate=(_,dataString)=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'invoiceAfterSaleList/getList',
            payload:{
                invoiceDateStart:dataString[0],
                invoiceDateEnd:dataString[1],
            }
        });
    }
    // 换页回调
    handleChangePageSize=(_,pageSize)=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'invoiceAfterSaleList/getList',
            payload:{
                pageSize,
                currentPage:1,
            }
        });

    }
    handleChangeCurPage=(value)=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'invoiceAfterSaleList/getList',
            payload:{
                currentPage:value,
            }
        });
    }
    
    render() {
    const {
        invoiceAfterSaleList: {
            invoiceBackList,
            isTableLoading,
            invoiceDateStart,
            invoiceDateEnd,
            backInvSourceTypeMap,
            financierMap,
            currentPage,
            pageSize,
            total,
        },
    } = this.props;
    const menu = (
        <Menu>
          <Menu.Item key="1"><Link to={`/finance/finance-invoice/invoice-after-sale-list/manual-in-invoice/out`}>手动开票</Link></Menu.Item>
          <Menu.Item key="2"><Link to={"/finance/finance-invoice/invoice-after-sale-list/manual-in-invoice/in"}>手动来票</Link></Menu.Item>
        </Menu>
    ); 
    const columns = [
        {
            title: '售后单号',
            dataIndex: 'id',
            key: 'id',
            render:(id,record)=>{
                if(+record.invType === 0) {
                    return <Link to={`/finance/finance-invoice/invoice-after-sale-list/after-sale-add/${id}`} >{id}</Link>
                }else{
                    return <Link to={`/finance/finance-invoice/invoice-after-sale-list/manual-in-invoice/${id}/${record.invType}`} >{id}</Link>
                }
                
            }
        },
        {
            title: '票据类型',
            dataIndex: 'invSourceType',
            key: 'invSourceType',
        },
        {
            title: '发票号',
            dataIndex: 'invSn',
            key: 'invSn',
        },
        {
            title: '发票日期',
            dataIndex: 'invDate',
            key: 'invDate',
        },
        {
            title: '开票公司名称',
            dataIndex: 'invCompany',
            key: 'invCompany',
        },
        {
            title: '操作时间',
            dataIndex: 'updatedTime',
            key: 'updatedTime',
        },
        {
            title: '操作人',
            dataIndex: 'financier',
            key: 'financier',
        },
        {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
            width:100,
            render:(remark,record)=>{
                return <Tooltip title={remark}>
                        <p style={{margin: 0, width:100, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>{remark}</p>
                </Tooltip>
            }
        }
    ]
    return (
      <PageHeaderLayout title="发票售后列表">
        <Card bordered={false}>
            <Row style={{marginBottom:20}}>
                <Col span={16}>
                    <Search
                    placeholder="发票号"
                    className={globalStyles['input-sift']}
                      onChange={this.handleChangeSyncItem.bind(this, 'invSn')}
                      onSearch={this.handleSearchItem.bind(this, 'invSn')}
                    />
                    <Search
                    placeholder="开票公司名称"
                    className={globalStyles['input-sift']}
                      onChange={this.handleChangeSyncItem.bind(this, 'invCompany')}
                      onSearch={this.handleSearchItem.bind(this, 'invCompany')}
                    />
                    <Select
                    onSelect={this.handleSearchItem.bind(this,"invoiceSourceType")}
                    className={globalStyles['select-sift']}
                    placeholder={"票据类型"}
                    >
                    <Option value={"-1"}>全部</Option>
                    {
                        Object.keys(backInvSourceTypeMap!=undefined&&backInvSourceTypeMap).map(item => (
                          <Option value={item} key={item}>{backInvSourceTypeMap[item]}</Option>
                        ))
                    }
                    </Select>
                    <Select
                    onChange={this.handleSearchItem.bind(this,"financier")}
                    className={globalStyles['select-sift']}
                    placeholder={"操作人"}
                    >
                    <Option value={"-1"}>全部</Option>
                    {
                        Object.keys(financierMap!=undefined&&financierMap).map(item => (
                          <Option value={item} key={item}>{financierMap[item]}</Option>
                        ))
                    }
                    </Select>
                     <span style={{display:"inline-block",marginTop:4}}>发票日期：</span>
                    <RangePicker
                    value={[invoiceDateStart ? moment(invoiceDateStart, 'YYYY-MM-DD') : '', invoiceDateEnd ? moment(invoiceDateEnd, 'YYYY-MM-DD') : '']}
                    className={globalStyles['rangePicker-sift']}
                    onChange={this.handleChangeDate.bind(this)}
                    />

                </Col>
                <Col span={4} align="end">
                    <Dropdown overlay={menu}>
                        <Button type="primary">
                            新增发票 <Icon type="down" />
                        </Button>
                    </Dropdown>
                    <Link to="/finance/finance-invoice/invoice-after-sale-list/after-sale-add" style={{marginLeft:10}}><Button type="primary">新建售后</Button></Link>
                </Col>
            </Row>
          <Table
          dataSource={invoiceBackList}
          columns={columns}
          bordered
          pagination={{
                current: currentPage,
                pageSize,
                total,
                onShowSizeChange: this.handleChangePageSize.bind(this),
                onChange: this.handleChangeCurPage.bind(this),
                showTotal:total => `共 ${total} 个结果`,
            }}
          loading={isTableLoading}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
