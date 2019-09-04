import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Row, Table, Select, Input } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './GoodsManage.less';
import globalStyles from '../../assets/style/global.less';

const { Option } = Select;

@connect(state => ({
  goodsManage: state.goodsManage,
}))
export default class GoodsManage extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'goodsManage/mount',
    });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'goodsManage/unmount',
    });
  }
  // 换页回调
  handleChangeCurPage(curPage) {
    const { dispatch } = this.props;
    dispatch({
      type: 'goodsManage/getGoodsList',
      payload: {
        curPage,
      },
    });
  }
  // 切换每页条数回调
  handleChangePageSize(_, pageSize) {
    const { dispatch } = this.props;
    dispatch({
      type: 'goodsManage/getGoodsList',
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
      type: 'goodsManage/getGoodsList',
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
      type: 'goodsManage/getGoodsList',
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
      type: 'goodsManage/changeKeywords',
      payload: {
        keywords: e.target.value,
      },
    });
  }
  // 回车 keywords
  handleEnterKeywords() {
    const { dispatch } = this.props;
    dispatch({
      type: 'goodsManage/getGoodsList',
      payload: {
        curPage: 1,
      },
    });
  }
  handleChangeGoodsFloorPrice(goodsIndex, e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'goodsManage/changeGoodsFloorPrice',
      payload: {
        goodsIndex,
        goodsFloorPrice: e.target.value,
      },
    });
  }
  handleChangeGoodsTaxFloorPrice(goodsIndex, e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'goodsManage/changeGoodsTaxFloorPrice',
      payload: {
        goodsIndex,
        goodsTaxFloorPrice: e.target.value,
      },
    });
  }
  handleBlurGoodsFloorPrice(goodsId, goodsIndex, e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'goodsManage/blurGoodsFloorPrice',
      payload: {
        goodsId,
        goodsIndex,
        goodsFloorPrice: e.target.value,
      },
    });
  }
  handleBlurGoodsTaxFloorPrice(goodsId, goodsIndex, e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'goodsManage/blurGoodsTaxFloorPrice',
      payload: {
        goodsId,
        goodsIndex,
        goodsTaxFloorPrice: e.target.value,
      },
    });
  }
  render() {
    const { goodsManage: {
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
        width:200,
        render:(goodsName)=>{
          return <p style={{width:180,margin:0}} className={globalStyles.twoLine}>{goodsName}</p>
        }
      },
      {
        title: '条码',
        dataIndex: 'goodsSn',
        key: 'goodsSn',
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
        title: '底价',
        dataIndex: 'goodsCostPrice',
        key: 'goodsCostPrice',
        width:150,
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
