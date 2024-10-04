import { TLabel } from "../../../../core/gitlab/types/labels_types";
import { insertOrdered } from "../../../../core/utils";

export const separateLabels = (labels: TLabel[]) => {
  let prioritized: TLabel[] = [];
  let other: TLabel[] = [];
  for (let i = 0; i < labels.length; i++) {
    const label = labels[i];
    if (label.priority === null) {
      other.push(label);
    } else {
      prioritized = insertOrdered(prioritized, label, (item) => item.priority);
    }
  }
  return {
    prioritized,
    other,
  };
};
