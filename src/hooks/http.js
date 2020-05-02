//Custom Hooks are function which dont share data between components, instead it has snapshot for all the component 
import React, { useReducer, useCallback } from 'react';
const httpReducer = (curHttpState, action) => {
    switch (action.type) {
        case 'SEND':
            return { loading: true, error: null, data: action.responseData, extra: null }
        case 'RESPONSE':
            return { ...curHttpState, loading: false, extra: action.extra }
        case 'ERROR':
            return { loading: false, error: action.errorMessage };
        case 'CLEAR':
            return { ...curHttpState, error: null };
        default:
            throw new Error('Should not get there !')
    }
}
const useHttp = () => {
    const [httpRequest, dispatchHttp] = useReducer(httpReducer, {
        loading: false,
        error: null,
        data: null,
        extra: null
    });

    const sendRequest = useCallback((url, method, body, reqExtra) => {
        dispatchHttp({ type: 'SEND' });
        fetch(url,
            {
                method: method,
                body: body,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                return response.json();
            }).then(responseData => {
                dispatchHttp({ type: 'RESPONSE', responseData: responseData, extra: reqExtra });

            }).catch(error => {
                dispatchHttp({ type: 'ERROR', errorMessage: 'Something went wrong' });
            });
    }, []);
    return {
        isLoading: httpRequest.loading,
        data: httpRequest.data,
        error: httpRequest.error,
        sendRequest: sendRequest,
        reqExtra: httpRequest.extra
    }

}
export default useHttp;
