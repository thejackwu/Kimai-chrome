import { finishLoading, loading, showError } from './message_helpers';
import { startProjectTimer, stopActivityTimer } from './api_call_helper';
import { loadAllTimeEntries } from './api_call_helper';
import { renderTimeEntries } from './render_helper';


export const projectStartButtonOnClick = e => {
  loading();  

  const projectButton = $(e.target);
  const projectID = projectButton.attr('name');
  const activityID = $(`#project-${projectID}-activity-selection`).val();

  startProjectTimer(projectID, activityID, 
    () => { 
      loadAllTimeEntries(renderTimeEntries, showError);
    },
    showError
  );
  finishLoading();
}

export const activityStopBtnOnClick = e => {
  const activityID = $(e.target).attr('name');  
  stopActivityTimer(activityID, 
    () => { 
      loadAllTimeEntries(renderTimeEntries, showError);
    }, 
    showError);
  finishLoading();
}