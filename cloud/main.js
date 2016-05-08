
Parse.Cloud.define('sendNotification', function(request, response) {
    var installationQuery = new Parse.Query(Parse.Installation);
    var notify = request.params.notify
    var Class = request.params.Class
    var legacy = request.params.legacy
    var toUser = request.params.toUser
    
    if (notify == 0) {
      installationQuery.containedIn("class", [Class, 9999]);
    };
    if (notify == -1) {
      installationQuery.equalTo("userId", toUser);
    };
    if (notify == 1) {
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
