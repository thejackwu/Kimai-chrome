import "../css/popup.scss";
import 'bootstrap';
import { showError } from "./popup/popup_message_helpers";
import { renderTimeEntries, renderProjectTimerButtons } from "./popup/popup_render_helper";
import { loadAllTimeEntries, loadAllProjectsAndActivities } from './popup/api_call_helper';

chrome.storage.sync.get([], function() {
  loadAllTimeEntries(renderTimeEntries, showError);
  loadAllProjectsAndActivities(renderProjectTimerButtons, showError);
});