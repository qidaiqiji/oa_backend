import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Input, DatePicker, Icon, Table, Row, Select, Button, Col } from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import globalStyles from '../../assets/style/global.less';
import ClearIcon from '../../components/ClearIcon';
const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
@connect(state => ({
    agentList: state.agentList,
}))
export default class AgentList extends PureComponent {
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
          type: 'agentList/getList',
        });
        dispatch({
          type: 'agentList/getConfig',
        });
    }
    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch({
        type: 'agentList/unmountReducer',
        });
    }  
    handleChangeSiftItem=(type,e)=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'agentList/updatePageReducer',
            payload:{
                [type]:e.target.value
            }
        });
    }
    handleSearchSift=(type,e)=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'agentList/getList',
            payload:{
                [type]:e,
                currentPage:1,
            }
        });
    }
    handleChangeDate=(date,dateString)=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'agentList/getList',
            payload:{
                regStartTime:dateString[0],
                regEndTime:dateString[1],
                currentPage:1,
            }
        });
    }
    handleClear=(type)=>{
        const { dispatch } = this.props;
        dispatch({
          type: 'agentList/getList',
          payload: {
            [type]:"",
            currentPage:1,
          },
        });
      }
      handleChangePage=(currentPage)=>{
        const { dispatch } = this.props;
        dispatch({
          type: 'agentList/getList',
          payload: {
            currentPage,
          },
        });
      }
      handleChangePageSize=(_,pageSize)=>{
        const { dispatch } = this.props;
        dispatch({
          type: 'agentList/getList',
          payload: {
            pageSize,
            currentPage:1,
          },
        });
      }

  render() {
    const { 
        agentList: {
            isTableLoading,
            currentPage,
            regStartTime,
            regEndTime,
            keywords,
            pageSize,
            count,      
            list,
            statusMap,
            provinceMap,
        } 
    } = this.props;

    const columns = [
      {
        title: '序号',
        key: 'no',
        dataIndex: 'no',
        width: 80,
        align: 'center',
        render: (_, record, index) => {
          return (
            <span>{+index + 1}</span>
          );
        },
      },
      {
        title: '经销商',
        key: 'name',
        dataIndex: 'name',
        render:(name,record)=>{
          return <Link to={`/customer/agent-list/agent-add/${record.id}`}>{name}</Link>
        }
      },
      {
        title: '手机号',
        key: 'mobile',
        dataIndex: 'mobile',
      },
      {
        title: '所属省份',
        key: 'provinceName',
        dataIndex: 'provinceName',
      },
      {
        title: '备注',
        key: 'remark',
        dataIndex: 'remark',
      },
      {
        title: '创建时间',
        key: 'regTime',
        dataIndex: 'regTime',
      },
      {
        title: '更新时间',
        key: 'editTime',
        dataIndex: 'editTime',
      },
      {
        title: '状态',
        key: 'status',
        dataIndex: 'status',
      },
    ];
    return (
      <PageHeaderLayout title="经销商管理">
        <Card bordered={false}>
          <Row type="flex">
            <Col span={20}>
                <Search
                //   value={keywords}
                className={globalStyles['input-sift']}
                placeholder="请输入经销商名称/手机号码"
                style={{ width: 300 }}
                onChange={this.handleChangeSiftItem.bind(this, 'keywords')}
                onSearch={this.handleSearchSift.bind(this)}
                value={keywords} 
                suffix={keywords?<ClearIcon 
                    handleClear={this.handleClear.bind(this,"keywords")}
                />:""} 
                />
                创建时间：
                <RangePicker
                value={[regStartTime ? moment(regStartTime, 'YYYY-MM-DD') : null, regEndTime ? moment(regEndTime, 'YYYY-MM-DD') : null]}
                format="YYYY-MM-DD"
                onChange={this.handleChangeDate}
                className={globalStyles['rangePicker-sift']}
                />
                <Select
                className={globalStyles['select-sift']}
                placeholder="所属省份"
                onChange={this.handleSearchSift.bind(this, 'province')}
                optionFilterProp="children"
                filterOption={(input, option) => {
                    return option.props.children.indexOf(input) >= 0;
                }}
                allowClear
                dropdownMatchSelectWidth={false}
                >
                <Option value="">全部</Option>
                {
                    Object.keys(provinceMap	).map((provinceId) => {
                    return (
                        <Option value={provinceId}>{provinceMap	[provinceId]}</Option>
                    );
                    })
                }
                </Select>
                <Select
                className={globalStyles['select-sift']}
                placeholder="状态"
                onChange={this.handleSearchSift.bind(this, 'status')}
                allowClear
                dropdownMatchSelectWidth={false}
                >
                {
                    Object.keys(statusMap).map((statusId) => {
                      return (
                          <Option value={statusId}>{statusMap[statusId]}</Option>
                      );
                    })
                }
                </Select>
            </Col>
            <Col span={4}>
                <Button type="primary" icon="plus" href="/customer/agent-list/agent-add">新增经销商</Button>
            </Col>
          </Row>
          <Table
            bordered
            loading={isTableLoading}
            dataSource={list}
            columns={columns}
            rowKey={record => record.id}
            pagination={{
                showTotal:total => {return `共 ${total} 个结果`},
                pageSizeOptions:["20","30","40","50","100"],
                current: currentPage,
                pageSize,
                onChange: this.handleChangePage.bind(this),
                onShowSizeChange: this.handleChangePageSize.bind(this),
                showSizeChanger: true,
                showQuickJumper: false,
                total:count,
            }}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
