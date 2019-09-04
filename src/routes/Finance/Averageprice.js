import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Row, Table, Select, Input } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
// import styles from './GoodsManage.less';
import globalStyles from '../../assets/style/global.less';

const { Option } = Select;

@connect(state => ({
  averageprice: state.averageprice,
}))
export default class Averageprice extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'averageprice/mount',
    });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'averageprice/unmount',
    });
  }
  // 换页回调
  handleChangeCurPage(curPage) {
    const { dispatch } = this.props;
    dispatch({
      type: 'averageprice/getGoodsList',
      payload: {
        curPage,
      },
    });
  }
  // 切换每页条数回调
  handleChangePageSize(_, pageSize) {
    const { dispatch } = this.props;
    dispatch({
      type: 'averageprice/getGoodsList',
      payload: {
        pageSize,
        curPage: 1,
      },
    });
  }
  // change 商品类型
  handleChangeGoodsType(goodsType) {
    const { dispatch } = this.props;
    dispatch({
      type: 'averageprice/getGoodsList',
      payload: {
        goodsType,
        curPage: 1,
      },
    });
  }
  // change 商品状态
  handleChangeGoodsStatus(goodsStatus) {
    const { dispatch } = this.props;
    dispatch({
      type: 'averageprice/getGoodsList',
      payload: {
        goodsStatus,
        curPage: 1,
      },
    });
  }
  // change keywords
  handleChangeKeywords(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'averageprice/changeKeywords',
      payload: {
        keywords: e.target.value,
      },
    });
  }
  // 回车 keywords
  handleEnterKeywords() {
    const { dispatch } = this.props;
    dispatch({
      type: 'averageprice/getGoodsList',
      payload: {
        curPage: 1,
      },
    });
  }

  render() {
    const { averageprice: {
      keywords,
      goodsType,
      goodsStatus,
      total,
      curPage,
      pageSize,
      goodsList,

      goodsStatusMap,
      goodsTypeMap,

      isPageLoading,
      isGoodsListLoading,
    } } = this.props;
    const goodsListColumns = [
      {
        title: '商品图',
        dataIndex: 'goodsImg',
        key: 'goodsImg',
        render: (goodsImg, record) => {
          return (
            <div
              style={{
                position: 'relative',
                width: '50px',
              }}
            >
              <img style={{ width: 50 }} src={goodsImg}/>
              {
                record.isOut ?
                  <p style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 20, lineHeight: '20px', textAlign: 'center', backgroundColor: '#1E5C72', opacity: '.8', color: '#fff', marginBottom: 0 }}>已下架</p> :
                  null
              }
            </div>
          );
        },
      },
      {
        title: '商品名',
        dataIndex: 'goodsName',
        key: 'goodsName',
        width:300,
      },
      {
        title: '条码',
        dataIndex: 'goodsSn',
        key: 'goodsSn',
        width:150,
      },
      {
        title: '单位',
        dataIndex: 'goodsUnit',
        key: 'goodsUnit',
      },
      {
        title: '平台价',
        dataIndex: 'goodsPlatformPrice',
        key: 'goodsPlatformPrice',
      },
      {
        title: '市场价',
        dataIndex: 'goodsMarketPrice',
        key: 'goodsMarketPrice',
      },
      {
        title: '加权均价',
        dataIndex: 'goodsRealCostPrice',
        key: 'goodsRealCostPrice',
      },
      {
        title: '含税返利后进价',
        dataIndex: 'taxRebatePurchasePrice',
        key: 'taxRebatePurchasePrice',
      },
      {
        title: '未税返利后进价',
        dataIndex: 'rebatePurchasePrice',
        key: 'rebatePurchasePrice',
      },
      {
        title: '即时库存',
        dataIndex: 'goodsImStore',
        key: 'goodsImStore',
      },
      {
        title: '在途库存',
        dataIndex: 'goodsInWayStore',
        key: 'goodsInWayStore',
      },
      {
        title: '可用库存',
        dataIndex: 'goodsCanUseStore',
        key: 'goodsCanUseStore',
      },
      {
        title: '占用库存',
        dataIndex: 'goodsOccupyStore',
        key: 'goodsOccupyStore',
      },
    ];
    return (
      <PageHeaderLayout title="商品管理">
        <Card bordered={false} loading={isPageLoading}>
          <Row>
            <Input value={keywords} placeholder="请输入品牌名/商品名/条码" className={globalStyles['input-sift']} onChange={this.handleChangeKeywords.bind(this)} onPressEnter={this.handleEnterKeywords.bind(this)} />
            <Select className={globalStyles['select-sift']} value={goodsStatus.toString()} onChange={this.handleChangeGoodsStatus.bind(this)}>
              <Option value="-1">全部</Option>
              {
                Object.entries(goodsStatusMap).map(([goodsStatusId, goodsStatusValue]) => (
                  <Option value={goodsStatusId}>{goodsStatusValue}</Option>
                ))
              }
            </Select>
            <Select className={globalStyles['select-sift']} value={goodsType.toString()} onChange={this.handleChangeGoodsType.bind(this)}>
              <Option value="-1">全部</Option>
              {
                Object.entries(goodsTypeMap).map(([goodsTypeId, goodsTypeValue]) => (
                  <Option value={goodsTypeId}>{goodsTypeValue}</Option>
                ))
              }
            </Select>
          </Row>
          <Table
            loading={isGoodsListLoading}
            bordered
            dataSource={goodsList}
            rowKey={record => record.goodsId}
            columns={goodsListColumns}
            className={globalStyles.tablestyle}
            pagination={{
              current: curPage,
              pageSize,
              onChange: this.handleChangeCurPage.bind(this),
              onShowSizeChange: this.handleChangePageSize.bind(this),
              showSizeChanger: true,
              showQuickJumper: false,
              total,
              showTotal:total => `共 ${total} 个结果`,
            }}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
