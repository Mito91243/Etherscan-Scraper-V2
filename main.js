import { Keyboard } from "puppeteer";
import fs from "fs";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { time } from "console";

puppeteer.use(StealthPlugin());
/*
document.addEventListener("DOMContentLoaded", function () {
  submitButton.addEventListener("click", function () {
    const startupName = document.getElementById("startupName").value;
    const timeHour = document.getElementById("timeHour").value;
    const timeDate = document.getElementById("timeDate").value;
    console.log("Startup Name:", startupName);
    console.log("Time:", timeHour);
    console.log("Date:", timeDate);
  });
});
*/

//! Only Modify these Values.
const startup_name = "Little Thinking Minds";
const time_h = "3:30 pm";
const time_d = "09 Jan 2024";
const Season = "Winter"
//! Only Modify these Values.


async function getInfoByName(name) {

  //name = name.replace(/\s/g, '');
  const rawData = fs.readFileSync("data.json");

  // Parse the JSON data
  const jsonData = JSON.parse(rawData);
  const entry = jsonData.find((entry) => entry.Name === name);

  if (entry) {
    const { Name, Ceo, Email, Country } = entry;
    return { Name, Ceo, Email, Country };
  } else {
    return null; // Return null if the name is not found
  }
}

async function Send_Calender_Invite() {
  const entry = await getInfoByName(startup_name);
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      "--no-sandbox",
      "--disable-gpu",
      "--enable-webgl",
      "--window-size=800,800",
    ],
  });

  const loginUrl =
    "https://accounts.google.com/AccountChooser?service=mail&continue=https://google.com&hl=en";
  const ua =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36";
  const page = await browser.newPage();

  await page.setUserAgent(ua);
  await page.goto(loginUrl, { waitUntil: "networkidle2" });
  await page.type('input[type="email"]', "pitoamir6@gmail.com");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(4000);
  await page.type('input[type="password"]', "legenkiller91243");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(2000);

  //* End of Google Login

  const page2 = await browser.newPage();
  const meeturl =
    "https://accounts.google.com/v3/signin/identifier?dsh=S1611624178:1665765818620%20318&continue=https://calendar.google.com/calendar/r&followup=https://calendar.google.com/calendar/r&osid=1&passive=1209600&service=cl&flowName=GlifWebSignIn&flowEntry=ServiceLogin&ifkv=AQDHYWrL2lk0_Bcr1n1Y-f-i1sNZRKJK8CNisliX9rpozkqKhY2Jby8gsVZ_wDz_oHqiWmN6uZ6s6g&ec=wgc-calendar-globalnav-signin";
  await page2.goto(meeturl, { waitUntil: "networkidle2" });
  const eventurl =
    "https://calendar.google.com/calendar/u/0/r/eventedit?state=%5Bnull%2Cnull%2Cnull%2Cnull%2C%5B13%5D%5D&pli=1";

  const page3 = await browser.newPage();
  await page3.goto(eventurl, { waitUntil: "networkidle2" });
  await page3.waitForTimeout(4000);

  //* End of Google Meet Login

  //* Entering Startups Details
  await page3.type("#c52", "meet.google.com/tzk-egnt-kuc"); // Location
  await page3.waitForTimeout(2000);
  await page3.type("#xTiIn", `Growth Consultation Session - ${entry.Name}`); // Title
  await page3.waitForTimeout(2000);
  await page3.type("#xStDaIn", `${time_d}`); // Day

  //TODO: Make the description Dynamic
  await page3.type(
    "#T2Ybvb0",
    `
   meet.google.com/tzk-egnt-kuc
   Or dial: (ZA) +27 10 823 1169
   PIN: 402 839 600#
   More numbers: t.meet/tzk-egnt-kuc`
  );

  //* Entering Guests
  //TODO: Make the members addition Dynamic
  await page3.type("#c47", `tarek@ubuntuconsulting.org`); // Guests 1
  await page3.waitForTimeout(1000);
  await page3.keyboard.press("Enter");
  await page3.waitForTimeout(1000);

  await page3.type("#c47", `lenah@flat6labs.com`); // Guest 2
  await page3.waitForTimeout(1000);
  await page3.keyboard.press("Enter");
  await page3.waitForTimeout(1000);

  await page3.type("#c47", `${entry.Email}`); // Guest 3
  await page3.waitForTimeout(1000);
  await page3.keyboard.press("Enter");

  //TODO: If the it's in jordan or Iraq Shift 1h
  const country = entry.Country;

  if ((country === "Iraq" || country === "Jordan") && (Season !== "Summer")) {
    await page3.waitForTimeout(2000);
    await page3.click("div.X5n8xe > button > div.VfPpkd-Jh9lGc");
    await page3.waitForTimeout(2000);
    await page3.click(
      "#yDmH0d > div > div.VfPpkd-wzTsW > div > div.VfPpkd-cnG4Wd > div > div > div > div:nth-child(1) > div > div > div.VfPpkd-TkwUic"
    );
    await page3.waitForTimeout(1000);
    await page3.keyboard.press("ArrowUp");
    await page3.waitForTimeout(1000);
    await page3.keyboard.press("Enter");
    await page3.waitForTimeout(1000);
    await page3.click(
      "#yDmH0d > div > div.VfPpkd-wzTsW > div > div.VfPpkd-T0kwCb > button:nth-child(3) > div.VfPpkd-RLmnJb"
    );
    await page3.waitForTimeout(1500);
    // Parse the time string into a Date object
    const parsedTime = new Date("2000-01-01 " + time_h);
    // Increment the hour by 1
    parsedTime.setHours(parsedTime.getHours() + 1);
    // Format the updated time back to the desired string format
    const updatedTime = parsedTime.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    await page3.type("#xStTiIn", `${updatedTime}`); // Hour
  } else {
    await page3.type("#xStTiIn", `${time_h}`); // Hour
  }
  await page3.keyboard.press("Enter");
  //TODO: Make Database to just enter the name , day and hour and it fills that data from the database
}

Send_Calender_Invite();
