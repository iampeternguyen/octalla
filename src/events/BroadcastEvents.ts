import PubSub from 'pubsub-js';

import { User } from '@firebase/auth-types';
import { UserSettingsData } from 'src/models/UserSettings';
import { WorkspaceData } from 'src/models/Workspace';

export const EVENT_USER_AUTHENTICATED = Symbol('EVENT_USER_AUTHENTICATED');
export const EVENT_USER_SETTINGS_FETCHED = Symbol(
  'EVENT_USER_SETTINGS_FETCHED'
);

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

const BroadcastEvent = {
  user: {
    onUserAuthenticated,
    onUserSettingsFetched,
  },
  workspace: {
    onActiveWorkspaceSet,
  },
};

export default BroadcastEvent;
