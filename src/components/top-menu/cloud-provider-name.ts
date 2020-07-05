import store from "../../store/store";
import { CloudProvider } from "../../store/slices/cloud";

export default (): string => {
  switch(store.getState().cloud.provider) {
    case CloudProvider.GoogleDrive:
      return 'Google Drive';
    case CloudProvider.OneDrive:
      return 'OneDrive';
  }
  return '';
};
