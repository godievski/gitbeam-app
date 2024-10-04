import React, {
  createContext,
  useReducer,
  useEffect,
  useCallback,
  useContext,
} from "react";
import Toast from "react-native-root-toast";
import { ToastConfig } from "../../core/config";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getHttpStatusMessage } from "../../core/gitlab/api";
import { useTheme } from "../../theme/hooks";
import { HttpGitlabError } from "../../core/gitlab/utils";

export const TOAST_TYPES = {
  NORMAL: -1,
  WARNING: -2,
  ERROR: -3,
};

export type ToastContextValue = {
  updateMessage: (data: ToastState) => any;
  updateStatus: (status: number) => any;
  updateError: (error: HttpGitlabError) => any;
};

const ToastContext = createContext<ToastContextValue>({
  updateMessage: () => {},
  updateStatus: () => {},
  updateError: () => {},
});
const { Provider } = ToastContext;

/**
 * Reducer declaration
 */
type ToastState = {
  status: number;
  message: string;
};

type ToastAction =
  | {
      type: "UPDATE_MESSAGE";
      data: ToastState;
    }
  | {
      type: "UPDATE_STATUS";
      status: number;
    };

const DEFAULT_STATE: ToastState = {
  status: 0,
  message: "",
};

const ToastProvider: React.FC<any> = (props) => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const [state, dispatch] = useReducer(
    (state: ToastState, action: ToastAction) => {
      switch (action.type) {
        case "UPDATE_MESSAGE":
          return {
            ...action.data,
          };
        case "UPDATE_STATUS":
          if (action.status > 0) {
            return {
              status: action.status,
              message: getHttpStatusMessage(action.status),
            };
          } else {
            return state;
          }
        default:
          return state;
      }
    },
    DEFAULT_STATE
  );

  const updateMessage = useCallback((data: ToastState) => {
    dispatch({ type: "UPDATE_MESSAGE", data });
  }, []);

  const updateStatus = useCallback((status: number) => {
    dispatch({ type: "UPDATE_STATUS", status });
  }, []);

  const updateError = useCallback((error: HttpGitlabError) => {
    dispatch({ type: "UPDATE_STATUS", status: error.status });
  }, []);

  useEffect(() => {
    if (state.status >= 400 || state.status == TOAST_TYPES.ERROR) {
      Toast.show(state.message, {
        ...ToastConfig.error,
        position: ToastConfig.error.position - (insets.bottom + 36),
      });
    } else if (state.status > 0 || state.status == TOAST_TYPES.NORMAL) {
      Toast.show(state.message, {
        ...ToastConfig.normal,
        position: ToastConfig.normal.position - (insets.bottom + 36),
        backgroundColor: theme.isDark
          ? "#222"
          : ToastConfig.normal.backgroundColor,
      });
    } else if (state.status == TOAST_TYPES.WARNING) {
      Toast.show(state.message, {
        ...ToastConfig.warning,
        position: ToastConfig.warning.position - (insets.bottom + 36),
      });
    }
  }, [state]);

  return (
    <Provider
      value={{
        updateMessage,
        updateStatus,
        updateError,
      }}
    >
      {props.children}
    </Provider>
  );
};

const useToast = () => {
  return useContext(ToastContext);
};

export { ToastContext, ToastProvider, useToast };
