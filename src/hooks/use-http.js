import React, { useState, useCallback, useRef, useEffect } from "react";
import axios from "axios";

export const useHttpHook = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const activeHttpRequest = useRef([]);

  const sendRequest = useCallback(async (url,method = 'GET', body = null,headers={}) => {
    setIsLoading(true);
    setError(null);
 
    try {
      setIsLoading(true);
      const source = axios.CancelToken.source();
      activeHttpRequest.current.push(source);
      let response
      switch(method) {
        case 'GET':
             response = await axios.get(url, body,headers,{cancelToken: source.token} );
                      break;
        case 'POST':
             response = await axios.post(url, body, headers,{cancelToken: source.token} );
                      break;
        case 'DELETE':
            response = await axios.delete(url, body, headers,{cancelToken: source.token} );
                      break;
        case 'PUT':
            response = await axios.put(url, body, headers,{cancelToken: source.token} );
                      break;
        default:
        break;
      }

      if (response.status !== 200 && response.status !== 201 && response.status!== 204) {
        const responseData = response.data;
        throw new Error(responseData.message);
      }
      setIsLoading(false);
      return response;
    } catch (err) {
      setIsLoading(false);
      setError(err.message);
      throw err
    }
  }, []);
  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      activeHttpRequest.current.forEach((source) =>
        source.cancel("axios request cancelled")
      );
    };
  }, []);
  
  return { isLoading, error, sendRequest, clearError ,setError};
};

