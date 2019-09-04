
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Input, Row, Col, Select, Button, Form, Radio } from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import globalStyles from '../../assets/style/global.less';
import TextArea from 'antd/lib/input/TextArea';
const { Option } = Select;
@connect(state => ({
  agentAdd: state.agentAdd,
}))
@Form.create()
export default class AgentAdd extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    const { id } = this.props.match.params;
    if(id) {
      dispatch({
        type: 'agentAdd/getAgentInfo',
        payload: {
          id,
        },
      });
    }   
    dispatch({
      type: 'agentAdd/getConfig',
    }); 
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'agentAdd/unmountReducer',
    });
  }
  handleSubmit=(e)=>{
    const { dispatch } = this.props;
    e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
          dispatch({
              type:'agentAdd/handleCommit',
              payload:{
                  values,
              }
          })
        }
      });
  }
  render() {
    const { 
        form,
        agentAdd: {
            id,
            statusMap,
            provinceMap,
            status,
            remark,
            name,
            mobile,
            provinceId,
        }
    } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
        labelCol: { span: 2 },
        wrapperCol: { span: 6 },
    };
    return (
      <PageHeaderLayout title={id?"编辑经销商":"新增经销商"}>
        <Card bordered={false}>
            <Form onSubmit={this.handleSubmit}>
                <Row>
                  <Form.Item {...formItemLayout} label="经销商名称">
                    {
                      getFieldDecorator('name',{
                        initialValue:name,
                        rules:[
                          {
                              required: true, message: '请输入经销商名称',
                          }
                        ]
                      })(
                        <Input
                        placeholder="请输入经销商名称"
                        style={{width:300}}
                        />
                      )
                    }
                  </Form.Item>
                </Row>
                <Row>
                  <Form.Item {...formItemLayout} label="手机号">
                    {
                      getFieldDecorator('mobile',{
                        initialValue:mobile,
                        validateTrigger:'onBlur',
                        rules:[
                          {
                            pattern: /^1[0-9]{10}$/, message: '请输入正确的手机号码格式',
                          },
                        ]
                      })(
                        <Input
                        placeholder="请输入手机号"
                        style={{width:300}}
                        />
                      )
                    }
                  </Form.Item>
                </Row>
                <Row>
                  <Form.Item {...formItemLayout} label="所属省份">
                    {
                      getFieldDecorator('province',{
                        initialValue:""+provinceId
                      })(
                        <Select
                        style={{width:300}}
                        >
                          {
                            Object.keys(provinceMap).map(item=>{
                              return <Select.Option value={item}>{provinceMap[item]}</Select.Option>
                            })
                          }

                        </Select>
                      )
                    }
                  </Form.Item>
                </Row>
                <Row>
                  <Form.Item {...formItemLayout} label="备注">
                    {
                      getFieldDecorator('remark',{
                        initialValue:remark
                      })(
                        <TextArea 
                        rows={5}
                        style={{width:500}}
                        />
                      )
                    }
                  </Form.Item>
                </Row>
                <Row>
                  <Form.Item {...formItemLayout} label="状态">
                    {
                      getFieldDecorator('status',{
                        initialValue:''+status
                      })(
                          <Radio.Group>
                              <Radio value={'1'}>启用</Radio>
                              <Radio value={'2'}>禁用</Radio>
                          </Radio.Group>
                      )
                    }
                  </Form.Item>
                </Row>
                <Row>
                    <Col span={5} offset={2}>
                      <Button htmlType="submit" type="primary" style={{marginRight:20}}>保存</Button>
                      <Button>取消</Button>
                    </Col>
                </Row>
            </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
