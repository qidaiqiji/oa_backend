import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Card, Input, DatePicker, Col, Button, Modal, Row, Select, Form, Upload, message } from 'antd';
import { Link } from 'dva/router';
import 'braft-editor/dist/index.css'
import BraftEditor from 'braft-editor';
import styles from './CreateMessage.less';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import StandardFormRow from '../../components/StandardFormRow';
import globalStyles from '../../assets/style/global.less';
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
@connect(state => ({
    createMessage: state.createMessage,
    user:state.user,
}))
export default class CreateMessage extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type:'createMessage/getConfig'
    })
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type:'createMessage/unmountReducer'
    })
    
  }
  handleCloseModal=()=>{
    const { dispatch } = this.props;
    dispatch({
      type:'createMessage/updatePageRducer',
      payload:{
        isShowFeedBackModal:false,
        feedBackValues: {},
      }
    })
  }
  
  render() {
    const {
        dispatch,
        user,
        createMessage: {
          fileList,
          isShowFeedBackModal,
          submitLoading,
          departmentMap,
          currentData,
          braftFileList,
          files,
          employeeMap,
          feedBackValues,
      },
    } = this.props;
    
    class PublishForm extends PureComponent {
      handleSubmit=(e)=>{
        e.preventDefault();
        const formData = new FormData();
        fileList.forEach((file) => {
          formData.append('files[]', file);
        });
        this.props.form.validateFields((err, values) => {
          if (!err) {
            if(values.consigneeDepartmentList.length == 0 && values.consigneeList.length == 0) {
              message.error("收件人不可为空！");
              return;
            }
            const content = values.content.toHTML();
            values.content = content;
            const allValues = {...feedBackValues, ...values}
            Object.keys(allValues).map(item=>{
              formData.append(item,allValues[item]);
            })
            if(allValues.time){
              formData.append('startDate',moment(allValues.time[0]).format('YYYY-MM-DD'));
              formData.append('endDate',moment(allValues.time[1]).format('YYYY-MM-DD'));
            }
            dispatch({
              type:'createMessage/handleCommit',
              payload:{
                formData,
                submitLoading: true,
              }
            })
          }
        });
      }
      handleShowFeedBackModal=()=>{
        const currentData = this.props.form.getFieldsValue();
        dispatch({
          type:'createMessage/updatePageRducer',
          payload:{
            isShowFeedBackModal:true,
            currentData,
          }
        })
      }
      
      render(){
        const {
          form,
        } = this.props;
        const { getFieldDecorator } = form;
        const formItemLayout = {
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 24 },
            md: { span: 20 },
          },
      };
      const props = {
        onRemove:(file)=>{
          const index = fileList.indexOf(file);
          const newFileList = fileList.slice();
          newFileList.splice(index, 1);
          dispatch({
            type:'createMessage/updatePageRducer',
            payload:{
              fileList:newFileList,
              files:newFileList,
            }
          })
        },
        beforeUpload:(file)=>{
          // const isPermit = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'application/vnd.ms-excel';
          const isLt15M = file.size / 1024 / 1024 < 15;
          if(!isLt15M) {
              message.error('文件大小超出15M');
              return;
            }
          let fileList = [];
          files.push(file);
          let count = [];
          files.map((item,index)=>{
            if(file.name === item.name) {
              count.push(index);
              if(count.length>1) {
                message.error("文件已存在!");
                files.splice(index, 1); 
                return;
              }
            }
          })
          const currentData = this.props.form.getFieldsValue();
          dispatch({
            type:'createMessage/updatePageRducer',
            payload:{
              fileList:[...fileList,...files],
              files,
              currentData,
            }
          })
          return false;
        },
        fileList,
        listType:"picture",
        multiple:true,
      }
      const uploadFn = (params) =>{
        const braftList=[...braftFileList,params.file];
        const braftFormData = new FormData();
        braftList.forEach((file) => {
          braftFormData.append('file', file);
        });
        dispatch({
          type:'createMessage/uploadMedia',
          payload:{
            braftFormData,
            params,
          }
        })
      }
        return (
        <Form layout="inline" onSubmit={this.handleSubmit}>
            <StandardFormRow grid>
              <Row>
                <Col span={9}>
                  {/* <span style={{color:"red"}}>*</span> */}
                  <FormItem {...formItemLayout} label="收件人" className={styles.labelStar}>
                    {getFieldDecorator('consigneeDepartmentList', {
                      initialValue:currentData.consigneeDepartmentList,
                      // rules: [
                      //   { required: true, message: '请选择收件部门' },
                      // ],
                    })(
                        <Select
                          mode="multiple"
                          style={{ width: '100%' }}
                          placeholder="选择收件部门"
                          optionFilterProp="children"
                          filterOption={(input, option) => {
                            return option.props.children.indexOf(input) >= 0;
                          }}
                        >
                          {
                            Object.keys(departmentMap).map(item=>{
                              return <Option key={item} value={item}>
                              {departmentMap[item]}
                            </Option>
                            })
                          }
                        </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={9}>
                  <FormItem {...formItemLayout}>
                    {getFieldDecorator('consigneeList', {
                      initialValue:currentData.consigneeList,
                      // rules: [  
                      //   { required: true, message: '请选择收件人' },
                      // ],
                    })(
                      <Select
                        mode="multiple"
                        style={{ width: '100%'}}
                        placeholder="选择收件人"
                        optionFilterProp="children"
                        filterOption={(input, option) => {
                          return option.props.children.indexOf(input) >= 0;
                        }}
                      >
                        {
                          Object.keys(employeeMap).map(item=>{
                            return <Option key={item} value={item}>
                            {employeeMap[item]}
                          </Option>
                          })
                        }
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={2}>
                    <FormItem {...formItemLayout}>
                      <Button type="primary" htmlType="submit"style={{marginRight:10}} loading={submitLoading}>发送</Button>
                    </FormItem>
                </Col>
                <Col>
                  <Button onClick={this.handleShowFeedBackModal}>任务反馈</Button>
                </Col>
              </Row>
            </StandardFormRow>
            <StandardFormRow grid>
              <Row gutter={16}>
                  <Col span={15}>
                      <FormItem label="主题">
                      {getFieldDecorator('title', {
                            initialValue:currentData.title,
                            rules: [  
                              { required: true, message: '请输入主题内容' },
                            ],
                          },)(
                            <Input
                            style={{ width: '80%' }}
                            >
                            </Input>
                          )}
                      </FormItem>
                  </Col>
              </Row>
            </StandardFormRow>
            <StandardFormRow grid>
                <Row style={{marginLeft:50}}>
                  <Col span={6}>
                    {/* <FormItem>
                    {getFieldDecorator('upload', {
                      // valuePropName: 'fileList',
                      // getValueFromEvent: this.normFile,
                    })( */}
                      <Upload
                      {...props}
                      >
                          <Button>上传附件</Button>
                      </Upload>
                    {/* )}
                        
                    </FormItem> */}
                  </Col>
                </Row>
            </StandardFormRow>
            <Card>
                <FormItem>
                {getFieldDecorator('content', {
                  initialValue:BraftEditor.createEditorState(currentData.content),
                  validateTrigger: 'onBlur',
                })(
                  
                  <BraftEditor
                    className="my-editor"
                    // controls={controls}
                    media={{uploadFn: uploadFn}}
                    // onChange={this.handleEditorChange}
                    placeholder="请输入正文内容"
                  />
                )}
                </FormItem>
            </Card>
          </Form>
        )
      }
    }
    PublishForm = Form.create({
    })(PublishForm)
    class ModalForm extends PureComponent {
      handleSubmit=(e)=>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            dispatch({
              type:'createMessage/updatePageRducer',
              payload:{
                feedBackValues:values,
                isShowFeedBackModal: false,
              }
            })
          }
        });
      }
      handleClose=()=>{
        dispatch({
          type:'createMessage/updatePageRducer',
          payload:{
            isShowFeedBackModal:false,
            feedBackValues: {},
          }
        })
      }
      render() {
        const {
          form,
        } = this.props;
        const modalFormItemLayout = {
          labelCol: { span: 6 },
          wrapperCol: { span: 12 },
        };
        const { getFieldDecorator } = form;
        return (
           <Form onSubmit={this.handleSubmit}>
            <Row>
                <FormItem label="起止时间" {...modalFormItemLayout}>
                  {
                    getFieldDecorator('time',{
                      initialValue:feedBackValues.time,
                        rules:[{
                            required: true, message: '请输入起止时间',
                        }]
                    })(
                        <RangePicker />
                    )
                  }
                </FormItem>
            </Row>
            <Row>
                <FormItem label="任务负责人" {...modalFormItemLayout}>
                  {
                    getFieldDecorator('chargeMan',{
                        initialValue:feedBackValues.chargeMan,
                        rules:[{
                            required: true, message: '请选择任务负责人',
                        }]
                    })(
                        <Select
                        placeholder="请选择"
                        >
                        {
                          Object.keys(employeeMap).map(item=>{
                            return <Option key={item} value={item}>
                            {employeeMap[item]}
                          </Option>
                          })
                        }
                        </Select>
                    )
                  }
                </FormItem>
            </Row>
            <Row>
                <Form.Item label="任务描述" {...modalFormItemLayout}>
                  {
                    getFieldDecorator('taskDesc',{
                      initialValue:feedBackValues.taskDesc,
                    })(
                        <Input.TextArea
                        row={4}
                        />
                    )
                  }
                </Form.Item>
            </Row>
            <Row type="flex" justify="end">
              <Button onClick={this.handleClose} style={{marginRight:10}}>取消</Button>
              <FormItem>
                <Button type="primary" htmlType="submit">确定</Button>
              </FormItem>
            </Row>
          </Form>
        )
      }
    }
    ModalForm = Form.create({})(ModalForm)
    return (
      <PageHeaderLayout 
      title="发布信息"
      >
        <Card bordered={false}>
          <PublishForm />
        </Card>
        <Modal
        visible={isShowFeedBackModal}
        title="任务反馈"
        onCancel={this.handleCloseModal}
        footer={null}
        maskClosable={false}
        >
          <Row style={{marginBottom:20}}>
            <Col span={6} style={{textAlign:'right'}}>
                创建人：
            </Col>
            <Col span={12}>
              <span style={{color:'#000',fontSize:'14px'}}>{user.name}</span>
            </Col>
          </Row>
          <ModalForm />
        </Modal>
      </PageHeaderLayout>
    );
  }
}
