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
})