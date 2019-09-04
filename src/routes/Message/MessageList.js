import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Card, Input, DatePicker, Col, Button, Radio, Row, Select, Form, List, Avatar } from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './MessageList.less';
import TagSelect from '../../components/TagSelect';
import StandardFormRow from '../../components/StandardFormRow';
import globalStyles from '../../assets/style/global.less';
const FormItem = Form.Item;
const { Search } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;
@connect(state => ({
    messageList: state.messageList,
}))
@Form.create({
    onValuesChange(props, changedValues, allValues) {
       const { dispatch } = props;
        dispatch({
          type: 'messageList/getList',
          payload:{
            ...allValues,
            totalInfoList: [],
            currentPage:1,
            cardLoading:true,
            isLoadMore:true,
          }
        });
       }
  })
export default class MessageList extends PureComponent {
  componentDidMount() {
    const status = this.props.match.params.type;
    const { dispatch } = this.props;
    dispatch({
      type:'messageList/getList',
      payload:{
        status:status?status:'',
        cardLoading:true,
      }
    })
    dispatch({
      type:'messageList/getConfig',
    })
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type:'messageList/unmountReducer',
    })
    
  }
  handleChange=(publisher)=>{
    const { dispatch } = this.props;
    dispatch({
      type:'messageList/getList',
      payload:{
        publisher,
        cardLoading:true,
      }
    })
  }
  handleSetOwner=(e)=>{
    const { form, dispatch } = this.props;
    if(e.target.value == 4) {
      form.setFieldsValue({
        publisher: [],
        createBy: [],
          status: "4",
      });
    }
  }
  handleSearchByKeyWords=(isEnterButton,e)=>{
    const { dispatch } = this.props;
    dispatch({
      type:'messageList/getList',
      payload:{
        keywords:isEnterButton?e.target.value:e,
        currentPage:1,
        cardLoading:true,
        totalInfoList: [],
      }
    })
  }
  handleLoadMore=()=>{
    const { dispatch, messageList } = this.props;
    const { currentPage, totalInfoList, total } = messageList;
    let curPage = currentPage;
    if(totalInfoList.length<total) {
      curPage++;
      dispatch({
        type:'messageList/getList',
        payload:{
          currentPage:curPage,
          isLoadMore:true,
        }
      })
    }else{
      dispatch({
        type:'messageList/updatePageReducer',
        payload:{
          isLoadMore:false,
        }
      })
    }
    
  }
  render() {
    const {
        form,
        messageList: {
          totalInfoList,
          createBy,
          publisher,
          publishTime,
          status,
          departmentListMap,
          employeeMap,
          statusMap,
          isLoadMore,
          cardLoading,
      },
    } = this.props;
    const content=<div style={{width:"100%",display:'flex',justifyContent:'center'}}>
        <div style={{width:700}}>
            <Search
            enterButton="搜索"
            size="large"
            onSearch={this.handleSearchByKeyWords.bind(this,false)}
            onPressEnter={this.handleSearchByKeyWords.bind(this,true)}
            />
        </div>
    </div>
    const { getFieldDecorator } = form;
    const formItemLayout = {
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 24 },
          md: { span: 24 }, 
          lg: { span: 24 }, 
        },
    };
    const loadMore = isLoadMore?<div style={{height:40,textAlign:'center',lineHeight:'60px',cursor:'pointer'}} onClick={this.handleLoadMore}>
        <span>查看更多信息</span>
    </div>:<div style={{height:40,textAlign:'center',lineHeight:'60px',cursor:'pointer'}}>没有更多消息了</div>
    
    return (
      <PageHeaderLayout 
      title="信息列表"
      content={content}
      >
        <Card bordered={false}>
          <Form layout="inline">
            <StandardFormRow title="发布方部门" block style={{ paddingBottom: 11 }}>
              <FormItem>
                {getFieldDecorator('publisher',{
                  initialValue: publisher,
                })(
                  <TagSelect>
                    {
                      Object.keys(departmentListMap).map(departmentId=>(
                        <TagSelect.Option value={departmentId}>{departmentListMap[departmentId]}</TagSelect.Option>
                      ))
                    }
                  </TagSelect>
                )}
              </FormItem>
            </StandardFormRow>
            <StandardFormRow title="发布方" grid>
              <Row>
                <Col>
                  <FormItem {...formItemLayout}>
                    {getFieldDecorator('createBy', {
                      initialValue: createBy,
                    })(
                      <Select
                        mode="multiple"
                        style={{ maxWidth: 286, width: '100%' }}
                        placeholder="选择发布方"
                      >
                        {
                          Object.keys(employeeMap).map(employeeId=>(
                            <Option key={employeeId} value={employeeId}>
                              {employeeMap[employeeId]}
                            </Option>
                          ))
                        }
                      </Select>
                    )}
                    {/* <a className={styles.selfTrigger} onClick={this.handleSetOwner}>
                      只看自己的
                    </a> */}
                  </FormItem>
                </Col>
              </Row>
            </StandardFormRow>
            <StandardFormRow title="发布时间" grid last>
              <Row gutter={20}>
                <Col xl={8} lg={10} md={10} sm={24} xs={24}>
                  <FormItem {...formItemLayout}>
                    {getFieldDecorator('publishTime', {
                      initialValue: publishTime,
                    })(
                      <RangePicker />
                    )}
                  </FormItem>
                </Col>
                <Col xl={11} lg={14} md={14} sm={24} xs={24}>
                  <FormItem {...formItemLayout}>
                    {getFieldDecorator('status', {
                        initialValue: status,
                    })(
                      <Radio.Group
                      onChange={this.handleSetOwner}
                      >
                      <Radio.Button value="">全部</Radio.Button>
                        {
                          Object.keys(statusMap).map(statusId=>(
                              <Radio.Button value={statusId}>{statusMap[statusId]}</Radio.Button>
                          ))
                        }
                    </Radio.Group>
                    )}
                  </FormItem>
                </Col>
              </Row>
            </StandardFormRow>
          </Form>
        </Card>
        <Card
        loading={cardLoading}
        >
            <Link to="/message/create-message">
              <Button
                type="dashed"
                style={{ width: '100%', marginBottom: 8, color:'#1890ff' }}
                icon="plus"
              >
                发布我的信息
              </Button>
            </Link>
            <List
                  dataSource={totalInfoList}
                  loadMore={loadMore}
                  renderItem={item => (
                    <List.Item>
                            <Col span={18}>
                                <div className={styles.leftContent}>
                                    <div className={styles.title}>
                                        <Link to={`/message/message-list/message-detail/${item.id}`}><span style={{color:"#000"}}>{item.title}</span></Link>
                                        {
                                          item.isNew?<span className={styles.newest}>最新</span>:''
                                        }
                                    </div>
                                    <div className={styles.content} dangerouslySetInnerHTML={{__html:item.content}}>
                                    </div>
                                    <div className={styles.footerLeft}>
                                        <Avatar src={item.headImgUrl} size="small" style={{width:12,height:12}}/>
                                        <span style={{display:'inline-block',margin:'0 20px', color:'#1890ff'}}>{`${item.department}-${item.publisher}`}</span>
                                        <span style={{color:'#ccc'}}>{item.createTime}</span>
                                    </div>
                                </div>
                            </Col>
                            <Col span={6}>
                                <div className={styles.rightContent}>
                                    <div className={styles.icons}>
                                        {
                                          item.tag&&item.tag.map(tagItem=>{
                                            return <span className={styles.iconBtn} style={{background:tagItem.bgColor,color:tagItem.color,border:`1px solid ${tagItem.borderColor}`}}>{tagItem.name}</span>
                                          })
                                        }
                                    </div>
                                    <div className={styles.listFooter}>
                                        <div className={styles.footerRight}>
                                            <span>
                                              {
                                                +item.noReadCount===0?<span style={{color:'green'}}>全部已读：{item.readCount}</span>:`已读：${item.readCount}`
                                              }
                                              </span>
                                            <span> | 未读：{item.noReadCount}</span>
                                            <span> | 回复：{item.replyCount}</span>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        {/* </Row> */}
                    </List.Item>
                  )}
                  >
                  </List>
        </Card>
      </PageHeaderLayout>
    );
  }
}
