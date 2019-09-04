import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Input, Select, Button, Modal, Dropdown, Menu, AutoComplete, Table, Icon, Tooltip, Popconfirm, DatePicker, Carousel } from 'antd';
import { withRouter, Link } from 'dva/router';
import Debounce from 'lodash-decorators/debounce';
// import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './CommonPurchaseList.less';
import globalStyles from '../../assets/style/global.less';
import nowStyle from './SalePaymentList.less';
import { Slider } from 'g2-plugin-slider';


const { Option } = Select;
const { Search } = Input;
@connect(state => ({
  salePaymentList: state.salePaymentList,
}))
export default class SalePaymentList extends PureComponent {
  state={
    visible: false,
    src: [],
  }
  componentDidMount() {
    console.log(this.props);
    const { dispatch } = this.props;
    dispatch({
      type: 'salePaymentList/mount',
    });
  }
  // componentWillReceiveProps(nextProps){
  //       console.log(nextProps.salePaymentList)
  // }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'salePaymentList/unmount',
    });
  }

  // 换一种方法
  handleChangeSiftItem(type, e, dataStrings) {
    console.log(e);
    console.log(type);
    console.log(dataStrings);
    const { dispatch } = this.props;
    switch (type) {
      case 'keywords':
      case 'orderSn':
        dispatch({
          type: 'salePaymentList/changeConfig',
          payload: {
            [type]: e.target.value,
          },
        });
        break;
      case 'seller':
        dispatch({
          type: 'salePaymentList/getList',
          payload: {
            [type]: e,
          },
        });
        break;
      case 'createTime':
        console.log(dataStrings);
        dispatch({
          type: 'salePaymentList/getList',
          payload: {
            createStartTime: dataStrings[0],
            createEndTime: dataStrings[1],
            currentPage: 1,
          },
        });
        break;
      case 'currentPage':
        dispatch({
          type: 'salePaymentList/getList',
          payload: {
            [type]: e,
          },
        });
        break;
      case 'pageSize':
        console.log(e);
        console.log(dataStrings);
        dispatch({
          type: 'salePaymentList/getList',
          payload: {
            [type]: dataStrings,
          },
        });
        break;
      default:
        break;
    }
  }

  // 换种写法
  handleGetOrderList() {
    const { dispatch } = this.props;
    dispatch({
      type: 'salePaymentList/getList',
      payload: {
        currentPage: 1,
      },
    });
  }

 ShowImage=(src, record, title) => {
   console.log(src, record);
   this.setState({
     visible: !this.state.visible,
     src,
     title,
   });
 }
 handleCancel=() => {
   this.setState({
     visible: !this.state.visible,
   });
 }
nexts=() => {
  console.log(this.slider);
  this.slider.next();
}
previous=() => {
  this.slider.prev();
}
render() {
  const ShowCarousel = () => {
    return (
      <Modal
        title={this.state.title === '收款凭证' ? '收款凭证' : '客户付款截图'}
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        footer={null}
      >
        <Carousel effect="fade" ref={c => (this.slider = c)} >
          {
          this.state.src ? this.state.src.map((item, index) => (
            <img
              key={index}
              src={item}
              alt="展示图"
              style={{ width: 472, height: 260, background: '#ccc' }}
            />
             )) : ''}

        </Carousel>
        <Icon
          type="left"
          onClick={this.previous}
          style={{
   position: 'absolute', top: '50%', left: '0%', fontSize: '40px',
 }}
        />
        <Icon
          type="right"
          style={{
   position: 'absolute', top: '50%', right: '0%', fontSize: '40px',
 }}
          onClick={this.nexts}
        />
      </Modal>
    );
  };
  const {
    salePaymentList: {
      currentPage,
      pageSize,
      total, // 列表总条数
      checkBillList,
      resBussiness,
      commonPage,
    } } = this.props;
  console.log(pageSize);
  checkBillList.length > 0 && checkBillList.map((item) => {
    item.key = item.checkBillId;
  });
  const columns = [
    // `/purchase/common-purchase-list/common-purchase-detail/${id}`
    // sale-payment-message/:id
    {
      title: '对账单号',
      dataIndex: 'checkBillSn',
      key: 'checkBillSn',
      render: (checkBillSn, record) => {
        return <Link to={`/finance/sale-payment-list/sale-payment-message/${record.checkBillId}`}>{checkBillSn}</Link>;
      },
    },
    {
      title: '客户名称',
      dataIndex: 'custoemrName',
      key: 'custoemrName',
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      key: 'mobile',
    },
    {
      title: '门店名称',
      dataIndex: 'companyName',
      key: 'companyName',
    },
    {
      title: '所属业务员',
      dataIndex: 'seller',
      key: 'seller',
    }, {
      title: '应结算总金额',
      dataIndex: 'shouldReceiveAmount',
      key: 'shouldReceiveAmount',
    }, {
      title: '实际收款总金额',
      dataIndex: 'receivedAmount',
      key: 'receivedAmount', // 如果有售后就变绿色，正常为红色
      render: (receivedAmount, record) => (
        <span style={{ color: record.color }}>{receivedAmount} </span>
      ),
    },
    (commonPage === '1' ? {
      title: '生成时间',
      dataIndex: 'createTime',
      key: 'createTime',
    } : {
      width: '0%',
      title: '生成时间',
      dataIndex: 'createTime',
      key: 'createTime',
    }
    ),
    {
      title: '收款信息',
      dataIndex: 'receivedInfo',
      key: 'receivedInfo',
      width: 240,
      render: (receivedInfo, record) => (
        [
          receivedInfo ? receivedInfo.map(item =>
            <span>{item} </span>
          ) : null,
        ]
      ),

    }, {
      title: '客户付款截图',
      dataIndex: 'payImage',
      key: 'payImage',
      render: (src, record) => {
        const title = '客户付款截图';
        return (
          <div onClick={() => this.ShowImage(src, record, title)}>
            {src ? src.map(item =>
              <img alt="付款图" src={item} style={{ width: 55, height: 55 }} />
                ) : ''}
          </div>
        );
      }
      ,
    }, {
      title: '收款凭证',
      dataIndex: 'receiveImage',
      key: 'receiveImage',
      render: (src, record) => {
        const title = '收款凭证';
        return (

          <div onClick={() => this.ShowImage(src, record, title)}>
            {src ? src.map(item =>
              <img src={item} alt="收款图" style={{ width: 55, height: 55 }} />
                ) : ''}
          </div>
        );
      }
      ,
    },
  ];
  const expandTable = (checkBillList) => {
    const { detail } = checkBillList;
    const goodsColumns = [
      {
        title: '到期时间',
        dataIndex: 'expireTime',
        key: 'expireTime',
        render: (expireTime, record) => (
          <span style={{ color: (record && record.isExpire === 0) ? '#f00' : '#000' }}>{expireTime}</span>
        ),
      },
      {
        title: '总订单',
        dataIndex: 'groupSn',
        key: 'groupSn',
      },
      {
        title: '商品名称',
        dataIndex: 'goodsName',
        key: 'goodsName',
        render: (goodsName, record) => (

          [
            record.tag === '售后' ?
              (
                <Tooltip title={record.rejectRemark}>
                  <span style={{ color: '#fff', marginLeft: 5, padding: '2px 5px', background: '#f00', fontSize: 12 }}>售后</span>
                </Tooltip>
              ) :
              null,
            <span >{goodsName}</span>,

          ]
        ),
      },
      {
        title: '条形码',
        dataIndex: 'goodsSn',
        key: 'goodsSn',
      },
      {
        title: '销售价',
        dataIndex: 'salePrice',
        key: 'salePrice',
      },
      {
        title: '实际数量',
        dataIndex: 'realNum',
        key: 'realNum',
        render: (realNum, record) => (

          [
            record.tag === '售后' ?
              (
                <Tooltip autoAdjustOverflow placement="topLeft" title={<div style={{ width: 90 }}>{record.realNumRemark}</div>} >
                  <span style={{ color: '#008000' }}>{realNum}</span>
                </Tooltip>
              ) :
                <span style={{ color: '#000' }}>{realNum}</span>,
          ]
        ),

      },
      {
        title: '实际金额',
        dataIndex: 'realAmount',
        key: 'realAmount',
        render: (realAmount, record) => (
          [
            record.tag === '售后' ?
              (
                <Tooltip autoAdjustOverflow placement="topLeft" title={<div style={{ width: 110 }}>{record.realAmountRemark}</div>} >
                  <span style={{ color: '#008000' }}>{realAmount}</span>
                </Tooltip>
              ) : <span style={{ color: '#f00' }}>{realAmount}</span>,
          ]
        ),
      },
      {
        title: '下单时间',
        dataIndex: 'orderTime',
        key: 'orderTime',
      },
      commonPage === '2' ? {
        title: '账期条件',
        dataIndex: 'paymentCondition',
        key: 'paymentCondition',
      } : {
        width: '0%',
      },
      {
        title: '子单号',
        dataIndex: 'orderSn',
        key: 'orderSn',
      },
    ];

    return (
      <Table
        columns={goodsColumns}
        dataSource={detail}
        bordered
        pagination={false}
      />
    );
  };
  return (
    <PageHeaderLayout title="销账账期应收">
      <Card bordered={false}>
        <div className={styles.tableList}>
          <div className={styles.tableListForm}>
            <Row>


              <Input.Search
                className={globalStyles['input-sift']}
                placeholder="请输入客户姓名/手机号/店铺名称"

                onSearch={this.handleGetOrderList.bind(this)}
                onChange={this.handleChangeSiftItem.bind(this, 'keywords')}
              />
              <Input.Search
                className={globalStyles['input-sift']}

                placeholder="请输入总单号/子单号"
                onSearch={this.handleGetOrderList.bind(this)}
                onChange={this.handleChangeSiftItem.bind(this, 'orderSn')}
              />
              <Select
                placeholder="请选择业务负责人"
                className={globalStyles['select-sift']}
                onChange={this.handleChangeSiftItem.bind(this, 'seller')}
              >
                {Object.keys(resBussiness).map((id) => {
                    resBussiness.key = id;
                    return <Option value={id}>{resBussiness[id]}</Option>;
                  })}
              </Select>
              <DatePicker.RangePicker
                className={globalStyles['rangePicker-sift']}
                onChange={this.handleChangeSiftItem.bind(this, 'createTime')}
              />
            </Row>
          </div>
          <Table
            expandedRowRender={expandTable}
            bordered
            dataSource={checkBillList}
            columns={columns}
            pagination={{
                current: currentPage,
                pageSize,
                onChange: this.handleChangeSiftItem.bind(this, 'currentPage'),
                onShowSizeChange: this.handleChangeSiftItem.bind(this, 'pageSize'),
                showSizeChanger: true,
                showQuickJumper: false,
                total,
                showTotal:total => `共 ${total} 个结果`,
              }}
          />
          <ShowCarousel />
        </div>
      </Card>
    </PageHeaderLayout>
  );
}
}
