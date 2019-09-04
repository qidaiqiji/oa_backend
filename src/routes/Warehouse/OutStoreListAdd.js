import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import Debounce from 'lodash-decorators/debounce';
import { Row, Col, Card, Input, Select, Modal, Table, Button, Cascader, message, Tooltip } from 'antd';
import { Link } from 'dva/router';
// import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './OutStoreListAdd.less';

const { Option } = Select;
const { Search } = Input;

@connect(state => ({
  outStoreListAdd: state.outStoreListAdd,
  user: state.user,
}))
export default class TableList extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'outStoreListAdd/getConfig',
    });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'outStoreListAdd/unmount',
    });
  }

  // 更所商品换页回调
  handleChangeMoreGoodsPage = (page) => {
    const { dispatch, outStoreListAdd } = this.props;
    const { moreGoodsKeywords } = outStoreListAdd;
    dispatch({
      type: 'outStoreListAdd/getGoodsPage',
      payload: {
        curPage: page,
        value: moreGoodsKeywords,
      },
    });
  }

  // 选择商品
  handleSelectGoods(goodsId, option) {
    const { dispatch } = this.props;
    dispatch({
      type: 'outStoreListAdd/changeGoods',
      payload: {
        goodsId: option.props.goodsId,
      },
    });
  }

  @Debounce(200)
  handleSearchGoods(value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'outStoreListAdd/searchGoods',
      payload: {
        value,
        curPage: this.props.outStoreListAdd.curPage,
      },
    });
  }

  // 修改商品的出库数量
  handleChangeOutStoreNum(e, goodsId, canUseNum, isMoreGoods) {
    let number = e.target.value;
    const { dispatch } = this.props;
    const reg = new RegExp('^[0-9]*$');
    if (!reg.test(number)) {
      return;
    }
    if (number > canUseNum) {
      message.error('销售数不可超过最大可用数, 已自动帮您设置为最大可用数!', 0.5);
      number = canUseNum;
    }
    dispatch({
      type: 'outStoreListAdd/changeOutStoreNum',
      payload: {
        number,
        goodsId,
        isMoreGoods,
      },
    });
  }

  handleChangeGoodsRemark(e, goodsId) {
    const goodsRemark = e.target.value;
    const { dispatch } = this.props;
    dispatch({
      type: 'outStoreListAdd/changeGoodsRemark',
      payload: {
        goodsRemark,
        goodsId,
      },
    });
  }

  // 删除列表中的商品
  handleDeleteGoods(goodsId) {
    const { dispatch } = this.props;
    dispatch({
      type: 'outStoreListAdd/deleteGoods',
      payload: {
        goodsId,
      },
    });
  }

  // 查看更多商品
  handleMoreGoodsInfo() {
    const { dispatch } = this.props;
    dispatch({
      type: 'outStoreListAdd/showMoreGoods',
      payload: {
        curPage: 1,
      },
    });
  }

  handleClickOkMoreGoodsInfoButtonbind() {
    const { dispatch, outStoreListAdd } = this.props;
    const { goodsCheckboxIds } = outStoreListAdd;
    dispatch({
      type: 'outStoreListAdd/changeGoods',
      payload: {
        goodsId: goodsCheckboxIds,
      },
    });
  }

  // 取消更多商品弹窗
  handleClickCancelMoreGoodsInfoButton() {
    const { dispatch } = this.props;
    dispatch({
      type: 'outStoreListAdd/clickCancelMoreGoodsInfoButton',
    });
  }

  handleCheckGoods(goodsIds) {
    const { dispatch } = this.props;
    dispatch({
      type: 'outStoreListAdd/checkGoods',
      payload: {
        goodsCheckboxIds: goodsIds,
      },
    });
  }

  handleMoreSearchGoods(value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'outStoreListAdd/moreSearchGoods',
      payload: {
        curPage: this.props.outStoreListAdd.curPage,
        value,
      },
    });
  }

  // 出库类型选择
  handleChangeOutStoreType(value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'outStoreListAdd/changeOutStoreType',
      payload: {
        outStoreType: value,
      },
    });
  }

  handleChangeReceivingConsignee(e) {
    const { value } = e.target;
    const { dispatch } = this.props;
    dispatch({
      type: 'outStoreListAdd/changeReceivingReceiptValue',
      payload: {
        consignee: value,
      },
    });
  }

  handleChangeReceivingPhoneNumber(e) {
    const { value } = e.target;
    const { dispatch } = this.props;
    dispatch({
      type: 'outStoreListAdd/changeReceivingReceiptValue',
      payload: {
        mobile: value,
      },
    });
  }

  handleChangeReceivingAddressValue(value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'outStoreListAdd/changeReceivingReceiptValue',
      payload: {
        address: value,
      },
    });
  }

  handleChangeReceivingAddressDetail(e) {
    const { value } = e.target;
    const { dispatch } = this.props;
    dispatch({
      type: 'outStoreListAdd/changeReceivingReceiptValue',
      payload: {
        addressDetail: value,
      },
    });
  }

  handleChangeRemark(e) {
    const { value } = e.target;
    const { dispatch } = this.props;
    dispatch({
      type: 'outStoreListAdd/changeReceivingReceiptValue',
      payload: {
        remark: value,
      },
    });
  }

  handleClickSaveBtn() {
    const { dispatch, outStoreListAdd } = this.props;
    const { outStoreType, consignee, mobile, address, addressDetail, remark, goodsInfos } = outStoreListAdd;
    const goodsInfo = [];
    if (goodsInfos.length > 0) {
      if (!outStoreType) {
        message.error('出库类型不能为空,请修改后提交!', 1);
        return;
      }
      for (let i = 0; i < goodsInfos.length; i += 1) {
        const { goodsId, outStoreNum, goodsRemark } = goodsInfos[i];
        if (+outStoreNum === 0) {
          message.error('有商品的数量为0,请修改后提交!', 1);
          return;
        }
        const obj = {
          id: goodsId,
          outStoreNum,
          remark: goodsRemark,
        };
        goodsInfo.push(obj);
      }
      dispatch({
        type: 'outStoreListAdd/clickSaveBtn',
        payload: {
          outStoreType,
          remark,
          consignee,
          mobile,
          address,
          addressDetail,
          goodsList: goodsInfo,
        },
      });
    } else {
      message.error('商品列表不能为空', 1);
    }
  }

  handleChangeMoreGoodsKeywords(e) {
    const { value } = e.target;
    const { dispatch } = this.props;
    dispatch({
      type: 'outStoreListAdd/changeMoreGoodsKeywords',
      payload: {
        moreGoodsKeywords: value,
      },
    });
  }

  render() {
    const {
      outStoreListAdd: {
        addressOptions,
        siftGoods,
        goodsInfos,
        curPage,
        moreGoodsKeywords,
        isShowMoreGoodsConfirm,
        isGoodsLoading,
        isMoreGoodsLoading,
        size,
        total,
        goodsCheckboxIds,
        outStoreTypeMap,
        outStoreType,
        consignee,
        mobile,
        addressDetail,
        remark,
      },
    } = this.props;

      // table 的列头数据
    const columns = [
      {
        dataIndex: 'no',
        key: 'no',
        width: 60,
        render: (no, record, index) => (
          <span>{ no || index + 1}</span>
        ),
      }, {
        // title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: 50,
        render: (op, record) => {
          if (record.no) {
            return null;
          }
          return (
            <div>
              {!record.isNotGoods && <Button icon="minus" onClick={() => { this.handleDeleteGoods(record.goodsId); }} />}
            </div>);
        },
      }, {
        title: '主图',
        dataIndex: 'img',
        key: 'img',
        width: 60,
        render: (img, record) => {
          if (record.isNotGoods) {
            return null;
          }
          return <img className={styles.goodsImg} src={img}/>;
        },
      }, {
        title: '商品名称',
        dataIndex: 'goodsName',
        key: 'goodsName',
        width: 300,
        render: (goodsName, record) => {
          if (record.no) {
            return null;
          }
          if (record.isNotGoods) {
            const options = siftGoods.slice(0, 49).map((oneSiftGoods) => {
              return <Option goodsId={oneSiftGoods.goodsId} disabled={goodsInfos.some((goodsInfo) => { return goodsInfo.goodsId === oneSiftGoods.goodsId; })} value={oneSiftGoods.goodsName + oneSiftGoods.goodsNo}>{oneSiftGoods.goodsName}</Option>;
            });
            if (options.length === 0) options.push(<Option disabled key="no fount">没发现匹配项</Option>);

            return {
              children: (
                <div>
                  <Select
                    mode="combobox"
                    placeholder="请输入商品编码/商品名称"
                    filterOption={false}
                    style={{ width: '85%' }}
                    // value={searchGoodsValue}
                    onSelect={this.handleSelectGoods.bind(this)}
                    onSearch={this.handleSearchGoods.bind(this)}
                    defaultActiveFirstOption
                    showArrow={false}
                  >
                    {options}
                  </Select>
                  <Button type="primary" style={{ width: '15%' }} onClick={() => { this.handleMoreGoodsInfo(); }}>更多</Button>
                </div>
              ),
              props: {
                colSpan: 1,
              },
            };
          } else {
            return {
              children: <span>{goodsName}</span>,
              props: {
                colSpan: 1,
              },
            };
          }
        },
      }, {
        title: '商品编码',
        dataIndex: 'goodsNo',
        key: 'goodsNo',
        width: 150,
        render: (goodsNo, record) => {
          if (record.no) {
            return null;
          }
          if (record.isNotGoods) {
            return null;
          } else {
            return {
              children: <span>{goodsNo}</span>,
              props: {
                colSpan: 1,
              },
            };
          }
        },
      }, {
        title: '单位',
        dataIndex: 'unit',
        key: 'unit',
        width: 50,
        render: (unit, record) => {
          if (record.isNotGoods) {
            return null;
          }
          return <span>{unit}</span>;
        },
      }, {
        title: '出库数量',
        dataIndex: 'outStoreNum',
        key: 'outStoreNum',
        width: 90,
        render: (outStoreNum, record) => {
          if (record.no) {
            return record.outStoreNum;
          }
          if (record.isNotGoods) {
            return null;
          }
          return (
            <Tooltip
              title={
                <div>
                  <p>可用量: {record.canUseNum}</p>
                </div>
              }
            >
              <Input onChange={event => this.handleChangeOutStoreNum(event, record.goodsId, record.canUseNum)} value={outStoreNum} />
            </Tooltip>
          );
        },
      }, {
        title: '备注',
        dataIndex: 'goodsRemark',
        key: 'goodsRemark',
        width: 200,
        render: (goodsRemark, record) => {
          if (record.no) {
            return record.goodsRemark;
          }
          if (record.isNotGoods) {
            return null;
          }
          return (
            <Input onChange={event => this.handleChangeGoodsRemark(event, record.goodsId, false)} value={goodsRemark} />
          );
        },
      }];

    const goodsColumns = [
      {
        title: '主图',
        dataIndex: 'img',
        key: 'img',
        width: 60,
        render: (img) => {
          return <img className={styles.goodsImg} src={img}/>;
        },
      }, {
        title: '商品名称',
        dataIndex: 'goodsName',
        key: 'goodsName',
      }, {
        title: '商品条码',
        dataIndex: 'goodsNo',
        key: 'goodsNo',
      }, {
        title: '单价',
        dataIndex: 'salePrice',
        key: 'salePrice',
      }, {
        title: '单位',
        dataIndex: 'unit',
        key: 'unit',
      }];

    return (
      (() => {
        return (
          <PageHeaderLayout title="新增出库单" className={styles.addPageHeader}>
            <Card bordered={false}>
              <div className={styles.tableList}>
                <div className={styles.tableListForm}>
                  <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={12} sm={24} style={{ marginBottom: 24 }}>
                      <span>出库类型 : </span>
                      <Select
                        style={{ width: 180 }}
                        placeholder="请选择出库类型"
                        // value={outStoreTypeMap[outStoreType] || null}
                        onChange={this.handleChangeOutStoreType.bind(this)}
                      >
                        {
                          (Object.entries(outStoreTypeMap).map((value) => {
                            return <Option key={value[0]}>{value[1]}</Option>;
                          }))
                        }
                      </Select>
                    </Col>
                  </Row>
                </div>

                <Table
                  // loading={isLoading}
                  bordered
                  rowKey={record => record.goodsId}
                  dataSource={goodsInfos.concat([{ goodsId: goodsInfos.length * 10000000, id: '商品输入框', isNotGoods: true }])}
                  columns={columns}
                  pagination={false}
                />
                <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginTop: 60, marginBottom: 25 }}>
                  <Col md={12} style={{ height: 26, lineHeight: '26px' }}>
                    <span style={{ fontSize: '18px', color: '#0099FF', fontFamily: 'Arial Negreta', fontWeight: '700' }}>收货信息 </span>
                  </Col>
                </Row>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={24}>
                    <Row style={{ marginBottom: 14 }}>
                      <Col md={8} style={{ height: 22, lineHeight: '22px' }}>
                        <span style={{ fontSize: '18px', color: '#AEAEAE', fontFamily: 'Arial Negreta', fontWeight: '500' }}>收货人 : </span>
                        <span style={{ color: '#d7d7d7', marginLeft: '8px' }}>
                          <Input
                            size="small"
                            style={{ width: 200 }}
                            value={consignee}
                            onChange={this.handleChangeReceivingConsignee.bind(this)}
                          />
                        </span>
                      </Col>
                      <Col md={8} style={{ height: 22, lineHeight: '22px' }}>
                        <span style={{ fontSize: '18px', color: '#AEAEAE', fontFamily: 'Arial Negreta', fontWeight: '500' }}>手机号 : </span>
                        <span style={{ color: '#d7d7d7', marginLeft: '8px' }}>
                          <Input
                            size="small"
                            style={{ width: 200 }}
                            value={mobile}
                            onChange={this.handleChangeReceivingPhoneNumber.bind(this)}
                          />
                        </span>
                      </Col>
                    </Row>
                    <Row style={{ marginBottom: 14 }}>
                      <Col md={16} style={{ height: 22, lineHeight: '22px' }}>
                        <span style={{ fontSize: '18px', color: '#AEAEAE', fontFamily: 'Arial Negreta', fontWeight: '500' }}>收货地址 : </span>
                        <span style={{ color: '#d7d7d7', marginLeft: '8px' }}>
                          <Cascader
                            options={addressOptions}
                            size="small"
                            style={{ width: 400 }}
                            placeholder="请选择省份/城市/地区"
                            onChange={this.handleChangeReceivingAddressValue.bind(this)}
                          />
                        </span>
                      </Col>
                    </Row>
                    <Row style={{ marginBottom: 24 }}>
                      <Col md={8} style={{ height: 22, lineHeight: '22px' }}>
                        <span style={{ color: '#d7d7d7', marginLeft: '8px' }}>
                          <Input.TextArea
                            placeholder="请输入详细收货地址"
                            style={{ width: 400, marginLeft: 88 }}
                            value={addressDetail || null}
                            onChange={this.handleChangeReceivingAddressDetail.bind(this)}
                            autosize
                          />
                        </span>
                      </Col>
                    </Row>
                    <Row style={{ marginBottom: 14 }}>
                      <Col md={8} style={{ height: 22, lineHeight: '22px' }}>
                        <span style={{ fontSize: '18px', color: '#AEAEAE', fontFamily: 'Arial Negreta', fontWeight: '500' }}>备注 : </span>
                        <span style={{ color: '#d7d7d7', marginLeft: '8px' }}>
                          <Input.TextArea
                            placeholder="此处添加备注信息"
                            style={{ width: 400, marginLeft: 37 }}
                            value={remark || null}
                            onChange={this.handleChangeRemark.bind(this)}
                            autosize
                          />
                        </span>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <div className={styles.fixed}>
                  <span className={styles.saveBtn} onClick={this.handleClickSaveBtn.bind(this)}>提交审核</span>
                  <Link to="/sale/await-push-list" className={styles.cancelBtn}>取消</Link>
                </div>
              </div>
              <Modal
                // title="选择商品"
                width={1200}
                visible={isShowMoreGoodsConfirm}
                onOk={this.handleClickOkMoreGoodsInfoButtonbind.bind(this)}
                confirmLoading={isMoreGoodsLoading}
                onCancel={this.handleClickCancelMoreGoodsInfoButton.bind(this)}
              >
                <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginTop: 10, marginBottom: 25 }}>
                  <Col md={12} style={{ height: 26, lineHeight: '26px' }}>
                    <span style={{ fontSize: '18px', color: '#AEAEAE', fontFamily: 'Arial Negreta', fontWeight: '700' }}>选择商品 </span>
                    <span>
                      <Search
                        size="small"
                        style={{ width: 320, marginLeft: 20 }}
                        value={moreGoodsKeywords}
                        enterButton="搜索"
                        placeholder="请输入商品名称/编码/进行搜索"
                        onChange={event => this.handleChangeMoreGoodsKeywords(event)}
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
                      disabled: goodsInfos.some((goodsInfo) => {
                        return record.goodsId === goodsInfo.goodsId;
                      }),
                    }),
                  }}
                  dataSource={siftGoods}
                  columns={goodsColumns}
                  pagination={{
                    current: curPage,
                    pageSize: size,
                    onChange: this.handleChangeMoreGoodsPage,
                    onShowSizeChange: this.handleChangePageSize,
                    showSizeChanger: false,
                    showQuickJumper: false,
                    total,
                    showTotal:total => `共 ${total} 个结果`,
                  }}
                />
              </Modal>
            </Card>
          </PageHeaderLayout>
        );
        // }
      })()
    );
  }
}
