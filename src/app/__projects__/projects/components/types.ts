import { TProjectSimple } from "../../../../core/gitlab/types/projects_types";

export type ProjectItemProps = {
  project: TProjectSimple;
  onPressItem: (item: TProjectSimple) => void;
  onLongPressItem: (item: TProjectSimple) => void;
  view: "list" | "square";
};

export type ProjectItemWrapperProps = {
  project: TProjectSimple;
  onPress: () => void;
  onLongPress: () => void;
};