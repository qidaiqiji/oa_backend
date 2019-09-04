
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import classNames from 'classnames';
import moment from 'moment';
import { Form, Tabs, Row, Col, Card, Input, Select, Button, Modal, Dropdown, Menu, AutoComplete, Table, Icon, Tooltip, Popconfirm, DatePicker, message, Upload } from 'antd';
import { Link } from 'dva/router';
import Debounce from 'lodash-decorators/debounce';
// import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './CommonPurchaseList.less';
import globalStyles from '../../assets/style/global.less';
import nowStyle from './SalePaymentMessage.less';
import { stringify } from 'qs';
import request, { getUrl } from '../../utils/request';
import Payment from './../Finance/PaymentRecord';

const FormItem = Form.Item;
const { Option } = Select;
const { Search } = Input;

const dateFormat = 'YYYY/MM/DD';

const TabPane = Tabs.TabPane;
const { TextArea } = Input;

@connect(state => ({
  salePaymentMessage: state.salePaymentMessage,
}))
class SalePaymentMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowReceipt: false,
      loading: false,
      recOneList: {},
      TabsIndex: '1',
      status: '',
      src: '',
      title: '',
      visibleImg: false,
    };
  }
  componentWillMount() {
    const { match, dispatch } = this.props;
    if (match.params.id) {
      dispatch({
        type: 'salePaymentMessage/commonChange',
        payload: {
          checkBillId: match.params.id,
        },
      });
    } else {
      return null;
    }
    const url = match.url.split('/');
    if (url[url.length - 2] === 'sale-payment-message') {
      this.setState({ status: '1' });
    } else if (url[url.length - 2] === 'destroy-sale-payment-message') {
      this.setState({ status: '2' });
    }
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'salePaymentMessage/mount',
    });
  }
  componentWillReceiveProps = (nextProps) => {
    if (nextProps.salePaymentMessage.reqMessage !== this.props.salePaymentMessage.reqMessage) {
      const { dispatch } = nextProps;
      dispatch({
        type: 'salePaymentMessage/mount',
      });
    }
    if ((nextProps.salePaymentMessage.actionList && nextProps.salePaymentMessage.actionList.length)
       !==
  (this.props.salePaymentMessage.actionList && this.props.salePaymentMessage.actionList.length)) {
      const { dispatch } = nextProps;
      dispatch({
        type: 'salePaymentMessage/mount',
      });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'salePaymentMessage/unmount',
    });
  }

  onTabsChange=(index) => {
    this.setState({ TabsIndex: index });
  }
  // 处理图片
 getBase64=(img, callback) => {
   const reader = new FileReader();
   reader.addEventListener('load', () => callback(reader.result));
   reader.readAsDataURL(img);
 }

beforeUpload=(file) => {
  const isIMG = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isIMG) {
    message.error('You can only upload Image file!');
  }
  const isLt7M = file.size / 1024 / 1024 < 7;
  if (!isLt7M) {
    message.error('Image must smaller than 7MB!');
  }
  return isIMG && isLt7M;
}

  handleUploadChanged=(file) => {
    const { dispatch } = this.props;
    const { status, response } = file.file;
    if (status === 'done') {
      dispatch({
        type: 'salePaymentMessage/updatePage',
        payload: {
          receiveImg: response.data.url,
        },
      });
    } else if (status === 'error') {
      message.error({
        message: '上传文件失败，请稍候重试',
      });
    }
  }
  addReceiptVoucher=(record) => {
    this.setState({
      isShowReceipt: !this.state.isShowReceipt,
      recOneList: record,
      imageUrl: record.receiveImg,
      IsShow: false,
      rejectValue: '',
      rejectUrl: '',
      financialAccountValue: record.financialAccount,
    });
  }
  handleOk=(e) => {
    const { receiveImg, collectAccountMap } = this.props.salePaymentMessage;
    const { dispatch } = this.props;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const financialAccountInx = Object.entries(collectAccountMap).map((value) => {
          if (value[1] === this.state.financialAccountValue) {
            return value[0];
          }
        }).filter(item => item !== undefined);
        values.financialAccountId = this.state.financialAccountIndex || financialAccountInx[0];
        values.receiveTime = (values.receiveTime) && (moment(values.receiveTime).format('YYYY-MM-DD HH:mm:ss'));
        values.payRecId = this.state.recOneList.recId;
        values.receiveImg = receiveImg || this.state.imageUrl;
        dispatch({
          type: 'salePaymentMessage/addReceiptVoucher',
          payload: {
            ...values,
          },
        });
        this.setState({
          isShowReceipt: !this.state.isShowReceipt,
        });
        dispatch({
          type: 'salePaymentMessage/updatePage',
          payload: {
            receiveImg: '',
          },
        });
        this.props.form.resetFields();
      } else {
        message.info('请填写完整表单');
      }
    });
  }
  handleCancel=(e) => {
    e.preventDefault();
    this.setState({ isShowReceipt: !this.state.isShowReceipt });
    this.props.form.resetFields();
  }
   changeFinancialAccountId=(index) => {
     this.setState({
       financialAccountIndex: index,
     });
   }
   handleOkReject=(url) => {
     this.setState({
       IsShow: true,
       rejectUrl: url,
     });
   }
   handleOkCancelAccount=(url) => {
     const Url = url.split('?')[0];
     const params = url.split('?')[1].split('=')[1];
     request(Url, {
       method: 'POST',
       body: {
         id: Number(params),
       },
     }).then((res) => {
       message.success(res.msg);
       const { dispatch } = this.props;
       dispatch({
         type: 'salePaymentMessage/updatePage',
         payload: {
           actionList: [],
         },
       });
     });
   }
   handleOk2=(e) => {
     e.preventDefault();
     request(`${this.state.rejectUrl}&${stringify({ remark: this.state.rejectValue })}`);
     this.setState({ IsShow: !this.state.IsShow });
     const { dispatch } = this.props;
     dispatch({
       type: 'salePaymentMessage/updatePage',
       payload: {
         actionList: [],
       },
     });
   }
   handleCancel2=(e) => {
     e.preventDefault();
     this.setState({ rejectValue: '' });
     this.setState({ IsShow: !this.state.IsShow });
   }
   TextValue=(e) => {
     this.setState({
       rejectValue: e.target.value,
     });
   }
  showImg=(src, title) => {
    this.setState({
      visibleImg: !this.state.visibleImg,
      src,
      title,
    });
  }
  handleOkImg=() => {
    this.setState({
      visibleImg: !this.state.visibleImg,
    });
  }
  handleCancelImg=() => {
    this.setState({
      visibleImg: !this.state.visibleImg,
    });
  }
  render() {
    const {
      salePaymentMessage: {
        paymentDetail,
        detail,
        shouldReceiveAmount,
        realShouldReceiveAmount,
        sellerRemark,
        seller,
        companyName,
        customerName,
        checkBillSn,
        saleAmount,
        balanceAmount,
        afterSaleAmount,
        receivedAmount,
        collectAccountMap,
        actionList,
        isLoading,
        receiveImg,
      },
    } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    paymentDetail.length > 0 && paymentDetail.map((item) => {
      item.key = item.recId;
    });
    detail.length > 0 && detail.map((item) => {
      item.key = item.recId;
    });


    // actionList
    const operations = ([this.state.status === '1' && actionList && actionList.map((item, index) =>
      (
        <Button
          type="primary"
          key={index}
          style={{ marginLeft: '30px' }}
          onClick={item.name === '驳回' ? () => this.handleOkReject(item.url) : () => this.handleOkCancelAccount(item.url)}
        >
          {item.name}
        </Button>))]); // 这里还有驳回接口

    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    //  const { imageUrl } = this.state;
    const HeadC = ({ topTitle }) => (
      <Card style={{ margin: '10px 0 20px 0', background: '#F2F2F2' }}>
        <Row style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}><Col>{topTitle}</Col></Row>
        <Row span={24}>
          {topTitle === '销账账期应收详情' ? '' : (<Col span={4}>应结算总金额：<span style={{ fontSize: 16, fontWeight: 'bold' }}>{shouldReceiveAmount}</span></Col>)}
          {topTitle === '销账账期应收详情' ? '' : (<Col span={4}>实际应收总金额：<span style={{ color: '#f00', fontSize: 16, fontWeight: 'bold' }}>{realShouldReceiveAmount}</span></Col>)}
          {topTitle === '收款信息' ? '' : (<Col span={4}>实际收款总金额：<span style={{ color: '#f00', fontSize: 16, fontWeight: 'bold' }}>{receivedAmount}</span></Col>)}
          <Col span={4}>对账单号：<span>{checkBillSn}</span></Col>
          <Col span={4}>客户名称：<span>{customerName}</span></Col>
          <Col span={4}>门店名称：<span>{companyName}</span></Col>
          <Col span={4}>所属业务员：<span>{seller}</span></Col>
        </Row>
        {topTitle === '销账账期应收详情' ? '' : (<Row style={{ color: '#ccc', marginTop: 10 }}><Col>销售备注：<span>{sellerRemark}</span></Col></Row>)}
      </Card>
    );

    const columns = [
      {
        title: '实际收款时间',
        dataIndex: 'receiveTime',
        key: 'receiveTime',
      },
      {
        title: '付款时间',
        dataIndex: 'payTime',
        key: 'payTime',
        width: 200,
      },
      {
        title: '实际应收款总额',
        dataIndex: 'realShouldReceiveAmount',
        key: 'realShouldReceiveAmount',
        width: 200,
      },
      {
        title: '收款账户',
        dataIndex: 'financialAccount',
        key: 'financialAccount',
      },
      {
        title: '付款人',
        dataIndex: 'payer',
        key: 'payer',
      }, {
        title: '客户付款截图',
        dataIndex: 'payImg',
        key: 'payImg',
        render: (src) => {
          const title = '客户付款截图';
          return (
            [
              src !== '' ? (
                <div onClick={() => this.showImg(src, title)}>
                  <img src={src} alt="付款图" style={{ width: 55, height: 55 }} />
                </div>) : null,
            ]
          );
        },
      }, {
        title: '收款凭证',
        dataIndex: 'receiveImg',
        key: 'receiveImg',
        render: (src) => {
          const title = '收款凭证';
          return (
            [
              src !== '' ? (
                <div onClick={() => this.showImg(src, title)}>
                  <img src={src} alt="收款图" style={{ width: 55, height: 55 }} />
                </div>) : null,
            ]
          );
        },
      }, {
        title: '财务备注',
        dataIndex: 'financialRemark',
        key: 'financialRemark',
        width: 100,
      }, {
        title: '操作',
        dataIndex: 'operation ',
        key: 'operation ',
        render: (_, record) => (
          <Button onClick={() => this.addReceiptVoucher(record)}>添加收款凭证</Button>
        ),
      },
    ];
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
              ) : null,
            <span>{goodsName}</span>,
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
              ) : <span >{realNum}</span>,
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
      {
        title: '账期条件',
        dataIndex: 'paymentCondition',
        key: 'paymentCondition',
      },
      {
        title: '子单号',
        dataIndex: 'orderSn',
        key: 'orderSn',
      },
    ];
    const receiveImgs = `${getUrl(API_ENV)}/sale/credit-check-pay-record/upload-img`;
    return (
      <PageHeaderLayout title={this.state.status === '1' ? '销账账期应收详情' : '已销账详情'}>
        <Card bordered={false} loading={isLoading}>
          <div className={styles.tableList}>
            <Tabs
              tabBarExtraContent={this.state.TabsIndex === '1' ? operations : null}
              onChange={this.onTabsChange}
            >
              <TabPane tab="收款信息" key="1">
                <HeadC topTitle="收款信息" />
                <Table
                  bordered
                  dataSource={paymentDetail}
                  columns={columns}
                  pagination={false}
                />
              </TabPane>
              <TabPane tab="销账账期应收详情" key="2">
                <HeadC topTitle="销账账期应收详情" />
                <Table
                  bordered
                  dataSource={detail}
                  columns={goodsColumns}
                  pagination={false}
                />
                <Row span={24} className={classNames(nowStyle.momeys)}>
                  <Col>
                    <Row><Col span={4} offset={20}>销售总金额：<span className={nowStyle.allMoneys}>{saleAmount}</span></Col></Row>
                    <Row><Col span={4} offset={20}>挂账抵扣：<span className={nowStyle.allMoneys}>{balanceAmount}</span></Col></Row>
                    <Row><Col span={4} offset={20}>售后折扣：<span className={nowStyle.allMoneys}>{afterSaleAmount}</span></Col></Row>
                    <Row><Col span={4} offset={20}>应结算总金额：<span className={nowStyle.allMoneys}>{shouldReceiveAmount}</span></Col></Row>
                    <Row><Col span={4} offset={20}>实际收款总金额：<span style={{ fontWeight: 'bold', color: '#f00' }}>{receivedAmount}</span></Col></Row>
                  </Col>
                </Row>
              </TabPane>
            </Tabs>

            <Modal
              visible={this.state.isShowReceipt}
              title={(
                <div>
                  <Row><Col style={{ color: '#000', fontSize: '24px', marginBottom: '20px' }}>添加收款记录</Col></Row>
                  <Row><Col span={24}>应结算总金额：<span style={{ fontSize: '20px' }}>{shouldReceiveAmount}</span></Col></Row>
                  <Row><Col span={24}>实际应收款总额：<span style={{ color: '#f00', fontSize: '20px' }}>{realShouldReceiveAmount}</span></Col></Row>
                </div>
                        )}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              footer={[
                <Button key="back" onClick={this.handleCancel}>取消</Button>,
                <Button key="submit" type="primary" onClick={this.handleOk}>确定</Button>,
                      ]}
            >
              <FormItem
                {...formItemLayout}
                label="收款账户"
              >
                {getFieldDecorator('financialAccountId', {
                        initialValue: this.state.recOneList.financialAccount || undefined,
                        rules: [{
                          // required: true, message: '请选择收款账户',
                        }, {
                        }],
                      })(
                        <Select
                          placeholder="请选择收款账户"
                          style={{ width: 174 }}
                          onChange={this.changeFinancialAccountId}
                          dropdownMatchSelectWidth={false}
                        >
                          {collectAccountMap ? (
                              collectAccountMap.map(
                                item => (
                                  <Option
                                    key={''+item.id}
                                    value={''+item.id}
                                  >
                                    {item.accountInfo}
                                  </Option>
                                  )
                              )) : null
                            }
                        </Select>
                      )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="实际收款日期"
              >
                {getFieldDecorator('receiveTime', {
                      initialValue: this.state.recOneList.receiveTime !== '0000-00-00 00:00:00' ? moment(this.state.recOneList.receiveTime) : moment(new Date()),
                      rules: [{
                      required: true, message: '请选择实际收款日期',
                    },
                    ],

                      })(
                        <DatePicker
                          showTime
                          format="YYYY-MM-DD HH:mm:ss"
                        />
                      )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="付款人"
              >
                {getFieldDecorator('payer', {
                        initialValue: this.state.recOneList.payer || undefined,
                        rules: [{
                          required: true, message: '请填写付款人',
                        }, {
                        }],
                      })(
                        <Input
                          type="text"
                          placeholder="请填写付款人"
                        />
                      )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="财务备注"
              >
                {getFieldDecorator('financialRemark', {
                        initialValue: this.state.recOneList.financialRemark || undefined,
                      })(
                        <Input
                          placeholder="请填写财务备注"
                        />
                      )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="上传收款凭证"
              >
                {getFieldDecorator('receiveImg', {
                        initialValue: this.state.imageUrl || undefined,
                      })(
                        <Upload
                          name="file"
                          listType="picture-card"
                          // className="avatar-uploader"
                          showUploadList={false}
                          action={receiveImgs}
                          beforeUpload={this.beforeUpload}
                          onChange={this.handleUploadChanged}
                          headers={{
                            authorization: `Basic ${window.btoa(`${localStorage.getItem('token')}:`)}`,
                          }}
                        >
                          {receiveImg ? <img src={receiveImg} style={{ width: '160px', height: '160px' }} alt="上传凭证" /> :
                          this.state.imageUrl && receiveImg === '' ? <img src={this.state.imageUrl} style={{ width: '160px', height: '160px' }} alt="上传凭证" />
                          : uploadButton}
                        </Upload>
                      )}
              </FormItem>
            </Modal>
            <Modal //  驳回modal
              visible={this.state.IsShow}
              title="请填写驳回意见"
              onOk={this.handleOk2}
              onCancel={this.handleCancel2}
              footer={[
                <Button key="back" onClick={this.handleCancel2}>取消</Button>,
                <Button key="submit" type="primary" onClick={this.handleOk2}>
                    确定
                </Button>,
          ]}
            >
              <TextArea rows={4} onChange={this.TextValue} />
            </Modal>
            <Modal // 放大图片
              title={this.state.title}
              visible={this.state.visibleImg}
              onOk={this.handleOkImg}
              onCancel={this.handleCancelImg}
              footer={null}
            >
              <img
                src={this.state.src}
                alt="展示图"
                style={{ width: 472, height: 260, background: '#ccc' }}
              />
            </Modal>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
export default Form.create()(SalePaymentMessage);

