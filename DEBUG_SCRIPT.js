// 🔧 DEBUGGING SCRIPT
// Copy and paste this in your browser console (F12 → Console tab)

console.log("=== WITHDRAWAL SYSTEM DEBUG ===\n");

// Check localStorage
const user = JSON.parse(localStorage.getItem("user"));
const token = localStorage.getItem("token");

console.log("📝 User object in localStorage:");
console.log(user);

console.log("\n🔑 Sitter Profile ID Check:");
console.log("Value:", user?.sitterProfile);
console.log("Length:", user?.sitterProfile?.length);
console.log("Valid 24-char hex?", /^[a-f0-9]{24}$/.test(user?.sitterProfile));

console.log("\n🎟️  Token present?", token ? "YES ✅" : "NO ❌");

// If ID is invalid, show what to do
if (!user?.sitterProfile || user.sitterProfile.length !== 24) {
  console.log("\n❌ ISSUE FOUND: Sitter ID is not 24 characters!");
  console.log("\n📌 FIX:");
  console.log("1. Open this in console: localStorage.clear()");
  console.log("2. Refresh the page: location.reload()");
  console.log("3. Log in again");
  console.log("4. Paste this script again to verify");
} else {
  console.log("\n✅ Sitter ID is valid! Balance should work.");
}
