
Parse.Cloud.define('sendNotification', function(req, res) {
  //needs emoji, arcs, class, legacy, awardee, awarder, message, awardeeId
  Parse.Push.send({
    where: req.params.installations,
    data: {
      alert: req.params.note,
      badge: 1
    }
  }).then(function() {
  res.success('Push Sent');
  });
});
