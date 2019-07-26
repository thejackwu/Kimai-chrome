import "../css/options.css";
import $ from 'jquery';

function constructOptions() {
  let button = $('#save-button');

  // Populate existing info
  chrome.storage.sync.get(['apiRootUrl', 'apiUsername'], 
  (data) => {
    $('#endpoint').val(data.apiRootUrl);
    $('#api-username-input').val(data.apiUsername);
  });

  // Add submit onClick listener
  button.click(() => {
    const apiRootUrl = $('#endpoint').val();
    const apiUsername = $('#api-username-input').val();
    const apiPassword = $('#api-password-input').val();
    
    chrome.storage.sync.set({
      apiUsername: apiUsername,
      apiPassword: apiPassword,
      apiRootUrl: apiRootUrl
    }, ()=>  {
      $('#message').text("API information is saved.");
    });
  });
}
constructOptions();