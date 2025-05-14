// --- DOM Elements ---
const bodyElement = document.body;
const pageHtmlTitle = document.querySelector('title');
const appHeader = document.getElementById('app-header'); // For potential dynamic styling
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const themeToggleIcon = document.getElementById('theme-toggle-icon');
const themeToggleText = document.getElementById('theme-toggle-text');

const landingPage = document.getElementById('landing-page');
const usernamePrompt = document.getElementById('username-prompt');
const usernameInput = document.getElementById('username-input');
const saveUsernameBtn = document.getElementById('save-username-btn');
const usernameDisplayContainer = document.getElementById('username-display-container');
const usernameText = document.getElementById('username-text');
const changeUsernameBtn = document.getElementById('change-username-btn'); 
const mainContent = document.getElementById('main-content');
const pageMainTitleElement = document.getElementById('page-main-title'); // NEW
const editPageTitleBtn = document.getElementById('edit-page-title-btn'); // NEW
const welcomeUserMessage = document.getElementById('welcome-user-message');
const booksGrid = document.getElementById('books-grid');
const noBooksMessage = document.getElementById('no-books-message');
const addBookBtn = document.getElementById('add-book-btn');

const bookCreationModal = document.getElementById('book-creation-modal');
const modalStep1 = document.getElementById('modal-step-1');
const modalStep2 = document.getElementById('modal-step-2');
const bookTitleInput = document.getElementById('book-title-input');
const numPagesInput = document.getElementById('num-pages-input');
const cancelCreationBtn = document.getElementById('cancel-creation-btn');
const nextStepBtn = document.getElementById('next-step-btn');
const backToStep1Btn = document.getElementById('back-to-step1-btn');
const saveBookBtn = document.getElementById('save-book-btn');
const pageContentInputsContainer = document.getElementById('page-content-inputs');
const currentPageEditorLabel = document.getElementById('current-page-editor-label');
const prevPageEditorBtn = document.getElementById('prev-page-editor-btn');
const nextPageEditorBtn = document.getElementById('next-page-editor-btn');
const pageEditorIndicator = document.getElementById('page-editor-indicator');
const bookCreationModalTitle = document.querySelector('#book-creation-modal #modal-step-1 h2');
const bookCreationModalSaveButton = document.getElementById('save-book-btn');
const coverImageInputContainer = document.getElementById('cover-image-input-container'); 
const coverImageUrlInput = document.getElementById('cover-image-url-input'); 

const bookReaderContainer = document.getElementById('book-reader-container');
const bookReader = document.getElementById('book-reader');
const leftPageElement = document.getElementById('left-page'); 
const rightPageElement = document.getElementById('right-page'); 
const leftPage = leftPageElement.querySelector('.page-content');
const rightPage = rightPageElement.querySelector('.page-content');
const turnPrevBtn = document.getElementById('turn-prev');
const turnNextBtn = document.getElementById('turn-next');
const closeBookBtn = document.getElementById('close-book-btn');

// --- State Variables ---
let userName = '';
let libraryTitle = "Lulu's Library"; // NEW: Default library title
let currentTheme = 'normal'; // NEW: 'normal' or 'caldas'
let books = []; 
let currentBookToCreate = { title: '', pages: [] };
let currentPageEditorIndex = 0; 
let editingBookId = null; 
let currentOpenBook = null;
let currentOpenBookPageIndex = 0; 

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    applyTheme(); // Apply theme early
    renderUI();
    attachEventListeners();
});

// --- Local Storage Functions ---
function loadState() {
    const storedData = localStorage.getItem('webBookAppData'); // Changed key for clarity
    if (storedData) {
        const data = JSON.parse(storedData);
        userName = data.userName || '';
        libraryTitle = data.libraryTitle || "Lulu's Library"; // Load library title
        currentTheme = data.currentTheme || 'normal'; // Load theme
        books = data.books || [];
    }
}

function saveState() {
    localStorage.setItem('webBookAppData', JSON.stringify({ 
        userName, 
        libraryTitle, // Save library title
        currentTheme, // Save theme
        books 
    }));
}

// --- Theme Management --- NEW
function applyTheme() {
    bodyElement.classList.remove('normal-mode', 'caldas-mode');
    bodyElement.classList.add(currentTheme + '-mode');
    updateThemeToggleButton();
}

function toggleTheme() {
    currentTheme = (currentTheme === 'normal') ? 'caldas' : 'normal';
    applyTheme();
    saveState();
}

function updateThemeToggleButton() {
    if (currentTheme === 'caldas') {
        themeToggleIcon.textContent = '🎮'; // Gamer icon or similar
        themeToggleText.textContent = 'Caldas';
    } else {
        themeToggleIcon.textContent = '☀️';
        themeToggleText.textContent = 'Normal';
    }
}


// --- UI Rendering Functions ---
function renderUI() {
    // Update HTML title and main page title
    pageHtmlTitle.textContent = libraryTitle;
    if (pageMainTitleElement) pageMainTitleElement.textContent = libraryTitle;

    if (userName) {
        usernamePrompt.classList.add('hidden');
        mainContent.classList.remove('hidden');
        usernameText.textContent = `Hi, ${userName}!`;
        if (changeUsernameBtn) changeUsernameBtn.classList.remove('hidden'); 
        if (editPageTitleBtn) editPageTitleBtn.classList.remove('hidden'); // Show edit page title btn
        usernameDisplayContainer.classList.remove('hidden');
        welcomeUserMessage.textContent = `Welcome back! Here are your creations:`; 
        renderBooksGrid();
    } else {
        usernamePrompt.classList.remove('hidden');
        mainContent.classList.add('hidden');
        if (changeUsernameBtn) changeUsernameBtn.classList.add('hidden'); 
        if (editPageTitleBtn) editPageTitleBtn.classList.add('hidden'); // Hide edit page title btn
        usernameDisplayContainer.classList.add('hidden');
    }
}

// (renderBooksGrid, getRandomColor - keep as is, they will inherit themed styles)
function renderBooksGrid() {
    booksGrid.innerHTML = ''; 
    if (books.length === 0) {
        noBooksMessage.classList.remove('hidden');
        booksGrid.classList.add('hidden'); 
        return;
    }
    noBooksMessage.classList.add('hidden');
    booksGrid.classList.remove('hidden'); 

    books.forEach(book => {
        const bookItemContainer = document.createElement('div');
        bookItemContainer.classList.add('relative', 'group', 'book-cover-container');

        const coverDiv = document.createElement('div');
        coverDiv.classList.add('book-cover-item', 'rounded-lg', 'shadow-md', 'cursor-pointer', 'flex', 'flex-col', 'justify-end', 'items-center', 'h-64', 'aspect-[2/3]', 'bg-cover', 'bg-center', 'relative', 'overflow-hidden');
        
        const coverPage = book.pages && book.pages[0];
        if (coverPage && coverPage.coverImageUrl) {
            coverDiv.style.backgroundImage = `url('${CSS.escape(coverPage.coverImageUrl)}')`;
        } else {
            // Fallback color logic can be enhanced by theme if desired
            coverDiv.style.backgroundColor = book.coverColor || (currentTheme === 'caldas' ? '#3a3a5e' : getRandomColor());
            coverDiv.style.backgroundImage = ''; 
        }
        
        const textContentWrapper = document.createElement('div'); 
        textContentWrapper.classList.add('relative', 'z-10', 'flex', 'flex-col', 'justify-end', 'items-center', 'w-full', 'p-2');


        const titleEl = document.createElement('h3');
        titleEl.classList.add('book-cover-title'); 
        titleEl.textContent = book.title; 
        
        const authorEl = document.createElement('p');
        authorEl.classList.add('book-cover-author'); 
        authorEl.textContent = `By ${userName}`;

        textContentWrapper.appendChild(titleEl); 
        textContentWrapper.appendChild(authorEl); 
        coverDiv.appendChild(textContentWrapper);
        
        coverDiv.addEventListener('click', (e) => {
            if (e.target.closest('.book-action-btn')) return;
            openBook(book, coverDiv);
        });

        const actionsWrapper = document.createElement('div');
        actionsWrapper.classList.add('absolute', 'top-2', 'right-2', 'opacity-0', 'group-hover:opacity-100', 'transition-opacity', 'duration-200', 'flex', 'space-x-1', 'z-20'); 

        const editButton = document.createElement('button');
        editButton.innerHTML = '✏️'; 
        editButton.title = "Edit Book";
        editButton.classList.add('book-action-btn', 'p-2', 'bg-blue-500', 'text-white', 'rounded-md', 'hover:bg-blue-600', 'text-xs', 'shadow');
        editButton.addEventListener('click', (e) => {
            e.stopPropagation(); 
            handleStartEditBook(book.id);
        });

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '🗑️'; 
        deleteButton.title = "Delete Book";
        deleteButton.classList.add('book-action-btn', 'p-2', 'bg-red-500', 'text-white', 'rounded-md', 'hover:bg-red-600', 'text-xs', 'shadow');
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation(); 
            handleDeleteBook(book.id);
        });

        actionsWrapper.appendChild(editButton);
        actionsWrapper.appendChild(deleteButton);
        
        bookItemContainer.appendChild(actionsWrapper);
        bookItemContainer.appendChild(coverDiv);
        booksGrid.appendChild(bookItemContainer);
    });
}

function getRandomColor() { // Used for normal mode book cover fallback
    const letters = '789ABCD'; 
    let color = '#';
    for (let i = 0; i < 3; i++) { 
        color += letters[Math.floor(Math.random() * letters.length)]; 
    }
    return color;
}

// --- Event Listeners & Handlers ---
function attachEventListeners() {
    if (saveUsernameBtn) saveUsernameBtn.addEventListener('click', handleSaveUsername);
    if (usernameInput) usernameInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSaveUsername(); });
    if (changeUsernameBtn) changeUsernameBtn.addEventListener('click', handleChangeUsername); 
    if (editPageTitleBtn) editPageTitleBtn.addEventListener('click', handleChangeLibraryTitle); // NEW
    if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme); // NEW

    if (addBookBtn) addBookBtn.addEventListener('click', () => showBookCreationModal()); 
    if (cancelCreationBtn) cancelCreationBtn.addEventListener('click', hideBookCreationModal);
    if (nextStepBtn) nextStepBtn.addEventListener('click', handleModalNextStep);
    if (backToStep1Btn) backToStep1Btn.addEventListener('click', handleModalBackToStep1);
    if (saveBookBtn) saveBookBtn.addEventListener('click', handleSaveBook);
    if (prevPageEditorBtn) prevPageEditorBtn.addEventListener('click', () => changeEditorPage(-1));
    if (nextPageEditorBtn) nextPageEditorBtn.addEventListener('click', () => changeEditorPage(1));
    if (closeBookBtn) closeBookBtn.addEventListener('click', closeBook);
    if (turnPrevBtn) turnPrevBtn.addEventListener('click', () => turnPage(-2));
    if (turnNextBtn) turnNextBtn.addEventListener('click', () => turnPage(2));

    document.addEventListener('keydown', (e) => {
        if (bookReaderContainer && !bookReaderContainer.classList.contains('hidden')) {
            if (e.key === 'ArrowLeft') turnPage(-2);
            if (e.key === 'ArrowRight') turnPage(2);
            if (e.key === 'Escape') closeBook();
        }
        if (bookCreationModal && !bookCreationModal.classList.contains('hidden') && e.key === 'Escape') {
            hideBookCreationModal();
        }
    });
}

function handleSaveUsername() {
    const name = usernameInput.value.trim();
    if (name) {
        userName = name;
        saveState();
        renderUI();
    } else {
        alert("Please enter your name.");
    }
}

function handleChangeUsername() {
    const newName = prompt("Enter your new name:", userName);
    if (newName && newName.trim() !== "") {
        userName = newName.trim();
        saveState();
        renderUI(); 
    } else if (newName !== null) { 
        alert("Name cannot be empty.");
    }
}

// NEW: Handle Change Library Title
function handleChangeLibraryTitle() {
    const newTitle = prompt("Enter the new name for your library:", libraryTitle);
    if (newTitle && newTitle.trim() !== "") {
        libraryTitle = newTitle.trim();
        saveState();
        renderUI(); // Re-render to update the titles
    } else if (newTitle !== null) {
        alert("Library name cannot be empty.");
    }
}


// --- Book Creation/Editing Modal Logic ---
// (showBookCreationModal, hideBookCreationModal, handleModalNextStep, renderPageContentInputs, 
// changeEditorPage, handleModalBackToStep1, handleSaveBook - keep as is from previous version, 
// ensuring textarea placeholder and HTML conversion logic are correct)
function showBookCreationModal(bookIdToEdit = null) {
    editingBookId = bookIdToEdit; 

    if (editingBookId) {
        const book = books.find(b => b.id === editingBookId);
        if (!book) {
            editingBookId = null; 
            return;
        }
        currentBookToCreate = JSON.parse(JSON.stringify(book));
        if (!currentBookToCreate.pages) currentBookToCreate.pages = [];
        if (currentBookToCreate.pages.length === 0) currentBookToCreate.pages.push({content: '', coverImageUrl: ''});

        bookTitleInput.value = currentBookToCreate.title;
        numPagesInput.value = currentBookToCreate.pages.length;
        numPagesInput.disabled = true; 
        if (bookCreationModalTitle) bookCreationModalTitle.textContent = "Edit Book";
        if (bookCreationModalSaveButton) bookCreationModalSaveButton.textContent = "Save Changes";

    } else {
        currentBookToCreate = { title: '', pages: [{content: '', coverImageUrl: ''}] }; 
        bookTitleInput.value = ''; 
        numPagesInput.value = '1'; 
        numPagesInput.disabled = false;
        if (bookCreationModalTitle) bookCreationModalTitle.textContent = "Create New Book";
        if (bookCreationModalSaveButton) bookCreationModalSaveButton.textContent = "Save Book";
    }
    
    bookCreationModal.classList.remove('hidden');
    bookCreationModal.classList.add('flex');
    modalStep1.classList.remove('hidden');
    modalStep2.classList.add('hidden');
    if(coverImageUrlInput) coverImageUrlInput.value = (editingBookId && currentBookToCreate.pages[0]) ? (currentBookToCreate.pages[0].coverImageUrl || '') : '';
    if(coverImageInputContainer) coverImageInputContainer.classList.add('hidden');
}

function hideBookCreationModal() {
    bookCreationModal.classList.add('hidden');
    bookCreationModal.classList.remove('flex');
    editingBookId = null; 
    numPagesInput.disabled = false; 
    if (bookCreationModalTitle) bookCreationModalTitle.textContent = "Create New Book";
    if (bookCreationModalSaveButton) bookCreationModalSaveButton.textContent = "Save Book";
}

function handleModalNextStep() {
    const title = bookTitleInput.value.trim();
    const numPages = editingBookId ? currentBookToCreate.pages.length : parseInt(numPagesInput.value);

    if (!title) {
        alert("Please enter a book title.");
        return;
    }
    if (!editingBookId && (isNaN(numPages) || numPages < 1)) {
        alert("Please enter a valid number of pages (at least 1).");
        return;
    }

    currentBookToCreate.title = title;
    if (!editingBookId) {
        currentBookToCreate.pages = Array(numPages).fill(null).map((_, i) => ({ 
            content: '', 
            ...(i === 0 && { coverImageUrl: currentBookToCreate.pages[0]?.coverImageUrl || '' }) 
        }));
    }
    
    modalStep1.classList.add('hidden');
    modalStep2.classList.remove('hidden');
    currentPageEditorIndex = 0;
    renderPageContentInputs();
}

function renderPageContentInputs() {
    pageContentInputsContainer.innerHTML = ''; 
    const numPagesTotal = currentBookToCreate.pages.length;

    if (currentPageEditorIndex >= numPagesTotal) currentPageEditorIndex = numPagesTotal - 1;
    if (currentPageEditorIndex < 0) currentPageEditorIndex = 0;

    if (!currentBookToCreate.pages[currentPageEditorIndex]) {
        currentBookToCreate.pages[currentPageEditorIndex] = { content: '', ...(currentPageEditorIndex === 0 && { coverImageUrl: '' }) };
    }

    const pageData = currentBookToCreate.pages[currentPageEditorIndex];
    const pageLabel = currentPageEditorIndex === 0 ? `Page ${currentPageEditorIndex + 1} (Cover)` : `Page ${currentPageEditorIndex + 1}`;
    currentPageEditorLabel.textContent = `Editing ${pageLabel}`;
    pageEditorIndicator.textContent = `Page ${currentPageEditorIndex + 1} of ${numPagesTotal}`;

    if (currentPageEditorIndex === 0) {
        if (coverImageInputContainer && coverImageUrlInput) {
            pageContentInputsContainer.appendChild(coverImageInputContainer);
            coverImageInputContainer.classList.remove('hidden');
            coverImageUrlInput.value = pageData.coverImageUrl || '';
            coverImageUrlInput.oninput = (e) => { 
                 if (currentBookToCreate.pages[0]) { 
                    currentBookToCreate.pages[0].coverImageUrl = e.target.value.trim();
                }
            };
        }
    } else {
        if (coverImageInputContainer && coverImageInputContainer.parentElement === pageContentInputsContainer) {
             coverImageInputContainer.classList.add('hidden');
        }
    }

    const textarea = document.createElement('textarea');
    textarea.id = `page-content-${currentPageEditorIndex}`;
    textarea.rows = currentPageEditorIndex === 0 ? 6 : 10; 
    textarea.classList.add('w-full', 'p-3', 'border', 'rounded-lg', 'shadow-sm', 'focus:ring-2', 'focus:border-accent', 'resize-none', 'mt-2', 'input-border', 'bg-input', 'text-input-text'); // Added theme classes
    textarea.placeholder = `Enter content for ${pageLabel}...\nUse Markdown: **bold**, *italic*.\nOr HTML: <b>b</b>, <i>i</i>, <u>u</u>, <span style="font-size: PX; color: #HEX;">text</span>.`;
    textarea.value = pageData.content;
    textarea.addEventListener('input', (e) => {
        currentBookToCreate.pages[currentPageEditorIndex].content = e.target.value;
    });
    pageContentInputsContainer.appendChild(textarea); 
    textarea.focus();

    prevPageEditorBtn.disabled = currentPageEditorIndex === 0;
    nextPageEditorBtn.disabled = currentPageEditorIndex === numPagesTotal - 1;
}

function changeEditorPage(direction) {
    const numPages = currentBookToCreate.pages.length;
    const currentTextarea = document.getElementById(`page-content-${currentPageEditorIndex}`);
    if (currentTextarea && currentBookToCreate.pages[currentPageEditorIndex]) {
        currentBookToCreate.pages[currentPageEditorIndex].content = currentTextarea.value;
    }
    if (currentPageEditorIndex === 0 && coverImageUrlInput && currentBookToCreate.pages[0]) {
        currentBookToCreate.pages[0].coverImageUrl = coverImageUrlInput.value.trim();
    }

    currentPageEditorIndex += direction;
    if (currentPageEditorIndex < 0) currentPageEditorIndex = 0;
    if (currentPageEditorIndex >= numPages) currentPageEditorIndex = numPages - 1;
    renderPageContentInputs();
}

function handleModalBackToStep1() {
    const currentTextarea = document.getElementById(`page-content-${currentPageEditorIndex}`);
    if (currentTextarea && currentBookToCreate.pages[currentPageEditorIndex]) {
        currentBookToCreate.pages[currentPageEditorIndex].content = currentTextarea.value;
    }
    if (currentPageEditorIndex === 0 && coverImageUrlInput && currentBookToCreate.pages[0]) {
        currentBookToCreate.pages[0].coverImageUrl = coverImageUrlInput.value.trim();
    }
    modalStep1.classList.remove('hidden');
    modalStep2.classList.add('hidden');
}

function handleSaveBook() {
    const currentTextarea = document.getElementById(`page-content-${currentPageEditorIndex}`);
    if (currentTextarea && currentBookToCreate.pages[currentPageEditorIndex]) {
         currentBookToCreate.pages[currentPageEditorIndex].content = currentTextarea.value;
    }
    if (currentPageEditorIndex === 0 && coverImageUrlInput && currentBookToCreate.pages[0]) {
        currentBookToCreate.pages[0].coverImageUrl = coverImageUrlInput.value.trim();
    }

    if (!currentBookToCreate.pages[0] || !currentBookToCreate.pages[0].content.trim()) {
        if (!(currentBookToCreate.pages[0].coverImageUrl && currentBookToCreate.pages[0].coverImageUrl.trim() !== '')) {
            alert("Please add some content to the cover page (Page 1), or provide a cover image URL.");
            if (currentPageEditorIndex !== 0) {
                currentPageEditorIndex = 0;
                renderPageContentInputs();
            }
            return;
        }
    }

    if (editingBookId) { 
        const bookIndex = books.findIndex(b => b.id === editingBookId);
        if (bookIndex !== -1) {
            books[bookIndex] = { 
                ...books[bookIndex], 
                title: currentBookToCreate.title,
                pages: JSON.parse(JSON.stringify(currentBookToCreate.pages)) 
            };
        }
    } else { 
        const newBook = {
            id: 'book-' + Date.now(),
            title: currentBookToCreate.title,
            pages: JSON.parse(JSON.stringify(currentBookToCreate.pages)),
            coverColor: getRandomColor() 
        };
        books.push(newBook);
    }
    
    saveState();
    renderBooksGrid();
    hideBookCreationModal(); 
}


// --- Book Action Handlers ---
function handleStartEditBook(bookId) {
    showBookCreationModal(bookId); 
}

function handleDeleteBook(bookId) {
    const bookToDelete = books.find(b => b.id === bookId);
    if (!bookToDelete) return;

    if (confirm(`Are you sure you want to delete the book "${bookToDelete.title}"? This action cannot be undone.`)) {
        books = books.filter(b => b.id !== bookId);
        saveState();
        renderBooksGrid();
    }
}

// --- Book Reader Logic ---
function openBook(book, coverElement) {
    currentOpenBook = book;
    currentOpenBookPageIndex = 0; 

    const rect = coverElement.getBoundingClientRect();
    const clone = coverElement.cloneNode(true); 
    const cloneActions = clone.querySelector('.absolute.top-2.right-2');
    if (cloneActions) cloneActions.remove();

    clone.classList.add('book-transition-clone');
    clone.style.width = `${rect.width}px`;
    clone.style.height = `${rect.height}px`;
    clone.style.top = `${rect.top}px`;
    clone.style.left = `${rect.left}px`;
    
    clone.style.backgroundImage = coverElement.style.backgroundImage;
    clone.style.backgroundColor = coverElement.style.backgroundColor; // This will be the theme's card bg
    clone.style.backgroundSize = 'cover';
    clone.style.backgroundPosition = 'center';

    document.body.appendChild(clone);

    if (landingPage) landingPage.style.opacity = '0'; 
    if (addBookBtn) addBookBtn.style.display = 'none'; 

    setTimeout(() => {
        const targetWidth = Math.min(window.innerWidth * 0.9, 1200);
        const targetHeight = 700; 
        clone.style.width = `${targetWidth}px`;
        clone.style.height = `${targetHeight}px`;
        clone.style.top = `${(window.innerHeight - targetHeight) / 2}px`;
        clone.style.left = `${(window.innerWidth - targetWidth) / 2}px`;
        clone.style.transform = 'rotateY(-15deg) scale(1.05)'; 
    }, 50); 

    setTimeout(() => {
        if (document.body.contains(clone)) {
            document.body.removeChild(clone);
        }
        bookReaderContainer.classList.remove('hidden');
        bookReaderContainer.classList.add('flex');
        bookReader.classList.remove('hidden');
        bookReader.style.opacity = '1';
        renderCurrentPages();
        if (landingPage) landingPage.classList.add('hidden'); 
    }, 750); 
}

function closeBook() {
    if (bookReader) bookReader.style.opacity = '0'; 
    
    setTimeout(() => {
        if (bookReaderContainer) {
            bookReaderContainer.classList.add('hidden');
            bookReaderContainer.classList.remove('flex');
        }
        if (bookReader) bookReader.classList.add('hidden');
        
        if (landingPage) {
            landingPage.classList.remove('hidden');
            landingPage.style.opacity = '1'; 
        }
        if (addBookBtn) addBookBtn.style.display = 'flex'; 
        currentOpenBook = null;
    }, 500); 
}

function renderCurrentPages() {
    if (!currentOpenBook || !leftPage || !rightPage) return;

    const pages = currentOpenBook.pages;
    const numPagesTotal = pages.length;

    leftPageElement.style.backgroundImage = '';
    leftPageElement.style.backgroundSize = '';
    leftPageElement.style.backgroundPosition = '';
    rightPageElement.style.backgroundImage = '';
    rightPageElement.style.backgroundSize = '';
    rightPageElement.style.backgroundPosition = '';
    leftPage.classList.remove('cover-text-on-image-container'); 
    rightPage.classList.remove('cover-text-on-image-container');
    // Ensure page specific theme classes are applied
    leftPageElement.classList.add('page-bg', 'page-text');
    rightPageElement.classList.add('page-bg', 'page-text');


    if (currentOpenBookPageIndex === 0) { 
        leftPage.innerHTML = '<div class="p-4 text-center italic">This is the inside of your book cover.</div>'; 
        // No need to add bg-gray-100, theme handles page bg
    } else if (currentOpenBookPageIndex < numPagesTotal) {
        leftPage.innerHTML = convertMarkdownToHTML(pages[currentOpenBookPageIndex].content);
    } else {
        leftPage.innerHTML = ''; 
    }
    leftPage.scrollTop = 0; 

    const rightPageIndex = currentOpenBookPageIndex === 0 ? 0 : currentOpenBookPageIndex + 1;
    if (rightPageIndex < numPagesTotal) {
        const pageData = pages[rightPageIndex];
        
        if (rightPageIndex === 0 && pageData.coverImageUrl) { 
            rightPageElement.style.backgroundImage = `url('${CSS.escape(pageData.coverImageUrl)}')`;
            rightPageElement.style.backgroundSize = 'cover';
            rightPageElement.style.backgroundPosition = 'center';
            rightPage.classList.add('cover-text-on-image-container');
            rightPage.innerHTML = convertMarkdownToHTML(pageData.content); 
        } else {
            rightPage.innerHTML = convertMarkdownToHTML(pageData.content);
        }
    } else {
        rightPage.innerHTML = '<div class="p-4 text-center italic">End of Book</div>';
    }
    rightPage.scrollTop = 0; 

    if (turnPrevBtn) turnPrevBtn.style.display = currentOpenBookPageIndex > 0 ? 'block' : 'none';
    if (turnNextBtn) {
        turnNextBtn.style.display = (currentOpenBookPageIndex + 2) < numPagesTotal ? 'block' : 'none';
        if (currentOpenBookPageIndex === 0 && numPagesTotal === 1) { 
             turnNextBtn.style.display = 'none';
        }
    }
}

function convertMarkdownToHTML(mdText) {
    if (typeof mdText !== 'string') return '';
    let html = mdText;
    html = html.replace(/\*\*(.*?)\*\*|__(.*?)__/g, '<strong>$1$2</strong>');
    html = html.replace(/\*(.*?)\*|_(.*?)_/g, '<em>$1$2</em>');
    
    if (!html.match(/<\s*p\s*>/i)) {
        html = html.split(/\n\s*\n/).map(paragraph => {
            if (paragraph.trim() !== '') {
                return '<p>' + paragraph.replace(/\n/g, '<br>') + '</p>';
            }
            return '';
        }).join('');
    } else {
        html = html.replace(/(?<!<p>|<\/p>|<br>|<br\/>)\n(?!\s*<p>)/g, '<br>');
    }
    return html;
}

function turnPage(amount) {
    if (!currentOpenBook) return;
    
    const numPagesTotal = currentOpenBook.pages.length;
    let newPageIndex = currentOpenBookPageIndex + amount;

    if (newPageIndex < 0) newPageIndex = 0; 
    
    if (newPageIndex >= numPagesTotal) {
         if (currentOpenBookPageIndex >= numPagesTotal - (numPagesTotal % 2 === 0 ? 0 : 1) ) { 
            return;
         }
         newPageIndex = numPagesTotal - (numPagesTotal % 2 === 0 ? 2 : 1); 
         if (newPageIndex < 0) newPageIndex = 0; 
    }

    const pageToAnimate = amount > 0 ? (rightPageElement) : (leftPageElement);
    if (pageToAnimate) {
        pageToAnimate.classList.add('flipping');
        if (amount > 0) {
            pageToAnimate.style.transform = 'rotateY(-180deg)';
        } else {
             pageToAnimate.style.transform = 'rotateY(180deg)';
        }
    }

    currentOpenBookPageIndex = newPageIndex;

    setTimeout(() => {
        renderCurrentPages();
        if (pageToAnimate) {
            pageToAnimate.style.transform = 'rotateY(0deg)'; 
             setTimeout(() => pageToAnimate.classList.remove('flipping'), 0); 
        }
    }, 400); 
}
