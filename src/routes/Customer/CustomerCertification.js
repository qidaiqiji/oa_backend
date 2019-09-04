import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Input, Select, Modal, Table, Button, message, DatePicker, Dropdown, Menu, Icon, Tabs, Popconfirm, Collapse, Tooltip, notification } from 'antd';
import { Link } from 'dva/router';
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './CustomerCertification.less';
import globalStyles from '../../assets/style/global.less';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

@connect(state => ({
  customerCertification: state.customerCertification,
  mobilePhone:state.user.mobilePhone,
}))

export default class CustomerCertification extends PureComponent {
  componentDidMount() {
    const { dispatch,mobilePhone } = this.props;
    dispatch({
      type: 'customerCertification/getConfig',
      payload:{
        mobilePhone
      }
    });
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'customerCertification/unmount',
    });
  }
  getCustomerList(params = {}) {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerCertification/getCustomerList',
      payload: {
        ...params,
      },
    });
  }
  handleChangeDate(_, dateStrings) {
    this.getCustomerList({
      regStartDate: dateStrings[0],
      regEndDate: dateStrings[1],
      currentPage: 1,
    });
  }
  handleSearch(value) {
    this.getCustomerList({
      customerKeywords: value,
      currentPage: 1,
    });
  }
  handleInputChange(type,e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerCertification/changeReducer',
      payload: {
        [type]: e.target.value,
      },
    });
  }
  handleChangeSelect=(type,e)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'customerCertification/getCustomerList',
      payload: {
        [type]: e,
        currentPage: 1,
      },
    });
  }
  showDetailImg(e) {
    const { dispatch } = this.props;
    const imgSrc = e.target.src;
    if (imgSrc.indexOf('img.xiaomei360.com') === -1) {
      notification.info({
        message: '信息提示',
        description: '暂未上传资质认证！',
        duration: 2,
      });
      return;
    }
    dispatch({
      type: 'customerCertification/showDetailImage',
      payload: {
        modalImg: imgSrc,
      },
    });
  }
  hideDetailImage() {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerCertification/hideDetailImage',
    });
  }
  // 换页
  handleChangeCurPage(page) {
    this.getCustomerList({
      currentPage: page,
    });
  }
  // 切换每页行数
  handleChangePageSize(_, pageSize) {
    this.getCustomerList({
      pageSize,
      currentPage: 1,
    });
  }
  handleChangeSiftItem=(e)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'customerCertification/handleInputChangeReducer',
      payload: {
        inviter: e.target.value,
      },
    });
  }
  handleSearchByInviter=(e)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'customerCertification/getCustomerList',
      payload: {
        inviter: e,
        currentPage:1,
      },
    });
  }
  handleShowModal=(type,record)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'customerCertification/changeReducer',
      payload: {
        [type]:true,
        customerId:record.customerId,
        isChange:false
      },
    });
  }
  handleCloseModal=(type)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'customerCertification/changeReducer',
      payload: {
        [type]:false,
      },
    });
  }
  handleConfrimSendMsg=()=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'customerCertification/sendMsg',
      payload:{
        btnLoading:true,
      }
    });
  }
  handleChangePhone=(e)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'customerCertification/changeReducer',
      payload:{
        salerPhone:e.target.value,
        isChange:true,
      }
    });
  }
  render() {
    const {
      mobilePhone,
      customerCertification: {
        isCheckedStatusMap,
        sellerMap,
        sellerTeamMap,
        currentPage,
        pageSize,
        total,
        isGetCustomerListing,
        customerList,
        modalImg,
        isShowImg,
        regStartDate,
        regEndDate,
        areaManagerList,
        provinceManagerList,
        stateManagerList,
        salerList,
        sendMessageModal,
        btnLoading,
        salerPhone,
        isChange,
      },
    } = this.props;
    const customerColumns = [
      {
        title: '注册时间',
        dataIndex: 'regTime',
        key: 'regTime',
        width:100,
      },
      {
        title: '账号状态',
        dataIndex: 'checkStatus',
        key: 'checkStatus',
        render: (checkStatus) => {
          let renderHTML = '';
          switch (checkStatus) {
            case '拒绝':
              renderHTML = <span style={{ color: 'red' }}>{checkStatus}</span>;
              break;
            case '注销':
              renderHTML = <span style={{ color: '#ccc' }}>{checkStatus}</span>;
              break;
            default:
              renderHTML = <span>{checkStatus}</span>;
          }
          return renderHTML;
        },
      },
      {
        title: '客户名称',
        dataIndex: 'customerName',
        key: 'customerName',
        render: (value, record) => {
          return (
            <span style={{ color: (record.checkStatus === '注销') ? '#ccc' : '' }} >{value}</span>
          );
        },
      },
      {
        title: '登录账号',
        dataIndex: 'mobile',
        key: 'mobile',
        width:110,
        render: (value, record) => {
          return (
            <Link to={`/customer/customer-list/add-customer/${record.customerId}/1`} style={{ color: (record.checkStatus === '注销') ? '#ccc' : '' }}>{value}</Link>
          );
        },
      },
      {
        title: '店铺名',
        dataIndex: 'companyName',
        key: 'companyName',
        width:150,
        render: (value, record) => {
          return (
            <Tooltip title={value}>
              <p style={{ color: (record.checkStatus === '注销') ? '#ccc' : '',width:150 }} className={globalStyles.textOverflow}>{value}</p>
            </Tooltip>
          );
        },
      },
      
      {
        title: '省份区域',
        dataIndex: 'area',
        key: 'area',
        render: (value, record) => {
          return (
            <span style={{ color: (record.checkStatus === '注销') ? '#ccc' : '' }} >{value}</span>
          );
        },
      },
      {
        title: '区域经理',
        dataIndex: 'areaManager',
        key: 'areaManager',
        render: (value, record) => {
          return (
            <span style={{ color: (record.checkStatus === '注销') ? '#ccc' : '' }} >{value}</span>
          );
        },
      },
      {
        title: '省区经理',
        dataIndex: 'provinceManager',
        key: 'provinceManager',
        render: (value, record) => {
          return (
            <span style={{ color: (record.checkStatus === '注销') ? '#ccc' : '' }} >{value}</span>
          );
        },
      },
      {
        title: '城区经理',
        dataIndex: 'stateManager',
        key: 'stateManager',
        render: (value, record) => {
          return (
            <span style={{ color: (record.checkStatus === '注销') ? '#ccc' : '' }} >{value}</span>
          );
        },
      },
      {
        title: '内勤',
        dataIndex: 'seller',
        key: 'seller',
        render: (value, record) => {
          return (
            <span style={{ color: (record.checkStatus === '注销') ? '#ccc' : '' }} >{value}</span>
          );
        },
      },
      {
        title: '经销商',
        dataIndex: 'areaAgent',
        key: 'areaAgent',
        render: (value, record) => {
          return (
            <span style={{ color: (record.checkStatus === '注销') ? '#ccc' : '' }} >{value}</span>
          );
        },
      },
      {
        title: '资质认证',
        dataIndex: 'license',
        key: 'license',
        width: '150px',
        render: (_, record) => {
          return (
            <div className={styles['img-container']}>
              <img src={record.shopFront} alt="" onClick={this.showDetailImg.bind(this)} />
              <img src={record.license} alt="" onClick={this.showDetailImg.bind(this)} />
            </div>
          );
        },
      },
      {
        title: '来源方式',
        dataIndex: 'customerSource',
        key: 'customerSource',
        render: (value, record) => {
          return (
            <span style={{ color: (record.checkStatus === '注销') ? '#ccc' : '' }} >{value}</span>
          );
        },
      },
      {
        title: '邀请者',
        key: 'inviter',
        dataIndex: 'inviter',
      },
      {
        title: '审核意见',
        dataIndex: 'checkNote',
        key: 'checkNote',
        width: '200px',
        render: (value, record) => {
          return (
            <Tooltip title={`审核意见：${value}`} placement="topRight"><span style={{ height: '60px', overflow: 'hidden', display: 'inline-block', color: (record.checkStatus === '注销') ? '#ccc' : '' }}>{value}</span></Tooltip>
          );
        },
      },
      {
        title: '操作',
        key: '',
        dataIndex: '',
        width:110,
        render:(_,record)=>{
          return <a href="#" onClick={this.handleShowModal.bind(this,'sendMessageModal',record)}>发送短信通知</a>
        }
      },
    ];
    return (
      <PageHeaderLayout title="客户审核列表">
        <Card bordered={false} >
          <Row>
            <Col span={4} style={{ margin: '0 10px' }}>
              <Search
                placeholder="客户名称/手机号/门店名称"
                onSearch={this.handleSearch.bind(this)}
                onChange={this.handleInputChange.bind(this,'keywords')}
                enterButton
                width="20%"
              />
            </Col>
            注册时间：
            <RangePicker
              className={globalStyles['rangePicker-sift']}
              value={[regStartDate ? moment(regStartDate, 'YYYY-MM-DD') : null, regEndDate ? moment(regEndDate, 'YYYY-MM-DD') : null]}
              format="YYYY-MM-DD"
              style={{ margin: '0 10px' }}
              onChange={this.handleChangeDate.bind(this)}
            />
            <Select
              placeholder="请选择销售组"
              style={{ width: 200, margin: '0 10px' }}
              onChange={this.handleChangeSelect.bind(this,'sellerTeam')}
              allowClear
              dropdownMatchSelectWidth={false}
            >
              {
                  Object.keys(sellerTeamMap).map(
                    item => (
                      <Option
                        key={item}
                        value={item}
                      >
                        {sellerTeamMap[item]}
                      </Option>
                      )
                  )
                }
            </Select>
            <Select
              placeholder="请选择认证状态"
              style={{ width: 200, margin: '0 10px' }}
              onChange={this.handleChangeSelect.bind(this,'checkStatus')}
              allowClear
              dropdownMatchSelectWidth={false}
            >
              {
                  Object.keys(isCheckedStatusMap).map(
                    item => (
                      <Option
                        key={item}
                        value={item}
                      >
                        {isCheckedStatusMap[item]}
                      </Option>
                      )
                  ).concat(
                    <Option
                      key=""
                      value=""
                    >
                      全部
                    </Option>
                  )
                }
            </Select>
            <Search
                className={globalStyles['input-sift']}
                placeholder="邀请者"
                style={{ width: '200px' }}
                onChange={this.handleChangeSiftItem.bind(this)}
                onSearch={this.handleSearchByInviter.bind(this)}
              />
          </Row>
          <Row>
            <Select
              placeholder="所属区域经理"
              style={{ width: 200, margin: '0 10px' }}
              onChange={this.handleChangeSelect.bind(this,'areaManagerId')}
              allowClear
              dropdownMatchSelectWidth={false}
            >
              <Option value="">全部</Option>
              {
                  Object.keys(areaManagerList).map(
                    item => (
                      <Option
                        key={item}
                        value={item}
                      >
                        {areaManagerList[item]}
                      </Option>
                      )
                  )
                }
            </Select>
            <Select
              placeholder="所属省份经理"
              style={{ width: 200, margin: '0 10px' }}
              onChange={this.handleChangeSelect.bind(this,'provinceManagerId')}
              allowClear
              dropdownMatchSelectWidth={false}
            >
              <Option value="">全部</Option>
              {
                  Object.keys(provinceManagerList).map(
                    item => (
                      <Option
                        key={item}
                        value={item}
                      >
                        {provinceManagerList[item]}
                      </Option>
                      )
                  )
                }
            </Select>
            <Select
              placeholder="所属城区经理"
              style={{ width: 200, margin: '0 10px' }}
              onChange={this.handleChangeSelect.bind(this,'stateManagerId')}
              allowClear
              dropdownMatchSelectWidth={false}
            >
              <Option value="">全部</Option>
              {
                  Object.keys(stateManagerList).map(
                    item => (
                      <Option
                        key={item}
                        value={item}
                      >
                        {stateManagerList[item]}
                      </Option>
                      )
                  )
                }
            </Select>
            <Select
              placeholder="请选择内勤"
              style={{ width: 200, margin: '0 10px' }}
              onChange={this.handleChangeSelect.bind(this,'seller')}
              allowClear
              dropdownMatchSelectWidth={false}
            >
              <Option value="">全部</Option>
              {
                  Object.keys(salerList).map(
                    item => (
                      <Option
                        key={item}
                        value={item}
                      >
                        {salerList[item]}
                      </Option>
                      )
                  )
                }
            </Select>
          </Row>
          <Table
            bordered
            rowKey={record => record.customerId}
            columns={customerColumns}
            dataSource={customerList}
            style={{ marginTop: '20px' }}
            loading={isGetCustomerListing}
            className={globalStyles.tablestyle}
            pagination={{
              current: currentPage,
              showTotal:total => `共 ${total} 个结果`,
              pageSize,
              total,
              showSizeChanger: true,
              onShowSizeChange: this.handleChangePageSize.bind(this),
              onChange: this.handleChangeCurPage.bind(this),
            }}
          />
          <div className={styles['img-modal-container']}>
            <Modal
              visible={isShowImg}
              onCancel={this.hideDetailImage.bind(this)}
              footer={null}
              bodyStyle={{ }}
              style={{ position: 'absolute', left: '50%', transform: 'translate(-50%)' }}
              wrapClassName={styles['img-modal-container']}
              width="auto"
              closable={false}
            >
              <img src={modalImg} alt="" className={styles['detail-image']} />
            </Modal>
          </div>
          <Modal 
          visible={sendMessageModal}
          onOk={this.handleConfrimSendMsg}
          onCancel={this.handleCloseModal.bind(this,'sendMessageModal')}
          title="提示"
          confirmLoading={btnLoading}
          >
            【小美诚品】美妆一般贸易供应链服务平台提醒您：客户经理刚刚给您致电啦，请您稍后留意接听，或回拨
            <Input 
            onChange={this.handleChangePhone}
            value={isChange?salerPhone:mobilePhone}
            style={{width:150,margin:'0 10px'}}
            />
            感谢您的支持！退订回T
          </Modal>
        </Card>
      </PageHeaderLayout>
    );
  }
}
