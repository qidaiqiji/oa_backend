
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Input, DatePicker, Icon, Table, Row, Col, Select, Tooltip, Button } from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './SellerAdd.less';
import globalStyles from '../../assets/style/global.less';

const { Option } = Select;

@connect(state => ({
  sellerAdd: state.sellerAdd,
}))
export default class SellerAdd extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    const { id } = this.props.match.params;
    dispatch({
      type: 'sellerAdd/mount',
      payload: {
        userId: id,
      },
    });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'sellerAdd/unmount',
    });
  }
  // 事件
  handleChangeItem(type, e, dateString) {
    const { dispatch } = this.props;
    switch (type) {
      case 'salePhone':
        dispatch({
          type: 'sellerAdd/changeItem',
          payload: {
            [type]: e,
          },
        });
        break;
      case 'password':
        dispatch({
          type: 'sellerAdd/changeItem',
          payload: {
            [type]: e.target.value,
          },
        });
        break;
      case 'sellerName':
        dispatch({
          type: 'sellerAdd/changeItem',
          payload: {
            [type]: e.target.value,
          },
        });
        break;
      case 'englishName':
        dispatch({
          type: 'sellerAdd/changeItem',
          payload: {
            [type]: e.target.value,
          },
        });
        break;
      case 'email':
        dispatch({
          type: 'sellerAdd/changeItemEmail',
          payload: {
            [type]: e.target.value,
          },
        });
        break;
      case 'date':
        dispatch({
          type: 'sellerAdd/changeItem',
          payload: {
            entryTime: dateString,
          },
        });
        break;
      case 'duty':
        dispatch({
          type: 'sellerAdd/changeItem',
          payload: {
            [type]: e,
          },
        });
        break;
      case 'sellerLeader':
        dispatch({
          type: 'sellerAdd/changeItem',
          payload: {
            [type]: e,
          },
        });
        break;
      default:
        break;
    }
  }
  handleConfirmBtn() {
    const { dispatch } = this.props;
    dispatch({
      type: 'sellerAdd/saveSubmit',
    });
  }

  render() {
    const { sellerAdd: {
      id,
      userId,
      salePhone,
      password,
      sellerName,
      entryTime,
      duty,
      sellerLeader,
      isLoading,
      sellerDutyMap,
      sellerLeaderMap,
      sellerPhoneMap,
      englishName,
      email,
      red,
    } } = this.props;
    return (
      <PageHeaderLayout title={userId ? '修改销售员' : '新增销售员'}>
        <Card bordered={false}>
          <Row style={{ marginTop: 20 }}>
            <h3 style={{ width: '100px', color: '#169BD5', textAlign: 'right' }}>销售员信息</h3>
          </Row>
          <Row style={{ marginTop: 15 }}>
            <span className={styles['input-title']}><i style={{ color: 'red' }}>*</i>登录账号</span>

            <Select
              value={userId ? salePhone : sellerPhoneMap[salePhone]}
              className={globalStyles['select-sift']}
              style={{ width: '200px' }}
              disabled={userId}
              placeholder="请选择销售手机号码"
              onChange={this.handleChangeItem.bind(this, 'salePhone')}
            >
              {
                Object.keys(sellerPhoneMap).map((sellerPhoneId) => {
                  return (
                    <Option value={sellerPhoneId}>{sellerPhoneMap[sellerPhoneId]}</Option>
                  );
                })
              }
            </Select>
            <span style={{ marginLeft: 20, color: 'rgb(193, 188, 188)' }}>业务手机号作为登录后台唯一凭证</span>
          </Row>
          <Row style={{ marginTop: 20 }}>
            <span className={styles['input-title']}>密码</span>
            <Input
              value={password}
              style={{ width: '200px' }}
              placeholder="不填写为原密码"
              onChange={this.handleChangeItem.bind(this, 'password')}
            />
          </Row>
          <Row style={{ marginTop: 20 }}>
            <span className={styles['input-title']}><i style={{ color: 'red' }}>*</i>销售员</span>
            <Input
              value={sellerName}
              style={{ width: '200px' }}
              onChange={this.handleChangeItem.bind(this, 'sellerName')}
            />
          </Row>
          <Row style={{ marginTop: 20 }}>
            <span className={styles['input-title']}>邮箱</span>
            <Input
              value={email}
              style={{ width: '200px' }}
              onChange={this.handleChangeItem.bind(this, 'email')}
            />
            <span style={{ color: red, marginLeft: 20 }} >请输入合法的邮箱格式</span>
          </Row>
          <Row style={{ marginTop: 20 }}>
            <span className={styles['input-title']}>英文名</span>
            <Input
              value={englishName}
              style={{ width: '200px' }}
              onChange={this.handleChangeItem.bind(this, 'englishName')}
            />
          </Row>
          <Row style={{ marginTop: 20 }}>
            <span className={styles['input-title']}><i style={{ color: 'red' }}>*</i>入职时间</span>
            <DatePicker
              format="YYYY-MM-DD"
              value={entryTime ? moment(entryTime, 'YYYY-MM-DD') : null}
              placeholder="请选择日期"
              style={{ width: '200px' }}
              onChange={this.handleChangeItem.bind(this, 'date')}
            />
          </Row>
          <Row style={{ marginTop: 20 }}>
            <span className={styles['input-title']}><i style={{ color: 'red' }}>*</i>职务</span>
            <Select
              value={sellerDutyMap[duty]}
              className={globalStyles['select-sift']}
              style={{ width: '200px' }}
              onChange={this.handleChangeItem.bind(this, 'duty')}
            >
              {
                Object.keys(sellerDutyMap).map((dutyId) => {
                  return (
                    <Option value={dutyId}>{sellerDutyMap[dutyId]}</Option>
                  );
                })
              }
            </Select>
          </Row>
          <Row style={{ marginTop: 20 }}>
            <span className={styles['input-title']}><i style={{ color: 'red' }}>*</i>绑定主管</span>
            <Select
              value={sellerLeaderMap[sellerLeader]}
              disabled={(sellerDutyMap[duty] === '销售主管') || false}
              className={globalStyles['select-sift']}
              placeholder={(sellerDutyMap[duty] === '销售主管') ? '不绑定' : ''}
              style={{ width: '200px' }}
              onChange={this.handleChangeItem.bind(this, 'sellerLeader')}
            >
              <Option value="">不绑定</Option>
              {
                Object.keys(sellerLeaderMap).map((sellerLeaderId) => {
                  return (
                    <Option value={sellerLeaderId}>{sellerLeaderMap[sellerLeaderId]}</Option>
                  );
                })
              }
            </Select>
          </Row>
          <Row style={{ marginTop: 50 }}>
            <Button type="primary" onClick={this.handleConfirmBtn.bind(this)} style={{ marginLeft: 50, width: 150 }} loading={isLoading}>保存</Button>
            <Link to="/customer/seller-list">
              <Button style={{ marginLeft: 20, width: 150 }}>取消</Button>
            </Link>
          </Row>
        </Card>
      </PageHeaderLayout>
    );
  }
}
