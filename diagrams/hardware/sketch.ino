// --- INPUT PINS (Slide Switches) ---
const int swLight1 = 12;
const int swLight2 = 14;
const int swLight3 = 27;
const int swFan1 = 25;
const int swFan2 = 26;

// --- OUTPUT PINS (LEDs) ---
const int ledLight1 = 2; // Red LED
const int ledLight2 = 4; // Red LED
const int ledLight3 = 5; // Red LED
const int ledFan1 = 18;  // Blue LED
const int ledFan2 = 19;  // Blue LED

void setup() {
  Serial.begin(115200);
  
  // Initialize Switches as Inputs
  pinMode(swLight1, INPUT_PULLUP);
  pinMode(swLight2, INPUT_PULLUP);
  pinMode(swLight3, INPUT_PULLUP);
  pinMode(swFan1, INPUT_PULLUP);
  pinMode(swFan2, INPUT_PULLUP);

  // Initialize LEDs as Outputs
  pinMode(ledLight1, OUTPUT);
  pinMode(ledLight2, OUTPUT);
  pinMode(ledLight3, OUTPUT);
  pinMode(ledFan1, OUTPUT);
  pinMode(ledFan2, OUTPUT);
  
  Serial.println("Office Hardware Simulator Started...");
}

void loop() {
  // 1. Read switch states (Inverted because of INPUT_PULLUP)
  bool l1_on = !digitalRead(swLight1);
  bool l2_on = !digitalRead(swLight2);
  bool l3_on = !digitalRead(swLight3);
  bool f1_on = !digitalRead(swFan1);
  bool f2_on = !digitalRead(swFan2);

  // 2. Turn LEDs on or off based on switches
  digitalWrite(ledLight1, l1_on);
  digitalWrite(ledLight2, l2_on);
  digitalWrite(ledLight3, l3_on);
  digitalWrite(ledFan1, f1_on);
  digitalWrite(ledFan2, f2_on);

  // 3. Calculate simulated power draw (15W per light, 60W per fan)
  int totalPower = 0;
  if(l1_on) totalPower += 15;
  if(l2_on) totalPower += 15;
  if(l3_on) totalPower += 15;
  if(f1_on) totalPower += 60;
  if(f2_on) totalPower += 60;

  // 4. Print live status to the console
  Serial.print("[LIVE] Total Room Power Draw: ");
  Serial.print(totalPower);
  Serial.println(" W");

  delay(2000); // Wait 2 seconds before checking again
}