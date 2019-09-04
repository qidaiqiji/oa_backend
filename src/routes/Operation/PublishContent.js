import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import moment from 'moment';
import globalStyles from '../../assets/style/global.less';
import HTML5Backend from 'react-dnd-html5-backend';
import 'braft-editor/dist/index.css'
import BraftEditor from 'braft-editor';
import styles from './PublishContent.less';
import { getUrl } from '../../utils/request';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
// import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
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
import PostPicture from '../../components/PostPicture/PostPicture';
import PostVideo from '../../components/PostVideo/PostVideo';

const TabPane = Tabs.TabPane;
const { TextArea, Search } = Input;
const Option = Select.Option;
let dragingIndex = -1;

@connect(state => ({
  publishContent: state.publishContent,
  resourcePool: state.resourcePool,
}))

export default class PublishContent extends PureComponent {
  state={
    editorState: BraftEditor.createEditorState(null), 
  }
  componentWillMount() {
    const { dispatch } = this.props;
    console.log('this.props.match.params',this.props);
    dispatch({
      type: 'publishContent/getConfig',
      payload: {
        type: this.props.match.params.type,
        articleId: this.props.match.params.id,
      }
    });
  }
  componentDidMount() {
    const { dispatch } = this.props;
    // dispatch({
    //   type: 'publishContent/getList',

    // });
    if (this.props.match.params.id == undefined) {
      return
    } else {
      dispatch({
        type: 'publishContent/getContentDetail',
        payload: {
          articleId: this.props.match.params.id,
          type: this.props.match.params.type,

        }
      });
    }
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'publishContent/unmount',
    });
  }
  handleSubmitContent() {
    const { dispatch } = this.props;
    dispatch({
      type: 'publishContent/changSubmitContent',
      payload: {
        isShowWaringModelPublish: false,
      },
    });
  }
  // 删除行
  handleDeleteColumn(id) {
    const { dispatch, publishContent } = this.props;
    const { totalselectedRows } = publishContent;
    const index = totalselectedRows.findIndex(element => element.goodsId === id);
    totalselectedRows.splice(index, 1);
    dispatch({
      type: 'publishContent/getListResolved',
      payload: {
        totalselectedRows,
      },
    });
  }
  handlePublishModal(publishType) {
    const { dispatch } = this.props;
    dispatch({
      type: 'publishContent/getListResolved',
      payload: {
        isShowWaringModelPublish: true,
        actionType: publishType,
      },
    });
  }
  handleCancel() {
    const { dispatch } = this.props;
    dispatch({
      type: 'publishContent/getListResolved',
      payload: {
        previewVisible: false
      },
    });
  }
  handlePreview(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'publishContent/getListResolved',
      payload: {
        previewImage: e.url || e.thumbUrl,
        previewVisible: true,
      },
    });
  }
  // 图片素材库点击确认
  handleConfirmSelect() {
    const { dispatch, resourcePool } = this.props;
    const { selectedPictureList } = resourcePool;
    dispatch({
      type: 'publishContent/getListChangeKeyName',
      payload: {
        isShowUploadModal: false,
        fileListReturn: selectedPictureList,
      }
    })
    dispatch({
      type: 'resourcePool/clearChosedList',
    })
  }
  handleConfirmSelectVideo() {
    const { dispatch, resourcePool, publishContent } = this.props;
    const { selectedVideo } = resourcePool;
    let copySelectedVideo = JSON.parse(JSON.stringify(selectedVideo))
    dispatch({
      type: 'publishContent/getListResolved',
      payload: {
        isShowUploadVideoModal: false,
        videofile: copySelectedVideo[0],
      }
    });
    dispatch({
      type: 'resourcePool/clearChosedVideoList',
    });
  }
  handleConfirmSelectSingle() {
    const { dispatch, resourcePool } = this.props;
    const { selectedPictureList } = resourcePool;
    dispatch({
      type: 'publishContent/getListResolved',
      payload: {
        isShowUploadSingleModal: false,
        filesingle: selectedPictureList,
      }
    })
  }
  handleCancelSelect = (type) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'publishContent/getListResolved',
      payload: {
        [type]: false,
      }
    });
    dispatch({
      type: 'resourcePool/clearChosedList',
    });
  }
  beforeUpload(file) {
    this.funcName = 'beforeUpload';
    const isIMG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'|| file.type === 'image/bmp';
    if (!isIMG) {
      message.error('你只能上传图片文件,.jpeg.png.bmp.gif!');
    }
    const isLt500K = file.size / 1024 / 1024 <= 1.5;
    if (!isLt500K) {
      message.error('图片大小不能超过1.5M');
    }
    return isIMG && isLt500K;
  }
  beforeUploadVideo(file) {
    const isVideo = file.type === 'video/mp4'|| file.type === 'video/rmvb' || file.type === 'video/webm' || file.type === 'audio/ogg' || file.type === 'video/ogg';
    if (!isVideo) {
      message.error('你只能上传视频文件!');
    }
    const isLt25M = file.size / 1024 / 1024 <= 50;
    if (!isLt25M) {
      message.error('视频大小不能超过 50MB!');
    }
    return isVideo && isLt25M;
  }
  handlePreviewVideo(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'publishContent/getListResolved',
      payload: {
        previewVideo: e.response.data.url || e.thumbUrl,
        previewVisibleVideo: true,
      },
    });
  }
  handleChangeImg(e) {
    const { dispatch, publishContent } = this.props;
    if (e.file.status === 'error') {
      notification.error({
        message: '提示',
        description: '上传失败, 请稍后重试!',
      });
    }
    if (e.file.status === 'done') {
      dispatch({
        type: 'publishContent/getListChangeKeyName',
        payload: {
          fileListReturn: e.file.response.data.imgs,
        },
      });
    }
  }

  handleChangeVideo(e) {
    const { dispatch } = this.props;
    // if (e.file.status == 'uploading') {
    //   dispatch({
    //     type: 'publishContent/getListResolved',
    //     payload: {
    //       videofile: e.fileList,
    //     },
    //   });
    // }
    if (e.file.status == 'done') {
      dispatch({
        type: 'publishContent/getListResolved',
        payload: {
          videofile: e.file.response.data,
        },
      });
    }
  }
  handleChangeImgSingle(e) {
    const { dispatch, publishContent } = this.props;
    const { videofile } = publishContent;
    if (JSON.stringify(videofile) != "{}" && e.file.status == 'done') {
      dispatch({
        type: 'publishContent/getvideoFaceChange',
        payload: {
          videoFace: [e.file.response.data.videoFace],
          version: e.file.response.data.version,
        },
      });
    } else if (e.file.status == 'done') {
      message.warning('请先上传视频资源！')
    }
  }
  handleSearchGoodsName(type, e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'publishContent/getList',
      payload: {
        [type]: e,
        brandId: '',
        curPage: 1,
      }
    });
  }
  handleSelected(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'publishContent/getList',
      payload: {
        brandId: e,
        curPage: 1,
      }
    });
  }
  viewVideoModalShow() {
    const { dispatch, publishContent } = this.props;
    const { videofile } = publishContent;
    dispatch({
      type: 'publishContent/getListResolved',
      payload: {
        previewVideo: videofile.url,
        previewVisibleVideo: true,
      }
    });
  }
  delectSingleVideo() {
    const { dispatch } = this.props;
    dispatch({
      type: 'publishContent/getListResolved',
      payload: {
        videofile: {},
      }
    });
  }
  handClickMoreGoods() {
    const { dispatch, publishContent } = this.props;
    const { isGoodsListFirst } = publishContent;
    dispatch({
      type: 'publishContent/getListResolved',
      payload: {
        isShowSearchGoodsModal: true,
      }
    });
    if (isGoodsListFirst == '') {
      dispatch({
        type: 'publishContent/getBrandList',
        isGoodsListFirst: 1,
      });
      dispatch({
        type: 'publishContent/getList',

      });
    }

  }
  handleCancelModal(type) {
    const { dispatch } = this.props;
    dispatch({
      type: 'publishContent/getListResolved',
      payload: {
        [type]: false,
      }
    });
  }
  handleSelectChange(type, e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'publishContent/getListResolved',
      payload: {
        [type]: e,
      }
    });
  }

  handleTextAreaChange(type, e) {
    const { dispatch } = this.props;

    dispatch({
      type: 'publishContent/getListResolved',
      payload: {
        [type]: e.target.value,
      }
    });
  }
  handleChangeCurPage(curPage) {
    const { dispatch, publishContent } = this.props;
    dispatch({
      type: 'publishContent/getList',
      payload: {
        curPage,
      }
    });

  }
  // 选择勾选商品
  handleSelectRows(selectedRowIds, selectedRows) {
    const { dispatch } = this.props;
    dispatch({
      type: 'publishContent/getListResolved',
      payload: {
        selectedRowIds,
        selectedRows,
      },
    });
  }
  handleChoselModal() {
    const { dispatch } = this.props;
    const { selectedRowIds, selectedRows } = this.props.publishContent;
    dispatch({
      type: 'publishContent/changeProvideRows',
      payload: {
        isShowSearchGoodsModal: false,
        selectedRowIds,
        selectedRows,
      },
    });
  }
  delectImg(index) {
    const { dispatch } = this.props;
    dispatch({
      type: 'publishContent/changefileList',
      payload: {
        duid: index,
      },
    });
  }
  delectSingleImg() {
    const { dispatch, publishContent } = this.props;
    dispatch({
      type: 'publishContent/getvideoFaceChange',
      payload: {
        videoFace: '',
      },
    });
  }
  viewSingleImg() {
    const { dispatch, publishContent } = this.props;
    const { videofile } = publishContent;
    dispatch({
      type: 'publishContent/getListResolved',
      payload: {
        previewImage: videofile.videoFace,
        previewVisiblesing: true,
      },
    });
  }
  viewImg(index) {
    const { dispatch } = this.props;
    dispatch({
      type: 'publishContent/viewBigImg',
      payload: {
        vindex: index,
        previewVisible: true,
      },
    });
  }
  uploadFromDepot(rsourceType) {
    const { dispatch, resourcePool } = this.props;
    const { isfirst, isFirstImg } = resourcePool;
    dispatch({
      type: 'publishContent/getListResolved',
      payload: {
        [rsourceType]: true,
      },
    });
    if (isfirst == '' && rsourceType == 'isShowUploadVideoModal') {
      dispatch({
        type: 'resourcePool/getVideoList',
        isfirst: 1,
      });
    }
    if (isFirstImg == '' && rsourceType == 'isShowUploadModal') {
      dispatch({
        type: 'resourcePool/getImgList',
        isfirst: 1,
      });
    }

  }
  // 投放频道列表选中
  onChangeFoundStatus(type, statuSname, e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'publishContent/changeFoundStatus',
      payload: {
        foundId: type,
        whichClick: statuSname,
        isChecked: e.target.checked,
      },
    });
  }
  // 特别频道
  onChangeSpecialStatus(type, e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'publishContent/ChangeSpecialStatus',
      payload: {
        foundId: type,
        isChecked: e.target.checked,
      },
    });
  }
  // 定时发布是否选中
  onChangeAutoPublish(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'publishContent/getListResolved',
      payload: {
        autoPublish: e.target.checked,
      },
    });
  }
  // chaneels区分点击的是那个块的时间选择
  handleDateChange(foundId, chaneels, data, dataStrings) {
    const { dispatch } = this.props;
    dispatch({
      type: 'publishContent/ChangeFoundEndTime',
      payload: {
        endtime: dataStrings,
        foundId,
        chaneels,
      },
    });
  }
  deletalvideo() {
    const { dispatch } = this.props;
    dispatch({
      type: 'publishContent/getListResolved',
      payload: {
        videofile: {},
      },
    });
  }
  getItemStyle = (isDragging, draggableStyle) => (
    {
      userSelect: 'none',
      padding: 0,
      margin: `15px 8px 0 0`,
      background: isDragging ? 'lightgreen' : '#FAFAFA',
      ...draggableStyle,
    });
  getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : '#fff',
    display: 'flex',
    padding: 0,
  });
  onDragEnd(result) {
    const { fileListTotal } = this.props.publishContent;
    const { dispatch } = this.props;
    if (!result.destination) {
      return;
    }
    const filst = this.reorder(fileListTotal, result.source.index, result.destination.index);
    // filst传给fileList
    dispatch({
      type: 'publishContent/getListResolved',
      payload: {
        fileListTotal: filst,
      },
    });
  }
  reorder(list, startIndex, endIndex) {
    const result = list;
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  }
  handleEditorChange=(content)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'publishContent/getListResolved',
      payload: {
        content:content.toHTML(),
        editorState: content,
      },
    });
  }
  render() {
    const {
      dispatch,
      publishContent: {
        autoPublish,
        previewVisible,
        previewImage,
        fileListTotal,
        startDate,
        curPage,
        endDate,
        goodsList,
        isLoading,
        isShowSearchGoodsModal,
        pageSize,
        total,
        selectedRowIds,
        totalselectedRows,
        videofile,
        filesingle,
        guideData,
        articleId,
        type,
        viewImg,
        authorId,
        previewVisiblesing,
        previewVideo,
        previewVisibleVideo,
        authorList,
        title,
        foundListAll,
        foundSpListAll,
        isShowUploadModal,
        isShowUploadVideoModal,
        isShowUploadSingleModal,
        isShowWaringModelPublish,
        videoId,
        publishTime,
        guideText,
        guideLink,
        brandList,
        version,
        brandId,
        actionType,
      },
    } = this.props;
    // console.log("content",content)
    const {
      resourcePool: {
        selectedPictureList,
        selectedVideo,
      },
    } = this.props;
    const authord = `Basic ${window.btoa(`${localStorage.getItem('token')}:`)}`;
    // 拖拽组件
    const uploadButton = (
      <div>
        <div className="ant-upload-text">从本地上传</div>
      </div>
    );
    const operation = {
      dataIndex: 'operation',
      key: 'operation',
      width: 80,
      align: 'center',
      render: (_, record) => (
        record.isExtraRow || !isNaN(record.id) ? null :
          <Icon type="minus"
            style={{ cursor: 'pointer', fontSize: '17px', fontWeight: 'bold', border: '1px solid #ccc', borderRadius: '4px', color: '#ccc' }}
            onClick={this.handleDeleteColumn.bind(this, record.goodsId)}
          />
      ),
    };
    const goodsImg = {
      title: '商品主图',
      dataIndex: 'img',
      width: 200,
      key: 'img',
      render: (src, record) => {
        return record.isExtraRow ? null : (<img src={src} style={{ width: 55, height: 55 }} />)

      }
    };
    const goodsSn = {
      title: '商品条码',
      dataIndex: 'goodsNo',
      key: 'goodsNo',

    };
    const goodsName = {
      title: '商品名称',
      dataIndex: 'goodsName',
      key: 'goodsName',
      render: (value, record) => {
        if (record.isExtraRow && isNaN(record.id)) {
          return <div>
            <Search
              style={{ width: 230 }}
              enterButton="更多"
              placeholder="选择关联商品"
              onSearch={this.handClickMoreGoods.bind(this)}
            />
          </div>
        } else {
          return {
            children: <span>{value}</span>,
          };
        }
      },
    };
    const stockAmount = {
      title: '可用库存',
      dataIndex: 'canUseNum',
      key: 'canUseNum',

    };
    const platPrice = {
      title: '平台价',
      dataIndex: 'shopPrice',
      key: 'shopPrice'
    };
    const activityPrice = {
      title: '活动价',
      dataIndex: 'actPrice',
      key: 'actPrice'
    };
    const retailPrice = {
      title: '零售价',
      dataIndex: 'marketPrice',
      key: 'marketPrice'
    };
    const columns = [
      operation,
      goodsImg,
      goodsSn,
      goodsName,
      stockAmount,
      platPrice,
      activityPrice,
      retailPrice
    ];
    const columnsModal = [
      goodsImg,
      goodsSn,
      goodsName,
      stockAmount,
      platPrice,
      activityPrice,
      retailPrice
    ];
    return (
      <PageHeaderLayout title={type == 1 ? '发图文' : '发视频'}>
        <Card bordered={false}>
          <Tabs defaultActiveKey="1"
            tabBarExtraContent={
              <div className={styles.buttonbox}>
                <div>
                  <Button type="primary" onClick={this.handlePublishModal.bind(this, 2)}>发布</Button>
                  <Button onClick={this.handlePublishModal.bind(this, 1)}>保存草稿</Button>
                </div>
              </div>
            }
          >
            <TabPane tab="属性编辑" key="1">
              <div>
                <span style={{ color: 'red' }}>*</span>
                <span>关联发布方：</span>
                <Select 
                  placeholder="请选择发布方"
                  value={authorList[authorId]}
                  style={{ width: 300 }}
                  onSelect={this.handleSelectChange.bind(this, 'authorId')}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) => {
                    return option.props.children.indexOf(input) >= 0;
                  }}
                >
                  {Object.keys(authorList).map(key => (
                    <Option value={key}>{authorList[key]}</Option>
                  ))}
                </Select>
              </div>
              <div style={{ marginTop: '10px' }}>
                <div style={{ display: 'inline-block', verticalAlign: 'top', }}>
                  <span style={{ color: 'red' }}>*</span>
                  <span>动态标题：</span>
                </div>
                <TextArea
                  style={{ width: '800px', display: 'inline-block' }}
                  value={title}
                  placeholder={title == '' ? '请输入动态标题' : title} autosize={{ minRows: 2, maxRows: 6 }}
                  onChange={this.handleTextAreaChange.bind(this, 'title')}
                />

              </div>
              {type == 1 ? (
                <div style={{ marginTop: '10px' }}>
                  <span style={{ color: 'red' }}>*</span>
                  <span>上传图片</span>
                  <span>（图片尺寸建议不小于750px*750px;要求格式：jpg .jpeg.png.bmp； 数量要求：上限9张）</span>
                  <div className="clearfix">

                    <div className={styles.show}>
                      {
                        <DragDropContext onDragEnd={this.onDragEnd.bind(this)}>
                          <Droppable droppableId="droppable" direction="horizontal">
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                style={this.getListStyle(snapshot.isDraggingOver)}
                                {...provided.droppableProps}
                              >
                                {
                                  fileListTotal.map((item, index) => {
                                    return (
                                      <Draggable key={item.imgId} draggableId={item.imgId} index={index}>
                                        {
                                          (provided, snapshot) => (
                                            <div
                                              ref={provided.innerRef}
                                              {...provided.draggableProps}
                                              {...provided.dragHandleProps}
                                              style={this.getItemStyle(
                                                snapshot.isDragging,
                                                provided.draggableProps.style
                                              )}
                                            >
                                              <img src={item.url} alt="" />
                                              {/* <span onClick={this.delectImg.bind(this, index)} >删除</span> */}
                                              <p>
                                                <i title="预览图片" onClick={this.viewImg.bind(this, index)} ></i>
                                                <i title="删除文件" onClick={this.delectImg.bind(this, item.imgId)}></i>
                                              </p>
                                            </div>
                                          )}
                                      </Draggable>
                                    )
                                  })
                                }
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </DragDropContext>
                      }

                    </div>
                    {fileListTotal.length < 9 ? (<div className={styles.choseBox}>
                      <Upload
                        className={styles.noshow}
                        action={`${getUrl(API_ENV)}/content/img-resource/create`}
                        listType="picture-card"
                        multiple={true}
                        beforeUpload={this.beforeUpload.bind(this)}
                        onPreview={this.handlePreview.bind(this)}
                        onChange={this.handleChangeImg.bind(this)}
                        headers={{
                          authorization: `Basic ${window.btoa(`${localStorage.getItem('token')}:`)}`,
                        }}
                      >
                        {uploadButton}
                      </Upload>
                      <div onClick={this.uploadFromDepot.bind(this, 'isShowUploadModal')}><p>从素材库上传</p> </div>
                    </div>) : ''}
                  </div>
                  <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel.bind(this)}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                  </Modal>
                </div>) : ''
              }
              {type == 2 ? (
                <div>
                  <div style={{ marginTop: '35px', height: '223px', overflow: 'hidden' }}>
                    <div className={styles.modelstyle}>
                      <div style={{ display: 'inline-block', verticalAlign: 'top', }}>
                        <span style={{ color: 'red' }}>*</span>
                        <span>添加视频：</span>
                      </div>
                      {
                        JSON.stringify(videofile) != "{}" ? (
                          <div className={styles.videobox} >

                            <video src={videofile.url} ></video>
                            <p>
                              <i title="预览视频" onClick={this.viewVideoModalShow.bind(this)} ></i>
                              <i title="删除文件" onClick={this.delectSingleVideo.bind(this)}></i>
                            </p>

                          </div>
                        ) : ''
                      }
                      {JSON.stringify(videofile) == "{}" ? (
                        <div className={styles.videoActionBox}>
                          <Upload
                            className={styles.noshowvideo}
                            action={`${getUrl(API_ENV)}/content/video-resource/create`}
                            listType="picture-card"
                            beforeUpload={this.beforeUploadVideo.bind(this)}
                            multiple={true}
                            onChange={this.handleChangeVideo.bind(this)}
                            headers={{
                              authorization: `Basic ${window.btoa(`${localStorage.getItem('token')}:`)}`,
                            }}

                          >
                            {uploadButton}
                          </Upload>
                          {
                            <div onClick={this.uploadFromDepot.bind(this, 'isShowUploadVideoModal')}>
                              <p>从素材库上传</p>
                            </div>
                          }
                        </div>
                      ) : ''}
                      <div className={styles.tishi}>
                        <span>完整版视频（5s-300s）</span>
                        <span>视频大小限制在50M以内</span>
                      </div>

                    </div>
                  </div>
                  <div style={{ marginTop: '10px' }} className={styles.noshowvideobox}>
                    <div style={{ display: 'inline-block', verticalAlign: 'top', }}>
                      <div style={{ display: 'inline-block', verticalAlign: 'top', }}>
                        <span style={{ color: 'red' }}>*</span>
                        <span>视频封面：</span>
                      </div>
                      <div style={{ display: 'inline-block', verticalAlign: 'top', }}>
                        {
                          JSON.stringify(videofile) != "{}" && videofile.videoFace != '' ? (
                            <div className={styles.singleimgBox}>
                              <img src={`${videofile.videoFace}?version=${version}`} alt="视频封面图片" />
                              <p>
                                <i title="预览图片" onClick={this.viewSingleImg.bind(this)} ></i>
                                <i title="删除文件" onClick={this.delectSingleImg.bind(this)}></i>
                              </p>
                            </div>
                          ) : ''
                        }


                        <div className={styles.sucaiTextbox}>
                          <Upload
                            className={styles.noshowvideoimg}
                            action={`${getUrl(API_ENV)}/content/video-resource/create-face`}
                            data={{
                              videoId: videofile != '' ? videofile.videoId : ''
                            }}
                            listType="picture-card"
                            beforeUpload={this.beforeUpload.bind(this)}
                            multiple={true}
                            onPreview={this.handlePreview.bind(this)}
                            onChange={this.handleChangeImgSingle.bind(this)}
                            headers={{
                              authorization: `Basic ${window.btoa(`${localStorage.getItem('token')}:`)}`,
                            }}
                          >
                            {uploadButton}
                          </Upload>
                        </div>

                      </div>
                      <div className={styles.tishi}>
                        <span>图片宽高比例：16:9 </span>
                        <span>图片最低尺寸要求：654*368px</span>
                        <span>单张图片大小不超过5M</span>
                        <span>图片格式：jpg.jpeg.png</span>
                      </div>
                    </div>

                  </div>
                </div>) : ''
              }
              <div style={{ margin: '20px 0', verticalAlign: 'top', }}>
                <span style={{ color: 'red' }}>*</span>
                <span style={{ marginTop: '5px', }}>投放频道:</span>
                <div style={{ display: 'inline-block', verticalAlign: 'top', marginLeft: '20px' }}>
                  {
                    foundListAll.map(item => {
                      return (
                        <div style={{ verticalAlign: 'middle', height: '42px' }}>
                          <Checkbox style={{ marginTop: '5px', }}
                            onChange={this.onChangeFoundStatus.bind(this, item.foundId, 'isChecked')}
                            checked={item.isChecked == 1 ? true : false}
                          >{item.foundName}
                          </Checkbox>
                          {
                            item.isChecked == 1 ? (
                              <div style={{ display: 'inline-block' }}>
                                <Checkbox style={{ marginTop: '5px', }}
                                  checked={item.isTop == 1 ? true : false}
                                  onChange={this.onChangeFoundStatus.bind(this, item.foundId, 'isTop')}
                                >置顶
                            </Checkbox>
                                <span style={{ marginTop: '5px', lineHeight: '32px' }}>截止时间：</span>
                                <DatePicker
                                  value={item.topEndTime ? moment(item.topEndTime, 'YYYY-MM-DD') : null}
                                  format="YYYY-MM-DD HH:mm:ss"
                                  className={globalStyles['rangePicker-sift']}
                                  onChange={this.handleDateChange.bind(this, item.foundId, 'chaneelsnormal')}
                                />
                              </div>
                            ) : ''
                          }
                        </div>
                      )
                    })
                  }
                </div>
              </div>
              <div style={{ margin: '20px 0', lineHeight: '42px' }}>
                {
                  foundSpListAll.map(item => {
                    return (
                      <div>
                        <Checkbox style={{ marginTop: '5px', }}
                          checked={item.isChecked == 1 ? true : false}
                          onChange={this.onChangeSpecialStatus.bind(this, item.foundId)}
                        >{item.foundName}
                        </Checkbox>
                        {item.isChecked == 1 ? (<div style={{ display: 'inline-block' }}>
                          <span style={{ marginTop: '5px', marginLeft: '20px', lineHeight: '32px' }}>截止时间：</span>
                          <DatePicker
                            value={item.endTime ? moment(item.endTime, 'YYYY-MM-DD HH:mm:ss') : null}
                            format="YYYY-MM-DD HH:mm:ss"
                            className={globalStyles['rangePicker-sift']}
                            onChange={this.handleDateChange.bind(this, item.foundId, 'chaneelspecial')}
                          />
                        </div>) : ''}
                      </div>
                    )
                  })
                }
              </div>
              <div style={{ margin: '20px 0', height: '42px' }}>
                <Checkbox style={{ marginTop: '5px', }}
                  checked={autoPublish}
                  onChange={this.onChangeAutoPublish.bind(this)}
                >定时发布：
                </Checkbox>
                {autoPublish ? (
                  <DatePicker
                    value={publishTime != '' ? moment(publishTime, 'YYYY-MM-DD HH:mm:ss') : null}
                    format="YYYY-MM-DD HH:mm:ss"
                    className={globalStyles['rangePicker-sift']}
                    onChange={this.handleDateChange.bind(this, '', 'chaneelPublish')}
                  />
                ) : ''}
              </div>
              <div>
                <b >关联商品</b>
                <span>（<span style={{ color: 'red' }}>*</span> 最多可添加16个商品）</span>
              </div>
              <div style={{ margin: '20px 0' }}>
                <div style={{ display: 'inline-block', }}>
                  <span style={{ marginTop: '5px', }}>导购标语：</span>
                  <TextArea
                    onChange={this.handleTextAreaChange.bind(this, 'guideText')}
                    value={guideText}
                    maxLength={16}
                    style={{ width: '600px', display: 'inline-block' }} placeholder="请输入16个汉字以内的活动宣传导语" autosize={{ minRows: 1, maxRows: 1 }} />
                </div>
                <div style={{ display: 'inline-block', marginLeft: '20px' }}>
                  <span style={{ marginTop: '5px', }}>添加链接：</span>
                  <TextArea
                    onChange={this.handleTextAreaChange.bind(this, 'guideLink')}
                    value={guideLink}
                    style={{ width: '600px', display: 'inline-block' }} placeholder="请输入链接地址" autosize={{ minRows: 1, maxRows: 1 }} />
                </div>
              </div>
              <Table
                style={{ marginTop: '20px' }}
                columns={columns}
                rowKey={totalselectedRows => totalselectedRows.goodsId && totalselectedRows.goodsId}
                dataSource={totalselectedRows.concat({ id: '更多', isExtraRow: true })}
                pagination={false}
                bordered
                loading={false}
              />
              <Modal
                width={1600}
                visible={isShowSearchGoodsModal}
                footer={null}
                onCancel={this.handleCancelModal.bind(this, 'isShowSearchGoodsModal')}
              >
                <div style={{ borderBottom: '1px solid #ddd', paddingBottom: '3px', height: '40px', marginBottom: '10px' }}>
                  <b style={{ fontSize: '16px', lineHeight: '40px' }}>选择商品</b>
                  <div style={{ position: 'absolute', width: '150px', right: '50px', top: '24px' }}>
                    <Button style={{ marginRight: '20px' }} onClick={this.handleCancelModal.bind(this, 'isShowSearchGoodsModal')}>取消</Button>
                    <Button onClick={this.handleChoselModal.bind(this)} type="primary">确定</Button>
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
                  style={{width:200}}
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
                  loading={isLoading}
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
                className={styles.imgmodal}
                footer={null}
                visible={previewVisiblesing}
                onCancel={this.handleCancelModal.bind(this, 'previewVisiblesing')}
              >
                <img style={{ width: '100%', height: '100%' }} src={`${previewImage}?version=${version}`} alt="" />
              </Modal>
              <Modal
                className={styles.imgmodal}
                width={800}
                footer={null}
                visible={previewVisibleVideo}
                onCancel={this.handleCancelModal.bind(this, 'previewVisibleVideo')}
              >
                <video style={{ width: '100%' }} src={previewVideo} controls></video>
              </Modal>
              <Modal
                visible={isShowWaringModelPublish}
                onOk={this.handleSubmitContent.bind(this)}
                onCancel={this.handleCancelModal.bind(this, 'isShowWaringModelPublish')}
              >
                {
                  actionType == 2 ? (<p style={{ textAlign: 'center', width: '100%', }}>你确定要立即发布吗？</p>) : (<p style={{ textAlign: 'center', width: '100%', }}>你确定要保存草稿吗？</p>)
                }
              </Modal>
              <PostPicture
                config={{
                  visible: isShowUploadModal,
                  confirm: this.handleConfirmSelect.bind(this),
                  cancel: this.handleCancelSelect.bind(this, 'isShowUploadModal'),
                }}
              >
              </PostPicture>
              <PostPicture
                config={{
                  visible: isShowUploadSingleModal,
                  confirm: this.handleConfirmSelectSingle.bind(this),
                  cancel: this.handleCancelSelect.bind(this, 'isShowUploadSingleModal'),
                }}
              >
              </PostPicture>
              {
                <PostVideo
                  config={{
                    visible: isShowUploadVideoModal,
                    confirm: this.handleConfirmSelectVideo.bind(this),
                    cancel: this.handleCancelSelect.bind(this, 'isShowUploadVideoModal'),
                  }}
                />
              }
            </TabPane>
            <TabPane tab="内容编辑" key="2">
            </TabPane>
          </Tabs>

        </Card>
      </PageHeaderLayout>
    );
  }
}
