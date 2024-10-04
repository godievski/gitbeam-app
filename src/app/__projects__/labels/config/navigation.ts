import { CommonActions } from "@react-navigation/native";
import { TLabel } from "../../../../core/gitlab/types/labels_types";
export const LABELS_SCREEN_NAME = "LABELS_SCREEN_NAME";

export type LabelsScreenParams = {
  [LABELS_SCREEN_NAME]: {
    project_id: number;
    subtitle: string;
  };
};

export const goToLabels = (project_id, subtitle) =>
  CommonActions.navigate({
    name: LABELS_SCREEN_NAME,
    params: {
      project_id,
      subtitle,
    },
  });

export const EDIT_LABEL_SCREEN_NAME = "EDIT_LABEL_SCREEN_NAME";

export type EditLabelScreenParams = {
  [EDIT_LABEL_SCREEN_NAME]: {
    project_id: number;
    label: TLabel;
  };
};

export const goToEditLabel = (project_id: number, label: TLabel) =>
  CommonActions.navigate({
    name: EDIT_LABEL_SCREEN_NAME,
    params: {
      project_id,
      label,
    },
  });

export const LABELS_SELECTION_SCREEN_NAME = "LABELS_SELECTION_SCREEN_NAME";

export type LabelsSelectionScreenParams = {
  [LABELS_SELECTION_SCREEN_NAME]: {
    project_id: number;
    subtitle: string;
    labels: { [id: string]: string };
    setLabels: (labels: { [id: string]: string }) => any;
  };
};

export const goToLabelsSelection = (project_id, subtitle, labels, setLabels) =>
  CommonActions.navigate({
    name: LABELS_SELECTION_SCREEN_NAME,
    params: {
      project_id,
      subtitle,
      labels,
      setLabels,
    },
    key: `label-selection`,
  });

export const NEW_LABEL_SCREEN_NAME = "NEW_LABEL_SCREEN_NAME";

export type NewLabelScreenParams = {
  [NEW_LABEL_SCREEN_NAME]: {
    project_id: number;
  };
};

export const goToNewLabel = (project_id: number) =>
  CommonActions.navigate({
    name: NEW_LABEL_SCREEN_NAME,
    params: {
      project_id,
    },
  });
