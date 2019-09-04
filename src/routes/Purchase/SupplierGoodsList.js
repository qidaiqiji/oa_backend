import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Debounce from 'lodash-decorators/debounce';
import {
  Row,
  Col,
  Form,
  Card,
  Table,
  AutoComplete,
  Input,
  Modal,
  Icon,
  Select,
  notification,
  InputNumber,
} from 'antd';
import { stringify } from 'qs';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './SupplierGoodsList.less';

const { Search } = Input;

@connect(state => ({
  supplierGoodsList: state.supplierGoodsList,
  user: state.user,
}))
@Form.create()
export default class Tablist extends PureComponent {
  componentDidMount() {
    const { dispatch, supplierGoodsList } = this.props;
    const { curPage } = supplierGoodsList;
    const { id } = this.props.match.params;
    dispatch({
      type: 'supplierGoodsList/getSupplyGoodsList',
      payload: {
        id,
        keywords: '',
        goodsId: '',
        curPage,
      },
    });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierGoodsList/unmount',
    });
  }
  // 更新商品换页回调
  handleChangeSupplyGoodsPage = (page) => {
    const { dispatch, supplierGoodsList } = this.props;
    const { supplyKeywords, supplierId } = supplierGoodsList;
    dispatch({
      type: 'supplierGoodsList/getSupplyGoodsList',
      payload: {
        curPage: page,
        id: supplierId,
        keywords: supplyKeywords,
        goodsId: '',
      },
    });
  };
  // 更新弹窗商品换页回调
  handleChangeMoreGoodsPage = (page) => {
    const { dispatch, supplierGoodsList } = this.props;
    const { keywords } = supplierGoodsList;
    dispatch({
      type: 'supplierGoodsList/moreSearchGoods',
      payload: {
        currentPage: page,
        keywords,
      },
    });
  };
  // 改变输入框值拉取供应商品列表
  @Debounce(200)
  handleSearchSupplyGoods(value) {
    const { dispatch, supplierGoodsList } = this.props;
    const { supplierId, curPage } = supplierGoodsList;
    dispatch({
      type: 'supplierGoodsList/getSiftSupplyGoodsList',
      payload: {
        id: supplierId,
        keywords: value,
        goodsId: '',
        curPage,
      },
    });
  }
  handleSelectSupplyGoods(value, option) {
    const { dispatch, supplierGoodsList } = this.props;
    const { supplierId } = supplierGoodsList;
    dispatch({
      type: 'supplierGoodsList/getSupplyGoodsList',
      payload: {
        id: supplierId,
        keywords: '',
        goodsId: value,
        curPage: 1,
      },
    });
  }
  handleEnterSupplyGoods(e) {
    const { value } = e.target;
    const { dispatch, supplierGoodsList } = this.props;
    const { supplierId, curPage } = supplierGoodsList;
    dispatch({
      type: 'supplierGoodsList/getSupplyGoodsList',
      payload: {
        id: supplierId,
        keywords: value,
        goodsId: '',
        curPage,
      },
    });
  }

  handleUpdateSupplyGoods(e, record) {
    const { dispatch, supplierGoodsList } = this.props;
    const { supplierId } = supplierGoodsList;
    const goodsInfos = [];
    let obj = {};
    obj = {
      goodsId: record.id,
      supplyPrice: record.supplyPrice,
      purchaseTaxPrice: record.purchaseTaxPrice,
      goodsRemark: record.remark,
    };
    goodsInfos.push(obj);
    dispatch({
      type: 'supplierGoodsList/updateSupplyGoods',
      payload: {
        id: supplierId,
        goodsInfos,
      },
    });
  }
  handleChangeTaxPrice(goodsId, number) {
    // const number = e.target.value;
    const { dispatch } = this.props;
    // const reg = new RegExp('^[0-9]*$');
    // if (!reg.test(number)) {
    //   return;
    // }
    dispatch({
      type: 'supplierGoodsList/changeTaxPrice',
      payload: {
        number,
        goodsId,
      },
    });
  }
  handleChangeSupplyPrice(goodsId, number) {
    // const number = e.target.value;
    const { dispatch } = this.props;
    // const reg = new RegExp('^[0-9]*$');
    // if (!reg.test(number)) {
    //   return;
    // }
    dispatch({
      type: 'supplierGoodsList/changeSupplyPrice',
      payload: {
        number,
        goodsId,
      },
    });
  }
  handleChangeMoreGoodsSupplyPrice(e, goodsId) {
    const number = e.target.value;
    const { dispatch } = this.props;
    // const reg = new RegExp('^[0-9]*$');
    // if (!reg.test(number)) {
    //   return;
    // }
    dispatch({
      type: 'supplierGoodsList/changeMoreGoodsSupplyPrice',
      payload: {
        number,
        goodsId,
      },
    });
  }
  handleChangeSupplyRemark(e, goodsId) {
    const remark = e.target.value;
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierGoodsList/changeSupplyRemark',
      payload: {
        remark,
        goodsId,
      },
    });
  }
  handleCheckSupplyGoods(goodsIds) {
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierGoodsList/changeSupplyGoodsCheckboxIds',
      payload: {
        supplyGoodsCheckboxIds: goodsIds,
      },
    });
  }
  handleCheckGoods(goodsIds) {
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierGoodsList/changeGoodsCheckboxIds',
      payload: {
        goodsCheckboxIds: goodsIds,
      },
    });
  }
  handleDeleteSupplyGoods() {
    const { dispatch, supplierGoodsList } = this.props;
    const {
      supplyGoodsCheckboxIds,
      supplierId,
      supplyKeywords,
      supplyGoodsId,
      curPage,
    } = supplierGoodsList;
    dispatch({
      type: 'supplierGoodsList/deleteSupplyGoods',
      payload: {
        id: supplierId,
        curPage,
        goodsId: supplyGoodsCheckboxIds,
        keywords: supplyKeywords,
        supplyGoodsId,
      },
    });
  }
  handleOkExportList() {
    const { dispatch, supplierGoodsList } = this.props;
    const { supplierId } = supplierGoodsList;
    dispatch({
      type: 'supplierGoodsList/exportSupplyList',
      payload: {
        id: supplierId,
      },
    });
  }
  // 取消更多商品弹窗
  handleClickCancelMoreGoodsInfoButton() {
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierGoodsList/clickCancelMoreGoodsInfoButton',
    });
  }
  // 打开选择商品弹窗
  handleOpenGoodsInfo() {
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierGoodsList/showMoreGoods',
      payload: {
        currentPage: 1,
      },
    });
  }
  handleMoreSearchGoods(value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierGoodsList/moreSearchGoods',
      payload: {
        currentPage: 1,
        keywords: value,
      },
    });
  }
  handleClickOkMoreGoodsInfoButtonbind() {
    const { dispatch, supplierGoodsList } = this.props;
    const { goodsCheckboxIds, supplierId } = supplierGoodsList;
    if (goodsCheckboxIds.length === 0) {
      notification.warning({
        message: '警告提示',
        description: '请先选择商品再进行添加',
      });
      return;
    }
    dispatch({
      type: 'supplierGoodsList/changeGoods',
      payload: {
        id: supplierId,
        goodsIds: goodsCheckboxIds,
      },
    });
  }

  render() {
    const {
      supplierGoodsList: {
        supplierId,
        currentPage,
        keywords,
        supplyKeywords,
        supplyGoodsId,
        total,
        goodsTotal,
        siftSupplyGoodsList,
        supplyGoodsList,
        initSupplyGoodsList,
        curPage,
        size,
        supplyGoodsCheckboxIds,
        goodsCheckboxIds,
        siftGoods,
        isLoading,
        isShowMoreGoodsConfirm,
        isGoodsLoading,
        isMoreGoodsLoading,
      },
    } = this.props;

    const renderOption = (item) => {
      return (
        <Select.Option key={item.id} value={item.id.toString()}>
          {item.goodsName}
        </Select.Option>
      );
    };

    const goodsColumns = [
      {
        title: '商品图片',
        dataIndex: 'img',
        key: 'img',
        render: (img) => {
          return <img className={styles.goodsImg} src={img}/>;
        },
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
        title: '零售价',
        dataIndex: 'marketPrice',
        key: 'marketPrice',
      },
      {
        title: '平台售价',
        dataIndex: 'shopPrice',
        key: 'shopPrice',
      },
      // {
      //   title: '供应价',
      //   dataIndex: 'supplyPrice',
      //   key: 'supplyPrice',
      //   render: (supplyPrice, record) => {
      //     return (
      //       <Input
      //         value={supplyPrice}
      //         onChange={event =>
      //           this.handleChangeMoreGoodsSupplyPrice(event, record.goodsId)
      //         }
      //       />
      //     );
      //   },
      // },
      {
        title: '单位',
        dataIndex: 'unit',
        key: 'unit',
      },
    ];

    const columns = [
      {
        title: '商品图片',
        dataIndex: 'img',
        key: 'img',
        render: (img) => {
          return <img className={styles.goodsImg} src={img}/>;
        },
      },
      {
        title: '商品名称',
        dataIndex: 'goodsName',
        key: 'goodsName',
      },
      {
        title: '条码',
        dataIndex: 'no',
        key: 'no',
      },
      {
        title: '零售价',
        dataIndex: 'marketPrice',
        key: 'marketPrice',
      },
      {
        title: '平台售价',
        dataIndex: 'shopPrice',
        key: 'shopPrice',
      },
      // {
      //   title: '采购折扣',
      //   dataIndex: 'purchaseDiscount',
      //   key: 'purchaseDiscount',
      // },
      // {
      //   title: '采购折扣(含税)',
      //   dataIndex: 'purchaseTaxDiscount',
      //   key: 'purchaseTaxDiscount',
      // },
      {
        title: '非税采购价',
        dataIndex: 'supplyPrice',
        key: 'supplyPrice',
        render: (supplyPrice, record) => {
          return (
            <InputNumber
              value={supplyPrice}
              precision={2}
              onBlur={event => this.handleUpdateSupplyGoods(event, record)}
              onChange={this.handleChangeSupplyPrice.bind(this, record.id)}
            />
          );
        },
      },
      {
        title: '含税采购价',
        dataIndex: 'purchaseTaxPrice',
        key: 'purchaseTaxPrice',
        render: (purchaseTaxPrice, record) => {
          return (
            <InputNumber
              value={purchaseTaxPrice}
              precision={2}
              onBlur={event => this.handleUpdateSupplyGoods(event, record)}
              onChange={this.handleChangeTaxPrice.bind(this, record.id)}
            />
          );
        },
      },
      {
        title: '单位',
        dataIndex: 'unit',
        key: 'unit',
      },
      {
        title: '库存',
        dataIndex: 'inStock',
        key: 'inStock',
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        render: (remark, record) => {
          return (
            <Input
              value={remark}
              onBlur={event => this.handleUpdateSupplyGoods(event, record)}
              onChange={event =>
                this.handleChangeSupplyRemark(event, record.id)
              }
            />
          );
        },
      },
    ];

    return (
      <PageHeaderLayout title="供应商品列表" className={styles.addPageHeader}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={12} sm={24} style={{ marginBottom: 24 }}>
                  <Col md={12} sm={24}>
                    <div style={{ width: 300 }}>
                      <AutoComplete
                        size="large"
                        style={{ width: '100%' }}
                        dataSource={siftSupplyGoodsList.map(renderOption)}
                        onSelect={this.handleSelectSupplyGoods.bind(this)}
                        onSearch={this.handleSearchSupplyGoods.bind(this)}
                        placeholder="请输入商品名称/条码"
                        optionLabelProp="text"
                        defaultActiveFirstOption={false}
                      >
                        <Input
                          onPressEnter={this.handleEnterSupplyGoods.bind(
                            this
                          )}
                          suffix={<Icon type="search" />}
                        />
                      </AutoComplete>
                    </div>
                  </Col>
                </Col>
                <Col md={12} sm={24} style={{ marginBottom: 24 }}>
                  <div
                    style={{
                      width: 182,
                      display: 'inline-block',
                      right: '20px',
                      position: 'absolute',
                    }}
                  >
                    <a href={`http://erp.xiaomei360.com/common/export-supplier-goods-list?${stringify({ id: supplierId })}`}><span className={styles.exportBtn}>导出</span></a>
                    <span
                      className={styles.addBtn}
                      onClick={() => {
                        this.handleOpenGoodsInfo();
                      }}
                    >
                      新增
                    </span>
                  </div>
                </Col>
              </Row>
              <Row
                gutter={{ md: 8, lg: 24, xl: 48 }}
                style={{
                  display:
                    supplyGoodsCheckboxIds.length > 0 ? 'block' : 'none',
                }}
              >
                <Col md={12} sm={24} style={{ marginBottom: 24 }}>
                  <Col md={6} sm={24}>
                    <Icon
                      type="close"
                      style={{
                        fontSize: 16,
                        color: '#C9C9C9',
                        marginRight: '10px',
                      }}
                    />
                    已选择<span>{supplyGoodsCheckboxIds.length}</span>项
                  </Col>
                  <Col md={6} sm={24}>
                    <Icon
                      type="minus-circle"
                      style={{
                        fontSize: 16,
                        color: '#08c',
                        marginRight: '10px',
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        this.handleDeleteSupplyGoods();
                      }}
                    />
                    删除关联选中的商品
                  </Col>
                </Col>
              </Row>
            </div>

            <Table
              bordered
              loading={isLoading}
              rowKey={record => record.id}
              rowSelection={{
                selectedRowKeys: supplyGoodsCheckboxIds,
                onChange: this.handleCheckSupplyGoods.bind(this),
              }}
              dataSource={supplyGoodsList}
              columns={columns}
              pagination={false}
              // pagination={{
              //   current: curPage,
              //   pageSize: size,
              //   onChange: this.handleChangeSupplyGoodsPage,
              //   showSizeChanger: false,
              //   showQuickJumper: false,
              //   total,
              // }}
            />
          </div>
          <Modal
            // title="选择商品"
            width={1200}
            visible={isShowMoreGoodsConfirm}
            onOk={this.handleClickOkMoreGoodsInfoButtonbind.bind(this)}
            confirmLoading={isMoreGoodsLoading}
            onCancel={this.handleClickCancelMoreGoodsInfoButton.bind(this)}
          >
            <Row
              gutter={{ md: 8, lg: 24, xl: 48 }}
              style={{ marginTop: 10, marginBottom: 25 }}
            >
              <Col md={12} style={{ height: 26, lineHeight: '26px' }}>
                <span
                  style={{
                    fontSize: '18px',
                    color: '#AEAEAE',
                    fontFamily: 'Arial Negreta',
                    fontWeight: '700',
                  }}
                >
                  选择商品
                </span>
                <span>
                  <Search
                    size="small"
                    style={{ width: 320, marginLeft: 20 }}
                    // // value={specialPrice}
                    enterButton="搜索"
                    placeholder="请输入商品名称/编码/进行搜索"
                    onSearch={this.handleMoreSearchGoods.bind(this)}
                  />
                </span>
              </Col>
            </Row>
            <Table
              bordered
              loading={isGoodsLoading}
              rowKey={record => record.goodsId}
              rowSelection={{
                selectedRowKeys: goodsCheckboxIds,
                onChange: this.handleCheckGoods.bind(this),
                getCheckboxProps: record => ({
                  disabled: initSupplyGoodsList.some((goodsInfo) => {
                    return +record.goodsId === +goodsInfo.goodsId;
                  }),
                }),
              }}
              dataSource={siftGoods}
              columns={goodsColumns}
              pagination={{
                current: currentPage,
                pageSize: size,
                onChange: this.handleChangeMoreGoodsPage,
                showSizeChanger: false,
                showQuickJumper: false,
                total: goodsTotal,
              }}
            />
          </Modal>
        </Card>
      </PageHeaderLayout>
    );
  }
}
