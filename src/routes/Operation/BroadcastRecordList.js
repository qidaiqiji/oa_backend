import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import moment from 'moment';
import globalStyles from '../../assets/style/global.less';
import 'braft-editor/dist/index.css'
import { getUrl } from '../../utils/request';
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
    broadcastRecordList: state.broadcastRecordList,
}))

export default class BroadcastRecordList extends PureComponent {
    componentWillMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'broadcastRecordList/getConfig',
            payload: {
            }
        });
        dispatch({
            type: 'broadcastRecordLi<Tablest/getList',
            payload: {
            }
        });
    }
    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'broadcastRecordList/unmount',
        });
    }
    handleChangeDate = (dates, dateStrings) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'broadcastRecordList/getList',
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
            type: 'broadcastRecordList/getListResolved',
            payload: {
                actionUrl,
                actionText,
                isShowConfirmModal: true,
                id: recordId,
            }
        });
    }
    // handleChangePageSize = (currentPage, pageSize) => {
    //     const { dispatch } = this.props;
    //     dispatch({
    //         type: 'broadcastRecordList/getList',
    //         payload: {
    //             currentPage: 1,
    //             pageSize,
    //         },
    //     });
    // }
    handleSearchBroadcast(type, e) {
        const { dispatch } = this.props;
        dispatch({
            type: 'broadcastRecordList/getList',
            payload: {
                [type]: e,
                currentPage: 1,
            },
        });
    }
    handleConfirm = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'broadcastRecordList/confirmAction',
            payload: {
                isShowConfirmModal: false,
            }
        });
    }
    handleCancel = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'broadcastRecordList/getListResolved',
            payload: {
                isShowConfirmModal: false,
            }
        });
    }
    // 换页回调
    // handleChangeCurPage = (currentPage) => {
    //     const { dispatch } = this.props;
    //     dispatch({
    //         type: 'broadcastRecordList/getList',
    //         payload: {
    //             currentPage,
    //         },
    //     });
    // }
    handleOnTableChange = (pagination, filters, sorter) => {
        const { dispatch } = this.props;
        if (sorter.order === "ascend") {
            dispatch({
                type: 'broadcastRecordList/getList',
                payload: {
                    sortType: 4,
                    orderBy: sorter.field,
                    currentPage: pagination.current,
                    pageSize: pagination.pageSize,
                }
            });
        } else if (sorter.order === "descend") {
            dispatch({
                type: 'broadcastRecordList/getList',
                payload: {
                    sortType: 3,
                    currentPage: pagination.current,
                    pageSize: pagination.pageSize,

                }
            });
        }else {
            dispatch({
              type: 'broadcastRecordList/getList',
              payload: {
                currentPage: pagination.current,
                pageSize: pagination.pageSize,
              }
            });
          }
    }
    handleClear=(type)=>{
        const {dispatch,} = this.props;
          dispatch({
            type: 'broadcastRecordList/getList',
            payload:{
             [type]:""
            }
          });
      }
    render() {
        const {
            dispatch,
            broadcastRecordList: {
                pageSize,
                totalCount,
                isTableLoading,
                list,
                currentPage,
                isShowConfirmModal,
                actionText,
                startTime,
                endTime,
                statusMap,
                addTypeMap,
                id,
                roomId,
                title,
                keywords,
            },
        } = this.props;

        const columns = [
            {
                title: '直播间ID',
                dataIndex: 'liveId',
                key: 'liveId',
                render: (liveId, record) => {
                    return <Link to={`/operation/media/broadcast-manage/broadcast-detail/2/${record.liveId}`}>{record.liveId}</Link>
                }
            },
            {
                title: '活动标题',
                dataIndex: 'title',
                key: 'title',

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
                title: '类型',
                dataIndex: 'addType',
                key: 'addType',
            },
            {
                title: '状态',
                dataIndex: 'showStatus',
                key: 'showStatus',
                render: (_, record) => {
                    return (
                        // <span style={{}}>{record.status} </span>
                        <span style={{ color: record.showStatusColor }}>{record.showStatus} </span>
                    );
                },

            },
            {
                title: '主播',
                dataIndex: 'userInfo',
                key: 'userInfo',
                render: (_, record) => {
                    return (
                        <span style={{}}>{record.userInfo.nickname}/{record.userInfo.mobilePhone} </span>
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
                                <div>系统累计增加人数：{record.fakeViewerCount}</div>
                                <div>总观看人数{record.totalViewerCount}</div>
                            </div>
                        }>
                            <span>{record.userInfo.nickname}</span>
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
                title: '操作',
                dataIndex: 'actionList',
                key: 'actionList',
                render: (actionList, record) => {
                    return actionList.map((item, index) => {
                        if (+item.type === 1) {
                            return <Link to={`/operation/media/broadcast-manage/broadcast-record-list/broadcast-record-detail/1/${record.id}`}><Button type="primary" ghost key={index} style={{ marginLeft: 10 }}>{item.name}</Button></Link>
                        } else {
                            return <Button type="primary" ghost key={index} style={{ marginLeft: 10 }} onClick={this.handleActionList.bind(this, item.url, item.name, record.id)}>{item.name}</Button>
                        }

                    })
                }
            },
        ]

        return (
            <PageHeaderLayout title="录播活动列表">
                <Card bordered={false}>
                    <Search
                        placeholder="直播间ID"
                        onSearch={this.handleSearchBroadcast.bind(this, 'roomId')}
                        style={{ width: 150, marginRight: '10px' }}
                        suffix={roomId?<ClearIcon 
                            handleClear={this.handleClear.bind(this,"roomId")}
                        />:""} 
                    />
                    <Search
                        placeholder="活动标题"
                        onSearch={this.handleSearchBroadcast.bind(this, 'title')}
                        style={{ width: 180, marginRight: '10px' }}
                        suffix={title?<ClearIcon 
                            handleClear={this.handleClear.bind(this,"title")}
                        />:""} 
                    />
                    <Search
                        placeholder="主播姓名/手机号"
                        onSearch={this.handleSearchBroadcast.bind(this, 'keywords')}
                        style={{ width: 180, marginRight: '10px' }}
                        suffix={keywords?<ClearIcon 
                            handleClear={this.handleClear.bind(this,"keywords")}
                        />:""} 
                    />
                    <Select
                        // value={serviceTypeMap[serviceTypeInput]}
                        placeholder="请选择状态"
                        dropdownMatchSelectWidth={false}
                        style={{ width: 150, marginRight: '10px' }}
                        onSelect={this.handleSearchBroadcast.bind(this, "csStatus")}
                    >
                        <Option value={""}>全部</Option>
                        {
                            Object.keys(statusMap).map(item => (
                                <Option value={item} key={item}>{statusMap[item]}</Option>
                            ))
                        }
                    </Select>
                    <Select
                        // value={serviceTypeMap[serviceTypeInput]}
                        placeholder="请选择类型"
                        dropdownMatchSelectWidth={false}
                        style={{ width: 150, marginRight: '10px' }}
                        onSelect={this.handleSearchBroadcast.bind(this, "addType")}
                    >
                        <Option value={""}>全部</Option>
                        {
                            Object.keys(addTypeMap).map(item => (
                                <Option value={item} key={item}>{addTypeMap[item]}</Option>
                            ))
                        }
                    </Select>
                    <span>录制时间：</span>
                    <DatePicker.RangePicker
                        onChange={this.handleChangeDate.bind(this)}
                        style={{ marginRight: '10px' }}
                        defaultValue={[startTime ? moment(startTime, "YYYY-MM-DD") : '', endTime ? moment(endTime, "YYYY-MM-DD") : '']}
                        format="YYYY-MM-DD"
                    />
                    <Link to={`/operation/media/broadcast-manage/broadcast-record-list/broadcast-record-detail`}> <Button type='primary'>+新增</Button></Link>
                    <Table
                        // dataSource={articleList}
                        columns={columns}
                        style={{ marginTop: '15px' }}
                        bordered
                        onChange={this.handleOnTableChange}
                        dataSource={list}
                        pagination={{
                            current: currentPage,
                            pageSize,
                            total: totalCount,
                            showSizeChanger: true,
                            // onShowSizeChange: this.handleChangePageSize,
                            // onChange: this.handleChangeCurPage,
                            pageSizeOptions: ['40', '50', '60', '80', '100', '120', '150', '200', '300'],
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
