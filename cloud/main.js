
Parse.Cloud.define('sendNotification', function(request, response) {
    var installationQuery = new Parse.Query(Parse.Installation);
    var notify = request.params.notify
    var Class = request.params.Class
    var legacy = request.params.legacy
    var toUser = request.params.toUser
    //notify -1 = gratitude, notify 0 = all in class, notify 1 = all in legacy, notify 2 = everyone
    if (notify == 0) {
      //sends only to the awardee's class if that variable exists and anyone with a class of 9999 which is the staff
      installationQuery.containedIn("class", [Class, 9999]);
    };
    if (notify == -1) {
      //sends only to awardee because it is a gratitude
      installationQuery.equalTo("userId", toUser);
    };
    if (notify == 1) {
       //sends only to the awardee's legacy if that exists and anyone with a legacy of "Admin" which is the staff
      installationQuery.containedIn("legacy", [legacy, "Admin"])
    };
  console.log("cloudcode called");
  Parse.Push.send({
    where: installationQuery,
    data: {
      alert: request.params.note,
      badge: 1
    }
  }, { useMasterKey: true}).then(function() {
  response.success('Push Sent');
  });
});
