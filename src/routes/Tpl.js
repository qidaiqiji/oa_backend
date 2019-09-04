import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Tpl.less';
import globalStyles from '../../assets/style/global.less';

@connect(state => ({
  tpl: state.tpl,
}))
export default class Tpl extends PureComponent {
  componentDidMount() {
    const { dispatch, tpl } = this.props;
    dispatch({
      type: 'tpl/mount',
    });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'tpl/unmount',
    });
  }
  // 事件
  handleSomething(page) {
    const { dispatch, tpl } = this.props;
  }

  render() {
    const { tpl: { balabala } } = this.props;
    return (
      <PageHeaderLayout title="这是模板">
        <Card bordered={false}>
          <Link to="balabala">
            <div
              className={styles.className}
              onClick={this.handleSomething.bind(this)}
            >
              this is a template!{balabala}
            </div>
          </Link>
        </Card>
      </PageHeaderLayout>
    );
  }
}
