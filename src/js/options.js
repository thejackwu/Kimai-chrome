import "../css/options.scss";
import { pingWithCredentials } from './popup/api_call_helper';

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
    
    pingWithCredentials(
      apiRootUrl, apiUsername, apiPassword,
      () =>{
        chrome.storage.sync.set({
          apiUsername: apiUsername,
          apiPassword: apiPassword,
          apiRootUrl: apiRootUrl
        }, () => {
          $('#message').text("API information is saved.");
        });
      },
      () => {
        $('#message').text("API endpoint or credential is invalid");
      }
    )
  });
}
constructOptions();