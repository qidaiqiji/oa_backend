import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Row, Table, Button, Upload, notification, Modal } from 'antd';
// import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './ImportInventoryList.less';


@connect(state => ({
  importInventoryList: state.importInventoryList,
}))
export default class importInventoryList extends PureComponent {
  componentDidMount() {
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'importInventoryList/getList',
    // });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'importInventoryList/unmount',
    });
  }
  handleSiftGoodsList() {
    const { dispatch } = this.props;
    dispatch({
      type: 'importInventoryList/getList',
      payload: {
        currentPage: 1,
      },
    });
  }
  handleChangeKeywords(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'importInventoryList/changeKeywords',
      payload: {
        keywords: e.target.value,
      },
    });
  }
  handleChangeUpload(info) {
    const { dispatch } = this.props;
    if (info.file.status === 'uploading') {
      dispatch({
        type: 'importInventoryList/uploadingGoodsList',
      });
    }
    if (info.file.status === 'error') {
      notification.error({
        message: '提示',
        description: '上传失败, 请稍后重试!',
      });
      dispatch({
        type: 'importInventoryList/updateGoodsList',
        payload: {},
      });
    }
    if (info.file.status === 'done') {
      dispatch({
        type: 'importInventoryList/updateGoodsList',
        payload: info.file.response.data,
      });
    }
  }
  handleTriggerOperaInventoryModal() {
    const { dispatch } = this.props;
    dispatch({
      type: 'importInventoryList/triggerOperaInventoryModal',
    });
  }
  handleOkOperaInventoryModal() {
    const { dispatch } = this.props;
    dispatch({
      type: 'importInventoryList/okOperaInventoryModal',
    });
  }
  render() {
    const {
      importInventoryList: {
        total,
        isLoading,
        goodsList,
        isShowOperaInventoryModal,
        isOkingOperaInventoryModal,
      },
    } = this.props;
    const goodsColumns = [
      {
        title: '商品图片',
        dataIndex: 'img',
        key: 'img',
        fixed: 'left',
        width: 90,
        render: (imgSrc, record) => {
          return <img src={imgSrc} style={{ width: 55, height: 55 }} />;
        },
      },
      {
        title: '商品名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '条码',
        dataIndex: 'sn',
        key: 'sn',
      },
      {
        title: '单位',
        dataIndex: 'unit',
        key: 'unit',
      },
      {
        title: '在途库存',
        dataIndex: 'inWayNum',
        key: 'inWayNum',
      },
      {
        title: '即时库存',
        dataIndex: 'immNum',
        key: 'immNum',
      },
      {
        title: '仓库库存',
        dataIndex: 'ourateNum',
        key: 'ourateNum',
      },
      {
        title: '可用库存',
        dataIndex: 'canUseNum',
        key: 'canUseNum',
      },
      {
        title: '占用库存',
        dataIndex: 'occupyNum',
        key: 'occupyNum',
      },
      {
        title: '盘点数量',
        dataIndex: 'realNum',
        key: 'realNum',
      },
      {
        title: '小美盘盈亏数量',
        dataIndex: 'diffXm',
        key: 'diffXm',
        defaultSortOrder: 'ascend',
        sorter: (pre, next) => {
          if (+next.diffXm === 0) {
            return false;
          }
          return +pre.diffXm - +next.diffXm;
        },
        render: (diffXm) => {
          if (diffXm > 0) {
            return <span style={{ color: '#FC091B' }}>{diffXm}</span>;
          }
          if (diffXm < 0) {
            return <span style={{ color: '#0C7F12' }}>{diffXm}</span>;
          }
          return diffXm;
        },
      },
      {
        title: '仓库盘盈亏数量',
        dataIndex: 'diffOurate',
        key: 'diffOurate',
        defaultSortOrder: 'ascend',
        sorter: (pre, next) => {
          if (+next.diffOurate === 0) {
            return false;
          }
          return +pre.diffOurate - +next.diffOurate;
        },
        render: (diffOurate) => {
          if (diffOurate > 0) {
            return <span style={{ color: '#FC091B' }}>{diffOurate}</span>;
          }
          if (diffOurate < 0) {
            return <span style={{ color: '#0C7F12' }}>{diffOurate}</span>;
          }
          return diffOurate;
        },
      },
    ];
    return (
      <PageHeaderLayout title="导入盘点单">
        <Card bordered={false}>
          <Table
            bordered
            title={() => {
              return (
                <Row>
                  <Upload
                    name="inventoryList"
                    action="http://erp.xiaomei360.com/depot/goods-depot/import"
                    onChange={this.handleChangeUpload.bind(this)}
                    headers={{
                      authorization: `Basic ${window.btoa(`${localStorage.getItem('token')}:`)}`,
                    }}
                  >
                    <Button type="primary">导入盘点单</Button>
                  </Upload>
                </Row>
              );
            }}
            footer={() => {
              return (
                <Row gutter={24} type="flex" justify="end">
                  <Button type="primary" onClick={this.handleTriggerOperaInventoryModal.bind(this)}>确定</Button>
                  <Button style={{ marginLeft: 10 }} onClick={() => {}}>取消</Button>
                </Row>
              );
            }}
            loading={isLoading}
            rowKey={record => record.id}
            columns={goodsColumns}
            scroll={{
              x: 1000,
            }}
            pagination={false}
            dataSource={goodsList}
          />
          <Modal
            title="提示"
            visible={isShowOperaInventoryModal}
            confirmLoading={isOkingOperaInventoryModal}
            onOk={this.handleOkOperaInventoryModal.bind(this)}
            onCancel={this.handleTriggerOperaInventoryModal.bind(this)}
          >
            <p style={{ textAlign: 'center' }}>请确认是否校正库存并生成盘盈亏单?</p>
          </Modal>
        </Card>
      </PageHeaderLayout>
    );
  }
}
