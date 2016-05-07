
Parse.Cloud.define('sendNotification', function(req, res) {
  
  Parse.Push.send({
    where: (req.params.installations),
    data: {
      alert: req.params.note,
      badge: 1
    }
  }, { useMasterKey: true}).then(function() {
  res.success('Push Sent');
  });
});
