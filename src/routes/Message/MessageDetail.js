import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Card, List, Row, Col, Button, Form, Input, Avatar, Modal  } from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './MessageDetail.less';
import logo from '../../assets/logo.png';
import StandardFormRow from '../../components/StandardFormRow';
const TextArea = Input.TextArea;
@connect(state => ({
  messageDetail: state.messageDetail,
  user: state.user,
}))
export default class MessageDetail extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type:'messageDetail/getInfo',
      payload:{
        id:this.props.match.params.id,
      }
    })
    dispatch({
      type:'messageDetail/getConfig',
    })
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type:'messageDetail/unmountReducer',
    })
  }
  handleToggleExecute=(operationUrl)=>{
    const { dispatch } = this.props;
      dispatch({
        type:'messageDetail/toggleExecute',
        payload:{
          operationUrl,
          performLoading: true,
        }
      })
  }
  handleSaveComment=(e)=>{
    const { dispatch,messageDetail } = this.props;
    const { isReply } = messageDetail;
    if(isReply) {
      dispatch({
        type:'messageDetail/updatePageReducer',
        payload:{
          replyComment:e.target.value,
        }
      })
    }else{
      dispatch({
        type:'messageDetail/updatePageReducer',
        payload:{
          comment:e.target.value,
        }
      })
    }
  }
  handleSubmitComment=(isReply)=>{
    const { dispatch } = this.props;
    dispatch({
      type:'messageDetail/commitComment',
      payload:{
        isReply,
        buttonLoading:!isReply,
        replyButtonLoading:isReply, 
      }
    })
  }
  handleShowCommentModal=(replyId)=>{
    const { dispatch } = this.props;
    dispatch({
      type:'messageDetail/updatePageReducer',
      payload:{
        showCommentModal:true,
        replyId,
        isReply:true,
      }
    })
  }
  handleCloseCommentModal=()=>{
    const { dispatch } = this.props;
    dispatch({
      type:'messageDetail/updatePageReducer',
      payload:{
        showCommentModal:false,
        isReply: false,
        replyComment:''
      }
    })
  }
  
  render() {
    const {
      messageDetail: {
        buttonLoading,
        comment,
        showCommentModal,
        replyComment,
        employeeMap,
        replyButtonLoading,
        infoDetail,
        actionList,
        performLoading,
      },
      user:{
        headImgUrl,
      }
    } = this.props;
    
    const loadMore = <div style={{height:40,textAlign:'center',lineHeight:'40px'}}>
        查看更多信息
    </div>
    return (
      <PageHeaderLayout 
      title="信息详情"
      >
        <Card bordered={false}>
            <StandardFormRow title="收件人" grid >
                <Row type="flex" align="middle">
                    <Col span={18} className={styles.receiver}>
                    {
                      infoDetail.consigneeList.map(item=>{
                        return <span>{item}</span>
                      })
                    }
                    </Col>
                    <Col>
                        {
                          actionList.map(item=>(
                            +item.type === 2?<Button href={item.url} style={{marginRight:10}}>{item.name}</Button>:
                            (item.type === 1?<Button type="primary" onClick={this.handleToggleExecute.bind(this,item.url)} loading={performLoading}>{item.name}</Button>:null)
                          ))
                        }
                        
                    </Col>
                </Row>
            </StandardFormRow>
            <StandardFormRow title="主题" grid>
                <Row>
                  <Col>
                    <span>{infoDetail.title}</span>
                  </Col>
                </Row>
            </StandardFormRow>
            <StandardFormRow title="附件" grid>
              <div className={styles.linkItem}>
                  {
                      infoDetail.packageList.map(item=>{
                        return <a href={item.url} target="_blank">{item.name}</a>
                      })                
                  }
              </div>
            </StandardFormRow>
            <StandardFormRow title="任务反馈" grid last>
            {
              infoDetail.chargeMan?<div className={styles.feedback}>
              <span>{`${infoDetail.taskStartTime}/${infoDetail.taskEndTime}`}</span>
              <span>责任人：{infoDetail.chargeMan}</span>
              <span>任务描述：{infoDetail.taskDesc}</span>
              {
                infoDetail.taskStatus&&infoDetail.taskStatus?<span className={styles.tag} style={{background:"#F2F2F2",color:"#868686",border:'1px solid #A1A1A1'}}>已执行</span>
                :<span className={styles.tag} style={{background:"#FFF2E8",color:"#FA541C",border:'1px solid #FFBB96'}}>待执行</span>
              }
            </div>:''
            }
            </StandardFormRow>
        </Card>
        <Card style={{marginTop:20,background:"#eeeeee"}} bordered={false}>
            <div className={styles.content} dangerouslySetInnerHTML={{__html:infoDetail.content}}></div>
            <div className={styles.cardFooter}>
                阅读情况
                <Row>
                  {
                    infoDetail.readerList.map(item=>{
                      return <span className={item.status?styles['readClass']:styles['unreadClass']}>{item.reader}</span>
                    })
                  }
                </Row>
            </div>
        </Card>
        <Card
        bordered={false}
        >
        <Row style={{marginBottom:40}}>
            <Col span={1}>
              <Avatar src={headImgUrl}/>
            </Col>
            <Col span={10}>
              <Input.TextArea
              style={{resize:'none'}}
              value={comment}
              rows = {4}
              onChange={this.handleSaveComment}
              >
              </Input.TextArea>
            </Col>
            <Col span={2} push={1}>
              <Button type="primary" onClick={this.handleSubmitComment.bind(this,false)} loading={buttonLoading}>提交评论</Button>
            </Col>
        </Row>
        {
          infoDetail.commentList.map(item=>(
            <Row style={{marginBottom:70}}>
              <Row>
                <Col span={1}>
                  <Avatar src={item.headImgUrl}/>
                </Col>
                <Col span={10}>
                  <div className={styles.commentTitle}><span style={{marginRight:10}}>{employeeMap[""+item.createBy]}</span><span>{item.time}</span></div>
                  <div className={styles.comment}>{item.content}</div>
                </Col>
                <Col span={2} push={3}>
                  <span onClick={this.handleShowCommentModal.bind(this,item.id)} style={{cursor:'pointer'}}>回复</span>
                </Col>
              </Row>
              {
                item.replyList&&item.replyList.map(reply=>(
                  <Row style={{marginLeft:100,marginTop:20}}>
                    <Col span={1}>
                      <Avatar src={reply.headImgUrl}/>
                    </Col>
                    <Col span={10}>
                      <div className={styles.commentTitle}><span style={{marginRight:10}}>{`${employeeMap[reply.createBy]} 回复 ${employeeMap[item.createBy]}`}</span><span>{reply.time}</span></div>
                      <div className={styles.comment}>{reply.content}</div>
                    </Col>
                  </Row>
                ))
              }
            </Row>
          ))
        }
        
        <Modal
        visible={showCommentModal}
        title="发表评论"
        onOk={this.handleSubmitComment.bind(this,true)}
        onCancel={this.handleCloseCommentModal}
        confirmLoading={replyButtonLoading}
        >
          <Row type="flex" justify="center">
            <Input.TextArea
            rows = {4}
            style={{width:500,resize:'none'}}
            onChange={this.handleSaveComment}
            value={replyComment}
            >
            </Input.TextArea>
          </Row>
        </Modal>
        </Card>
      </PageHeaderLayout>
    );
  }
}
