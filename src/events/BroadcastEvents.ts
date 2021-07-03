import PubSub from 'pubsub-js';

import { User } from '@firebase/auth-types';
import { UserSettingsData } from 'src/models/UserSettings';
import { WorkspaceData } from 'src/models/Workspace';
import { ProjectData } from 'src/models/Project';

export const EVENT_USER_AUTHENTICATED = Symbol('EVENT_USER_AUTHENTICATED');
export const EVENT_USER_SETTINGS_FETCHED = Symbol(
  'EVENT_USER_SETTINGS_FETCHED'
);
export const EVENT_USER_LOGGED_OUT = Symbol('EVENT_USER_LOGGED_OUT');

export const EVENT_WORKSPACE_CREATED = Symbol('EVENT_WORKSPACE_CREATED');
export const EVENT_WORKSPACE_DELETED = Symbol('EVENT_WORKSPACE_DELETED');

export const EVENT_ACTIVE_WORKSPACE_SET = Symbol('EVENT_ACTIVE_WORKSPACE_SET');

export const EVENT_ACTIVE_PROJECT_SET = Symbol('EVENT_ACTIVE_PROJECT_SET');
export const EVENT_PROJECT_DELETED = Symbol('EVENT_PROJECT_DELETED');

const onUserAuthenticated = (user: User) => {
  console.log(EVENT_USER_AUTHENTICATED, user);
  PubSub.publish(EVENT_USER_AUTHENTICATED, user);
};

const onUserLoggedOut = () => {
  console.log(EVENT_USER_LOGGED_OUT);
  PubSub.publish(EVENT_USER_LOGGED_OUT);
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

const onActiveProjectSet = (project: ProjectData) => {
  console.log(EVENT_ACTIVE_PROJECT_SET, project);
  PubSub.publish(EVENT_ACTIVE_PROJECT_SET, project);
};

const onProjectDeleted = (project: ProjectData) => {
  console.log(EVENT_PROJECT_DELETED, project);
  PubSub.publish(EVENT_PROJECT_DELETED, project);
};

const BroadcastEvent = {
  user: {
    onUserAuthenticated,
    onUserSettingsFetched,
    onUserLoggedOut,
  },
  workspace: {
    onActiveWorkspaceSet,
    onWorkspaceCreated,
    onWorkspaceDeleted,
  },
  project: {
    onActiveProjectSet,
    onProjectDeleted,
  },
};

export default BroadcastEvent;
