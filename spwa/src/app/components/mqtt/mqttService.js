angular.module('app').service('mqttService', mqttService);

mqttService.$inject = [
    '$rootScope',
];


/*
    Mqtt Service uses Eclipse Paho JavaScript Client found :
        - https://github.com/eclipse/paho.mqtt.javascript
        - https://web.archive.org/web/20181212171208/https://github.com/eclipse/paho.mqtt.javascript
*/
function mqttService($rootScope) {
    var self = this;

    self.initialize = initialize;
    self.connect = connect;
    self.subscribe = subscribe;
    self.publish = publish;
    self.onConnectionLost = onConnectionLost;
    self.onMessageArrived = onMessageArrived;

    var client = null;

    // Initialize mqtt client, this must be the done before any other actions
    function initialize(hostname, port, clientId = "clientId") {
        if (!hostname) { throw new Error("Invalid hostname") }
        client = new Paho.MQTT.Client(hostname, Number(port), clientId);
    }

    //connect to the mqtt broker
    function connect(callback) {
        if (client == null) { throw new Error("Need to Initialize Mqtt") }
        client.connect({onSuccess:callback});
    }

    //subscribe to a mqtt topic, when message arrives client.onMessageArrived is called
    function subscribe(topic) {
        if (client == null) { throw new Error("Need to Initialize Mqtt")}
        client.subscribe(topic)
    }

    //publish mqtt message
    function publish(topic,message){
        if (client == null) { throw new Error("Need to Initialize Mqtt")}
        var mqtt_message = new Paho.MQTT.Message(message);
        mqtt_message.destinationName = topic;
        client.send(mqtt_message);
    }

    //called when connection is lost
    function onConnectionLost(callback) {
        if (client == null) { throw new Error("Need to Initialize Mqtt") }
        client.onConnectionLost = callback;
    }

    // called when a message arrives
    function onMessageArrived(callback) {
        if (client == null) { throw new Error("Need to Initialize Mqtt") }
        client.onMessageArrived = callback;
    }

}