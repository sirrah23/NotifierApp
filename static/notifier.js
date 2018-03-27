const Notifier = (function(Notification){

    function Notifier(){}

    Notifier.prototype.requestDesktopNotificationPermission = function(){
         if(Notification && Notification.permission === "default") {
            Notification.requestPermission(function(permission) {
                if(!("permission" in Notification)) {
                    Notification.permission = permission;
                }
            });
        }
    }

    Notifier.prototype.allowedToSendNotifications = function(){
        return Notification.permission === "granted"
    }

    Notifier.prototype.notify = function(title, text){
        if (this.allowedToSendNotifications){
            this.sendDesktopNotification(title, text);
        }
    }

    Notifier.prototype.sendDesktopNotification = function(title, text) {
        //Send the notification
        let notification = new Notification(title , {body: text});

        //Set up some events to close it
        notification.onclick = function(){
            parent.focus();
            window.focus(); //just in case, older browsers
            this.close();
        };

        //Close automatically after specified length
        setTimeout(notification.close.bind(notification), 5000);
    }

    return Notifier
})(Notification);
