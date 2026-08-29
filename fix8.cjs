const fs = require('fs');

let content = fs.readFileSync('src/pages/CheckoutView.vue', 'utf8');

// Find autoFillAddressHierarchyFromText block
const startIdx = content.indexOf('async function autoFillAddressHierarchyFromText');
const endIdx = content.indexOf('async function calculateRouteFromFreeformAddress');

if (startIdx !== -1 && endIdx !== -1) {
    let block = content.substring(startIdx, endIdx);
    
    // Replace addressText with input inside this block
    block = block.replace(/addressText/g, 'input');
    
    content = content.substring(0, startIdx) + block + content.substring(endIdx);
    fs.writeFileSync('src/pages/CheckoutView.vue', content);
    console.log('Fixed addressText in autoFill!');
} else {
    console.log('Could not find boundaries');
}
