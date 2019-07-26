import moment from 'moment';
import { finishLoading } from './message_helpers';
import { projectStartButtonOnClick, activityStopBtnOnClick } from './button_action_helper';
import ongoingIcon from '../../img/kimai-icon-ongoing.png';
import normalIcon from '../../img/kimai-icon.png';

const renderTimeEntries = timeEntries => {
  let timeEntriesHTML = "<div class='day-group'>";
  let totalTimeToDate = 0;
  let isTimerRunning = false;

  timeEntries.forEach( (entry, index) => {
    const startTime = moment(entry.begin);
    const endTime = entry.end ? moment(entry.end) : moment(); 
    const isOngoing = entry.end === null;
    const duration = moment.duration(endTime.diff(startTime));
    
    timeEntriesHTML += 
    `
      <li class="list-group-item ${isOngoing ? 'list-group-item-primary' : ''}">
        <div class="time-entry-text">
          ${
            isOngoing ?
              `<span class="start">${startTime.format("h:mm a")}</span>`
            :
              `${duration.asHours().toFixed(2)} h`
          }
          @ <b><span class="project">${entry.projectName}</span></b>
        </div>
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

    // Update timer ongoing indicator
    if(isOngoing === true){
      isTimerRunning = true;
    }
  });
  
  timeEntriesHTML = `<ul class="list-group">${timeEntriesHTML}</ul>`

  $('#time-entries').html(timeEntriesHTML);
  $('.activity-stop-button').click(activityStopBtnOnClick);
  finishLoading();

  if(isTimerRunning){
    chrome.browserAction.setIcon({path: ongoingIcon});
  }else{
    chrome.browserAction.setIcon({path: normalIcon});
  }
};

const renderProjectTimerButtons = projects => {
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


export { renderTimeEntries, renderProjectTimerButtons }