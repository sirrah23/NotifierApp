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
				time: this.notification_time
			});
			this.clearUserNotifText();
		},
		validUserNotifText(){
			return this.notification_name > 0 && this.notification_time.length > 0;
		},
		clearUserNotifText(){
			this.notification_name = "";
			this.notification_time = "";
		}
	}
});

function Notifier(Notification){
	//TODO: Is it even worth injecting this on?
	this.notification = Notification
	this.permission = this.notification.permission;
}

Notifier.prototype.requestDesktopNotificationPermission = function(){
	 if(this.notification && this.permission === "default") {
		this.notification.requestPermission(function (permission) {
			if(!("permission" in this.notification)) {
				this.notification.permission = permission;
				this.permission = permission;
			}
		});
	}
}

Notifier.prototype.allowedToSendNotifications = function(){
	return this.permission === "granted"
}

Notifier.prototype.notify = function(title, text){
    if (this.allowedToSendNotifications){
		let text = "your Notification Body goes here";
		this.sendDesktopNotification(title, text);
    }
}

Notifier.prototype.sendDesktopNotification = function(title, text) {
	//Send the notification
    let notification = new this.notification(title , {body: text});

    //Set up some events to close it
	notification.onclick = function(){
		parent.focus();
		window.focus(); //just in case, older browsers
		this.close();
    };

    //Close automatically after specified length
    setTimeout(notification.close.bind(notification), 5000);
}

const notifier = new Notifier(Notification);
notifier.requestDesktopNotificationPermission();
notifier.notify("MY TITLE", "TEST");