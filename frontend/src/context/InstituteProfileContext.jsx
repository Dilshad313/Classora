import React, { createContext, useContext, useReducer } from 'react';

// Create the context
const InstituteProfileContext = createContext();

// Initial state
const initialState = {
  instituteData: {
    instituteName: '',
    tagline: '',
    phone: '',
    address: '',
    country: '',
    website: '',
    logoUrl: null
  },
  loading: false,
  error: null
};

// Action types
const actionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_INSTITUTE_DATA: 'SET_INSTITUTE_DATA',
  UPDATE_INSTITUTE_DATA: 'UPDATE_INSTITUTE_DATA',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer function
const instituteProfileReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    
    case actionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    
    case actionTypes.SET_INSTITUTE_DATA:
      return {
        ...state,
        instituteData: action.payload,
        loading: false,
        error: null
      };
    
    case actionTypes.UPDATE_INSTITUTE_DATA:
      return {
        ...state,
        instituteData: {
          ...state.instituteData,
          ...action.payload
        },
        loading: false,
        error: null
      };
    
    case actionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
};

// Provider component
export const InstituteProfileProvider = ({ children }) => {
  const [state, dispatch] = useReducer(instituteProfileReducer, initialState);

  // Actions
  const setInstituteData = (data) => {
    dispatch({
      type: actionTypes.SET_INSTITUTE_DATA,
      payload: data
    });
  };

  const updateInstituteData = (data) => {
    dispatch({
      type: actionTypes.UPDATE_INSTITUTE_DATA,
      payload: data
    });
  };

  const setLoading = (loading) => {
    dispatch({
      type: actionTypes.SET_LOADING,
      payload: loading
    });
  };

  const setError = (error) => {
    dispatch({
      type: actionTypes.SET_ERROR,
      payload: error
    });
  };

  const clearError = () => {
    dispatch({
      type: actionTypes.CLEAR_ERROR
    });
  };

  return (
    <InstituteProfileContext.Provider
      value={{
        ...state,
        setInstituteData,
        updateInstituteData,
        setLoading,
        setError,
        clearError
      }}
    >
      {children}
    </InstituteProfileContext.Provider>
  );
};

// Custom hook to use the context
export const useInstituteProfile = () => {
  const context = useContext(InstituteProfileContext);
  if (!context) {
    throw new Error('useInstituteProfile must be used within an InstituteProfileProvider');
  }
  return context;
};

// Export action types if needed elsewhere
export { actionTypes };