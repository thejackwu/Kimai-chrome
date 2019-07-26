'use strict';
import "../css/popup.scss";
import 'bootstrap';
import { showError, loading, finishLoading } from "./popup/popup_helpers.js";
import { loadAllTimeEntries, loadAllProjectsAndActivities, startProjectTimer, stopActivityTimer } from "./popup/api_call.js";
import moment from 'moment';
import $ from 'jquery';

// === Main Container ===
chrome.storage.sync.get([], function() {
  loadAllTimeEntries(renderTimeEntries, showError);
  loadAllProjectsAndActivities(renderProjectTimerButtons, showError);
});
// +++ Main Container +++

const renderTimeEntries = timeEntries => {  
  let timeEntriesHTML = "<div class='day-group'>";
  let totalTimeToDate = 0;

  timeEntries.forEach( (entry, index) => {
    const startTime = moment(entry.begin);
    const endTime = entry.end ? moment(entry.end) : moment(); 
    const isOngoing = entry.end === null;
    const duration = moment.duration(endTime.diff(startTime));
    
    timeEntriesHTML += 
    `
      <li class="list-group-item ${isOngoing ? 'list-group-item-primary' : ''}">
        ${
          isOngoing ?
            `<span class="start">${startTime.format("h:mm a")}</span>`
          :
            `${duration.asHours().toFixed(2)} h`
        }
        @ <b><span class="project">${entry.projectName}</span></b>
        ${ isOngoing ? `<button class="btn btn-outline-secondary btn-sm activity-stop-button" name="${entry.id}">Stop</button>` : "" }
      </li>
    `;

    // Daily hours summary
    const nextEntry = timeEntries[index + 1];
    totalTimeToDate += duration.asHours();

    if(nextEntry === undefined || !startTime.isSame(moment(nextEntry.begin), 'day')){
      timeEntriesHTML += 
      `
          <li class="list-group-item list-group-item-secondary">
            Total: ${totalTimeToDate.toFixed(2)} h @ <i>${startTime.format("ddd MMM Do")}</i>
          </li>
        </div>
        <div class='day-group'>
      `;

      totalTimeToDate = 0;
    }

  });
  
  timeEntriesHTML = `<ul class="list-group">${timeEntriesHTML}</ul>`

  $('#time-entries').html(timeEntriesHTML);
  $('.activity-stop-button').click(activityStopBtnOnClick);
  finishLoading();
}

const renderProjectTimerButtons = projects => {
  console.log(projects);
  
  let projectButtonsHTML = "";

  projects.forEach(project => {
    const projectActivities = project.projectActivities;

    projectButtonsHTML += 
    ` 
      <div class="project-button-block">
        <p class="title">${project.name}</p>
        <select class="activity-selection" id="project-${project.id}-activity-selection">
          ${
            projectActivities &&
            projectActivities.map( (activity) => `
              <option value="${activity.id}">${activity.name}</option>
            `)
          }
        </select>
        <button type="button" class="btn btn-outline-success btn-sm project-start-button" name="${project.id}">Start</button>
      </div>
    `
  });

  projectButtonsHTML = 
  `
  <div class="card">
    <div class="card-body">
      <div class="button-group">
        ${projectButtonsHTML}
      </div>
    </div>
  </div>
  `

  $('#project-buttons').html(projectButtonsHTML);
  $('.project-start-button').click(projectStartButtonOnClick);
  finishLoading();
}

const projectStartButtonOnClick = e => {
  loading();

  const projectButton = $(e.target);
  const projectID = projectButton.attr('name');
  const activityID = $(`#project-${projectID}-activity-selection`).val();

  startProjectTimer(projectID, activityID, 
    () => loadAllTimeEntries(renderTimeEntries, showError),
    showError
  );
  finishLoading();
}

const activityStopBtnOnClick = e => {
  const activityID = $(e.target).attr('name');  
  stopActivityTimer(activityID, () => loadAllTimeEntries(renderTimeEntries, showError), showError);
  finishLoading();
}

