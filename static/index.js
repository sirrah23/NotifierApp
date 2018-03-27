class NotificationTracker{
    constructor(name, time){
        this.name = name;
        this.current_time = time;
        this.original_time = time;
        this.state = State.RUNNING;
        this.looping = false;
    }

    isRunning(){
        return this.state === State.RUNNING;
    }

    isStopped(){
        return this.state === State.STOPPED;
    }

    toggleState(){
        if(this.state === State.RUNNING){
            this.state = State.STOPPED;
        } else {
            this.state = State.RUNNING;
        }
    }

    decrementTime(){
      if(this.isRunning() && this.current_time > 0) this.current_time--;
    }

    justFinished(){
        return this.current_time === 0 && this.isRunning()
    }

    resetTimer(){
      this.current_time = this.original_time;
    }

    restartTimer(){
      if(this.isStopped()) this.toggleState();
      this.resetTimer();
    }

    restartOrContinueTimer(){
      if(this.isStopped() && this.current_time > 0)
        this.toggleState()
      else
        this.restartTimer();
    }

}

const State = {
    RUNNING: 0,
    STOPPED: 1
}

const app = new Vue({
	el: "#app",
	data: {
		notifications: [],
		notification_name: "",
		notification_time: ""
	},
	methods: {
		addNotification(){
			if(!this.validUserNotifText()) return;
      this.notifications = this.notifications.concat(new NotificationTracker(this.notification_name, this.notification_time));
			this.clearUserNotifText();
		},
		validUserNotifText(){
			return this.notification_name.length > 0 && this.notification_time.length > 0;
		},
		clearUserNotifText(){
			this.notification_name = "";
			this.notification_time = "";
		},
		decrement_times(){
		    this.notifications.map(notification => {notification.decrementTime()});
		},
		notify(){
			for(let i = 0; i < this.notifications.length; i++){
				if(this.notifications[i].justFinished()){
					notifier.notify("Notifier App", this.notifications[i].name);
					this.notifications[i].toggleState();
				}
			}
		},
	}
});

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

const notifier = new Notifier();
notifier.requestDesktopNotificationPermission();

//TODO: Put this random code in the *mounted* lifecycle
setInterval(() => {
	app.decrement_times();
	app.notify();
}, 1000);
