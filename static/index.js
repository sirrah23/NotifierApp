const app = new Vue({
	el: "#app",
	data: {
		notifications: [],
		notification_name: "",
		notification_time: ""
	},
	methods: {
		addNotification(){
			if(!this.validUserNotifText) return;
			this.notifications = this.notifications.concat({
				name: this.notification_name, 
				current_time: this.notification_time,
				original_time: this.notification_time,
				state: "running"
			});
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
			this.notifications = this.notifications.map((notification) => {
				let res;
				if(notification.state === "running" && notification.current_time !== 0){
					res = Object.assign(
						{},
						notification,
						{"current_time": notification.current_time-1}
					);
				} else {
					res = Object.assign(
						{},
						notification
					);
				}
				return res;
			});
		},
		notify(){
			for(let i = 0; i < this.notifications.length; i++){
				if(this.notifications[i].current_time === 0 && this.notifications[i].state==="running"){
					notifier.notify("Notifier App", this.notifications[i].name);
					this.notifications[i].state = this.toggleState(this.notifications[i].state);
				}
			}
		},
		toggleState(state){
			if(state === "running"){
				return "stopped";
			} else {
				return "running";
			}
		}
	}
});

const Notifier = (function(Notification){

    function Notifier(){
        this.permission = Notification.permission;
    }

    Notifier.prototype.requestDesktopNotificationPermission = function(){
         if(Notification && this.permission === "default") {
            Notification.requestPermission(function(permission) {
                if(!("permission" in Notification)) {
                    Notification.permission = permission;
                    this.permission = permission;  //TODO: Might not need this...duplicated information
                }
            });
        }
    }

    Notifier.prototype.allowedToSendNotifications = function(){
        return this.permission === "granted"
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

setInterval(() => {
	app.decrement_times();
	app.notify();
}, 1000);
