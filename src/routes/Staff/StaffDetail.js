import React, { PureComponent } from 'react';
import moment from 'moment';
import { stringify } from 'qs';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Button, DatePicker, Tabs, Radio, Upload, Icon, Avatar, notification } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './staffDetail.less';
import { getUrl } from '../../utils/request';
const { Option } = Select;
const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;
@connect(state => ({
    staffDetail: state.staffDetail,
}))
export default class StaffDetail extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    const id = this.props.match.params.id;
    dispatch({
      type:'staffDetail/getConfig',
    });
    dispatch({
      type:'staffDetail/getInfoDetail',
      payload:{
        id,
        cardLoading: true,
      }
    });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type:'staffDetail/unmountReducer',
    });
  }
  handleBeforeUpload(file) {
    const isIMG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/bmp'|| file.type === 'image/gif';
    const isLess500k = file.size / 1024 / 1024 < 0.48;
    if (!isIMG) {
      message.error("要求格式：.jpeg.png.bmp.gif");
      return false;
    }
    if (!isLess500k) {
      message.error("图片大小不能超过500k");
      return false;
    }
  }
  handleConfirmUpload = (info) => {
    const { dispatch } = this.props;
    if (info.file.status === 'uploading') {
      dispatch({
        type: 'staffDetail/updatePageReducer',
        payload: {
          uploadLoading:true,
        },
      });
    }
    if (info.file.status === 'error') {
      message.error("上传失败，请稍后重试!");
      dispatch({
        type: 'staffDetail/updatePageReducer',
        payload: {
          uploadLoading:false,
        },
      });
    }
    if (info.file.status === 'done') {
      const backImgUrl = info.file.response.headImg;
      notification.success({
        message: "上传头像成功"
      })
      dispatch({
        type: 'staffDetail/updatePageReducer',
        payload: {
          backImgUrl,
          uploadLoading: false,
        },
      });
      // dispatch({
      //   type: 'user/updatePage',
      //   payload: {
      //     headImgUrl:backImgUrl,
      //   },
      // });
    }
  }
  render() {
    const {
      dispatch,
      staffDetail: {
        infoDetail,
        educationMap,
        genderMap,
        marriageStatusMap,
        positionMap,
        provinceMap,
        statusMap,
        politicalStatusMap,
        tab1SubmitLoading,
        departmentMap,
        employeeStatusMap,
        tab2SubmitLoading,
        tab3SubmitLoading,
        tab4SubmitLoading,
        jobTypeMap,
        employeeContractTypeMap,
        backImgUrl,
        uploadLoading,
        cardLoading,
      },
    } = this.props;
    class BasicForm extends PureComponent {
      handleSubmit=(e)=>{
        e.preventDefault();
          this.props.form.validateFields((err, values) => {
            Object.keys(infoDetail).map(info=>{
              Object.keys(values).map(value=>{
                if(info == value) {
                  infoDetail[info] = values[value]
                }
              })
            })
            if (!err) {
              values.birthday = moment(values.birthday).format('YYYY-MM-DD'),
              dispatch({
                  type:'staffDetail/handleCommit',
                  payload:{
                      values,
                      type:1,
                      tab1SubmitLoading: true,
                      infoDetail,
                      backImgUrl,
                  }
              })
            }
          });
        }
      render() {
        const {
          form,
        } = this.props;
        const { getFieldDecorator } = form;
        const formTailLayout = {
          labelCol: { 
            xl: { span: 8 },
            lg: { span: 10 },
            md: { span: 10 }

          },
          wrapperCol: { 
            xl: { span: 16 },
            lg: { span: 20 },
            md: { span: 20 }
          },
        };
        return (
          <Form onSubmit={this.handleSubmit}>
            <Row>
              <Col xl={10} lg={12} md={12} sm={24} xs={24}>
                <Form.Item label="姓名" {...formTailLayout}>
                  {
                    getFieldDecorator('name',{
                        initialValue:infoDetail.name,
                        rules:[{
                            required: true, message: '请输入员工姓名',
                        }]
                    })(
                        <Input
                        disabled
                        />
                    )
                  }
                </Form.Item>
              </Col>
              <Col xl={10} lg={10} md={10} sm={24} xs={24}>
                <Form.Item label="花名" {...formTailLayout}>
                  {
                    getFieldDecorator('byName',{
                      initialValue:infoDetail.byName,
                    })(
                        <Input
                         />
                    )
                  }
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col xl={10} lg={10} md={10} sm={24} xs={24}>
                <Form.Item label="生日" {...formTailLayout}>
                  {
                    getFieldDecorator('birthday',{
                      initialValue:moment(infoDetail.birthday)
                    })(
                        <DatePicker
                         />
                    )
                  }
                </Form.Item>
              </Col>
              <Col xl={10} lg={10} md={10} sm={24} xs={24} push={2}>
                <Form.Item {...formTailLayout}>
                  {
                    getFieldDecorator('isSolar',{
                      initialValue:infoDetail.isSolar,
                    })(
                      <RadioGroup style={{width:250}}>
                        <Radio value={"1"}>新历</Radio>
                        <Radio value={"2"}>农历</Radio>
                      </RadioGroup>
                    )
                  }
                </Form.Item>
              </Col>
          </Row>
          <Row>
              <Col xl={10} lg={12} md={12} sm={24} xs={24}>
                <Form.Item label="性别"  {...formTailLayout}>
                  {
                    getFieldDecorator('gender',{
                      initialValue:infoDetail.gender,
                    })(
                        <Select
                        >
                        {
                          Object.keys(genderMap).map(item=>{
                            return <Option key={item} value={item}>{genderMap[item]}</Option>
                          })
                        }
                        </Select>
                    )
                  }
                </Form.Item>
              </Col>
              <Col xl={10} lg={12} md={12} sm={24} xs={24}>
                <Form.Item label="婚姻状况"  {...formTailLayout}>
                  {
                    getFieldDecorator('marriage',{
                      initialValue: infoDetail.marriage,
                    })(
                      <Select
                      >
                        {
                          Object.keys(marriageStatusMap).map(item=>{
                            return <Option key={item} value={item}>{marriageStatusMap[item]}</Option>
                          })
                        }
                      </Select>
                    )
                  }
                </Form.Item>
              </Col>
          </Row>
          <Row>
              <Col xl={10} lg={10} md={10} sm={24} xs={24}>
                <Form.Item label="政治面貌"  {...formTailLayout}>
                  {
                    getFieldDecorator('politicalStatus',{
                      initialValue:infoDetail.politicalStatus,
                    })(
                        <Select
                        >
                          {
                            Object.keys(politicalStatusMap).map(item=>{
                              return <Option key={item} value={item}>{politicalStatusMap[item]}</Option>
                            })
                          }
                        </Select>
                    )
                  }
                </Form.Item>
              </Col>
          </Row>
          <Row>
              <Col xl={10} lg={10} md={10} sm={24} xs={24}>
                <Form.Item label="手机号"  {...formTailLayout}>
                  {
                    getFieldDecorator('mobilePhone',{
                      initialValue:infoDetail.mobilePhone,
                      rules:[
                        // {
                        //   pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: '请输入正确的手机号码格式',
                        // },
                        {
                          required: true, message: '请输入员工手机号',
                        }
                      ]
                    })(
                        <Input
                        disabled
                         />
                    )
                  }
                </Form.Item>
              </Col>
          </Row>
          <Row>
              <Col xl={10} lg={10} md={10} sm={24} xs={24}>
                <Form.Item label="身份证号"  {...formTailLayout}>
                  {
                    getFieldDecorator('idCard',{
                      initialValue:infoDetail.idCard,
                      rules:[
                        {
                          pattern:/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,message:'请输入合法身份证号'
                        }
                      ]
                    })(
                        <Input
                         />
                    )
                  }
                </Form.Item>
              </Col>
          </Row>
          <Row>
              <Col xl={10} lg={10} md={10} sm={24} xs={24}>
                <Form.Item label="籍贯"  {...formTailLayout}>
                  {
                    getFieldDecorator('nativePlace',{
                      initialValue:infoDetail.nativePlace,
                    })(
                      <Select
                      >
                        {
                          Object.keys(provinceMap).map(item=>{
                            return <Option key={item} value={item}>{provinceMap[item]}</Option>
                          })
                        }
                      </Select>
                    )
                  }
                </Form.Item>
              </Col>
          </Row>
          <Row>
              <Col xl={10} lg={10} md={10} sm={24} xs={24}>
                <Form.Item label="学历"  {...formTailLayout}>
                  {
                    getFieldDecorator('education',{
                      initialValue:infoDetail.education,
                    })(
                      <Select
                      >
                        {
                          Object.keys(educationMap).map(item=>{
                            return <Option key={item} value={item}>{educationMap[item]}</Option>
                          })
                        }
                      </Select>
                    )
                  }
                </Form.Item>
              </Col>
          </Row>
          <Row>
              <Col xl={10} lg={10} md={10} sm={24} xs={24}>
                <Form.Item label="毕业学校"  {...formTailLayout}>
                  {
                    getFieldDecorator('graduateCollege',{
                      initialValue:infoDetail.graduateCollege,
                    })(
                        <Input
                         />
                    )
                  }
                </Form.Item>
              </Col>
          </Row>
          <Row>
              <Col xl={10} lg={10} md={10} sm={24} xs={24}>
                <Form.Item label="紧急联系人"  {...formTailLayout}>
                  {
                    getFieldDecorator('linkMan',{
                      initialValue:infoDetail.linkMan,
                    })(
                        <Input
                         />
                    )
                  }
                </Form.Item>
              </Col>
          </Row>
          <Row>
              <Col xl={10} lg={10} md={10} sm={24} xs={24}>
                <Form.Item label="简介"  {...formTailLayout}>
                  {
                    getFieldDecorator('desc',{
                      initialValue:infoDetail.desc,
                    })(
                        <Input.TextArea
                        rows={4}
                         />
                    )
                  }
                </Form.Item>
              </Col>
            </Row>
            <Row>
                <Col span={10}>
                  <Form.Item>
                    <Button type="primary" style={{marginLeft:50}} htmlType="submit" loading={tab1SubmitLoading}>更新信息</Button>
                  </Form.Item>
                </Col>
            </Row>
        </Form>
        )
      }
    }
    BasicForm = Form.create({})(BasicForm)
    class StaffInfoForm extends PureComponent {
      handleSubmit=(e)=>{
        e.preventDefault();
          this.props.form.validateFields((err, values) => {
            console.log("values",values)
            if (!err) {
              Object.keys(infoDetail).map(info=>{
                Object.keys(values).map(value=>{
                  if(info == value) {
                    infoDetail[info] = values[value]
                  }
                })
              })
              values.entryTime = moment(values.entryTime).format('YYYY-MM-DD');
              values.turnTime = moment(values.turnTime).format('YYYY-MM-DD');
              values.contractStartTime = values.contractStartTime?moment(values.contractStartTime).format('YYYY-MM-DD'):'';
              values.contractEndTime = values.contractEndTime?moment(values.contractEndTime).format('YYYY-MM-DD'):'';
              dispatch({
                  type:'staffDetail/handleCommit',
                  payload:{
                      values,
                      type:2,
                      tab2SubmitLoading:true,
                      infoDetail,
                  }
              })
            }
          });
      }
      // handleChangeDepartment=(value)=>{
      //   infoDetail.position = '';
      //   infoDetail.departmentId = value;
      //   dispatch({
      //     type:'staffDetail/getPosition',
      //     payload:{
      //       id:value,
      //       infoDetail,
      //     }
      //   })
      // }
      render() {
        const {
          form,
          dispatch,
        } = this.props;
        const { getFieldDecorator } = form;
        // const formTailLayout = {
        //   labelCol: { span: 6 },
        //   wrapperCol: { span: 8 },
        // };
        const formTailLayout = {
          labelCol: { 
            xl: { span: 8 },
            lg: { span: 10 },
            md: { span: 10 }

          },
          wrapperCol: { 
            xl: { span: 16 },
            lg: { span: 20 },
            md: { span: 20 }
          },
        };
        return (
          <Form onSubmit={this.handleSubmit}>
                <Row>
                    <Col xl={10} lg={12} md={12} sm={24} xs={24}>
                      <Form.Item label="工号" {...formTailLayout}>
                        {
                          getFieldDecorator('jobNumber',{
                            initialValue:infoDetail.jobNumber,
                          })(
                              <Input
                              />
                          )
                        }
                      </Form.Item>
                    </Col>
                    <Col xl={10} lg={12} md={12} sm={24} xs={24}>
                      <Form.Item label="员工类型" {...formTailLayout}>
                        {
                          getFieldDecorator('jobType',{
                            initialValue:infoDetail.jobType,
                          })(
                              <Select
                              style={{width:150}}
                              >
                                {
                                  Object.keys(jobTypeMap).map(item=>{
                                    return <Option key={item} value={item}>{jobTypeMap[item]}</Option>
                                  })
                                }
                              </Select>
                          )
                        }
                      </Form.Item>
                    </Col>
                    <Col xl={10} lg={12} md={12} sm={24} xs={24}>
                      <Form.Item label="员工状态" {...formTailLayout}>
                        {
                          getFieldDecorator('employeeStatus',{
                            initialValue:infoDetail.employeeStatus,
                          })(
                              <Select
                                style={{width:150}}
                                >
                                   {
                                      Object.keys(employeeStatusMap).map(item=>{
                                        return <Option key={item} value={item}>{employeeStatusMap[item]}</Option>
                                      })
                                    }
                                </Select>
                          )
                        }
                      </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col xl={10} lg={12} md={12} sm={24} xs={24}>
                      <Form.Item label="隶属部门" {...formTailLayout}>
                        {
                          getFieldDecorator('departmentId',{
                            initialValue:infoDetail.departmentId,
                            rules:[
                              {
                                required:true,message:"请选择部门"
                              }
                            ]
                          })(
                            <Select
                            placeholder="请选择部门"
                            style={{width:200}}
                            // onChange={this.handleChangeDepartment}
                            >
                              {
                                Object.keys(departmentMap).map(item=>{
                                  return <Option key={item} value={item}>{departmentMap[item]}</Option>
                                })
                              }
                            </Select>
                          )
                        }
                      </Form.Item>
                    </Col>
                    <Col xl={10} lg={12} md={12} sm={24} xs={24}>
                      <Form.Item {...formTailLayout}>
                        {
                          getFieldDecorator('position',{
                            initialValue:infoDetail.position,
                            rules:[
                              {
                                required:true,message:"请选择岗位"
                              }
                            ]
                          })(
                            <Select
                            placeholder="请选择岗位"
                            style={{width:200}}
                            >
                              {
                                Object.keys(positionMap).map(item=>{
                                  return <Option key={item} value={item}>{positionMap[item]}</Option>
                                })
                              }
                            </Select>
                          )
                        }
                      </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col xl={10} lg={12} md={12} sm={24} xs={24}>
                      <Form.Item label="入职时间"  {...formTailLayout}>
                        {
                          getFieldDecorator('entryTime',{
                            initialValue:moment(infoDetail.entryTime),
                            rules:[
                              {
                                required:true,message:"请选择入职时间"
                              }
                            ]
                          })(
                              <DatePicker />
                          )
                        }
                      </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col xl={10} lg={12} md={12} sm={24} xs={24}>
                      <Form.Item label="转正时间"  {...formTailLayout}>
                        {
                          getFieldDecorator('turnTime',{
                            initialValue:moment(infoDetail.turnTime),
                          })(
                            <DatePicker />
                          )
                        }
                      </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col xl={10} lg={12} md={12} sm={24} xs={24}>
                      <Form.Item label="试用期"  {...formTailLayout}>
                        {
                          getFieldDecorator('probationPeriod',{
                            initialValue:infoDetail.probationPeriod,
                          })(
                              <Input
                                />
                          )
                        }
                      </Form.Item>
                    </Col>
                    <Col xl={10} lg={12} md={12} sm={24} xs={24}>
                      <Form.Item label="入职前工龄"  {...formTailLayout}>
                        {
                          getFieldDecorator('workAge',{
                            initialValue:infoDetail.workAge,
                          })(
                              <Input
                              />
                          )
                        }
                      </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col xl={10} lg={12} md={12} sm={24} xs={24}>
                      <Form.Item label="合同类型"  {...formTailLayout}>
                        {
                          getFieldDecorator('contractType',{
                            initialValue:infoDetail.contractType,
                          })(
                            <Select
                            style={{width:200}}
                            >
                              {
                                Object.keys(employeeContractTypeMap).map(item=>{
                                  return <Option value={item} key={item}>{employeeContractTypeMap[item]}</Option>
                                })
                              }
                            </Select>
                          )
                        }
                      </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col xl={10} lg={12} md={12} sm={24} xs={24}>
                      <Form.Item label="合同起始日"  {...formTailLayout}>
                        {
                          getFieldDecorator('contractStartTime',{
                            initialValue:infoDetail.contractStartTime?moment(infoDetail.contractStartTime):''
                          })(
                              <DatePicker
                                />
                          )
                        }
                      </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col xl={10} lg={12} md={12} sm={24} xs={24}>
                      <Form.Item label="合同终止日"  {...formTailLayout}>
                        {
                          getFieldDecorator('contractEndTime',{
                            initialValue:infoDetail.contractEndTime?moment(infoDetail.contractEndTime):''
                          })(
                              <DatePicker
                                />
                          )
                        }
                      </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col xl={10} lg={12} md={12} sm={24} xs={24}>
                      <Form.Item label="工作手机"  {...formTailLayout}>
                        {
                          getFieldDecorator('workMobile',{
                            initialValue:infoDetail.workMobile,
                            // rules:[
                            //   {
                            //     pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: '请输入正确的手机号码格式',
                            //   },
                            // ]
                          })(
                            <Input
                            // className={styles.inputItem}
                              />
                          )
                        }
                      </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col xl={10} lg={12} md={12} sm={24} xs={24}>
                      <Form.Item label="工作邮箱"  {...formTailLayout}>
                        {
                          getFieldDecorator('workEmail',{
                            initialValue:infoDetail.workEmail,
                            rules:[
                              {
                                type:'email', message:"请输入正确的邮箱格式"
                              }
                            ]
                          })(
                            <Input
                            // className={styles.inputItem}
                              />
                          )
                        }
                      </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col xl={10} lg={12} md={12} sm={24} xs={24}>
                      <Form.Item label="档案编号"  {...formTailLayout}>
                        {
                          getFieldDecorator('fileNumber',{
                            initialValue:infoDetail.fileNumber,
                          })(
                            <Input
                            // className={styles.inputItem}
                              />
                          )
                        }
                      </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col xl={10} lg={12} md={12} sm={24} xs={24}>
                      <Form.Item>
                        <Button type="primary" style={{marginLeft:50}} htmlType="submit" loading={tab2SubmitLoading}>更新信息</Button>
                      </Form.Item>
                    </Col>
                </Row>
            </Form> 
        )
      }
    }
    StaffInfoForm = Form.create({
      onValuesChange({ dispatch },changedValues,allValues) {
        Object.keys(infoDetail).map(info=>{
          Object.keys(allValues).map(value=>{
            if(info == value) {
              infoDetail[info] = allValues[value]
            }
          })
        })
        if(changedValues.departmentId) {
          infoDetail.position = '';
          dispatch({
            type:'staffDetail/getPosition',
            payload:{
              id:changedValues.departmentId,
              infoDetail,
            }
          })
        }
      }
    })(StaffInfoForm)
    class WelfareInfo extends PureComponent {
      handleSubmit=(e)=>{
        e.preventDefault();
          this.props.form.validateFields((err, values) => {
            if (!err) {
              Object.keys(infoDetail).map(info=>{
                Object.keys(values).map(value=>{
                  if(info == value) {
                    infoDetail[info] = values[value]
                  }
                })
              })
              dispatch({
                  type:'staffDetail/handleCommit',
                  payload:{
                      values,
                      type:3,
                      tab3SubmitLoading:true,
                      infoDetail,
                  }
              })
            }
          });
      }
      render() {
        const {
          form,
        } = this.props;
        const { getFieldDecorator } = form;
        const formTailLayout = {
          labelCol: { 
            xl: { span: 8 },
            lg: { span: 10 },
            md: { span: 10 }

          },
          wrapperCol: { 
            xl: { span: 16 },
            lg: { span: 20 },
            md: { span: 20 }
          },
        };
        return (
          <Form onSubmit = {this.handleSubmit}>
              <Row>
                <Col xl={10} lg={12} md={12} sm={24} xs={24}>
                  <Form.Item label="银行账户"  {...formTailLayout}>
                    {
                      getFieldDecorator('bankAccount',{
                        initialValue:infoDetail.bankAccount,
                      })(
                        <Input
                        type="number"
                          />
                      )
                    }
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col xl={10} lg={12} md={12} sm={24} xs={24}>
                  <Form.Item label="账户地址"  {...formTailLayout}>
                    {
                      getFieldDecorator('bankInfo',{
                        initialValue:infoDetail.bankInfo,
                      })(
                        <Input
                          />
                      )
                    }
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col xl={10} lg={12} md={12} sm={24} xs={24}>
                  <Form.Item label="已休年假"  {...formTailLayout}>
                    {
                      getFieldDecorator('retiredAnnualLeave',{
                        initialValue:infoDetail.retiredAnnualLeave,
                      })(
                        <Input
                          />
                      )
                    }
                  </Form.Item>
                </Col>
                <Col xl={10} lg={12} md={12} sm={24} xs={24}>
                  <Form.Item label="剩余年假"  {...formTailLayout}>
                    {
                      getFieldDecorator('restAnnualLeave',{
                        initialValue:infoDetail.restAnnualLeave,
                      })(
                        <Input
                          />
                      )
                    }
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col xl={10} lg={12} md={12} sm={24} xs={24}>
                  <Form.Item label="社保账号"  {...formTailLayout}>
                    {
                      getFieldDecorator('welfareAccount',{
                        initialValue:infoDetail.welfareAccount,
                      })(
                        <Input
                        type="number"
                          />
                      )
                    }
                  </Form.Item>
                </Col>
                <Col xl={10} lg={12} md={12} sm={24} xs={24}>
                  <Form.Item label="社保基数"  {...formTailLayout}>
                    {
                      getFieldDecorator('welfareBase',{
                        initialValue:infoDetail.welfareBase,
                      })(
                        <Input
                        type="number"
                          />
                      )
                    }
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col xl={10} lg={12} md={12} sm={24} xs={24}>
                  <Form.Item label="公积金账号"  {...formTailLayout}>
                    {
                      getFieldDecorator('refundAccount',{
                        initialValue:infoDetail.refundAccount,
                      })(
                        <Input
                        type="number"
                          />
                      )
                    }
                  </Form.Item>
                </Col>
                <Col xl={10} lg={12} md={12} sm={24} xs={24}>
                  <Form.Item label="公积金基数"  {...formTailLayout}>
                    {
                      getFieldDecorator('refundBase',{
                        initialValue:infoDetail.refundBase,
                      
                      })(
                        <Input
                        type="number"
                          />
                      )
                    }
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                  <Col span={10}>
                    <Form.Item>
                      <Button type="primary" style={{marginLeft:50}} htmlType="submit" loading={tab3SubmitLoading}>更新信息</Button>
                    </Form.Item>
                  </Col>
              </Row>
          </Form>
        )
      }
    }
    WelfareInfo = Form.create({})(WelfareInfo);

    class AccountStatus extends PureComponent {
      handleSubmit=(e)=>{
        e.preventDefault();
          this.props.form.validateFields((err, values) => {
            if (!err) {
              Object.keys(infoDetail).map(info=>{
                Object.keys(values).map(value=>{
                  if(info == value) {
                    infoDetail[info] = values[value]
                  }
                })
              })
              dispatch({
                  type:'staffDetail/handleCommit',
                  payload:{
                      values,
                      type:4,
                      tab4SubmitLoading:true,
                      infoDetail,
                  }
              })
            }
          });
      }
      render() {
        const {
          form,
        } = this.props;
        const { getFieldDecorator } = form;
        const formTailLayout = {
          labelCol: { 
            xl: { span: 8 },
            lg: { span: 10 },
            md: { span: 10 }

          },
          wrapperCol: { 
            xl: { span: 16 },
            lg: { span: 20 },
            md: { span: 20 }
          },
        };
        return (
          <Form onSubmit={this.handleSubmit}>
            <Row>
              <Col xl={10} lg={12} md={12} sm={24} xs={24}>
                <Form.Item label="账号状态"  {...formTailLayout}>
                  {
                    getFieldDecorator('authorityStatus',{
                      initialValue:infoDetail.authorityStatus,
                      rules:[{
                        required: true, message: '请选择账号状态',
                      }]
                    })(
                        <RadioGroup style={{width:250}}>
                        {
                          Object.keys(statusMap).map(item=>{
                            return <Radio value={item} key={item}>{statusMap[item]}</Radio>
                          })
                        }
                        </RadioGroup>
                    )
                  }
                </Form.Item>
              </Col>
            </Row>
            <Row>
                <Col span={10}>
                  <Form.Item>
                    <Button type="primary" style={{marginLeft:50}} htmlType="submit" loading={tab4SubmitLoading}>更新信息</Button>
                  </Form.Item>
                </Col>
            </Row>
        </Form>
        )
      }
    }
    AccountStatus = Form.create({})(AccountStatus);
    return (
      <PageHeaderLayout title="员工详情">
        <Card bordered={false} loading={cardLoading}>
          <Tabs onChange={this.handleChangeTabs} tabPosition="left">
              <TabPane tab="基本信息" key="1"> 
                  <Col span={16} style={{marginLeft:40}}>
                    <Row type="flex" align="middle" style={{marginBottom:30}}>
                      <h4 style={{fontSize:20,fontWeight:'bold',paddingLeft:30}}>基本信息</h4>
                    </Row>
                    <BasicForm />
                  </Col>
                  <Col span={6} style={{marginTop:100}} style={{display:'flex',alignItems:"center",flexDirection:"column",marginTop:80}}>
                    <div style={{marginBottom:20}}>
                      <Avatar icon="user" style={{width:150,height:150,borderRadius:'50%'}} className={styles.avatar} src={backImgUrl||infoDetail.headImgUrl}></Avatar>
                    </div>
                    <Upload
                    action={`${getUrl(API_ENV)}/employee/employee/upload-head-img`}
                    headers={{
                      authorization: `Basic ${window.btoa(`${localStorage.getItem('token')}:`)}`,
                    }}
                    className={styles.globalUpload}
                    beforeUpload={this.handleBeforeUpload}
                    onChange={this.handleConfirmUpload}
                    >
                        {
                          <Button loading={uploadLoading}>
                            <Icon type="upload" /> 
                            {
                              uploadLoading?"上传中":"更换头像"
                            }
                          </Button>
                        }
                    </Upload>
                  </Col>
              </TabPane>
              <TabPane tab="员工信息" key="2">
              <Col span={16} style={{marginLeft:40}}>
                    <Row type="flex" align="middle" style={{marginBottom:30}}>
                      <h4 style={{fontSize:20,fontWeight:'bold',paddingLeft:30}}>员工信息</h4>
                    </Row>
                    <StaffInfoForm dispatch={dispatch}/>
                  </Col>
              </TabPane>
              <TabPane tab="福利信息" key="3">
                  <Col span={16} style={{marginLeft:40}}>
                    <Row type="flex" align="middle" style={{marginBottom:30}}>
                      <h4 style={{fontSize:20,fontWeight:'bold',paddingLeft:30}}>福利信息</h4>
                    </Row>
                    <WelfareInfo />
                  </Col>
              </TabPane> 
              <TabPane tab="权限管理" key="4">
                  <Col span={16} style={{marginLeft:40}}>
                    <Row type="flex" align="middle" style={{marginBottom:30}}>
                      <h4 style={{fontSize:20,fontWeight:'bold',paddingLeft:30}}>权限管理</h4>
                    </Row>
                    <AccountStatus />
                  </Col>
              </TabPane> 
              
          </Tabs>
        </Card>
      </PageHeaderLayout>
    );
  }
}

