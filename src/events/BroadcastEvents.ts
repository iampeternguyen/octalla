import PubSub from 'pubsub-js';

import { User } from '@firebase/auth-types';
import { UserSettingsData } from 'src/models/UserSettings';
import { WorkspaceData } from 'src/models/Workspace';

export const EVENT_USER_AUTHENTICATED = Symbol('EVENT_USER_AUTHENTICATED');
export const EVENT_USER_SETTINGS_FETCHED = Symbol(
  'EVENT_USER_SETTINGS_FETCHED'
);
export const EVENT_WORKSPACE_CREATED = Symbol('EVENT_WORKSPACE_CREATED');
export const EVENT_WORKSPACE_DELETED = Symbol('EVENT_WORKSPACE_DELETED');

export const EVENT_ACTIVE_WORKSPACE_SET = Symbol('EVENT_ACTIVE_WORKSPACE_SET');

const onUserAuthenticated = (user: User) => {
  console.log(EVENT_USER_AUTHENTICATED, user);
  PubSub.publish(EVENT_USER_AUTHENTICATED, user);
};

const onUserSettingsFetched = (userSettings: UserSettingsData) => {
  console.log(EVENT_USER_SETTINGS_FETCHED, userSettings);
  PubSub.publish(EVENT_USER_SETTINGS_FETCHED, userSettings);
};

const onActiveWorkspaceSet = (workspace: WorkspaceData) => {
  console.log(EVENT_ACTIVE_WORKSPACE_SET, workspace);
  PubSub.publish(EVENT_ACTIVE_WORKSPACE_SET, workspace);
};

const onWorkspaceCreated = (workspace: WorkspaceData) => {
  console.log(EVENT_WORKSPACE_CREATED, workspace);
  PubSub.publish(EVENT_WORKSPACE_CREATED, workspace);
};

const onWorkspaceDeleted = (workspace: WorkspaceData) => {
  console.log(EVENT_WORKSPACE_DELETED, workspace);
  PubSub.publish(EVENT_WORKSPACE_DELETED, workspace);
};
const BroadcastEvent = {
  user: {
    onUserAuthenticated,
    onUserSettingsFetched,
  },
  workspace: {
    onActiveWorkspaceSet,
    onWorkspaceCreated,
    onWorkspaceDeleted,
  },
};

export default BroadcastEvent;
