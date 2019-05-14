function onOpen(){
    
  var menu = [{name: 'Send MAP Class reports', functionName: 'sendClassReport'}];
  SpreadsheetApp.getActive().addMenu('Send MAP Class reports', menu);
}

function sendClassReport() {
  var spreadsheetID = "YOUR TEACHER DATA SHEET ID"
  var ss = SpreadsheetApp.openById(spreadsheetID);
  var senderName = "Your Name"
  var sheet = ss.getSheetByName("FacultyData");
  var data = sheet.getDataRange().getValues();
  var dApp = DriveApp;
  
  var messagesSent = 0;
  
    for(var i=1; i<data.length; i++){
      var values = data[i];
      var folder = dApp.getFolderById(values[5]);
      var emailAddress = values[2];
      var message = "Dear " + values[1] + " " + values[0] +
        "\nPlease see the attached MAP Class report for your class.\n" + 
          "If you have any questions about this you can contact " +
          "Shirley Droese at sdroese@aes.ac.in or Amanda Scott at ascott@aes.ac.in";
      var subject = "MAP Class Report for " + values[1] + " " + values[0];
      var searchValue = 'title contains "CLS_'+ values[0] + values[1] + '_"';
      
      //Look for the searchValue of CLS_LastNameFirstName_ in the name of a file
      var filesIterator = folder.searchFiles(searchValue);
      while (filesIterator.hasNext()) {
        var file = filesIterator.next();
        var fileName = file.getName();
        var fileID = file.getId();
        var mailSent = GmailApp.sendEmail(emailAddress, subject, message, {
          attachments: [DriveApp.getFileById(fileID).getAs(MimeType.PDF)],
          name: senderName});
        messagesSent ++;
        
      }
    }
  Logger.log ("there were " + messagesSent + " messages sent");
  
}