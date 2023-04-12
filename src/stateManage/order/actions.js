
import apicallHeaderPost from "../apicallHeaderPost";

export const SET_ORDER_DATA = 'SET_ORDER_DATA';


export const Order_SET = (data,url, value) => {

  try {
    return async dispatch => {
      dispatch({
        type: SET_ORDER_DATA,
        payload: { loading: true,status: false,Data:[],ErrorData:[]  },
      });

      apicallHeaderPost(data,url, value)
        .then(response => {
        
          if (response.status == 200 && response.data.status == true || response.data.status == 'true' && response.data.data != undefined) {
            const Data = response.data.data
          
            dispatch({
              type: SET_ORDER_DATA,
              payload: {loading: false,  status: true, Data,ErrorData:[] },
            });
          } else {
          }
        }).catch(err => {
    
          if (err) {
            const ErrorData = err.response.data
            dispatch({
              type:  SET_ORDER_DATA,
              payload: { loading: false, status: false, Data: [] ,ErrorData},

            });
          }
        })
    };
  } catch (error) {

  }
};

