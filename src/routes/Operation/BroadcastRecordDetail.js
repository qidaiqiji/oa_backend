import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import moment from 'moment';
import globalStyles from '../../assets/style/global.less';
import 'braft-editor/dist/index.css'
import styles from './BroadcastDetail.less';
import { getUrl } from '../../utils/request';
import PostVideo from '../../components/PostVideo/PostVideo';
import Debounce from 'lodash-decorators/debounce';
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
    Radio,
    Table,
    Checkbox,
    notification,
    AutoComplete,
    message,
    Tooltip,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { setInterval } from 'core-js';
const TabPane = Tabs.TabPane;
const { TextArea, Search } = Input;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const { MonthPicker, RangePicker } = DatePicker;
@connect(state => ({
    broadcastRecordDetail: state.broadcastRecordDetail,
    resourcePool: state.resourcePool,
}))
export default class BroadcastRecordDetail extends PureComponent {
    componentWillMount() {
        const { dispatch } = this.props;
        console.log('this.props.match.params', this.props.match.params);
        dispatch({
            type: 'broadcastRecordDetail/getConfig',
        });
        if (this.props.match.params.id == undefined) {
            return
        } else {
            dispatch({
                type: 'broadcastRecordDetail/getContentDetail',
                payload: {
                    id: +this.props.match.params.id,
                    op: this.props.match.params.op?(+this.props.match.params.op):'',

                }
            });
        }
    }
    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'broadcastRecordDetail/unmount',
        });
    }
    handledModalVisableImgFace(type) {
        const { dispatch, broadcastRecordDetail } = this.props;
        const { videoList, op } = broadcastRecordDetail;
        if (JSON.stringify(videoList) != "{}") {
            dispatch({
                type: 'broadcastRecordDetail/getListResolved',
                payload: {
                    [type]: true,
                }
            });
        } else {
            message.warning('请先上传视频');
        }
    }
    handledModalVisable(type) {
        const { dispatch, broadcastRecordDetail } = this.props;
        const { isGoodsListFirst, op } = broadcastRecordDetail;
        dispatch({
            type: 'broadcastRecordDetail/getListResolved',
            payload: {
                [type]: true,
            }
        });
        if (type == 'addGoodsModalVisible') {
            if (isGoodsListFirst == '') {
                dispatch({
                    type: 'broadcastRecordDetail/getGoodsList',
                    isGoodsListFirst: 1,
                });
                dispatch({
                    type: 'broadcastRecordDetail/getBrandList',
                });
            }
        }
    }
    handleSearchGoodsName(type, e) {
        const { dispatch } = this.props;
        dispatch({
            type: 'broadcastRecordDetail/getGoodsList',
            payload: {
                [type]: e,
                brandId: '',
                curPage: 1,
            }
        });
    }
    hanleSubmitInform(type) {
        const { dispatch } = this.props;
        dispatch({
            type: 'broadcastRecordDetail/getBroadcastSubmit',
            payload: {
                showStatus: type,
            }
        });
    }
    handleSelected(e) {
        const { dispatch } = this.props;
        dispatch({
            type: 'broadcastRecordDetail/getGoodsList',
            payload: {
                brandId: e,
                curPage: 1,
            }
        });
    }
    handleCancelModal(type) {
        const { dispatch } = this.props;
        dispatch({
            type: 'broadcastRecordDetail/getListResolved',
            payload: {
                [type]: false,
            }
        });
        dispatch({
            type: 'resourcePool/clearChosedList',
        });
    }
    handledModalVisableUpload(resourceType) {
        const { dispatch, resourcePool } = this.props;
        const { isfirst, isFirstImg, op } = resourcePool;
        dispatch({
            type: 'broadcastRecordDetail/getListResolved',
            payload: {
                isShowUploadVideoModal: true,
            }
        });
        if (isfirst == '') {
            dispatch({
                type: 'resourcePool/getVideoList',
                payload: {
                    isfirst: 1,
                }
            });
        }
    }
    handleConfirmSelect(type) {
        const { dispatch, resourcePool } = this.props;
        const {
            selectedVideo } = resourcePool;
        let copySelectedVideo = JSON.parse(JSON.stringify(selectedVideo))
        dispatch({
            type: 'broadcastRecordDetail/getListResolved',
            payload: {
                videoList: copySelectedVideo[0],
                videoId: copySelectedVideo[0].videoId,
                isShowUploadVideoModal: false,
                imgList: [copySelectedVideo[0].videoFace],
            }
        });
        dispatch({
            type: 'resourcePool/clearChosedVideoList',
        });
    }
    onChangeIscheckStatus(type, e) {
        const { dispatch } = this.props;
        dispatch({
            type: 'broadcastRecordDetail/getListResolved',
            payload: {
                [type]: e.target.checked,
            },
        });
    }
    handleChangeCurPage(curPage) {
        const { dispatch, broadcastRecordDetail } = this.props;
        dispatch({
            type: 'broadcastRecordDetail/getGoodsList',
            payload: {
                curPage,
            }
        });

    }
    onChangeChoseIsProvide = (e) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'broadcastRecordDetail/getListResolved',
            payload: {
                isSupplier: e.target.value,
            },
        });
    }
    // 选择勾选商品
    handleSelectRows(selectedRowIds, selectedRows) {
        const { dispatch } = this.props;
        dispatch({
            type: 'broadcastRecordDetail/getListResolved',
            payload: {
                selectedRowIds,
                selectedRows,
            },
        });
    }
    handleChoselModal() {
        const { dispatch } = this.props;
        const { selectedRowIds, selectedRows } = this.props.broadcastRecordDetail;
        dispatch({
            type: 'broadcastRecordDetail/changeProvideRows',
            payload: {
                addGoodsModalVisible: false,
                selectedRowIds,
                selectedRows,
            },
        });
    }
    delectImgface(type) {
        const { dispatch, broadcastRecordDetail } = this.props;
        const { op } = broadcastRecordDetail;
        if (op == 2) {
            message.warning('当前属于查看状态不允许编辑')
        } else {
            if (type == 'img') {
                dispatch({
                    type: 'broadcastRecordDetail/getListResolved',
                    payload: {
                        imgList: [],
                    },
                });
            } else if (type == 'video') {
                dispatch({
                    type: 'broadcastRecordDetail/getListResolved',
                    payload: {
                        videoList: {},
                    },
                });
            }
        }
    }
    // 删除行
    handleDeleteColumn(id) {
        const { dispatch, broadcastRecordDetail } = this.props;
        const { totalselectedRows } = broadcastRecordDetail;
        const index = totalselectedRows.findIndex(element => element.id === id);
        totalselectedRows.splice(index, 1);
        dispatch({
            type: 'broadcastRecordDetail/getListResolved',
            payload: {
                totalselectedRows,
            },
        });
    }
    handleImgFaceChose(type) {
        const { dispatch, broadcastRecordDetail } = this.props;
        const { fileListReturn, videofileReturn } = broadcastRecordDetail;
        if (type == 'UploadVisible') {
            dispatch({
                type: 'broadcastRecordDetail/getListResolved',
                payload: {
                    imgList: fileListReturn,
                    [type]: false,
                    fileList: []
                },
            });
        } else if (type == 'UploadVideoVisible') {
            dispatch({
                type: 'broadcastRecordDetail/getListResolved',
                payload: {
                    [type]: false,
                    videoList: videofileReturn,
                    videofile: [],
                    imgList: videofileReturn.videoFace,
                },
            });
        }


    }
    beforeUpload(file) {
        this.funcName = 'beforeUpload';
        const isIMG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/bmp';
        if (!isIMG) {
            message.error('你只能上传图片文件,.jpeg.png.bmp.gif!');
        }
        const isLt500K = file.size / 1024 / 1024 < 0.48;
        if (!isLt500K) {
            message.error('图片大小必须小于 500K!');
        }
        return isIMG && isLt500K;
    }
    beforeUploadVideo(file) {
        const isVideo = file.type === 'video/mp4' || file.type === 'video/rmvb' || file.type === 'video/webm' || file.type === 'audio/ogg' || file.type === 'video/ogg';
        if (!isVideo) {
            message.error('你只能上传视频文件!');
        }
        const isLt25M = file.size / 1024 / 1024 < 25;
        if (!isLt25M) {
            message.error('视频大小不能超过 25MB!');
        }
        return isVideo && isLt25M;
    }
    handleRemoveFile(type) {
        const { dispatch, } = this.props;
        if (type == 'img') {
            dispatch({
                type: 'broadcastRecordDetail/getListResolved',
                payload: {
                    fileList: [],
                },
            });
        } else if (type == 'video') {
            dispatch({
                type: 'broadcastRecordDetail/getListResolved',
                payload: {
                    videofile: [],
                },
            });
        }
    }
    handleChangeVideo(e) {
        const { dispatch } = this.props;
        if (e.file.status == 'uploading') {
            dispatch({
                type: 'broadcastRecordDetail/getListResolved',
                payload: {
                    videofile: e.fileList,
                },
            });
        }
        if (e.file.status == 'done') {

            dispatch({
                type: 'broadcastRecordDetail/getListResolved',
                payload: {
                    videofile: e.fileList,
                    videofileReturn: e.file.response.data,
                },
            });
        }
    }
    handleChangeImgSingle(e) {
        const { dispatch, } = this.props;
        if (e.file.status === 'error') {
            notification.error({
                message: '提示',
                description: '上传失败, 请稍后重试!',
            });
        }
        if (e.file.status === 'uploading') {
            dispatch({
                type: 'broadcastRecordDetail/getListResolved',
                payload: {
                    fileList: e.fileList,
                },
            });
        }
        if (e.file.status === 'done') {
            dispatch({
                type: 'broadcastRecordDetail/getvideoFaceChange',
                payload: {
                    fileListReturn: [e.file.response.data.videoFace],
                    version: e.file.response.data.version,
                    fileList: e.fileList,
                },
            });
        }
    }
    handleInputChanged(keyword, e) {
        const { dispatch } = this.props;
        dispatch({
            type: 'broadcastRecordDetail/getListResolved',
            payload: {
                [keyword]: event.target.value,
            },
        });
    }
    handleTableInputChanged(goodsId, e) {
        const { dispatch } = this.props;
        dispatch({
            type: 'broadcastRecordDetail/getTableListSort',
            payload: {
                goodsId,
                goodsIdsortOrder: event.target.value,
            },
        });
    }
    
    handleChangeDate(timeType, data, dataStrings) {
        const { dispatch } = this.props;
        if (timeType == 'activityTime') {
            dispatch({
                type: 'broadcastRecordDetail/getListResolved',
                payload: {
                    realStartAt: dataStrings[0],
                    realEndAt: dataStrings[1],
                    fakeStartAt:dataStrings[0],
                    fakeEndAt:dataStrings[1],
                },
            });
        }
        if (timeType == 'viewTime') {
            dispatch({
                type: 'broadcastRecordDetail/getListResolved',
                payload: {
                    fakeStartAt: dataStrings[0],
                    fakeEndAt: dataStrings[1],
                },
            });
        }
    }
    handleCreactUser() {
        const { dispatch } = this.props;
        dispatch({
            type: 'broadcastRecordDetail/onChangeCreatUser',
            payload: {
                newUserModalVisible: false,
            },
        });
    }
    // 选择主播
    handleSelectZhubo(keyVal, option) {
        const { dispatch, broadcastDetail } = this.props;
        const { children } = option.props;
        dispatch({
            type: 'broadcastRecordDetail/getSearchResult',
            payload: {
                keyVal,
                keywords: children,
            },
        });
    }
    // 搜索主播
    @Debounce(200)
    handleChangeZhubo(text) {
        const { dispatch } = this.props;
        dispatch({
            type: 'broadcastRecordDetail/getZhiboConfig',
            payload: {
                keywords: text,
            },
        });
    }
    render() {
        const {
            dispatch,
            broadcastRecordDetail: {
                curPage,
                pageSize,
                total,
                isTableLoading,
                UploadVisible,
                fileList,
                addGoodsModalVisible,
                goodsList,
                brandId,
                brandList,
                selectedRowIds,
                totalselectedRows,
                newUserModalVisible,
                imgList,
                viewImgfacevisible,
                realStartAt,
                realEndAt,
                fakeStartAt,
                fakeEndAt,
                title,
                customerName,
                mobile,
                sortOrder,
                fakeTotal,
                isSupplier,
                isHot,
                isShowUploadVideoModal,
                isShowUploadSucaiModal,
                UploadVideoVisible,
                videofile,
                videoList,
                viewVideovisible,
                keywords,
                zhuboMap,
                op,
                userId,
            },
            resourcePool: {
                selectedPictureList,
                selectedVideo,
            }
        } = this.props;
        const authord = `Basic ${window.btoa(`${localStorage.getItem('token')}:`)}`;
        // 拖拽组件
        const uploadButton = (
            <div>
                <Icon type='plus' />
                <div className="ant-upload-text">从本地上传</div>
            </div>
        );
        const columnsModal = [
            {
                title: '商品主图',
                dataIndex: 'img',
                width: 200,
                key: 'img',
                render: (src, record) => {
                    return <img src={src} style={{ width: 55, height: 55 }} />
                }
            },
            {
                title: '商品名称',
                dataIndex: 'goodsName',
                key: 'goodsName',
            },
            {
                title: '商品条码',
                dataIndex: 'goodsNo',
                key: 'goodsNo',
            },
            {
                title: '可用库存',
                dataIndex: 'canUseNum',
                key: 'canUseNum',

            },
            {
                title: '平台价',
                dataIndex: 'shopPrice',
                key: 'shopPrice'
            },
            {
                title: '活动价',
                dataIndex: 'actPrice',
                key: 'actPrice'
            },
            {
                title: '零售价',
                dataIndex: 'marketPrice',
                key: 'marketPrice'
            },
        ];
        const columns = [
            {
                dataIndex: 'operation',
                key: 'operation',
                width: 80,
                align: 'center',
                render: (_, record) => (
                    <Icon type="minus"
                        style={{ cursor: 'pointer', fontSize: '17px', fontWeight: 'bold', border: '1px solid #ccc', borderRadius: '4px', color: '#ccc' }}
                        onClick={this.handleDeleteColumn.bind(this, record.goodsId)}
                    />
                ),
            },
            {
                title: '商品名称',
                dataIndex: 'goodsName',
                key: 'goodsName',

            },
            {
                title: '条码',
                dataIndex: 'goodsNo',
                key: 'goodsNo',

            },
            {
                title: '排序值',
                dataIndex: 'sortOrder',
                key: 'sortOrder',
                render: (_, record) => (
                    <Input
                        value={record.sortOrder}
                        onChange={this.handleTableInputChanged.bind(this, record.goodsId)}
                        style={{ width: '100px', }}></Input>
                ),
            },
        ];
        return (
            <PageHeaderLayout title="录播详情">
                <Card bordered={false}>
                    <div className={styles.title} >基本信息</div>
                    <div className={styles.content}>
                        <div className={styles.actTitle}>
                            <p>
                                <b>*</b>
                                <span> 标题:</span>
                            </p>
                            <Input style={{ width: '500px', marginRight: '10px', }}
                                placeholder="请输入活动标题"
                                value={title}
                                maxLength='50'
                                disabled={op == 2 ? true : false}
                                onChange={this.handleInputChanged.bind(this, 'title')}
                            ></Input>
                            <span>0~50字</span>
                        </div>
                        <div>
                            <p>
                                <span> 录制时间:</span>
                            </p>
                            <DatePicker.RangePicker
                                showTime={{ format: 'HH:mm' }}
                                showToday
                                onChange={this.handleChangeDate.bind(this, 'activityTime')}
                                style={{ marginRight: '10px' }}
                                value={[realStartAt ? moment(realStartAt, "YYYY-MM-DD HH:mm:ss") : '', realEndAt ? moment(realEndAt, "YYYY-MM-DD HH:mm:ss") : '']}
                                format="YYYY-MM-DD HH:mm:ss"
                                disabled={op == 2 ? true : false}
                                disabled
                            />

                        </div>
                        <div>
                            <p>
                                <span> 主播:</span>

                            </p>
                            <Select
                                showSearch
                                placeholder={keywords}
                                style={{ width: 115, margin: '0 12px' }}
                                optionFilterProp="children"
                                disabled={op == 2 ? true : false}
                                filterOption={(input, option) => {
                                    return option.props.children.indexOf(input) >= 0;
                                }}
                                onSelect={this.handleSelectZhubo.bind(this)}
                                onSearch={this.handleChangeZhubo.bind(this)}
                                style={{ width: 200 }}
                                value={JSON.stringify(zhuboMap) != "{}"?zhuboMap[userId]:keywords}
                                // onChange={this.handleSelected.bind(this)}
                            >
                                {Object.keys(zhuboMap).map(key => (
                                    <Select.Option value={key}>{zhuboMap[key]}</Select.Option>
                                ))}
                            </Select>
                            {/* <AutoComplete
                                dataSource={zhuboMap ? Object.keys(zhuboMap).map(key => (
                                    <Select.Option value={key}>{zhuboMap[key]}</Select.Option>
                                )) : ''}
                                // onSearch文本框值变化时回调,onSelect被选中时调用
                                onSelect={this.handleSelectZhubo.bind(this)}
                                dropdownMatchSelectWidth={false}
                                onSearch={this.handleChangeZhubo.bind(this)}
                                className={globalStyles['input-sift']}
                                value={keywords}
                                disabled={op == 2 ? true : false}
                                allowClear
                            >
                                <Input.Search
                                    placeholder="请输入手机号/客户名称"
                                />
                            </AutoComplete> */}
                            <Button type='primary'
                                style={{ marginLeft: '10px' }}
                                disabled={op == 2 ? true : false}
                                onClick={this.handledModalVisable.bind(this, 'newUserModalVisible')}
                            >+新建用户</Button>
                        </div>
                        <div>
                            <p>
                                <b>*</b>
                                <span> 视频:</span>
                            </p>
                            <span>
                                <Icon type="exclamation-circle" style={{ fontSize: '16px', color: '#EDB20F' }} />
                                建议尺寸：？？？，，大小不超过？；
                            </span>
                            <div className={styles.imgUploadBox}>
                                {
                                    JSON.stringify(videoList) != "{}" ? (<div className={styles.imgBox}>
                                        {/* <img alt="example" style={{ width: '100%' }} src={imgList[0].url} /> */}
                                        <video style={{ width: '100%' }} src={videoList.url} ></video>

                                        <p>
                                            <Icon type="eye" title="预览视频" onClick={this.handledModalVisable.bind(this, 'viewVideovisible')} ></Icon>
                                            <Icon type="delete" title="删除视频" onClick={this.delectImgface.bind(this, 'video')}></Icon>
                                        </p>
                                    </div>) : (
                                            <div className={styles.UploadBox}>
                                                <p onClick={this.handledModalVisable.bind(this, 'UploadVideoVisible')}>本地上传</p>
                                                <p onClick={this.handledModalVisableUpload.bind(this, 'isShowUploadVideoModal')}>素材库上传</p>
                                            </div>
                                        )
                                }
                            </div>

                        </div>
                        <div>
                            <p>
                                <b>*</b>
                                <span> 封面:</span>
                            </p>
                            <span>
                                <Icon type="exclamation-circle" style={{ fontSize: '16px', color: '#EDB20F' }} />
                                建议尺寸：？？？，支持格式jpg、png，大小不超过500k；
                            </span>
                            <div className={styles.imgUploadBox}>
                                {
                                    imgList && imgList.length > 0 ? (<div className={styles.imgBox}>
                                        <img alt="example" style={{ width: '100%' }} src={imgList[0].url} />

                                        <p>
                                            <Icon type="eye" title="预览图片" onClick={this.handledModalVisable.bind(this, 'viewImgfacevisible')} ></Icon>
                                            <Icon type="delete" title="删除封面" onClick={this.delectImgface.bind(this, 'img')}></Icon>
                                        </p>
                                    </div>) : (
                                            <div className={styles.UploadBox}>
                                                <p style={{ marginTop: '30px' }} onClick={this.handledModalVisableImgFace.bind(this, 'UploadVisible')}>本地上传</p>
                                            </div>
                                        )
                                }
                            </div>

                        </div>
                        <div>
                            <p>
                                <span> 是否主推:</span>
                            </p>
                            <Checkbox
                                checked={isHot}
                                onChange={this.onChangeIscheckStatus.bind(this, 'isHot')}
                                disabled={op == 2 ? true : false}
                            ></Checkbox>
                        </div>
                        <div>
                            <p>
                                <span> 排序值:</span>
                            </p>
                            <Input
                                onChange={this.handleInputChanged.bind(this, 'sortOrder')}
                                disabled={op == 2 ? true : false}
                                value={sortOrder} style={{ width: '100px', }}></Input>
                        </div>
                    </div>
                    <div className={styles.title} >设置</div>
                    <div className={styles.content} >
                        <div>
                            <p>
                                <span> 观看人数:</span>
                            </p>
                            <DatePicker.RangePicker
                                showTime={{ format: 'HH:mm' }}
                                showToday
                                onChange={this.handleChangeDate.bind(this, 'viewTime')}
                                disabled={op == 2 ? true : false}
                                style={{ marginRight: '10px' }}
                                value={[moment(fakeStartAt, "YYYY-MM-DD HH:mm:ss") ,  moment(fakeEndAt, "YYYY-MM-DD HH:mm:ss") ]}
                                format="YYYY-MM-DD HH:mm:ss"
                            />
                            <span>,累计增加人数
                                <Input
                                    value={fakeTotal}
                                    onChange={this.handleInputChanged.bind(this, 'fakeTotal')}
                                    disabled={op == 2 ? true : false}
                                    style={{ width: '100px', margin: '0 10px' }}></Input>人
                            </span>
                        </div>
                        <div>
                            <p>
                                <span> 绑定商品:</span>
                            </p>
                            <Button type='primary'
                                style={{ marginLeft: '10px' }}
                                onClick={this.handledModalVisable.bind(this, 'addGoodsModalVisible')}
                                disabled={op == 2 ? true : false}
                            >+添加</Button>

                        </div>
                    </div>
                    <Table
                        style={{ marginTop: '20px' }}
                        columns={columns}
                        rowKey={totalselectedRows => totalselectedRows.goodsId && totalselectedRows.goodsId}
                        dataSource={totalselectedRows}
                        pagination={false}
                        bordered
                        loading={false}
                    />
                    <Modal
                        width={600}
                        height={236}
                        title="上传封面图"
                        visible={UploadVisible}
                        onCancel={this.handleCancelModal.bind(this, 'UploadVisible')}
                        onOk={this.handleImgFaceChose.bind(this, 'UploadVisible')}
                    >
                        <div style={{ height: '100px' }}>
                            <Upload
                                // action="http://192.168.0.231:3000/mock/29/content/img-resource/create"
                                action={`${getUrl(API_ENV)}/content/video-resource/create-face`}
                                headers={{
                                    authorization: `Basic ${window.btoa(`${localStorage.getItem('token')}:`)}`,
                                }}
                                data={{
                                    videoId: JSON.stringify(videoList) != "{}" ? videoList.videoId : ''
                                }}
                                onRemove={this.handleRemoveFile.bind(this, 'img')}
                                className={styles.iconUpload}
                                listType="picture-card"
                                fileList={fileList}
                                beforeUpload={this.beforeUpload.bind(this)}
                                // onPreview={this.handlePreview.bind(this)}
                                onChange={this.handleChangeImgSingle.bind(this)}
                            >
                                {fileList && fileList.length >= 1 ? null : uploadButton}
                            </Upload>
                        </div>

                    </Modal>
                    <Modal
                        width={600}
                        height={236}
                        title="上传视频"
                        visible={UploadVideoVisible}
                        onCancel={this.handleCancelModal.bind(this, 'UploadVideoVisible')}
                        onOk={this.handleImgFaceChose.bind(this, 'UploadVideoVisible')}
                    >
                        <div style={{ height: '100px' }}>
                            <Upload
                                // action="http://192.168.0.231:3000/mock/29/content/video-resource/create"
                                action={`${getUrl(API_ENV)}/content/video-resource/create`}
                                headers={{
                                    authorization: `Basic ${window.btoa(`${localStorage.getItem('token')}:`)}`,
                                }}
                                onRemove={this.handleRemoveFile.bind(this, 'video')}
                                className={styles.iconUpload}
                                listType="picture-card"
                                fileList={videofile}
                                beforeUpload={this.beforeUploadVideo.bind(this)}
                                onChange={this.handleChangeVideo.bind(this)}
                            >
                                {videofile && videofile.length > 0 ? '' : uploadButton}
                            </Upload>
                        </div>

                    </Modal>
                    <PostVideo
                        config={{
                            visible: isShowUploadVideoModal,
                            confirm: this.handleConfirmSelect.bind(this, isShowUploadVideoModal),
                            cancel: this.handleCancelModal.bind(this, 'isShowUploadVideoModal'),
                        }}
                    />
                    <Modal
                        width={1600}
                        visible={addGoodsModalVisible}
                        footer={null}
                        onCancel={this.handleCancelModal.bind(this, 'addGoodsModalVisible')}
                    >
                        <div style={{ borderBottom: '1px solid #ddd', paddingBottom: '3px', height: '40px', marginBottom: '10px' }}>
                            <b style={{ fontSize: '16px', lineHeight: '40px' }}>选择商品</b>
                            <div style={{ position: 'absolute', width: '150px', right: '50px', top: '24px' }}>
                                <Button style={{ marginRight: '20px' }}
                                    onClick={this.handleCancelModal.bind(this, 'addGoodsModalVisible')}
                                >取消</Button>
                                <Button
                                    onClick={this.handleChoselModal.bind(this)}
                                    type="primary"
                                >确定</Button>
                            </div>
                        </div>
                        <Search
                            placeholder="请输入商品条码"
                            onSearch={this.handleSearchGoodsName.bind(this, 'goodsSn')}
                            style={{ width: 200 }}
                        />
                        <Search
                            placeholder="请输入商品名称"
                            onSearch={this.handleSearchGoodsName.bind(this, 'keywords')}
                            style={{ width: 200, margin: '0 12px' }}
                        />
                        <Select
                            showSearch
                            placeholder="请选择品牌"
                            style={{ width: 115, margin: '0 12px' }}
                            optionFilterProp="children"
                            filterOption={(input, option) => {
                                return option.props.children.indexOf(input) >= 0;
                            }}
                            style={{ width: 200 }}
                            value={brandList[brandId]}
                            onChange={this.handleSelected.bind(this)}
                        >
                            {Object.keys(brandList).map(key => (
                                <Select.Option value={key}>{brandList[key]}</Select.Option>
                            ))}
                        </Select>
                        <Table
                            style={{ marginTop: '20px' }}
                            columns={columnsModal}
                            rowKey={goodsList => goodsList.goodsId}
                            dataSource={goodsList}
                            pagination={false}
                            bordered
                            loading={isTableLoading}
                            pagination={{
                                current: curPage,
                                pageSize,
                                total,
                                onChange: this.handleChangeCurPage.bind(this),
                                showTotal:total => `共 ${total} 个结果`,
                            }}
                            rowSelection={{
                                selectedRowKeys: selectedRowIds,
                                onChange: this.handleSelectRows.bind(this),
                                getCheckboxProps: record => ({
                                    disabled: totalselectedRows.some((goodsInfo) => {
                                        return +record.goodsId === +goodsInfo.goodsId;
                                    }),
                                }),
                            }}
                        />
                    </Modal>
                    <Modal
                        visible={newUserModalVisible}
                        title="新建用户"
                        onOk={this.handleCreactUser.bind(this)}
                        onCancel={this.handleCancelModal.bind(this, 'newUserModalVisible')}
                    >
                        <div className={styles.modalNewUser}>
                            <p>
                                <b>*</b>
                                <span> 客户名称：</span>
                                <Input
                                    value={customerName}
                                    onChange={this.handleInputChanged.bind(this, 'customerName')}
                                ></Input>
                            </p>
                            <p >
                                <b>*</b>
                                <span> 手机号：</span>
                                <Input
                                    value={mobile}
                                    onChange={this.handleInputChanged.bind(this, 'mobile')}
                                ></Input>
                            </p>
                            <div>
                                <span>供应商账号：</span>
                                <Checkbox
                                    checked={isSupplier}
                                    onChange={this.onChangeIscheckStatus.bind(this, 'isSupplier')}
                                ></Checkbox>
                            </div>
                        </div>
                    </Modal>
                    <Modal
                        visible={viewImgfacevisible}
                        footer={null}
                        onCancel={this.handleCancelModal.bind(this, 'viewImgfacevisible')}
                    >
                        {
                            imgList && imgList.length > 0 ? <img style={{ width: '100%', height: '100%' }} src={imgList[0].url} alt="" /> : ''
                        }

                    </Modal>
                    <Modal
                        visible={viewVideovisible}
                        footer={null}
                        onCancel={this.handleCancelModal.bind(this, 'viewVideovisible')}
                    >
                        {
                            JSON.stringify(videoList) != "{}" ? <video style={{ width: '100%', height: '100%' }} src={videoList.url} alt="" /> : ''
                        }
                    </Modal>

                </Card>
                <div className={styles.submit}>
                    <Button onClick={this.hanleSubmitInform.bind(this, '1')}>保存草稿</Button>
                    <Button onClick={this.hanleSubmitInform.bind(this, '2')} type='primary'>发布</Button>
                </div>
            </PageHeaderLayout>
        );
    }
}
