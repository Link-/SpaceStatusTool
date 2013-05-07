#include <SPI.h>
#include <Ethernet.h>
#include <HttpClient.h>
#include <Cosm.h>

// MAC address for your Ethernet shield
byte mac[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };

// Your Cosm key to let you upload data
char cosmKey[] = "60quPHrNGggy6peIYZzU12kcE7WSAKwwcTM4R1pCcGF6Zz0g";

// Analog pin which we're monitoring (0 and 1 are used by the Ethernet shield)
int sensorPin = 2;

//Digital pin connected to LED
int ledPin = 1;

// Define the strings for our datastream IDs
char sensorId[] = "sensor_reading";
CosmDatastream datastreams[] = {
  CosmDatastream(sensorId, strlen(sensorId), DATASTREAM_FLOAT),
};
// Finally, wrap the datastreams into a feed
CosmFeed feed(127436, datastreams, 1 /* number of datastreams */);

EthernetClient client;
CosmClient cosmclient(client);

void setup() {
  // put your setup code here, to run once:
  pinMode(ledPin, OUTPUT); 
  digitalWrite(ledPin, LOW); 
  Serial.begin(9600);
  
  Serial.println("Starting single datastream upload to Cosm...");
  Serial.println();
  
  // blink once at start up
  Blink(ledPin, 1000);
 

  while (Ethernet.begin(mac) != 1)
  {
    Serial.println("Error getting IP address via DHCP, trying again...");
    Blink(ledPin, 1000);
    delay(14000);  
  }
}

void loop() {
  int sensorValue = digitalRead(sensorPin);
  datastreams[0].setFloat(sensorValue);

  Serial.print("Read sensor value ");
  Serial.println(datastreams[0].getFloat());

  Serial.println("Uploading it to Cosm");
  int ret = cosmclient.put(feed, cosmKey);
  Serial.print("cosmclient.put returned ");
  Serial.println(ret);
  Serial.println();
  if(ret<0) 
  {
    // If the return is unsuccessful LED blinks 7 times
    for(int i=0; i<7; i++) Blink(ledPin, 1000); 
  }else 
  {
    // If the return is successful LED is on
    digitalWrite(ledPin, HIGH);   
    delay(15000);
  }
}

void Blink(int pin, int delay_ms)
{
   digitalWrite(pin, HIGH);   // turn the LED on (HIGH is the voltage level)
   delay(delay_ms);               // wait for a second
   digitalWrite(pin, LOW);    // turn the LED off by making the voltage LOW
   delay(delay_ms); 
}
