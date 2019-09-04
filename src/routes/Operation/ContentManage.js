import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Input, DatePicker, Icon, Table, Dropdown, Menu, Row, Select, Button, Col, Modal } from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import globalStyles from '../../assets/style/global.less';
import moment from 'moment';
const { Search } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;
@connect(state => ({
  contentManage: state.contentManage,
}))
export default class contentManage extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'contentManage/getList',
    });
    dispatch({
      type: 'contentManage/getConfig',
    });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'contentManage/unmountReducer',
    });
  }
  handleChangeSyncItem = (type, e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'contentManage/updataPageReducer',
      payload: {
        [type]: e.target.value,
      }
    });
  }
  handleSearchItem = (type, e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'contentManage/getList',
      payload: {
        [type]: e,
        page: 1,
      }
    });
  }
  handleChangeDate = (dates, dateStrings) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'contentManage/getList',
      payload: {
        createTimeStart: dateStrings[0],
        createTimeEnd: dateStrings[1],
        page: 1,
      }
    });
  }
  // actionList的处理
  handleActionList = (actionUrl, actionText) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'contentManage/updataPageReducer',
      payload: {
        actionUrl,
        actionText,
        isShowConfirmModal: true,
      }
    });
  }
  handleConfirm = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'contentManage/confirmAction',
      payload: {
        isShowConfirmModal: false,
      }
    });
  }
  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'contentManage/updataPageReducer',
      payload: {
        isShowConfirmModal: false,
      }
    });
  }
  // handleChangecurrentPage(page) {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'contentManage/getList',
  //     payload: {
  //       page,
  //     }
  //   });
  // }
  // 切换每页行数
  handleChangePageSize(_, pageSize) {
    const { dispatch } = this.props;
    dispatch({
      type: 'contentManage/getList',
      payload: {
        pageSize,
        page: 1,
      }
    });
  }
  handleOnTableChange = (pagination, filters, sorter) => {
    const { dispatch } = this.props;
    if (sorter.order === "ascend") {
      dispatch({
        type: 'contentManage/getList',
        payload: {
          sortType: 4,
          orderBy: sorter.field,
          page: pagination.current,
          pageSize: pagination.pageSize,
        }
      });
    } else if (sorter.order === "descend") {
      dispatch({
        type: 'contentManage/getList',
        payload: {
          sortType: 3,
          orderBy: sorter.field,
          page: pagination.current,
          pageSize: pagination.pageSize,
        }
      });
    } else {
      dispatch({
        type: 'contentManage/getList',
        payload: {
          page: pagination.current,
          pageSize: pagination.pageSize,
        }
      });
    }
  }
  render() {
    const { contentManage: {
      isTableLoading,
      foundArticleType,
      foundArticleStatus,
      foundCategories,
      createTimeStart,
      createTimeEnd,
      articleId,
      title,
      articleList,
      page,
      pageSize,
      isShowConfirmModal,
      actionText,
      totalCount,
    } } = this.props;
    const menu = (
      <Menu>
        <Menu.Item key="1"><Link to={`/operation/media/content-manage/publish-content/1`}>发图文</Link></Menu.Item>
        <Menu.Item key="2"><Link to={"/operation/media/content-manage/publish-content/2"}>发视频</Link></Menu.Item>
      </Menu>
    );
    const columns = [
      {
        title: '动态ID',
        dataIndex: 'articleId',
        key: 'articleId',
        render: (articleId, record) => {
          return <Link to={`/operation/media/content-manage/publish-content/${record.type}/${record.articleId}`}>{articleId}</Link>
        }
      },
      {
        title: '动态类型',
        dataIndex: 'type',
        key: 'type',
        render: (type) => {
          return <span>{foundArticleType[type]}</span>
        }
      },
      {
        title: '动态标题',
        dataIndex: 'title',
        key: 'title',
        width: 400,
        render: (title, record) => {
          return <Link to={`/operation/media/content-manage/publish-content/${record.type}/${record.articleId}`}>{title}</Link>
        }
      },
      {
        title: '状态',
        dataIndex: 'statusData',
        key: 'statusData',
        render: (statusData) => {
          return <span style={{ color: statusData.color }}>{statusData.text}</span>
        }
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
      },
      {
        title: '投放频道/曝光量',
        dataIndex: 'foundAndReadCount',
        key: 'foundAndReadCount',
        render: (foundAndReadCount) => {
          return foundAndReadCount.map((item, index) => {
            return <p key={index} style={{ margin: 0 }}>{`${item.foundName}（阅读量：${item.readCount}）`}</p>
          })
        }
      },
      {
        title: '收藏量',
        sorter: true,
        dataIndex: 'collectArticleTotal',
        key: 'collectArticleTotal',
        render: (collectArticleTotal) => {
          return <p style={{ margin: 0 }}>{collectArticleTotal}</p>
        }
      },
      {
        title: '操作',
        dataIndex: 'actionList',
        key: 'actionList',
        width: 300,
        render: (actionList, record) => {
          return actionList.map((item, index) => {
            if (+item.type === 1) {
              return <Link to={`${item.url}/${record.type}/${record.articleId}`}><Button type="primary" ghost key={index} style={{ marginLeft: 10 }}>{item.name}</Button></Link>
            } else if (+item.type === 2) {
              return <Button type="primary" ghost key={index} style={{ marginLeft: 10 }} onClick={this.handleActionList.bind(this, item.url, item.name)}>{item.name}</Button>
            }

          })
        }
      },
    ]

    return (
      <PageHeaderLayout title="动态管理">
        <Card bordered={false}>
          <Row style={{ marginBottom: 20 }}>
            <Col span={20}>
              <Search
                placeholder="动态ID"
                value={articleId}
                className={globalStyles['input-sift']}
                onChange={this.handleChangeSyncItem.bind(this, 'articleId')}
                onSearch={this.handleSearchItem.bind(this, 'articleId')}
              />

              <Select
                onSelect={this.handleSearchItem.bind(this, "type")}
                className={globalStyles['select-sift']}
                placeholder="动态类型"
              // value={type}
              >
                <Option value={""}>全部</Option>
                {
                  Object.keys(foundArticleType).map(item => (
                    <Option value={item} key={item}>{foundArticleType[item]}</Option>
                  ))
                }
              </Select>
              <Select
                onChange={this.handleSearchItem.bind(this, "status")}
                className={globalStyles['select-sift']}
                placeholder='状态'
              // value={status}
              >
                <Option value={""}>全部</Option>
                {
                  Object.keys(foundArticleStatus).map(item => (
                    <Option value={item} key={item}>{foundArticleStatus[item]}</Option>
                  ))
                }
              </Select>
              <Search
                placeholder="动态标题"
                value={title}
                className={globalStyles['input-sift']}
                onChange={this.handleChangeSyncItem.bind(this, 'title')}
                onSearch={this.handleSearchItem.bind(this, 'title')}
              />
              <span style={{ display: "inline-block", marginTop: 4 }}>创建时间：</span>
              <RangePicker
                style={{ width: 300, marginLeft: 10, marginRight: 10 }}
                value={[createTimeStart ? moment(createTimeStart, 'YYYY-MM-DD') : '', createTimeEnd ? moment(createTimeEnd, 'YYYY-MM-DD') : '']}
                className={globalStyles['rangePicker-sift']}
                onChange={this.handleChangeDate.bind(this)}
              />
              <Select
                onChange={this.handleSearchItem.bind(this, "foundId")}
                className={globalStyles['select-sift']}
                placeholder='投放频道'
              // value={foundId}
              >
                <Option value={""}>全部</Option>
                {
                  Object.keys(foundCategories).map(item => (
                    <Option value={item} key={item}>{foundCategories[item]}</Option>
                  ))
                }
              </Select>

            </Col>
            <Col span={2} align="end">
              <Dropdown overlay={menu}>
                <Button type="primary">
                  发动态 <Icon type="down" />
                </Button>
              </Dropdown>
            </Col>
          </Row>
          <Table
            dataSource={articleList}
            columns={columns}
            onChange={this.handleOnTableChange}
            rowKey={record => record.articleId}
            bordered
            pagination={{
              current: page,
              pageSize,
              total: totalCount,
              showSizeChanger: true,
              // onShowSizeChange: this.handleChangePageSize.bind(this),
              // onChange: this.handleChangecurrentPage.bind(this),
            }}
            loading={isTableLoading}
          />
          <Modal
            visible={isShowConfirmModal}
            title="确认"
            onOk={this.handleConfirm}
            onCancel={this.handleCancel}
          >
            <p style={{ textAlign: 'center' }}>{`请确认是否${actionText}?`}</p>
          </Modal>
        </Card>
      </PageHeaderLayout>
    );
  }
}
