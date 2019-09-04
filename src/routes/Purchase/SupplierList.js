import React, { PureComponent } from 'react';
import { stringify } from 'qs';
import Debounce from 'lodash-decorators/debounce';
import { connect } from 'dva';
import {
  Modal,
  Card,
  Row,
  Col,
  Select,
  AutoComplete,
  Input,
  Table,
  Dropdown,
  Menu,
  Icon,
  Button,
  Upload,
  notification,
  Tooltip,
} from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './SupplierList.less';
import globalStyles from '../../assets/style/global.less';

const { Option } = Select;

@connect(state => ({
  supplierList: state.supplierList,
}))
export default class SupplierList extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierList/getSupplierList',
      payload: {
        curPage: 1,
      },
    });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierList/unmount',
    });
  }
  // 修改 supplier 的搜索文案
  @Debounce(300)
  handleChangeSupplierKeyword(keywords) {
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierList/changeSupplierKeyword',
      payload: {
        keywords,
      },
    });
  }
  // 修改 status
  handleSearchSupplierStatus(status) {
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierList/searchSupplierStatus',
      payload: {
        status,
      },
    });
  }
  handleSearchSupplierKeyword(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierList/searchSupplierKeyword',
      payload: {
        keywords: e.target.value,
      },
    });
  }
  handleSearchSupplierId(id) {
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierList/searchSupplierId',
      payload: {
        id,
      },
    });
  }
  handleChangePage(page) {
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierList/changePage',
      payload: {
        curPage: page,
      },
    });
  }
  handleTriggerOperaSupplier(supplierStatus, supplierId) {
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierList/triggerOperaSupplier',
      payload: {
        supplierStatus,
        supplierId,
      },
    });
  }
  handleOkOperaSupplier() {
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierList/okOperaSupplier',
    });
  }

  // 点击导入按钮弹出上传弹窗
  handleClickImportButton() {
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierList/clickImportButton',
    });
  }
  // 取消导入上传弹窗
  handleImportPopup() {
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierList/clickCancleImportButton',
    });
  }
  handleChangeUpload(info) {
    const { dispatch } = this.props;
    if (info.file.status === 'uploading') {
      // dispatch({
      //   type: 'supplierList/uploadingSupplierList',
      // });
    }
    if (info.file.status === 'error') {
      notification.error({
        message: '提示',
        description: '上传失败, 请稍后重试!',
      });
    }
    if (info.file.status === 'done') {
      if (info.file.response.code !== 0) {
        notification.error({
          message: '提示',
          description: info.file.response.msg,
        });
        return;
      }
      notification.success({
        message: '提示',
        description: '上传成功!',
      });
      dispatch({
        type: 'supplierList/updateSupplierList',
        payload: info.file.response.data,
      });
    }
  }
  render() {
    const {
      supplierList: {
        keywords,
        id,
        status,
        total,
        curPage,
        isLoading,
        isOperaing,
        isShowOperaModal,
        supplierSuggests,
        suppliers,
        supplierType,
        isShowUploadModal,
        isUploading,
      },
    } = this.props;
    const supplierColumns = [
      {
        title: '编号',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '检索简码',
        dataIndex: 'sn',
        key: 'sn',
      },
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        render: (name, record) => {
          return (
            <Link
              to={`/purchase/supplier-list/supplier-edit/${record.id}`}
            >
              <span>{name}</span>
            </Link>
          );
        },
      },
      {
        title: '联系人',
        dataIndex: 'linkman',
        key: 'linkman',
      },
      {
        title: '联系方式',
        dataIndex: 'contact',
        key: 'contact',
      },
      {
        title: '地址',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (supplierStatus) => {
          return +supplierStatus === 1 ? '启用' : '禁用';
        },
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        width: 100,
        render: remark => (
          <Tooltip title={remark}>
            <span className={globalStyles['ellipsis-col']}>{remark}</span>
          </Tooltip>
        ),
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (_, record) => {
          return (
            <Dropdown
              placement="bottomRight"
              overlay={
                <Menu>
                  <Menu.Item>
                    <Link
                      to={`/purchase/supplier-list/supplier-edit/${record.id}`}
                    >
                      修改
                    </Link>
                  </Menu.Item>
                  <Menu.Item>
                    <div
                      onClick={this.handleTriggerOperaSupplier.bind(
                        this,
                        record.status,
                        record.id
                      )}
                    >
                      {+record.status === 0 ? '启用' : '禁用'}
                    </div>
                  </Menu.Item>
                  <Menu.Item>
                    <Link
                      to={`/purchase/supplier-list/supplier-goods-list/${
                        record.id
                      }`}
                    >
                      供应商品
                    </Link>
                  </Menu.Item>
                </Menu>
              }
            >
              <Icon type="ellipsis" />
            </Dropdown>
          );
        },
      },
    ];
    const supplierSuggestsOptions = supplierSuggests.map(supplierSuggest => (
      <Option key={supplierSuggest.id} value={supplierSuggest.id.toString()}>
        {supplierSuggest.name}
      </Option>
    ));
    const exportUrl = `http://erp.xiaomei360.com/common/export-supplier-info-list?${stringify({
      id,
      keywords,
      status,
    })}`;
    const downloadUrl = 'http://erp.xiaomei360.com/uploads/供应商导入模版.xlsx';
    return (
      <PageHeaderLayout title="供应商列表">
        <Card bordered={false}>
          <Row gutter={{ md: 24 }} style={{ position: 'relative' }}>
            <Col style={{ display: 'inline-block' }}>
              <AutoComplete
                style={{ width: 300 }}
                allowClear
                defaultActiveFirstOption={false}
                dataSource={supplierSuggestsOptions}
                onSelect={this.handleSearchSupplierId.bind(this)}
                onSearch={this.handleChangeSupplierKeyword.bind(this)}
              >
                <Input.Search
                  value={keywords}
                  placeholder="请输入供应商名称/编码/联系人/联系方式"
                  onPressEnter={this.handleSearchSupplierKeyword.bind(this)}
                />
              </AutoComplete>
            </Col>
            <Col style={{ display: 'inline-block' }}>
              <Select
                onChange={this.handleSearchSupplierStatus.bind(this)}
                value={status}
              >
                <Option value={-1}>全部状态</Option>
                <Option value={1}>已启用</Option>
                <Option value={0}>已禁用</Option>
              </Select>
            </Col>
            <Col style={{ position: 'absolute', right: 0, top: 0 }}>
              <a style={{ marginRight: 10 }} target="_blank" href={downloadUrl}>
                <Button>
                  <Icon type="download" />下载模板
                </Button>
              </a>
              <Button type="primary" style={{ marginRight: '10px' }} onClick={this.handleClickImportButton.bind(this)}>导入</Button>
              <a style={{ marginRight: 10 }} target="_blank" href={exportUrl}>
                <Button>导出</Button>
              </a>
              <Link to="/purchase/supplier-list/supplier-edit">
                <Button icon="plus" type="primary">
                  新增
                </Button>
              </Link>
            </Col>
          </Row>
          <Table
            bordered
            loading={isLoading}
            style={{ marginTop: 20 }}
            dataSource={suppliers}
            columns={supplierColumns}
            rowKey={record => record.id}
            pagination={{
              current: curPage,
              onChange: this.handleChangePage.bind(this),
              total,
              showTotal:total => `共 ${total} 个结果`,
            }}
          />
          <Modal
            title="确认"
            visible={isShowOperaModal}
            onOk={this.handleOkOperaSupplier.bind(this)}
            confirmLoading={isOperaing}
            onCancel={this.handleTriggerOperaSupplier.bind(this)}
          >
            <p style={{ textAlign: 'center' }}>
              请确认是否{+supplierType === 0 ? '启用' : '禁用'}?
            </p>
          </Modal>
          <Modal
            title="上传供应商列表"
            visible={isShowUploadModal}
            onOk={this.handleImportPopup.bind(this)}
            confirmLoading={isUploading}
            onCancel={this.handleImportPopup.bind(this)}
          >
            <Upload
              name="supplierList"
              action="http://erp.xiaomei360.com/purchase/purchase-supplier-info/import"
              onChange={this.handleChangeUpload.bind(this)}
              headers={{
                authorization: `Basic ${window.btoa(`${localStorage.getItem('token')}:`)}`,
              }}
            >
              <Button type="primary" style={{ marginLeft: '160px' }}>
                <Icon type="upload" /> 导入供应商
              </Button>
            </Upload>
          </Modal>
        </Card>
      </PageHeaderLayout>
    );
  }
}
