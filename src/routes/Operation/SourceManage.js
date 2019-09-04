import React, { PureComponent, Component } from 'react';
import { connect } from 'dva';
import { Card, Row, Modal, Input, Button, Upload, Icon, Tabs, Menu, Dropdown, Select, message, DatePicker, Tooltip, Col, Checkbox, Pagination, notification } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import globalStyles from '../../assets/style/global.less';
import styles from './SourceManage.less';
import defaultCover from '../../../public/default.png';
const { RangePicker } = DatePicker;
import { getUrl } from '../../utils/request';
import CopyToClipboard from 'react-copy-to-clipboard';
import moment from 'moment';
import TextArea from 'antd/lib/input/TextArea';
const TabPane = Tabs.TabPane;
@connect(state => ({
  sourceManage: state.sourceManage,
}))

export default class SourceManage extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'sourceManage/getGalleryList',
    });
    dispatch({
      type: 'sourceManage/getConfig',
    });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'sourceManage/unmountReducer',
    });
  }
  handleChangeTabKey = (e) => {
    const { dispatch, sourceManage } = this.props;
    const { getVideo } = sourceManage;
    if (getVideo && e == 2) {
      dispatch({
        type: 'sourceManage/getVideoList',
        payload: {
          tabKey: e,
          getVideo: false,
        }
      });
    }
  }
  beforeUpload(type, file) {
    const { dispatch, sourceManage } = this.props;
    const { galleryId } = sourceManage;
    if(type == "img"&&!galleryId) {
      message.error("请先选择相册！");
      return false;
    }
    const isIMG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/bmp'|| file.type === 'image/gif';
    const isLess1M = file.size / 1024 / 1024 <= 1.5;
    if (type == "img") {
      if (!isIMG) {
        message.error("要求格式：.jpeg.png.bmp.gif");
        return false;
      }
    }
    const isVideo = file.type === 'video/mp4' || file.type === 'video/rmvb' || file.type === 'video/ogg';
    const isLess50M = file.size / 1024 / 1024 < 25;
    if (type == "video") {
      if (!isVideo) {
        message.error("请上传视频格式");
        return false;
      }
      if (!isLess50M) {
        message.error("视频大小不能大于25M");
        return false;
      }
    }
    if (type == "imgCover") {
      if (!isLess1M) {
        message.error('图片大小不能大于1.5M');
        return false;
      }
    }

  }
  /**------------------相册部分---------------------- */
  handleCreteGallery = (modalClose) => {
    const { dispatch } = this.props;
    if (modalClose != null) {
      dispatch({
        type: 'sourceManage/updatePageReducer',
        payload: {
          isShowNewGalleryModal: true,
          modalClose: false,
        }
      });
    } else {
      dispatch({
        type: 'sourceManage/updatePageReducer',
        payload: {
          isShowNewGalleryModal: true,
        }
      });
    }

  }
  handleChangeGalleryName = (e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sourceManage/updatePageReducer',
      payload: {
        newGalleryTitle: e.target.value,
      }
    });
  }
  handleConfirmCreate = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sourceManage/confirmCreateGallery',
      payload: {
        isShowNewGalleryModal: false,
      }
    });
  }
  handleChangeUpload = (info) => {
    const { dispatch, sourceManage } = this.props;
    const { successImgIds } = sourceManage;
    if (info.file.status === 'error') {
      message.error("上传失败，请稍后重试!");
    }
    if (info.file.status === 'done') {
      successImgIds.push(info.file.response.data.imgs[0].imgId);
      dispatch({
        type: 'sourceManage/updatePageReducer',
        payload: {
          successImgIds,
        },
      });
    }
    dispatch({
      type: 'sourceManage/updatePageReducer',
      payload: {
        fileList: info.fileList,
      }
    });
  }
  handleClickMenu = (galleryId, galleryNum, e) => {
    const { dispatch } = this.props;
    if (+e.key === 1) {
      dispatch({
        type: 'sourceManage/updatePageReducer',
        payload: {
          isShowNewGalleryModal: true,
          seletedKey: e.key,
          galleryId,
        }
      });
    } else if (+e.key === 2) {
      dispatch({
        type: 'sourceManage/updatePageReducer',
        payload: {
          isShowConfirmDeleteModal: true,
          galleryNum,
          galleryId,
        }
      });
    }
  }
  handleConfirmDelete = () => {
    const { dispatch, sourceManage } = this.props;
    const { galleryNum } = sourceManage;
    if (+galleryNum > 0) {
      message.error("只有空相册才可以删除!");
      dispatch({
        type: 'sourceManage/confirmDeleteGallery',
        payload: {
          isShowConfirmDeleteModal: false,
        }
      });
      return;
    }
    dispatch({
      type: 'sourceManage/confirmDeleteGallery',
      payload: {
        isShowConfirmDeleteModal: false,
      }
    });
  }
  handleSearchByGalleryTitle = (e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sourceManage/getGalleryList',
      payload: {
        galleryTitle: e,
      }
    });
  }
  /**----------------图片部分------------------ */
  handleShowImgList = (galleryToImgId) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sourceManage/getImgList',
      payload: {
        galleryToImgId,
      }
    });
  }
  // 删除单张图片
  handleDeleteImg = (imgId) => {
    const { dispatch, sourceManage } = this.props;
    const { imgIds } = sourceManage;
    imgIds.push(imgId);
    dispatch({
      type: 'sourceManage/updatePageReducer',
      payload: {
        imgIds,
        deleteImgModal: true,
      }
    });
  }
  handleConfirmDeleteImgs = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sourceManage/deleteImgs',
      payload: {
        deleteImgModal: false,
      }
    });
  }
  // 选中图片
  handleSelectImgs = (imgId, e) => {
    const isChecked = e.target.checked;
    const { dispatch, sourceManage } = this.props;
    const { imgList } = sourceManage;
    imgList.map(item => {
      if (+item.imgId === +imgId) {
        if (isChecked) {
          item.isChecked = true;
        } else {
          item.isChecked = false;
        }
      }
    })
    const checkedList = imgList.filter(item => {
      return item.isChecked === true;
    })
    let isAllChecked;
    if (checkedList.length < imgList.length) {
      isAllChecked = false;
    } else {
      isAllChecked = true;
    }
    dispatch({
      type: 'sourceManage/updatePageReducer',
      payload: {
        imgList,
        isAllChecked,
        checkedList,
      }
    });
  }
  // 全选
  onCheckAllChange = (e) => {
    const isChecked = e.target.checked;
    const { dispatch, sourceManage } = this.props;
    const { imgList } = sourceManage;
    imgList.map(item => {
      if (isChecked) {
        item.isChecked = true;
      } else {
        item.isChecked = false;
      }
    })
    const checkedList = imgList.filter(item => {
      return item.isChecked === true;
    })
    dispatch({
      type: 'sourceManage/updatePageReducer',
      payload: {
        imgList,
        isAllChecked: isChecked,
        checkedList,
      }
    });
  }
  // 移动图片
  handleMoveImgs = (imgId) => {
    const { dispatch, sourceManage } = this.props;
    const { imgIds } = sourceManage;
    imgIds.push(imgId);
    dispatch({
      type: 'sourceManage/updatePageReducer',
      payload: {
        showMoveModal: true,
        imgIds,
      }
    });
  }
  handleMoveMutiImgs = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sourceManage/updatePageReducer',
      payload: {
        showMoveModal: true,
        multipleImgs: true,
      }
    });
  }
  handleConfirmMoveImgs = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sourceManage/confirmMoveImgs',
      payload: {
        showMoveModal: false,
      }
    });
  }
  handleCancelDeleteImgs = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sourceManage/updatePageReducer',
      payload: {
        deleteImgModal: false,
        imgIds: [],
      }
    });
  }
  // 选择相册
  handleSelectGallery = (e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sourceManage/updatePageReducer',
      payload: {
        galleryId: e,
      }
    });
  }
  handleShowDeleteImgModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sourceManage/updatePageReducer',
      payload: {
        deleteImgModal: true,
        multipleImgs: true,
      }
    });
  }
  // 展示图片大图
  handleShowSlidePicture = (currentIndex) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sourceManage/updatePageReducer',
      payload: {
        currentIndex,
        showSlideModal: true,
      }
    });
  }
  // 图片上一张下一张
  handleShowPrePic = () => {
    const { dispatch, sourceManage } = this.props;
    const { currentIndex } = sourceManage;
    let pre = currentIndex;
    pre--;
    if (pre < 0) {
      message.warning("已经是第一张图片了");
      pre = 0;
      return;
    }
    dispatch({
      type: 'sourceManage/updatePageReducer',
      payload: {
        currentIndex: pre,
      }
    });
  }
  handleShowNextPic = () => {
    const { dispatch, sourceManage } = this.props;
    const { currentIndex, imgList } = sourceManage;
    let next = currentIndex;
    next++;
    if (next >= imgList.length) {
      message.warning("已经是最后一张图片了");
      next = imgList.length - 1;
      return;
    }
    dispatch({
      type: 'sourceManage/updatePageReducer',
      payload: {
        currentIndex: next,
      }
    });
  }
  handleCloseUploadModals = () => {
    const { dispatch, sourceManage } = this.props;
    const { successImgIds, totalDeleteImgId } = sourceManage;
    let imgIds = successImgIds.concat(totalDeleteImgId).filter((v, i, arr) => {
      return arr.indexOf(v) === arr.lastIndexOf(v);
    })
    if (imgIds.length <= 0) {
      dispatch({
        type: 'sourceManage/updatePageReducer',
        payload: {
          isShowLoadModal: false,
          successImgIds: [],
          totalDeleteImgId: [],
        }
      });
    } else {
      dispatch({
        type: 'sourceManage/deleteImgs',
        payload: {
          isShowLoadModal: false,
          fileList: [],
          imgIds,
          totalDeleteImgId: [],
          successImgIds: [],
        }
      });
    }
    dispatch({
      type: 'sourceManage/getGalleryList',
      payload: {
        isShowLoadModal: false,
        fileList: [],
      }
    });
  }

  // 返回相册列表
  handleBackToGalleryList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sourceManage/getGalleryList',
      payload: {
        galleryToImgId: '',
      }
    });
  }
  handleReplaceImgs = (imgId, title) => {
    let imgType = `image/${title.substring(title.lastIndexOf(".") + 1)}`;
    if (imgType == "image/jpg") {
      imgType = "image/jpeg";
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'sourceManage/updatePageReducer',
      payload: {
        isShowReplaceModal: true,
        imgId,
        imgTitle: title,
        imgType,
      }
    });
  }
  handleBeforeUpload = (file) => {
    const { dispatch, sourceManage } = this.props;
    const { imgType } = sourceManage;
    const isSameType = file.type === imgType;
    if (!isSameType) {
      message.error("只能替换相同类型的图片！")
      return false;
    }
  }
  handleConfirmReplaceImg = (info) => {
    const { dispatch, sourceManage } = this.props;
    const { imgList } = sourceManage;
    if (info.file.status === 'error') {
      message.error("上传失败，请稍后重试!");
    }
    if (info.file.status === 'done') {
      notification.success({
        message: "替换图片成功"
      })
      const replaceImgInfo = info.file.response.data;
      imgList.map(item => {
        if (+item.imgId === +replaceImgInfo.imgId) {
          item.url = `${item.url}?version=${replaceImgInfo.version}`
        }
      })
      dispatch({
        type: 'sourceManage/updatePageReducer',
        payload: {
          imgList,
        },
      });
    }
    dispatch({
      type: 'sourceManage/updatePageReducer',
      payload: {
        fileList: info.fileList,
      },
    });
  }
  handleCancelReplace = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sourceManage/updatePageReducer',
      payload: {
        isShowReplaceModal: false,
        fileList: [],
      },
    });
  }

  handleTriggerEditTitle = (imgId) => {
    const { dispatch, sourceManage } = this.props;
    const { imgList } = sourceManage;
    let editImgTitle = '';
    imgList.map(item => {
      if (+item.imgId === +imgId) {
        item.isEditTitle = true;
        editImgTitle = item.title;
      }
    })
    dispatch({
      type: 'sourceManage/updatePageReducer',
      payload: {
        imgList,
        editImgTitle,
        selectedImg: imgId,
      },
    });
  }
  handleSaveChangeTitle = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sourceManage/changeImgTitle',
    });
  }
  handleChangeImgTitle = (e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sourceManage/updatePageReducer',
      payload: {
        editImgTitle: e.target.value,
      },
    });
  }
  // 预览图片
  handlePreview = (file) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sourceManage/updatePageReducer',
      payload: {
        previewImage: file.url || file.thumbUrl,
        previewVisible: true,
      }
    });
  }
  handleRemoveImgs = (file) => {
    const { dispatch, sourceManage } = this.props;
    const { totalDeleteImgId } = sourceManage;
    let deleteImgIds = [];
    deleteImgIds.push(file.response.data.imgs[0].imgId);
    totalDeleteImgId.push(...deleteImgIds);
    dispatch({
      type: 'sourceManage/deleteImgs',
      payload: {
        imgIds: deleteImgIds,
        totalDeleteImgId,
      }
    });
  }
  handleConfirm = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sourceManage/getImgList',
      payload: {
        isShowLoadModal: false,
        fileList: [],
        imgIds: [],
        successImgIds: [],
        totalDeleteImgId: [],
        galleryId:'',
      }
    });
    dispatch({
      type: 'sourceManage/getGalleryList',
    });
  }
  /**----------------视频部分------------------ */
  handleSearchVideo = (e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sourceManage/getVideoList',
      payload: {
        videoTitle: e,
      }
    });
  }
  // 删除视频
  handleDeleteVideo = (videoId) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sourceManage/updatePageReducer',
      payload: {
        isDeleteVideo: true,
        videoId,
      }
    });
  }
  // 编辑视频
  handleEditVideo = (videoInfo) => {
    const { dispatch } = this.props;
    const coverList = videoInfo.imgs;
    let listMap = [];
    listMap = coverList.map((item, index) => {
      return { url: item, isSelected: false, imgId: index }
    })
    dispatch({
      type: 'sourceManage/updatePageReducer',
      payload: {
        isEditVideo: true,
        videoInfo,
        videoId: videoInfo.videoId,
        isUploadVideo: true,
        beforeOperate: coverList,
        coverList: listMap,
        videoTitle: videoInfo.title
      }
    });
  }
  handleConfirmDeleteVideo = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sourceManage/confirmDeleteVideo',
      payload: {
        isDeleteVideo: false,
      }
    });
  }
  handleChangeUploadVideo = (info) => {
    const { dispatch } = this.props
    if (info.file.status === 'error') {
      message.error("上传失败，请稍后重试!");
    }
    if (info.file.status === 'done') {
      let coverList = info.file.response.data.imgs;
      let listMap = [];
      listMap = coverList.map((item, index) => {
        return { url: item, isSelected: false, imgId: index }
      })
      dispatch({
        type: 'sourceManage/updatePageReducer',
        payload: {
          videoInfo: info.file.response.data,
          coverList: listMap,
          beforeOperate: coverList,
          uploaded: true,
          videoId: info.file.response.data.videoId,
        },
      });
    }
  }
  // 上传封面图片
  handleUploadImgCover = (info) => {
    const { dispatch, sourceManage } = this.props;
    const { beforeOperate } = sourceManage;
    if (info.file.status === 'error') {
      message.error("上传失败，请稍后重试!");
    }
    if (info.file.status === 'done') {
      let url = `${info.file.response.data.videoFace}?version=${info.file.response.data.version}`;
      let coverAllList = [...beforeOperate, url];
      let listMap = [];
      listMap = coverAllList.map((item, index) => {
        return { url: item, isSelected: false, imgId: index }
      })
      dispatch({
        type: 'sourceManage/updatePageReducer',
        payload: {
          coverList: listMap,
        },
      });
    }
  }
  handleSelectCover = (coverInfo) => {
    const { dispatch, sourceManage } = this.props;
    const { coverList } = sourceManage;
    coverInfo.isSelected = !coverInfo.isSelected;
    coverList.map(item => {
      if (item.imgId != coverInfo.imgId) {
        item.isSelected = false;
      }
    })
    dispatch({
      type: 'sourceManage/updatePageReducer',
      payload: {
        coverList,
        videoFace: coverInfo.url,
      }
    });
  }
  // 确认上传视频
  handleConfirmUploadVideo = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sourceManage/confirmUploadVideo',
      payload: {
        isUploadVideo: false,
        isEditVideo: false,
        uploaded: false,
      }
    });
  }
  // 修改视频标题
  handleChangeVideoTitle = (e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sourceManage/updatePageReducer',
      payload: {
        videoTitle: e.target.value
      }
    });
  }
  handleChangeDate = (data, dataString) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sourceManage/getVideoList',
      payload: {
        uploadTimeStart: dataString[0],
        uploadTimeEnd: dataString[1],
      }
    });
  }
  handleCancelUploadVideo = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sourceManage/updatePageReducer',
      payload: {
        isUploadVideo: false,
        isEditVideo: false,
        uploaded: false,
        videoTitle: '',
      }
    });
  }
  // 复制链接
  onCopyToClipboard = () => {
    const { dispatch } = this.props;
    message.success("复制链接成功")
    dispatch({
      type: 'sourceManage/updatePageReducer',
      payload: {
        copied: true,
      }
    });
  }

  // 统一打开弹窗的方法
  handleShowModals = (type) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sourceManage/updatePageReducer',
      payload: {
        [type]: true,
      }
    });
  }
  handleCloseModals = (type) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sourceManage/updatePageReducer',
      payload: {
        [type]: false,
      }
    });
  }
  // 换页回调
  handleChangePageSize = (type, curPage, pageSize) => {
    const { dispatch } = this.props;
    switch (type) {
      case 'img':
        dispatch({
          type: 'sourceManage/getImgList',
          payload: {
            imgCurrentPage: 1,
            imgPageSize: pageSize,
          },
        });
        break;
      case 'video':
        dispatch({
          type: 'sourceManage/getVideoList',
          payload: {
            videoListCurrentPage: 1,
            videoListPageSize: pageSize,
          },
        });
        break;
      case 'gallery':
        dispatch({
          type: 'sourceManage/getGalleryList',
          payload: {
            galleryCurrentPage: 1,
            galleryPageSize: pageSize,
          },
        });
        break;
    }
  }
  handleChangecurrentPage = (type, e) => {
    const { dispatch } = this.props;
    switch (type) {
      case 'img':
        dispatch({
          type: 'sourceManage/getImgList',
          payload: {
            imgCurrentPage: e,
          },
        });
        break;
      case 'video':
        dispatch({
          type: 'sourceManage/getVideoList',
          payload: {
            videoListCurrentPage: e,
          },
        });
        break;
      case 'gallery':
        dispatch({
          type: 'sourceManage/getGalleryList',
          payload: {
            galleryCurrentPage: e,
          },
        });
        break;
    }
  }
  render() {
    const { sourceManage: {
      galleryList,
      isShowLoadModal,
      isShowNewGalleryModal,
      fileList,
      galleryId,
      newGalleryTitle,
      seletedKey,
      isShowConfirmDeleteModal,
      videoInfo,
      uploadTimeStart,
      uploadTimeEnd,
      isDeleteVideo,
      isUploadVideo,
      videoFileList,
      coverList,
      imgList,
      galleryToImgId,
      deleteImgModal,
      isAllChecked,
      checkedList,
      showMoveModal,
      imgGalleries,
      showSlideModal,
      currentIndex,
      videoList,
      isEditVideo,
      uploaded,
      isShowReplaceModal,
      imgId,
      imgTitle,
      previewVisible,
      previewImage,
      editImgTitle,
      galleryTotalCount,
      galleryPageSize,
      galleryCurrentPage,
      imgPageSize,
      imgListCount,
      imgCurrentPage,
      videoListTotalCount,
      videoListPageSize,
      videoListCurrentPage,
      videoTitle,
    } } = this.props;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div style={{ marginTop: 8, color: '#666' }}>上传</div>
      </div>
    );
    return (
      <PageHeaderLayout title="素材管理">
        <Card>
          <Tabs
            onChange={this.changeSelectedTabs}
            defaultActiveKey="1"
            onChange={this.handleChangeTabKey}
          >
            <TabPane tab="相册" key="1">
              {
                galleryToImgId ? (
                  <div>
                    <Row>
                      <Button type="primary" onClick={this.handleShowModals.bind(this, "isShowLoadModal")}>上传图片</Button>
                      <Button type="primary" onClick={this.handleBackToGalleryList} style={{ margin: "0 20px" }}>返回相册列表</Button>
                      <Checkbox
                        onChange={this.onCheckAllChange}
                        checked={isAllChecked}
                      >
                      </Checkbox>
                      <span>已选中{checkedList.length}个文件</span>
                      <a onClick={this.handleMoveMutiImgs} style={{ display: "inline-block", margin: "0 20px" }}>移动到</a>
                      <a onClick={this.handleShowDeleteImgModal}>删除</a>
                    </Row>
                    <Row style={{ margin: "20px 0" }}>
                      <span style={{ fontSize: 20, fontWeight: "bold", color: "#000" }}>{imgGalleries[galleryToImgId]}</span>
                    </Row>
                    <Row>
                      <div className={styles.container}>
                        {
                          imgList.map((item, index) => {
                            return <div className={styles.imgBox}>
                              <div className={styles.imgWrap}>
                                <img className={styles.picture} src={`${item.url}?version=${item.version}`} onClick={this.handleShowSlidePicture.bind(this, index)} />
                                <div className={styles.coverBar}>
                                  <Tooltip title="复制链接">
                                    <CopyToClipboard onCopy={this.onCopyToClipboard} text={item.url}>
                                      <span style={{ display: 'inline-block', marginLeft: 10, marginRight: 10 }}>
                                        <Icon type="copy" theme="filled" style={{ fontSize: 20, color: '#fff' }} />
                                      </span>
                                    </CopyToClipboard>
                                  </Tooltip>
                                  <Tooltip title="替换图片">
                                    <span
                                      style={{ display: 'inline-block', marginLeft: 10, marginRight: 10 }}
                                      onClick={this.handleReplaceImgs.bind(this, item.imgId, item.title)}
                                    >
                                      <Icon type="swap" style={{ fontSize: 20, color: '#fff' }} />
                                    </span>
                                  </Tooltip>
                                  <Tooltip title="删除">
                                    <span
                                      style={{ display: 'inline-block', marginLeft: 10, marginRight: 10 }}
                                      onClick={this.handleDeleteImg.bind(this, item.imgId)}
                                    >
                                      <Icon type="delete" style={{ fontSize: 20, color: '#fff' }} />
                                    </span>
                                  </Tooltip>
                                </div>
                              </div>
                              <div className={styles.ImgDesc}>
                                <Checkbox
                                  onChange={this.handleSelectImgs.bind(this, item.imgId)}
                                  checked={item.isChecked}
                                />
                                {
                                  item.isEditTitle ? <Input
                                    style={{ marginLeft: 4, width: 160 }}
                                    value={editImgTitle}
                                    onChange={this.handleChangeImgTitle}
                                    onBlur={this.handleSaveChangeTitle}
                                    onPressEnter={this.handleSaveChangeTitle}
                                    autoFocus
                                  >
                                  </Input> :
                                    <div
                                      onDoubleClick={this.handleTriggerEditTitle.bind(this, item.imgId)}
                                      className={styles.imgTitle}
                                    >
                                      {item.title}
                                    </div>
                                }
                              </div>
                              <div style={{ marginLeft: 18, color: "#999" }}>{item.uploadTime}</div>
                            </div>
                          })
                        }

                      </div>
                    </Row>
                    <Row type="flex" justify="end" style={{ marginTop: 20 }}>
                      <Pagination
                        showSizeChanger
                        pageSizeOptions={['16', '32', '48', '64']}
                        total={imgListCount}
                        pageSize={imgPageSize}
                        current={imgCurrentPage}
                        onShowSizeChange={this.handleChangePageSize.bind(this, 'img')}
                        onChange={this.handleChangecurrentPage.bind(this, 'img')}
                      />
                    </Row>
                  </div>
                ) : <div>
                    <Row>
                      <Button type="primary" onClick={this.handleShowModals.bind(this, 'isShowLoadModal')}>上传图片</Button>
                      <Button style={{ marginLeft: 20, marginRight: 20 }} onClick={this.handleCreteGallery.bind(this, null)}>新建相册</Button>
                      <Input.Search
                        className={globalStyles['input-sift']}
                        placeholder="请输入相册名称"
                        onSearch={this.handleSearchByGalleryTitle}
                      />
                      <div className={styles.container}>
                        {
                          galleryList.map(item => {
                            return <div className={styles.galleryBox}>
                              <img className={styles.img} src={item.num > 0 ? item.imgUrl : defaultCover} onClick={this.handleShowImgList.bind(this, item.galleryId)} />
                              <Dropdown overlay={
                                (<Menu
                                  onClick={this.handleClickMenu.bind(this, item.galleryId, item.num)}
                                >
                                  <Menu.Item key="1">编辑</Menu.Item>
                                  <Menu.Item key="2">删除</Menu.Item>
                                </Menu>)
                              }>
                                <span className={styles.icon}><Icon type="down-square" theme="filled" style={{ color: "#666", fontSize: 20 }} /></span>
                              </Dropdown>
                              <p className={styles.title}>{`${item.title}（${item.num}）`}</p>
                            </div>
                          })
                        }
                      </div>
                    </Row>
                    <Row type="flex" justify="end" style={{ marginTop: 20 }}>
                      <Pagination
                        showSizeChanger
                        pageSizeOptions={['16', '32', '48', '64']}
                        total={galleryTotalCount}
                        pageSize={galleryPageSize}
                        current={galleryCurrentPage}
                        onShowSizeChange={this.handleChangePageSize.bind(this, 'gallery')}
                        onChange={this.handleChangecurrentPage.bind(this, 'gallery')}
                      />
                    </Row>
                  </div>
              }
              <Modal
                title={seletedKey ? "修改相册" : "新建相册"}
                visible={isShowNewGalleryModal}
                onOk={this.handleConfirmCreate}
                onCancel={this.handleCloseModals.bind(this, 'isShowNewGalleryModal')}
                zIndex={999999}
              >
                名称：
                          <Input
                  className={globalStyles['input-sift']}
                  value={newGalleryTitle}
                  onChange={this.handleChangeGalleryName}
                />
              </Modal>
              <Modal
                title="上传"
                visible={isShowLoadModal}
                onCancel={this.handleCloseUploadModals}
                onOk={this.handleConfirm}
                width={1000}
              >
                <Row style={{ marginBottom: 30 }}>
                  上传到：
                    <Select
                    className={globalStyles['select-sift']}
                    onChange={this.handleSelectGallery}
                    value={imgGalleries[galleryId]}
                  >
                    {
                      Object.keys(imgGalleries).map(key => {
                        return <Select.Option key={key} value={key}>{imgGalleries[key]}</Select.Option>
                      })
                    }
                  </Select>
                  <Button style={{ marginLeft: 10 }} type="primary" onClick={this.handleCreteGallery.bind(this, "modalClose")}>新建相册</Button>
                </Row>
                <Upload
                  fileList={fileList}
                  listType="picture-card"
                  action={`${getUrl(API_ENV)}/content/img-resource/create`}
                  onChange={this.handleChangeUpload}
                  onPreview={this.handlePreview}
                  onRemove={this.handleRemoveImgs}
                  beforeUpload={this.beforeUpload.bind(this, 'img')}
                  data={{
                    "galleryId": galleryId
                  }}
                  multiple
                  className={styles.uploadComponent}
                  headers={{
                    authorization: `Basic ${window.btoa(`${localStorage.getItem('token')}:`)}`,
                  }}
                >
                  {uploadButton}
                </Upload>
              </Modal>
              <Modal
                visible={isShowConfirmDeleteModal}
                title={"删除相册"}
                onOk={this.handleConfirmDelete}
                onCancel={this.handleCloseModals.bind(this, 'isShowConfirmDeleteModal')}
              >
                请确认是否删除该相册？
                        </Modal>
              <Modal
                visible={deleteImgModal}
                onOk={this.handleConfirmDeleteImgs}
                onCancel={this.handleCancelDeleteImgs}
                title="删除图片"
              >
                请确认是否删除该图片？
                        </Modal>
              {/* --------------移动图片的弹窗------------- */}
              <Modal
                visible={showMoveModal}
                title="移动图片"
                onOk={this.handleConfirmMoveImgs}
                onCancel={this.handleCloseModals.bind(this, 'showMoveModal')}
              >
                <Row>
                  选择相册：
                            <Select
                    className={globalStyles['select-sift']}
                    onChange={this.handleSelectGallery}
                  >
                    {
                      Object.keys(imgGalleries).map(key => {
                        return <Select.Option key={key} value={key}>{imgGalleries[key]}</Select.Option>
                      })
                    }
                  </Select>
                </Row>
              </Modal>
              {/* 替换图片的弹窗 */}
              <Modal
                title="替换图片"
                visible={isShowReplaceModal}
                footer={null}
                onCancel={this.handleCancelReplace}

              >
                <p>请上传需要替换的图片（注意只能替换相同格式的图片）</p>
                <Row>
                  <Upload
                    listType="picture-card"
                    onChange={this.handleConfirmReplaceImg}
                    beforeUpload={this.handleBeforeUpload}
                    action={`${getUrl(API_ENV)}/content/img-resource/update`}
                    onPreview={this.handlePreview}
                    fileList={fileList}
                    className={styles.uploadComponent}
                    headers={{
                      authorization: `Basic ${window.btoa(`${localStorage.getItem('token')}:`)}`,
                    }}
                    data={{
                      imgId: imgId,
                      title: imgTitle,
                    }}
                  >
                    {fileList.length >= 1 ? null : uploadButton}
                  </Upload>
                </Row>
                {/* <Row>
                           标题：
                            <Input
                            style={{width:200}}
                            value={imgTitle}
                            onChange={this.handleChangeImgTitle}
                            />
                           </Row> */}
              </Modal>
              {/* 预览图片弹窗 */}
              <Modal
                visible={previewVisible}
                footer={null}
                onCancel={this.handleCloseModals.bind(this, 'previewVisible')}
              >
                <img alt="头像" style={{ width: '100%' }} src={previewImage} />

              </Modal>
              <Modal
                title={null}
                footer={null}
                width={1200}
                visible={showSlideModal}
                onCancel={this.handleCloseModals.bind(this, 'showSlideModal')}
              >
                <Row justify="center" type="flex">
                  <span style={{ fontSize: 24 }}>{imgList[currentIndex] && imgList[currentIndex].title}</span>
                </Row>
                <Row justify="center" type="flex" style={{ marginTop: 10 }}>
                  <div className={styles.rowItems}>
                    <span>大小：{imgList[currentIndex] && imgList[currentIndex].fileSize}</span>
                    <span>图片尺寸：{`${imgList[currentIndex] && imgList[currentIndex].width}x${imgList[currentIndex] && imgList[currentIndex].high} `}</span>
                    <span>上传时间{imgList[currentIndex] && imgList[currentIndex].uploadTime}</span>
                  </div>
                </Row>
                <div style={{ marginTop: 40 }} className={styles.imgRow}>
                  <div className={styles.icon} onClick={this.handleShowPrePic}>
                    <Icon type="left" style={{ fontSize: 50 }} />
                  </div>
                  <div className={styles.showImg}>
                    <img src={imgList[currentIndex] && imgList[currentIndex].url} />
                  </div>
                  <div className={styles.icon} onClick={this.handleShowNextPic}>
                    <Icon type="right" style={{ fontSize: 50 }} />
                  </div>
                </div>
              </Modal>
            </TabPane>
            <TabPane tab="视频" key="2">
              <Row>
                <Button type="primary" style={{ marginRight: 10 }} onClick={this.handleShowModals.bind(this, 'isUploadVideo')}>上传视频</Button>
                <Input.Search
                  placeholder="请输入视频名称"
                  onSearch={this.handleSearchVideo}
                  className={globalStyles['input-sift']}
                />
                上传日期：
                        <RangePicker
                  value={[uploadTimeStart ? moment(uploadTimeStart, 'YYYY-MM-DD') : null, uploadTimeEnd ? moment(uploadTimeEnd, 'YYYY-MM-DD') : null]}
                  format="YYYY-MM-DD"
                  className={globalStyles['rangePicker-sift']}
                  onChange={this.handleChangeDate}
                />
              </Row>
              <Row>
                {
                  videoList.length > 0 ? <div className={styles.videoContainer}>
                    {
                      videoList.map(item => {
                        return <div className={styles.videoBox}>
                          <div className={styles.video}>
                            <video poster={item.videoFace} src={item.url} controls style={{ border: "1px solid #d8d7d7" }}></video>
                            <div className={styles.bar}>
                              <Row>
                                <Col span={12}>
                                  <span>{item.videoLength <= 60 ? `00:${item.videoLength}` : `${parseInt(item.videoLength / 60)}:${item.videoLength % 60}`}</span>
                                  <span style={{ display: 'inline-block', margin: '0 4px' }}>|</span>
                                  <span>{item.videoSize}</span>
                                </Col>
                                <Col span={12} align="end">
                                  <Tooltip title="编辑">
                                    <Icon
                                      type="form"
                                      theme="filled"
                                      style={{ color: "#fff", fontSize: 20 }}
                                      onClick={this.handleEditVideo.bind(this, item)}
                                    />
                                  </Tooltip>
                                  <Tooltip title="复制链接">
                                    <CopyToClipboard onCopy={this.onCopyToClipboard} text={item.url}>
                                      <span style={{ display: 'inline-block', marginLeft: 10, marginRight: 10 }}>
                                        <Icon type="copy" theme="filled" style={{ color: "#fff", fontSize: 20 }} />
                                      </span>
                                    </CopyToClipboard>
                                  </Tooltip>
                                  <Tooltip title="删除">
                                    <Icon
                                      type="delete" theme="filled"
                                      style={{ color: "#fff", fontSize: 20 }}
                                      onClick={this.handleDeleteVideo.bind(this, item.videoId)}
                                    />
                                  </Tooltip>
                                </Col>
                              </Row>
                            </div>
                          </div>
                          <div className={styles.desc}>
                            <p style={{ color: "#2e2d2d" }}>{item.title}</p>
                            <p style={{ color: "#999" }}>{item.uploadTime}</p>
                          </div>
                        </div>
                      })
                    }
                  </div> : <Row style={{ marginTop: 20 }} type="flex" justify="center">暂无数据</Row>
                }
              </Row>
              <Row type="flex" justify="end">
                <Pagination
                  showSizeChanger
                  pageSizeOptions={['14', '28', '42', '56']}
                  total={videoListTotalCount}
                  pageSize={videoListPageSize}
                  current={videoListCurrentPage}
                  onShowSizeChange={this.handleChangePageSize.bind(this, 'video')}
                  onChange={this.handleChangecurrentPage.bind(this, 'video')}
                />
              </Row>
              <Modal
                title="删除"
                visible={isDeleteVideo}
                onOk={this.handleConfirmDeleteVideo}
                onCancel={this.handleCloseModals.bind(this, 'isDeleteVideo')}
              >
                <p>请确认是否删除该视频?</p>
              </Modal>
              <Modal
                title={isEditVideo ? "修改视频" : "上传视频"}
                width={uploaded || isEditVideo ? 1000 : 500}
                visible={isUploadVideo}
                onOk={this.handleConfirmUploadVideo}
                onCancel={this.handleCancelUploadVideo}
              >
                {
                  uploaded || isEditVideo ? (<div>
                    <Row style={{ background: "#f2f2f2", height: 40, padding: "0 10px" }} type="flex" align="middle">
                      <Col span={8}>
                        名称
                            </Col>
                      <Col span={8}>
                        大小
                            </Col>
                      <Col span={8}>
                        状态
                            </Col>
                    </Row>
                    <Row style={{ marginTop: 10, marginBottom: 10, padding: "0 10px" }}>
                      <Col span={8}>
                        {videoInfo.fileName || videoInfo.title}
                      </Col>
                      <Col span={8}>
                        {videoInfo.videoSize}
                      </Col>
                      <Col span={8}>
                        上传成功
                            </Col>
                    </Row>
                    <Row type="flex" align="top" style={{ marginTop: 10 }}>
                      <div style={{ width: 430, height: 240, display: 'inline-block', marginRight: 30 }}>
                        <video src={videoInfo.url} poster={videoInfo.videoFace} controls style={{ width: '100%', height: '100%' }}></video>
                      </div>
                      <div style={{ display: 'inline-block' }}>
                        <p><span style={{ color: "red" }}>*</span><span>标题</span></p>
                        <Input
                          style={{ width: 300 }}
                          value={videoTitle}
                          onChange={this.handleChangeVideoTitle}
                        ></Input>
                      </div>
                    </Row>
                    <Row style={{ marginTop: 10, marginBottom: 10 }}>封面选择：（支持JPG.PNG.GIF格式，尺寸不低于654*368px，大小不超过500k）</Row>
                    <Row>
                      {
                        coverList.map(item => {
                          return <div className={styles.coverContainer}>
                            <div
                              className={item.isSelected ? styles.isSelected : ''}
                              onClick={this.handleSelectCover.bind(this, item)}
                            >
                              <img src={item.url} />
                            </div>
                          </div>
                        })
                      }
                      <Upload
                        listType="picture-card"
                        onChange={this.handleUploadImgCover}
                        action={`${getUrl(API_ENV)}/content/video-resource/create-face`}
                        className={styles.uploadList}
                        beforeUpload={this.beforeUpload.bind(this, 'imgCover')}
                        headers={{
                          authorization: `Basic ${window.btoa(`${localStorage.getItem('token')}:`)}`,
                        }}
                        data={{
                          videoId: videoInfo.videoId
                        }}
                      >
                        {uploadButton}
                      </Upload>
                    </Row>
                  </div>) : <Upload
                    onChange={this.handleChangeUploadVideo}
                    action={`${getUrl(API_ENV)}/content/video-resource/create`}
                    beforeUpload={this.beforeUpload.bind(this, 'video')}
                    headers={{
                      authorization: `Basic ${window.btoa(`${localStorage.getItem('token')}:`)}`,
                    }}
                  >
                      <Row style={{ height: 100 }}>
                        <div className={styles.uploadBtn}>
                          <Button type="primary">上传视频</Button>
                        </div>
                      </Row>
                    </Upload>
                }
              </Modal>
            </TabPane>
          </Tabs>
        </Card>
      </PageHeaderLayout>
    );
  }
}
