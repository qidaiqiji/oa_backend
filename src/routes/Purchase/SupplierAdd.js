import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import {
  Card,
  Row,
  Col,
  DatePicker,
  Input,
  Select,
  Button,
  Radio,
  Icon,
  Tabs,
  Modal,
  Table,
  notification,
  Tooltip,
  Upload,
  message,
  Affix,
  Alert,
} from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './SupplierAdd.less';
import globalStyles from '../../assets/style/global.less';
const { Option } = Select;
const { TextArea } = Input;
const { Group: RadioGroup } = Radio;
const TabPane = Tabs.TabPane;
const { RangePicker } = DatePicker;

@connect(state => ({
  supplierAdd: state.supplierAdd,
}))
export default class SupplierAdd extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    const { id } = this.props.match.params;
    const { key } = this.props.match.params;
    if (id) {
      dispatch({
        type: 'supplierAdd/getInfoById',
        payload: {
          id,
          activeKey:key,
        },
      });
    }
    dispatch({
      type: 'supplierAdd/getConfig',
    });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierAdd/unmount',
    });
  }
  handleChange(type, ...rest) {
    const { dispatch, supplierAdd } = this.props;
    switch (type) {
      case 'supplierProperty':
      case 'payMethod':
        dispatch({
          type: 'supplierAdd/updatePageReducer',
          payload: {
            [type]: rest[0],
          },
        });
        break;
      case 'contractExpireDate':
        dispatch({
          type: 'supplierAdd/updatePageReducer',
          payload: {
            contractExpireDateStart:rest[1][0],
            contractExpireDateEnd:rest[1][1],
          },
        });
        break;
      // case 'reduceFinanceMark':
      //   dispatch({
      //     type: 'supplierAdd/reduceFinanceMark',
      //     payload: {
      //       index: rest[0],
      //     },
      //   });
      //   break;
      // case 'plusFinanceMark':
      //   dispatch({
      //     type: 'supplierAdd/plusFinanceMark',
      //   });
      //   break;
        case 'isSign':
        dispatch({
            type: 'supplierAdd/updatePageReducer',
                payload: {
                    [type]: rest[0].target.value,
                    // isChangeSign: true,
                },
            });
        break;
      default:
        dispatch({
          type: 'supplierAdd/updatePageReducer',
          payload: {
            [type]: rest[0].target.value,
          },
        });
        break;
    }
  }
  handleSaveSupplier=() => {
    const { dispatch, supplierAdd } = this.props;
    const { supplierName, contact, mobile, payInfoList, contractExpireDateStart, contractExpireDateEnd, isSign } = supplierAdd;
    const isOk = /^1[0-9]{10}$/.test(mobile)
    if(!isOk){
      message.error("请输入正确的手机号码！");
      return;
    }
    if (!supplierName) {
      message.error('请填写供应商名称');
      return;
    }
    if (!contact) {
      message.error('请填写联系人姓名');
      return;
    }
    if (!mobile) {
      message.error('请填写联系人手机号');
      return;
    }
    if(+isSign) {
      if(!contractExpireDateStart||!contractExpireDateEnd) {
        message.error('请填写合同到期时间');
        return;
      }
    }
    
    let finalPayInfoList = [...payInfoList];
      finalPayInfoList.map((item,index)=>{
          if(item.bankName==""&&item.bankInfo == ""&&item.bankAccount == "") {
            finalPayInfoList.splice(index,1)
          }
      })
      let count = 1;
      for(let i = 0; i<finalPayInfoList.length;i++) {
        for(let j = 0;j<i;j++){
          if(finalPayInfoList[i].bankAccount == finalPayInfoList[j].bankAccount) {
            count++;
          }
        }
      }
      const isBankNameEmpty = finalPayInfoList.some(item=>item.bankName.length<=0);
      const isBankInfoEmpty = finalPayInfoList.some(item=>item.bankInfo.length<=0);
      const isBankAccountEmpty = finalPayInfoList.some(item=>item.bankAccount.length<=0);
      if(isBankNameEmpty) {
        message.error("开户名称不能为空");
        return;
      }
      if(isBankInfoEmpty) {
        message.error("开户行不能为空");
        return;
      }
      if(isBankAccountEmpty) {
        message.error("银行账户不能为空");
        return;
      }
      if(count>=2) {
        message.error("银行账号不唯一,请核对后再提交");
        return;
      }else{
        dispatch({
          type: 'supplierAdd/updatePageReducer',
          payload:{
            showConfrimModal:true,
            finalPayInfoList,
          }
        });
      }
      // if(!isOnly){
      //   
      // }
  }
  handleConfirmCheck=()=>{
    const { dispatch, supplierAdd } = this.props;
    const { activeKey, brandList } = supplierAdd;
    if(activeKey == "1") {
      dispatch({
        type: 'supplierAdd/saveSupplier',
        payload:{
          submitSupplierBtnLoading:true,
        }
      });
    }else{
      dispatch({
        type:'supplierAdd/checkBrandInfo',
      })
    }
    
  }
  /** ----------保存品牌信息------ */
  handleChangeBrandInfo(type, brandId, e) {
    const { dispatch } = this.props;
    switch (type) {
      case 'brandPolicy':
      case 'payMoney':
      case 'remark':
        dispatch({
          type: 'supplierAdd/ChangeBrandInfo',
          payload: {
            [type]: e.target.value,
            brandId,
          },
        });
        break;
      case 'supplierLevel':
      case 'purchaser':
        dispatch({
          type: 'supplierAdd/ChangeBrandInfo',
          payload: {
            [type]:e,
            brandId,
          },
        });
        break;
      case 'brandId':
        dispatch({
          type: 'supplierAdd/ChangeBrandInfo',
          payload: {
            [type]: e,
            brandId,
          },
        });
        break;
    }
  }
  /** -------------新增:onChange的时候把填写的信息保存起来-------------- */
  handleAddBrandInfo(type, e) {
    const { dispatch } = this.props;
    switch (type) {
      case 'brandPolicy':
      case 'payMoney':
      case 'brandRemark':
        dispatch({
          type: 'supplierAdd/updatePageReducer',
          payload: {
            [type]: e.target.value,
          },
        });
        break;
      case 'supplierLevel':
        dispatch({
          type: 'supplierAdd/updatePageReducer',
          payload: {
            [type]:e, 
          },
        });
        break;
      case 'brandId':
        dispatch({
          type: 'supplierAdd/updatePageReducer',
          payload: {
            [type]: e,
          },
        });
        break;
    }
  }
/** -------------------点击保存提交品牌信息--------------- */
handleSubmitBrandInfo=() => {
  const { dispatch, supplierAdd } = this.props;
  const { id, supplierLevel , brandId, payMoney} = supplierAdd;
  if(!supplierLevel) {
    message.error("请填写指定等级");
    return;
  }
  if(+payMoney < 0){
    message.error("入住费用不能为负");
    return;
  }
  dispatch({
    type: 'supplierAdd/submitAddBrandInfo',
    payload: {
      brandId,
      supplierId: id,
    },
  });
}
/** -----------------------点击修改/保存------------------------------ */
    handleSaveBrandInfo=(id) => {
      const { dispatch, supplierAdd } = this.props;
      const { brandList } = supplierAdd;
      brandList.map((item) => {
        if (+item.id === +id) {
          if (!item.isSaved) {
            item.isSaved = !item.isSaved;
            dispatch({
              type: 'supplierAdd/updatePageReducer',
              payload: {
                brandList,
              },
            });
          } else {
            const currentEdit = item;
            currentEdit.supplierBrandId = currentEdit.id;
            item.isSaved = !item.isSaved;
            dispatch({
              type: 'supplierAdd/editBrandInfo',
              payload: {
                currentEdit,
              },
            });
          }
        }
      });
    }
  /** ------------------点击删除删除品牌信息---------------------- */
    handleDeleteBrandInfo(id) {
      const { dispatch } = this.props;
      dispatch({
        type: 'supplierAdd/updatePageReducer',
        payload: {
          supplierBrandId: id,
          isShowDeleteModal: true,
        },
      });

    }
    // 撤销删除品牌
    handleCancelRemoveBrand=(id)=>{
      const { dispatch } = this.props;
      dispatch({
        type: 'supplierAdd/cancelRemoveBrand',
        payload: {
          supplierBrandId: id,
        },
      });
    }
  // 点击取消关闭删除弹窗
    handleCloseModal=(type) => {
      const { dispatch } = this.props;
      dispatch({
        type: 'supplierAdd/updatePageReducer',
        payload: {
          [type]: false,
        },
      });
    }
  // 点击确定删除商品
    handleDelete=() => {
      const { dispatch, supplierAdd } = this.props;
      const { supplierBrandId } = supplierAdd;
      dispatch({
        type: 'supplierAdd/DeleteBrandInfo',
        payload: {
          isShowDeleteModal: false,
          supplierBrandId,
        },
      });
    }
  // 添加供应商品
    addBrandGoods=(brandId, id) => {
      const { dispatch, supplierAdd } = this.props;
      const { brandList } = supplierAdd;
      const selectedBrand = brandList.filter(item => +item.id === +id);
      dispatch({
        type: 'supplierAdd/addSipplierGoods',
        payload: {
          brandId,
          supplierBrandId: id,
          isShowGoodsModal: true,
          selectedBrand: selectedBrand[0],
        },
      });

    }
  // 选择弹窗的商品
    handleCheckGoods(goodsIds) {
      const { dispatch } = this.props;
      dispatch({
        type: 'supplierAdd/updatePageReducer',
        payload: {
          goodsCheckboxIds: goodsIds,
        },
      });
    }
  // 弹窗内的搜索商品
    handleMoreSearchGoods(value) {
      const { dispatch } = this.props;
      dispatch({
        type: 'supplierAdd/searchGoods',
        payload: {
          curPage: 1,
          keywords: value,
        },
      });

    }
  // 弹窗点击确定
    handleSubmitGoods=() => {
      const { dispatch, supplierAdd } = this.props;
      const { goodsCheckboxIds, supplierBrandId } = supplierAdd;
      if (goodsCheckboxIds.length === 0) {
        notification.warning({
          message: '警告提示',
          description: '请先选择商品再进行添加',
        });
        return;
      }
      dispatch({
        type: 'supplierAdd/changeGoods',
        payload: {
          supplierBrandId,
          goodsIds: goodsCheckboxIds,
          isShowGoodsModal: false,
        },
      });
    }
  // 点击取消关闭弹窗
    handleClose=() => {
      const { dispatch } = this.props;
      dispatch({
        type: 'supplierAdd/updatePageReducer',
        payload: {

          isShowGoodsModal: false,
        },
      });
    }
    handleSelectGoods(supplierBrandId, selectId, selectRows) {
      const { dispatch, supplierAdd } = this.props;
      const { brandList } = supplierAdd;
      brandList.map((item) => {
        if (+item.id === +supplierBrandId) {
          item.selectGoodsId = selectId;
          item.selectRows = selectRows;
        }
      });
      dispatch({
        type: 'supplierAdd/updatePageReducer',
        payload: {
          brandList,
        },
      });

    }
  // 新增结算方式
    addNewPayMethods=() => {
      const { dispatch } = this.props;
      dispatch({
        type: 'supplierAdd/updatePageReducer',
        payload: {
          isShowAddMethods: true,
        },
      });
    }
    handleAddNewPaymentMathods=() => {
      const { dispatch, supplierAdd } = this.props;
      const { payType } = supplierAdd;
      dispatch({
        type: 'supplierAdd/addNewMethods',
        payload: {
          payType,
          isShowAddMethods: false,
        },
      });
    }
    handleCancelNewPaymentMathods=() => {
      const { dispatch } = this.props;
      dispatch({
        type: 'supplierAdd/updatePageReducer',
        payload: {
          isShowAddMethods: false,
        },
      });
    }
  // 填写内容
    handleChangeInfos=(currentId, type, e) => {
      const { dispatch } = this.props;
        dispatch({
          type: 'supplierAdd/ChangeSupplyInfos',
          payload: {
            [type]: e.target.value,
            goodsId: currentId,
          },
        });
    }
    handleChangeSlect=(record, currentId, type, e) => {
      const { dispatch } = this.props;
      const { id } = this.props.match.params;
      switch (type) {
        case 'payMethod':
          record.payMethod = e;
          break;
        case 'productProperty':
          record.productProperty = e;
          break;
      }
      const goodsInfos = [];
      goodsInfos.push(record);
      dispatch({
        type: 'supplierAdd/updateSupplyGoods',
        payload: {
          id,
          //   supplierBrandId:currentId,
          goodsInfos,
        },
      });


    }
    handleChangePurchaser=(selectedRows, supplierBrandId, type, e) => {
      const { dispatch } = this.props;
      const { id } = this.props.match.params;
      switch (type) {
        case 'methods':
          selectedRows.map((item) => {
            item.payMethod = e;
          });
          break;
        case 'property':
          selectedRows.map((item) => {
            item.productProperty = e;
          });
          break;
      }
      dispatch({
        type: 'supplierAdd/updateByChange',
        payload: {
          supplierBrandId,
          selectedRows,
          id,
        },
      });
    }

    // 批量修改发货地
    changeSendPlace=(e) => {
      const { dispatch } = this.props;
      dispatch({
        type: 'supplierAdd/updatePageReducer',
        payload: {
          allSendPalce: e.target.value,
        },
      });
    }
    handleSaveAllChange=(supplierBrandId, selectedRows) => {
      const { dispatch, supplierAdd } = this.props;
      const { brandList, allSendPalce } = supplierAdd;
      const { id } = this.props.match.params;
      selectedRows.map((item) => {
        item.shippingPlace = allSendPalce;
      });
      dispatch({
        type: 'supplierAdd/updateByChange',
        payload: {
          supplierBrandId,
          selectedRows,
          id,
        },
      });

      brandList.map((item) => {
        if (+item.id === +supplierBrandId) {
          item.selectRows = [];
          item.selectGoodsId = [];
        }
      });
      dispatch({
        type: 'supplierAdd/updatePageReducer',
        payload: {
          brandList,
        },
      });
    }
  // 新增新的结算方式
    addNewPayment=(e) => {
      const { dispatch } = this.props;
      dispatch({
        type: 'supplierAdd/updatePageReducer',
        payload: {
          payType: e.target.value,
        },
      });

    }
  // 换页
    handleChangePage(page) {
      const { dispatch, supplierAdd } = this.props;
      const { brandId } = supplierAdd;
      dispatch({
        type: 'supplierAdd/addSipplierGoods',
        payload: {
          curPage: page,
          brandId,
        },
      });
    }
  // 删除已添加的供应商品
    handleDeleteGoods=(id, supplierBrandId) => {
      const { dispatch } = this.props;
      dispatch({
        type: 'supplierAdd/deleteGoods',
        payload: {
          id,
          supplierBrandId,
        },
      });
    }
  // 上传合同的弹窗
  handleShowUploadModal=()=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierAdd/updatePageReducer',
      payload: {
        showUploadModal:true,
      },
    });
  }
  handleCancelUplaod=()=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierAdd/updatePageReducer',
      payload: {
        showUploadModal:false,
        fileList:[],
        files: [],
      },
    });
  }
  handleForwardBrand=()=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierAdd/getSupplierInfo',
      payload: {
        activeKey:"2"
      },
    });
  }
  handleCancelForward=()=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierAdd/getSupplierInfo',
      payload: {
        isShowNextStepModal: false,
      },
    });
  }
  handleChangeActiveKey=(activeKey)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierAdd/updatePageReducer',
      payload: {
        activeKey,
      },
    });
  }
  handlePreview=(file)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierAdd/updatePageReducer',
      payload: {
        previewModal:true,
        previewUrl:file.thumbUrl,
      },
    });
  }
  handleClosePreviewModal=()=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierAdd/updatePageReducer',
      payload: {
        previewModal:false,
      },
    });
  }
  // 确认上传合同
  handleConfirmUploadContract=()=>{
    const { dispatch, supplierAdd } = this.props;
    const { fileList } = supplierAdd;
    const formData = new FormData();
    if(fileList.length == 0) {
        message.error("请添加合同图片");
        return;
    }
    fileList.forEach((file) => {
      formData.append('files[]', file);
    });
    dispatch({
      type: 'supplierAdd/uploadContract',
      payload: {
        formData,
        uploadBtnLoading: true,
      },
    });
  }
  // 代理品牌信息提交审核
  handleCheckBrandInfo=()=>{
    const { dispatch, supplierAdd } = this.props;
    const { brandList } = supplierAdd;
    if(brandList.length<=0) {
      message.error("请添加供应商代理品牌信息再提交审核");
      return;
    }
    dispatch({
      type:'supplierAdd/updatePageReducer',
      payload:{
        showConfrimModal:true,
      }
    })
    
  }
  handleDeleteAttachment=(index)=>{
    const { dispatch }  = this.props;
      dispatch({
        type:'supplierAdd/changeDefault',
        payload:{
            index,
            showDeleteContractModal:true,
        }
      })
  }
  // 删除合同附件，新增的时候直接删除，修改的时候删除的要在前端展示
  handleConfirmDelete=()=>{
    const { dispatch, supplierAdd }  = this.props;
    const { contractList,index} = supplierAdd;
    dispatch({
      type:'supplierAdd/deleteAttachment',
      payload:{
          deleteId:contractList[index].id,
      }
    })
  }
  // 预览
  handlePreviewAttachment=(previewUrl)=>{
    const { dispatch } = this.props;
    dispatch({
      type:'supplierAdd/updatePageReducer',
      payload:{
        previewModal:true,
        previewUrl,
      }
    })
  }
  handleUpdateSupplyGoods=(currentId, record, e) => {
    const { dispatch } = this.props;
    const { id } = this.props.match.params;
    const goodsInfos = [];
    goodsInfos.push(record);
    dispatch({
      type: 'supplierAdd/updateSupplyGoods',
      payload: {
        id,
        //   supplierBrandId:currentId,
        goodsInfos,
      },
    });
  }
  handleChangePayInfo=(infoName,type,index,e)=>{
    const { dispatch, supplierAdd } = this.props;
    const { payInfoList } = supplierAdd;
    payInfoList.map(item=>{
      if(+item.type === +type) {
        if(payInfoList[index][infoName] != e.target.value && payInfoList[index].id) {
          payInfoList[index].isUpdate = 1;
        }
        if(!payInfoList[index].id) {
          payInfoList[index].isNew = 1;
        }
        payInfoList[index][infoName] = e.target.value;
      }
      // if(item.infoName != e.target.value) {
      //   item.isUpdate = 1;
      // }
    })
    dispatch({
      type: 'supplierAdd/changeDefault',
      payload: {
        payInfoList
      },
    });
  }
  handleCancelDeleteContract=(index, currentId)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierAdd/cancelDeleteContract',
      payload: {
        index,
        currentId,
      },
    });
  }
  handleCancelDelete=(index)=>{
    const { dispatch, supplierAdd } = this.props;
    const { payInfoList } = supplierAdd;
    payInfoList[index].isRemove = 0;
    payInfoList[index].isDelete = 0;
    dispatch({
      type: 'supplierAdd/changeDefault',
      payload: {
        payInfoList
      },
    });
  }
  handleCancelDeleteGoods=(goodsId,supplierBrandId)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierAdd/cancelDeleteGoods',
      payload: {
        goodsId,
        supplierBrandId
      },
    });
  }
  handleCheckInput=(e)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'supplierAdd/updatePageReducer',
      payload: {
        mobile:e.target.value,
      },
    });
  }
  handleChangeBnakInfo=(type,bankType,index)=>{
    const { dispatch } = this.props; 
    switch(type) {
      case 'plusFinanceMark':
      dispatch({
        type: 'supplierAdd/plusFinanceMark',
        payload:{
          bankType,
          index,
        }
      });
      break;
      default:
      dispatch({
        type: 'supplierAdd/reduceFinanceMark',
        payload:{
          bankType,
          index,
        }
      });
      break;
    }
  }
    render() {
      const {
        dispatch,
        supplierAdd: {
          supplierName,
          mobile,
          supplierProperty,
          contractExpireDateStart,
          contractExpireDateEnd,
          status,
          contact,
          supplierLevel,
          isSign,
          remark,
          brandRemark,
          brandList,
          isShowDeleteModal,
          goodsList,
          isShowGoodsModal,
          goodsCheckboxIds,
          brandPolicy,
          payMoney,
          isShowAddMethods,
          brandListMap,
          brandId,
          selectedBrand,
          total,
          curPage,
          payType,
          payMethod,
          pageSize,
          isTableLoading,
          showUploadModal,
          isShowNextStepModal,
          activeKey,
          previewUrl,
          previewModal,
          fileList,
          files,
          // privateBankInfo,
          id,
          contractList,
          supplierPropertyMap,
          uploadBtnLoading,
          submitSupplierBtnLoading,
          supplierLevelMap,
          payInfoList,
          showDeleteContractModal,
          brandStatus,
          canEdit,
          purchaserMap,
          purchaser,
          supplierGoodsPayMethodMap,
          payMethodMap,
          showConfrimModal,
        },
      } = this.props;
      const privateBankInfo = [];
      payInfoList.map(item=>{
        if(item.type == "2") {
          privateBankInfo.push(item)
        }
      })
      const uploadButton = (
        <div>
          <Icon type='plus' />
          <div>上传合同</div>
        </div>
      );
      const props = {
        onRemove:(file)=>{
          const index = fileList.indexOf(file);
          const newFileList = fileList.slice();
          newFileList.splice(index, 1);
          dispatch({
            type:'supplierAdd/updatePageReducer',
            payload:{
              fileList: newFileList,
              files: newFileList,
            }
          })
        },
        beforeUpload:(file)=>{
          let fileList = [];
          let count = [];
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = e => {
            file.thumbUrl = e.target.result;
            files.push(file);
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
            dispatch({
              type:'supplierAdd/updatePageReducer',
              payload:{
                fileList:[...fileList,...files],
              }
          })
          };
          return false;
        },
        onPreview:this.handlePreview,
        fileList,
        listType:"picture-card",
        multiple:true,
      }
      const toggleColumns = [
        {
          dataIndex: 'operation',
          key: 'operation',
          render: (_, record) => {
            return record.isDelete?<Tooltip title="撤销删除"><Button icon="reload" onClick={this.handleCancelDeleteGoods.bind(this, record.id, record.supplierBrandId)} /></Tooltip>
            :<Button icon="minus" size="small" onClick={this.handleDeleteGoods.bind(this, record.id, record.supplierBrandId)} />
          },
        },
      ]
      const columns = [
        {
          title: '商品图片',
          dataIndex: 'img',
          key: 'img',
          render: (img) => {
            return <img src={img} style={{ width: 50, height: 50 }} />;
          },
        },
        {
          title: '商品名称',
          dataIndex: 'goodsName',
          key: 'goodsName',
          width: 150,
          render:(goodsName)=>{
            return <Tooltip title={goodsName}><div className={globalStyles.twoLine} style={{width:130}}>{goodsName}</div></Tooltip>
          }
        },
        {
          title: '条码',
          dataIndex: 'goodsSn',
          key: 'goodsSn',
          width: 80,
        },
        {
          title: '零售价',
          dataIndex: 'marketPrice',
          key: 'marketPrice',
          width: 80,
          render:(marketPrice)=>{
            return <span>{parseFloat(marketPrice)}</span>
          }
        },
        {
          title: '平台售价',
          dataIndex: 'shopPrice',
          key: 'shopPrice',
          width: 80,
          render:(shopPrice)=>{
            return <span>{parseFloat(shopPrice)}</span>
          }
        },
        {
          title: '含税进价',
          dataIndex: 'purchaseTaxPrice',
          key: 'purchaseTaxPrice',
          width: 90,
          render: (purchaseTaxPrice, record) => {
            return record.isDelete?<span>{parseFloat(purchaseTaxPrice)}</span>:<Tooltip title={+record.changeBeforePurchaseTaxPrice&&brandStatus!=3?`变更前：${record.changeBeforePurchaseTaxPrice}`:""}>
              <Input
            value={record.purchaseTaxPrice}
            style={{borderColor:+record.changeBeforePurchaseTaxPrice&&brandStatus!=3?"red":""}}
            onChange={this.handleChangeInfos.bind(this, record.goodsId, 'purchaseTaxPrice')}
            onBlur={this.handleUpdateSupplyGoods.bind(this, record.goodsId, record)}
              />
            </Tooltip>
          },
        },
        {
          title: '未税进价',
          dataIndex: 'purchasePrice',
          key: 'purchasePrice',
          width: 90,
          render: (purchasePrice, record) => {
            return record.isDelete?<span>{parseFloat(purchasePrice)}</span>:<Tooltip title={+record.changeBeforePurchasePrice&&brandStatus!=3?`变更前：${record.changeBeforePurchasePrice}`:""}>
              <Input
            value={purchasePrice}
            style={{borderColor:+record.changeBeforePurchasePrice&&brandStatus!=3?"red":""}}
            onChange={this.handleChangeInfos.bind(this, record.goodsId, 'purchasePrice')}
            onBlur={this.handleUpdateSupplyGoods.bind(this, record.goodsId, record)}
              />
            </Tooltip>
          },
        },
        {
          title: '含税返利后进价',
          dataIndex: 'taxRebatePurchasePrice',
          key: 'taxRebatePurchasePrice',
          width: 90,
          render: (taxRebatePurchasePrice, record) => {
            return record.isDelete?<span>{taxRebatePurchasePrice}</span>:<Tooltip title={+record.changeBeforeTaxRebatePurchasePrice&&brandStatus!=3?`变更前：${record.changeBeforeTaxRebatePurchasePrice}`:""}>
              <Input
              value={record.taxRebatePurchasePrice}
            style={{borderColor:+record.changeBeforeTaxRebatePurchasePrice&&brandStatus!=3?"red":""}}
            onChange={this.handleChangeInfos.bind(this, record.goodsId, 'taxRebatePurchasePrice')}
            onBlur={this.handleUpdateSupplyGoods.bind(this, record.goodsId, record)}
              />
            </Tooltip>
          },
        },
        {
          title: '不含税返利后进价',
          dataIndex: 'rebatePurchasePrice',
          key: 'rebatePurchasePrice',
          width: 90,
          render: (rebatePurchasePrice, record) => {
            return record.isDelete?<span>{rebatePurchasePrice}</span>:<Tooltip title={+record.changeBeforeRebatePurchasePrice&&brandStatus!=3?`变更前：${record.changeBeforeRebatePurchasePrice}`:""}>
              <Input
              value={record.rebatePurchasePrice}
            style={{borderColor:+record.changeBeforeRebatePurchasePrice&&brandStatus!=3?"red":""}}
            onChange={this.handleChangeInfos.bind(this, record.goodsId, 'rebatePurchasePrice')}
            onBlur={this.handleUpdateSupplyGoods.bind(this, record.goodsId, record)}
              />
            </Tooltip>
          },
        },
        {
          title: '结算方式',
          dataIndex: 'payMethod',
          key: 'payMethod',
          render: (payMethod, record) => {
            return record.isDelete?<span>{supplierGoodsPayMethodMap[payMethod]}</span>:<Tooltip title={+record.changeBeforePayMethod&&brandStatus!=3?`变更前：${supplierGoodsPayMethodMap[record.changeBeforePayMethod]}`:""}>
              <Select
              style={{ width: 100}}
              className={+record.changeBeforePayMethod&&brandStatus!=3?styles.globalSelect:""}
              value={supplierGoodsPayMethodMap[payMethod]}
              onSelect={this.handleChangeSlect.bind(this, record, record.goodsId, 'payMethod')}
              dropdownMatchSelectWidth={false}
                >
              {Object.keys(supplierGoodsPayMethodMap).map(key => (
                <Option value={key}>
                    {supplierGoodsPayMethodMap[key]}
                </Option>
                ))}
              </Select>
            </Tooltip>;
          },
        },
        {
          title: '条码政策',
          key: 'snPolicy',
          dataIndex: 'snPolicy',
          width:120,
          render: (snPolicy,record) => {
            return  (record.isDelete?<span>{snPolicy}</span>:<Tooltip title={record.changeBeforeSnPolicy&&brandStatus!=3?`变更前：${record.changeBeforeSnPolicy}`:""}>
            <Input
            value={snPolicy}
            style={{borderColor:record.changeBeforeSnPolicy&&brandStatus!=3?"red":""}}
            onChange={this.handleChangeInfos.bind(this, record.goodsId, 'snPolicy')}
            onBlur={this.handleUpdateSupplyGoods.bind(this, record.goodsId, record)}
              />
          </Tooltip>);
          },
        }, 
        {
          title: '品牌方控价要求',
          dataIndex: 'requestPrice',
          key: 'requestPrice',
          render: (requestPrice, record) => {
            return (record.isDelete?<span>{parseFloat(requestPrice)}</span>:<Tooltip title={record.changeBeforeRequestPrice&&brandStatus!=3?`变更前：${record.changeBeforeRequestPrice}`:""}>
              <Input
              value={requestPrice}
              style={{borderColor:record.changeBeforeRequestPrice&&brandStatus!=3?"red":""}}
              onChange={this.handleChangeInfos.bind(this, record.goodsId, 'requestPrice')}
              onBlur={this.handleUpdateSupplyGoods.bind(this, record.goodsId, record)}
                />
            </Tooltip>);
          },
        },
       
        {
          title: '运费政策',
          dataIndex: 'shippingPolicy',
          key: 'shippingPolicy',
          render: (shippingPolicy, record) => {
            return (record.isDelete?<span>{shippingPolicy}</span>:<Tooltip title={record.changeBeforeShippingPolicy&&brandStatus!=3?`变更前：${record.changeBeforeShippingPolicy}`:shippingPolicy}>
              <Input
                value={shippingPolicy}
                style={{borderColor:record.changeBeforeShippingPolicy&&brandStatus!=3?"red":""}}
                onChange={this.handleChangeInfos.bind(this, record.goodsId, 'shippingPolicy')}
                onBlur={this.handleUpdateSupplyGoods.bind(this, record.goodsId, record)}
                />
            </Tooltip>);
          },
        },
        {
          title: '发货地',
          dataIndex: 'shippingPlace',
          key: 'shippingPlace',
          render: (shippingPlace, record) => {
            return (record.isDelete?<span>{shippingPlace}</span>:<Tooltip title={record.changeBeforeShippingPlace&&brandStatus!=3?`变更前：${record.changeBeforeShippingPlace}`:shippingPlace}>
              <Input
              value={shippingPlace}
              style={{borderColor:record.changeBeforeShippingPlace&&brandStatus!=3?"red":""}}
              onChange={this.handleChangeInfos.bind(this, record.goodsId, 'shippingPlace')}
              onBlur={this.handleUpdateSupplyGoods.bind(this, record.goodsId, record)}
            />
            </Tooltip>);
          },
        },
        {
          title: '备注',
          dataIndex: 'goodsRemark',
          key: 'goodsRemark',
          render: (goodsRemark, record) => {
            return (record.isDelete?<span>{goodsRemark}</span>:<Tooltip title={goodsRemark}>
              <Input
                value={goodsRemark}
                onChange={this.handleChangeInfos.bind(this, record.goodsId, 'goodsRemark')}
                onBlur={this.handleUpdateSupplyGoods.bind(this, record.goodsId, record)}
                />
            </Tooltip>);
          },
        },
      ];
      const modalColumns = [
        {
          title: '商品图片',
          dataIndex: 'img',
          key: 'img',
          render: (img) => {
            return <img src={img} style={{ width: 50, height: 50 }} />;
          },
        },
        {
          title: '商品名称',
          dataIndex: 'goodsName',
          key: 'goodsName',
        },
        {
          title: '条码',
          dataIndex: 'goodsNo',
          key: 'goodsNo',
        },
        {
          title: '零售价',
          dataIndex: 'marketPrice',
          key: 'marketPrice',
        },
        {
          title: '平台售价',
          dataIndex: 'shopPrice',
          key: 'shopPrice',
        },
        {
          title: '单位',
          dataIndex: 'unit',
          key: 'unit',
        },
      ];
      return (
        <PageHeaderLayout
          title={this.props.match.params.id ? '修改供应商' : '新增供应商'}
          iconType="question-circle"
          tips={
          <div>
              <p>采购专员，采购经理创建供应商需采购主管确认后将开通生效供应商账户！</p>
          </div>}
      >
          <Card bordered={false}>
            <Tabs
            activeKey={activeKey}
            onChange={this.handleChangeActiveKey}
        >
            <TabPane tab="供应商信息" key="1">
              <Row type="flex" justify="end" style={{ paddingRight: 100 }}>
            </Row>
              <Card title="基础信息" style={{ marginTop: 20 }}>
              <Row gutter={{ md: 24 }} style={{ marginBottom: 10}}>
                <Col md={10}>
                    <Row style={{ marginTop: 10 }}>
                        <Col span={5} align="right">
                            <span style={{ color: 'red' }}>*</span>供应商名称:
                        </Col>
                        <Col span={19} align="left">
                          {
                            <Input
                            style={{ width: 400, marginLeft: 10 }}
                            value={supplierName}
                            onChange={this.handleChange.bind(this, 'supplierName')}
                            placeholder="请输入供应商公司合同全称（与营业执照名称一致）"
                            />
                          } 
                        </Col>
                      </Row>
                      <Row style={{ marginTop: 10 }}>
                        <Col span={5} align="right">
                            <span style={{ color: 'red' }}>*</span><span>手机号:</span>
                          </Col>
                        <Col span={19} align="left">
                            <Input
                            style={{ width: 400, marginLeft: 10 }}
                            value={mobile}
                            onChange={this.handleChange.bind(this, 'mobile')}
                            onBlur={this.handleCheckInput}
                            placeholder="请输入与供应商联系人手机号"
                                />
                          </Col>
                      </Row>
                    <Row style={{ marginTop: 10 }}>
                        <Col span={5} align="right">
                          <span style={{ color: 'red' }}>*</span><span>合同是否签订:</span>
                        </Col>
                        <RadioGroup
                            style={{ marginLeft: 10 }}
                            value={+isSign}
                            defaultValue={1}
                            onChange={this.handleChange.bind(this, 'isSign')}
                            >
                            <Radio value={1}>是</Radio>
                            <Radio value={0}>否</Radio>
                          </RadioGroup>
                      </Row>
                      
                      <Row style={{ marginTop: 10}}>
                        <Col span={5} align="right">{+isSign?<span style={{ color: 'red' }}>*</span>:""}合同信息:</Col>
                        {
                          +status!=1?<Button type="primary" style={{marginLeft:10}} onClick={this.handleShowUploadModal}>上传合同</Button>:null

                        }
                        {
                          +status===1&&canEdit?<Button type="primary" style={{marginLeft:10}} onClick={this.handleShowUploadModal}>上传合同</Button>:null
                        }
                      </Row>
                  </Col>
                <Col md={10} offset={1}>
                    <Row style={{ marginTop: 10 }}>
                        <Col span={6} align="right">
                          <span style={{ color: 'red' }}>*</span><span>联系人:</span>
                          </Col>
                        <Col span={18} align="left">
                            <Input
                            style={{ width: 300, marginLeft: 10 }}
                            value={contact}
                            onChange={this.handleChange.bind(this, 'contact')}
                            placeholder="请输入供应商联系人姓名，请勿使用昵称"
                            />
                          </Col>
                      </Row>
                      <Row style={{ marginTop: 10 }}>
                        <Col span={6} align="right">
                            <span style={{ color: 'red' }}>*</span><span>供应商性质:</span>
                          </Col>
                        <Col span={18} align="left">
                            <Select
                            style={{ width: 200, marginLeft: 10 }}
                            value={supplierPropertyMap[supplierProperty]}
                            onChange={this.handleChange.bind(this, 'supplierProperty')}
                                >
                                {
                                  Object.keys(supplierPropertyMap).map(item=>{
                                    return <Option value={item} key={item}>{supplierPropertyMap[item]}</Option>
                                  })
                                }
                          </Select>
                        </Col>
                      </Row>
                      <Row style={{ marginTop: 10 }}>
                        <Col span={6} align="right">
                          {+isSign?<span style={{ color: 'red' }}>*</span>:""}<span>合同到期时间:</span>
                          </Col>
                        <Col span={18} align="left">
                            <RangePicker
                              value={[contractExpireDateStart ? moment(contractExpireDateStart, 'YYYY-MM-DD') : "", contractExpireDateEnd ? moment(contractExpireDateEnd, 'YYYY-MM-DD') : ""]}
                              style={{ width: 200, marginLeft: 10 }}
                              onChange={this.handleChange.bind(this, 'contractExpireDate')}
                              />
                          </Col>
                      </Row>
                  </Col>
              </Row>
              {
                contractList.map((item,index)=>{
                  return +item.isDelete&&+status === 2?null:<Row className={styles.attachment}>
                      {
                        item.attachementList.map(attachementUrl=>{
                            return <div className={styles.imgBox}>
                              <img src={attachementUrl.url}/>
                              <div className={styles.cover}>
                                <Icon type="eye" style={{fontSize:24,color:"#fff"}} onClick={this.handlePreviewAttachment.bind(this,attachementUrl.url)}/>
                              </div>
                            </div>
                        })
                      }
                      <span>上传时间：{item.createTime}</span>
                      <span>合同编号：{item.contractNo}</span>
                      {
                        +item.isDelete?"":<Button icon="minus" size="small" onClick={this.handleDeleteAttachment.bind(this,index)} style={{marginRight:10}}/>
                      }
                      {/* {
                        canEdit&&status==1?<Button icon="minus" size="small" onClick={this.handleDeleteAttachment.bind(this,index)} style={{marginRight:10}}/>:""
                      } */}
                      
                      {
                        +item.isDelete&&status!=1?
                        <span className={styles.cancelDelete} onClick={this.handleCancelDeleteContract.bind(this,index,item.id)}>撤销删除</span>
                        :""
                      }
                      {
                        +item.isDelete&&canEdit&&status==1?
                        <span className={styles.cancelDelete} onClick={this.handleCancelDeleteContract.bind(this,index,item.id)}>撤销删除</span>
                        :""
                      }
                  </Row>
                })
              }
            </Card>
              <Card title={<div><span style={{ color: 'red' }}>*</span>付款信息<span style={{color:'#666',fontSize:12}}>(对公/对私必填一项）</span></div>} style={{ marginTop: 20 }}>
                  <Row style={{marginBottom:10}}>
                        <Alert
                        icon={<Icon type="warning" theme="filled" />}
                        showIcon={true}
                        type="warning"
                        message="某个付款账户信息发生修改且审核通过后，未完结的采购单付款信息也会随着更新"
                        ></Alert>
                  </Row>
                  {
                    payInfoList.map((item,index)=>{
                      return <Row>
                          {
                            +item.type === 1?<Row style={{ marginBottom: 10 }} type="flex" align="middle">
                              <Col span={2}>对公账户</Col>
                              开户名称 
                              <Input
                                  value={item.bankName&&item.bankName}
                                  style={{ width: 300, marginRight: 20,marginLeft:10 }}
                                  onChange={this.handleChangePayInfo.bind(this,'bankName',item.type,index)}
                                  placeholder="请填写该供应商的银行开户名（公司）"
                              />
                              开户行 
                              <Input
                                  value={item.bankInfo}
                                  style={{ width: 300,marginRight: 20,marginLeft:10 }}
                                  onChange={this.handleChangePayInfo.bind(this,'bankInfo',item.type,index)}
                                  placeholder="请填写该银行卡的开户所在的网点"
                              />
                              银行账户 
                              <Input
                                  value={item.bankAccount}
                                  style={{ width: 300, marginRight: 20,marginLeft:10 }}
                                  onChange={this.handleChangePayInfo.bind(this,'bankAccount',item.type,index)}
                                  placeholder="请填写该供应商的银行账号"
                              />
                              <Button style={{ marginLeft: 10 }} shape="circle" icon="plus" onClick={this.handleChangeBnakInfo.bind(this, 'plusFinanceMark',item.type, index)} />
                              {
                                canEdit?item.isRemove||item.isDelete?<span className={styles.cancelDelete} onClick={this.handleCancelDelete.bind(this,index)}>撤销删除</span>:<Button style={{ marginLeft: 10 }} shape="circle" icon="minus" onClick={this.handleChangeBnakInfo.bind(this, 'reduceFinanceMark',item.type, index)} />:null
                              }
                            </Row>:+status === 2&&item.isDelete?null:<Row style={{ marginBottom: 10 }} type="flex" align="middle">
                              <Col span={2}>对私账户</Col>
                              开户名称 
                              <Input
                                  value={item.bankName}
                                  style={{ width: 300, marginRight: 20,marginLeft:10 }}
                                  onChange={this.handleChangePayInfo.bind(this,'bankName',item.type,index)}
                                  placeholder="请填写该供应商的银行开户名（公司）"
                              />
                              开户行 
                              <Input
                                  value={item.bankInfo}
                                  style={{ width: 300,marginRight: 20,marginLeft:10 }}
                                  onChange={this.handleChangePayInfo.bind(this,'bankInfo',item.type,index)}
                                  placeholder="请填写该银行卡的开户所在的网点"
                              />
                              银行账户 
                              <Input
                                  value={item.bankAccount&&item.bankAccount}
                                  style={{ width: 300, marginRight: 20,marginLeft:10 }}
                                  onChange={this.handleChangePayInfo.bind(this,'bankAccount',item.type,index)}
                                  placeholder="请填写该供应商的银行账号"
                              />
                            <Button style={{ marginLeft: 10 }} shape="circle" icon="plus" onClick={this.handleChangeBnakInfo.bind(this, 'plusFinanceMark',item.type,index)} />
                            {
                              canEdit?item.isRemove||item.isDelete?<span className={styles.cancelDelete} onClick={this.handleCancelDelete.bind(this,index)}>撤销删除</span>:<Button style={{ marginLeft: 10 }} shape="circle" icon="minus" onClick={this.handleChangeBnakInfo.bind(this, 'reduceFinanceMark', item.type, index)} />:null
                            }
                          </Row>
                          }
                      </Row>
                    })
                  }
            </Card>
              <Card title="结算模式" style={{ marginTop: 20 }}>
              <Row>
                <Col span={10}>
                    <Row style={{ marginTop: 10 }}>
                        <Col span={5} align="right">
                          <span style={{ color: 'red' }}>*</span><span>结算模式:</span>
                          </Col>
                        <Col span={19} align="left">
                            <Select
                               style={{ width: 200, marginLeft: 10 }}
                               value={payMethodMap[payMethod]}
                               onChange={this.handleChange.bind(this, 'payMethod')}
                                    >
                               {
                                 Object.keys(payMethodMap).map(payMethod=>{
                                    return <Option key={payMethod} value={payMethod}>{payMethodMap[payMethod]}</Option>
                                 })
                               }
                             </Select>
                          </Col>
                      </Row>
                  </Col>
              </Row>
            </Card>
              <Card title="其他信息" style={{ marginTop: 20 }}>
              <Row>
              供应商备注:
                <TextArea
                    value={remark}
                    onChange={this.handleChange.bind(this, 'remark')}
                    placeholder="仅供采购做相关供应商信息的备注，设置后仅在供应商管理列表显示"
                    rows={4}
                    />
              </Row>
            </Card>
            <Affix offsetBottom={10}>
              <Row style={{borderTop:'1px solid #d9d9d9',padding:'20px 0',background:"#fff"}}>
                {
                  canEdit&&+status===1?<Button
                    type="primary"
                    style={{ marginRight: 10}}
                    loading={submitSupplierBtnLoading}
                    onClick={this.handleSaveSupplier}
                    >提交供应商信息审核
                  </Button>:""
                }
                {
                  status!=1?<Button
                    type="primary"
                    style={{ marginRight: 10}}
                    loading={submitSupplierBtnLoading}
                    onClick={this.handleSaveSupplier}
                    >提交供应商信息审核
                  </Button>:""
                }
                <Link style={{ marginLeft: 15 }} to={this.props.match.params.id?`/purchase/supplier-management/supplier-check-list/supplier-check-detail/${this.props.match.params.id}`:"/purchase/supplier-management/supplier-management-list"}>
                  <Button type="dashed">
                      取消
                  </Button>
                </Link>
              </Row>
            </Affix>
            
            </TabPane>
            {
              id?<TabPane tab="代理品牌" key="2">
              <Card
                title="新增品牌"
                extra={
                  <p>
                    <Button type="primary" style={{ marginRight: 10 }} onClick={this.handleSubmitBrandInfo}>确认创建</Button>
                  </p>
                }
            >
                <Row gutter={{ md: 24 }}>
                  <Col md={8}>
                    <Row style={{ marginTop: 10 }}>
                    <Col span={5} align="right">
                            品牌名称:
                      </Col>
                    <Col span={19} align="left">
                        <Select
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) => {
                                return option.props.children.indexOf(input) >= 0;
                            }}
                            // value={brandListMap[brandId]}
                            style={{ width: 300, marginLeft: 10 }}
                            onSelect={this.handleAddBrandInfo.bind(this, 'brandId')}
                                >
                            {
                              brandListMap.map(item => (
                                <Select.Option value={item.id}>{item['value']}</Select.Option>
                              ))
                            }
                          </Select>
                      </Col>
                    </Row>
                    <Row style={{ marginTop: 10 }}>
                      <Col span={5} align="right">
                              返利政策:
                        </Col>
                      <Col span={19} align="left">
                          <Input
                              style={{ width: 300, marginLeft: 10 }}
                              value={brandPolicy}
                              onChange={this.handleAddBrandInfo.bind(this, 'brandPolicy')}
                                  />
                        </Col>
                    </Row>
                  </Col>
                  <Col md={8}>
                    <Row style={{ marginTop: 10 }}>
                      <Col span={6} align="right">
                        <span style={{ color: 'red' }}>*</span><span>指定等级:</span>
                        </Col>
                      <Col span={18} align="left">
                          <Select
                          style={{ width: 200, marginLeft: 10 }}
                          value={supplierLevelMap[supplierLevel]}
                          onChange={this.handleAddBrandInfo.bind(this, 'supplierLevel')}
                          >
                          {
                            Object.keys(supplierLevelMap).map(item=>{
                              return <Option value={item} key={item}>{supplierLevelMap[item]}</Option>
                            })
                          }
                        </Select>
                        </Col>
                    </Row> 
                    
                    <Row style={{ marginTop: 10 }}>
                    <Col span={6} align="right">
                            品牌备注:
                      </Col>
                    <Col span={18} align="left">
                        <Input
                            style={{ width: 300, marginLeft: 10 }}
                            value={brandRemark}
                            onChange={this.handleAddBrandInfo.bind(this, 'brandRemark')}
                                />
                      </Col>
                  </Row>
                  </Col>
                  <Col md={8}>
                    <Row style={{ marginTop: 10 }}>
                    <Col span={5} align="right">
                            入驻费用:
                      </Col>
                    <Col span={19} align="left">
                        <Input
                            style={{ width: 300, marginLeft: 10 }}
                            value={payMoney}
                            onChange={this.handleAddBrandInfo.bind(this, 'payMoney')}
                                />
                      </Col>
                  </Row>
                  </Col>
                </Row>
                <Modal
                  visible={isShowDeleteModal}
                  title="提示"
                  onOk={this.handleDelete}
                  onCancel={this.handleCloseModal.bind(this,'isShowDeleteModal')}
                  okText="确认删除"
                >
                  <p>请确认是否要删除此品牌相关信息，一旦删除则关联商品在主管审核通过后将全部删除</p>
                </Modal>
              </Card>

              {
                brandList && brandList.map((brand) => {
                   return (
                     <div>
                       {
                         +brandStatus === 3&&+brand.isDelete?null:<Card
                         key={brand.id}
                         title={
                           <div>
                             品牌信息
                             {
                               +brand.isDelete?<span className={styles.cancelDelete} onClick={this.handleCancelRemoveBrand.bind(this,brand.id)}>撤销删除</span>:""
                             }
                           </div>
                         }
                         style={{ marginTop: 20 }}
                        >
                         <Row gutter={{ md: 24 }}>
                            {
                              +brand.isDelete?"":<Row type="flex" justify="end">
                                <Button type="primary" style={{ marginRight: 10 }} onClick={this.handleSaveBrandInfo.bind(this, brand.id)}>{brand.isSaved ? '保存' : '修改'}</Button>
                                <Button onClick={this.handleDeleteBrandInfo.bind(this, brand.id)}>删除</Button>
                              </Row>
                            }
                           <Col md={8}>
                             <Row style={{ marginTop: 10 }}>
                                  <Col span={5} align="right">
                                            品牌名称:
                                    </Col>
                                  <Col span={19} align="left">
                                     <span style={{ display: 'inlineBlock', width: 200, paddingLeft: 20 }}>{brand.brandName}</span>
                                    </Col>
                                </Row>
                             <Row style={{ marginTop: 10 }}>
                                <Col span={5} align="right">
                                        返利政策:
                                    </Col>
                                  <Col span={19} align="left">
                                      {
                                          brand.isSaved ? <Input
                                            style={{ width: 300, marginLeft: 10 }}
                                            value={brand.brandPolicy}
                                            onChange={this.handleChangeBrandInfo.bind(this, 'brandPolicy', brand.brandId)}
                                      /> : <span style={{ display: 'inlineBlock', width: 200, paddingLeft: 20 }}>{brand.brandPolicy}</span>
                                      }
                                    </Col>
                                </Row>
                           </Col>
                           <Col md={8}>
                             <Row style={{ marginTop: 10 }}>
                                  <Col span={5} align="right">
                                      指定等级:
                                    </Col>
                                  <Col span={19} align="left">
                                      {
                                          brand.isSaved ? <Select
                                          style={{ width: 200, marginLeft: 10 }}
                                          value={supplierLevelMap[brand.supplierLevel]}
                                          onChange={this.handleChangeBrandInfo.bind(this, 'supplierLevel', brand.brandId)}
                                          >
                                          {
                                            Object.keys(supplierLevelMap).map(item=>{
                                              return <Option value={item} key={item}>{supplierLevelMap[item]}</Option>
                                            })
                                          }
                                        </Select> : <span style={{ display: 'inlineBlock', width: 200, paddingLeft: 20 }}>{supplierLevelMap[brand.supplierLevel]}</span>
                                      }
    
                                    </Col>
                                </Row>
                                <Row style={{ marginTop: 10 }}>
                                  <Col span={5} align="right">
                                        品牌备注:
                                    </Col>
                                  <Col span={19} align="left">
                                      {
                                          brand.isSaved ? <Input
                                            style={{ width: 300, marginLeft: 10 }}
                                            value={brand.remark}
                                            onChange={this.handleChangeBrandInfo.bind(this, 'remark', brand.brandId)}
                                      /> : <span style={{ display: 'inlineBlock', width: 200, paddingLeft: 20 }}>{brand.remark}</span>
                                      }
                                    </Col>
                                </Row>
                           </Col>
                           <Col md={8}>
                             <Row style={{ marginTop: 10 }}>
                                  <Col span={5} align="right">
                                      入驻费用:
                                    </Col>
                                  <Col span={19} align="left">
                                      {
                                          brand.isSaved ? <Input
                                            style={{ width: 300, marginLeft: 10 }}
                                            value={brand.payMoney}
                                            onChange={this.handleChangeBrandInfo.bind(this, 'payMoney', brand.brandId)}
                                      /> : <span style={{ display: 'inlineBlock', width: 200, paddingLeft: 20 }}>{brand.payMoney}</span>
                                      }
                                    </Col>
                                </Row>
                                <Row style={{ marginTop: 10 }}>
                                  <Col span={5} align="right">
                                      采购员:
                                    </Col>
                                  <Col span={19} align="left">
                                    {
                                      brand.isSaved ?<Select
                                        style={{ width: 250, marginLeft: 10 }}
                                        value={purchaserMap[brand.purchaser]}
                                        disabled={!canEdit}
                                        onChange={this.handleChangeBrandInfo.bind(this, 'purchaser', brand.brandId)}
                                        dropdownMatchSelectWidth={false}
                                        >
                                          {
                                            Object.keys(purchaserMap).map(purchaser=>{
                                              return <Option key={purchaser} value={purchaser}>{purchaserMap[purchaser]}</Option>
                                            })
                                          }
                                      </Select>:<span style={{ display: 'inlineBlock', width: 200, paddingLeft: 20 }}>{purchaserMap[brand.purchaser]}</span>
                                    } 
                                  </Col>
                                </Row>
                           </Col>
                         </Row>
                         {
                           +brand.isDelete?"":<Row style={{ marginTop: 20, paddingLeft: 60, marginBottom: 20 }}>
                            <Button type="primary" onClick={this.addBrandGoods.bind(this, brand.brandId, brand.id)}>添加供货商品</Button>
                          </Row>
                         }
                         
                         <Card style={{ marginTop: 10, display: brand.selectRows && brand.selectRows.length > 0 ? 'block' : 'none' }}>
                           <Row
                             style={{
                                    marginBottom: '10px',
                                    }}
                                >
                             <Col span={2} style={{ marginLeft: 20, marginRight: 20 }}>
                                  <Icon
                                      type="close"
                                      style={{
                                        fontSize: 16,
                                        color: '#C9C9C9',
                                        marginRight: '10px',
                                        }}
                                    />已选择{brand.selectRows && brand.selectRows.length}项
                                </Col>
                             <Col span={9}>
                                  {/* <Select
                                      style={{ width: 200, marginRight: 10 }}
                                        // value={propertyMap[methods]}
                                      placeholder="设置产品合作性质"
                                      onSelect={this.handleChangePurchaser.bind(this, brand.selectRows, brand.id, 'property')}
                                        >
                                      {Object.keys(propertyMap).map(key => (
                                          <Option value={key}>{propertyMap[key]}</Option>
                                        ))}
                                    </Select> */}
                                  <Select
                                        // value={payMethodMap[property]}
                                      style={{ width: 200, marginRight: 10 }}
                                      placeholder="设置结算方式"
                                      onSelect={this.handleChangePurchaser.bind(this, brand.selectRows, brand.id, 'methods')}
                                      dropdownMatchSelectWidth={false}
                                        >
                                      {Object.keys(supplierGoodsPayMethodMap).map(key => (
                                          <Option value={key}>{supplierGoodsPayMethodMap[key]}</Option>
                                        ))}
    
                                    </Select>
                                  <Button
                                      style={{ marginRight: 10 }}
                                      type="primary"
                                      onClick={this.addNewPayMethods}
                                        >
                                            新增
                                    </Button>
                                </Col>
                             <Col span={5}>
                                  <span>设置发货地：</span>
                                  <Input
                                      onChange={this.changeSendPlace}
                                      style={{ width: 200 }}
                                        />
                                </Col>
    
                             <Col>
                                  <Button
                                      type="primary"
                                      onClick={this.handleSaveAllChange.bind(this, brand.id, brand.selectRows)}
                                        >
                                        确定
                                    </Button>
                                </Col>
                           </Row>
                         </Card>
                         {
                            brand.goodsList.length > 0 ? (<Table
                              dataSource={brand.goodsList}
                              bordered
                              className={globalStyles.tablestyle}
                              columns={+brand.isDelete?columns:[...toggleColumns,...columns]}
                              rowKey={record => record.id}
                              rowSelection={{
                                    selectedRowKeys: brand.selectGoodsId,
                                    onChange: this.handleSelectGoods.bind(this, brand.id),
                                    getCheckboxProps: record => ({
                                      disabled: record.isDelete,
                                  }),
                                }}
                              pagination={false}
                                  />) : null
                          }
                        </Card>
                       }
                     </div>
                   );
                })
            }
             <Affix offsetBottom={10}>
                <Row style={{borderTop:'1px solid #d9d9d9',padding:'20px 0',background:"#fff"}}>
                  <Button
                    type="primary"
                    style={{ marginRight: 10}}
                    onClick={this.handleCheckBrandInfo}
                    >提交代理品牌信息审核
                  </Button>
                  <Link style={{ marginLeft: 15 }} to={this.props.match.params.id?`/purchase/supplier-management/supplier-check-list/supplier-check-detail/${this.props.match.params.id}`:"/purchase/supplier-management/supplier-management-list"}>
                    <Button type="dashed">
                        取消
                    </Button>
                  </Link>
                </Row>
             </Affix>
              
          </TabPane>:null
            }
            
          </Tabs>
          </Card>
          <Modal
            visible={isShowGoodsModal}
            width={1200}
            onOk={this.handleSubmitGoods}
            onCancel={this.handleClose}
        >
            <Row
              gutter={{ md: 8, lg: 24, xl: 48 }}
              style={{ marginTop: 10, marginBottom: 25 }}
                >
              <Col md={12} style={{ height: 26, lineHeight: '26px' }}>
                <span
                style={{
                        fontSize: '18px',
                        color: '#AEAEAE',
                        fontFamily: 'Arial Negreta',
                        fontWeight: '700',
                    }}
                    >
                    选择商品
              </span>
                <span>
                <Input.Search
                    size="small"
                    style={{ width: 320, marginLeft: 20 }}
                        // // value={specialPrice}
                    enterButton="搜索"
                    placeholder="请输入商品名称/编码/进行搜索"
                    onSearch={this.handleMoreSearchGoods.bind(this)}
                    />
              </span>
              </Col>
            </Row>
            <Table
              columns={modalColumns}
              dataSource={goodsList}
              bordered
              rowKey={record => record.goodsId}
              loading={isTableLoading}
              rowSelection={{
                selectedRowKeys: goodsCheckboxIds,
                onChange: this.handleCheckGoods.bind(this),
                getCheckboxProps: record => ({
                disabled: selectedBrand.goodsList.some((goodsInfo) => {
                    return +record.goodsId === +goodsInfo.goodsId;
                    }),
                }),
            }}
              pagination={{
                current: curPage,
                pageSize,
                onChange: this.handleChangePage.bind(this),
                total,
            }}
              />
          </Modal>
          <Modal
            visible={isShowAddMethods}
            okText="确定"
            onOk={this.handleAddNewPaymentMathods}
            onCancel={this.handleCancelNewPaymentMathods}
        >
            <Input
              value={payType}
              placeholder="请输入结算方式"
              style={{ width: 200 }}
              onChange={this.addNewPayment}
        />
          </Modal>
          <Modal
          visible={showUploadModal}
          title="上传合同"
          confirmLoading={uploadBtnLoading}
          onCancel={this.handleCancelUplaod}
          onOk={this.handleConfirmUploadContract}
          >
          <Upload
            {...props}
          >
              {uploadButton}
          </Upload>
          </Modal>
          <Modal
          visible={isShowNextStepModal}
          title="提示"
          okText="下一步"
          onOk = {this.handleForwardBrand}
          onCancel = {this.handleCancelForward}
          >
          <p>供应商信息已提审，下一步前往添加品牌</p>
          </Modal>
          <Modal
          visible={previewModal}
          footer={null}
          onCancel={this.handleClosePreviewModal}
          >
            <img alt="头像" style={{ width: '100%' }} src={previewUrl} />
          </Modal>
          <Modal
          title="确认"
          okText="确认删除"
          visible={showDeleteContractModal}
          onOk={this.handleConfirmDelete}
          onCancel={this.handleCloseModal.bind(this,'showDeleteContractModal')}
          >
              <p>请确认是否删除该合同信息</p>
          </Modal>
          <Modal
          visible={showConfrimModal}
          onOk={this.handleConfirmCheck}
          onCancel={this.handleCloseModal.bind(this,'showConfrimModal')}
          title="确认"
          >
            <p>请确认是否提交审核？</p>
          </Modal>
        </PageHeaderLayout>
      );
    }
}
