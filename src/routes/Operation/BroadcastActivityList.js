import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import moment from 'moment';
import globalStyles from '../../assets/style/global.less';
import 'braft-editor/dist/index.css'
import { getUrl } from '../../utils/request';
import copy from 'copy-to-clipboard';
import ClearIcon from '../../components/ClearIcon';
import {
    Card,
    Select,
    DatePicker,
    Upload,
    Icon,
    Modal,
    Input,
    Button,
    Tabs,
    Table,
    Checkbox,
    notification,
    message,
    Tooltip,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { setInterval } from 'core-js';
const TabPane = Tabs.TabPane;
const { TextArea, Search } = Input;
const Option = Select.Option;
const { MonthPicker, RangePicker } = DatePicker;
@connect(state => ({
    broadcastActivityList: state.broadcastActivityList,
}))

export default class BroadcastActivityList extends PureComponent {
    componentWillMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'broadcastActivityList/getConfig',
            payload: {
            }
        });
        dispatch({
            type: 'broadcastActivityList/getList',
            payload: {
            }
        });
    }
    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'broadcastActivityList/unmount',
        });
    }
    handleChangeDate = (dates, dateStrings) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'broadcastActivityList/getList',
            payload: {
                startTime: dateStrings[0],
                endTime: dateStrings[1],
                currentPage: 1,
            }
        });
    }
    // actionList的处理
    handleActionList = (actionUrl, actionText, recordId) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'broadcastActivityList/getListResolved',
            payload: {
                actionUrl,
                actionText,
                id: recordId,
                isShowConfirmModal: true,
            }
        });
    }
    handleChangePageSize = (currentPage, pageSize) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'broadcastActivityList/getList',
            payload: {
                currentPage: 1,
                pageSize,
            },
        });
    }
    handleSearchBroadcast(type, e) {
        const { dispatch } = this.props;
        dispatch({
            type: 'broadcastActivityList/getList',
            payload: {
                [type]: e,
                currentPage: 1,
            },
        });
    }
    handleSearchChange(type, e) {
        const { dispatch } = this.props;
        dispatch({
            type: 'broadcastActivityList/getListResolved',
            payload: {
                [type]: e.target.value,
            },
        });
    }
    handleConfirm = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'broadcastActivityList/confirmAction',
            payload: {
                isShowConfirmModal: false,
            }
        });
    }
    handleCancel = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'broadcastActivityList/getListResolved',
            payload: {
                isShowConfirmModal: false,
            }
        });
    }
    // 换页回调
    handleChangeCurPage = (currentPage) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'broadcastActivityList/getList',
            payload: {
                currentPage,
            },
        });
    }
    handleOnTableChange = (pagination, filters, sorter) => {
        const { dispatch } = this.props;
        if (sorter.order === "ascend") {
            dispatch({
                type: 'broadcastActivityList/getList',
                payload: {
                    sortType: 4,
                    orderBy: sorter.field,
                }
            });
        } else if (sorter.order === "descend") {
            dispatch({
                type: 'broadcastActivityList/getList',
                payload: {
                    sortType: 3,
                    orderBy: sorter.field,
                }
            });
        }
    }
    handleCopyUrl(pushUrl){
        console.log('pushUrl',pushUrl);
        copy(pushUrl);
    }
    handleClear=(type)=>{
        const {dispatch,} = this.props;
          dispatch({
            type: 'broadcastActivityList/getList',
            payload:{
             [type]:""
            }
          });
      }
    render() {
        const {
            dispatch,
            broadcastActivityList: {
                pageSize,
                totalCount,
                isTableLoading,
                list,
                currentPage,
                isShowConfirmModal,
                actionText,
                startTime,
                endTime,
                csStatusMap,
                roomId,
                title,
                keywords,
                csStatus,
            },
        } = this.props;

        const columns = [
            {
                title: '直播间ID',
                dataIndex: 'roomId',
                key: 'roomId',
                render: (roomId, record) => {
                    return <Link to={`/operation/media/broadcast-manage/broadcast-activity-list/broadcast-detail/2/${record.id}`}>{record.roomId}</Link>
                }
            },
            {
                title: '活动标题',
                dataIndex: 'title',
                key: 'title',
                render: (_, record) => {
                    return (<Tooltip title={record.title}>
                        <div style={{width:'60px'}} className={globalStyles.twoLine}>{record.title}</div>
                        </Tooltip>
                    );
                },
            },
            {
                title: '封面',
                dataIndex: 'cover',
                key: 'cover',
                render: (cover, record) => {
                    return <img src={record.cover} style={{ width: '55px', height: '55px' }}></img>
                }

            },
            {
                title: '状态',
                dataIndex: 'csStatus',
                key: 'csStatus',
                render: (csStatus, record) => {
                    return (
                        <span >{csStatusMap[csStatus]} </span>
                    );
                },

            },
            {
                title: '主播',
                dataIndex: 'userInfo',
                key: 'userInfo',
                render: (_, record) => {
                    return (<Tooltip title={<span >{record.userInfo.nickname}/{record.userInfo.mobilePhone} </span>}>
                        <div style={{width:'60px'}} className={globalStyles.twoLine}>{record.userInfo.nickname}/{record.userInfo.mobilePhone} </div>
                        </Tooltip>
                    );
                },
            },
            {
                title: '活动时间',
                dataIndex: 'planStartAt',
                key: 'planStartAt',
                sorter: true,
                render: (_, record) => {
                    return (
                        <div>
                            <p>{record.planStartAt}</p>
                            <p>{record.planEndAt}</p>
                        </div>
                    );
                },
            },
            {
                title: '录制时间',
                dataIndex: 'realStartAt',
                key: 'realStartAt',
                render: (_, record) => {
                    return (
                        <div>
                            <p>{record.realStartAt}</p>
                            <p>{record.realEndAt}</p>
                        </div>
                    );
                },

            },
            {
                title: '真实观看人数（人）',
                dataIndex: 'realViewerCount',
                key: 'realViewerCount',
                render: (_, record) => {
                    return (
                        <Tooltip title={
                            <div>
                                <p>系统累计增加人数：{record.fakeViewerCount}</p>
                                <p>总观看人数{record.totalViewerCount}</p>
                            </div>
                        }>
                            <span>{record.realViewerCount}</span>
                        </Tooltip>
                    );
                },
            },
            {
                title: '排序值',
                dataIndex: 'sortOrder',
                key: 'sortOrder',
                sorter: true,

            },
            {
                title: '推流地址',
                dataIndex: 'pushUrl',
                key: 'pushUrl',
                render: (_, record) => {
                    return (<div title="点击复制推流链接">
                        <div style={{width:'100px',height:'20px',lineHeight:'20px',overflow:'hidden'}} >{record.pushUrl}</div>
                        <Icon style={{cursor:'Pointer',color:'#1890FF'}} onClick={this.handleCopyUrl.bind(this,record.pushUrl)} type="copy" />
                        </div>
                    )    
                }

            },
            {
                title: '操作',
                dataIndex: 'actionList',
                key: 'actionList',
                render: (actionList, record) => {
                    return actionList.map((item, index) => {
                        if (+item.type === 1) {
                            return <Link to={`/operation/media/broadcast-manage/broadcast-activity-list/broadcast-detail/1/${record.id}`}><Button type="primary" ghost key={index} style={{ marginLeft: 10 }}>{item.name}</Button></Link>
                        } else {
                            return <Button type="primary" ghost key={index} style={{ marginLeft: 10 }} onClick={this.handleActionList.bind(this, item.url, item.name, record.id)}>{item.name}</Button>
                        }

                    })
                }
            },
        ]
        return (
            <PageHeaderLayout title="直播活动列表">
                <Card bordered={false}>
                    <Search
                        placeholder="直播间ID"
                        value={roomId}
                        onChange={this.handleSearchChange.bind(this, 'roomId')}
                        onSearch={this.handleSearchBroadcast.bind(this, 'roomId')}
                        style={{ width: 200, marginRight: '10px' }}
                        suffix={roomId?<ClearIcon 
                            handleClear={this.handleClear.bind(this,"roomId")}
                        />:""} 
                    />
                    <Search
                        placeholder="活动标题"
                        onChange={this.handleSearchChange.bind(this, 'title')}
                        value={title}
                        onSearch={this.handleSearchBroadcast.bind(this, 'title')}
                        style={{ width: 200, marginRight: '10px' }}
                        suffix={title?<ClearIcon 
                            handleClear={this.handleClear.bind(this,"title")}
                        />:""} 
                    />
                    <Search

                        placeholder="主播姓名/手机号"
                        value={keywords}
                        onChange={this.handleSearchChange.bind(this, 'keywords')}
                        onSearch={this.handleSearchBroadcast.bind(this, 'keywords')}
                        suffix={keywords?<ClearIcon 
                            handleClear={this.handleClear.bind(this,"keywords")}
                        />:""} 
                        style={{ width: 200, marginRight: '10px' }}
                    />
                    <Select
                        value={csStatusMap[csStatus]}
                        placeholder="请选择状态"
                        style={{ width: 150, marginRight: '10px' }}
                        dropdownMatchSelectWidth={false}
                        onSelect={this.handleSearchBroadcast.bind(this, "csStatus")}
                    >
                        <Option value={""}>全部</Option>
                        {
                            Object.keys(csStatusMap).map(item => (
                                <Option value={item} key={item}>{csStatusMap[item]}</Option>
                            ))
                        }
                    </Select>
                    <span>活动开始时间：</span>
                    <DatePicker.RangePicker
                        onChange={this.handleChangeDate.bind(this)}
                        style={{ marginRight: '10px' }}
                        defaultValue={[startTime ? moment(startTime, "YYYY-MM-DD") : '', endTime ? moment(endTime, "YYYY-MM-DD") : '']}
                        format="YYYY-MM-DD"
                    />
                    <Link to={`/operation/media/broadcast-manage/broadcast-activity-list/broadcast-detail`}> <Button type='primary'>+新增</Button></Link>
                    <Table
                        // dataSource={articleList}
                        columns={columns}
                        style={{ marginTop: '15px' }}
                        bordered
                        rowKey={list => list.id && list.id}
                        onChange={this.handleOnTableChange}
                        dataSource={list}
                        pagination={{
                            current: currentPage,
                            pageSize,
                            total: totalCount,
                            showSizeChanger: true,
                            onShowSizeChange: this.handleChangePageSize,
                            onChange: this.handleChangeCurPage,
                            pageSizeOptions: ['40', '50', '60', '80', '100', '120', '150', '200', '300'],
                            showTotal:total => `共 ${total} 个结果`,
                        }}
                        loading={isTableLoading}
                    />
                    <Modal
                        visible={isShowConfirmModal}
                        title="确认"
                        onOk={this.handleConfirm}
                        onCancel={this.handleCancel}
                    >
                        <p style={{ textAlign: 'center' }}>{`请确认是否${actionText}?`}</p>
                    </Modal>
                </Card>
            </PageHeaderLayout>
        );
    }
}
