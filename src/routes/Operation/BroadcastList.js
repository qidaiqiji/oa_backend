import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import moment from 'moment';
import Debounce from 'lodash-decorators/debounce';
import globalStyles from '../../assets/style/global.less';
import { Card, DatePicker, Modal, Input, Button, Table, Icon, message } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './BroadcastList.less';
import ClearIcon from '../../components/ClearIcon';
const { Search, TextArea } = Input;
// const { MonthPicker, RangePicker } = DatePicker;
@connect(state => ({
  broadcastList: state.broadcastList,
}))
export default class BroadcastList extends PureComponent {
  componentWillMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'broadcastList/mount',
      payload: {},
    });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'broadcastList/unmountReducer',
    });
  }
  handleSaveKeyWords(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'broadcastList/addMsg',
      payload: {
        keywords: e.target.value,
      },
    });
  }
  handleSearchBroadcast(type, e, dateString) {
    const { dispatch, broadcastList } = this.props;
    const { keywords } = broadcastList;
    switch (type) {
      case 'keywords':
        dispatch({
          type: 'broadcastList/conditionBroadCast',
          payload: {
            keywords,
          },
        });
        break;
      case 'date':
        dispatch({
          type: 'broadcastList/conditionBroadCast',
          payload: {
            startTime: dateString[0],
            endTime: dateString[1],
          },
        });
        break;
      default:
        break;
    }
  }
  handleAddMsg=() => {
    const { dispatch } = this.props;
    dispatch({
      type: 'broadcastList/addMsg',
      payload: {
        isShowItemMsg: true,
      },
    });
  }
  handleOperation=(e, record) => {
    const { dispatch } = this.props;
    console.log(e);
    if (e.type == 3) {
      if (e.name === '修改') {
        dispatch({
          type: 'broadcastList/addMsg',
          payload: {
            isShowItemMsg: true,
            itemMsgUrl: e.url,
            name: record.name,
            desc: record.desc,
          },
        });
      } else {
        dispatch({
          type: 'broadcastList/addMsg',
          payload: {
            isShowTip: true,
            tipUrl: e.url,
          },
        });
      }
    }
  }

  handleCancel=() => {
    const { dispatch } = this.props;
    dispatch({
      type: 'broadcastList/addMsg',
      payload: {
        isShowItemMsg: false,
        isShowTip: false,
        desc: '',
        name: '',
        itemMsgUrl:'',
      },
    });
  }
  onChangeValue=(type, e) => {
    const { dispatch } = this.props;
    switch (type) {
      case 'input':
        dispatch({
          type: 'broadcastList/addMsg',
          payload: {
            name: e.target.value,
          },
        });
        break;
      case 'textArea':
        dispatch({
          type: 'broadcastList/addMsg',
          payload: {
            desc: e.target.value,
          },
        });
        break;
      default:
        break;
    }
  }
  handleClear=(type)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'broadcastList/getList',
      payload: {
        [type]: "",
      },
    });
  }
  handleConfirm(type) {
    console.log('dddd',type)
    const { broadcastList, dispatch } = this.props;
    const { name, desc, itemMsgUrl, tipUrl } = broadcastList;
    if (type === 'add') {
      console.log('dddd222222');
      if (name === '') {
        message.warning('请填写直播间名称');
        return false;
      } else if (itemMsgUrl) {
        console.log(itemMsgUrl.split('='));
        dispatch({
          type: 'broadcastList/confirmEditBroadCast',
          payload: {
            name,
            desc,
            id: itemMsgUrl.split('=')[1],
          },
        });
      } else {
        dispatch({
          type: 'broadcastList/confirmEditBroadCast',
          payload: {
            desc,
            name,
          },
        });
      }
    } else {
      dispatch({
        type: 'broadcastList/deleteItem',
        payload: {
          id: tipUrl.split('=')[1],
        },
      });
    }
  }

  // 换页
  handleChangeCurPage(page) {
    const { dispatch } = this.props;
    dispatch({
      type: 'broadcastList/conditionBroadCast',
      payload: {
        currentPage: page,
      },
    });
  }
  // 切换每页行数
  handleChangePageSize(_, pageSize) {
    const { dispatch } = this.props;
    dispatch({
      type: 'broadcastList/conditionBroadCast',
      payload: {
        pageSize,
        currentPage: 1,
      },
    });
  }
  render() {
    const columns = [
      {
        title: '直播间ID',
        dataIndex: 'roomId',
        key: 'roomId',
      },
      {
        title: '直播间名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '描述',
        dataIndex: 'desc',
        key: 'desc',
        width:'500px',
      },
      {
        title: '创建时间',
        dataIndex: 'createdAt',
        key: 'createdAt',
      },
      {
        title: '操作',
        dataIndex: 'actionList',
        key: 'actionList',
        width: '160px',
        render: (actionList, record) => {
          return actionList.map((item) => {
            return <a className={styles.operator} onClick={this.handleOperation.bind(this, item, record)}>{item.name}</a>;
          });
        },
      },
    ];

    const {
      broadcastList: {
        startTime,
        endTime,
        isLoading,
        isShowItemMsg,
        isShowTip,
        name,
        desc,
        count,
        list,
        currentPage,
        pageSize,
        keywords,
      },
    } = this.props;
    console.log(this.props);
    return (
      <PageHeaderLayout title="直播间列表">
        <Card bordered={false}>
          <Search
            placeholder="直播间ID/名称"
            onChange={this.handleSaveKeyWords.bind(this)}
            onSearch={this.handleSearchBroadcast.bind(this, 'keywords')}
            style={{ width: 200, marginRight: '10px' }}
            suffix={keywords?<ClearIcon 
              handleClear={this.handleClear.bind(this,"keywords")}
          />:""}
          />
          <span>创建时间：</span>
          <DatePicker.RangePicker
            onChange={this.handleSearchBroadcast.bind(this, 'date')}
            style={{ marginRight: '10px' }}
            value={[
              startTime ? moment(startTime, 'YYYY-MM-DD') : '',
              endTime ? moment(endTime, 'YYYY-MM-DD') : '',
            ]}
            format="YYYY-MM-DD"
          />
          <Button type="primary" onClick={this.handleAddMsg}>+新增</Button>

          <Table
            dataSource={list}
            columns={columns}
            style={{ marginTop: '15px' }}
            bordered
            pagination={{
              current: currentPage,
              pageSize,
              total: count,
              showSizeChanger: true,
              onShowSizeChange: this.handleChangePageSize.bind(this),
              onChange: this.handleChangeCurPage.bind(this),
              showTotal:total => `共 ${total} 个结果`,
            }}
            loading={isLoading}
          />
          <Modal
            visible={isShowTip}
            centered
            closable={false}
            onOk={this.handleConfirm.bind(this)}
            onCancel={this.handleCancel}

          >
            <p style={{ textAlign: 'center', padding: '40px 0' }}>{'确定要删除该直播间吗？'}
            </p>
          </Modal>
          <Modal
            visible={isShowItemMsg}
            title="新增/修改"
            destroyOnClose
            onOk={this.handleConfirm.bind(this, 'add')}
            onCancel={this.handleCancel}
          >
            <p style={{ textAlign: 'center' }}><Icon type="exclamation-circle" style={{ color: '#c62f2f' }} /> 新增直播间需通知相关人员前往“阿里云平台”进行相关配置！</p>
            <p className={styles.modalInline}> <div className={styles.modalMsg}><span>*</span>直播间名称：</div><Input value={name} onChange={this.onChangeValue.bind(this, 'input')} /> </p>
            <p className={styles.modalInline}> <span className={styles.modalDesc}>{' '}描述：</span> <TextArea rows={4} value={desc} onChange={this.onChangeValue.bind(this, 'textArea')} /></p>
          </Modal>
        </Card>
      </PageHeaderLayout>
    );
  }
}
