import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux, Link, Redirect } from 'dva/router';
import { Form, Input, Tabs, Button, Icon, Checkbox, Row, Col, Alert } from 'antd';
import styles from './Login.less';

const FormItem = Form.Item;
const { TabPane } = Tabs;

@connect(state => ({
  login: state.login,
  user: state.user,
}))
@Form.create()
export default class Login extends Component {
  state = {
    count: 0,
    type: 'account',
  }

  componentDidMount() {
    // this.props.dispatch({
    //   type: 'user/auth',
    // });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.login.status === 'ok') {
      this.props.dispatch(routerRedux.push('/'));
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onSwitch = (key) => {
    this.setState({
      type: key,
    });
  }

  onGetCaptcha = () => {
    let count = 59;
    this.setState({ count });
    this.interval = setInterval(() => {
      count -= 1;
      this.setState({ count });
      if (count === 0) {
        clearInterval(this.interval);
      }
    }, 1000);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { type } = this.state;
    this.props.form.validateFields(
      { force: true },
      (err, values) => {
        if (!err) {
          this.props.dispatch({
            type: 'user/clickLoginButton',
            payload: values,
          });
        }
      }
    );
  }

  renderMessage = (message) => {
    return (
      <Alert
        style={{ marginBottom: 24 }}
        message={message}
        type="error"
        showIcon
      />
    );
  }

  render() {
    const { form, login, user } = this.props;
    const { getFieldDecorator } = form;
    const { count, type } = this.state;
    return (
      user.isLogin ?
        <Redirect to="/" /> :
        <div className={styles.main}>
          <Form onSubmit={this.handleSubmit}>
            <Tabs animated={false} className={styles.tabs} activeKey={type} onChange={this.onSwitch}>
              <TabPane tab="账户密码登录" key="account">
                {
                  login.status === 'error' &&
                  login.type === 'account' &&
                  login.submitting === false &&
                  this.renderMessage('账户或密码错误')
                }
                <FormItem>
                  {
                    getFieldDecorator('username', {
                      rules: [{
                        required: type === 'account', message: '请输入账户名！',
                      }],
                    })(
                      <Input
                        size="large"
                        prefix={<Icon type="user" className={styles.prefixIcon} />}
                        placeholder="用户名"
                      />
                    )
                  }
                </FormItem>
                <FormItem>
                  {getFieldDecorator('password', {
                  rules: [{
                    required: type === 'account', message: '请输入密码！',
                  }],
                })(
                  <Input
                    size="large"
                    prefix={<Icon type="lock" className={styles.prefixIcon} />}
                    type="password"
                    placeholder="密码"
                  />
                )}
                </FormItem>
              </TabPane>
              {/* <TabPane tab="手机号登录" key="mobile">
              {
                login.status === 'error' &&
                login.type === 'mobile' &&
                login.submitting === false &&
                this.renderMessage('验证码错误')
              }
              <FormItem>
                {getFieldDecorator('mobile', {
                  rules: [{
                    required: type === 'mobile', message: '请输入手机号！',
                  }, {
                    pattern: /^1\d{10}$/, message: '手机号格式错误！',
                  }],
                })(
                  <Input
                    size="large"
                    prefix={<Icon type="mobile" className={styles.prefixIcon} />}
                    placeholder="手机号"
                  />
                )}
              </FormItem>
              <FormItem>
                <Row gutter={8}>
                  <Col span={16}>
                    {getFieldDecorator('captcha', {
                      rules: [{
                        required: type === 'mobile', message: '请输入验证码！',
                      }],
                    })(
                      <Input
                        size="large"
                        prefix={<Icon type="mail" className={styles.prefixIcon} />}
                        placeholder="验证码"
                      />
                    )}
                  </Col>
                  <Col span={8}>
                    <Button
                      disabled={count}
                      className={styles.getCaptcha}
                      size="large"
                      onClick={this.onGetCaptcha}
                    >
                      {count ? `${count} s` : '获取验证码'}
                    </Button>
                  </Col>
                </Row>
              </FormItem>
            </TabPane> */}
            </Tabs>
            <FormItem className={styles.additional}>
              {/* {
                getFieldDecorator('remember', {
                  valuePropName: 'checked',
                  initialValue: true,
                })(
                <Checkbox className={styles.autoLogin}>自动登录</Checkbox>
                )
              } */}
              {/* <a className={styles.forgot} href="">忘记密码</a> */}
              <Button size="large" loading={user.isLogining} className={styles.submit} type="primary" htmlType="submit">
              登录
              </Button>
            </FormItem>
          </Form>
          {/* <div className={styles.other}>
          其他登录方式
          <span className={styles.iconAlipay} />
          <span className={styles.iconTaobao} />
          <span className={styles.iconWeibo} />
          <Link className={styles.register} to="/user/register">注册账户</Link>
        </div> */}
        </div>
    );
  }
}
