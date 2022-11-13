import store from "../../store/store";
import GoogleDriveProvider from "./google-drive-provider";
import { actions as loadScreenAction } from "../../store/slices/load-screen";
import ResetStoreException from "../../reset-exception";
import { t } from "../../localization";
import ConfirmationDialog from "../../components/dialog/confirmation-dialog";

const grantConfirmationDialog = async (): Promise<boolean> => {
  return await ConfirmationDialog.confirm(
    t((l) => l.confirmation.googleGrant.text),
    t((l) => l.confirmation.googleGrant.confirm)
  );
};

const userHasGrant = async (user: gapi.auth2.GoogleUser): Promise<boolean> => {
  return user.hasGrantedScopes(GoogleDriveProvider.scopeDriveFile);
};

const handleError = async (error: { error: string }): Promise<void> => {
  switch (error.error) {
    case "access_denied":
    case "popup_closed_by_user":
    case "popup_blocked_by_browser":
      await grantDriveFile();
      break;
    default:
      throw error;
  }
};

export const grantDriveFile = async (): Promise<void> => {
  const user = await gapi.auth2.getAuthInstance().currentUser.get();
  if (await userHasGrant(user)) return;

  if (!(await grantConfirmationDialog())) {
    throw new ResetStoreException();
  }

  store.dispatch(loadScreenAction.start());
  try {
    await user.grant({
      scope: GoogleDriveProvider.scopeDriveFile,
    });
  } catch (error) {
    handleError(error);
  } finally {
    store.dispatch(loadScreenAction.stop());
  }
};
