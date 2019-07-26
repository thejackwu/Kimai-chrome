const apiConfig = {
  timeSheetSize: 20
};

const getAjaxParams = (apiUrl, username, password) => {
  return {
    rootUrl: apiUrl,
    cache: true,
    type: 'GET',
    dataType: 'json',
    beforeSend: function (request) {
      request.setRequestHeader("X-AUTH-USER", username);
      request.setRequestHeader("X-AUTH-TOKEN", password);
    },
    headers: {
      'X-AUTH-USER': username,
      'X-AUTH-TOKEN': password,
    }
  }
}

export function loadAllTimeEntries(successHandler, errorHandler){
  loading();
  getAPICredential(
    (url, username, password) => {
      const ajaxParams = getAjaxParams(url, username, password);

      $.when(
        $.ajax({url: `${ajaxParams.rootUrl}/api/projects?order=ASC&orderBy=id`, ...ajaxParams}),
        $.ajax({url: `${ajaxParams.rootUrl}/api/timesheets?size=${apiConfig.timeSheetSize}`, ...ajaxParams})
      ).done((projects, timeSheetsEntries) => {
        timeSheetsEntries = timeSheetsEntries[0];
        projects = projects[0];
        
        timeSheetsEntries.map((timeSheetEntry) => {
          timeSheetEntry.projectName = projects.find( p => p.id === timeSheetEntry.project ).name;
        });
        
        successHandler(timeSheetsEntries);
      }).fail(errorHandler);
    }
  );
}

export function loadAllProjectsAndActivities(successHandler, errorHandler){
  loading();
  getAPICredential(
    (url, username, password) => {
      const ajaxParams = getAjaxParams(url, username, password);

      let projectWithActivityArray = [];
      $.when(
        $.ajax({url: `${ajaxParams.rootUrl}/api/projects?order=ASC&orderBy=id`, ...ajaxParams}),
        $.ajax({url: `${ajaxParams.rootUrl}/api/activities`, ...ajaxParams})
      ).done( (projects, activities) => {
        projects = projects[0];
        activities = activities[0];
        
        projectWithActivityArray = projects;
    
        activities.forEach( activity => {
          const projectID = activity.project;
          const activityID = activity.id;
          const activityName = activity.name;
          const projectObject = projectWithActivityArray[projectID-1];
    
          if(projectObject.projectActivities === undefined){ projectObject.projectActivities = [] }
          projectObject.projectActivities.push({
            name: activityName,
            id: activityID
          });
    
        })
        successHandler(projectWithActivityArray);
      }).fail(errorHandler);
    }
  );
}

export function startProjectTimer(projectID, activityID, successHandler, errorHandler){
  loading();
  getAPICredential(
    (url, username, password) => {
      const ajaxParams = getAjaxParams(url, username, password);
      
      $.ajax({
        ...ajaxParams,
        url: `${ajaxParams.rootUrl}/api/timesheets`,
        type: 'POST',
        data: {
          "begin": getCurrentTimeInString(),
          "project": projectID,
          "activity": activityID
        },
        success: successHandler,
        error: errorHandler
      });
    }
  );
}

export function stopActivityTimer(timeSheetID, successHandler, errorHandler){
  loading();
  getAPICredential(
    (url, username, password) => {
      const ajaxParams = getAjaxParams(url, username, password);
      
      $.ajax({
        ...ajaxParams,
        url: `${ajaxParams.rootUrl}/api/timesheets/${timeSheetID}`,
        type: 'PATCH',
        data: {
          "end": getCurrentTimeInString()
        },
        success: successHandler,
        error: errorHandler
      });
    }
  );
}

export function pingWithCredentials(endpoint, username, password, successHandler, errorHandler){
  const ajaxParams = getAjaxParams(endpoint, username, password);
      
  $.ajax({
    ...ajaxParams,
    url: `${ajaxParams.rootUrl}/api/ping`,
    type: 'GET',
    success: successHandler,
    error: errorHandler
  });
}

// Utility functions
function getCurrentTimeInString(){
  const tzoffset = (new Date()).getTimezoneOffset() * 60000;
  const localISOTime = (new Date(Date.now() - tzoffset))
    .toISOString()
    .slice(0, 19);

  return localISOTime;
}

function getAPICredential(successHandler){
  chrome.storage.sync.get(['apiRootUrl','apiUsername', 'apiPassword'], function(data) {
    successHandler(data.apiRootUrl, data.apiUsername, data.apiPassword);
  });
}

function loading(){
  $("#spinner").css({
    display: "block",
    visibility: "unset"
  });
}