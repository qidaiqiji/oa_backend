import React, { PureComponent } from 'react';
import globalStyles from '../../assets/style/global.less';
import { connect } from 'dva';
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import ClearIcon from '../../components/ClearIcon';
import { getUrl } from '../../utils/request';
import { stringify } from 'qs';
import {
  Card,
  Row,
  Select,
  Input,
  Table,
  Button,
  DatePicker,
  Icon,
  AutoComplete,
  Tooltip,
  Col,
  Radio,
} from 'antd';
const Search = Input.Search;
@connect(state => ({
    statisticsReport: state.statisticsReport,
}))
export default class StatisticsReport extends PureComponent{
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'statisticsReport/getConfig',
        });
    }
    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch({
          type: 'statisticsReport/unmount',
        });
    }
    handleChangeButton=(e)=>{
        const { dispatch } = this.props;
        dispatch({
          type: 'statisticsReport/updatePageReducer',
          payload:{
              buttonValue:e.target.value,
          }
        });
    }
    handleChangeSearchItem=(type,e)=>{
        const { dispatch } = this.props;
        switch(type){
            case 'brandId':
            case 'catId':
                dispatch({
                type: 'statisticsReport/updatePageReducer',
                    payload:{
                        [type]:e,
                    }
                });  
            break;  
            default:
                dispatch({
                type: 'statisticsReport/updatePageReducer',
                    payload:{
                        [type]:e.target.value,
                    }
                });
            break;
        }
    }
    handleClear=(type)=>{
        const { dispatch } = this.props;
        dispatch({
          type: 'statisticsReport/updatePageReducer',
          payload:{
              [type]:"",
          }
        });
    }
    handleChangeData=(type,dateString,date)=>{
        const { dispatch } = this.props;
        switch(type) {
            case 'time':
            dispatch({
                type: 'statisticsReport/updatePageReducer',
                payload:{
                    startTime:date[0],
                    endTime:date[1],
                }
            });
            break;
            case 'timeNow':
            dispatch({
                type: 'statisticsReport/updatePageReducer',
                payload:{
                    startTimeNow:date[0],
                    endTimeNow:date[1],
                }
            });
            break;
        }
       
    }
    render() {
        const {
            statisticsReport:{
                goodsKeywords,
                buttonValue,
                brandListMap,
                categoryMap,
                brandId,
                supplierContract,
                supplierName,
                startTime,
                endTime,
                startTimeNow,
                endTimeNow,
                catId,
            }            
        } = this.props; 
        let url = "";
        if(buttonValue == 1) {
            url = `${getUrl(API_ENV)}/common/export-sales-count`
        }else if(buttonValue == 2) {
            url = `${getUrl(API_ENV)}/common/export-stock-count`
        }else if(buttonValue == 3) {
            url = `${getUrl(API_ENV)}/common/export-purchase-count`
        }
        const exportUrl = `${url}?${stringify({
            goodsKeywords,
            brandId,
            supplierContract,
            supplierName,
            startTime,
            endTime,
            startTimeNow,
            endTimeNow,
            catId,
        })}`
       return (
        <PageHeaderLayout title="统计报表">
            <Card>
                <Row>
                    <Radio.Group onChange={this.handleChangeButton} value={buttonValue}>
                        <Radio.Button value="1">按销售对比统计</Radio.Button>
                        <Radio.Button value="2">按库存对比统计</Radio.Button>
                        <Radio.Button value="3">按订货对比统计</Radio.Button>
                    </Radio.Group>
                </Row>
                <Row style={{marginTop:20}}>
                    <Search 
                    placeholder="请输入商品条码/商品名称"
                    className={globalStyles['input-sift']}
                    style={{width:250}}
                    onChange={this.handleChangeSearchItem.bind(this,'goodsKeywords')}
                    value={goodsKeywords}
                    suffix={goodsKeywords?<ClearIcon 
                        handleClear={this.handleClear.bind(this,"goodsKeywords")}
                    />:""}  
                    />
                    <Select
                    placeholder="请选择品牌名"
                    style={{width:300,marginRight:10}}
                    onChange={this.handleChangeSearchItem.bind(this,'brandId')}
                    showSearch
                    allowClear
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                    <Select.Option value={""}>全部</Select.Option>
                      {
                        Object.keys(brandListMap).map(key => (
                          <Select.Option value={key}>{brandListMap[key]}</Select.Option>
                        ))
                      }
                    </Select>
                    <Search 
                    placeholder="请输入供应商名称/ID"
                    className={globalStyles['input-sift']}
                    onChange={this.handleChangeSearchItem.bind(this,'supplierName')}
                    value={supplierName}
                    suffix={supplierName?<ClearIcon 
                        handleClear={this.handleClear.bind(this,"supplierName")}
                    />:""}  
                    />
                    <Search 
                    placeholder="请输入供应商合同号"
                    className={globalStyles['input-sift']}
                    onChange={this.handleChangeSearchItem.bind(this,'supplierContract')}
                    value={supplierContract}
                    suffix={supplierContract?<ClearIcon 
                        handleClear={this.handleClear.bind(this,"supplierContract")}
                    />:""}  
                    />
                    <Select
                    placeholder="按品类筛选"
                    className={globalStyles['select-sift']}
                    onChange={this.handleChangeSearchItem.bind(this,'catId')}
                    style={{width:200}}
                    allowClear
                    dropdownMatchSelectWidth={false}
                    >
                    <Select.Option value="">{"全部"}</Select.Option>
                        {
                            Object.keys(categoryMap).map(key => (
                                <Select.Option value={key}>
                                   {categoryMap[key]}
                                </Select.Option>
                            ))
                        }
                    </Select>
                </Row>
                <Row style={{margin:"20px 0"}}>                    
                    <Col span={8}>{"上期时间："}
                        <DatePicker.RangePicker   
                        onChange={this.handleChangeData.bind(this,'time')}   
                        value={[startTime ? moment(startTime, 'YYYY-MM-DD') : '', endTime ? moment(endTime, 'YYYY-MM-DD') : '']}                               
                        />
                    </Col>
                    <Col span={8}>{"本期时间："}
                        <DatePicker.RangePicker     
                        onChange={this.handleChangeData.bind(this,'timeNow')}    
                        value={[startTimeNow ? moment(startTimeNow, 'YYYY-MM-DD') : '', endTimeNow ? moment(endTimeNow, 'YYYY-MM-DD') : '']}                
                        />
                    </Col>
                </Row>
                <Row>
                    <Button href={exportUrl} type="primary" target="_blank">导出报表</Button>
                </Row>
                
            </Card>
        </PageHeaderLayout>
       )
   }

}
