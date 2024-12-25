// Select DOM elements
const exportBtn = document.getElementById('exportBtn');
const addTextBtn = document.getElementById('addTextBtn');
const addImageBtn = document.getElementById('addImageBtn');
const addButtonBtn = document.getElementById('addButtonBtn');
const previewArea = document.getElementById('previewArea');
const projectTitleInput = document.getElementById('projectTitle');
const toolboxInfo = document.getElementById('toolboxInfo');
const textControls = document.getElementById('textControls');
const fontSizeInput = document.getElementById('fontSize');
const textColorInput = document.getElementById('textColor');
const editTextContent = document.getElementById('editTextContent');
const imageUrlInput = document.getElementById('imageUrlInput');
const imageUrlField = document.getElementById('imageUrl');
const insertImageBtn = document.getElementById('insertImageBtn');
const buttonControls = document.getElementById('buttonControls');
const buttonTextInput = document.getElementById('buttonText');
const buttonUrlInput = document.getElementById('buttonUrl');
const pageSelector = document.getElementById('pageSelector'); // Select the page selector dropdown
const addPageBtn = document.getElementById('addPageBtn'); // Select the add page button
let currentElement = null; // Variable to keep track of the selected element (button or text)
let currentPageIndex = 0; // Start from Page 1 (index 0)
let pages = [{ elements: [] }]; // Store the pages, each with its own elements (initially one empty page)

// Helper function to convert rgb to hex
function rgbToHex(rgb) {
    const rgbValues = rgb.match(/\d+/g);
    const hex = rgbValues
        .map(value => {
            const hexValue = parseInt(value).toString(16);
            return hexValue.length === 1 ? '0' + hexValue : hexValue;
        })
        .join('');
    return `#${hex}`;
}

// Initialize the project with Page 1
document.addEventListener('DOMContentLoaded', () => {
    // Ensure there's at least one page (Page 1)
    if (pages.length === 1) {
        const option = document.createElement('option');
        option.value = 0; // Page index starts from 0
        option.textContent = `Page 1`;
        pageSelector.appendChild(option);
    }

    // Initialize the preview area with Page 1's elements
    previewArea.innerHTML = ''; // Clear any existing elements
    pages[0].elements.forEach(element => {
        previewArea.appendChild(element); // Re-add saved elements from Page 1
        makeElementDraggable(element); // Ensure elements are draggable
    });
});

// Event listeners for adding elements
addTextBtn.addEventListener('click', () => {
    const textElement = document.createElement('p');
    textElement.textContent = 'Label';
    textElement.classList.add('movable'); // Make it movable
    previewArea.appendChild(textElement);

    // Ensure the current page is initialized
    if (!pages[currentPageIndex]) {
        pages[currentPageIndex] = { elements: [] };
    }

    pages[currentPageIndex].elements.push(textElement); // Add element to current page
    toolboxInfo.textContent = 'You can edit this text from the toolbox.';

    // Make the text element draggable
    makeElementDraggable(textElement);

    textElement.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent click from propagating to the document
        currentElement = textElement;
        textControls.style.display = 'block'; // Show text controls
        toolboxInfo.textContent = 'Edit the text properties.';
        
        // Fill the text controls with the current properties of the selected text element
        editTextContent.value = textElement.textContent;
        fontSizeInput.value = window.getComputedStyle(textElement).fontSize.replace('px', '');
        textColorInput.value = rgbToHex(window.getComputedStyle(textElement).color); // Use rgbToHex to set color
    });
});

addImageBtn.addEventListener('click', () => {
    imageUrlInput.style.display = 'block'; // Show the image URL input
    toolboxInfo.textContent = 'Enter an image URL to insert:';
});

insertImageBtn.addEventListener('click', () => {
    const imageUrl = imageUrlField.value;
    if (imageUrl) {
        const imageElement = document.createElement('img');
        imageElement.src = imageUrl;
        imageElement.alt = 'Inserted Image';
        imageElement.style.maxWidth = '100%';
        imageElement.style.position = 'absolute'; // Make the image draggable
        imageElement.classList.add('movable-image');
        previewArea.appendChild(imageElement);

        // Ensure the current page is initialized
        if (!pages[currentPageIndex]) {
            pages[currentPageIndex] = { elements: [] };
        }

        pages[currentPageIndex].elements.push(imageElement); // Add element to current page
        imageUrlInput.style.display = 'none'; // Hide the input after the image is added
        imageUrlField.value = ''; // Clear the URL field
        toolboxInfo.textContent = 'Image inserted successfully. You can resize and move it.';

        // Make the image draggable
        makeElementDraggable(imageElement);
    } else {
        toolboxInfo.textContent = 'Please enter a valid image URL.';
    }
});

addButtonBtn.addEventListener('click', () => {
    const buttonElement = document.createElement('button');
    buttonElement.textContent = 'New Button';
    buttonElement.classList.add('movable'); // Make it movable
    previewArea.appendChild(buttonElement);

    // Ensure the current page is initialized
    if (!pages[currentPageIndex]) {
        pages[currentPageIndex] = { elements: [] };
    }

    pages[currentPageIndex].elements.push(buttonElement); // Add element to current page
    toolboxInfo.textContent = 'You can edit this button.';
    makeElementDraggable(buttonElement); // Make the button draggable

    // Show button controls when a button is selected
    buttonControls.style.display = 'block';

    buttonElement.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent click from propagating to the document
        currentElement = buttonElement;
        buttonControls.style.display = 'block'; // Show button controls
        toolboxInfo.textContent = 'Edit the button properties.';

        // Fill the button controls with the current properties of the selected button element
        buttonTextInput.value = buttonElement.textContent;
        buttonUrlInput.value = buttonElement.getAttribute('data-url') || '';
    });
});

// Function to make any element draggable
function makeElementDraggable(element) {
    let isDragging = false;
    let offsetX, offsetY;

    element.addEventListener('mousedown', (event) => {
        isDragging = true;
        offsetX = event.clientX - element.offsetLeft;
        offsetY = event.clientY - element.offsetTop;

        const onMouseMove = (moveEvent) => {
            if (isDragging) {
                const x = moveEvent.clientX - offsetX;
                const y = moveEvent.clientY - offsetY;
                element.style.left = `${x}px`;
                element.style.top = `${y}px`;
            }
        };

        const onMouseUp = () => {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });
}

// Event listener for text editing from the toolbox
editTextContent.addEventListener('input', () => {
    if (currentElement && currentElement.tagName.toLowerCase() === 'p') {
        currentElement.textContent = editTextContent.value; // Update text content for labels
    }
});

fontSizeInput.addEventListener('input', () => {
    if (currentElement && currentElement.tagName.toLowerCase() === 'p') {
        currentElement.style.fontSize = `${fontSizeInput.value}px`; // Update font size for labels
    }
});

textColorInput.addEventListener('input', () => {
    if (currentElement && currentElement.tagName.toLowerCase() === 'p') {
        currentElement.style.color = textColorInput.value; // Update text color for labels
    }
});

// Event listener for button text and URL changes
buttonTextInput.addEventListener('input', () => {
    if (currentElement && currentElement.tagName.toLowerCase() === 'button') {
        currentElement.textContent = buttonTextInput.value; // Update button text
    }
});

buttonUrlInput.addEventListener('input', () => {
    if (currentElement && currentElement.tagName.toLowerCase() === 'button') {
        currentElement.setAttribute('data-url', buttonUrlInput.value); // Update button URL
    }
});

// Add page functionality
addPageBtn.addEventListener('click', () => {
    // Create a new page and add it to the pages array
    const newPage = {
        elements: []
    };

    // Add the new page to the pages array
    pages.push(newPage);
    currentPageIndex = pages.length - 1; // Switch to the new page

    // Update the page selector dropdown with the new page
    const option = document.createElement('option');
    option.value = pages.length - 1;  // The value is the index of the new page
    option.textContent = `Page ${pages.length}`; // Page name like 'Page 2', 'Page 3'
    pageSelector.appendChild(option);
    pageSelector.value = pages.length - 1; // Set the page selector to the newly added page

    // Clear the preview area
    previewArea.innerHTML = ''; // Reset the preview area for the new page

    toolboxInfo.textContent = `Page ${pages.length} created. Start adding elements.`;

    // Load elements of the new page into the preview area
    pages[currentPageIndex].elements.forEach(element => {
        previewArea.appendChild(element); // Re-add saved elements
        makeElementDraggable(element); // Ensure elements are draggable
    });
});

// Page selector functionality
pageSelector.addEventListener('change', (event) => {
    // Switch to the selected page
    currentPageIndex = parseInt(event.target.value);
    previewArea.innerHTML = ''; // Clear the preview area

    // Load the elements of the selected page
    pages[currentPageIndex].elements.forEach(element => {
        previewArea.appendChild(element); // Re-add saved elements
        makeElementDraggable(element); // Ensure elements are draggable
    });
});

// Export project HTML
exportBtn.addEventListener('click', () => {
    const projectName = projectTitleInput.value;
    
    // Create the HTML content without the <h1> header and with draggable functionality
    const htmlContent = `
        <html>
            <head>
                <title>${projectName}</title> <!-- Made with FrameSpace -->
                <style>
                    body {
                        font-family: Arial, sans-serif;
                    }
                    .movable {
                        position: absolute;
                        cursor: move;
                    }
                </style>
            </head>
            <body>
                ${Array.from(previewArea.children).map(child => {
                    if (child.tagName.toLowerCase() === 'button') {
                        const buttonUrl = child.getAttribute('data-url');
                        return child.outerHTML.replace('<button', `<button onclick="window.location.href='${buttonUrl}'"`);
                    }
                    return child.outerHTML;
                }).join('\n')}
            </body>
        </html>
    `;

    // Create a Blob and download the HTML file
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${projectName}.html`; // The filename will be the project name
    link.click();
});

// Deselect item and close toolbox when clicking outside of the selected element
previewArea.addEventListener('click', () => {
    // Deselect the current element and hide toolbox controls
    currentElement = null;
    textControls.style.display = 'none';
    buttonControls.style.display = 'none';
    toolboxInfo.textContent = '';
});
