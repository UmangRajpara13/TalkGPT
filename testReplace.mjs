// let originalString = "Hello, ```world```!";
// let modifiedString = originalString.replace(/```/g, ""); // Replace all occurrences of ``` with an empty string
// console.log(modifiedString); // Output: "Hello, world!"
let stringArray = ["```apple```", "```banana```", "```orange```", "```grape```"];
let searchString = "banana";

let searchStringWithTicks = "```" + searchString + "```"; // Adding ticks to the search string

if (stringArray.includes(searchStringWithTicks)) {
    console.log("String found in the array.");
} else {
    console.log("String not found in the array.");
}