import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Row, Table, Modal, Input, Col, Button, Upload, Icon, Select, message } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import globalStyles from '../../assets/style/global.less';
import styles from './PosterManage.less';
import { getUrl } from '../../utils/request';

const { Search } = Input;
@connect(state => ({
  posterManage: state.posterManage,
}))
export default class PosterManage extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'posterManage/getList',
    });
    dispatch({
      type: 'posterManage/getBrandList',
    });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'posterManage/unmountReducer',
    });
  }
  handleAddPoster = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'posterManage/updatePageReducer',
      payload: {
        isShowAddPosterModal: true,
      },
    });
  }
  handleChangeSyncItem = (type, e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'posterManage/updatePageReducer',
      payload: {
        [type]: e.target.value,
      },
    });
  }
  handleSearchItem = (type, e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'posterManage/getList',
      payload: {
        [type]: e,
        page: 1,
      },
    });
  }
  // 钩子函数
  beforeUpload = (file) => {
    const isIMG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/bmp' || file.type === 'image/gif';
    const isLt5M = file.size / 1024 / 1024 < 0.48;
    if (!isIMG) {
      message.error('要求格式：jpg .jpeg.png.bmp.gif');
      return false;
    }
    if (!isLt5M) {
      message.error('图片大小不能大于500k');
      return false;
    }
  }
  handleChangeUpload = (info) => {
    console.log("info",info)
    const { dispatch } = this.props;
    if (info.file.status === 'error') {
      message.error('上传失败，请稍后重试!');
    }
    if (info.file.status === 'done') {
      dispatch({
        type: 'posterManage/updatePageReducer',
        payload: {
          authorImgId: info.file.response.data.imgs[0].imgId,
          editImg: '',
        },
      });
    }
    dispatch({
      type: 'posterManage/updatePageReducer',
      payload: {
        fileList: info.fileList,
      },
    });
  }
  // 预览图片
  handlePreview = (file) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'posterManage/updatePageReducer',
      payload: {
        previewImage: file.url || file.thumbUrl,
        previewVisible: true,
      },
    });
  }
  handleClosePreview = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'posterManage/updatePageReducer',
      payload: {
        previewVisible: false,
      },
    });
  }
  handleConfirmAddPoster = () => {
    const { dispatch, posterManage } = this.props;
    const { authorName } = posterManage;
    if (authorName == '') {
      message.error('请填写发布方名称');
      return;
    }
    dispatch({
      type: 'posterManage/confirmAddPoster',
      payload: {
        isShowAddPosterModal: false,
      },
    });
  }
  handleCancelAdd = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'posterManage/updatePageReducer',
      payload: {
        isShowAddPosterModal: false,
        authorName: '',
        brandId: '',
        authorId: '',
        isEdit: false,
        editImg: '',
        fileList: '',
      },
    });
  }
  handleEdit = (author) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'posterManage/updatePageReducer',
      payload: {
        isEdit: true,
        isShowAddPosterModal: true,
        authorId: author.authorId,
        brandId: author.brandId,
        authorName: author.authorName,
        editImg: author.authorImg,
      },
    });
  }
  handleDelete = (authorId) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'posterManage/updatePageReducer',
      payload: {
        isDelete: true,
        authorId,
      },
    });
  }
  handleConfirmDelete = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'posterManage/confirmDelete',
      payload: {
        isDelete: false,
      },
    });
  }
  handleCancelDelete = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'posterManage/updatePageReducer',
      payload: {
        isDelete: false,
      },
    });
  }
  handleShowUploadModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'posterManage/updatePageReducer',
      payload: {
        isShowUploadModal: true,
      },
    });
  }
  handleChangePosterName = (e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'posterManage/updatePageReducer',
      payload: {
        authorName: e.target.value,
      },
    });
  }
  handleChangeBrandId = (e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'posterManage/updatePageReducer',
      payload: {
        brandId: e,
      },
    });
  }
  handleChangecurrentPage(page) {
    const { dispatch } = this.props;
    dispatch({
      type: 'posterManage/getList',
      payload: {
        page,
      },
    });
  }
  // 切换每页行数
  handleChangePageSize(_, pageSize) {
    const { dispatch } = this.props;
    dispatch({
      type: 'posterManage/getList',
      payload: {
        pageSize,
        page: 1,
      },
    });
  }
  render() {
    const {
      posterManage: {
        isTableLoading,
        authorList,
        isShowAddPosterModal,
        fileList,
        isEdit,
        isDelete,
        previewVisible,
        previewImage,
        isShowUploadModal,
        brandList,
        authorName,
        brandId,
        page,
        pageSize,
        totalCount,
        editImg,
      },
    } = this.props;
    const columns = [
      {
        title: '发布方ID',
        dataIndex: 'authorId',
        key: 'authorId',
        width: 200,
      },
      {
        title: '发布方头像',
        dataIndex: 'authorImg',
        key: 'authorImg',
        width: 300,
        render: (authorImg, record) => {
          return (<div onClick={this.handleEdit.bind(this, record)} style={{ cursor: "pointer" }}>
            <img
              src={authorImg}
              style={{ width: 50, height: 50 }} />
          </div>);
        },
      },
      {
        title: '发布方名称',
        dataIndex: 'authorName',
        key: 'authorName',
      },
      {
        title: '关联品牌',
        dataIndex: 'brandId',
        key: 'brandId',
        render: (brandId) => {
          return <span>{brandList[brandId]}</span>;
        },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        align: 'center',
        width: 300,
        render: (operation, record) => {
          return (<p>
            <Button ghost type="primary" onClick={this.handleEdit.bind(this, record)} style={{ marginRight: 10 }}>修改</Button>
            <Button ghost type="primary" onClick={this.handleDelete.bind(this, record.authorId)}>删除</Button>
          </p>);
        },
      },
    ];
    const uploadButton = (
      <div>本地上传</div>
    );

    return (
      <PageHeaderLayout title="发布方管理">
        <Card bordered={false}>
          <Row style={{ marginBottom: 20 }}>
            <Col span={20}>
              <Search
                placeholder="发布方ID"
                className={globalStyles['input-sift']}
                onChange={this.handleChangeSyncItem.bind(this, 'authorId')}
                onSearch={this.handleSearchItem.bind(this, 'authorId')}
              />
              <Search
                placeholder="发布方名称"
                className={globalStyles['input-sift']}
                onChange={this.handleChangeSyncItem.bind(this, 'authorName')}
                onSearch={this.handleSearchItem.bind(this, 'authorName')}
              />
            </Col>
            <Col span={2} align="end">
              <Button
                type="primary"
                onClick={this.handleAddPoster}
              >
                新增发布方
              </Button>
            </Col>
          </Row>
          <Table
            loading={isTableLoading}
            dataSource={authorList}
            columns={columns}
            bordered
            pagination={{
              current: page,
              pageSize,
              total: totalCount,
              showSizeChanger: true,
              onShowSizeChange: this.handleChangePageSize.bind(this),
              onChange: this.handleChangecurrentPage.bind(this),
              showTotal:total => `共 ${total} 个结果`,
            }}
          />
          <Modal
            visible={isShowAddPosterModal}
            title={isEdit ? '修改发布方' : '新增发布方'}
            closable={false}
            width={800}
            onOk={this.handleConfirmAddPoster}
            onCancel={this.handleCancelAdd}
            maskClosable={false}
          >
            <Row>
              <Col span={4} align="end">
                <span style={{ color: 'red' }}>*</span>上传发布方头像：
              </Col>
              <span style={{ color: '#b8b7b7' }}>(图片尺寸建议不小于200px*200px;要求格式：jpg .jpeg.png.bmp)</span>
            </Row>
            <Row style={{ marginTop: 10, marginLeft: 130 }} type="flex" justify="start">
              {
                editImg ? <div className={styles.imgShow}>
                  <img src={editImg} />
                          </div> : null
              }
              <Upload
                listType="picture-card"
                fileList={fileList}
                action={`${getUrl(API_ENV)}/content/img-resource/create`}
                onPreview={this.handlePreview}
                onChange={this.handleChangeUpload}
                beforeUpload={this.beforeUpload}
                className={styles.uploadComponent}
                headers={{
                  authorization: `Basic ${window.btoa(`${localStorage.getItem('token')}:`)}`,
                }}
              >
                {fileList.length >= 1 ? null : uploadButton}
              </Upload>
            </Row>
            <Row>
              <Col span={4} align="end"><span style={{ color: 'red' }}>*</span>发布方名称：</Col>
              <Input
                style={{ width: 200 }}
                value={authorName}
                onChange={this.handleChangePosterName}
              />
            </Row>
            <Row style={{ marginTop: 10 }}>
              <Col span={4} align="end">关联品牌：</Col>
              <Select
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) => {
                  return option.props.children.indexOf(input) >= 0;
                }}
                placeholder="请选择关联品牌"
                value={brandList[brandId]}
                style={{ width: 200 }}
                onChange={this.handleChangeBrandId}
                allowClear
              >
                {
                  Object.keys(brandList).map((item) => {
                    return <Select.Option key={item} value={item}>{brandList[item]}</Select.Option>;
                  })
                }
              </Select>
            </Row>
          </Modal>
          {/* 删除发布方弹窗 */}
          <Modal
            title="删除"
            onOk={this.handleConfirmDelete}
            onCancel={this.handleCancelDelete}
            visible={isDelete}
          >
            <p style={{ textAlign: 'center' }}>请确认是否删除?</p>

          </Modal>
          {/* 预览图片弹窗 */}
          <Modal
            visible={previewVisible}
            footer={null}
            onCancel={this.handleClosePreview}
          >
            <img alt="头像" style={{ width: '100%' }} src={previewImage} />

          </Modal>
        </Card>
      </PageHeaderLayout>
    );
  }
}
