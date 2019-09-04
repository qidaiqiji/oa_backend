import React, { PureComponent } from 'react';
import moment from 'moment';
import { routerRedux, Route, Switch, Link } from 'dva/router';
import { Upload, Button, Modal, Icon, message } from 'antd';
// import Cropper from 'react-cropper'
import { connect } from 'dva';

@connect(state => ({
    manualUpload: state.manualUpload,
}))
class ManualUpload extends PureComponent {
    handlePreview=(file)=>{
        const { dispatch } = this.props;
        dispatch({
            type:'manualUpload/updatePageReducer',
            payload:{
                previewModal:true,
                previewUrl:file.thumbUrl
            }
        })
    }
    handleCloseModal=()=>{
        const { dispatch } = this.props;
        dispatch({
            type:'manualUpload/updatePageReducer',
            payload:{
                previewModal:false,
            }
        })
    }
    render() {
        const { 
            dispatch,
            disabled,
            manualUpload:{
                files,
                fileList,
                previewModal,
                previewUrl
            }
        } = this.props;
        const defaultButton = (
            <div>
            <Icon type='plus' />
            <div>上传图片</div>
            </div>
        );
        const props = {
            onRemove:(file)=>{
                const index = fileList.indexOf(file);
                const newFileList = fileList.slice();
                newFileList.splice(index, 1);
                dispatch({
                    type:'manualUpload/updatePageReducer',
                    payload:{
                        fileList: newFileList,
                        files: newFileList,
                    }
                })
            },
            beforeUpload:(file)=>{
                let count = [];
                let fileList = [];
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = e => {
                    file.thumbUrl = e.target.result;
                    files.push(file)
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
                        type:'manualUpload/updatePageReducer',
                        payload:{
                            fileList: [...fileList,...files],
                        }
                    })
                };
                return false;
            },
            onPreview:this.handlePreview,
            fileList:fileList,
            listType:"picture-card",
            multiple:this.props.multiple,
        }
    return (
        <div>
        <Upload
        { ...props }
        disabled={disabled&&fileList.length>1}
        >
            {this.props.uploadButton?this.props.uploadButton:defaultButton}
        </Upload>
        <Modal
        visible={previewModal}
        footer={null}
        onCancel={this.handleCloseModal}
        >
            <img style={{ width: '100%' }} src={previewUrl} />
        </Modal>
        </div>
  );
}
}
export default ManualUpload;
