import { ProjectMergeRequestParams, PROJECT_MERGE_REQUESTS_SCREEN_NAME } from '../project-merge-requests/config/navigation';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';


export const STACK_PROJECT_NAVIGATOR_SCREEN_NAME =
  "STACK_PROJECT_NAVIGATOR_SCREEN_NAME";


//TODO: Add all screen params right here
export type StackProjectsParams = ProjectMergeRequestParams;
// Add all keys (screeen name) here
type StackProjectsKeys = typeof PROJECT_MERGE_REQUESTS_SCREEN_NAME;
export type StackProjectsProps<Key extends StackProjectsKeys> = {
  route: RouteProp<StackProjectsParams, Key>;
  navigation: StackNavigationProp<StackProjectsParams, Key>;
};