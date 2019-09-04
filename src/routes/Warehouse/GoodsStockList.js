import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Row, Input, Table, Button } from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './GoodsStockList.less';

const { Search } = Input;

@connect(state => ({
  goodsStockList: state.goodsStockList,
}))
export default class goodsStockList extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'goodsStockList/getList',
    });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'goodsStockList/unmount',
    });
  }
  handleSiftGoodsList() {
    const { dispatch } = this.props;
    dispatch({
      type: 'goodsStockList/getList',
      payload: {
        curPage: 1,
      },
    });
  }
  handleChangeKeywords(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'goodsStockList/changeKeywords',
      payload: {
        keywords: e.target.value,
      },
    });
  }
  handleChangePage(curPage) {
    const { dispatch } = this.props;
    dispatch({
      type: 'goodsStockList/getList',
      payload: {
        curPage,
      },
    });
  }
  handleChangePageSize(curPage, pageSize) {
    const { dispatch } = this.props;
    dispatch({
      type: 'goodsStockList/getList',
      payload: {
        curPage: 1,
        pageSize,
      },
    });
  }
  render() {
    const {
      goodsStockList: {
        total,
        curPage,
        pageSize,
        keywords,
        // isZhifa,
        isLoading,
        goods,
      },
    } = this.props;
    const goodsColumns = [
      {
        title: '商品图片',
        dataIndex: 'img',
        key: 'img',
        render: (imgSrc, record) => {
          return <img src={imgSrc} style={{ width: 55, height: 55 }} />;
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
        dataIndex: 'imNum',
        key: 'imNum',
      },
      {
        title: '可用库存',
        dataIndex: 'canUseNum',
        key: 'canUseNum',
      },
      {
        title: '残损库存',
        dataIndex: 'brokenNum',
        key: 'brokenNum',
      },
      {
        title: '总占用库存',
        dataIndex: 'totalOccupyNum',
        key: 'totalOccupyNum',
      },
    ];
    return (
      <PageHeaderLayout title="商品库存">
        <Card bordered={false}>
          <Row
            style={{
              height: 50,
            }}
          >
            <Search
              style={{
                width: 250,
              }}
              value={keywords}
              placeholder="请输入品牌名称/商品名称/条码"
              onChange={this.handleChangeKeywords.bind(this)}
              onSearch={this.handleSiftGoodsList.bind(this)}
            />
          </Row>
          <Table
            bordered
            title={() => {
              return (
                <Row>
                  <a href="http://erp.xiaomei360.com/common/export-goods-depot" target="_blank" rel="noopener noreferrer">
                    <Button type="primary">导出盘点单</Button>
                  </a>
                  <Link to="/warehouse/goods-stock-list/import-inventory-list">
                    <Button style={{ marginLeft: 10 }} type="primary">修改盘点单</Button>
                  </Link>
                </Row>
              );
            }}
            loading={isLoading}
            rowKey={record => record.goodsId}
            columns={goodsColumns}
            pagination={{
              current: curPage,
              pageSize,
              total,
              showSizeChanger: true,
              onChange: this.handleChangePage.bind(this),
              onShowSizeChange: this.handleChangePageSize.bind(this),
              showTotal:total => `共 ${total} 个结果`,
            }}
            dataSource={goods}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
