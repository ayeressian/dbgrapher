import store from "../../store/store";
import { CloudProvider } from "../../store/slices/cloud";
import { t } from "../../localization";

const providerName = (): string => {
  switch (store.getState().cloud.provider) {
    case CloudProvider.GoogleDrive:
      return t((l) => l.cloudProvider.googleDrive);
    case CloudProvider.OneDrive:
      return t((l) => l.cloudProvider.oneDrive);
  }
  return "";
};

export default providerName;
