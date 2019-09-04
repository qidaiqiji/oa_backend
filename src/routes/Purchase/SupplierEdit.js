import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import {
  Card,
  Row,
  Col,
  DatePicker,
  Input,
  Select,
  Button,
  Cascader,
  Radio,
  Icon,
} from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './SupplierEdit.less';
import addressOptions from '../../area.json';

const { Option } = Select;
const { TextArea } = Input;
const { Group: RadioGroup } = Radio;

@connect(state => ({
  supplierEdit: state.supplierEdit,
}))
export default class SupplierEdit extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    const { id } = this.props.match.params;
    if (id) {
      dispatch({
        type: 'supplierEdit/getSupplierInfo',
        payload: {
          id,
        },
      });
    }
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierEdit/unmount',
    });
  }
  handleChange(type, ...rest) {
    const { dispatch } = this.props;
    switch (type) {
      case 'address':
      case 'supplierLevel':
        dispatch({
          type: 'supplierEdit/change',
          payload: {
            [type]: rest[0],
          },
        });
        break;
      case 'contractExpire':
        dispatch({
          type: 'supplierEdit/change',
          payload: {
            [type]: moment(rest[0]).format('YYYY-MM-DD'),
          },
        });
        break;
      case 'financeRemark':
        dispatch({
          type: 'supplierEdit/changeFinanceRemark',
          payload: {
            value: rest[1].target.value,
            index: rest[0],
          },
        });
        break;
      case 'reduceFinanceMark':
        dispatch({
          type: 'supplierEdit/reduceFinanceMark',
          payload: {
            index: rest[0],
          },
        });
        break;
      case 'plusFinanceMark':
        dispatch({
          type: 'supplierEdit/plusFinanceMark',
        });
        break;
      default:
        dispatch({
          type: 'supplierEdit/change',
          payload: {
            [type]: rest[0].target.value,
          },
        });
        break;
    }
  }
  handleSaveSupplier() {
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierEdit/saveSupplier',
    });
  }
  render() {
    const {
      supplierEdit: {
        id,
        supplierName,
        address,
        sn,
        contractExpire,
        supplierLevel,
        status,
        linkmanQQ,
        linkmanName,
        linkmanEmail,
        linkmanMobile,
        linkmanJob,
        depositBank,
        depositName,
        financeRemarks,
        bankNum,
        invoiceTitle,
        remark,
        isLoading,
      },
    } = this.props;
    return (
      <PageHeaderLayout
        title={this.props.match.params.id ? '修改供应商' : '新增供应商'}
      >
        <Card bordered={false}>
          <Card loading={isLoading} title="基础信息" style={{ marginTop: 20 }}>
            <Row gutter={{ md: 24 }}>
              <Col md={10}>
                <Row style={{ marginTop: 10 }}>
                  <span style={{ color: 'red' }}>*</span>名称:
                  <Input
                    style={{ width: 200, marginLeft: 10 }}
                    value={supplierName}
                    onChange={this.handleChange.bind(this, 'supplierName')}
                  />
                </Row>
                <Row style={{ marginTop: 10 }}>
                  区域:
                  <Cascader
                    expandTrigger="hover"
                    options={addressOptions.data}
                    value={address}
                    style={{ width: 200, marginLeft: 10 }}
                    placeholder=""
                    onChange={this.handleChange.bind(this, 'address')}
                  />
                </Row>
                <Row style={{ marginTop: 10 }}>
                  合同到期时间:
                  <DatePicker
                    // value={
                    //   contractExpire ? moment(contractExpire, 'YYYY-MM-DD') : ''
                    // }
                    // allowClear={false}
                    style={{ width: 200, marginLeft: 10 }}
                    onChange={this.handleChange.bind(this, 'contractExpire')}
                  />
                </Row>
                <Row style={{ marginTop: 10 }}>
                  状态:
                  <RadioGroup
                    style={{ marginLeft: 10 }}
                    value={+status}
                    onChange={this.handleChange.bind(this, 'status')}
                  >
                    <Radio value={1}>启用</Radio>
                    <Radio value={0}>禁用</Radio>
                  </RadioGroup>
                </Row>
              </Col>
              <Col md={10} offset={4}>
                {this.props.match.params.id && (
                  <Row style={{ marginTop: 10 }}>
                    编码ID:
                    <Input
                      disabled
                      style={{ width: 200, marginLeft: 10 }}
                      value={id}
                    />
                  </Row>
                )}
                <Row style={{ marginTop: 10 }}>
                  检索简码:
                  <Input
                    style={{ width: 200, marginLeft: 10 }}
                    value={sn}
                    onChange={this.handleChange.bind(this, 'sn')}
                  />
                </Row>
                <Row style={{ marginTop: 10 }}>
                  供应商星级:
                  <Select
                    style={{ width: 200, marginLeft: 10 }}
                    value={supplierLevel}
                    onChange={this.handleChange.bind(this, 'supplierLevel')}
                  >
                    <Option value={1}>1星</Option>
                    <Option value={2}>2星</Option>
                    <Option value={3}>3星</Option>
                    <Option value={4}>4星</Option>
                    <Option value={5}>5星</Option>
                  </Select>
                </Row>
              </Col>
            </Row>
          </Card>
          <Card
            loading={isLoading}
            title="联系人信息"
            style={{ marginTop: 20 }}
          >
            <Row>
              <Col md={10} style={{ marginTop: 10 }}>
                <span style={{ color: 'red' }}>*</span>姓名:
                <Input
                  style={{ width: 200, marginLeft: 10 }}
                  value={linkmanName}
                  onChange={this.handleChange.bind(this, 'linkmanName')}
                />
              </Col>
              <Col md={10} style={{ marginTop: 10 }} offset={4}>
                QQ:
                <Input
                  style={{ width: 200, marginLeft: 10 }}
                  value={linkmanQQ}
                  onChange={this.handleChange.bind(this, 'linkmanQQ')}
                />
              </Col>
              <Col md={10} style={{ marginTop: 10 }}>
                <span style={{ color: 'red' }}>*</span>手机:
                <Input
                  style={{ width: 200, marginLeft: 10 }}
                  value={linkmanMobile}
                  onChange={this.handleChange.bind(this, 'linkmanMobile')}
                />
              </Col>
              <Col md={10} style={{ marginTop: 10 }} offset={4}>
                Email:
                <Input
                  style={{ width: 200, marginLeft: 10 }}
                  value={linkmanEmail}
                  onChange={this.handleChange.bind(this, 'linkmanEmail')}
                />
              </Col>
              <Col md={10} style={{ marginTop: 10 }}>
                职位:
                <Input
                  style={{ width: 200, marginLeft: 10 }}
                  value={linkmanJob}
                  onChange={this.handleChange.bind(this, 'linkmanJob')}
                />
              </Col>
            </Row>
          </Card>
          <Card loading={isLoading} title="财务信息" style={{ marginTop: 20 }}>
            <Row>
              {financeRemarks.map((financeRemark, index) => (
                <Row style={{ marginBottom: 10 }}>
                  财务备注:
                  <Input
                    value={financeRemark}
                    style={{ width: 500, marginLeft: 10 }}
                    onChange={this.handleChange.bind(this, 'financeRemark', index)}
                  />
                  <Button style={{ marginLeft: 10 }} shape="circle" icon="plus" onClick={this.handleChange.bind(this, 'plusFinanceMark')} />
                  {financeRemarks.length !== 1 && <Button style={{ marginLeft: 10 }} shape="circle" icon="minus" onClick={this.handleChange.bind(this, 'reduceFinanceMark', index)} />}
                </Row>
              ))}
              {/* <Col md={10} style={{ marginTop: 10 }}>
                开户名称:
                <Input
                  style={{ width: 200, marginLeft: 10 }}
                  value={depositName}
                  onChange={this.handleChange.bind(this, 'depositName')}
                />
              </Col>
              <Col md={10} style={{ marginTop: 10 }} offset={4}>
                开户银行:
                <Input
                  style={{ width: 200, marginLeft: 10 }}
                  value={depositBank}
                  onChange={this.handleChange.bind(this, 'depositBank')}
                />
              </Col>
              <Col md={10} style={{ marginTop: 10 }}>
                银行账号:
                <Input
                  style={{ width: 200, marginLeft: 10 }}
                  value={bankNum}
                  onChange={this.handleChange.bind(this, 'bankNum')}
                />
              </Col>
              <Col md={10} style={{ marginTop: 10 }} offset={4}>
                发票抬头:
                <Input
                  style={{ width: 200, marginLeft: 10 }}
                  value={invoiceTitle}
                  onChange={this.handleChange.bind(this, 'invoiceTitle')}
                />
              </Col> */}
            </Row>
          </Card>
          <Card loading={isLoading} title="其他信息" style={{ marginTop: 20 }}>
            <Row>
              备注:
              <TextArea
                value={remark}
                onChange={this.handleChange.bind(this, 'remark')}
              />
            </Row>
          </Card>
        </Card>
        <Row
          style={{
            padding: '8px 24px',
            right: 24,
            left: 224,
            position: 'fixed',
            bottom: 0,
            backgroundColor: '#fff',
            height: 50,
          }}
          type="flex"
          align="middle"
        >
          <Button
            style={{ width: 100 }}
            type="primary"
            onClick={this.handleSaveSupplier.bind(this)}
          >
            保存
          </Button>
          <Link style={{ marginLeft: 15 }} to="/purchase/supplier-list">
            <Button style={{ width: 100 }} type="dashed">
              取消
            </Button>
          </Link>
        </Row>
      </PageHeaderLayout>
    );
  }
}
