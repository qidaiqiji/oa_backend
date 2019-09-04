import React,{ PureComponent} from 'react'
import moment from 'moment'
import {stringify} from 'qs'
import {connect} from 'dva'
import { Card, Input, DatePicker, Icon, Table,Row,Col,Select,Tooltip,Button,Checkbox,Tabs} from 'antd'
import {Link} from 'dva/router'
import PageHeaderLayout from '../../layouts/PageHeaderLayout'
import styles from './CustomerList.less'
import globalStyles from '../../assets/styles/global.less'

const {Search} = Input
const {Option} = Select
const {RangePicker} = DatePicker
const {TabPane} =Tabs

@connect(state=>({
    customerList:state.customerList
}))
export default class CustomerList extends PureComponent{
    componentDidMount(){
        const {dispatch} = this.props
        dispatch({
            type:'customerList/mount',
        })
    }
    compomentWillUnmount(){
        const {dispatch} = this.props
        dispatch({
            type:'customerList/unmount'
        })
    }
    handleChangeSiftItem(type,e,dataStrings){
        const {dispatch} =this.props
        switch(type){
            case 'customerId':
            case 'customerKeywords':
            case 'goodsSn':
            dispatch({
                type:'customerList/changeConfig',
                payload:{
                    [type]: e.target.value
                }
            })
            break;
            case 'payDate':
            dispatch({
                type:'customerList/getList',
                payload:{
                    payStartDate:dataStrings[0],
                    payEndDate:dataStrings[1],
                    currentPage:1,
                }
            })
            break;
            case 'seller':
            dispatch({
                type: 'customerList/getList',
                payload:{
                    [type]:e,
                    currentPage:1
                }
            })
            break;
            case 'currentPage':
            dispatch({
                type:'customerList/getList',
                payload:{
                    [type]:e
                }
            })
            break;
            case 'pageSize':
            dispatch({
                type:'customerList/getList',
                payload:{
                    [type]:dataStrings
                }
            })



            //结束switch
        }
    }

}