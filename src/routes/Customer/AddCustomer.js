import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Card, Input, Row, Col, Select, Cascader, DatePicker, Button, Upload, Icon, Checkbox, Radio, Table, Modal, Dropdown, Menu, notification, message } from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './AddCustomer.less';
import { getProvinceAndCity, pick, xmTrim } from '../../utils/utils.js';
import { getUrl } from '../../utils/request';
import { deleteRecordReq } from '../../services/customerDetail';
import globalStyles from '../../assets/style/global.less';

const { Option } = Select;
@connect(state => ({
  addCustomer: state.addCustomer,
}))

export default class AddCustomer extends PureComponent {
  state={
    InputValue: '',
  }
  componentDidMount() {
    const { dispatch } = this.props;
    const { id, isCheck } = this.props.match.params;

    if (typeof id !== 'undefined') {
      dispatch({
        type: 'addCustomer/mount',
        payload: {
          id,
          showRadio: isCheck ? 1 : 0,
        },
      });
    } else {
      dispatch({
        type: 'addCustomer/mount',
        payload: {
          id: 0,
          showRadio: isCheck ? 1 : 0,
        },
      });
    }
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'addCustomer/unmount',
    });
  }

  getCreateSystemValue(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'addCustomer/getCreateSystemValue',
      payload: {
        createSystem: e.target.value,
      },
    });
  }

  getCreateServiceTypeValue(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'addCustomer/getCreateServiceTypeValue',
      payload: {
        createServiceType: e.target.value,
      },
    });
  }
  getCreateCondition(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'addCustomer/updatePageReducer',
      payload: {
        createCondition: e.target.value,
      },
    });
  }
  getServiceContentValue(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'addCustomer/getServiceContentValue',
      payload: {
        serviceContentInput: e.target.value,
      },
    });
  }

  getServiceTypeValue(value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'addCustomer/getServiceTypeValue',
      payload: {
        serviceTypeInput: value,
      },
    });
  }

  handleSelectChanged(key, value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'addCustomer/changeValue',
      payload: {
        [key]: parseInt(value),
      },
    });
  }

  handleInputChanged(key, event) {
    const { dispatch } = this.props;

    if (key === 'mobile') {
      const reg = new RegExp('^[0-9]*$');
      if (!reg.test(event.target.value)) {
        return;
      }
    }

    if (key === 'hasContract') {
      dispatch({
        type: 'addCustomer/changeValue',
        payload: {
          [key]: event.target.value,
        },
      });
    }

    dispatch({
      type: 'addCustomer/changeValue',
      payload: {
        [key]: event.target.value,
      },
    });
  }

  handCheckBoxChanged(event) {
    const { dispatch } = this.props;
    dispatch({
      type: 'addCustomer/changeValue',
      payload: {
        sendSms: +event.target.checked,
      },
    });
  }

  handleAreaChanged(key, value) {
    const { dispatch } = this.props;
    dispatch({
      type: 'addCustomer/changeArea',
      payload: {
        [key]: value,
      },
    });
  }

  handleBirthdayChanged(date, dateString) {
    const { dispatch } = this.props;
    dispatch({
      type: 'addCustomer/changeBirthday',
      payload: {
        birthday: dateString,
      },
    });
  }

  beforeUpload(file) {
    this.funcName = 'beforeUpload';
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

  handleUploadChanged(name, file) {
    const { dispatch } = this.props;
    const { status, response } = file.file;

    if (status === 'done') {
      dispatch({
        type: 'addCustomer/updatePage',
        payload: {
          [name]: response.data.filePath,
        },
      });
    } else if (status === 'error') {
      notification.error({
        message: '上传文件失败，请稍候重试',
      });
    }
  }

  handleTabChanged(e) {
    const value = parseInt(e.target.value, 10);
    const { dispatch } = this.props;

    dispatch({
      type: 'addCustomer/updatePage',
      payload: {
        radioIndex: value,
      },
    });
  }
  handleLogChanged(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'addCustomer/updatePage',
      payload: {
        log: e.target.value,
      },
    });
  }
  showNewServiceRecordModal() {
    const { dispatch } = this.props;
    dispatch({
      type: 'addCustomer/showNewServiceRecordModal',
    });
  }
  handleCancelServiceRecordModal() {
    const { dispatch } = this.props;
    dispatch({
      type: 'addCustomer/handleCancelServiceRecordModal',
    });
  }

  commitCustomerServiceRecord() {
    const { dispatch } = this.props;
    const customerId = this.props.match.params.id;
    const { serviceContentInput, serviceTypeInput, viewServiceRecordId } = this.props.addCustomer;
    if (viewServiceRecordId) {
      dispatch({
        type: 'addCustomer/updateCustomerServiceRecord',
        payload: {
          customerId,
          serviceId: viewServiceRecordId,
          serviceContent: serviceContentInput,
          serviceType: serviceTypeInput,
        },
      });
    } else {
      dispatch({
        type: 'addCustomer/newCustomerServiceRecord',
        payload: {
          customerId,
          serviceContent: serviceContentInput,
          serviceType: serviceTypeInput,
        },
      });
    }
  }

  showDeleteRecordConfirm(id) {
    const { dispatch } = this.props;
    const customerId = this.props.match.params.id;
    Modal.confirm({
      title: '确定删除这条客勤日志?',
      onOk() {
        dispatch({
          type: 'addCustomer/deleteRecordConfirm',
          payload: {
            recordId: id,
            customerId,
          },
        });
      },
      onCancel() {
      },
    });
  }
  showCreateServiceTypeModal() {
    const { dispatch } = this.props;
    dispatch({
      type: 'addCustomer/showCreateServiceTypeModal',
    });
  }
  hideCreateServiceTypeModal() {
    const { dispatch } = this.props;
    dispatch({
      type: 'addCustomer/hideCreateServiceTypeModal',
    });
  }

  showCreateCondition() {
    const { dispatch } = this.props;
    dispatch({
      type: 'addCustomer/showCreateCondition',
    });
  }

  hideCreateCondition() {
    const { dispatch } = this.props;
    dispatch({
      type: 'addCustomer/hideCreateCondition',
    });
  }

  createServiceType() {
    const { dispatch } = this.props;
    const { createServiceType } = this.props.addCustomer;
    dispatch({
      type: 'addCustomer/createServiceType',
      payload: {
        serviceTypeName: createServiceType,
      },
    });
  }

  createCondition=() => {
    const { dispatch } = this.props;
    const { createCondition } = this.props.addCustomer;
    dispatch({
      type: 'addCustomer/createCondition',
      payload: {
        payCondition: createCondition,
      },
    });
  }

  // 点击保存按钮
  commit() {
    const { dispatch, addCustomer } = this.props;

    let requiredParams = pick(addCustomer, 'mobile', 'customerName', 'companyName', 'province', 'city', 'shopFront', 'license');

    if (addCustomer.customerId > 0) {
      requiredParams = {};
    }

    for (const key in requiredParams) {
      if (!requiredParams[key] || (typeof requiredParams[key] === 'string' && !xmTrim(requiredParams[key]))) {
        notification.error({
          message: `缺少必填字段${key}，请检查所有带*项是否填写`,
        });
        return;
      }
    }
    dispatch({
      type: 'addCustomer/commit',
      payload: {
        ...addCustomer,
      },
    });
  }
  showServiceRecordDetail(record) {
    const { dispatch } = this.props;
    dispatch({
      type: 'addCustomer/showServiceRecordDetail',
      payload: {
        viewServiceRecord: record,
        viewServiceRecordId: record.serviceRecordId,
      },
    });
  }

  showCreateSystemModal() {
    const { dispatch } = this.props;
    dispatch({
      type: 'addCustomer/showCreateSystemModal',
    });
  }

  hideCreateSystemModal() {
    const { dispatch } = this.props;
    dispatch({
      type: 'addCustomer/hideCreateSystemModal',
    });
  }

  createSystem() {
    const { dispatch } = this.props;
    const { createSystem } = this.props.addCustomer;
    dispatch({
      type: 'addCustomer/createSystem',
      payload: {
        name: createSystem,
      },
    });
  }
  handleSelectReason=(e)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'addCustomer/updatePageReducer',
      payload: {
        refuseType: e,
      },
    });
  }


  render() {
    const {
      addCustomer: {
        customerId, // 客户ID
        userName, // 账号
        mobile, // 手机号码
        password, // 密码
        customerSystem, // 所属体系
        customerName, // 客户姓名
        duty, // 职位
        companyName, // 公司名称
        storeNum, // 店铺数量
        customerType, // 客户类型
        importedPercent, // 进口品占比
        saleAmountPerMonth, // 月销售额
        channel, // 了解小美诚品的渠道
        userRank, // 客户级别
        checkStatus, // 客户审核状态
        sex, // 性别
        birthday, // 生日
        contact, // 联系人姓名
        shopFront, // 门头照片
        license, // 营业执照照片

        seller, // 绑定的销售
        sellerLeader, // 绑定的销售主管

        remark, // 备注

        sendSms, // 是否发送审核短信给客户
        log, // 审核客勤日志
        area, // 省市的数组

        showCreditInfo, // 登录用户权限
        payConditionMap,

        customerPayTypeMap, // 客户类型配置项
        customerPayType, // 客户类型
        payCondition, // 账期条件
        hasContract, // 是否签订合同

        dutyMap, // 职位的配置项
        typeMap, // 客户类型配置项
        systemMap, // 所属体系配置项
        importedPercentMap, // 进口品占比配置项
        saleAmountPerMonthMap, // 月销售额配置项
        channelMap, // 客户知道小美的渠道配置项
        userRankMap, // 客户级别配置项
        sellerMap, // 绑定销售配置项
        sellerTeamMap, // 绑定销售主管配置项
        isCheckedStatusMap, // 审核状态配置项
        sexMap, // 性别配置项

        isLoading,

        serviceRecord,
        isShowNewServiceRecordModal,
        serviceTypeMap,
        confirmLoading,
        viewServiceRecordId,
        serviceTypeInput,
        serviceContentInput,
        isShowCreateServiceTypeModal,
        isShowCreateSystemModal,
        isCreateCondition,

        showRadio,
        radioIndex,
        hidden, // “所属销售”与“印象认知” 显示与隐藏
        refuseMap,
        refuseType,
        agentMap,
        sellerPhoneMap,
        assistantId,
        areaManagerId,
        provinceManagerId,
        stateManagerId,
        areaAgentId,
      },
    } = this.props;
    const provinceAndCityList = getProvinceAndCity();
    const dateFormat = 'YYYY-MM-DD';

    const uploadShopFrontButton = (
      <div>
        <Icon type={isLoading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传门头照片</div>
      </div>
    );

    const uploadLicenseButton = (
      <div>
        <Icon type={isLoading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传营业执照</div>
      </div>
    );

    const { TextArea } = Input;
    const RadioButton = Radio.Button;
    const RadioGroup = Radio.Group;
    const isCreate = customerId === 0;
    let businessInfo = null;
    if (isCreate) {
      businessInfo = (
        <Col span={8}>
          {/* <Row>
            <Col span={4}>
              <span style={{ color: 'red' }}>*</span><span>所属销售组:</span>
            </Col>
            <Col>
              <Select
                value={sellerTeamMap[sellerLeader]}
                onChange={this.handleSelectChanged.bind(this, 'sellerLeader')}
                style={{ width: 260 }}
              >
                <Option value={0}>请选择客户所属销售分组</Option>
                {
                  Object.keys(sellerTeamMap).map((sellerTeamId) => {
                    return (
                      <Option value={sellerTeamId}>{sellerTeamMap[sellerTeamId]}</Option>
                    );
                  })
                }
              </Select>
            </Col>
          </Row> */}
          <Row style={{ marginTop: 10 }}>
            <Col span={4}>
              <span>印象认知:</span>
            </Col>
            <Col>
              <TextArea rows={3} style={{ width: 400 }} value={remark} onChange={this.handleInputChanged.bind(this, 'remark')} />
            </Col>
          </Row>
        </Col>
      );
    } else {
      businessInfo = (
        <Col span={8}>
          {
            // hidden ? '' :
            // <div>
            //   <Row style={{ marginTop: 10 }}>
            //     <Col span={4}>
            //       <span>所属销售:</span>
            //     </Col>
            //     <Col>
            //       <Select
            //         value={sellerMap[seller]}
            //         onChange={this.handleSelectChanged.bind(this, 'seller')}
            //         style={{ width: 260 }}
            //       >
            //         <Option value={0}>请选择销售</Option>
            //         {
            //           Object.keys(sellerMap).map((sellerId) => {
            //             return (
            //               <Option value={sellerId}>{sellerMap[sellerId]}</Option>
            //             );
            //           })
            //         }
            //       </Select>
            //     </Col>
            //   </Row>
            //   <Row style={{ marginTop: 10 }}>
            //     <Col span={4}>
            //       <span>印象认知:</span>
            //     </Col>
            //     <Col>
            //       <TextArea rows={3} style={{ width: 400 }} value={remark} onChange={this.handleInputChanged.bind(this, 'remark')} />
            //     </Col>
            //   </Row>
            // </div>
            <Row style={{ marginTop: 10 }}>
              <Col span={4}>
                <span>印象认知:</span>
              </Col>
              <Col>
                <TextArea rows={3} style={{ width: 400 }} value={remark} onChange={this.handleInputChanged.bind(this, 'remark')} />
              </Col>
            </Row>
          }
          <Row style={{ marginTop: 10 }}>
            <Col span={4}>
              <span>审核状态:</span>
            </Col>
            <Col span={8}>
              <Select
                value={isCheckedStatusMap[checkStatus]}
                onChange={this.handleSelectChanged.bind(this, 'checkStatus')}
                style={{ width: 160 }}
              >
                <Option value={0}>请选择审核状态</Option>
                {
                  Object.keys(isCheckedStatusMap).map((checkStatusId) => {
                    return (
                      <Option value={checkStatusId}>{isCheckedStatusMap[checkStatusId]}</Option>
                    );
                  })
                }
              </Select>
            </Col>
            <Col>
              <Checkbox
                onChange={this.handCheckBoxChanged.bind(this)}
                checked={sendSms}
              >发送审核状态短信给客户
              </Checkbox>
            </Col>
          </Row>
          {
            checkStatus == 1? <Row style={{ marginTop: 10 }}>
              <Col span={4}>
                <span>拒绝原因:</span>
              </Col>
              <Col>
                <Select
                value={refuseMap[refuseType]}
                onChange={this.handleSelectReason}
                style={{width:300}}
                >
                  {
                      Object.keys(refuseMap).map((refuseType) => {
                        return (
                          <Option value={refuseType}>{refuseMap[refuseType]}</Option>
                        );
                      })
                  }
                  
                </Select>
              </Col>
            </Row>:""
          }
         
          <Row style={{ marginTop: 10 }}>
            <Col span={4}>
              <span>客勤日志:</span>
            </Col>
            <Col>
              <TextArea rows={3} style={{ width: 400 }} value={log} onChange={this.handleLogChanged.bind(this)} />
            </Col>
          </Row>
          {/* 2018.08.04新增 */}
          {
            showCreditInfo === 0 ? (
              <div />
            ) : (customerPayType >= 1 && showCreditInfo === 1 ? (
              <div>
                <Row>
                  <Col span={4} style={{ marginTop: 10 }}>
                    <span>客户类型：</span>
                  </Col>
                  <Col span={8} style={{ marginTop: 10 }}>
                    <Select
                      style={{ width: 160 }}
                      value={customerPayTypeMap[customerPayType]}
                      onChange={this.handleSelectChanged.bind(this, 'customerPayType')}
                    >
                      {
                  Object.keys(customerPayTypeMap).map((customerPayTypeMapId) => {
                    return (
                      <Option value={customerPayTypeMapId}>{customerPayTypeMap[customerPayTypeMapId]}</Option>
                    );
                  })
                }
                    </Select>
                  </Col>
                </Row>
                <Row>
                  <Col span={4} style={{ marginTop: 10 }}>
                    <span>账期条件：</span>
                  </Col>
                  <Col span={8} style={{ marginTop: 10 }}>
                    <Select
                      value={payConditionMap[payCondition]}
                      style={{ width: 120 }}
                      onChange={this.handleSelectChanged.bind(this, 'payCondition')}
                      placeholder="请选择账期条件"
                    >
                      {
                   Object.keys(payConditionMap).map((payConditionId) => {
                     return (
                       <Option value={payConditionId}>{payConditionMap[payConditionId]}

                       </Option>
                     );
                   })
                 }
                    </Select>
                    <span className={styles.addcondition} onClick={this.showCreateCondition.bind(this)}>新增</span>
                  </Col>
                </Row>

                <Row>
                  <Col span={10} style={{ marginTop: 10 }}>
                    <span>合同是否签订：</span>
                    <RadioGroup
                      onChange={this.handleInputChanged.bind(this, 'hasContract')}
                      name="hasContract"
                      value={hasContract}
                    >
                      <Radio value={0}>否</Radio>
                      <Radio value={1}>是</Radio>
                    </RadioGroup>
                  </Col>
                </Row>
              </div>
          ) : (
            <Row>
              <Col span={4} style={{ marginTop: 10 }}>
                <span>客户类型：</span>
              </Col>
              <Col span={8} style={{ marginTop: 10 }}>
                <Select
                  style={{ width: 160 }}
                  onChange={this.handleSelectChanged.bind(this, 'customerPayType')}
                  value={customerPayTypeMap[customerPayType]}
                >
                  {
                Object.keys(customerPayTypeMap).map((customerPayTypeMapId) => {
                  return (
                    <Option value={customerPayTypeMapId}>{customerPayTypeMap[customerPayTypeMapId]}</Option>
                  );
                })
              }
                </Select>
              </Col>
            </Row>
          ))
          }


        </Col>
      );
    }

    const serviceColumns = [
      {
        title: '客勤ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '创建业务员',
        dataIndex: 'sellerName',
        key: 'sellerName',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
      },
      {
        title: '客勤类型',
        dataIndex: 'type',
        key: 'type',
        render: (type) => {
          return (
            <span>{serviceTypeMap[type]}</span>
          );
        },
      },
      {
        title: '任务内容详情',
        dataIndex: 'content',
        key: 'content',
      },
      {
        title: '最后修改时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (_, record) => {
          return (
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item>
                    <div onClick={() => this.showServiceRecordDetail(record)}>
                      详情
                    </div>
                  </Menu.Item>
                  <Menu.Item>
                    <div onClick={() => this.showDeleteRecordConfirm(record.serviceRecordId)}>
                      删除
                    </div>
                  </Menu.Item>
                </Menu>
              }
              placement="bottomRight"
            >
              <Icon type="ellipsis" />
            </Dropdown>
          );
        },
      },
    ];

    let radioRender = null;
    if (showRadio) {
      radioRender = (
        <RadioGroup onChange={this.handleTabChanged.bind(this)} defaultValue="0">
          <RadioButton value="0">客户信息</RadioButton>
          <RadioButton value="1">客勤日志</RadioButton>
        </RadioGroup>
      );
    } else {
      radioRender = (
        <RadioGroup onChange={this.handleTabChanged.bind(this)} defaultValue="0" className={styles.hidden}>
          <RadioButton value="0">客户信息</RadioButton>
          <RadioButton value="1">客勤日志</RadioButton>
        </RadioGroup>
      );
    }

    const shopFrontAction = `${getUrl(API_ENV)}/customer/customer/upload-shop-front`;
    const licenseAction = `${getUrl(API_ENV)}/customer/customer/upload-license`;

    const uploadHeaders = {
      authorization: `Basic ${window.btoa(`${localStorage.getItem('token')}:`)}`,
    };

    return (
      <PageHeaderLayout title={isCreate ? '新增客户' : '修改客户'}>
        {radioRender}
        <Row>
          <Card bordered={false} title="客户信息" className={radioIndex === 1 ? styles.hidden : ''}>
            <Row>
              <Col span={16}>
                <Col span={2}>
                  账户名:
                </Col>
                <Col span={22}>
                  <Input
                    placeholder="账户名由系统生成"
                    value={userName}
                    onChange={this.handleInputChanged.bind(this, 'userName')}
                    style={{ width: 260 }}
                    disabled
                  />
                </Col>
              </Col>
              <Col span={8}>
                <Col span={4}>
              店铺数量:
                </Col>
                <Col>
                  <Input
                    placeholder="请输入店铺数量"
                    value={storeNum}
                    onChange={this.handleInputChanged.bind(this, 'storeNum')}
                    style={{ width: 260 }}
                  />
                </Col>
              </Col>
            </Row>

            <Row style={{ marginTop: 10 }}>
              <Col span={16}>
                <Col span={2}>
                  <span style={{ color: 'red' }}>*</span>登录账号:
                </Col>
                <Col span={22}>
                  <Input
                    placeholder="请填入客户手机号码"
                    value={mobile}
                    onChange={this.handleInputChanged.bind(this, 'mobile')}
                    style={{ width: 260 }}
                    disabled={!isCreate}
                  />
                  <span style={{ marginLeft: 10 }}>唯一登录凭证，保存后不可修改</span>
                </Col>
              </Col>
              <Col span={8}>
                <Col span={4}>
                客户类型:
                </Col>
                <Col>
                  <Select
                    value={typeMap[customerType]}
                    onChange={this.handleSelectChanged.bind(this, 'customerType')}
                    style={{ width: 260 }}
                  >
                    <Option value={0}>请选择客户类型</Option>
                    {
                    Object.keys(typeMap).map((typeId) => {
                      return (
                        <Option value={typeId}>{typeMap[typeId]}</Option>
                      );
                    })
                  }
                  </Select>
                </Col>
              </Col>
            </Row>

            <Row style={{ marginTop: 10 }}>
              <Col span={16}>
                <Col span={2}>
                  密码:
                </Col>
                <Col span={2}>
                  <Input
                    placeholder="如果要修改密码请输入新的密码，否则请留空"
                    value={password}
                    onChange={this.handleInputChanged.bind(this, 'password')}
                    style={{ width: 260 }}
                    disabled={!isCreate}
                  />
                </Col>
              </Col>
              <Col span={8}>
                <Col span={4}>
                所属体系:
                </Col>
                <Col>
                  <Select
                    value={customerSystem > 0 ? systemMap[customerSystem] : 0}
                    onChange={this.handleSelectChanged.bind(this, 'customerSystem')}
                    style={{ width: 260 }}
                  >
                    <Option value={0}>请选择客户所属体系</Option>
                    {
                      Object.keys(systemMap).map((systemId) => {
                        return (
                          <Option value={systemId}>{systemMap[systemId]}</Option>
                        );
                      })
                    }
                  </Select>
                  <Button style={{ marginLeft: 10 }} onClick={this.showCreateSystemModal.bind(this)}>新建</Button>
                </Col>
              </Col>
            </Row>

            <Row style={{ marginTop: 10 }}>
              <Col span={16}>
                <Col span={2}>
                  <span style={{ color: 'red' }}>*</span>客户名称:
                </Col>
                <Col span={6}>
                  <Input
                    value={customerName}
                    onChange={this.handleInputChanged.bind(this, 'customerName')}
                    style={{ width: 260 }}
                  />
                </Col>
                <Col span={16}>
                  <Select
                    value={dutyMap[duty]}
                    onChange={this.handleSelectChanged.bind(this, 'duty')}
                    style={{ width: 260, marginLeft: 10 }}
                  >
                    <Option value={0}>请选择客户职位</Option>
                    {
                      Object.keys(dutyMap).map((dutyId) => {
                        return (
                          <Option value={dutyId}>{dutyMap[dutyId]}</Option>
                        );
                      })
                    }
                  </Select>
                </Col>
              </Col>
              <Col span={8}>
                <Col span={4}>
                进口品占比:
                </Col>
                <Col>
                  <Select
                    value={importedPercentMap[importedPercent]}
                    onChange={this.handleSelectChanged.bind(this, 'importedPercent')}
                    style={{ width: 260 }}
                  >
                    <Option value={0}>请选择进口品占比</Option>
                    {
                    Object.keys(importedPercentMap).map((importedPercentId) => {
                      return (
                        <Option value={importedPercentId}>{importedPercentMap[importedPercentId]}</Option>
                      );
                    })
                  }
                  </Select>
                </Col>
              </Col>
            </Row>

            <Row style={{ marginTop: 10 }}>
              <Col span={16}>
                <Col span={2}>
                  <span style={{ color: 'red' }}>*</span>店铺名称:
                </Col>
                <Col span={22}>
                  <Input
                    value={companyName}
                    onChange={this.handleInputChanged.bind(this, 'companyName')}
                    style={{ width: 260 }}
                  />
                </Col>
              </Col>
              <Col span={8}>
                <Col span={4}>
                月营业额:
                </Col>
                <Col>
                  <Select
                    value={saleAmountPerMonthMap[saleAmountPerMonth]}
                    onChange={this.handleSelectChanged.bind(this, 'saleAmountPerMonth')}
                    style={{ width: 260 }}
                  >
                    <Option value={0}>请选择月营业额</Option>
                    {
                    Object.keys(saleAmountPerMonthMap).map((saleAmountPerMonthId) => {
                      return (
                        <Option value={saleAmountPerMonthId}>{saleAmountPerMonthMap[saleAmountPerMonthId]}</Option>
                      );
                    })
                  }
                  </Select>
                </Col>
              </Col>
            </Row>

            <Row style={{ marginTop: 10 }}>
              <Col span={16}>
                <Col span={2}>
                  <span style={{ color: 'red' }}>*</span>归属地区:
                </Col>
                <Col span={22}>
                  <Cascader
                    expandTrigger="hover"
                    options={provinceAndCityList}
                    style={{ width: 260 }}
                    placeholder=""
                    value={area}
                    onChange={this.handleAreaChanged.bind(this, 'area')}
                  />
                </Col>
              </Col>
              <Col span={8}>
                <Col span={4}>
                了解渠道:
                </Col>
                <Col>
                  <Select
                    value={channelMap[channel]}
                    onChange={this.handleSelectChanged.bind(this, 'channel')}
                    style={{ width: 260 }}
                  >
                    <Option value={0}>请选择客户了解到小美的渠道</Option>
                    {
                    Object.keys(channelMap).map((channelId) => {
                      return (
                        <Option value={channelId}>{channelMap[channelId]}</Option>
                      );
                    })
                  }
                  </Select>
                </Col>
              </Col>
            </Row>

            <Row style={{ marginTop: 10 }}>
              <Col span={16}>
                <Col span={2}>
                联系方式:
                </Col>
                <Col span={22}>
                  <Input
                    placeholder="请填写微信号，QQ，邮箱等联系方式"
                    value={contact}
                    onChange={this.handleInputChanged.bind(this, 'contact')}
                    style={{ width: 260 }}
                  />
                </Col>
              </Col>
              <Col span={8}>
                <Col span={4}>
                会员等级:
                </Col>
                <Col>
                  <Select
                    value={userRankMap[userRank]}
                    onChange={this.handleSelectChanged.bind(this, 'userRank')}
                    style={{ width: 260 }}
                  >
                    <Option value={0}>请选择会员等级</Option>
                    {
                    Object.keys(userRankMap).map((rankId) => {
                      return (
                        <Option value={rankId}>{userRankMap[rankId]}</Option>
                      );
                    })
                  }
                  </Select>
                </Col>
              </Col>
            </Row>

            <Row style={{ marginTop: 10 }}>
              <Col span={16}>
                <Col span={2}>
                性别:
                </Col>
                <Col span={22}>
                  <Select
                    value={sexMap[sex]}
                    onChange={this.handleSelectChanged.bind(this, 'sex')}
                    style={{ width: 260 }}
                  >
                    <Option value={0}>请选择客户性别</Option>
                    {
                    Object.keys(sexMap).map((sexId) => {
                      return (
                        <Option value={sexId}>{sexMap[sexId]}</Option>
                      );
                    })
                  }
                  </Select>

                  <span style={{ marginLeft: 10 }}>生日:</span>
                  <DatePicker
                    format={dateFormat}
                    value={parseInt(birthday, 10) ? moment(birthday, dateFormat) : null}
                    onChange={this.handleBirthdayChanged.bind(this)}
                    style={{ width: 260, marginLeft: 10 }}
                  />
                </Col>
              </Col>
            </Row>

            <Row style={{ marginTop: 40 }}>
              <Col span={16}>
                <span style={{ fontSize: '16px' }}>资质认证</span>
              </Col>
              <Col>
                <span style={{ fontSize: '16px' }}>业务信息</span>
              </Col>
            </Row>

            <Row style={{ marginTop: 20 }}>
              <Col span={16}>
                <Col span={2}>
                  <span style={{ color: 'red' }}>*</span><span>资质证件:</span>
                </Col>
                <Col span={4}>
                  <Upload
                    name="file"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    action={shopFrontAction}
                    onChange={this.handleUploadChanged.bind(this, 'shopFront')}
                    beforeUpload={this.beforeUpload.bind(this)}
                    headers={uploadHeaders}
                    style={{ width: '100px', height: '100px' }}
                  >
                    {shopFront ? <img src={shopFront} alt="shopFront" style={{ width: '100%', height: '100%' }} /> : uploadShopFrontButton}
                  </Upload>
                </Col>
                <Col>
                  <Upload
                    name="file"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    action={licenseAction}
                    onChange={this.handleUploadChanged.bind(this, 'license')}
                    beforeUpload={this.beforeUpload.bind(this)}
                    headers={uploadHeaders}
                    style={{ width: '100px', height: '100px' }}
                  >
                    {license ? <img src={license} alt="license" style={{ width: '100%', height: '100%' }} /> : uploadLicenseButton}
                  </Upload>
                </Col>
              </Col>
              {businessInfo}
            </Row>
            <Row style={{ marginTop: 40 }}>
              <Col span={16}>
                <span style={{ fontSize: '16px' }}>绑定设置</span>
              </Col>
            </Row>
            <Row style={{ marginTop: 20 }}>
              <Col span={16}>
                  <Row style={{ marginBottom: 20 }}>
                    所属区域经理：
                    <Select 
                    style={{width:250,marginRight:20}}
                    allowClear
                    dropdownMatchSelectWidth={false}
                    value={sellerPhoneMap[areaManagerId]}
                    onChange={this.handleSelectChanged.bind(this,'areaManagerId')}
                    filterOption={(input, option) => {
                      return option.props.children.indexOf(input) >= 0;
                    }}
                    >
                      {
                        Object.keys(sellerPhoneMap).map((item) => {
                          return (
                            <Option value={item}>{sellerPhoneMap[item]}</Option>
                          );
                        })
                      }
                    </Select>
                    所属省区经理：
                    <Select
                    style={{width:250}}
                    allowClear
                    value={sellerPhoneMap[provinceManagerId]}
                    dropdownMatchSelectWidth={false}
                    onChange={this.handleSelectChanged.bind(this,'provinceManagerId')}
                    filterOption={(input, option) => {
                      return option.props.children.indexOf(input) >= 0;
                    }}
                    >
                      {
                        Object.keys(sellerPhoneMap).map((item) => {
                          return (
                            <Option value={item}>{sellerPhoneMap[item]}</Option>
                          );
                        })
                      }
                    </Select>
                  </Row>
                  <Row style={{ marginBottom: 20 }}>
                    所属城区经理：
                    <Select
                    style={{width:250,marginRight:20}}
                    allowClear
                    value={sellerPhoneMap[stateManagerId]}
                    dropdownMatchSelectWidth={false}
                    onChange={this.handleSelectChanged.bind(this,'stateManagerId')}
                    filterOption={(input, option) => {
                      return option.props.children.indexOf(input) >= 0;
                    }}
                    >
                      {
                        Object.keys(sellerPhoneMap).map((item) => {
                          return (
                            <Option value={item}>{sellerPhoneMap[item]}</Option>
                          );
                        })
                      }
                    </Select>
                    所属内勤人员：
                    <Select
                    style={{width:250}}
                    allowClear
                    dropdownMatchSelectWidth={false}
                    value={sellerPhoneMap[seller]}
                    onChange={this.handleSelectChanged.bind(this,'seller')}
                    filterOption={(input, option) => {
                      return option.props.children.indexOf(input) >= 0;
                    }}
                    >
                      {
                        Object.keys(sellerPhoneMap).map((item) => {
                          return (
                            <Option value={item}>{sellerPhoneMap[item]}</Option>
                          );
                        })
                      }
                    </Select>
                  </Row>
                  <Row style={{ marginBottom: 20 }}>
                    所属经销商：
                    <Select
                    style={{width:250}}
                    allowClear
                    value={agentMap[areaAgentId]}
                    dropdownMatchSelectWidth={false}
                    onChange={this.handleSelectChanged.bind(this,'areaAgentId')}
                    filterOption={(input, option) => {
                      return option.props.children.indexOf(input) >= 0;
                    }}
                    >
                      {
                        Object.keys(agentMap).map((agentId) => {
                          return (
                            <Option value={agentId}>{agentMap[agentId]}</Option>
                          );
                        })
                      }
                    </Select>
                  </Row>
              </Col>
            </Row>
            <Row>
              <Col span={1}>
                <Button type="primary" onClick={this.commit.bind(this)}>保存</Button>
              </Col>
              <Col>
                <Link to="/customer/customer-list">
                  <Button>取消</Button>
                </Link>
              </Col>
            </Row>
          </Card>
          <Card className={radioIndex === 0 ? styles.hidden : ''}>
            <div className={styles.extraButton}>
              <Button
                type="primary"
                ghost
                onClick={this.showNewServiceRecordModal.bind(this)}
              >
                新建客勤
              </Button>
            </div>
            <Table
              bordered
              rowKey={record => record.serviceRecordId}
              columns={serviceColumns}
              dataSource={serviceRecord}
              pagination={false}
            />
          </Card>

          {/* 新建客勤modal */}
          <Modal
            title="客情详情"
            visible={isShowNewServiceRecordModal}
            onOk={this.commitCustomerServiceRecord.bind(this)}
            confirmLoading={confirmLoading}
            onCancel={this.handleCancelServiceRecordModal.bind(this)}
            okText={viewServiceRecordId ? '更新' : '发布'}
            width="50%"
          >
            <div>
              <div style={{ display: 'inline-block' }}>
                <Icon type="file-text" style={{ fontSize: '20px', margin: '0 5px' }} />
                <span>客勤类型</span>
              </div>
              <div style={{ display: 'inline-block', marginLeft: '100px' }}>
                <Select
                  value={serviceTypeMap[serviceTypeInput]}
                  placeholder="请选择客勤类型"
                  style={{ width: 200 }}
                  onChange={this.getServiceTypeValue.bind(this)}
                >
                  {
                    Object.keys(serviceTypeMap).map(
                      item => (
                        <Option
                          key={item}
                          value={item}
                        >
                          {serviceTypeMap[item]}
                        </Option>
                      )
                    )
                  }
                </Select>
                <span className="primary" style={{ marginLeft: '10px', color: '#169BD5', cursor: 'pointer' }} onClick={this.showCreateServiceTypeModal.bind(this)}>新建</span>
              </div>
            </div>
            <TextArea
              name="serviceContent"
              style={{ width: '100%', margin: '15px 0' }}
              rows={6}
              placeholder="请在这里输入任务内容详情"
              value={serviceContentInput}
              // value={viewServiceRecordId ? viewServiceRecord.serviceContent : ''}
              onChange={this.getServiceContentValue.bind(this)}
            />
            <div style={{ background: '#F2F2F2', border: '1px solid rgb(169, 169, 169)', height: '100px', padding: '10px 20px' }}>
              <h3 style={{ color: '#999', fontWeight: 'bold', fontSize: '16px', display: 'inline-block', paddingRight: '10px' }}>绑定客户</h3>
              <span>(1)</span>
              <p>{customerName}</p>
            </div>
          </Modal>

          <Modal
            title="新建客勤类型"
            visible={isShowCreateServiceTypeModal}
            confirmLoading={confirmLoading}
            onCancel={this.hideCreateServiceTypeModal.bind(this)}
            onOk={this.createServiceType.bind(this)}
          >
            <Input placeholder="请输入客勤类型" onChange={this.getCreateServiceTypeValue.bind(this)} />
          </Modal>

          <Modal
            title="新建客户系统"
            visible={isShowCreateSystemModal}
            confirmLoading={confirmLoading}
            onCancel={this.hideCreateSystemModal.bind(this)}
            onOk={this.createSystem.bind(this)}
          >
            <Input placeholder="请输入客户系统名称" onChange={this.getCreateSystemValue.bind(this)} />
          </Modal>
          {/* 新增账期条件 */}
          <Modal
            title="新建账期条件"
            visible={isCreateCondition}
            confirmLoading={confirmLoading}
            onCancel={this.hideCreateCondition.bind(this)}
            onOk={this.createCondition.bind(this)}
          >
            <Input placeholder="请输入账期条件" onChange={this.getCreateCondition.bind(this)} />
          </Modal>

        </Row>

      </PageHeaderLayout>
    );
  }
}

