import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import moment from 'moment';
import globalStyles from '../../assets/style/global.less';
import 'braft-editor/dist/index.css'
import styles from './BroadcastDetail.less';
import { getUrl } from '../../utils/request';
import PostPicture from '../../components/PostPicture/PostPicture';
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
    broadcastDetail: state.broadcastDetail,
    resourcePool: state.resourcePool,
}))
export default class BroadcastDetail extends PureComponent {
    componentWillMount() {
        const { dispatch } = this.props;
        // op 1是修改，2是详情
        console.log('this.this.props.match.params', this.props.match.params)
        dispatch({
            type: 'broadcastDetail/getConfig',
        });
        if (this.props.match.params.id == undefined) {
            return
        } else {
            console.log('ooo111')
            dispatch({
                type: 'broadcastDetail/getContentDetail',
                payload: {
                    id: +this.props.match.params.id,
                    op: this.props.match.params.op ? (+this.props.match.params.op) : '',
                }
            });
        }
    }
    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'broadcastDetail/unmount',
        });
    }
    onChangeIscheckStatus(type, e) {
        const { dispatch } = this.props;
        dispatch({
            type: 'broadcastDetail/getListResolved',
            payload: {
                [type]: e.target.checked,
            },
        });
    }
    handledModalVisable(type) {
        const { dispatch, broadcastDetail } = this.props;
        const { isGoodsListFirst } = broadcastDetail;
        dispatch({
            type: 'broadcastDetail/getListResolved',
            payload: {
                [type]: true,
            }
        });
        if (isGoodsListFirst == '') {
            dispatch({
                type: 'broadcastDetail/getGoodsList',
                isGoodsListFirst: 1,
            });
            dispatch({
                type: 'broadcastDetail/getBrandList',
            });
        }
    }
    handleSearchGoodsName(type, e) {
        const { dispatch } = this.props;
        dispatch({
            type: 'broadcastDetail/getGoodsList',
            payload: {
                [type]: e,
                brandId: '',
                curPage: 1,
            }
        });
    }
    hanleSubmitInform(type) {
        const { dispatch, broadcastDetail } = this.props;
        dispatch({
            type: 'broadcastDetail/getBroadcastSubmit',
            payload: {
                showStatus: type,
            }
        });
    }
    handleSelected(e) {
        const { dispatch } = this.props;
        dispatch({
            type: 'broadcastDetail/getGoodsList',
            payload: {
                brandId: e,
                curPage: 1,
            }
        });
    }
    handleCancelModal(type) {
        const { dispatch } = this.props;
        dispatch({
            type: 'broadcastDetail/getListResolved',
            payload: {
                [type]: false,
            }
        });
        if (type == 'UploadVisible') {
            dispatch({
                type: 'resourcePool/clearChosedList',
            });
        }
    }
    handleConfirmSelectPic() {
        const { dispatch, resourcePool } = this.props;
        const { selectedPictureList } = resourcePool;
        dispatch({
            type: 'broadcastDetail/getListResolved',
            payload: {
                imgList: selectedPictureList,
                isShowUploadSucaiModal: false,
            }
        });
        dispatch({
            type: 'resourcePool/clearChosedList',
        });
    }
    handleChangeCurPage(curPage) {
        const { dispatch, broadcastDetail } = this.props;
        dispatch({
            type: 'broadcastDetail/getGoodsList',
            payload: {
                curPage,
            }
        });
    }
    // 选择勾选商品
    handleSelectRows(selectedRowIds, selectedRows) {
        const { dispatch } = this.props;
        dispatch({
            type: 'broadcastDetail/getListResolved',
            payload: {
                selectedRowIds,
                selectedRows,
            },
        });
    }
    handleChoselModal() {
        const { dispatch } = this.props;
        const { selectedRowIds, selectedRows } = this.props.broadcastDetail;
        dispatch({
            type: 'broadcastDetail/changeProvideRows',
            payload: {
                addGoodsModalVisible: false,
                selectedRowIds,
                selectedRows,
            },
        });
    }
    delectImgface() {
        const { dispatch, broadcastDetail } = this.props;
        const { op } = broadcastDetail;
        if (op == 2) {
            message.warning('不允许编辑')
        } else {
            dispatch({
                type: 'broadcastDetail/getListResolved',
                payload: {
                    imgList: [],
                },
            });
        }
    }
    // 删除行
    handleDeleteColumn(id) {
        const { dispatch, broadcastDetail } = this.props;
        const { totalselectedRows } = broadcastDetail;
        const index = totalselectedRows.findIndex(element => element.goodsId == id);
        totalselectedRows.splice(index, 1);
        dispatch({
            type: 'broadcastDetail/getListResolved',
            payload: {
                totalselectedRows,
            },
        });
    }
    handleImgFaceChose(type) {
        const { dispatch, broadcastDetail } = this.props;
        const { fileListReturn } = broadcastDetail;
        dispatch({
            type: 'broadcastDetail/getListResolved',
            payload: {
                imgList: fileListReturn,
                [type]: false,
            },
        });

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
    handleRemoveImg() {
        const { dispatch, } = this.props;
        dispatch({
            type: 'broadcastDetail/getListResolved',
            payload: {
                fileList: [],
            },
        });
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
                type: 'broadcastDetail/getListResolved',
                payload: {
                    fileList: e.fileList,
                },
            });
        }
        if (e.file.status === 'done') {
            dispatch({
                type: 'broadcastDetail/getvideoFaceChange',
                payload: {
                    fileListReturn: e.file.response.data.imgs,
                    fileList: e.fileList,
                },
            });
        }
    }
    handleSelectChange(value) {
        const { dispatch } = this.props;
        dispatch({
            type: 'broadcastDetail/getListResolved',
            payload: {
                roomId: value,
            }
        })
    }
    handleInputChanged(keyword, e) {
        const { dispatch } = this.props;
        dispatch({
            type: 'broadcastDetail/getListResolved',
            payload: {
                [keyword]: event.target.value,
            },
        });
    }
    handleTableInputChanged(goodsId, e) {
        const { dispatch } = this.props;
        dispatch({
            type: 'broadcastDetail/getTableListSort',
            payload: {
                goodsId,
                goodsIdsortOrder: e.target.value,
            },
        });
    }
    handleChangeDateOk() {
        const { dispatch, broadcastDetail } = this.props;
        const { planStartAt, planEndAt } = broadcastDetail;
        let time1 = new Date(planStartAt);
        let stime1 = time1.getTime();
        let time2 = new Date(planEndAt);
        let stime2 = time2.getTime();
        let timesub = (stime2 - stime1) / 1000 / 3600;
        if (timesub > 6) {
            dispatch({
                type: 'broadcastDetail/getListResolved',
                payload: {
                    timeIsWrong: true,


                },
            });
        }

    }
    handleChangeDate(timeType, data, dataStrings) {
        const { dispatch } = this.props;

        if (timeType == 'activityTime') {
            dispatch({
                type: 'broadcastDetail/getListResolved',
                payload: {
                    planStartAt: dataStrings[0],
                    planEndAt: dataStrings[1],
                    fakeStartAt: dataStrings[0],
                    fakeEndAt: dataStrings[1],
                    timeIsWrong: false,
                },
            });
            // if (timesub < 6) {
            //     dispatch({
            //         type: 'broadcastDetail/getListResolved',
            //         payload: {
            //             planStartAt: dataStrings[0],
            //             planEndAt: dataStrings[1],
            //             timeIsWrong: false,
            //         },
            //     });
            // } else {
            //     dispatch({
            //         type: 'broadcastDetail/getListResolved',
            //         payload: {
            //             timeIsWrong: true,
            //         },
            //     });
            // }

        }
        if (timeType == 'viewTime') {
            dispatch({
                type: 'broadcastDetail/getListResolved',
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
            type: 'broadcastDetail/onChangeCreatUser',
            payload: {
                newUserModalVisible: false,
            },
        });
    }
    // 选择主播
    handleSelectZhubo(keyVal, option) {
        console.log('keyVal+option',keyVal,option)
        const { dispatch, broadcastDetail } = this.props;
        const { children } = option.props;
        console.log('children444',children)
        dispatch({
            type: 'broadcastDetail/getSearchResult',
            payload: {
                keyVal,
                keywords: children,
            },
        });
    }
    // 搜索主播
    @Debounce(200)
    handleChangeZhubo(text) {
        console.log('text444',text);
        const { dispatch } = this.props;
        dispatch({
            type: 'broadcastDetail/getZhiboConfig',
            payload: {
                keywords: text,
            },
        });
    }
    render() {
        const {
            dispatch,
            broadcastDetail: {
                curPage,
                pageSize,
                total,
                isTableLoading,
                startTime,
                endTime,
                UploadVisible,
                fileList,
                isShowUploadSucaiModal,
                addGoodsModalVisible,
                goodsList,
                brandId,
                brandList,
                selectedRowIds,
                totalselectedRows,
                selectedRows,
                newUserModalVisible,
                isProvide,
                imgList,
                viewImgfacevisible,
                planStartAt,
                planEndAt,
                fakeStartAt,
                fakeEndAt,
                title,
                customerName,
                mobile,
                sortOrder,
                fakeTotal,
                isSupplier,
                isHot,
                roomId,
                liveRoomList,
                timeIsWrong,
                zhuboMap,
                userId,
                keywords,
                op,
                // keyVal,
            },
            resourcePool: {
                selectedPictureList,
            }
        } = this.props;
        const authord = `Basic ${window.btoa(`${localStorage.getItem('token')}:`)}`;
        // 拖拽组件
        const uploadButton = (
            <div>
                {/* <Icon type={this.state.loading ? 'loading' : 'plus'} /> */}
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
            <PageHeaderLayout title='直播详情'>
                <Card bordered={false}>
                    <div className={styles.title} >基础信息</div>
                    <div className={styles.content}>
                        <div>
                            <p>
                                <b>*</b>
                                <span> 直播间:</span>
                            </p>
                            <Select
                                value={liveRoomList[roomId]}
                                placeholder="直播间ID/直播间名称"
                                style={{ width: 500, marginRight: '10px' }}
                                onChange={this.handleSelectChange.bind(this)}
                                disabled={op == 2 ? true : false}
                                value={liveRoomList[roomId]}
                            >
                                <Option value={0}>请选择直播间</Option>
                                {Object.keys(liveRoomList).map(key => (
                                    <Option value={key}>{liveRoomList[key]}</Option>
                                ))}
                            </Select>
                        </div>
                        <div className={styles.actTitle}>
                            <p>
                                <b>*</b>
                                <span> 活动标题:</span>
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
                                <b>*</b>
                                <span> 活动时间:</span>
                            </p>
                            <DatePicker.RangePicker
                                showTime={{ format: 'HH:mm' }}
                                // showToday
                                onChange={this.handleChangeDate.bind(this, 'activityTime')}
                                onOk={this.handleChangeDateOk.bind(this, 'activityTime')}
                                style={{ marginRight: '10px' }}
                                value={[moment(planStartAt, "YYYY-MM-DD HH:mm:ss"), moment(planEndAt, "YYYY-MM-DD HH:mm:ss")]}
                                // defaultValue={[ moment(planStartAt, "YYYY-MM-DD HH:mm:ss"),  moment(planEndAt, "YYYY-MM-DD HH:mm:ss") ]}
                                format="YYYY-MM-DD HH:mm:ss"
                                disabled={op == 2 ? true : false}
                            />
                            <span className={timeIsWrong ? styles.WrongWarning : ''}>活动时间跨度不能超过六小时！</span>

                        </div>
                        <div>
                            <p>
                                <b>*</b>
                                <span> 主播:</span>

                            </p>
                            {
                                console.log('主播1',userId)}
                               {console.log('主播2',zhuboMap)} 
                                {console.log('主播3',JSON.stringify(zhuboMap) != "{}"?zhuboMap[userId]:'')}
                        
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
                            <Button type='primary'
                                style={{ marginLeft: '10px' }}
                                disabled={op == 2 ? true : false}
                                onClick={this.handledModalVisable.bind(this, 'newUserModalVisible')}
                            >+新建用户</Button>
                        </div>
                        <div>
                            <p>
                                <b>*</b>
                                <span> 封面:</span>
                            </p>
                            <span>
                                <Icon type="exclamation-circle" style={{ fontSize: '16px', color: 'red' }} />
                                建议尺寸：？？？，支持格式jpg、png，大小不超过500k；
                            </span>
                            <div className={styles.imgUploadBox}>
                                {
                                    imgList && imgList.length > 0 ? (<div className={styles.imgBox}>
                                        <img alt="example" style={{ width: '100%' }} src={imgList[0].url} />

                                        <p>
                                            <Icon type="eye" title="预览图片" onClick={this.handledModalVisable.bind(this, 'viewImgfacevisible')} ></Icon>
                                            <Icon type="delete" title="删除文件" onClick={this.delectImgface.bind(this)}></Icon>
                                        </p>
                                    </div>) : (
                                            <div className={styles.UploadBox}>
                                                <p onClick={this.handledModalVisable.bind(this, 'UploadVisible')}>本地上传</p>
                                                <p onClick={this.handledModalVisable.bind(this, 'isShowUploadSucaiModal')}>素材库上传</p>
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
                                showToday
                                showTime={{ format: 'HH:mm' }}
                                disabled={op == 2 ? true : false}
                                onChange={this.handleChangeDate.bind(this, 'viewTime')}
                                style={{ marginRight: '10px' }}
                                value={[moment(fakeStartAt, "YYYY-MM-DD HH:mm:ss"), moment(fakeEndAt, "YYYY-MM-DD HH:mm:ss")]}
                                format="YYYY-MM-DD HH:mm:ss"
                            />
                            <span>,累计增加人数
                                <Input
                                    value={fakeTotal}
                                    disabled={op == 2 ? true : false}
                                    onChange={this.handleInputChanged.bind(this, 'fakeTotal')}
                                    style={{ width: '100px', margin: '0 10px' }}></Input>人
                            </span>
                        </div>
                        <div>
                            <p>
                                {/* <b>*</b> */}
                                <span> 绑定商品:</span>
                            </p>
                            <Button type='primary'
                                style={{ marginLeft: '10px' }}
                                disabled={op == 2 ? true : false}
                                onClick={this.handledModalVisable.bind(this, 'addGoodsModalVisible')}
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
                                action={`${getUrl(API_ENV)}/content/img-resource/create`}
                                headers={{
                                    authorization: `Basic ${window.btoa(`${localStorage.getItem('token')}:`)}`,
                                }}
                                onRemove={this.handleRemoveImg.bind(this)}
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
                    <PostPicture
                        config={{
                            visible: isShowUploadSucaiModal,
                            confirm: this.handleConfirmSelectPic.bind(this),
                            cancel: this.handleCancelModal.bind(this, 'isShowUploadSucaiModal'),
                        }}
                    >
                    </PostPicture>
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
                            onSearch={this.handleSearchGoodsName.bind(this, 'goods-keywords')}
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
                        // title="图片预览"
                        footer={null}
                        onCancel={this.handleCancelModal.bind(this, 'viewImgfacevisible')}
                    >
                        {
                            imgList && imgList.length > 0 ? <img style={{ width: '100%', height: '100%' }} src={imgList[0].url} alt="" /> : ''
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
