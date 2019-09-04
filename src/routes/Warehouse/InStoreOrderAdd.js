import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Debounce from 'lodash-decorators/debounce';
import { Row, Col, Card, Input, Select, Modal, Table, Button, message } from 'antd';
import { Link } from 'dva/router';
// import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './InStoreOrderAdd.less';

const { Option } = Select;
const { Search } = Input;

@connect(state => ({
  inStoreOrderAdd: state.inStoreOrderAdd,
}))
export default class TableList extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'inStoreOrderAdd/getConfig',
    });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'inStoreOrderAdd/unmount',
    });
  }

  // 更所商品换页回调
  handleChangeMoreGoodsPage = (page) => {
    const { dispatch, inStoreOrderAdd } = this.props;
    const { moreGoodsKeywords } = inStoreOrderAdd;
    dispatch({
      type: 'inStoreOrderAdd/getGoodsPage',
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
      type: 'inStoreOrderAdd/changeGoods',
      payload: {
        goodsId: option.props.goodsId,
      },
    });
  }

  @Debounce(200)
  handleSearchGoods(value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'inStoreOrderAdd/searchGoods',
      payload: {
        value,
        curPage: this.props.inStoreOrderAdd.curPage,
      },
    });
  }

  // 修改商品的入库数量
  handleChangeInStoreNum(goodsId, e) {
    const number = e.target.value;
    const { dispatch } = this.props;
    const reg = new RegExp('^[0-9]*$');
    if (!reg.test(number)) {
      return;
    }
    dispatch({
      type: 'inStoreOrderAdd/changeInStoreNum',
      payload: {
        number,
        goodsId,
      },
    });
  }

  handleChangeGoodsRemark(goodsId, e) {
    const goodsRemark = e.target.value;
    const { dispatch } = this.props;
    dispatch({
      type: 'inStoreOrderAdd/changeGoodsRemark',
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
      type: 'inStoreOrderAdd/deleteGoods',
      payload: {
        goodsId,
      },
    });
  }

  // 查看更多商品
  handleMoreGoodsInfo() {
    const { dispatch } = this.props;
    dispatch({
      type: 'inStoreOrderAdd/showMoreGoods',
      payload: {
        curPage: 1,
      },
    });
  }

  handleClickOkMoreGoodsInfoButtonbind() {
    const { dispatch, inStoreOrderAdd } = this.props;
    const { goodsCheckboxIds } = inStoreOrderAdd;
    dispatch({
      type: 'inStoreOrderAdd/changeGoods',
      payload: {
        goodsId: goodsCheckboxIds,
      },
    });
  }

  // 取消更多商品弹窗
  handleClickCancelMoreGoodsInfoButton() {
    const { dispatch } = this.props;
    dispatch({
      type: 'inStoreOrderAdd/clickCancelMoreGoodsInfoButton',
    });
  }

  handleCheckGoods(goodsIds) {
    const { dispatch } = this.props;
    dispatch({
      type: 'inStoreOrderAdd/checkGoods',
      payload: {
        goodsCheckboxIds: goodsIds,
      },
    });
  }

  handleMoreSearchGoods(value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'inStoreOrderAdd/moreSearchGoods',
      payload: {
        curPage: this.props.inStoreOrderAdd.curPage,
        value,
      },
    });
  }

  // 入库类型选择
  handleChangeInStoreType(type,value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'inStoreOrderAdd/changeInStoreType',
      payload: {
        [type]: value,
      },
    });
  }

  handleChangeRemark(e) {
    const { value } = e.target;
    const { dispatch } = this.props;
    dispatch({
      type: 'inStoreOrderAdd/changeRemarkValue',
      payload: {
        remark: value,
      },
    });
  }

  handleClickSaveBtn() {
    const { dispatch, inStoreOrderAdd } = this.props;
    const { inStoreType, remark, goodsInfos, storageType } = inStoreOrderAdd;
    const goodsInfo = [];
    if (goodsInfos.length > 0) {
      for (let i = 0; i < goodsInfos.length; i += 1) {
        const { goodsId, inStoreNum, goodsRemark } = goodsInfos[i];
        if (+inStoreNum === 0) {
          message.error('有商品的数量为0,请修改后提交!', 0.5);
          return;
        }
        const obj = {
          id: goodsId,
          inStoreNum,
          remark: goodsRemark,
        };
        goodsInfo.push(obj);
      }
      dispatch({
        type: 'inStoreOrderAdd/clickSaveBtn',
        payload: {
          inStoreType,
          remark,
          goodsList: goodsInfo,
          storageType,
        },
      });
    } else {
      message.error('商品列表不能为空', 0.5);
    }
  }

  handleChangeMoreGoodsKeywords(e) {
    const { value } = e.target;
    const { dispatch } = this.props;
    dispatch({
      type: 'inStoreOrderAdd/changeMoreGoodsKeywords',
      payload: {
        moreGoodsKeywords: value,
      },
    });
  }

  render() {
    const {
      inStoreOrderAdd: {
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
        inStoreTypeMap,
        inStoreType,
        remark,
        storageTypeMap,
      },
    } = this.props;

      // table 的列头数据
    const columns = [
      {
        dataIndex: 'no',
        key: 'no',
        width: 80,
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
                    style={{ width: 200 }}
                    // value={searchGoodsValue}
                    onSelect={this.handleSelectGoods.bind(this)}
                    onSearch={this.handleSearchGoods.bind(this)}
                    defaultActiveFirstOption
                    showArrow={false}
                  >
                    {options}
                  </Select>
                  <Button type="primary" onClick={this.handleMoreGoodsInfo.bind(this)}>更多</Button>
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
        title: '入库数量',
        dataIndex: 'inStoreNum',
        key: 'inStoreNum',
        width: 90,
        render: (inStoreNum, record, index) => {
          if (record.no) {
            return record.inStoreNum;
          }
          if (record.isNotGoods) {
            return null;
          }
          return (
            <Input onChange={this.handleChangeInStoreNum.bind(this, record.goodsId)} value={inStoreNum} />
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
            <Input onChange={this.handleChangeGoodsRemark.bind(this, record.goodsId)} value={goodsRemark} />
          );
        },
      }];

    const goodsColumns = [
      {
        title: '主图',
        dataIndex: 'img',
        key: 'img',
        width: 60,
        render: (img, record) => {
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
      },
      // {
      //   title: '入库数量',
      //   dataIndex: 'inStoreNum',
      //   key: 'inStoreNum',
      //   width: 90,
      //   render: (inStoreNum, record) => {
      //     return (
      //       <Input onChange={event => this.handleChangeInStoreNum(event, record.goodsId, true)} value={inStoreNum} />
      //     );
      //   },
      // }
    ];

    return (
      <PageHeaderLayout title="新增入库单" className={styles.addPageHeader}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={12} sm={24} style={{ marginBottom: 24 }}>
                  <span>入库类型 : </span>
                  <Select
                    style={{ width: 180,marginRight:10 }}
                    value={inStoreTypeMap[inStoreType] || ''}
                    onChange={this.handleChangeInStoreType.bind(this,'inStoreType')}
                  >
                    {
                      (Object.entries(inStoreTypeMap).map((value) => {
                        return <Option key={value[0]}>{value[1]}</Option>;
                      }))
                    }
                  </Select>
                  <span>选择库位类型 : </span>
                  <Select
                    style={{ width: 180 }}
                    onChange={this.handleChangeInStoreType.bind(this,'storageType')}
                  >
                    {
                      (Object.keys(storageTypeMap).map((value) => {
                        return <Option key={value[0]}>{storageTypeMap[value]}</Option>;
                      }))
                    }
                  </Select>
                </Col>
              </Row>
            </div>

            <Table
              bordered
              rowKey={record => record.goodsId}
              dataSource={goodsInfos.concat([{ goodsId: goodsInfos.length * 10000000, id: '商品输入框', isNotGoods: true }])}
              columns={columns}
              pagination={false}
            />
            <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginTop: 50, height: 100 }}>
              <Row style={{ marginBottom: 14 }} type="flex" align="top">
                <span style={{ fontSize: '18px', color: '#AEAEAE', fontWeight: '500', marginRight: 20 }}>备注 : </span>
                <Input.TextArea
                  placeholder="此处添加备注信息"
                  style={{ width: 400 }}
                  value={remark || null}
                  onChange={this.handleChangeRemark.bind(this)}
                  rows={3}
                />
              </Row>
            </Row>
            <div className={styles.fixed}>
              <span className={styles.saveBtn} onClick={this.handleClickSaveBtn.bind(this)}>保存</span>
              <Link to="/warehouse/in-store-order-list" className={styles.cancelBtn}>取消</Link>
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
  }
}
