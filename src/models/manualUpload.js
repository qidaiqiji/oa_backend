import moment from 'moment';
import { routerRedux } from 'dva/router';
// import { reqList , reqApply} from '../services/freightCenter';
export default {
    namespace: 'manualUpload',

    state: {
        fileList:[],
        files:[],
        previewUrl:'',
        previewModal: false,
    },

    effects: {
        
    },
    reducers: {
        updatePageReducer(state,{ payload }) {
            return {
                ...state,
                ...payload,
            }

        },
    },
};
