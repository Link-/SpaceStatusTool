/**
 * Space Status Tool - Arduino module
 * @author: Bassem Dghaidy & Bassam Jalgha
 * @version: 1.02
 *
 * @notes: The code is still in its early stages
 * and some refactoring is to be done. 
 */

#include <SPI.h>
#include <Ethernet.h>
#include <HttpClient.h>
#include <Cosm.h>

// MAC address for your Ethernet shield
byte mac[]         = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };

// Your Cosm key to let you upload data
char cosmKey[]    = "zFXUz3Ls3kpiatGy3O0OH63eRcuSAKxTYmEza2RKb2JKVT0g";

// Analog pin which we're monitoring (0 and 1 are used by the Ethernet shield)
int sensorPin     = A2;

//Digital pin connected to LED
int ledPin        = 2;

// Time between each update
int updateDelay   = 1000;

float cachedValue = 0.0;

// Define the strings for our datastream IDs
char sensorId[] = "sensor_reading";
CosmDatastream datastreams[] = {
  CosmDatastream(sensorId, strlen(sensorId), DATASTREAM_FLOAT),
};
// Finally, wrap the datastreams into a feed
CosmFeed feed(127436, datastreams, 1 /* number of datastreams */);

EthernetClient client;
CosmClient cosmclient(client);

void setup() 
{
  // Setting the pinmode of pin 1 to OUTPUT
  // Turning off the LED
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
    delay(15000);
  }
}

void loop() 
{
  int sensorValue = digitalRead(sensorPin);
  datastreams[0].setFloat(sensorValue);
  
  Serial.print("Read sensor value ");
  Serial.println(datastreams[0].getFloat());
  
  //if (sensorValue != cachedValue)
  //{
    // Set the cached value to sensor value
    cachedValue = sensorValue;
    
    // Send data to cosm
    Serial.println("Uploading it to Cosm");
    int ret = cosmclient.put(feed, cosmKey);
    Serial.print("cosmclient.put returned ");
    Serial.println(ret);
    
    // Evaluate the return value
    if (ret < 0)
      // Error - Blink the LED 7 times
      BlinkMultiple(ledPin, 8, 100);
    else
    {
      // Success      
      // No Error, Light up LED if Open / Turn it off if Closed
      if (sensorValue < 1)
        digitalWrite(ledPin, LOW);     // Turn off the LED
      else
        digitalWrite(ledPin, HIGH);
      
      // Update after delay
      delay(updateDelay);
    }
  //}
}

// Global function to Blink an LED
void Blink(int pin, int delay_ms)
{
   digitalWrite(pin, HIGH);   // Turn the LED on (HIGH is the voltage level)
   delay(delay_ms);           // Wait for the duration of delay
   digitalWrite(pin, LOW);    // Turn the LED off by making the voltage LOW
   delay(delay_ms); 
}

// Global function to Blink an LED multiple times
void BlinkMultiple(int pin, int times, int delays_ms)
{
  // Return if input is not ok
  if (times <= 0)
    return;
  
  for (int i = 0; i < times; i++)
    Blink(pin, delays_ms);
}
